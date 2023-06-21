//go:build mage

package main

import (
	// "github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
)

func Bootstrap() error {
	return RunSync([][]string{
		{"go", "get", "github.com/wailsapp/wails/v2/cmd/wails"},
		{"go", "get", "github.com/magefile/mage"},
		{"go", "get", "gotest.tools/gotestsum"},
		{"go", "generate", "-tags", "tools", "tools/tools.go"},
		{"go", "mod", "download"},
	})
}

func Test() error {
	// Runs both Go, and frontend tests
	return RunSync([][]string{
		{"gotestsum", "--format", "pkgname", "--", "--cover", "./..."},
		{"yarn", "--cwd", "frontend", "test"},
	})
}

func Dev() error {
	return sh.Run("wails", "dev")
}

func Build() error {
	return sh.Run(
		"wails",
		"build",
		"-platform",
		"windows/amd64,darwin/universal,linux/amd64",
		"-ldflags",
		"-s -w",
		// "-nsis", // Builds a Windows installer
		// "-upx" // Binary compression
	)

	// @TODO: Zip the binary for release?
}
