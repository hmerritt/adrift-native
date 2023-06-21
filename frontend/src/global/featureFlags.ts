import { $global } from "./utils";

/**
 * Feature flags
 */
export const featureFlags = {
	timerIncrement: import.meta.env.VITE_FEATURE_INCREMENT,
	someOtherFeature: false
};

/**
 * Returns `true` if the feature is enabled in `featureFlags` object.
 */
export const feature = (
	mode: FeatureFlags,
	options: FeatureOptions = {}
): boolean => {
	const { alwaysShowOnDev } = {
		alwaysShowOnDev: true,
		...options
	};

	// Bypass feature flag in dev mode if `alwaysShowOnDev` is true
	if (
		alwaysShowOnDev &&
		(import.meta.env.MODE === "development" ||
			import.meta.env.MODE === "test")
	) {
		return true;
	}

	let match = false;

	// Feature is truthy in featureFlags{},
	// OR matches the current development environment (env.MODE)
	if (
		(featureFlags[mode] && !isFalse(featureFlags[mode])) ||
		mode === import.meta.env.MODE
	) {
		match = true;
	}

	return match;
};

export type FeatureOptions = {
	alwaysShowOnDev?: boolean;
};

export type FeatureFlags =
	| keyof typeof featureFlags
	| "development"
	| "testing"
	| "production";

export const injectFeature = () => {
	$global.feature = feature;
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
