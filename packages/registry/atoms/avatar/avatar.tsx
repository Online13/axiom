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

import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { Hue, Spacing, Theme } from "@/theme";

import { useAvatarStyles } from "./avatar.styles";

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

/** A stable hue for a name, for the fallback background. */
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
	accessibilityLabel: accessibilityLabelProp,
	...props
}: AvatarProps) {
	const styles = useAvatarStyles();
	const group = use(GroupContext);
	const overlap = group?.overlap;
	const [loaded, setLoaded] = useState(false);
	const [failed, setFailed] = useState(false);

	const hue = colorFromName && name !== undefined ? hueOf(name) : undefined;
	const label = fallback ?? (name ? initials(name) : undefined);
	const showImage = source !== undefined && !failed;

	const content = (
		<View {...styles.frame(size, shape, hue, group !== null)}>
			{!loaded ? (
				typeof label === "string" ? (
					<Text
						numberOfLines={1}
						maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
						{...styles.initials(size, hue)}
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
					{...styles.image(size, shape)}
				/>
			) : null}
		</View>
	);

	const withStatus = (
		<View {...styles.wrapper}>
			{content}
			{status ? <View {...styles.status(size, status)} /> : null}
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
			{...styles.root(overlap, props)}
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
function AvatarGroup({ children, overlap = 2, ...props }: AvatarGroupProps) {
	const styles = useAvatarStyles();

	return (
		<GroupContext value={{ overlap }}>
			<View {...props} {...styles.group(overlap, props)}>
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
function AvatarOverflow({ count, size = "md", ...props }: AvatarOverflowProps) {
	const styles = useAvatarStyles();
	const group = use(GroupContext);
	const overlap = group?.overlap;

	return (
		<View
			accessible
			accessibilityLabel={`${count} more`}
			{...props}
			{...styles.counter(size, overlap, props)}
		>
			<Text
				numberOfLines={1}
				maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
				{...styles.counterText(size)}
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
