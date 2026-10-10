import { StyleSheet } from "react-native-unistyles";

import { FONT_WEIGHT } from "@/components/ui/text";
import type { Hue, Spacing } from "@/theme";

import {
	avatarDimension,
	type AvatarProps,
	type AvatarShape,
	type AvatarSize,
	type AvatarStatus,
} from "./avatar";

export function useAvatarStyles() {
	return {
		root: (
			overlap: keyof Spacing | undefined,
			{ style }: Pick<AvatarProps, "style">,
		) => ({
			style: [overlap !== undefined && styles.overlap(overlap), style],
		}),
		wrapper: { style: styles.wrapper },
		frame: (
			size: AvatarSize,
			shape: AvatarShape,
			hue: Hue | undefined,
			grouped: boolean,
		) => ({ style: styles.frame(size, shape, hue, grouped) }),
		initials: (size: AvatarSize, hue: Hue | undefined) => ({
			style: styles.initials(size, hue),
		}),
		image: (size: AvatarSize, shape: AvatarShape) => ({
			style: styles.image(size, shape),
		}),
		status: (size: AvatarSize, status: AvatarStatus) => ({
			style: styles.status(size, status),
		}),
		group: (
			overlap: keyof Spacing,
			{ style }: Pick<AvatarProps, "style">,
		) => ({
			style: [styles.group(overlap), style],
		}),
		counter: (
			size: AvatarSize,
			overlap: keyof Spacing | undefined,
			{ style }: Pick<AvatarProps, "style">,
		) => ({
			style: [
				styles.counter(size),
				overlap !== undefined && styles.overlap(overlap),
				style,
			],
		}),
		counterText: (size: AvatarSize) => ({ style: styles.counterText(size) }),
	};
}

const styles = StyleSheet.create((theme) => ({
	wrapper: {
		alignSelf: "flex-start",
	},
	frame: (
		size: AvatarSize,
		shape: AvatarShape,
		hue: Hue | undefined,
		grouped: boolean,
	) => {
		const colors = theme.components.avatar.default.default;
		const dimension = avatarDimension(theme.tokens, size);
		return {
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
			width: dimension,
			height: dimension,
			borderRadius:
				shape === "circle" ? dimension / 2 : theme.tokens.radius.md,
			backgroundColor: hue
				? theme.tokens.palette[hue][500]
				: colors.background,
			...(grouped && { borderWidth: 2, borderColor: colors.ring }),
		};
	},
	initials: (size: AvatarSize, hue: Hue | undefined) => {
		const colors = theme.components.avatar.default.default;
		return {
			fontSize: avatarDimension(theme.tokens, size) * 0.4,
			color: hue ? colors.ring : colors.foreground,
			fontWeight: FONT_WEIGHT.semibold,
		};
	},
	// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
	image: (size: AvatarSize, shape: AvatarShape) => ({
		...StyleSheet.absoluteFillObject,
		width: "100%",
		height: "100%",
		borderRadius:
			shape === "circle"
				? avatarDimension(theme.tokens, size) / 2
				: theme.tokens.radius.md,
	}),
	status: (size: AvatarSize, status: AvatarStatus) => {
		const dot = Math.max(
			8,
			Math.round(avatarDimension(theme.tokens, size) / 4),
		);
		return {
			position: "absolute",
			right: 0,
			bottom: 0,
			width: dot,
			height: dot,
			borderRadius: dot / 2,
			borderWidth: 2,
			borderColor: theme.components.avatar.default.default.ring,
			backgroundColor: theme.components.avatar.status.default[status],
		};
	},
	// The padding cancels the first avatar's negative margin.
	group: (overlap: keyof Spacing) => ({
		flexDirection: "row",
		alignItems: "center",
		paddingStart: theme.tokens.spacing[overlap],
	}),
	overlap: (overlap: keyof Spacing) => ({
		marginStart: -theme.tokens.spacing[overlap],
	}),
	counter: (size: AvatarSize) => {
		const colors = theme.components.avatar.default.default;
		const dimension = avatarDimension(theme.tokens, size);
		return {
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
			width: dimension,
			height: dimension,
			borderRadius: dimension / 2,
			borderWidth: 2,
			borderColor: colors.ring,
			backgroundColor: colors.background,
		};
	},
	counterText: (size: AvatarSize) => ({
		fontSize: avatarDimension(theme.tokens, size) * 0.36,
		color: theme.components.avatar.default.default.foreground,
		fontWeight: FONT_WEIGHT.semibold,
	}),
}));
