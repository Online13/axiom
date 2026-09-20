import { tokens, type Tokens } from "@/theme/tokens";

import { darkColors, lightColors, type ThemeColors } from "./colors";
import { components, type Components } from "@/theme/components";

export type Theme = {
	tokens: Tokens;
	colors: ThemeColors;
	components: Components;
};

export const light = {
	tokens,
	colors: lightColors,
	components: components(lightColors),
} satisfies Theme;

export const dark = {
	tokens,
	colors: darkColors,
	components: components(darkColors),
} satisfies Theme;
