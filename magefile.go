//go:build mage

package main

import (
	"fmt"
	"os"
	"path"
	"runtime"

	"github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
)

type Build mg.Namespace
type Release mg.Namespace
type Test mg.Namespace

var Aliases = map[string]interface{}{
	"start": Dev,
	"build": Build.Release,
	"test":  Test.All,
}

// ----------------------------------------------------------------------------
// Local development
// ----------------------------------------------------------------------------

// Start development server (opens app window with live reload)
func Dev() error {
	log := NewLogger()
	defer log.End()
	return sh.Run("wails", "dev")
}

// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

// Runs both Go, and frontend tests
func (Test) All() error {
	log := NewLogger()
	defer log.End()
	return RunSync([][]string{
		{"gotestsum", "--format", "pkgname", "--", "--cover", "./..."},
		{"yarn", "--cwd", "frontend", "test:coverage"},
	})
}

// Runs Go tests
func (Test) Go() error {
	log := NewLogger()
	defer log.End()
	return RunSync([][]string{
		{"gotestsum", "--format", "pkgname", "--", "--cover", "./..."},
	})
}

// Runs frontend tests
func (Test) Frontend() error {
	log := NewLogger()
	defer log.End()
	return RunSync([][]string{
		{"yarn", "--cwd", "frontend", "test:coverage"},
	})
}

// ----------------------------------------------------------------------------
// Build
// ----------------------------------------------------------------------------

// Create a debug development build (expect the output filesize to be much bigger)
func (Build) Debug() error {
	log := NewLogger()
	defer log.End()
	log.Info("compiling debug binary")
	return sh.Run(
		"wails",
		"build",
		"-trimpath",
		"-race",
		"-debug",
	)
}

// Create a release build
func (Build) Release() error {
	log := NewLogger()
	defer log.End()
	log.Info("compiling release binary")
	return sh.Run(
		"wails",
		"build",
		"-ldflags",
		"-s -w",
		"-trimpath",
		// "-nsis", // Builds a Windows installer
		"-upx", // Binary compression
		"-upxflags", "--best",
	)
}

// ----------------------------------------------------------------------------
// Release
// ----------------------------------------------------------------------------

// Prep for release (rename & zip)
func (Release) Prepare() error {
	log := NewLogger()
	defer log.End()

	binaryFileName := os.Getenv("BINARY_FILENAME")
	releaseVersion := os.Getenv("RELEASE_VERSION")
	binPath := "build/bin"
	binaryFilePath := fmt.Sprintf("%s/%s", binPath, binaryFileName)

	if binaryFileName == "" || releaseVersion == "" {
		return log.Error("required environment variables not set")
	}

	log.Info("checking release binary")

	if _, err := os.Stat(binaryFilePath); os.IsNotExist(err) {
		return log.Error("failed to find release binary file:", binaryFilePath)
	}

	log.Info("zip for release")

	zipFileName := fmt.Sprintf("adrift-native_%s_%s_%s.zip", releaseVersion, runtime.GOOS, runtime.GOARCH)
	zipFilePath := fmt.Sprintf("%s/%s", binPath, zipFileName)

	err := ZipFiles(zipFilePath, binaryFilePath)
	if err != nil {
		return log.Error("failed to zip binary", err)
	}

	return nil
}

// Upload release binaries to FTP server
func (Release) FTP() error {
	log := NewLogger()
	defer log.End()

	ftpHost := os.Getenv("FTP_HOST")
	ftpUsername := os.Getenv("FTP_USERNAME")
	ftpPassword := os.Getenv("FTP_PASSWORD")
	ftpPath := os.Getenv("FTP_PATH")
	localPath := os.Getenv("LOCAL_PATH")
	releaseVersion := os.Getenv("RELEASE_VERSION")
	ftpReleasePath := path.Join(ftpPath, releaseVersion)

	log.Info("ftp upload path: ", ftpReleasePath)

	if ftpHost == "" || ftpUsername == "" || ftpPassword == "" || ftpPath == "" || localPath == "" || releaseVersion == "" {
		return log.Error("required FTP environment variables not set")
	}

	log.Info("connecting to ftp server")

	config := &ssh.ClientConfig{
		User: ftpUsername,
		Auth: []ssh.AuthMethod{
			ssh.Password(ftpPassword),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	conn, err := ssh.Dial("tcp", fmt.Sprintf("%s:%s", ftpHost, "22"), config)
	if err != nil {
		return log.Error("failed to connect to SFTP server:", err)
	}
	defer conn.Close()

	client, err := sftp.NewClient(conn)
	if err != nil {
		return log.Error("failed to create SFTP client:", err)
	}
	defer client.Close()

	log.Info("create remote release directory")

	err = client.Mkdir(ftpReleasePath)
	if err != nil && !os.IsExist(err) {
		// If the directory already exists, ignore the error
		return log.Error("failed to create directory on SFTP server:", err)
	}

	log.Info("reading local release files")

	localDir, err := os.Open(localPath)
	if err != nil {
		return log.Error("failed to open local directory:", err)
	}
	defer localDir.Close()

	files, err := localDir.Readdir(-1)
	if err != nil {
		return log.Error("failed to read local directory:", err)
	}

	log.Info("uploading release files to ftp server")

	for _, file := range files {
		if !file.IsDir() {
			localFilePath := path.Join(localPath, file.Name())
			remoteFilePath := path.Join(ftpReleasePath, file.Name())

			localFile, err := os.Open(localFilePath)
			if err != nil {
				return log.Error("failed to open local file:", err)
			}
			defer localFile.Close()

			remoteFile, err := client.Create(remoteFilePath)
			if err != nil {
				return log.Error("failed to create remote file:", err)
			}
			defer remoteFile.Close()

			_, err = remoteFile.ReadFrom(localFile)
			if err != nil {
				return log.Error("failed to upload file to SFTP server:", err)
			}
		}
	}

	return nil
}

// ----------------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------------

// Bootstraps required packages (installs required linux/macOS packages if needed)
func Bootstrap() error {
	log := NewLogger()
	defer log.End()

	// Install required linux packages
	if runtime.GOOS == "linux" {
		if ExecExists("apt") {
			log.Info("installing required linux packages")
			err := RunSync([][]string{
				{"sudo", "apt", "update", "-y"},
				{"sudo", "apt", "install", "-y", "libgtk-3-dev", "libwebkit2gtk-4.0-dev", "gcc", "g++", "upx", "ftp"},
			})

			if err != nil {
				return log.Error(err)
			}
		}
	}

	// Install required macOS packages
	if runtime.GOOS == "darwin" {
		// Install Homebrew
		if !ExecExists("brew") {
			log.Info("installing homebrew")
			if err := sh.Run("/bin/bash", "-c", `"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`); err != nil {
				return log.Error(err)
			}
		}

		// Install xcode cli tools
		if ExecExists("xcode-select") {
			if err := sh.Run("xcode-select", "-p"); err != nil {
				log.Info("installing xcode cli tools")
				if err := sh.Run("xcode-select", "--install"); err != nil {
					return log.Error(err)
				}
			}
		}

		log.Info("installing required macos packages")
		err := RunSync([][]string{
			{"brew", "install", "upx"},
		})

		if err != nil {
			return log.Error(err)
		}
	}

	// Install mage bootstrap (the recommended, as seen in https://magefile.org)
	if !ExecExists("mage") && ExecExists("git") {
		log.Info("installing mage")
		tmpDir := "__tmp_mage"

		if err := sh.Run("git", "clone", "https://github.com/magefile/mage", tmpDir); err != nil {
			return log.Error("error: installing mage: ", err)
		}

		if err := os.Chdir(tmpDir); err != nil {
			return log.Error("error: installing mage: ", err)
		}

		if err := sh.Run("go", "run", "bootstrap.go"); err != nil {
			return log.Error("error: installing mage: ", err)
		}

		if err := os.Chdir("../"); err != nil {
			return log.Error("error: installing mage: ", err)
		}

		os.RemoveAll(tmpDir)
	}

	// Install Go dependencies
	log.Info("installing go dependencies")
	return RunSync([][]string{
		{"go", "mod", "vendor"},
		{"go", "mod", "tidy"},
		{"go", "generate", "-tags", "tools", "tools/tools.go"},
	})
}

// ----------------------------------------------------------------------------
// Housekeeping
// ----------------------------------------------------------------------------

// Update all Go dependencies
func UpdateDeps() error {
	log := NewLogger()
	defer log.End()
	return RunSync([][]string{
		{"go", "get", "-u", "all"},
		{"go", "mod", "vendor"},
		{"go", "mod", "tidy"},
	})
}
