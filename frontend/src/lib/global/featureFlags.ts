import { type EnvKeys, env, envGet } from "./env";
import { setGlobalValue } from "./utils";

/**
 * Returns `true` if the feature is enabled in `env` object.
 *
 * `true` being any non-falsy value, plus string versions of falsy values such as `"false"`, `"null"`, ect...
 */
export const feature = (mode: FeatureFlags, options: FeatureOptions = {}): boolean => {
	const { alwaysShowOnDev } = {
		alwaysShowOnDev: true,
		...options
	};

	// Bypass feature flag in dev mode if `alwaysShowOnDev` is true
	if (alwaysShowOnDev && (env.isDevelopment || env.isTesting)) {
		return true;
	}

	// Feature is truthy in featureFlags{}
	if (envGet(mode) && !isFalse(envGet(mode))) {
		return true;
	}

	return false;
};

export type FeatureOptions = {
	alwaysShowOnDev?: boolean;
};

export type FeatureFlags = EnvKeys;

export const injectFeature = () => {
	setGlobalValue("feature", feature);
};

const isFalse = (value: unknown): value is false => {
	return (
		!value ||
		value === "0" ||
		value === "off" ||
		value === "null" ||
		value === "false" ||
		value === "undefined"
	);
};
