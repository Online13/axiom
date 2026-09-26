import { Fragment } from "react";
import {
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";

export type RecipeStat = {
	/** An icon of your registry: add `timer`, `servings`… to `icons.tsx` first. */
	icon?: IconName;
	/** Shown in semibold: "20". */
	value: string;
	/** Shown after the value: "mins". */
	label?: string;
};

export type RecipeCardProps = {
	title: string;
	description?: string;
	image: ImageSourcePropType;
	/** A short label on the image: "Spicy", "Quick". */
	badge?: string;
	/** Time, servings, difficulty. Three fit on one line. */
	stats?: RecipeStat[];
	ingredients?: string[];
	/** Ingredients shown as chips; the rest are counted in a "+n" chip. */
	maxIngredients?: number;
	actionLabel?: string;
	/** Shows the action button. */
	onAction?: () => void;
	/** Makes the whole card pressable, to open the recipe. The button keeps its own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

/** Designed for a vertical feed: it takes the full width of its list, one recipe per row. */
export function RecipeCard({
	title,
	description,
	image,
	badge,
	stats,
	ingredients,
	maxIngredients = 2,
	actionLabel = "Start cooking",
	onAction,
	onPress,
	style,
}: RecipeCardProps) {
	const shown = ingredients?.slice(0, maxIngredients) ?? [];
	const hidden = (ingredients?.length ?? 0) - shown.length;

	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={onPress ? title : undefined}
			style={style}
		>
			<Card.Media source={image} aspectRatio={4 / 3}>
				{badge ? <Badge variant="highlight">{badge}</Badge> : null}
			</Card.Media>
			<Card.Header>
				<Card.Title>{title}</Card.Title>
				{description ? (
					<Text variant="bodySm" color="muted" numberOfLines={2}>
						{description}
					</Text>
				) : null}
			</Card.Header>
			{stats?.length ? (
				<Card.Content style={styles.section}>
					<Separator variant="subtle" />
					<View style={styles.stats}>
						{stats.map((stat, index) => (
							<Fragment key={index}>
								{index > 0 ? (
									<Separator orientation="vertical" variant="subtle" />
								) : null}
								<View style={styles.stat}>
									{stat.icon ? (
										<Icon name={stat.icon} size="sm" color="muted" />
									) : null}
									<Text variant="footnote" color="muted" numberOfLines={1}>
										<Text weight="semibold" color="default">
											{stat.value}
										</Text>
										{stat.label ? ` ${stat.label}` : null}
									</Text>
								</View>
							</Fragment>
						))}
					</View>
					<Separator variant="subtle" />
				</Card.Content>
			) : null}
			{shown.length ? (
				<Card.Content style={styles.ingredients}>
					{shown.map((ingredient) => (
						<Chip key={ingredient} variant="filled" size="sm">
							{ingredient}
						</Chip>
					))}
					{hidden > 0 ? (
						<Chip
							variant="filled"
							size="sm"
							accessibilityLabel={`${hidden} more ingredients`}
						>
							{`+${hidden}`}
						</Chip>
					) : null}
				</Card.Content>
			) : null}
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
	section: {
		gap: theme.tokens.spacing[3],
	},

	stats: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	stat: {
		gap: theme.tokens.spacing[1],
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
	},
	ingredients: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		flexWrap: "wrap",
	},
}));
