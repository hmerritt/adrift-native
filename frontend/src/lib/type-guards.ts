/**
 * Conditionally spread an item into an array.
 */
export const arraySpread = <TItem>(
	/** Conditional value. When truthy, `itemToSpread` is returned. */
	conditional: any,
	/** Item that gets returned when conditional is truthy */
	itemToSpread: TItem | TItem[],
	/** Option to spread multiple values when `itemToSpread` is an array */
	spreadMultiple = false
) => {
	if (isTruthy(conditional))
		return spreadMultiple && Array.isArray(itemToSpread)
			? (itemToSpread as TItem[])
			: [itemToSpread as TItem];
	return [] as TItem[];
};

export const hasProp = <K extends PropertyKey>(
	data: object,
	prop: K
): data is Record<K, unknown> => {
	return prop in data;
};

export const isObj = (v: unknown): v is Record<string, unknown> => {
	return !!v && typeof v === "object";
};

/**
 * @returns `true` when all supplied values are NOT any of the bellow:
 * - Is falsy
 * - Is empty array
 * - Is empty object
 */
export const isTruthy = (...v: any[]) => {
	for (let i = 0; i < v.length; i++) {
		if (
			!v[i] ||
			(Array.isArray(v[i]) && v[i]?.length === 0) ||
			(isObj(v[i]) && Object.keys(v[i] ?? {})?.length === 0)
		)
			return false;
	}
	return true;
};

export const objKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
