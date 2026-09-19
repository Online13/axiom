import { useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	type SharedValue,
} from "react-native-reanimated";

import {
	Calendar,
	type CalendarSelection,
	type DateRange,
} from "@/components/ui/calendar";
import { Carousel, type CarouselRef } from "@/components/ui/carousel";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

const format = (date: Date | undefined) =>
	date
		? date.toLocaleDateString(undefined, { day: "numeric", month: "short" })
		: "…";

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
			{ scale: interpolate(Math.abs(progress.value), [0, 1], [1, 0.92]) },
		],
		opacity: interpolate(Math.abs(progress.value), [0, 1], [1, 0.6]),
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

export default function CalendarScreen() {
	const { tokens } = useTheme();
	const [date, setDate] = useState<CalendarSelection>(new Date());
	const [month, setMonth] = useState<CalendarSelection>(new Date());
	const [range, setRange] = useState<CalendarSelection>();
	const [index, setIndex] = useState(0);
	const carousel = useRef<CarouselRef>(null);
	const today = new Date();
	const busy = new Set([3, 9, 17, 24]);
	const nights = range as DateRange | undefined;

	return (
		<Screen>
			<Section
				title="Events"
				description={`Selected: ${format(date instanceof Date ? date : undefined)}. The navigation sits before the month title.`}
			>
				<Panel>
					<Calendar.Root selected={date} onSelect={setDate}>
						<Calendar.Header>
							<Calendar.Nav>
								<Calendar.PrevButton variant="outline" shape="square" />
								<Calendar.NextButton variant="outline" shape="square" />
							</Calendar.Nav>
							<Calendar.Title />
						</Calendar.Header>
						<Calendar.Grid>
							<Calendar.Weekdays />
							<Calendar.Days weeks="fixed">
								{(day) => (
									<Calendar.Day day={day}>
										{busy.has(day.date.getDate()) &&
										!day.isOutside ? (
											<Calendar.Dot />
										) : null}
									</Calendar.Day>
								)}
							</Calendar.Days>
						</Calendar.Grid>
					</Calendar.Root>
				</Panel>
			</Section>

			<Section
				title="Compact month"
				description={`Selected: ${format(month instanceof Date ? month : undefined)}. This version places the title between standalone arrows.`}
			>
				<Panel>
					<Calendar.Root selected={month} onSelect={setMonth}>
						<Calendar.Header style={{ paddingStart: 0 }}>
							<Calendar.PrevButton variant="tinted" />
							<Calendar.Title>
								{(visibleMonth) => (
									<View style={{ alignItems: "center" }}>
										<Text variant="bodyLg" weight="bold">
											{visibleMonth.toLocaleDateString(undefined, {
												month: "long",
											})}
										</Text>
									</View>
								)}
							</Calendar.Title>
							<Calendar.NextButton variant="tinted" />
						</Calendar.Header>
						<Calendar.Grid>
							<Calendar.Weekdays format="narrow" />
							<Calendar.Days showOutsideDays={false} />
						</Calendar.Grid>
					</Calendar.Root>
				</Panel>
			</Section>

			<Section
				title="Stay"
				description={`From ${format(nights?.from)} to ${format(nights?.to)}. The grid comes first and the month controls sit below it.`}
			>
				<Panel>
					<Calendar.Root
						mode="range"
						selected={range}
						onSelect={setRange}
						minDate={today}
						maxRange={14}
						isDateDisabled={(d) => d.getDay() === 0}
						weekStartsOn={1}
					>
						<Calendar.Grid>
							<Calendar.Weekdays format="narrow" />
							<Calendar.Days showOutsideDays={false} />
						</Calendar.Grid>
						<Calendar.Header style={{ justifyContent: "center" }}>
							<Calendar.Nav>
								<Calendar.PrevButton variant="outline" />
								<Calendar.NextButton variant="outline" />
							</Calendar.Nav>
							<Calendar.Title format="month" />
						</Calendar.Header>
					</Calendar.Root>
				</Panel>
			</Section>

			<Section
				title="Carousel"
				description={`Item ${index + 1} of ${SLIDES.length}. Autoplay every 4s, loops, dots.`}
			>
				<View style={{ marginHorizontal: -tokens.metrics.screenMargin }}>
					<Carousel
						ref={carousel}
						data={SLIDES}
						keyExtractor={(item) => item.id}
						itemWidth={280}
						pagination="dots"
						loop
						autoPlay={4000}
						onIndexChange={setIndex}
						renderItem={({ item, progress }) => (
							<Slide
								title={item.title}
								hue={item.hue}
								progress={progress}
							/>
						)}
					/>
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
				<Label muted>Full-width items with a counter:</Label>
				<View style={{ marginHorizontal: -tokens.metrics.screenMargin }}>
					<Carousel
						data={SLIDES.slice(0, 4)}
						pagination="counter"
						renderItem={({ item, progress }) => (
							<Slide
								title={item.title}
								hue={item.hue + 30}
								progress={progress}
							/>
						)}
					/>
				</View>
			</Section>
		</Screen>
	);
}
