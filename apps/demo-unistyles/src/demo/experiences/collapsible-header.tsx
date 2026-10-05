import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { AppBar } from "@/components/ui/app-bar";
import { IconButton } from "@/components/ui/icon-button";
import { BackButton } from "@/demo/screen";
import { useLargeTitle } from "@/demo/use-large-title";

import { ExperienceScreen, ListRow, Note, fakeRows } from "./shared";

export default function CollapsibleHeaderScreen() {
	const rows = fakeRows(30);

	const largeTitle = useLargeTitle();

	return (
		<ExperienceScreen
			appBar={
				<AppBar safeArea={false} bordered style={styles.bar}>
					<AppBar.Row>
						<BackButton />
						{/* The large title is the one read out, so the row copy stays silent. */}
						<AppBar.Center
							accessibilityElementsHidden
							importantForAccessibility="no-hide-descendants"
						>
							<Animated.View style={largeTitle.rowTitleStyle}>
								<AppBar.Title>Messages</AppBar.Title>
							</Animated.View>
						</AppBar.Center>
						<IconButton
							icon="edit"
							accessibilityLabel="New message"
							onPress={() => {}}
						/>
					</AppBar.Row>
					<Animated.View style={[styles.fold, largeTitle.expandedStyle]}>
						<AppBar.Expanded onLayout={largeTitle.onExpandedLayout}>
							<AppBar.Title size="large">Messages</AppBar.Title>
							<AppBar.Subtitle size="large">3 unread</AppBar.Subtitle>
						</AppBar.Expanded>
					</Animated.View>
				</AppBar>
			}
		>
			<Note>
				Scroll the list: the large title folds into the row, then comes back
				at the top.
			</Note>
			<Animated.FlatList
				data={rows}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item }) => (
					<ListRow title={item.title} subtitle={item.subtitle} />
				)}
				onScroll={largeTitle.onScroll}
				scrollEventThrottle={16}
				contentContainerStyle={styles.content}
			/>
		</ExperienceScreen>
	);
}

const styles = StyleSheet.create((theme) => ({
	bar: { backgroundColor: theme.colors.background.subtle },
	// Clips the large title and anchors it to the bottom, so it rises as the block folds.
	fold: { justifyContent: "flex-end", overflow: "hidden" },
	content: { paddingBottom: theme.tokens.spacing[12] * 2 },
}));
