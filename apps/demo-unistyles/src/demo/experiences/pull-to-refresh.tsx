import { useState } from "react";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import {
	useRefreshControl,
	type RefreshControl,
} from "@/hooks/use-refresh-control";

import { ExperienceScreen, ListRow, Note, fakeRows } from "./shared";

const THRESHOLD = 64;

/** The indicator sits over the gap the pull opens; it never lays the list out. */
function PullIndicator({ control }: { control: RefreshControl }) {
	const { progress, status } = control;

	const style = useAnimatedStyle(() => ({
		opacity: progress.value,
		transform: [{ rotate: `${progress.value * 180}deg` }],
	}));

	return (
		<View style={styles.indicator} pointerEvents="none">
			{status === "refreshing" ? (
				<Spinner size="sm" />
			) : (
				<Animated.View style={style}>
					<Icon name="refresh" size="sm" color="muted" />
				</Animated.View>
			)}
		</View>
	);
}

export default function PullToRefreshScreen() {

	const [messages, setMessages] = useState(() => fakeRows(12));
	const [loads, setLoads] = useState(0);

	const reload = async () => {
		await new Promise((resolve) => setTimeout(resolve, 900));
		setLoads((count) => count + 1);
		setMessages(fakeRows(12, Math.floor(Math.random() * 8)));
	};

	const refresh = useRefreshControl({
		onRefresh: reload,
		threshold: THRESHOLD,
	});

	return (
		<ExperienceScreen
			actions={
				// A screen reader can't pull: the same reload stays reachable as a button.
				<IconButton
					icon="refresh"
					accessibilityLabel="Reload messages"
					onPress={() => refresh.refresh()}
				/>
			}
		>
			<Note>
				Pull the list down. Past {THRESHOLD}pt it arms; release to reload.
				Status: {refresh.status}.
			</Note>
			<View style={styles.list}>
				<PullIndicator control={refresh} />
				<GestureDetector gesture={refresh.gesture}>
					<Animated.FlatList
						data={messages}
						keyExtractor={(item) => String(item.id)}
						renderItem={({ item }) => (
							<ListRow title={item.title} subtitle={item.subtitle} />
						)}
						ListFooterComponent={
							<Text
								variant="footnote"
								color="muted"
								align="center"
								style={styles.row}
							>
								{loads === 0
									? "Never reloaded yet"
									: `Reloaded ${loads} time${loads > 1 ? "s" : ""}`}
							</Text>
						}
						{...refresh.scrollProps}
					/>
				</GestureDetector>
			</View>
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create((theme) => ({
	list: { flex: 1 },
	row: { padding: theme.tokens.spacing[4] },
	indicator: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: THRESHOLD,
		alignItems: "center",
		justifyContent: "center",
	},
}));
