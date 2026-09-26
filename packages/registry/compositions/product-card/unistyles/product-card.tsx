import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type ProductCardVariant = "default" | "spotlight";

export type ProductCardProps = {
	/**
	 * `default`: outlined card, edge-to-edge media, title then price.
	 * `spotlight`: filled card, the product floats on the card's background, price first.
	 */
	variant?: ProductCardVariant;
	title: string;
	/** Already formatted, currency included: "$24.00". */
	price: string;
	subtitle?: string;
	/** A short label on the media, or above the title without media: "New", "-20%". */
	badge?: string;
	/**
	 * Usually an `Image`. It fills the card's width; give it a size or an `aspectRatio`.
	 * With `spotlight`, use a cut-out image (transparent background) and `resizeMode="contain"`.
	 */
	media?: ReactNode;
	actionLabel?: string;
	/** Shows the action button. */
	onAction?: () => void;
	/** Makes the whole card pressable, to open the product. The button keeps its own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ProductCard({
	variant = "default",
	title,
	price,
	subtitle,
	badge,
	media,
	actionLabel = "Add to cart",
	onAction,
	onPress,
	style,
}: ProductCardProps) {
	const spotlight = variant === "spotlight";
	const label = badge ? <Badge variant="highlight">{badge}</Badge> : null;
	const priceText = spotlight ? (
		<Title variant="headingSm" accessibilityRole="text">
			{price}
		</Title>
	) : (
		<Text weight="semibold" style={styles.price}>
			{price}
		</Text>
	);

	return (
		<Card
			variant={spotlight ? "filled" : "outlined"}
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${price}` : undefined}
			style={style}
		>
			{media ? (
				// Spotlight insets the media, so the product sits on the card's background.
				<View style={spotlight && styles.spotlightMedia}>
					{media}
					{label ? <View style={styles.overlay}>{label}</View> : null}
				</View>
			) : null}
			<Card.Header>
				{!media && label ? (
					<View style={styles.inline}>{label}</View>
				) : null}
				{spotlight ? priceText : null}
				{spotlight ? (
					<Text weight="medium" numberOfLines={1}>
						{title}
					</Text>
				) : (
					<Card.Title>{title}</Card.Title>
				)}
				{subtitle ? <Card.Description>{subtitle}</Card.Description> : null}
				{spotlight ? null : priceText}
			</Card.Header>
			{onAction ? (
				// Card.Content, not Card.Footer: a column, so the full-width button stretches.
				<Card.Content>
					<Button fullWidth onPress={onAction}>
						{actionLabel}
					</Button>
				</Card.Content>
			) : null}
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	overlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		padding: theme.tokens.spacing[3],
	},
	inline: {
		alignItems: "flex-start",
	},
	price: {
		marginTop: theme.tokens.spacing[1],
	},
	spotlightMedia: {
		padding: theme.tokens.spacing[4],
		paddingBottom: 0,
	},
}));
