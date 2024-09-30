/**
 * JS to execute before ANY react code or component is rendered.
 *
 * Used to setup global functions and variables to be used throughout the app.
 *
 * @Warning - Do NOT import from any file in global from outside global. You can however import into global.
 * ✓ global <-- utils
 * ✗ global --> utils
 * ✗ import "globalInit" from "global";
 *
 * @Warning - Since the window object is exposed, don't put anything remotely sensitive in here.
 */
import { injectDevTools } from "./devTools";
import { injectEnv } from "./env";
import { injectFeature } from "./featureFlags";
import { injectLog } from "./log";
import { injectSafeAwait } from "./utils";
import { versionString } from "./version";

export const globalInit = () => {
	// Inject global functions.
	injectSafeAwait();
	injectEnv();
	injectLog();
	injectFeature();

	// Log app name+version. Hide for tests to reduce clutter in console.
	if (!env.isTesting) {
		console.log(`%c${versionString()}`, "font-size: 1.1em;padding: 1rem 0;");
	}

	if (env.isDevelopment) {
		injectDevTools();
		console.log("env", env);
	}
};

globalInit();
export default globalInit;
