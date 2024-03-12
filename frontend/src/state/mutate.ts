/**
 * Produce the next state by mutating the (current) state object.
 *
 * Based on `immer`'s draft syntax - no need to return anything, just mutate the draft object.
 *
 * @example
 * import { mutate } from "state";
 * const state = { count: 1 };
 * const next = mutate(state, (draft) => {
 * 	draft.count++;
 * })
 * // next = { count: 2 }
 */
export const mutate = <TState>(
	state: TState,
	mutateFn: (draft: TState) => void,
	options?: {
		callbacks?: ((
			prevState: TState,
			nextState: TState,
			mutateTitle?: string
		) => void)[];
		mutateTitle?: string;
	}
): TState => {
	// Shallow copy + mutate
	const nextState = { ...state };
	mutateFn(nextState);

	// Run callbacks
	if (options?.callbacks?.length) {
		for (const cb of options?.callbacks ?? []) {
			cb(state, nextState, options?.mutateTitle);
		}
	}

	return nextState;
};

/**
 * Logger middleware for state mutations (mimics `redux-logger`).
 *
 * @example
 * import { mutate, mutateLogger } from "state";
 * const state = { count: 1 };
 * const next = mutate(state, (draft) => {
 * 	draft.count++;
 * }, [mutateLogger], "count increment");
 */
export const mutateLogger = (prevState: any, nextState: any, mutateTitle = "(state)") => {
	if (!env.isDevelopment) return;
	logn("state", "groupCollapsed", `${mutateTitle}`);
	console.log("prev", prevState);
	console.log("next", nextState);
	logn("state", "groupEnd");
};
