import { Fragment } from "react";
import {
	Image,
	StyleSheet,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

export type ListingSpec = {
	/** An icon of your registry: add `area`, `rooms`… to `icons.tsx` first. */
	icon?: IconName;
	/** Shown in semibold: "29 m²". */
	value: string;
	/** Shown after the value: "Living". */
	label?: string;
};

export type ListingAgent = {
	name: string;
	avatar?: ImageSourcePropType;
};

export type ListingCardDetailedProps = {
	/** Already formatted, currency included: "$250,000". Shown first, as a heading. */
	price: string;
	/** Shown small after the price: "List price". */
	priceLabel?: string;
	/** The seller or the building: "Guillaume Briard". */
	title: string;
	/** Usually the address, after the title on the same line. */
	subtitle?: string;
	image: ImageSourcePropType;
	aspectRatio?: number;
	/** A short label on the photo: "Prime pick". */
	badge?: string;
	/** Area, rooms. Three fit on one line. */
	specs?: ListingSpec[];
	/** Who posted the listing, shown as "By name". */
	agent?: ListingAgent;
	/** Shown at the end of the agent line: "2 days ago". */
	meta?: string;
	actionLabel?: string;
	/** Shows the action button. */
	onAction?: () => void;
	/** Makes the whole card pressable, to open the listing. The button keeps its own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ListingCardDetailed({
	price,
	priceLabel,
	title,
	subtitle,
	image,
	aspectRatio = 4 / 3,
	badge,
	specs,
	agent,
	meta,
	actionLabel = "View details",
	onAction,
	onPress,
	style,
}: ListingCardDetailedProps) {
	const { tokens } = useTheme();

	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={onPress ? `${price}, ${title}` : undefined}
			style={style}
		>
			<View style={{ aspectRatio }}>
				<Image source={image} resizeMode="cover" style={styles.photo} />
				<View style={[styles.mediaOverlay, { padding: tokens.spacing[3] }]}>
					{badge ? <Badge variant="highlight">{badge}</Badge> : null}
				</View>
			</View>
			<Card.Header>
				<View style={[styles.row, { gap: tokens.spacing[1] }]}>
					<Title variant="headingSm" accessibilityRole="text">
						{price}
					</Title>
					{priceLabel ? (
						<Text variant="caption" color="muted">
							{priceLabel}
						</Text>
					) : null}
				</View>
				<Text variant="footnote" color="muted" numberOfLines={1}>
					<Text weight="semibold" color="default">
						{title}
					</Text>
					{subtitle ? ` · ${subtitle}` : null}
				</Text>
			</Card.Header>
			{specs?.length ? (
				<Card.Content style={{ gap: tokens.spacing[3] }}>
					<Separator variant="subtle" />
					<View style={[styles.specs, { gap: tokens.spacing[4] }]}>
						{specs.map((spec, index) => (
							<Fragment key={index}>
								{index > 0 ? (
									<Separator orientation="vertical" variant="subtle" />
								) : null}
								<View style={[styles.row, { gap: tokens.spacing[1] }]}>
									{spec.icon ? (
										<Icon name={spec.icon} size="sm" color="muted" />
									) : null}
									<Text variant="footnote" color="muted" numberOfLines={1}>
										<Text weight="semibold" color="default">
											{spec.value}
										</Text>
										{spec.label ? ` ${spec.label}` : null}
									</Text>
								</View>
							</Fragment>
						))}
					</View>
					<Separator variant="subtle" />
				</Card.Content>
			) : null}
			{agent || meta ? (
				<Card.Content style={[styles.row, { gap: tokens.spacing[2] }]}>
					{agent ? (
						<>
							<Avatar
								source={agent.avatar}
								name={agent.name}
								size="xs"
								colorFromName
							/>
							<Text
								variant="footnote"
								color="muted"
								numberOfLines={1}
								style={styles.grow}
							>
								By{" "}
								<Text weight="semibold" color="default">
									{agent.name}
								</Text>
							</Text>
						</>
					) : (
						<View style={styles.grow} />
					)}
					{meta ? (
						<Text variant="caption" color="muted">
							{meta}
						</Text>
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

const styles = StyleSheet.create({
	photo: {
		width: "100%",
		height: "100%",
	},
	mediaOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: "flex-start",
		justifyContent: "space-between",
		pointerEvents: "none",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
	specs: {
		flexDirection: "row",
	},
});
