//go:build mage
// +build mage

package main

import (
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/magefile/mage/sh"
)

const (
	MODULE_NAME = "changeme" // go.mod module name
)

//
// Runtime helpers
//

// Runs multiple cmd commands one-by-one
func RunSync(commands [][]string) error {
	for _, cmd := range commands {
		if len(cmd) == 0 {
			continue
		}

		if err := sh.Run(cmd[0], cmd[1:]...); err != nil {
			return err
		}
	}

	return nil
}

// Runs multiple commands in parallel
func RunParallel(commands [][]string) error {
	var wg sync.WaitGroup
	var errCatch error = nil

	// Launch a goroutine for each command.
	for _, cmd := range commands {
		if len(cmd) == 0 {
			continue
		}

		wg.Add(1)

		go func(cmd []string) {
			defer wg.Done()
			if err := sh.Run(cmd[0], cmd[1:]...); err != nil {
				errCatch = err
			}
		}(cmd)
	}

	// Wait for all the goroutines to finish.
	wg.Wait()

	// If any of the commands failed, return the first error.
	if errCatch != nil {
		return errCatch
	}

	return nil
}

func BuildLdFlagValue(packageName, name, value string) string {
	return fmt.Sprintf("-X %s/%s.%s=%s", MODULE_NAME, packageName, name, value)
}

func LdFlagString() string {
	return fmt.Sprintf(
		"-s -w %s %s %s",
		BuildLdFlagValue("version", "GitCommit", GitHash()),
		BuildLdFlagValue("version", "GitBranch", GitBranch()),
		BuildLdFlagValue("version", "BuildDate", time.Now().Format("2006-01-02+15:04:05")),
	)
}

// Returns the short hash of the current Git commit.
func GitHash() string {
	gitHash, _ := sh.Output("git", "rev-parse", "--short", "HEAD")
	return gitHash
}

// Returns the current Git branch name.
//
// Patches inconsistencies with common CI environments.
func GitBranch() string {
	gitBranch, _ := sh.Output("git", "rev-parse", "--abbrev-ref", "HEAD")

	// Detect CircleCI
	if len(os.Getenv("CIRCLE_BRANCH")) > 0 {
		gitBranch = os.Getenv("CIRCLE_BRANCH")
	}

	// Detect GitHub Actions CI
	if len(os.Getenv("GITHUB_REF_NAME")) > 0 && os.Getenv("GITHUB_REF_TYPE") == "branch" {
		gitBranch = os.Getenv("GITHUB_REF_NAME")
	}

	// Detect GitLab CI
	if len(os.Getenv("CI_COMMIT_BRANCH")) > 0 {
		gitBranch = os.Getenv("CI_COMMIT_BRANCH")
	}

	// Detect Netlify CI + generic
	if len(os.Getenv("BRANCH")) > 0 {
		gitBranch = os.Getenv("BRANCH")
	}

	// Detect HEAD state, and remove it.
	if gitBranch == "HEAD" {
		gitBranch = ""
	}

	return gitBranch
}
