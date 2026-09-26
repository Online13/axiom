import { Fragment, useState } from "react";
import {
	Image,
	StyleSheet,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

export type ListingSpec = {
	/** An icon of your registry: add `bed`, `bath`… to `icons.tsx` first. */
	icon?: IconName;
	/** Shown in semibold: "2". */
	value: string;
	/** Shown after the value: "Beds". */
	label?: string;
};

export type ListingCardBookingProps = {
	title: string;
	subtitle?: string;
	/** Already formatted, currency included: "$620". Shown in a pill next to the button. */
	price: string;
	/** Shown small after the price: "/night". */
	priceUnit?: string;
	/** One photo, or several to swipe through. They cover the whole card. */
	images: ImageSourcePropType[];
	/** Of the whole card. Portrait by default. */
	aspectRatio?: number;
	/** A short label on the photo: "Rare find". */
	badge?: string;
	/** Beds, baths, area. Three fit on one line. */
	specs?: ListingSpec[];
	actionLabel?: string;
	onAction: () => void;
	/** Makes the whole card pressable, to open the listing. The button keeps its own press. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ListingCardBooking({
	title,
	subtitle,
	price,
	priceUnit,
	images,
	aspectRatio = 3 / 4,
	badge,
	specs,
	actionLabel = "Reserve now",
	onAction,
	onPress,
	style,
}: ListingCardBookingProps) {
	const { tokens } = useTheme();
	const [photo, setPhoto] = useState(0);

	return (
		<Card
			variant="elevated"
			padding={0}
			onPress={onPress}
			accessibilityLabel={
				onPress ? `${title}, ${price}${priceUnit ?? ""}` : undefined
			}
			style={style}
		>
			<View style={{ aspectRatio }}>
				{images.length > 1 ? (
					<Carousel
						data={images}
						contentInset={0}
						gap={0}
						onIndexChange={setPhoto}
						accessibilityLabel="Photos"
						renderItem={({ item }) => (
							<Image source={item} resizeMode="cover" style={{ aspectRatio }} />
						)}
						style={StyleSheet.absoluteFill}
					/>
				) : (
					<Image
						source={images[0]}
						resizeMode="cover"
						style={StyleSheet.absoluteFill}
					/>
				)}
				<View style={styles.scrim} />
				{/* Only the button takes touches: swipes elsewhere go through to the photos. */}
				<View style={[styles.content, { padding: tokens.spacing[4] }]}>
					{badge ? (
						<Badge variant="highlight" style={styles.badge}>
							{badge}
						</Badge>
					) : (
						<View />
					)}
					<View style={styles.passThrough}>
						<View style={[styles.noTouch, { gap: tokens.spacing[1] }]}>
							{images.length > 1 ? (
								<Dots count={images.length} active={photo} />
							) : null}
							<Title variant="headingSm" numberOfLines={1} style={styles.onMedia}>
								{title}
							</Title>
							{subtitle ? (
								<Text variant="bodySm" numberOfLines={1} style={styles.muted}>
									{subtitle}
								</Text>
							) : null}
							{specs?.length ? (
								<View
									style={[
										styles.specs,
										{ gap: tokens.spacing[3], marginTop: tokens.spacing[2] },
									]}
								>
									{specs.map((spec, index) => (
										<Fragment key={index}>
											{index > 0 ? (
												<Separator orientation="vertical" style={styles.line} />
											) : null}
											<View style={[styles.row, { gap: tokens.spacing[1] }]}>
												{spec.icon ? (
													<Icon name={spec.icon} size="sm" color={ON_MEDIA.muted} />
												) : null}
												<Text variant="footnote" numberOfLines={1} style={styles.muted}>
													<Text weight="semibold" style={styles.onMedia}>
														{spec.value}
													</Text>
													{spec.label ? ` ${spec.label}` : null}
												</Text>
											</View>
										</Fragment>
									))}
								</View>
							) : null}
						</View>
						<View
							style={[
								styles.row,
								styles.passThrough,
								{ gap: tokens.spacing[2], marginTop: tokens.spacing[4] },
							]}
						>
							<View
								style={[
									styles.pill,
									styles.noTouch,
									{
										minHeight: tokens.sizes.control.md,
										paddingHorizontal: tokens.spacing[4],
										borderRadius: tokens.radius.full,
									},
								]}
							>
								<Text weight="semibold" style={styles.onMedia}>
									{price}
									{priceUnit ? (
										<Text variant="caption" style={styles.muted}>
											{priceUnit}
										</Text>
									) : null}
								</Text>
							</View>
							{/* A light button on the dark scrim, in both schemes. */}
							<Button
								onPress={onAction}
								pressScale={tokens.metrics.pressScale}
								accessibilityLabel={`${actionLabel}, ${title}`}
								style={[styles.grow, styles.action, { borderRadius: tokens.radius.full }]}
							>
								<Text weight="semibold" style={styles.actionLabel}>
									{actionLabel}
								</Text>
							</Button>
						</View>
					</View>
				</View>
			</View>
		</Card>
	);
}

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

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always white.
const ON_MEDIA = {
	text: "hsla(0, 0%, 100%, 1)",
	muted: "hsla(0, 0%, 100%, 0.75)",
	line: "hsla(0, 0%, 100%, 0.25)",
	dot: "hsla(0, 0%, 100%, 0.5)",
	fill: "hsla(0, 0%, 100%, 0.2)",
	ink: "hsla(0, 0%, 0%, 1)",
};

const styles = StyleSheet.create({
	scrim: {
		...StyleSheet.absoluteFill,
		pointerEvents: "none",
		experimental_backgroundImage:
			"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 40%, hsla(0, 0%, 0%, 0.85))",
	},
	content: {
		...StyleSheet.absoluteFill,
		justifyContent: "space-between",
		alignItems: "stretch",
		pointerEvents: "box-none",
	},
	passThrough: {
		pointerEvents: "box-none",
	},
	noTouch: {
		pointerEvents: "none",
	},
	badge: {
		alignSelf: "flex-start",
		pointerEvents: "none",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
	onMedia: {
		color: ON_MEDIA.text,
	},
	muted: {
		color: ON_MEDIA.muted,
	},
	line: {
		backgroundColor: ON_MEDIA.line,
	},
	specs: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	pill: {
		justifyContent: "center",
		backgroundColor: ON_MEDIA.fill,
	},
	action: {
		backgroundColor: ON_MEDIA.text,
	},
	actionLabel: {
		color: ON_MEDIA.ink,
	},
	dots: {
		flexDirection: "row",
		alignSelf: "center",
		gap: 4,
		marginBottom: 8,
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: ON_MEDIA.dot,
	},
	dotActive: {
		width: 14,
		backgroundColor: ON_MEDIA.text,
	},
});
