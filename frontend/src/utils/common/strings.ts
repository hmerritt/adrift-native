/**
 * Use char(s) to pad an input string/number to a certain length.
 */
export const padChar = (
	str: string | number,
	size = 5,
	char = " ",
	append = false
): string => {
	str = String(str);
	while (str.length < size) str = append ? str + char : char + str;
	return str;
};

/**
 * Pad an input number with `0`s to maintain a desired length.
 *
 * Alias of `padChar`.
 */
export const padZeros = (num: string | number, size: number): string => {
	return padChar(num, size, "0", false);
};

/**
 * A wrapper for `JSON.parse()` to support `undefined` value
 */
export const parseJSON = (value: string | null): any | undefined => {
	try {
		return value === "undefined" ? undefined : JSON.parse(value ?? "");
	} catch {
		log("warn", value);
		return undefined;
	}
};
