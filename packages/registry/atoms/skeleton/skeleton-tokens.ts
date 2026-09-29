import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type SkeletonColors = { background: string; highlight: string };

export type SkeletonTokens = {
	default: States<SkeletonColors, never>;
};

/** `color` at `alpha` opacity. Takes the `hsla()` strings of the palette, or a `#rrggbb` hex. */
const withAlpha = (color: string, alpha: number) => {
	const hsla = color.match(/^hsla?\(([^,]+),([^,]+),([^,)]+)/);
	if (hsla) return `hsla(${hsla[1]},${hsla[2]},${hsla[3]}, ${alpha})`;
	const hex = color.match(/^#([0-9a-f]{6})/i);
	if (hex) {
		const value = Number.parseInt(hex[1], 16);
		return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
	}
	return color;
};

// A see-through wash of the text color, not an opaque fill: the placeholder
// sits on any surface — screen, card, sheet — and stays readable on each.
export const skeletonTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): SkeletonTokens => ({
	default: {
		default: {
			background: withAlpha(colors.content.default, 0.08),
			highlight: withAlpha(colors.content.default, 0.16),
		},
	},
});
