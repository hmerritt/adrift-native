import { logn } from "./log";

/**
 * Returns global object to use.
 *
 * Aims to work in both the browser and node.
 */
export const getGlobal = () => {
	try {
		if (typeof window !== "undefined") return window;
		if (typeof globalThis !== "undefined") return globalThis;
		return global;
	} catch (_) {
		return global;
	}
};

export const $global = getGlobal();

/**
 * Set immutable global variable.
 */
export const setGlobalValue = (key: string, value: any, configurable = false) => {
	Object.defineProperty(getGlobal(), key, {
		value: value,
		configurable: configurable,
		writable: configurable
	});
};

/**
 * Parse string environment variable into a primitive.
 *
 * @exmaple `parseEnv("VITE_FEATURE_ENABLED") => true`
 */
export const parseEnv = (value: any, isJson = false) => {
	if (value === "true") return true;
	if (value === "false") return false;
	if (value === "undefined") return undefined;
	if (value === "null") return null;
	if (isJson) {
		try {
			return JSON.parse(value ?? "");
		} catch (e) {
			logn.error("parseEnv", value, e);
		}
	}
	return value;
};

/**
 * Run async task, catching and returning any errors as a variable (similar to Go).
 *
 * @example const [result, error] = await go(myPromise())
 */
export const go = async <T, E = Error>(
	promise: Promise<T> | (() => Promise<T>)
): Promise<[T, null] | [T, E]> => {
	try {
		if (typeof promise === "function") promise = promise();
		const result = await promise;
		return [result, null];
	} catch (error) {
		return [null as T, error as E];
	}
};

/**
 * Run synchronous task, catching and returning any errors as a variable (similar to Go).
 *
 * @example const [result, error] = goSync(() => myFn(...props))
 */
export const goSync = <R, E = Error>(cb: () => R): [R, null] | [R, E] => {
	try {
		const result = cb();
		return [result, null];
	} catch (error) {
		return [null as R, error as E];
	}
};

export type GoFn = typeof go;
export type GoSyncFn = typeof goSync;

export const injectGo = () => {
	setGlobalValue("go", go);
	setGlobalValue("goSync", goSync);
};
