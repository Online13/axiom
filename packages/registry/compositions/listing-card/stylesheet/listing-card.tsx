import { Fragment, useState } from "react";
import {
	Image,
	StyleSheet,
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

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
	/** One photo, or several to swipe through. */
	images: ImageSourcePropType[];
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
	images,
	aspectRatio = 4 / 3,
	badge,
	specs,
	onPress,
	style,
}: ListingCardProps) {
	const { tokens } = useTheme();
	const [photo, setPhoto] = useState(0);
	const renderPhoto = (source: ImageSourcePropType) => (
		<Image source={source} resizeMode="cover" style={{ aspectRatio }} />
	);

	return (
		<Card
			variant="elevated"
			onPress={onPress}
			accessibilityLabel={
				onPress ? `${title}, ${price}${priceUnit ?? ""}` : undefined
			}
			style={style}
		>
			<View>
				{images.length > 1 ? (
					<Carousel
						data={images}
						contentInset={0}
						gap={0}
						onIndexChange={setPhoto}
						accessibilityLabel="Photos"
						renderItem={({ item }) => renderPhoto(item)}
					/>
				) : (
					renderPhoto(images[0])
				)}
				<View style={[styles.mediaOverlay, { padding: tokens.spacing[3] }]}>
					{badge ? <Badge variant="highlight">{badge}</Badge> : <View />}
					{images.length > 1 ? (
						<Dots count={images.length} active={photo} />
					) : null}
				</View>
			</View>
			<Card.Header>
				<View style={[styles.heading, { gap: tokens.spacing[2] }]}>
					<Title variant="subheading" numberOfLines={1} style={styles.title}>
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
				<Card.Content style={{ gap: tokens.spacing[3] }}>
					<Separator variant="subtle" />
					<View style={styles.specs}>
						{specs.map((spec, index) => (
							<Fragment key={index}>
								{index > 0 ? (
									<Separator orientation="vertical" variant="subtle" />
								) : null}
								<View style={[styles.spec, { gap: tokens.spacing[1] }]}>
									{spec.icon ? (
										<Icon name={spec.icon} size="sm" color="muted" />
									) : null}
									<Text variant="footnote" color="muted" numberOfLines={1}>
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

/** Photos stay the same in both schemes, so the dots on them are always white. */
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

const styles = StyleSheet.create({
	mediaOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: "flex-start",
		justifyContent: "space-between",
		pointerEvents: "none",
	},
	heading: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	title: {
		flex: 1,
	},
	specs: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	spec: {
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
	},
	dots: {
		flexDirection: "row",
		alignSelf: "center",
		gap: 4,
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "hsla(0, 0%, 100%, 0.5)",
	},
	dotActive: {
		width: 14,
		backgroundColor: "hsla(0, 0%, 100%, 1)",
	},
});
