export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

/**
 * Deep `keyof` of a nested object. INCLUDES root key as well as all nested.
 *
 * @example "a" | "b" | "nest" | "otherNest" | "nest.c" | "otherNest.c"
 */
export type DeepKeyofPaths<T> = T extends object
	? {
			[K in keyof T]: `${Exclude<K, symbol>}${"" | `.${DeepKeyofPaths<T[K]>}`}`;
		}[keyof T]
	: never;

/**
 * Deep `keyof` of a nested object. DOES NOT INCLUDE root key, only shows leaf nodes.
 *
 * @example "a" | "b" | "nest.c" | "otherNest.c"
 */
export type DeepKeyofLeaves<T> = T extends object
	? {
			[K in keyof T]: `${Exclude<K, symbol>}${DeepKeyofLeaves<T[K]> extends never ? "" : `.${DeepKeyofLeaves<T[K]>}`}`;
		}[keyof T]
	: never;
