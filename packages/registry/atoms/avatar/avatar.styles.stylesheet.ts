import { StyleSheet } from "react-native";

import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme, type Hue, type Spacing } from "@/theme";

import {
	avatarDimension,
	type AvatarProps,
	type AvatarShape,
	type AvatarSize,
	type AvatarStatus,
} from "./avatar";

export function useAvatarStyles() {
	const { tokens, components } = useTheme();
	const colors = components.avatar.default.default;

	return {
		// In a group, each avatar slides under the previous one.
		root: (
			overlap: keyof Spacing | undefined,
			{ style }: Pick<AvatarProps, "style">,
		) => ({
			style: [
				overlap !== undefined && { marginStart: -tokens.spacing[overlap] },
				style,
			],
		}),
		wrapper: { style: styles.wrapper },
		// A grouped avatar gets a ring that separates it from its neighbours.
		frame: (
			size: AvatarSize,
			shape: AvatarShape,
			hue: Hue | undefined,
			grouped: boolean,
		) => ({
			style: [
				styles.frame,
				{
					width: avatarDimension(tokens, size),
					height: avatarDimension(tokens, size),
					borderRadius:
						shape === "circle"
							? avatarDimension(tokens, size) / 2
							: tokens.radius.md,
					backgroundColor: hue
						? tokens.palette[hue][500]
						: colors.background,
				},
				grouped && { borderWidth: 2, borderColor: colors.ring },
			],
		}),
		// On a hue, the ring color (the screen background) reads as white or black.
		initials: (size: AvatarSize, hue: Hue | undefined) => ({
			style: {
				fontSize: avatarDimension(tokens, size) * 0.4,
				color: hue ? colors.ring : colors.foreground,
				fontWeight: FONT_WEIGHT.semibold,
			},
		}),
		image: (size: AvatarSize, shape: AvatarShape) => ({
			style: [
				styles.image,
				{
					borderRadius:
						shape === "circle"
							? avatarDimension(tokens, size) / 2
							: tokens.radius.md,
				},
			],
		}),
		status: (size: AvatarSize, status: AvatarStatus) => ({
			style: [
				styles.status,
				statusDot(avatarDimension(tokens, size)),
				{
					backgroundColor: components.avatar.status.default[status],
					borderColor: colors.ring,
				},
			],
		}),
		// The padding cancels the first avatar's negative margin.
		group: (
			overlap: keyof Spacing,
			{ style }: Pick<AvatarProps, "style">,
		) => ({
			style: [
				styles.group,
				{ paddingStart: tokens.spacing[overlap] },
				style,
			],
		}),
		counter: (
			size: AvatarSize,
			overlap: keyof Spacing | undefined,
			{ style }: Pick<AvatarProps, "style">,
		) => ({
			style: [
				styles.frame,
				{
					width: avatarDimension(tokens, size),
					height: avatarDimension(tokens, size),
					borderRadius: avatarDimension(tokens, size) / 2,
					borderWidth: 2,
					borderColor: colors.ring,
					backgroundColor: colors.background,
				},
				overlap !== undefined && { marginStart: -tokens.spacing[overlap] },
				style,
			],
		}),
		counterText: (size: AvatarSize) => ({
			style: {
				fontSize: avatarDimension(tokens, size) * 0.36,
				color: colors.foreground,
				fontWeight: FONT_WEIGHT.semibold,
			},
		}),
	};
}

/** The status dot: a quarter of the avatar, and never under 8pt. */
function statusDot(dimension: number) {
	const dot = Math.max(8, Math.round(dimension / 4));
	return { width: dot, height: dot, borderRadius: dot / 2 };
}

const styles = StyleSheet.create({
	wrapper: {
		alignSelf: "flex-start",
	},
	frame: {
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
	image: {
		...StyleSheet.absoluteFill,
		width: "100%",
		height: "100%",
	},
	status: {
		position: "absolute",
		right: 0,
		bottom: 0,
		borderWidth: 2,
	},
	group: {
		flexDirection: "row",
		alignItems: "center",
	},
});
