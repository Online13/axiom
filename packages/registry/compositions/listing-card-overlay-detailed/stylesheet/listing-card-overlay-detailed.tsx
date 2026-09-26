import { useState } from "react";
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
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
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
	/** Shown under the value: "Living". */
	label?: string;
};

export type ListingAgent = {
	name: string;
	avatar?: ImageSourcePropType;
};

export type ListingCardOverlayDetailedProps = {
	/** Already formatted, currency included: "$250,000". Shown first, as a heading. */
	price: string;
	/** Shown small after the price: "List price". */
	priceLabel?: string;
	/** The seller or the building: "Guillaume Briard". */
	title: string;
	/** Usually the address, under the title. */
	subtitle?: string;
	/** One photo, or several to swipe through. They cover the whole card. */
	images: ImageSourcePropType[];
	/** Of the whole card. Portrait by default. */
	aspectRatio?: number;
	/** A short label on the photo: "Prime pick". */
	badge?: string;
	/** Area, rooms. Two fit next to the title. */
	specs?: ListingSpec[];
	/** Who posted the listing, shown as "By name". */
	agent?: ListingAgent;
	/** Shown after the agent: "2 days ago". */
	meta?: string;
	/** Makes the whole card pressable, to open the listing. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ListingCardOverlayDetailed({
	price,
	priceLabel,
	title,
	subtitle,
	images,
	aspectRatio = 3 / 4,
	badge,
	specs,
	agent,
	meta,
	onPress,
	style,
}: ListingCardOverlayDetailedProps) {
	const { tokens } = useTheme();
	const [photo, setPhoto] = useState(0);

	return (
		<Card
			variant="elevated"
			padding={0}
			onPress={onPress}
			accessibilityLabel={onPress ? `${price}, ${title}` : undefined}
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
				{/* Nothing in it is pressable: swipes go through to the photos. */}
				<View style={[styles.content, { padding: tokens.spacing[4] }]}>
					{badge ? (
						<Badge variant="highlight" style={styles.badge}>
							{badge}
						</Badge>
					) : (
						<View />
					)}
					<View style={{ gap: tokens.spacing[1] }}>
						{images.length > 1 ? (
							<Dots count={images.length} active={photo} />
						) : null}
						<View style={[styles.row, { gap: tokens.spacing[1] }]}>
							<Title
								variant="headingSm"
								accessibilityRole="text"
								style={styles.onMedia}
							>
								{price}
							</Title>
							{priceLabel ? (
								<Text variant="caption" style={styles.muted}>
									{priceLabel}
								</Text>
							) : null}
						</View>
						<View style={[styles.row, { gap: tokens.spacing[3] }]}>
							<View style={styles.grow}>
								<Text
									variant="footnote"
									weight="semibold"
									numberOfLines={1}
									style={styles.onMedia}
								>
									{title}
								</Text>
								{subtitle ? (
									<Text variant="caption" numberOfLines={2} style={styles.muted}>
										{subtitle}
									</Text>
								) : null}
							</View>
							{specs?.map((spec, index) => (
								<View key={index} style={styles.spec}>
									<View style={[styles.row, { gap: tokens.spacing[1] }]}>
										{spec.icon ? (
											<Icon name={spec.icon} size="sm" color={ON_MEDIA.text} />
										) : null}
										<Text variant="footnote" weight="semibold" style={styles.onMedia}>
											{spec.value}
										</Text>
									</View>
									{spec.label ? (
										<Text variant="caption" style={styles.muted}>
											{spec.label}
										</Text>
									) : null}
								</View>
							))}
						</View>
						{agent || meta ? (
							<View style={{ gap: tokens.spacing[3], marginTop: tokens.spacing[2] }}>
								<Separator style={styles.line} />
								<View style={[styles.row, { gap: tokens.spacing[2] }]}>
									{agent ? (
										<>
											<Avatar
												source={agent.avatar}
												name={agent.name}
												size="xs"
												colorFromName
											/>
											<Text variant="caption" numberOfLines={1} style={styles.muted}>
												By{" "}
												<Text weight="semibold" style={styles.onMedia}>
													{agent.name}
												</Text>
											</Text>
										</>
									) : null}
									{meta ? (
										<Text variant="caption" style={styles.muted}>
											{meta}
										</Text>
									) : null}
								</View>
							</View>
						) : null}
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
		pointerEvents: "none",
	},
	badge: {
		alignSelf: "flex-start",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
	spec: {
		alignItems: "center",
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
