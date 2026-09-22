import {
	Children,
	cloneElement,
	createContext,
	isValidElement,
	use,
	useState,
	type ReactElement,
	type ReactNode,
} from "react";
import {
	Image,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Hue, Theme } from "@/theme";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type AvatarStatus = "online" | "away" | "busy" | "offline";
export type AvatarShape = "circle" | "square";

export type AvatarProps = {
	/** While it loads, or if it fails, the fallback is shown. */
	source?: ImageSourcePropType;
	/** Shown without an image: 1–2 initials, or an icon. */
	fallback?: string | ReactNode;
	/** Full name: initials when `fallback` is missing, and the accessibility label. */
	name?: string;
	size?: AvatarSize;
	shape?: AvatarShape;
	status?: AvatarStatus;
	/** Stable hue from `name` for the fallback background. */
	colorFromName?: boolean;
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

const HUES: Hue[] = [
	"red",
	"orange",
	"yellow",
	"green",
	"mint",
	"teal",
	"cyan",
	"blue",
	"indigo",
	"purple",
	"pink",
	"brown",
];

export function avatarDimension(
	tokens: Theme["tokens"],
	size: AvatarSize,
): number {
	if (typeof size === "number") return size;
	if (size === "xs") return 24;
	if (size === "xl") return 88;
	return tokens.sizes.avatar[size];
}

export function initials(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	const letters =
		words.length > 1 ? [words[0], words[words.length - 1]] : words;
	return letters.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

function hueOf(name: string): Hue {
	let hash = 0;
	for (let i = 0; i < name.length; i++)
		hash = (hash * 31 + name.charCodeAt(i)) | 0;
	return HUES[Math.abs(hash) % HUES.length];
}

// Set by Avatar.Group: its size and the ring that separates overlapping avatars.
const GroupContext = createContext<{ size: AvatarSize } | null>(null);

function AvatarRoot({
	source,
	fallback,
	name,
	size: sizeProp,
	shape = "circle",
	status,
	colorFromName = false,
	onPress,
	style,
}: AvatarProps) {
	const group = use(GroupContext);
	const [loaded, setLoaded] = useState(false);
	const [failed, setFailed] = useState(false);

	const size = group?.size ?? sizeProp ?? "md";
	// On a hue, the ring color (the screen background) reads as white or black.
	const hue = colorFromName && name !== undefined ? hueOf(name) : undefined;
	const label = fallback ?? (name ? initials(name) : undefined);
	const showImage = source !== undefined && !failed;

	const content = (
		<View style={styles.frame(size, shape, hue, group !== null)}>
			{!loaded ? (
				typeof label === "string" ? (
					<Text
						numberOfLines={1}
						maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
						style={styles.initials(size, hue)}
					>
						{label}
					</Text>
				) : (
					label
				)
			) : null}
			{showImage ? (
				<Image
					source={source}
					onLoad={() => setLoaded(true)}
					onError={() => setFailed(true)}
					style={styles.image(size, shape)}
				/>
			) : null}
		</View>
	);

	const withStatus = (
		<View style={[styles.wrapper, style]}>
			{content}
			{status ? <View style={styles.status(size, status)} /> : null}
		</View>
	);

	const accessibilityLabel = name
		? status
			? `${name}, ${status}`
			: name
		: undefined;

	if (onPress) {
		return (
			<Tappable accessibilityLabel={accessibilityLabel} onPress={onPress}>
				{withStatus}
			</Tappable>
		);
	}

	return (
		<View
			accessible={accessibilityLabel !== undefined}
			accessibilityRole="image"
			accessibilityLabel={accessibilityLabel}
		>
			{withStatus}
		</View>
	);
}

export type AvatarGroupProps = {
	children?: ReactNode;
	/** Avatars shown before a `+N` counter. */
	max?: number;
	size?: AvatarSize;
	style?: StyleProp<ViewStyle>;
};

function AvatarGroup({ children, max, size = "sm", style }: AvatarGroupProps) {
	const avatars = Children.toArray(children).filter(
		isValidElement,
	) as ReactElement<AvatarProps>[];
	const shown = max !== undefined ? avatars.slice(0, max) : avatars;
	const hidden = avatars.length - shown.length;

	return (
		<GroupContext value={{ size }}>
			<View style={[styles.group, style]}>
				{shown.map((avatar, i) =>
					cloneElement(avatar, {
						key: avatar.key ?? i,
						style: [
							avatar.props.style,
							i > 0 && styles.overlap(size),
						],
					}),
				)}
				{hidden > 0 ? (
					<View
						accessible
						accessibilityLabel={`${hidden} more`}
						style={styles.counter(size)}
					>
						<Text style={styles.counterText(size)}>+{hidden}</Text>
					</View>
				) : null}
			</View>
		</GroupContext>
	);
}

export const Avatar = Object.assign(AvatarRoot, { Group: AvatarGroup });

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
	image: (size: AvatarSize, shape: AvatarShape) => ({
		...StyleSheet.absoluteFillObject,
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
	group: {
		flexDirection: "row",
		alignItems: "center",
	},
	overlap: (size: AvatarSize) => ({
		marginStart: -Math.round(avatarDimension(theme.tokens, size) / 4),
	}),
	counter: (size: AvatarSize) => {
		const colors = theme.components.avatar.default.default;
		const dimension = avatarDimension(theme.tokens, size);
		return {
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
			marginStart: -Math.round(dimension / 4),
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
