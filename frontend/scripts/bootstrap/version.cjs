// @ts-nocheck

/**
 * Internal adrift version.
 */
const adriftVersion = "0.11.462";

/**
 * Bumps the adrift `patch` version number using the total commit count.
 * 
 * Directly changes the above variable `adriftVersion` (by overwriting this file).
 */
async function bumpAdriftPatchVersion() {
	try {
		const fs = require('fs');
		const path = require('path');
		const core = require("./core.cjs");
		const pathRoot = path.dirname(path.dirname(__dirname));

		// Get the total commit count
		const commitCount = (await core.run(`git rev-list --count HEAD`, pathRoot, '')).trim();

		// Read the contents of version.cjs
		const versionFile = path.join(__dirname, 'version.cjs');
		const versionFileContent = fs.readFileSync(versionFile, 'utf8');

		// Extract the version number parts
		const versionMatch = versionFileContent.match(/(const adriftVersion = ")(\d+\.\d+\.)(\d+)(")/);
		const majorMinor = versionMatch?.[2];
		const newVersion = `${majorMinor}${commitCount}`;

		if (!majorMinor) {
			throw new Error('No version number found in version.cjs');
		}

		// Replace the version patch with the commit count
		const updatedContent = versionFileContent.replace(/(const adriftVersion = ")(\d+\.\d+\.)\d+(")/g, `$1${newVersion}$3`);

		// Write the updated content back to version.cjs
		fs.writeFileSync(versionFile, updatedContent, 'utf8');

		console.log(`\x1b[36madrift@${newVersion}\x1b[0m`);
	} catch (error) {
		console.error("\x1b[31mError bumping adrift patch version:", error, `\x1b[0m`);
	}
}

/**
 * Checks with latest GitHub release to see if there is an update.
 * 
 * @returns latest version number
 */
async function isAdriftUpdateAvailable() {
	try {
		const url = 'https://raw.githubusercontent.com/hmerritt/adrift/master/scripts/bootstrap/version.cjs';
		const rawGithubText = await (await fetch(url)).text();

		const versionRegex = /adriftVersion\s*=\s*"([^"]+)"/;
		const match = rawGithubText.match(versionRegex)[1].trim();

		if (!match || !match.match(/\d+\.\d+\.\d+/gi)) {
			throw new Error("No version found");
		}

		// Compare versions
		const current = adriftVersion.split(".").map(x => Number(x));
		const latest = match.split(".").map(x => Number(x));
		let comparison = 0;
		for (let i = 0; i < Math.max(current.length, latest.length); i++) {
			if ((current[i] || 0) < (latest[i] || 0)) {
				comparison = -1;
			} else if ((current[i] || 0) > (latest[i] || 0)) {
				comparison = 1;
			}
		}

		if (comparison === -1) {
			return match;
		}
	} catch (error) { }

	return false;
}

module.exports = { adriftVersion, bumpAdriftPatchVersion, isAdriftUpdateAvailable };
