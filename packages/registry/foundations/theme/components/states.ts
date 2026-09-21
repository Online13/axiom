/** States other than `default` only list what changes; a missing property falls back to `default`. */
export type States<Colors, State extends string> = { default: Colors } & {
	[S in State]?: Partial<Colors>;
};
