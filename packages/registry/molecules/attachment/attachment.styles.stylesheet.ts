import { StyleSheet } from "react-native";

import { Icon } from "@/components/ui/icon";
import { useTheme, type Theme } from "@/theme";

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

// The icon takes its color as a prop.
export const AttachmentIcon = Icon;

export function useAttachmentStyles() {
	const { tokens, components } = useTheme();

	return {
		row: (
			status: AttachmentStatus,
			{ style }: Pick<AttachmentProps, "style">,
		) => ({
			style: [
				styles.row,
				{
					padding: tokens.spacing[2],
					gap: tokens.spacing[3],
					borderRadius: tokens.radius.md,
					borderWidth: tokens.metrics.hairline,
					borderColor: attachmentColors(components, "row", status).border,
					backgroundColor: attachmentColors(components, "row", status)
						.background,
				},
				style,
			],
		}),
		// The tile keeps its border width in every state, so nothing moves when an error shows it.
		tile: (
			status: AttachmentStatus,
			{ style }: Pick<AttachmentProps, "style">,
		) => ({
			style: [
				styles.tile,
				{
					width: TILE,
					height: TILE,
					borderRadius: tokens.radius.md,
					backgroundColor: attachmentColors(components, "tile", status)
						.background,
					borderColor:
						status === "error"
							? attachmentColors(components, "tile", status).border
							: "transparent",
				},
				style,
			],
		}),
		thumbnailImage: (tile: boolean) => ({
			style: {
				width: tile ? TILE : THUMBNAIL,
				height: tile ? TILE : THUMBNAIL,
				borderRadius: tile ? tokens.radius.md : tokens.radius.sm,
			},
		}),
		thumbnailFallback: (
			variant: AttachmentVariant,
			status: AttachmentStatus,
			tile: boolean,
		) => ({
			style: [
				styles.center,
				{
					width: tile ? TILE : THUMBNAIL,
					height: tile ? TILE : THUMBNAIL,
					borderRadius: tile ? tokens.radius.md : tokens.radius.sm,
					backgroundColor: attachmentColors(components, variant, status)
						.thumbnail,
				},
			],
		}),
		tint: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			color: attachmentColors(components, variant, status).icon,
		}),
		content: { style: [styles.content, { gap: 2 }] },
		name: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			style: { color: attachmentColors(components, variant, status).text },
		}),
		note: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			style: { color: attachmentColors(components, variant, status).meta },
		}),
		track: (status: AttachmentStatus) => ({
			style: [
				styles.track,
				{
					marginTop: tokens.spacing[1],
					backgroundColor: attachmentColors(components, "row", status)
						.progressTrack,
				},
			],
		}),
		fill: (status: AttachmentStatus, percent: number) => ({
			style: [
				styles.fill,
				{
					width: `${percent}%` as const,
					backgroundColor: attachmentColors(components, "row", status)
						.progressFill,
				},
			],
		}),
		scrim: { style: [StyleSheet.absoluteFill, styles.center, styles.scrim] },
		remove: { style: [styles.remove, { margin: tokens.spacing[1] }] },
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		borderCurve: "continuous",
	},
	content: {
		flex: 1,
		justifyContent: "center",
	},
	center: {
		alignItems: "center",
		justifyContent: "center",
	},
	tile: {
		overflow: "hidden",
		borderWidth: 1.5,
		borderCurve: "continuous",
	},
	scrim: {
		backgroundColor: "rgba(0, 0, 0, 0.45)",
	},
	remove: {
		position: "absolute",
		top: 0,
		end: 0,
	},
	track: {
		height: 4,
		borderRadius: 2,
		overflow: "hidden",
	},
	fill: {
		height: "100%",
		borderRadius: 2,
	},
});
