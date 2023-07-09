/**
 * Small lib with JS implementations of Golang's string helpers
 */

/**
 * Tests whether the string `s` begins with `prefix`.
 *
 * Ported from Go-lang `strings.HasPrefix`
 */
export const hasPrefix = (s: string, prefix: string) => {
	if (!String.prototype.startsWith) {
		return s.length >= prefix.length && s.substring(0, prefix.length) === prefix;
	}
	return s.startsWith(prefix);
};

/**
 * Tests whether the string `s` ends with `suffix`.
 *
 * Ported from Go-lang `strings.HasSuffix`
 */
export const hasSuffix = (s: string, suffix: string) => {
	if (!String.prototype.startsWith) {
		return s.length >= suffix.length && s.slice(-suffix.length) === suffix;
	}
	return s.endsWith(suffix);
};

/**
 * Returns `s` without the provided leading `prefix` string.
 *
 * If `s` doesn't start with `prefix`, `s` is returned unchanged.
 *
 * Ported from Go-lang `strings.TrimPrefix`
 */
export const trimPrefix = (s: string, prefix: string) => {
	if (hasPrefix(s, prefix)) return s.slice(prefix.length);
	return s;
};

/**
 * Returns `s` without the provided trailing `suffix` string.
 *
 * If `s` doesn't start with `suffix`, `s` is returned unchanged.
 *
 * Ported from Go-lang `strings.TrimSuffix`
 */
export const trimSuffix = (s: string, suffix: string) => {
	if (hasSuffix(s, suffix)) return s.slice(0, s.length - suffix.length);
	return s;
};
