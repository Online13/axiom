import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";

// Component tokens: <component>.<variant>.<state>.<property>.
// Each component brings its own tokens file, copied into this folder as `<component>.ts`;
// `axiom add` registers it below. Customize a component in its tokens file, not here.

// axiom:imports:start
// axiom:imports:end

export type { States } from "./states";

// Pure: reads `colors` for color and `tokens` for shape. No raw values and no branching on the scheme.
export const components = (colors: ThemeColors, tokens: Tokens) => ({
	// axiom:components:start
	// axiom:components:end
});

export type Components = ReturnType<typeof components>;
