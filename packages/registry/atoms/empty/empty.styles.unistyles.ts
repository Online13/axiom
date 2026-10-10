import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { Theme } from "@/theme";

import type { EmptyProps, EmptySize, EmptyTone } from "./empty";

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const EmptyIcon = withUnistyles(Icon);

export function useEmptyStyles() {
	return {
		root: (
			size: EmptySize,
			fill: boolean,
			{ style }: Pick<EmptyProps, "style">,
		) => ({ style: [styles.root(size, fill), style] }),
		header: (size: EmptySize, { style }: Pick<EmptyProps, "style">) => ({
			style: [styles.header(size), style],
		}),
		media: (size: EmptySize, { style }: Pick<EmptyProps, "style">) => ({
			style: [styles.media(size), style],
		}),
		tile: (size: EmptySize, tone: EmptyTone) => ({
			style: styles.tile(size, tone),
		}),
		tint: (tone: EmptyTone) => ({
			uniProps: (theme: Theme) => ({
				color: theme.components.empty[tone].default.icon,
			}),
		}),
		content: ({ style }: Pick<EmptyProps, "style">) => ({
			style: [styles.content, style],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	root: (size: EmptySize, fill: boolean) => ({
		alignItems: "center",
		justifyContent: "center",
		gap: theme.tokens.spacing[size === "md" ? 6 : 4],
		padding: theme.tokens.spacing[size === "md" ? 8 : 4],
		...(fill && { flex: 1 }),
	}),
	header: (size: EmptySize) => ({
		alignItems: "center",
		maxWidth: 320,
		gap: theme.tokens.spacing[size === "md" ? 2 : 1],
	}),
	media: (size: EmptySize) => ({
		marginBottom: theme.tokens.spacing[size === "md" ? 3 : 2],
	}),
	tile: (size: EmptySize, tone: EmptyTone) => {
		const tile = size === "md" ? 64 : 48;
		return {
			alignItems: "center",
			justifyContent: "center",
			width: tile,
			height: tile,
			borderRadius: tile / 2,
			backgroundColor: theme.components.empty[tone].default.media,
		};
	},
	content: {
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
}));
