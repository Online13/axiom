import {
	Image,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

import { useListingCardOverlayDetailedStyles } from "./listing-card-overlay-detailed.styles";

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
	/** Covers the whole card. */
	image: ImageSourcePropType;
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
	image,
	aspectRatio = 3 / 4,
	badge,
	specs,
	agent,
	meta,
	onPress,
	style,
}: ListingCardOverlayDetailedProps) {
	const styles = useListingCardOverlayDetailedStyles();

	return (
		<Card
			variant="elevated"
			padding={0}
			onPress={onPress}
			accessibilityLabel={onPress ? `${price}, ${title}` : undefined}
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
						<View {...styles.priceRow}>
							<Title
								variant="headingSm"
								accessibilityRole="text"
								{...styles.onMedia}
							>
								{price}
							</Title>
							{priceLabel ? (
								<Text variant="caption" {...styles.muted}>
									{priceLabel}
								</Text>
							) : null}
						</View>
						<View {...styles.owner}>
							<View {...styles.grow}>
								<Text
									variant="footnote"
									weight="semibold"
									numberOfLines={1}
									{...styles.onMedia}
								>
									{title}
								</Text>
								{subtitle ? (
									<Text
										variant="caption"
										numberOfLines={2}
										{...styles.muted}
									>
										{subtitle}
									</Text>
								) : null}
							</View>
							{specs?.map((spec, index) => (
								<View key={index} {...styles.spec}>
									<View {...styles.specValue}>
										{spec.icon ? (
											<Icon
												name={spec.icon}
												size="sm"
												{...styles.tint}
											/>
										) : null}
										<Text
											variant="footnote"
											weight="semibold"
											{...styles.onMedia}
										>
											{spec.value}
										</Text>
									</View>
									{spec.label ? (
										<Text variant="caption" {...styles.muted}>
											{spec.label}
										</Text>
									) : null}
								</View>
							))}
						</View>
						{agent || meta ? (
							<View {...styles.agentSection}>
								<Separator {...styles.line} />
								<View {...styles.agent}>
									{agent ? (
										<>
											<Avatar
												source={agent.avatar}
												name={agent.name}
												size="xs"
												colorFromName
											/>
											<Text
												variant="caption"
												numberOfLines={1}
												{...styles.muted}
											>
												By{" "}
												<Text weight="semibold" {...styles.onMedia}>
													{agent.name}
												</Text>
											</Text>
										</>
									) : null}
									{meta ? (
										<Text variant="caption" {...styles.muted}>
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
