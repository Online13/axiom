import { cx, type Hue, type Spacing } from "@/theme";
import { tokens } from "@/theme/tokens";

import {
	avatarDimension,
	type AvatarProps,
	type AvatarShape,
	type AvatarSize,
	type AvatarStatus,
} from "./avatar";

// Every class is written whole, so Tailwind finds it. The colors are the avatar's own tokens, in
// `theme/components/avatar.css`. The sizes are numbers the caller may give: they stay styles.
const STATUS: Record<AvatarStatus, string> = {
	online: "bg-avatar-status-online",
	away: "bg-avatar-status-away",
	busy: "bg-avatar-status-busy",
	offline: "bg-avatar-status-offline",
};

/** The status dot: a quarter of the avatar, and never under 8pt. */
const statusDot = (size: AvatarSize) =>
	Math.max(8, Math.round(avatarDimension(tokens, size) / 4));

export function useAvatarStyles() {
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
		wrapper: { className: "self-start" },
		// A grouped avatar gets a ring that separates it from its neighbours. A hue is a raw
		// palette color, which no class of the theme names.
		frame: (
			size: AvatarSize,
			shape: AvatarShape,
			hue: Hue | undefined,
			grouped: boolean,
		) => ({
			className: cx(
				"items-center justify-center overflow-hidden",
				shape === "circle" ? "rounded-full" : "rounded-md",
				!hue && "bg-avatar",
				grouped && "border-2 border-avatar-ring",
			),
			style: [
				{
					width: avatarDimension(tokens, size),
					height: avatarDimension(tokens, size),
				},
				hue && { backgroundColor: tokens.palette[hue][500] },
			],
		}),
		// On a hue, the ring color (the screen background) reads as white or black.
		initials: (size: AvatarSize, hue: Hue | undefined) => ({
			className: cx(
				"font-semibold",
				hue ? "text-avatar-ring" : "text-avatar-foreground",
			),
			style: { fontSize: avatarDimension(tokens, size) * 0.4 },
		}),
		// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
		image: (size: AvatarSize, shape: AvatarShape) => ({
			className: cx(
				"absolute inset-0 h-full w-full",
				shape === "circle" ? "rounded-full" : "rounded-md",
			),
		}),
		status: (size: AvatarSize, status: AvatarStatus) => ({
			className: cx(
				"absolute bottom-0 right-0 rounded-full border-2 border-avatar-ring",
				STATUS[status],
			),
			style: { width: statusDot(size), height: statusDot(size) },
		}),
		// The padding cancels the first avatar's negative margin.
		group: (
			overlap: keyof Spacing,
			{ className, style }: Pick<AvatarProps, "className" | "style">,
		) => ({
			className: cx("flex-row items-center", className),
			style: [{ paddingStart: tokens.spacing[overlap] }, style],
		}),
		counter: (
			size: AvatarSize,
			overlap: keyof Spacing | undefined,
			{ className, style }: Pick<AvatarProps, "className" | "style">,
		) => ({
			className: cx(
				"items-center justify-center overflow-hidden rounded-full border-2 border-avatar-ring bg-avatar",
				className,
			),
			style: [
				{
					width: avatarDimension(tokens, size),
					height: avatarDimension(tokens, size),
				},
				overlap !== undefined && { marginStart: -tokens.spacing[overlap] },
				style,
			],
		}),
		counterText: (size: AvatarSize) => ({
			className: "font-semibold text-avatar-foreground",
			style: { fontSize: avatarDimension(tokens, size) * 0.36 },
		}),
	};
}
