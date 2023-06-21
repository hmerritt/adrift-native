//go:build mage

package main

import (
	// "github.com/magefile/mage/mg"
	"github.com/magefile/mage/sh"
)

func Bootstrap() error {
	return RunSync([][]string{
		{"go", "get", "github.com/magefile/mage"},
		{"go", "get", "gotest.tools/gotestsum"},
		{"go", "generate", "-tags", "tools", "tools/tools.go"},
		{"go", "mod", "download"},
	})
}

func Test() error {
	return sh.Run("gotestsum", "--format", "pkgname", "--", "--cover", "./...")
}

func Bench() error {
	return sh.Run("go", "test", "--cover", "-bench", ".", "-benchmem", "./...")
}

func Dev() error {
	return sh.Run("wails", "dev")
}

func Buildq() error {
	return sh.Run("wails", "build", "-ldflags", "-s -w")
}

func Build() error {
	return sh.Run(
		"wails",
		"build",
		"-platform",
		"windows/amd64,darwin/universal,linux/amd64",
		"-ldflags",
		LdFlagString(),
	)
}
