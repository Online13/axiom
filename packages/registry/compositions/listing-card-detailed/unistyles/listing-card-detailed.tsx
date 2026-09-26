import { Fragment, useState } from "react";
import {
	Image,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

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
	/** One photo, or several to swipe through. */
	images: ImageSourcePropType[];
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
	images,
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
	const [photo, setPhoto] = useState(0);
	const renderPhoto = (source: ImageSourcePropType) => (
		<Image source={source} resizeMode="cover" style={{ aspectRatio }} />
	);

	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={onPress ? `${price}, ${title}` : undefined}
			style={style}
		>
			<View>
				{images.length > 1 ? (
					<Carousel
						data={images}
						contentInset={0}
						gap={0}
						onIndexChange={setPhoto}
						accessibilityLabel="Photos"
						renderItem={({ item }) => renderPhoto(item)}
					/>
				) : (
					renderPhoto(images[0])
				)}
				<View style={styles.mediaOverlay}>
					{badge ? <Badge variant="highlight">{badge}</Badge> : <View />}
					{images.length > 1 ? (
						<Dots count={images.length} active={photo} />
					) : null}
				</View>
			</View>
			<Card.Header>
				<View style={styles.priceRow}>
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
				<Card.Content style={styles.section}>
					<Separator variant="subtle" />
					<View style={styles.specs}>
						{specs.map((spec, index) => (
							<Fragment key={index}>
								{index > 0 ? (
									<Separator orientation="vertical" variant="subtle" />
								) : null}
								<View style={styles.spec}>
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
				<Card.Content style={styles.agent}>
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

/** Photos stay the same in both schemes, so the dots on them are always white. */
function Dots({ count, active }: { count: number; active: number }) {
	return (
		<View
			accessible
			accessibilityLabel={`Photo ${active + 1} of ${count}`}
			style={styles.dots}
		>
			{Array.from({ length: count }, (_, index) => (
				<View
					key={index}
					style={[styles.dot, index === active && styles.dotActive]}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	section: {
		gap: theme.tokens.spacing[3],
	},
	priceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	spec: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	agent: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},

	mediaOverlay: {
		padding: theme.tokens.spacing[3],
		...StyleSheet.absoluteFillObject,
		alignItems: "flex-start",
		justifyContent: "space-between",
		pointerEvents: "none",
	},
	grow: {
		flex: 1,
	},
	specs: {
		gap: theme.tokens.spacing[4],
		flexDirection: "row",
	},
	dots: {
		flexDirection: "row",
		alignSelf: "center",
		gap: 4,
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "hsla(0, 0%, 100%, 0.5)",
	},
	dotActive: {
		width: 14,
		backgroundColor: "hsla(0, 0%, 100%, 1)",
	},
}));
