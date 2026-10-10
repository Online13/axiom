import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";

import { Portal } from "@/components/core/portal";
import { Tappable } from "@/components/core/tappable";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";

import {
	SnackbarIcon,
	SnackbarSurface,
	useSnackbarStyles,
} from "./snackbar.styles";
import {
	useSnackbarItem,
	useSnackbars,
	type SnackbarData,
} from "./use-snackbar";

export {
	snackbar,
	type SnackbarDismissReason,
	type SnackbarOptions,
} from "./use-snackbar";

export type SnackbarHostProps = {
	/** Extra space above the bottom safe area, for a tab bar or a toolbar. */
	bottomOffset?: number;
	swipeToDismiss?: boolean;
};

/** Mount once at the root of the app, next to the PortalHost. */
export function SnackbarHost({
	bottomOffset = 0,
	swipeToDismiss = true,
}: SnackbarHostProps) {
	const styles = useSnackbarStyles();
	const items = useSnackbars();

	if (items.length === 0) return null;

	return (
		<Portal>
			<View {...styles.container(bottomOffset)}>
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
	const styles = useSnackbarStyles();
	const { gesture, animatedStyle, onAction } = useSnackbarItem(
		data,
		swipeToDismiss,
	);

	return (
		<GestureDetector gesture={gesture}>
			<SnackbarSurface
				accessibilityLiveRegion="polite"
				{...styles.surface(data.action !== undefined)}
				style={[
					styles.snackbar(data.action !== undefined, data.open),
					animatedStyle,
				]}
			>
				{data.icon ? (
					<SnackbarIcon name={data.icon} {...styles.tint} />
				) : null}
				<Text variant="bodySm" numberOfLines={2} {...styles.message}>
					{data.message}
				</Text>
				{data.action ? (
					<Tappable onPress={onAction} {...styles.action}>
						<Text
							variant="bodySm"
							maxFontSizeMultiplier={MAX_FONT_SCALE.control}
							{...styles.actionLabel}
						>
							{data.action.label}
						</Text>
					</Tappable>
				) : null}
			</SnackbarSurface>
		</GestureDetector>
	);
}
