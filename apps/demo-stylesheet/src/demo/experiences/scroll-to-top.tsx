import { useRef, useState } from "react";
import {
	FlatList,
	StyleSheet,
	View,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from "react-native";

import { FloatingButton } from "@/components/ui/floating-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useTheme } from "@/theme";

import { ExperienceScreen, ListRow, Note, fakeRows } from "./shared";

type ShowOn = "threshold" | "scroll-up";

// One screen down, roughly: far enough that scrolling back by hand is a chore.
const THRESHOLD = 600;

export default function ScrollToTopScreen() {
	const { tokens } = useTheme();
	const list = useRef<FlatList>(null);
	const lastY = useRef(0);
	const [showOn, setShowOn] = useState<ShowOn>("threshold");
	const [visible, setVisible] = useState(false);
	const rows = fakeRows(60);

	const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const y = event.nativeEvent.contentOffset.y;
		const goingUp = y < lastY.current;
		lastY.current = y;
		setVisible(y > THRESHOLD && (showOn === "threshold" || goingUp));
	};

	const backToTop = () => {
		list.current?.scrollToOffset({ offset: 0, animated: true });
		setVisible(false);
	};

	return (
		<ExperienceScreen>
			<Note>
				The button appears past {THRESHOLD}pt. With `scroll-up`, only once
				the user starts going back up.
			</Note>
			<View style={{ padding: tokens.metrics.screenMargin }}>
				<SegmentedControl
					value={showOn}
					onValueChange={(value) => setShowOn(value as ShowOn)}
					options={["threshold", "scroll-up"]}
				/>
			</View>
			<View style={styles.fill}>
				<FlatList
					ref={list}
					data={rows}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => (
						<ListRow title={item.title} subtitle={item.subtitle} />
					)}
					onScroll={onScroll}
					scrollEventThrottle={16}
					contentContainerStyle={{ paddingBottom: tokens.spacing[12] * 2 }}
				/>
				{visible ? (
					<FloatingButton
						icon="arrow-left"
						label="Top"
						placement="bottom-start"
						variant="tinted"
						accessibilityLabel="Back to top"
						onPress={backToTop}
					/>
				) : null}
			</View>
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create({
	fill: { flex: 1 },
});
