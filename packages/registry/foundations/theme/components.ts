import type { ThemeColors } from "@/theme/colors";

// Component tokens: <component>.<variant>.<state>.<property>.
// Each component brings its own tokens file (`button-tokens.ts`); `axiom add` registers it below.
// Customize a component in its tokens file, not here.

// axiom:imports:start
// axiom:imports:end

/** States other than `default` only list what changes; a missing property falls back to `default`. */
export type States<Colors, State extends string> = { default: Colors } & {
	[S in State]?: Partial<Colors>;
};

// Pure: only reads `colors`. No raw values and no branching on the scheme.
export const components = (colors: ThemeColors) => ({
	// axiom:components:start
	// axiom:components:end
});

export type Components = ReturnType<typeof components>;
