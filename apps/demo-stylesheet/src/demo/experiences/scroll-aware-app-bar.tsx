import { StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
} from "react-native-reanimated";

import { AppBar } from "@/components/ui/app-bar";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { BackButton } from "@/demo/screen";
import { useTheme } from "@/theme";

import { ExperienceScreen } from "./shared";

// The bar takes its background over the first few points, and its title once the page title is gone.
const ELEVATION_DISTANCE = 24;
const TITLE_OFFSET = 96;

const PARAGRAPHS = [
	"The bar never moves and never changes size. What changes is what it shows.",
	"At the top of the screen it is transparent and has no title, so the cover and the page title own the screen.",
	"As soon as content passes under it, a background and a hairline fade in, and the text stays readable.",
	"Once the title in the page has scrolled out of view, the compact title appears in the bar, so the reader always knows where they are.",
	"Scrolling back up plays the same two steps in reverse, each on its own threshold: the background answers the first points, the title waits for the page title to come back.",
	"Because both are progresses, not switches, a slow scroll shows the in-between states instead of a jump.",
];

export default function ScrollAwareAppBarScreen() {
	const { tokens, colors, components } = useTheme();
	const barColors = components.appBar.default.default;

	const offset = useSharedValue(0);
	const elevation = useDerivedValue(() =>
		Math.min(Math.max(offset.get() / ELEVATION_DISTANCE, 0), 1),
	);
	const titleProgress = useDerivedValue(() =>
		Math.min(Math.max((offset.get() - TITLE_OFFSET) / 32, 0), 1),
	);

	const onScroll = useAnimatedScrollHandler((event) => {
		offset.set(event.contentOffset.y);
	});

	const surfaceStyle = useAnimatedStyle(() => ({ opacity: elevation.get() }));
	const titleStyle = useAnimatedStyle(() => ({
		opacity: titleProgress.get(),
	}));

	return (
		<ExperienceScreen
			background="default"
			appBar={
				<View style={styles.floatingBar}>
					<AppBar safeArea={false} style={styles.transparent}>
						{/* The bar's own surface, faded in as content passes under it. */}
						<Animated.View
							pointerEvents="none"
							style={[
								StyleSheet.absoluteFill,
								{
									backgroundColor: barColors.background,
									borderBottomWidth: tokens.metrics.hairline,
									borderBottomColor: barColors.border,
								},
								surfaceStyle,
							]}
						/>
						<AppBar.Row>
							<BackButton />
							<AppBar.Center>
								<Animated.View style={titleStyle}>
									<AppBar.Title>Scroll-aware AppBar</AppBar.Title>
								</Animated.View>
							</AppBar.Center>
						</AppBar.Row>
					</AppBar>
				</View>
			}
		>
			<Animated.ScrollView
				onScroll={onScroll}
				scrollEventThrottle={16}
				contentContainerStyle={{
					paddingTop: tokens.spacing[4],
					padding: tokens.metrics.screenMargin,
					paddingBottom: tokens.spacing[12] * 2,
					gap: tokens.spacing[4],
				}}
			>
				<View
					style={{
						height: 120,
						borderRadius: tokens.radius.lg,
						backgroundColor: colors.background.subtle,
					}}
				/>
				<Title variant="headingLg">Reading under the bar</Title>
				{PARAGRAPHS.map((paragraph) => (
					<Text key={paragraph} color="muted">
						{paragraph}
					</Text>
				))}
			</Animated.ScrollView>
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create({
	transparent: { backgroundColor: "transparent" },
	// The bar sits over the content instead of pushing it down: that's what makes it scroll-aware.
	floatingBar: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 },
});
