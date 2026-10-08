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

import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { cx, useTheme, type Hue, type Spacing, type Theme } from "@/theme";

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
const GroupContext = createContext<{ overlap: number } | null>(null);

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
	const { tokens, components } = useTheme();
	const group = use(GroupContext);
	const [loaded, setLoaded] = useState(false);
	const [failed, setFailed] = useState(false);

	const dimension = avatarDimension(tokens, size);
	const colors = components.avatar.default.default;
	const radius = shape === "circle" ? dimension / 2 : tokens.radius.md;
	const tinted = colorFromName && name !== undefined;
	const background = tinted
		? tokens.palette[hueOf(name)][500]
		: colors.background;
	// On a hue, the ring color (the screen background) reads as white or black.
	const foreground = tinted ? colors.ring : colors.foreground;
	const label = fallback ?? (name ? initials(name) : undefined);
	const showImage = source !== undefined && !failed;
	const dot = Math.max(8, Math.round(dimension / 4));

	const content = (
		<View
			className="items-center justify-center overflow-hidden"
			style={[
				{
					width: dimension,
					height: dimension,
					borderRadius: radius,
					backgroundColor: background,
				},
				group && { borderWidth: 2, borderColor: colors.ring },
			]}
		>
			{!loaded ? (
				typeof label === "string" ? (
					<Text
						numberOfLines={1}
						maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
						style={{
							fontSize: dimension * 0.4,
							color: foreground,
							fontWeight: FONT_WEIGHT.semibold,
						}}
					>
						{label}
					</Text>
				) : (
					label
				)
			) : null}
			{showImage ? (
				// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
				<Image
					source={source}
					onLoad={() => setLoaded(true)}
					onError={() => setFailed(true)}
					className="absolute inset-0 w-full h-full"
					style={{ borderRadius: radius }}
				/>
			) : null}
		</View>
	);

	const withStatus = (
		<View className="self-start">
			{content}
			{status ? (
				<View
					className="absolute"
					style={{
						right: 0,
						bottom: 0,
						borderWidth: 2,
						width: dot,
						height: dot,
						borderRadius: dot / 2,
						backgroundColor: components.avatar.status.default[status],
						borderColor: colors.ring,
					}}
				/>
			) : null}
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
			style={[group && { marginStart: -group.overlap }, style]}
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
	className,
	style,
	...props
}: AvatarGroupProps) {
	const { tokens } = useTheme();
	const offset = tokens.spacing[overlap];

	return (
		<GroupContext value={{ overlap: offset }}>
			{/* The padding cancels the first avatar's negative margin. */}
			<View
				{...props}
				className={cx("flex-row items-center", className)}
				style={[{ paddingStart: offset }, style]}
			>
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
	className,
	style,
	...props
}: AvatarOverflowProps) {
	const { tokens, components } = useTheme();
	const group = use(GroupContext);
	const dimension = avatarDimension(tokens, size);
	const colors = components.avatar.default.default;

	return (
		<View
			accessible
			accessibilityLabel={`${count} more`}
			{...props}
			className={cx(
				"items-center justify-center overflow-hidden",
				className,
			)}
			style={[
				{
					width: dimension,
					height: dimension,
					borderRadius: dimension / 2,
					borderWidth: 2,
					borderColor: colors.ring,
					backgroundColor: colors.background,
				},
				group && { marginStart: -group.overlap },
				style,
			]}
		>
			<Text
				numberOfLines={1}
				maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
				style={{
					fontSize: dimension * 0.36,
					color: colors.foreground,
					fontWeight: FONT_WEIGHT.semibold,
				}}
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
