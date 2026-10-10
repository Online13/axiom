import { Fragment } from "react";
import {
	Image,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { useListingCardBookingStyles } from "./listing-card-booking.styles";

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
	const styles = useListingCardBookingStyles();

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
				<Image source={image} resizeMode="cover" {...styles.photo} />
				<View {...styles.scrim} />
				{/* Only the button takes touches: presses elsewhere go through to the card. */}
				<View {...styles.content}>
					{badge ? (
						<Badge variant="highlight" {...styles.badge}>
							{badge}
						</Badge>
					) : (
						<View />
					)}
					<View {...styles.passThrough}>
						<View {...styles.details}>
							<Title
								variant="headingSm"
								numberOfLines={1}
								{...styles.onMedia}
							>
								{title}
							</Title>
							{subtitle ? (
								<Text
									variant="bodySm"
									numberOfLines={1}
									{...styles.muted}
								>
									{subtitle}
								</Text>
							) : null}
							{specs?.length ? (
								<View {...styles.specs}>
									{specs.map((spec, index) => (
										<Fragment key={index}>
											{index > 0 ? (
												<Separator
													orientation="vertical"
													{...styles.line}
												/>
											) : null}
											<View {...styles.spec}>
												{spec.icon ? (
													<Icon
														name={spec.icon}
														size="sm"
														{...styles.tint}
													/>
												) : null}
												<Text
													variant="footnote"
													numberOfLines={1}
													{...styles.muted}
												>
													<Text
														weight="semibold"
														{...styles.onMedia}
													>
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
						<View {...styles.actions}>
							<View {...styles.pill}>
								<Text weight="semibold" {...styles.onMedia}>
									{price}
									{priceUnit ? (
										<Text variant="caption" {...styles.muted}>
											{priceUnit}
										</Text>
									) : null}
								</Text>
							</View>
							{/* A light button on the dark scrim, in both schemes. */}
							<Button
								onPress={onAction}
								accessibilityLabel={`${actionLabel}, ${title}`}
								{...styles.action}
							>
								<Text weight="semibold" {...styles.actionLabel}>
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
