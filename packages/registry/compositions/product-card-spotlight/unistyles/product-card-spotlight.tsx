import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type ProductCardSpotlightProps = {
	title: string;
	/** Already formatted, currency included: "$24.00". Shown first, as a heading. */
	price: string;
	subtitle?: string;
	/** A short label on the product: "New", "-20%". */
	badge?: string;
	/**
	 * A cut-out `Image` (transparent background) with `resizeMode="contain"`, so the product
	 * floats on the card's background. Give it a size or an `aspectRatio`.
	 */
	media: ReactNode;
	actionLabel?: string;
	/** Shows the action button. */
	onAction?: () => void;
	/** Makes the whole card pressable, to open the product. The button keeps its own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ProductCardSpotlight({
	title,
	price,
	subtitle,
	badge,
	media,
	actionLabel = "Add to cart",
	onAction,
	onPress,
	style,
}: ProductCardSpotlightProps) {
	return (
		<Card
			variant="filled"
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${price}` : undefined}
			style={style}
		>
			{/* Inset, no frame: the product sits on the card's background. */}
			<View style={styles.media}>
				{media}
				{badge ? (
					<View style={styles.overlay}>
						<Badge variant="highlight">{badge}</Badge>
					</View>
				) : null}
			</View>
			<Card.Header>
				<Title variant="headingSm" accessibilityRole="text">
					{price}
				</Title>
				<Text weight="medium" numberOfLines={1}>
					{title}
				</Text>
				{subtitle ? <Card.Description>{subtitle}</Card.Description> : null}
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
	media: {
		padding: theme.tokens.spacing[4],
		paddingBottom: 0,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		padding: theme.tokens.spacing[3],
	},
}));
