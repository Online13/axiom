import { StyleSheet } from "react-native";

import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/theme";

import type { EmptyProps, EmptySize, EmptyTone } from "./empty";

// The icon takes its color as a prop.
export const EmptyIcon = Icon;

export function useEmptyStyles() {
	const { tokens, components } = useTheme();

	return {
		root: (
			size: EmptySize,
			fill: boolean,
			{ style }: Pick<EmptyProps, "style">,
		) => ({
			style: [
				styles.root,
				fill && styles.fill,
				{
					gap: tokens.spacing[size === "md" ? 6 : 4],
					padding: tokens.spacing[size === "md" ? 8 : 4],
				},
				style,
			],
		}),
		header: (size: EmptySize, { style }: Pick<EmptyProps, "style">) => ({
			style: [
				styles.header,
				{ gap: tokens.spacing[size === "md" ? 2 : 1] },
				style,
			],
		}),
		media: (size: EmptySize, { style }: Pick<EmptyProps, "style">) => ({
			style: [
				{ marginBottom: tokens.spacing[size === "md" ? 3 : 2] },
				style,
			],
		}),
		tile: (size: EmptySize, tone: EmptyTone) => ({
			style: [
				styles.tile,
				size === "md" ? styles.tileMd : styles.tileSm,
				{ backgroundColor: components.empty[tone].default.media },
			],
		}),
		tint: (tone: EmptyTone) => ({
			color: components.empty[tone].default.icon,
		}),
		content: ({ style }: Pick<EmptyProps, "style">) => ({
			style: [styles.content, { gap: tokens.spacing[2] }, style],
		}),
	};
}

const styles = StyleSheet.create({
	root: {
		alignItems: "center",
		justifyContent: "center",
	},
	fill: {
		flex: 1,
	},
	header: {
		alignItems: "center",
		maxWidth: 320,
	},
	tile: {
		alignItems: "center",
		justifyContent: "center",
	},
	tileMd: {
		width: 64,
		height: 64,
		borderRadius: 32,
	},
	tileSm: {
		width: 48,
		height: 48,
		borderRadius: 24,
	},
	content: {
		alignItems: "center",
	},
});
