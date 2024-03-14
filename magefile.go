//go:build mage

package main

import (
	// "github.com/magefile/mage/mg"

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
	return sh.Run("wails", "dev")
}

// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

// Runs both Go, and frontend tests
func (Test) All() error {
	return RunSync([][]string{
		{"gotestsum", "--format", "pkgname", "--", "--cover", "./..."},
		{"yarn", "--cwd", "frontend", "test:coverage"},
	})
}

// Runs Go tests
func (Test) Go() error {
	return RunSync([][]string{
		{"gotestsum", "--format", "pkgname", "--", "--cover", "./..."},
	})
}

// Runs frontend tests
func (Test) Frontend() error {
	return RunSync([][]string{
		{"yarn", "--cwd", "frontend", "test:coverage"},
	})
}

// ----------------------------------------------------------------------------
// Build
// ----------------------------------------------------------------------------

// Create a debug development build (expect the output filesize to be much bigger)
func (Build) Debug() error {
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

// @TODO: Prep for release (zip, rename, etc...)
// func (Release) Prepare() error {
// 	return RunSync([][]string{
// 		{"mage", "-v", "ftp"},
// 	})
// }

// Upload release binaries to FTP server
func (Release) FTP() error {
	releaseVersion := os.Getenv("RELEASE_VERSION")
	ftpHost := os.Getenv("FTP_HOST")
	ftpUsername := os.Getenv("FTP_USERNAME")
	ftpPassword := os.Getenv("FTP_PASSWORD")
	ftpPath := os.Getenv("FTP_PATH")
	localPath := os.Getenv("LOCAL_PATH")
	ftpReleasePath := path.Join(ftpPath, releaseVersion)

	fmt.Println("(Release) => FTP upload path: " + ftpReleasePath)

	if ftpHost == "" || ftpUsername == "" || ftpPassword == "" || ftpPath == "" || localPath == "" {
		return fmt.Errorf("(Release) => required FTP environment variables not set")
	}

	// (FTP) Connect

	config := &ssh.ClientConfig{
		User: ftpUsername,
		Auth: []ssh.AuthMethod{
			ssh.Password(ftpPassword),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	conn, err := ssh.Dial("tcp", fmt.Sprintf("%s:%s", ftpHost, "22"), config)
	if err != nil {
		return fmt.Errorf("(Release) => failed to connect to SFTP server: %v", err)
	}
	defer conn.Close()

	client, err := sftp.NewClient(conn)
	if err != nil {
		return fmt.Errorf("(Release) => failed to create SFTP client: %v", err)
	}
	defer client.Close()

	// (FTP) Create release directory

	err = client.Mkdir(ftpReleasePath)
	if err != nil && !os.IsExist(err) {
		// If the directory already exists, ignore the error
		return fmt.Errorf("(Release) => failed to create directory on SFTP server: %v", err)
	}

	// (Local) Open local path

	localDir, err := os.Open(localPath)
	if err != nil {
		return fmt.Errorf("(Release) => failed to open local directory: %v", err)
	}
	defer localDir.Close()

	files, err := localDir.Readdir(-1)
	if err != nil {
		return fmt.Errorf("(Release) => failed to read local directory: %v", err)
	}

	// (Local -> FTP) Upload files

	for _, file := range files {
		if !file.IsDir() {
			localFilePath := path.Join(localPath, file.Name())
			remoteFilePath := path.Join(ftpReleasePath, file.Name())

			localFile, err := os.Open(localFilePath)
			if err != nil {
				return fmt.Errorf("failed to open local file: %v", err)
			}
			defer localFile.Close()

			remoteFile, err := client.Create(remoteFilePath)
			if err != nil {
				return fmt.Errorf("failed to create remote file: %v", err)
			}
			defer remoteFile.Close()

			_, err = remoteFile.ReadFrom(localFile)
			if err != nil {
				return fmt.Errorf("failed to upload file to SFTP server: %v", err)
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
	// Install required linux packages
	if runtime.GOOS == "linux" {
		if ExecExists("apt") {
			fmt.Println("(Bootstrap) => Installing required linux packages")
			err := RunSync([][]string{
				{"sudo", "apt", "update", "-y"},
				{"sudo", "apt", "install", "-y", "libgtk-3-dev", "libwebkit2gtk-4.0-dev", "gcc", "g++", "upx"},
			})

			if err != nil {
				return err
			}
		}
	}

	// Install required macOS packages
	if runtime.GOOS == "darwin" {
		// Install Homebrew
		if !ExecExists("brew") {
			fmt.Println("(Bootstrap) => Installing Homebrew")
			if err := sh.Run("/bin/bash", "-c", `"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`); err != nil {
				return err
			}
		}

		// Install xcode cli tools
		if ExecExists("xcode-select") {
			if err := sh.Run("xcode-select", "-p"); err != nil {
				fmt.Println("(Bootstrap) => Installing xcode cli tools")
				if err := sh.Run("xcode-select", "--install"); err != nil {
					return err
				}
			}
		}

		fmt.Println("(Bootstrap) => Installing required macOS packages")
		err := RunSync([][]string{
			{"brew", "install", "upx"},
		})

		if err != nil {
			return err
		}
	}

	// Install mage bootstrap (the recommended, as seen in https://magefile.org)
	if !ExecExists("mage") && ExecExists("git") {
		fmt.Println("(Bootstrap) => Installing mage")
		tmpDir := "__tmp_mage"

		if err := sh.Run("git", "clone", "https://github.com/magefile/mage", tmpDir); err != nil {
			fmt.Println("(Bootstrap) => ERROR: installing mage", err)
			return err
		}

		if err := os.Chdir(tmpDir); err != nil {
			fmt.Println("(Bootstrap) => ERROR: installing mage", err)
			return err
		}

		if err := sh.Run("go", "run", "bootstrap.go"); err != nil {
			fmt.Println("(Bootstrap) => ERROR: installing mage", err)
			return err
		}

		if err := os.Chdir("../"); err != nil {
			fmt.Println("(Bootstrap) => ERROR: installing mage", err)
			return err
		}

		os.RemoveAll(tmpDir)
	}

	// Install Go dependencies
	fmt.Println("(Bootstrap) => Installing Go dependencies")
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
	return RunSync([][]string{
		{"go", "get", "-u", "all"},
		{"go", "mod", "vendor"},
		{"go", "mod", "tidy"},
	})
}
