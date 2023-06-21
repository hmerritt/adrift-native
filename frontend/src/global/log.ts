import dayjs from "dayjs";

import { $global } from "./utils";
import { padChar } from "utils/common/strings";

enum ConsoleFunctions {
	debug = "debug",
	error = "error",
	info = "info",
	log = "log",
	trace = "trace",
	warn = "warn"
}

type chars = string | number;
const styles = ["color: #888"].join(";");
const timestamp = () => dayjs().format("HH:mm:ss.SSS");
const padStr = (str: chars = "", c = 5) => padChar(str, c, " ", true);

// Internal log store class. Keeps track of log times and counts per namespace.
//
// Injects into global object as `$global.logStore`.
class LogStore {
	defaultNamespace: string;
	logStore: Record<string, [number, number]>;

	constructor() {
		this.defaultNamespace = "_log";
		this.logStore = {
			_log: [Date.now(), 1]
		};
	}

	get(namespace = this.defaultNamespace) {
		return this.logStore?.[namespace];
	}

	getTime(namespace = this.defaultNamespace) {
		return this.logStore?.[namespace]?.[0] || Date.now();
	}

	getCount(namespace = this.defaultNamespace) {
		return this.logStore?.[namespace]?.[1] || 1;
	}

	set(namespace = this.defaultNamespace, time = Date.now(), count = 1) {
		return (this.logStore[namespace] = [time, count]);
	}

	increment(namespace = this.defaultNamespace) {
		return this.set(namespace, Date.now(), this.getCount(namespace) + 1);
	}
}

export type LogStoreType = LogStore;

const timestampString = (diff: chars, namespace?: string) => {
	const ts = `%c${timestamp()} +${padStr(diff)}%s`;

	if (namespace === $global.logStore.defaultNamespace) {
		return ts;
	}

	// Log Count (not being used):
	// x${padStr($global.logStore.getCount(namespace), 3)}

	return `${ts} ${padStr(namespace, 10)}`;
};

const _log = (namespace: string, logLevel: any, ...args: any[]) => {
	if (import.meta.env.MODE === "production") return;

	const timeElapsed = dayjs().diff(
		$global.logStore.getTime(namespace),
		"millisecond"
	);

	const stringToLog = timestampString(timeElapsed, namespace);

	if (ConsoleFunctions[logLevel]) {
		console[ConsoleFunctions[logLevel]](stringToLog, styles, "", ...args);
	} else {
		console.log(stringToLog, styles, "", logLevel, ...args);
	}

	$global.logStore.increment(namespace);
};

/**
 * log in development only (`NODE_ENV !== "production"`)
 *
 * Adds a timestamp and timediff to each log automatically.
 */
export const log = (logLevel: any, ...args: any[]) => {
	_log($global.logStore.defaultNamespace, logLevel, ...args);
};

/**
 * Alias for `log`, plus namespaces logs to keep them separate.
 *
 * @example debug("socket", "msg received") -> "[socket] msg recieved"
 */
export const debug = (namespace: string, logLevel: any, ...args: any[]) => {
	_log(namespace, logLevel, ...args);
};

export const injectLog = () => {
	$global.logStore = new LogStore();
	$global.log = log;
	$global.debug = debug;
};
