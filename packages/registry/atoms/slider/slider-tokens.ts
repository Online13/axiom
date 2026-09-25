import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type SliderColors = { track: string; fill: string; thumb: string };

export type SliderTokens = {
	default: States<SliderColors, "disabled">;
};

export const sliderTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): SliderTokens => ({
	default: {
		default: {
			track: colors.border.default,
			fill: colors.primary.default,
			thumb: colors.primary.default,
		},
		disabled: {
			fill: colors.content.disabled,
			thumb: colors.content.disabled,
		},
	},
});
