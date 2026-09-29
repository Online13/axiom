import { Fragment } from "react";
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
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { metrics } from "@/theme/tokens";

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
	/** Covers the whole card. */
	image: ImageSourcePropType;
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
	image,
	aspectRatio = 3 / 4,
	badge,
	specs,
	actionLabel = "Reserve now",
	onAction,
	onPress,
	style,
}: ListingCardBookingProps) {
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
				<Image
					source={image}
					resizeMode="cover"
					style={styles.photo}
				/>
				<View style={styles.scrim} />
				{/* Only the button takes touches: presses elsewhere go through to the card. */}
				<View style={styles.content}>
					{badge ? (
						<Badge variant="highlight" style={styles.badge}>
							{badge}
						</Badge>
					) : (
						<View />
					)}
					<View style={styles.passThrough}>
						<View style={styles.details}>
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
									style={styles.specs}
								>
									{specs.map((spec, index) => (
										<Fragment key={index}>
											{index > 0 ? (
												<Separator orientation="vertical" style={styles.line} />
											) : null}
											<View style={styles.spec}>
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
							style={styles.actions}
						>
							<View
								style={styles.pill}
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
								pressScale={metrics.pressScale}
								accessibilityLabel={`${actionLabel}, ${title}`}
								style={styles.action}
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

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always white.
const ON_MEDIA = {
	text: "hsla(0, 0%, 100%, 1)",
	muted: "hsla(0, 0%, 100%, 0.75)",
	line: "hsla(0, 0%, 100%, 0.25)",
	fill: "hsla(0, 0%, 100%, 0.2)",
	ink: "hsla(0, 0%, 0%, 1)",
};

const styles = StyleSheet.create((theme) => ({
	details: {
		gap: theme.tokens.spacing[1],
		pointerEvents: "none",
	},
	spec: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: theme.tokens.spacing[2],
		marginTop: theme.tokens.spacing[4],
		pointerEvents: "box-none",
	},

	// A bundled image defaults to its file's pixel size: absoluteFill alone does not stretch it.
	photo: {
		...StyleSheet.absoluteFill,
		width: "100%",
		height: "100%",
	},
	scrim: {
		...StyleSheet.absoluteFillObject,
		pointerEvents: "none",
		experimental_backgroundImage:
			"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 40%, hsla(0, 0%, 0%, 0.85))",
	},
	content: {
		padding: theme.tokens.spacing[4],
		...StyleSheet.absoluteFillObject,
		justifyContent: "space-between",
		alignItems: "stretch",
		pointerEvents: "box-none",
	},
	passThrough: {
		pointerEvents: "box-none",
	},
	badge: {
		alignSelf: "flex-start",
		pointerEvents: "none",
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
		gap: theme.tokens.spacing[3],
		marginTop: theme.tokens.spacing[2],
		flexDirection: "row",
		justifyContent: "space-between",
	},
	pill: {
		minHeight: theme.tokens.sizes.control.md,
		paddingHorizontal: theme.tokens.spacing[4],
		borderRadius: theme.tokens.radius.full,
		pointerEvents: "none",
		justifyContent: "center",
		backgroundColor: ON_MEDIA.fill,
	},
	action: {
		borderRadius: theme.tokens.radius.full,
		backgroundColor: ON_MEDIA.text,
	},
	actionLabel: {
		color: ON_MEDIA.ink,
	},
}));
