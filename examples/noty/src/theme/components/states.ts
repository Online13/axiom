/** States other than `default` only list what changes; a missing property falls back to `default`. */
export type States<Colors, State extends string> = { default: Colors } & {
	[S in State]?: Partial<Colors>;
};

/**
 * The colors of a component in the states it is in: `default`, then each named state on top, in
 * the order they are listed. `false` skips a state the component isn't in.
 */
export function stateColors<Colors, State extends string>(
	states: States<Colors, State>,
	...active: (State | "default" | false | undefined)[]
): Colors {
	const changes: Partial<Record<string, Partial<Colors>>> = states;
	let colors = states.default;
	for (const state of active) {
		if (state && state !== "default")
			colors = { ...colors, ...changes[state] };
	}
	return colors;
}
