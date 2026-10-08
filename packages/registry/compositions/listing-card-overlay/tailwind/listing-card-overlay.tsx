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
import { useTheme } from "@/theme";

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
	const { tokens } = useTheme();

	return (
		<Card
			variant="elevated"
			padding={0}
			onPress={onPress}
			accessibilityLabel={onPress ? `${title}, ${price}` : undefined}
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
							style={{ gap: tokens.spacing[2] }}
						>
							<Title
								variant="headingSm"
								numberOfLines={1}
								style={{ color: ON_MEDIA.text, flex: 1 }}
							>
								{title}
							</Title>
							<Title
								variant="headingSm"
								accessibilityRole="text"
								style={{ color: ON_MEDIA.text }}
							>
								{price}
							</Title>
						</View>
						{subtitle ? (
							<Text
								variant="bodySm"
								numberOfLines={1}
								style={{ color: ON_MEDIA.muted }}
							>
								{subtitle}
							</Text>
						) : null}
						{specs?.length ? (
							<View
								style={{ gap: tokens.spacing[3], marginTop: tokens.spacing[2] }}
							>
								<Separator style={{ backgroundColor: ON_MEDIA.line }} />
								<View className="flex-row justify-between">
									{specs.map((spec, index) => (
										<Fragment key={index}>
											{index > 0 ? (
												<Separator
													orientation="vertical"
													style={{ backgroundColor: ON_MEDIA.line }}
												/>
											) : null}
											<View
												className="flex-row items-center"
												style={{ gap: tokens.spacing[1] }}
											>
												{spec.icon ? (
													<Icon
														name={spec.icon}
														size="sm"
														color={ON_MEDIA.muted}
													/>
												) : null}
												<Text
													variant="footnote"
													numberOfLines={1}
													style={{ color: ON_MEDIA.muted }}
												>
													<Text
														weight="semibold"
														style={{ color: ON_MEDIA.text }}
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

// The scrim keeps the photo dark behind the text in both schemes, so the text on it is always white.
const ON_MEDIA = {
	text: "hsla(0, 0%, 100%, 1)",
	muted: "hsla(0, 0%, 100%, 0.75)",
	line: "hsla(0, 0%, 100%, 0.25)",
};

const SCRIM =
	"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 45%, hsla(0, 0%, 0%, 0.8))";
