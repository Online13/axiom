import type { ComponentPropsWithRef, ReactNode } from "react";
import {
	Image,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";
import type { Radius, Spacing } from "@/theme";

import { useCardStyles } from "./card.styles";

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
	...props
}: CardProps) {
	const styles = useCardStyles();

	if (onPress) {
		return (
			<Tappable
				{...props}
				disabled={disabled}
				onPress={onPress}
				{...styles.pressable(variant, padding, radius, disabled, props)}
			>
				{children}
			</Tappable>
		);
	}

	return (
		<View
			{...props}
			{...styles.card(variant, padding, radius, disabled, props)}
		>
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
	...props
}: CardMediaProps) {
	const styles = useCardStyles();

	return (
		<View {...props} {...styles.media(aspectRatio, props)}>
			<Image source={source} resizeMode="cover" {...styles.mediaImage} />
			{children ? <View {...styles.mediaOverlay}>{children}</View> : null}
		</View>
	);
}

export type CardPartProps = ComponentPropsWithRef<typeof View>;

function CardHeader({ children, ...props }: CardPartProps) {
	const styles = useCardStyles();

	return (
		<View {...props} {...styles.header(props)}>
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

function CardContent({ children, ...props }: CardPartProps) {
	const styles = useCardStyles();

	return (
		<View {...props} {...styles.content(props)}>
			{children}
		</View>
	);
}

function CardFooter({ children, ...props }: CardPartProps) {
	const styles = useCardStyles();

	return (
		<View {...props} {...styles.footer(props)}>
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
