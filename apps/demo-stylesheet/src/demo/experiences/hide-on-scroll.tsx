import { StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { AppBar } from "@/components/ui/app-bar";
import { ToolBar } from "@/components/ui/tool-bar";
import { BackButton } from "@/demo/screen";
import { useTheme } from "@/theme";

import { ExperienceScreen, ListRow, Note, fakeRows } from "./shared";

const BAR_HEIGHT = 96;
// Below this, a direction change is noise, not an intent.
const DELTA = 6;

export default function HideOnScrollScreen() {
	const { tokens, colors } = useTheme();
	const rows = fakeRows(40);

	// 0: bars in place, 1: bars off screen.
	const hidden = useSharedValue(0);
	const lastY = useSharedValue(0);

	const onScroll = useAnimatedScrollHandler((event) => {
		const y = event.contentOffset.y;
		const delta = y - lastY.value;
		if (Math.abs(delta) < DELTA) return;
		lastY.value = y;
		// The top of the list always shows the bars, whatever the direction.
		const next = y <= 0 ? 0 : delta > 0 ? 1 : 0;
		if (next !== hidden.value)
			hidden.value = withTiming(next, { duration: 180 });
	});

	const topStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -hidden.value * BAR_HEIGHT }],
		opacity: 1 - hidden.value,
	}));

	return (
		<ExperienceScreen
			appBar={
				<Animated.View style={topStyle}>
					<AppBar
						safeArea={false}
						bordered
						backgroundColor={colors.background.subtle}
					>
						<AppBar.Leading>
							<BackButton />
						</AppBar.Leading>
						<AppBar.Title>Hide-on-scroll</AppBar.Title>
					</AppBar>
				</Animated.View>
			}
		>
			<Note>
				Scroll down: both bars leave. Scroll up, anywhere in the list: they
				come back.
			</Note>
			<View style={styles.fill}>
				<Animated.FlatList
					data={rows}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => (
						<ListRow title={item.title} subtitle={item.subtitle} />
					)}
					onScroll={onScroll}
					scrollEventThrottle={16}
					contentContainerStyle={{ paddingBottom: tokens.spacing[12] * 2 }}
				/>
				<HidingToolBar hidden={hidden} />
			</View>
		</ExperienceScreen>
	);
}

function HidingToolBar({
	hidden,
}: {
	hidden: ReturnType<typeof useSharedValue<number>>;
}) {
	const { colors } = useTheme();
	const style = useAnimatedStyle(() => ({
		transform: [{ translateY: hidden.value * BAR_HEIGHT }],
	}));

	return (
		<Animated.View style={[styles.bottom, style]}>
			<ToolBar
				safeArea={false}
				style={{ backgroundColor: colors.background.subtle }}
			>
				<ToolBar.Action icon="search" label="Search" />
				<ToolBar.Action icon="add" label="New" />
				<ToolBar.Action icon="settings" label="Settings" />
			</ToolBar>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	fill: { flex: 1 },
	bottom: { position: "absolute", left: 0, right: 0, bottom: 0 },
});
