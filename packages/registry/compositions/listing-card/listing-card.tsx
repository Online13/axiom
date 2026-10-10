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

import { useListingCardStyles } from "./listing-card.styles";

export type ListingSpec = {
	/** An icon of your registry: add `bed`, `bath`… to `icons.tsx` first. */
	icon?: IconName;
	/** Shown in semibold: "2". */
	value: string;
	/** Shown after the value: "Beds". */
	label?: string;
};

export type ListingCardProps = {
	title: string;
	/** Already formatted, currency included: "$3,679". */
	price: string;
	/** Shown small after the price: "/mo", "/night". */
	priceUnit?: string;
	subtitle?: string;
	image: ImageSourcePropType;
	aspectRatio?: number;
	/** A short label on the photo: "Guest favorite", "New". */
	badge?: string;
	/** Beds, baths, area. Three fit on one line. */
	specs?: ListingSpec[];
	/** Makes the whole card pressable, to open the listing. */
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function ListingCard({
	title,
	price,
	priceUnit,
	subtitle,
	image,
	aspectRatio = 4 / 3,
	badge,
	specs,
	onPress,
	style,
}: ListingCardProps) {
	const styles = useListingCardStyles();

	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={
				onPress ? `${title}, ${price}${priceUnit ?? ""}` : undefined
			}
			style={style}
		>
			<View style={{ aspectRatio }}>
				<Image source={image} resizeMode="cover" {...styles.photo} />
				<View {...styles.mediaOverlay}>
					{badge ? <Badge variant="highlight">{badge}</Badge> : null}
				</View>
			</View>
			<Card.Header>
				<View {...styles.heading}>
					<Title variant="subheading" numberOfLines={1} {...styles.title}>
						{title}
					</Title>
					<Text weight="semibold">
						{price}
						{priceUnit ? (
							<Text variant="caption" color="muted">
								{priceUnit}
							</Text>
						) : null}
					</Text>
				</View>
				{subtitle ? (
					<Text variant="bodySm" color="muted" numberOfLines={1}>
						{subtitle}
					</Text>
				) : null}
			</Card.Header>
			{specs?.length ? (
				<Card.Content {...styles.section}>
					<Separator variant="subtle" />
					<View {...styles.specs}>
						{specs.map((spec, index) => (
							<Fragment key={index}>
								{index > 0 ? (
									<Separator orientation="vertical" variant="subtle" />
								) : null}
								<View {...styles.spec}>
									{spec.icon ? (
										<Icon name={spec.icon} size="sm" color="muted" />
									) : null}
									<Text
										variant="footnote"
										color="muted"
										numberOfLines={1}
									>
										<Text weight="semibold" color="default">
											{spec.value}
										</Text>
										{spec.label ? ` ${spec.label}` : null}
									</Text>
								</View>
							</Fragment>
						))}
					</View>
				</Card.Content>
			) : null}
		</Card>
	);
}
