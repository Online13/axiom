import type { ComponentPropsWithRef, ReactNode } from "react";
import {
	Image,
	StyleSheet,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";
import { useTheme, type Radius, type Spacing } from "@/theme";

export type CardVariant = "elevated" | "outlined" | "filled";

export type CardProps = Omit<ComponentPropsWithRef<typeof View>, "children"> & {
	variant?: CardVariant;
	/** Inner padding for a card without sub-components. The sub-components pad themselves. */
	padding?: keyof Spacing | "none";
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
	const { tokens, components } = useTheme();
	const states = components.card[variant];

	const containerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
		const colors = {
			...states.default,
			...(pressed ? states.pressed : undefined),
		};
		return [
			styles.card,
			{
				borderRadius: tokens.radius[radius],
				backgroundColor: colors.background,
				borderWidth: colors.border ? tokens.metrics.hairline : 0,
				borderColor: colors.border,
				// The sub-components pad their top; the card pads the bottom of the last one.
				paddingBottom: padding === "none" ? tokens.spacing[4] : undefined,
				padding: padding === "none" ? undefined : tokens.spacing[padding],
			},
			variant === "elevated" && styles.shadow,
			disabled && styles.disabled,
			style,
		];
	};

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
	const { tokens } = useTheme();

	return (
		<View {...props} style={[{ aspectRatio }, style]}>
			<Image source={source} style={styles.mediaImage} resizeMode="cover" />
			{children ? (
				<View style={[styles.mediaOverlay, { padding: tokens.spacing[3] }]}>
					{children}
				</View>
			) : null}
		</View>
	);
}

export type CardPartProps = ComponentPropsWithRef<typeof View>;

function usePartStyle() {
	const { tokens } = useTheme();
	return {
		paddingHorizontal: tokens.spacing[4],
		paddingTop: tokens.spacing[4],
	};
}

function CardHeader({ children, style, ...props }: CardPartProps) {
	const { tokens } = useTheme();
	return (
		<View
			{...props}
			style={[usePartStyle(), { gap: tokens.spacing[1] }, style]}
		>
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
		<View {...props} style={[usePartStyle(), style]}>
			{children}
		</View>
	);
}

function CardFooter({ children, style, ...props }: CardPartProps) {
	const { tokens } = useTheme();
	return (
		<View
			{...props}
			style={[
				usePartStyle(),
				styles.footer,
				{ gap: tokens.spacing[2] },
				style,
			]}
		>
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

const styles = StyleSheet.create({
	card: {
		overflow: "hidden",
	},
	shadow: {
		boxShadow:
			"0px 1px 3px hsla(0, 0%, 0%, 0.08), 0px 4px 12px hsla(0, 0%, 0%, 0.06)",
	},
	disabled: {
		opacity: 0.5,
	},
	// A bundled image defaults to its file's pixel size: without a size, it overflows the frame.
	mediaImage: {
		...StyleSheet.absoluteFill,
		width: "100%",
		height: "100%",
	},
	mediaOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: "flex-start",
	},
	footer: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
});
