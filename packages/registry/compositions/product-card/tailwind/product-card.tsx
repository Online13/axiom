import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

export type ProductCardProps = {
	title: string;
	/** Already formatted, currency included: "$24.00". */
	price: string;
	subtitle?: string;
	/** A short label on the media, or above the title without media: "New", "-20%". */
	badge?: string;
	/**
	 * Usually an `Image` with `width: "100%"` and `flex: 1`: the card is 3:4 with media, the text keeps
	 * its height and the image fills the rest. Set the card's width with `style`.
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
	const { tokens } = useTheme();
	const label = badge ? <Badge variant="highlight">{badge}</Badge> : null;

	return (
		<Card
			variant="outlined"
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${price}` : undefined}
			// Width:height, with media. The width comes from the caller.
			style={[media ? { aspectRatio: 3 / 4 } : undefined, style]}
		>
			{media ? (
				// Takes the height the text leaves.
				<View className="grow">
					{media}
					{label ? (
						<View
							className="absolute inset-0 items-start"
							style={{ padding: tokens.spacing[3] }}
						>
							{label}
						</View>
					) : null}
				</View>
			) : null}
			<Card.Header>
				{!media && label ? <View className="items-start">{label}</View> : null}
				<Card.Title>{title}</Card.Title>
				{subtitle ? <Card.Description>{subtitle}</Card.Description> : null}
				<Text weight="semibold" style={{ marginTop: tokens.spacing[1] }}>
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
