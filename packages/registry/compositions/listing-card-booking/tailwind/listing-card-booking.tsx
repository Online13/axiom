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
	const { tokens } = useTheme();

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
				{/* Only the button takes touches: presses elsewhere go through to the card. */}
				<View
					className="absolute inset-0 justify-between items-stretch"
					style={{ pointerEvents: "box-none", padding: tokens.spacing[4] }}
				>
					{badge ? (
						<Badge
							variant="highlight"
							style={{ alignSelf: "flex-start", pointerEvents: "none" }}
						>
							{badge}
						</Badge>
					) : (
						<View />
					)}
					<View style={{ pointerEvents: "box-none" }}>
						<View style={{ pointerEvents: "none", gap: tokens.spacing[1] }}>
							<Title
								variant="headingSm"
								numberOfLines={1}
								style={{ color: ON_MEDIA.text }}
							>
								{title}
							</Title>
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
									className="flex-row justify-between"
									style={{
										gap: tokens.spacing[3],
										marginTop: tokens.spacing[2],
									}}
								>
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
							) : null}
						</View>
						<View
							className="flex-row items-center justify-between"
							style={{
								pointerEvents: "box-none",
								gap: tokens.spacing[2],
								marginTop: tokens.spacing[4],
							}}
						>
							<View
								className="justify-center"
								style={{
									pointerEvents: "none",
									backgroundColor: ON_MEDIA.fill,
									minHeight: tokens.sizes.control.md,
									paddingHorizontal: tokens.spacing[4],
									borderRadius: tokens.radius.full,
								}}
							>
								<Text weight="semibold" style={{ color: ON_MEDIA.text }}>
									{price}
									{priceUnit ? (
										<Text variant="caption" style={{ color: ON_MEDIA.muted }}>
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
								style={{
									backgroundColor: ON_MEDIA.text,
									borderRadius: tokens.radius.full,
								}}
							>
								<Text weight="semibold" style={{ color: ON_MEDIA.ink }}>
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

const SCRIM =
	"linear-gradient(to bottom, hsla(0, 0%, 0%, 0.25), hsla(0, 0%, 0%, 0) 30%, hsla(0, 0%, 0%, 0) 40%, hsla(0, 0%, 0%, 0.85))";
