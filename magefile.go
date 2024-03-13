//go:build mage

package main

import (
	// "github.com/magefile/mage/mg"

	"runtime"

	"github.com/magefile/mage/sh"
)

func Bootstrap() error {
	// Install required linux packages
	if runtime.GOOS == "linux" {
		if ExecExists("apt") {
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
			if err := sh.Run("/bin/bash", "-c", `"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`); err != nil {
				return err
			}
		}

		// Install xcode cli tools
		if ExecExists("xcode-select") {
			if err := sh.Run("xcode-select", "-p"); err != nil {
				if err := sh.Run("xcode-select", "--install"); err != nil {
					return err
				}
			}
		}

		err := RunSync([][]string{
			{"brew", "install", "upx"},
		})

		if err != nil {
			return err
		}
	}

	// Install Go dependencies
	return RunSync([][]string{
		{"go", "mod", "vendor"},
		{"go", "mod", "tidy"},
		{"go", "generate", "-tags", "tools", "tools/tools.go"},
	})
}

func UpdateDeps() error {
	return RunSync([][]string{
		{"go", "get", "-u", "all"},
		{"go", "mod", "vendor"},
		{"go", "mod", "tidy"},
	})
}

func Dev() error {
	return sh.Run("wails", "dev")
}
func Start() error {
	return sh.Run("wails", "dev")
}

func Test() error {
	// Runs Go tests
	return RunSync([][]string{
		{"gotestsum", "--format", "pkgname", "--", "--cover", "./..."},
	})
}
func TestAll() error {
	// Runs both Go, and frontend tests
	return RunSync([][]string{
		{"gotestsum", "--format", "pkgname", "--", "--cover", "./..."},
		{"yarn", "--cwd", "frontend", "test:coverage"},
	})
}

func BuildDev() error {
	return sh.Run(
		"wails",
		"build",
		"-trimpath",
		"-race",
		"-debug",
	)
}
func Build() error {
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
