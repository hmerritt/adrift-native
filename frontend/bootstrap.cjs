#!/usr/bin/env node
const core = require("./scripts/bootstrap/core.cjs");
const { adriftVersion, isAdriftUpdateAvailable } = require("./scripts/bootstrap/version.cjs");
const packageJSON = require("./package.json");

const pathRoot = __dirname;
const args = process.argv.slice(2);

// Run bootrap
bootstrap();

// Bootstrap runs code before react start/build.
// Run anything you like, here we get the app version from the package.json + the current commit hash.
// prettier-ignore
async function bootstrap() {
	const gitCommitHash = await core.run(`git rev-parse HEAD`, pathRoot, '');
	const gitCommitHashShort = gitCommitHash ? core.shorten(gitCommitHash) : '';
	const gitBranch = await core.getGitBranch(pathRoot);
	const appVersion = packageJSON?.version;
	const appName = packageJSON?.name;

	// Checks GitHub for any adrift updates.
	const checkForAdriftUpdate = true;

	// When true, the env array below can be overridden by whatever is in the environment at runtime.
	const allowEnvOverride = true;

	// Set ENV array to inject, key/value
	const env = [
		["NODE_ENV", core.getNodeEnv(args)],
		["GENERATE_SOURCEMAP", core.getNodeEnv(args) === "development"],
		["VITE_ADRIFT_VERSION", adriftVersion],
		["VITE_NAME", appName],
		["VITE_VERSION", appVersion],
		["VITE_GIT_BRANCH", gitBranch],
		["VITE_GIT_COMMIT", gitCommitHashShort],
		// ['VITE_PLAUSIBLE_ENABLE', true],
		// ['VITE_PLAUSIBLE_DOMAIN', 'PLAUSIBLE_DOMAIN'],
		// ['VITE_PLAUSIBLE_API_HOST', 'https://plausible.io']
	];

	// Log app name and version info
	console.log(core.versionString(appName, appVersion, gitBranch, gitCommitHashShort), "\n");

	const update = await isAdriftUpdateAvailable();
	if (checkForAdriftUpdate && update) {
		console.log(`\x1b[33m`, `-> adrift update available! (${adriftVersion} - ${update})`, `\x1b[0m`, '\n');
	}

	// Run bootstrap script
	core.bootstrap(env, allowEnvOverride, args, pathRoot);
}
