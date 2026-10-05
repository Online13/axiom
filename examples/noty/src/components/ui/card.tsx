import type { ComponentPropsWithRef, ReactNode } from "react";
import {
	Image,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";
import type { Radius, Spacing } from "@/theme";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardPadding = keyof Spacing | "none";

export type CardProps = Omit<ComponentPropsWithRef<typeof View>, "children"> & {
	variant?: CardVariant;
	/** Inner padding for a card without sub-components. The sub-components pad themselves. */
	padding?: CardPadding;
	radius?: keyof Radius;
	/** Makes the whole card pressable. Buttons inside still receive their own presses. */
	onPress?: () => void;
	disabled?: boolean;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function CardRoot({
	variant = "elevated",
	padding = "none",
	radius = "lg",
	onPress,
	disabled = false,
	children,
	style,
	...props
}: CardProps) {
	const containerStyle = (pressed: boolean): StyleProp<ViewStyle> => [
		styles.card(variant, padding, radius, pressed, disabled),
		style,
	];

	if (onPress) {
		return (
			<Tappable
				{...props}
				disabled={disabled}
				onPress={onPress}
				style={({ pressed }) => containerStyle(pressed)}
			>
				{children}
			</Tappable>
		);
	}

	return (
		<View {...props} style={containerStyle(false)}>
			{children}
		</View>
	);
}

export type CardMediaProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	source: ImageSourcePropType;
	aspectRatio?: number;
	/** Overlay content on the image, like a Badge. */
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function CardMedia({
	source,
	aspectRatio = 16 / 9,
	children,
	style,
	...props
}: CardMediaProps) {
	return (
		<View {...props} style={[styles.media(aspectRatio), style]}>
			<Image source={source} style={styles.mediaImage} resizeMode="cover" />
			{children ? <View style={styles.mediaOverlay}>{children}</View> : null}
		</View>
	);
}

export type CardPartProps = ComponentPropsWithRef<typeof View>;

function CardHeader({ children, style, ...props }: CardPartProps) {
	return (
		<View {...props} style={[styles.header, style]}>
			{children}
		</View>
	);
}

function CardTitle(props: TitleProps) {
	return <Title variant="subheading" {...props} />;
}

function CardDescription(props: TextProps) {
	return <Text variant="bodySm" color="muted" {...props} />;
}

function CardContent({ children, style, ...props }: CardPartProps) {
	return (
		<View {...props} style={[styles.part, style]}>
			{children}
		</View>
	);
}

function CardFooter({ children, style, ...props }: CardPartProps) {
	return (
		<View {...props} style={[styles.footer, style]}>
			{children}
		</View>
	);
}

export const Card = Object.assign(CardRoot, {
	Media: CardMedia,
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Footer: CardFooter,
});

const styles = StyleSheet.create((theme) => ({
	card: (
		variant: CardVariant,
		padding: CardPadding,
		radius: keyof Radius,
		pressed: boolean,
		disabled: boolean,
	) => {
		const states = theme.components.card[variant];
		const colors = {
			...states.default,
			...(pressed ? states.pressed : undefined),
		};
		return {
			overflow: "hidden",
			borderRadius: theme.tokens.radius[radius],
			backgroundColor: colors.background,
			borderWidth: colors.border ? theme.tokens.metrics.hairline : 0,
			borderColor: colors.border,
			// The sub-components pad their top; the card pads the bottom of the last one.
			paddingBottom:
				padding === "none" ? theme.tokens.spacing[4] : undefined,
			padding:
				padding === "none" ? undefined : theme.tokens.spacing[padding],
			...(variant === "elevated" && {
				boxShadow:
					"0px 1px 3px hsla(0, 0%, 0%, 0.08), 0px 4px 12px hsla(0, 0%, 0%, 0.06)",
			}),
			...(disabled && { opacity: 0.5 }),
		};
	},
	media: (aspectRatio: number) => ({ aspectRatio }),
	// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
	mediaImage: {
		...StyleSheet.absoluteFillObject,
		width: "100%",
		height: "100%",
	},
	mediaOverlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		padding: theme.tokens.spacing[3],
	},
	// The sub-components pad their own top and sides; the card pads the bottom of the last one.
	part: {
		paddingHorizontal: theme.tokens.spacing[4],
		paddingTop: theme.tokens.spacing[4],
	},
	header: {
		paddingHorizontal: theme.tokens.spacing[4],
		paddingTop: theme.tokens.spacing[4],
		gap: theme.tokens.spacing[1],
	},
	footer: {
		paddingHorizontal: theme.tokens.spacing[4],
		paddingTop: theme.tokens.spacing[4],
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[2],
	},
}));
