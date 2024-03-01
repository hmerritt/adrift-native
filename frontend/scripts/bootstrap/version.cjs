// @ts-nocheck

/**
 * Internal adrift version.
 */
const adriftVersion = "0.10.443";

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

module.exports = { adriftVersion, isAdriftUpdateAvailable };
