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
	const { tokens } = useTheme();

	return (
		<Card
			variant="elevated"
			padding={0}
			onPress={onPress}
			accessibilityLabel={onPress ? `${price}, ${title}` : undefined}
			style={style}
		>
			<View style={{ aspectRatio }}>
				{/* A bundled image defaults to its file's pixel size: absolute inset-0 alone does not stretch it. */}
				<Image
					source={image}
					resizeMode="cover"
					className="absolute inset-0 w-full h-full"
				/>
				<View
					className="absolute inset-0"
					style={{ pointerEvents: "none", experimental_backgroundImage: SCRIM }}
				/>
				{/* Nothing in it is pressable: presses go through to the card. */}
				<View
					className="absolute inset-0 justify-between items-stretch"
					style={{ pointerEvents: "none", padding: tokens.spacing[4] }}
				>
					{badge ? (
						<Badge variant="highlight" style={{ alignSelf: "flex-start" }}>
							{badge}
						</Badge>
					) : (
						<View />
					)}
					<View style={{ gap: tokens.spacing[1] }}>
						<View
							className="flex-row items-center"
							style={{ gap: tokens.spacing[1] }}
						>
							<Title
								variant="headingSm"
								accessibilityRole="text"
								style={{ color: ON_MEDIA.text }}
							>
								{price}
							</Title>
							{priceLabel ? (
								<Text variant="caption" style={{ color: ON_MEDIA.muted }}>
									{priceLabel}
								</Text>
							) : null}
						</View>
						<View
							className="flex-row items-center"
							style={{ gap: tokens.spacing[3] }}
						>
							<View className="flex-1">
								<Text
									variant="footnote"
									weight="semibold"
									numberOfLines={1}
									style={{ color: ON_MEDIA.text }}
								>
									{title}
								</Text>
								{subtitle ? (
									<Text
										variant="caption"
										numberOfLines={2}
										style={{ color: ON_MEDIA.muted }}
									>
										{subtitle}
									</Text>
								) : null}
							</View>
							{specs?.map((spec, index) => (
								<View key={index} className="items-center">
									<View
										className="flex-row items-center"
										style={{ gap: tokens.spacing[1] }}
									>
										{spec.icon ? (
											<Icon name={spec.icon} size="sm" color={ON_MEDIA.text} />
										) : null}
										<Text
											variant="footnote"
											weight="semibold"
											style={{ color: ON_MEDIA.text }}
										>
											{spec.value}
										</Text>
									</View>
									{spec.label ? (
										<Text variant="caption" style={{ color: ON_MEDIA.muted }}>
											{spec.label}
										</Text>
									) : null}
								</View>
							))}
						</View>
						{agent || meta ? (
							<View
								style={{ gap: tokens.spacing[3], marginTop: tokens.spacing[2] }}
							>
								<Separator style={{ backgroundColor: ON_MEDIA.line }} />
								<View
									className="flex-row items-center"
									style={{ gap: tokens.spacing[2] }}
								>
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
												style={{ color: ON_MEDIA.muted }}
											>
												By{" "}
												<Text
													weight="semibold"
													style={{ color: ON_MEDIA.text }}
												>
													{agent.name}
												</Text>
											</Text>
										</>
									) : null}
									{meta ? (
										<Text variant="caption" style={{ color: ON_MEDIA.muted }}>
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

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always white.
const ON_MEDIA = {
	text: "hsla(0, 0%, 100%, 1)",
	muted: "hsla(0, 0%, 100%, 0.75)",
	line: "hsla(0, 0%, 100%, 0.25)",
};

const SCRIM =
	"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 40%, hsla(0, 0%, 0%, 0.85))";
