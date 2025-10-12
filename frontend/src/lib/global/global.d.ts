import type { EnvKeys, EnvObj } from "./env";
import type { FeatureFn } from "./featureFlags";
import type { LogFn, LogStoreType, LognFn } from "./log";
import type { RunFn, RunSyncFn } from "./utils";

declare global {
	var debug: LogFn;
	var debugn: LognFn;
	var env: EnvObj;
	var envGet: (key: EnvKeys) => any;
	var feature: FeatureFn;
	var getNumberOfEventListeners: () => number;
	var getObjectOfEventListeners: () => Record<string, number>;
	var go: any;
	var log: LogFn;
	var logn: LognFn;
	var logStore: LogStoreType;
	var run: RunFn;
	var runSync: RunSyncFn;

	interface Window {
		debug: LogFn;
		debugn: LognFn;
		env: EnvObj;
		envGet: (key: EnvKeys) => any;
		feature: FeatureFn;
		getNumberOfEventListeners: () => number;
		getObjectOfEventListeners: () => Record<string, number>;
		go: any;
		log: LogFn;
		logn: LognFn;
		logStore: LogStoreType;
		run: RunFn;
		runSync: RunSyncFn;
	}
}
