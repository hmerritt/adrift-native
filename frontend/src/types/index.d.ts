import type { FeatureFlags, FeatureOptions } from "global/featureFlags";
import type { LogStoreType } from "global/log";

export {};

type LogFunction = (logLevel: any, ...args: any[]) => void;
type FeatureFunction = (
	mode: FeatureFlags,
	options?: FeatureOptions
) => boolean;

declare global {
	var log: LogFunction;
	var debug: LogFunction;
	var logStore: LogStoreType;
	var feature: FeatureFunction;

	interface Window {
		log: LogFunction;
		debug: LogFunction;
		logStore: LogStoreType;
		feature: FeatureFunction;
	}
}