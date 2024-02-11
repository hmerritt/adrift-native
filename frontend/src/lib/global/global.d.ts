import type { EnvKeys, EnvObj } from "./env";
import type { FeatureFlags, FeatureOptions } from "./featureFlags";
import type { LogStoreType } from "./log";

type LogFunction = (logLevel: any, ...args: any[]) => void;
type LognFunction = (namespace: string, logLevel: any, ...args: any[]) => void;
type FeatureFunction = (mode: FeatureFlags, options?: FeatureOptions) => boolean;

declare global {
	var log: LogFunction;
	var logn: LognFunction;
	var debug: LogFunction;
	var debugn: LognFunction;
	var logStore: LogStoreType;
	var env: EnvObj;
	var envGet: (key: EnvKeys) => any;
	var feature: FeatureFunction;
	var getNumberOfEventListeners: () => number;
	var getObjectOfEventListeners: () => Record<string, number>;

	interface Window {
		log: LogFunction;
		logn: LognFunction;
		debug: LogFunction;
		debugn: LognFunction;
		logStore: LogStoreType;
		env: EnvObj;
		envGet: (key: EnvKeys) => any;
		feature: FeatureFunction;
		getNumberOfEventListeners: () => number;
		getObjectOfEventListeners: () => Record<string, number>;
	}
}
