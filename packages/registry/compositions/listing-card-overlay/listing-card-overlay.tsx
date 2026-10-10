import { Fragment } from "react";
import {
	Image,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { useListingCardOverlayStyles } from "./listing-card-overlay.styles";

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
	const styles = useListingCardOverlayStyles();

	return (
		<Card
			variant="elevated"
			padding={0}
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${price}` : undefined}
			style={style}
		>
			<View style={{ aspectRatio }}>
				<Image source={image} resizeMode="cover" {...styles.photo} />
				<View {...styles.scrim} />
				{/* Nothing in it is pressable: presses go through to the card. */}
				<View {...styles.content}>
					{badge ? (
						<Badge variant="highlight" {...styles.badge}>
							{badge}
						</Badge>
					) : (
						<View />
					)}
					<View {...styles.details}>
						<View {...styles.heading}>
							<Title
								variant="headingSm"
								numberOfLines={1}
								{...styles.title}
							>
								{title}
							</Title>
							<Title
								variant="headingSm"
								accessibilityRole="text"
								{...styles.onMedia}
							>
								{price}
							</Title>
						</View>
						{subtitle ? (
							<Text variant="bodySm" numberOfLines={1} {...styles.muted}>
								{subtitle}
							</Text>
						) : null}
						{specs?.length ? (
							<View {...styles.specSection}>
								<Separator {...styles.line} />
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
							</View>
						) : null}
					</View>
				</View>
			</View>
		</Card>
	);
}
