import { Icon } from "@/components/ui/icon";
import type { Hue } from "@/theme";
import { palette } from "@/theme/tokens";

// The tile icon takes its color as a prop.
export const OptionItemIcon = Icon;

// The tile takes a raw palette color, which the theme's classes don't name: it stays a style.
export function useOptionItemStyles() {
	return {
		tile: (iconColor: Hue) => ({
			className: "size-[30px] items-center justify-center rounded-sm",
			style: { backgroundColor: palette[iconColor][500] },
		}),
		tileIcon: { color: palette.gray[50] },
		leading: { className: "gap-3" },
	};
}
