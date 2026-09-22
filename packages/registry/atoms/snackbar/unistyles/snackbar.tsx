import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Portal } from "@/components/core/portal";
import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";

import {
	useSnackbarItem,
	useSnackbars,
	type SnackbarData,
} from "../use-snackbar";

export {
	snackbar,
	type SnackbarDismissReason,
	type SnackbarOptions,
} from "../use-snackbar";

export type SnackbarHostProps = {
	/** Extra space above the bottom safe area, for a tab bar or a toolbar. */
	bottomOffset?: number;
	swipeToDismiss?: boolean;
};

// The icon takes its color as a prop, not as a style. Wrapped once, here, so the instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

/** Mount once at the root of the app, next to the PortalHost. */
export function SnackbarHost({
	bottomOffset = 0,
	swipeToDismiss = true,
}: SnackbarHostProps) {
	const items = useSnackbars();

	if (items.length === 0) return null;

	return (
		<Portal>
			<View style={styles.container(bottomOffset)}>
				{items.map((item) => (
					<SnackbarView
						key={item.id}
						data={item}
						swipeToDismiss={swipeToDismiss}
					/>
				))}
			</View>
		</Portal>
	);
}

function SnackbarView({
	data,
	swipeToDismiss,
}: {
	data: SnackbarData;
	swipeToDismiss: boolean;
}) {
	const { gesture, animatedStyle, onAction } = useSnackbarItem(
		data,
		swipeToDismiss,
	);

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View
				accessibilityLiveRegion="polite"
				style={[
					styles.snackbar(data.action !== undefined, data.open),
					animatedStyle,
				]}
			>
				{data.icon ? (
					<ThemedIcon
						name={data.icon}
						uniProps={(theme) => ({
							color:
								theme.components.snackbar.default.default.foreground,
						})}
					/>
				) : null}
				<Text variant="bodySm" numberOfLines={2} style={styles.message}>
					{data.message}
				</Text>
				{data.action ? (
					<Tappable
						onPress={onAction}
						style={({ pressed }) => styles.action(pressed)}
					>
						<Text
							variant="bodySm"
							maxFontSizeMultiplier={MAX_FONT_SCALE.control}
							style={styles.actionLabel}
						>
							{data.action.label}
						</Text>
					</Tappable>
				) : null}
			</Animated.View>
		</GestureDetector>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	container: (bottomOffset: number) => ({
		position: "absolute",
		pointerEvents: "box-none",
		// Clear of the Android gesture bar, so a swipe on the snackbar doesn't start the system back or home gesture.
		bottom: rt.insets.bottom + theme.tokens.spacing[4] + bottomOffset,
		left: theme.tokens.metrics.screenMargin,
		right: theme.tokens.metrics.screenMargin,
	}),
	snackbar: (actionable: boolean, open: boolean) => ({
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		flexDirection: "row",
		alignItems: "center",
		boxShadow: "0px 6px 24px hsla(0, 0%, 0%, 0.18)",
		minHeight: 48,
		gap: theme.tokens.spacing[3],
		paddingStart: theme.tokens.spacing[4],
		paddingEnd: actionable
			? theme.tokens.spacing[1]
			: theme.tokens.spacing[4],
		paddingVertical: theme.tokens.spacing[1],
		borderRadius: theme.tokens.radius.md,
		backgroundColor: theme.components.snackbar.default.default.background,
		...(!open && { pointerEvents: "none" }),
	}),
	message: {
		flex: 1,
		paddingVertical: 6,
		color: theme.components.snackbar.default.default.foreground,
	},
	action: (pressed: boolean) => ({
		minHeight: 40,
		justifyContent: "center",
		paddingHorizontal: theme.tokens.spacing[3],
		borderRadius: theme.tokens.radius.sm,
		opacity: pressed ? 0.6 : 1,
	}),
	actionLabel: {
		color: theme.components.snackbar.default.default.action,
		fontWeight: FONT_WEIGHT.semibold,
	},
}));
