import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

const port = process.env.PORT || "4173";
const host = process.env.HOST || "localhost";
const baseURL = `http://${host}:${port}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests-e2e",
	fullyParallel: true,
	forbidOnly: !!isCI,
	retries: isCI ? 2 : 0,

	expect: {
		timeout: 10_000
	},

	/* Opt out of parallel tests on CI. */
	workers: isCI ? 1 : undefined,

	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	/* html | list */
	reporter: [["list"], ["html", { open: "never" }]],

	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		baseURL: baseURL,
		trace: "on-first-retry"
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] }
		},

		/* Test against mobile viewports. */
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 6"] }
		}
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: `yarn preview`,
		url: baseURL,
		reuseExistingServer: !isCI
	}
});
