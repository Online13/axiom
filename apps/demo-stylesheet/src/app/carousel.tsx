import { useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	type SharedValue,
} from "react-native-reanimated";

import {
	Carousel,
	useCarousel,
	type CarouselRef,
} from "@/components/ui/carousel";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { Label, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

const SLIDES = Array.from({ length: 6 }, (_, i) => ({
	id: String(i),
	title: `Story ${i + 1}`,
	hue: (i * 57) % 360,
}));

function Slide({
	title,
	hue,
	progress,
}: {
	title: string;
	hue: number;
	progress: SharedValue<number>;
}) {
	const { tokens } = useTheme();
	const style = useAnimatedStyle(() => ({
		transform: [
			{ scale: interpolate(Math.abs(progress.get()), [0, 1], [1, 0.92]) },
		],
		opacity: interpolate(Math.abs(progress.get()), [0, 1], [1, 0.6]),
	}));

	return (
		<Animated.View
			style={[
				{
					height: 180,
					padding: tokens.spacing[4],
					justifyContent: "flex-end",
					borderRadius: tokens.radius.xl,
					backgroundColor: `hsla(${hue}, 70%, 55%, 1)`,
				},
				style,
			]}
		>
			<Text variant="bodyLg" weight="bold" style={{ color: "white" }}>
				{title}
			</Text>
		</Animated.View>
	);
}

/** "2 / 4" under the list: any component inside a Carousel can read it. */
function Counter() {
	const { active, count } = useCarousel();
	return (
		<Text
			variant="footnote"
			color="muted"
			style={{ alignSelf: "center", marginTop: 12 }}
		>
			{active + 1} / {count}
		</Text>
	);
}

export default function CarouselScreen() {
	const { tokens } = useTheme();
	const [index, setIndex] = useState(0);
	const carousel = useRef<CarouselRef>(null);

	return (
		<Screen>
			<Section
				title="Carousel"
				description={`Item ${index + 1} of ${SLIDES.length}. Autoplay every 4s, loops, dots: each one a part you add.`}
			>
				<View style={{ marginHorizontal: -tokens.metrics.screenMargin }}>
					<Carousel
						ref={carousel}
						data={SLIDES}
						keyExtractor={(item) => item.id}
						itemWidth={280}
						onIndexChange={setIndex}
						renderItem={({ item, progress }) => (
							<Slide
								title={item.title}
								hue={item.hue}
								progress={progress}
							/>
						)}
					>
						<Carousel.List />
						<Carousel.Pagination />
						<Carousel.AutoPlay interval={4000} loop />
					</Carousel>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						gap: tokens.spacing[3],
					}}
				>
					<IconButton
						icon="arrow-left"
						variant="tinted"
						accessibilityLabel="Previous"
						onPress={() => carousel.current?.prev()}
					/>
					<IconButton
						icon="chevron-right"
						variant="tinted"
						accessibilityLabel="Next"
						onPress={() => carousel.current?.next()}
					/>
				</View>
				<Label muted>
					Full-width items with a counter written with useCarousel:
				</Label>
				<View style={{ marginHorizontal: -tokens.metrics.screenMargin }}>
					<Carousel
						data={SLIDES.slice(0, 4)}
						renderItem={({ item, progress }) => (
							<Slide
								title={item.title}
								hue={item.hue + 30}
								progress={progress}
							/>
						)}
					>
						<Carousel.List />
						<Counter />
					</Carousel>
				</View>
			</Section>
		</Screen>
	);
}
