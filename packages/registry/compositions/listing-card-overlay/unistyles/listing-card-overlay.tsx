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
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

export type ListingSpec = {
	/** An icon of your registry: add `bed`, `bath`… to `icons.tsx` first. */
	icon?: IconName;
	/** Shown in semibold: "2". */
	value: string;
	/** Shown after the value: "Beds". */
	label?: string;
};

export type ListingCardOverlayProps = {
	title: string;
	/** Already formatted, currency included: "$200k". */
	price: string;
	subtitle?: string;
	/** Covers the whole card. */
	image: ImageSourcePropType;
	/** Of the whole card. Portrait by default. */
	aspectRatio?: number;
	/** A short label on the photo: "Newly listed". */
	badge?: string;
	/** Beds, baths, area. Three fit on one line. */
	specs?: ListingSpec[];
	/** Makes the whole card pressable, to open the listing. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ListingCardOverlay({
	title,
	price,
	subtitle,
	image,
	aspectRatio = 3 / 4,
	badge,
	specs,
	onPress,
	style,
}: ListingCardOverlayProps) {
	return (
		<Card
			variant="elevated"
			padding={0}
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${price}` : undefined}
			style={style}
		>
			<View style={{ aspectRatio }}>
				<Image
					source={image}
					resizeMode="cover"
					style={styles.photo}
				/>
				<View style={styles.scrim} />
				{/* Nothing in it is pressable: presses go through to the card. */}
				<View style={styles.content}>
					{badge ? (
						<Badge variant="highlight" style={styles.badge}>
							{badge}
						</Badge>
					) : (
						<View />
					)}
					<View style={styles.details}>
						<View style={styles.heading}>
							<Title
								variant="headingSm"
								numberOfLines={1}
								style={[styles.onMedia, styles.grow]}
							>
								{title}
							</Title>
							<Title
								variant="headingSm"
								accessibilityRole="text"
								style={styles.onMedia}
							>
								{price}
							</Title>
						</View>
						{subtitle ? (
							<Text variant="bodySm" numberOfLines={1} style={styles.muted}>
								{subtitle}
							</Text>
						) : null}
						{specs?.length ? (
							<View style={styles.specSection}>
								<Separator style={styles.line} />
								<View style={styles.specs}>
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
							</View>
						) : null}
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
};

const styles = StyleSheet.create((theme) => ({
	details: {
		gap: theme.tokens.spacing[1],
	},
	heading: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	specSection: {
		gap: theme.tokens.spacing[3],
		marginTop: theme.tokens.spacing[2],
	},
	spec: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[1],
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
			"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 45%, hsla(0, 0%, 0%, 0.8))",
	},
	content: {
		padding: theme.tokens.spacing[4],
		...StyleSheet.absoluteFillObject,
		justifyContent: "space-between",
		alignItems: "stretch",
		pointerEvents: "none",
	},
	badge: {
		alignSelf: "flex-start",
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
}));
