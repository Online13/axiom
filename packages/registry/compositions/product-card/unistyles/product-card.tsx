import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export type ProductCardProps = {
	title: string;
	/** Already formatted, currency included: "$24.00". */
	price: string;
	subtitle?: string;
	/** A short label on the media, or above the title without media: "New", "-20%". */
	badge?: string;
	/** Usually an `Image`. It fills the card's width; give it a size or an `aspectRatio`. */
	media?: ReactNode;
	actionLabel?: string;
	/** Shows the action button. */
	onAction?: () => void;
	/** Makes the whole card pressable, to open the product. The button keeps its own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ProductCard({
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
	const label = badge ? <Badge variant="highlight">{badge}</Badge> : null;

	return (
		<Card
			variant="outlined"
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${price}` : undefined}
			style={style}
		>
			{media ? (
				<View>
					{media}
					{label ? <View style={styles.overlay}>{label}</View> : null}
				</View>
			) : null}
			<Card.Header>
				{!media && label ? (
					<View style={styles.inline}>{label}</View>
				) : null}
				<Card.Title>{title}</Card.Title>
				{subtitle ? <Card.Description>{subtitle}</Card.Description> : null}
				<Text weight="semibold" style={styles.price}>
					{price}
				</Text>
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
}));
