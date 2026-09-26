import {
	Image,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type OfferCardProps = {
	/** Name of the product: "Sapphire Travel card". */
	title: string;
	/** The main benefit, in large type: "5% back on travel". */
	benefit: string;
	/** The card art or the offer visual, drawn with the proportions of a bank card. */
	image?: ImageSourcePropType;
	/** Tag above the title: "Limited offer". */
	badge?: string;
	/** Short selling points under the benefit, each after a check. Three read well. */
	highlights?: string[];
	/** The cost, in the footer: "$0 the first year". */
	fee?: string;
	/** Above the fee: "Annual fee". */
	feeLabel?: string;
	actionLabel?: string;
	/** Shows the action button in the footer. */
	onAction?: () => void;
	/** Makes the whole card pressable, to open the offer. The button keeps its own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

// ISO/IEC 7810 ID-1, the size of every bank card.
const CARD_RATIO = 85.6 / 53.98;
const ART_WIDTH = 96;

export function OfferCard({
	title,
	benefit,
	image,
	badge,
	highlights,
	fee,
	feeLabel = "Annual fee",
	actionLabel = "Apply now",
	onAction,
	onPress,
	style,
}: OfferCardProps) {
	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${benefit}` : undefined}
			style={style}
		>
			<Card.Header style={styles.header}>
				{image ? (
					<Image
						source={image}
						accessibilityIgnoresInvertColors
						style={styles.art}
					/>
				) : null}
				<View style={styles.intro}>
					{badge ? (
						<View style={styles.start}>
							<Badge variant="highlight" size="sm">
								{badge}
							</Badge>
						</View>
					) : null}
					<Text variant="bodySm" color="muted" numberOfLines={1}>
						{title}
					</Text>
					<Title variant="headingSm" numberOfLines={2}>
						{benefit}
					</Title>
				</View>
			</Card.Header>
			{highlights?.length ? (
				<Card.Content style={styles.highlights}>
					{highlights.map((highlight, index) => (
						<View key={index} style={styles.row}>
							<Icon name="check" size="sm" color="success" />
							<Text variant="bodySm" style={styles.grow}>
								{highlight}
							</Text>
						</View>
					))}
				</Card.Content>
			) : null}
			{fee || onAction ? (
				<Card.Footer style={styles.footer}>
					<View accessible={fee !== undefined} style={styles.grow}>
						{fee ? (
							<>
								<Text variant="caption" color="muted">
									{feeLabel}
								</Text>
								<Text weight="semibold" numberOfLines={1}>
									{fee}
								</Text>
							</>
						) : null}
					</View>
					{onAction ? (
						<Button
							size="sm"
							onPress={onAction}
							accessibilityLabel={`${actionLabel}, ${title}`}
						>
							{actionLabel}
						</Button>
					) : null}
				</Card.Footer>
			) : null}
		</Card>
	);
}

const styles = StyleSheet.create((theme) => ({
	header: {
		gap: theme.tokens.spacing[4],
		flexDirection: "row",
		alignItems: "center",
	},
	art: {
		width: ART_WIDTH,
		aspectRatio: CARD_RATIO,
		borderRadius: theme.tokens.radius.md,
	},
	intro: {
		gap: theme.tokens.spacing[1],
		flex: 1,
	},
	start: {
		flexDirection: "row",
	},
	highlights: {
		gap: theme.tokens.spacing[2],
	},
	row: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	footer: {
		gap: theme.tokens.spacing[3],
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
