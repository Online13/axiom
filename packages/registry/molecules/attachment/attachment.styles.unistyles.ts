import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { Theme } from "@/theme";

import type { AttachmentProps, AttachmentVariant } from "./attachment";
import type { AttachmentStatus } from "./use-attachment";
import { stateColors } from "@/theme/components/states";

const THUMBNAIL = 40;
const TILE = 72;

/** Colors of an attachment for a variant and a status; missing properties fall back to `default`. */
function attachmentColors(
	components: Theme["components"],
	variant: AttachmentVariant,
	status: AttachmentStatus,
) {
	const states = components.attachment[variant];
	return stateColors(states, status !== "idle" && status);
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const AttachmentIcon = withUnistyles(Icon);

export function useAttachmentStyles() {
	return {
		row: (
			status: AttachmentStatus,
			{ style }: Pick<AttachmentProps, "style">,
		) => ({ style: [styles.row(status), style] }),
		tile: (
			status: AttachmentStatus,
			{ style }: Pick<AttachmentProps, "style">,
		) => ({ style: [styles.tile(status), style] }),
		thumbnailImage: (tile: boolean) => ({
			style: styles.thumbnailImage(tile),
		}),
		thumbnailFallback: (
			variant: AttachmentVariant,
			status: AttachmentStatus,
			tile: boolean,
		) => ({ style: styles.thumbnailFallback(variant, status, tile) }),
		tint: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			uniProps: (theme: Theme) => ({
				color: attachmentColors(theme.components, variant, status).icon,
			}),
		}),
		content: { style: styles.content },
		name: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			style: styles.name(variant, status),
		}),
		note: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			style: styles.note(variant, status),
		}),
		track: (status: AttachmentStatus) => ({ style: styles.track(status) }),
		fill: (status: AttachmentStatus, percent: number) => ({
			style: styles.fill(status, percent),
		}),
		scrim: { style: styles.scrim },
		remove: { style: styles.remove },
	};
}

const styles = StyleSheet.create((theme) => ({
	row: (status: AttachmentStatus) => {
		const colors = attachmentColors(theme.components, "row", status);
		return {
			flexDirection: "row",
			alignItems: "center",
			borderCurve: "continuous",
			padding: theme.tokens.spacing[2],
			gap: theme.tokens.spacing[3],
			borderRadius: theme.tokens.radius.md,
			borderWidth: theme.tokens.metrics.hairline,
			borderColor: colors.border,
			backgroundColor: colors.background,
		};
	},
	tile: (status: AttachmentStatus) => {
		const colors = attachmentColors(theme.components, "tile", status);
		return {
			overflow: "hidden",
			borderWidth: 1.5,
			borderCurve: "continuous",
			width: TILE,
			height: TILE,
			borderRadius: theme.tokens.radius.md,
			backgroundColor: colors.background,
			borderColor: status === "error" ? colors.border : "transparent",
		};
	},
	thumbnailImage: (tile: boolean) => {
		const size = tile ? TILE : THUMBNAIL;
		return {
			width: size,
			height: size,
			borderRadius: tile ? theme.tokens.radius.md : theme.tokens.radius.sm,
		};
	},
	thumbnailFallback: (
		variant: AttachmentVariant,
		status: AttachmentStatus,
		tile: boolean,
	) => {
		const size = tile ? TILE : THUMBNAIL;
		return {
			alignItems: "center",
			justifyContent: "center",
			width: size,
			height: size,
			borderRadius: tile ? theme.tokens.radius.md : theme.tokens.radius.sm,
			backgroundColor: attachmentColors(theme.components, variant, status)
				.thumbnail,
		};
	},
	scrim: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.45)",
	},
	remove: {
		position: "absolute",
		top: 0,
		end: 0,
		margin: theme.tokens.spacing[1],
	},
	content: {
		flex: 1,
		justifyContent: "center",
		gap: 2,
	},
	name: (variant: AttachmentVariant, status: AttachmentStatus) => ({
		color: attachmentColors(theme.components, variant, status).text,
	}),
	note: (variant: AttachmentVariant, status: AttachmentStatus) => ({
		color: attachmentColors(theme.components, variant, status).meta,
	}),
	track: (status: AttachmentStatus) => ({
		height: 4,
		borderRadius: 2,
		overflow: "hidden",
		marginTop: theme.tokens.spacing[1],
		backgroundColor: attachmentColors(theme.components, "row", status)
			.progressTrack,
	}),
	fill: (status: AttachmentStatus, percent: number) => ({
		height: "100%",
		borderRadius: 2,
		width: `${percent}%`,
		backgroundColor: attachmentColors(theme.components, "row", status)
			.progressFill,
	}),
}));
