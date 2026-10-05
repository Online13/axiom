import {
	createContext,
	use,
	useState,
	type ComponentPropsWithRef,
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

import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Hue, Spacing, Theme } from "@/theme";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type AvatarStatus = "online" | "away" | "busy" | "offline";
export type AvatarShape = "circle" | "square";

export type AvatarProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
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

// Set by Avatar.Group: how far each avatar slides under the previous one. Grouped avatars also
// get a ring that separates them.
const GroupContext = createContext<{ overlap: keyof Spacing } | null>(null);

function AvatarRoot({
	source,
	fallback,
	name,
	size = "md",
	shape = "circle",
	status,
	colorFromName = false,
	style,
	accessibilityLabel: accessibilityLabelProp,
	...props
}: AvatarProps) {
	const group = use(GroupContext);
	const [loaded, setLoaded] = useState(false);
	const [failed, setFailed] = useState(false);

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
		<View style={styles.wrapper}>
			{content}
			{status ? <View style={styles.status(size, status)} /> : null}
		</View>
	);

	const accessibilityLabel =
		accessibilityLabelProp ??
		(name ? (status ? `${name}, ${status}` : name) : undefined);

	return (
		<View
			accessible={accessibilityLabel !== undefined}
			accessibilityRole="image"
			{...props}
			accessibilityLabel={accessibilityLabel}
			style={[group && styles.overlap(group.overlap), style]}
		>
			{withStatus}
		</View>
	);
}

export type AvatarGroupProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** Avatars, and an Avatar.Overflow for the people not shown. */
	children?: ReactNode;
	/** How far each avatar slides under the previous one, from the spacing scale. */
	overlap?: keyof Spacing;
	style?: StyleProp<ViewStyle>;
};

/** Overlaps the avatars inside it and rings each one. It shows every child: slice the list yourself. */
function AvatarGroup({
	children,
	overlap = 2,
	style,
	...props
}: AvatarGroupProps) {
	return (
		<GroupContext value={{ overlap }}>
			<View {...props} style={[styles.group(overlap), style]}>
				{children}
			</View>
		</GroupContext>
	);
}

export type AvatarOverflowProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** People not shown, read as `+count`. */
	count: number;
	size?: AvatarSize;
	style?: StyleProp<ViewStyle>;
};

/** The `+N` counter at the end of an Avatar.Group. */
function AvatarOverflow({
	count,
	size = "md",
	style,
	...props
}: AvatarOverflowProps) {
	const group = use(GroupContext);

	return (
		<View
			accessible
			accessibilityLabel={`${count} more`}
			{...props}
			style={[
				styles.counter(size),
				group && styles.overlap(group.overlap),
				style,
			]}
		>
			<Text
				numberOfLines={1}
				maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
				style={styles.counterText(size)}
			>
				+{count}
			</Text>
		</View>
	);
}

export const Avatar = Object.assign(AvatarRoot, {
	Group: AvatarGroup,
	Overflow: AvatarOverflow,
});

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
