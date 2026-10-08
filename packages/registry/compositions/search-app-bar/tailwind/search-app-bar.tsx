import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";
import {
	View,
	type StyleProp,
	type TextInput,
	type ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { composeRefs } from "@/components/core/slot";
import { Tappable } from "@/components/core/tappable";
import { AppBar } from "@/components/ui/app-bar";
import { IconButton } from "@/components/ui/icon-button";
import {
	SearchBar,
	searchBarColors,
	type SearchBarProps,
} from "@/components/ui/search-bar";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

export type SearchAppBarProps = Omit<
	SearchBarProps,
	"size" | "containerStyle"
> & {
	/** `back` shows an arrow, `close` a cross, for a search opened as a modal. */
	navigation?: "back" | "close";
	/** Shows the navigation button. */
	onNavigate?: () => void;
	navigationLabel?: string;
	/** Buttons after the field, such as filters or scan. Rendered as written, however many. */
	children?: ReactNode;
	/**
	 * Shows a Cancel button that slides in while the field is focused. Called once the field is
	 * blurred: clear the query here, or leave the screen.
	 */
	onCancel?: () => void;
	cancelLabel?: string;
	/** Hairline under the bar. */
	bordered?: boolean;
	/** Adds the top safe-area inset. `false` when Scaffold already owns it. */
	safeArea?: boolean;
	barStyle?: StyleProp<ViewStyle>;
};

export function SearchAppBar({
	navigation = "back",
	onNavigate,
	navigationLabel = navigation === "back" ? "Back" : "Close",
	children,
	onCancel,
	cancelLabel = "Cancel",
	bordered = true,
	safeArea = true,
	barStyle,
	variant = "filled",
	onFocus,
	onBlur,
	ref,
	...searchProps
}: SearchAppBarProps) {
	const { components } = useTheme();
	const inputRef = useRef<TextInput>(null);
	// Composed inside a stable callback ref, so neither ref is touched during render.
	const setInputRef = useCallback(
		(node: TextInput | null) => composeRefs(ref, inputRef)(node),
		[ref],
	);
	const [focused, setFocused] = useState(false);

	return (
		<AppBar bordered={bordered} safeArea={safeArea} style={barStyle}>
			<AppBar.Row>
				{onNavigate ? (
					<IconButton
						icon={navigation === "back" ? "arrow-left" : "close"}
						onPress={onNavigate}
						accessibilityLabel={navigationLabel}
					/>
				) : null}
				<AppBar.Center inset={!onNavigate}>
					<SearchBar
						{...searchProps}
						ref={setInputRef}
						variant={variant}
						size="sm"
						onFocus={(event) => {
							setFocused(true);
							onFocus?.(event);
						}}
						onBlur={(event) => {
							setFocused(false);
							onBlur?.(event);
						}}
					/>
				</AppBar.Center>
				{onCancel ? (
					<CancelButton
						visible={focused}
						label={cancelLabel}
						color={searchBarColors(components, variant, "focused").cancel}
						onPress={() => {
							inputRef.current?.blur();
							onCancel();
						}}
					/>
				) : null}
				{children}
			</AppBar.Row>
		</AppBar>
	);
}

// Long enough to read as a slide, short enough not to delay the keyboard.
const DURATION = 220;

/** Slides in from a measured width, so the field shrinks smoothly instead of jumping. */
function CancelButton({
	visible,
	label,
	color,
	onPress,
}: {
	visible: boolean;
	label: string;
	color: string;
	onPress: () => void;
}) {
	const { tokens } = useTheme();
	const reduceMotion = useReducedMotion();
	// The button keeps its natural width; the wrapper animates from 0 to that width and clips it.
	const [width, setWidth] = useState(0);
	const progress = useSharedValue(visible ? 1 : 0);

	useEffect(() => {
		const target = visible ? 1 : 0;
		progress.set(
			reduceMotion ? target : withTiming(target, { duration: DURATION }),
		);
	}, [visible, reduceMotion, progress]);

	const animatedStyle = useAnimatedStyle(() => ({
		width: width * progress.get(),
		opacity: progress.get(),
	}));

	return (
		<Animated.View
			style={[{ alignSelf: "stretch", overflow: "hidden" }, animatedStyle]}
		>
			{/* Absolute: the button keeps its natural width while the wrapper animates and clips it. */}
			<View
				onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
				className="absolute justify-center"
				style={{
					start: 0,
					top: 0,
					bottom: 0,
					paddingHorizontal: tokens.spacing[2],
				}}
			>
				<Tappable
					accessibilityRole="button"
					accessibilityLabel={label}
					onPress={onPress}
					disabled={!visible}
				>
					<Text
						variant="body"
						maxFontSizeMultiplier={MAX_FONT_SCALE.control}
						style={{ color }}
					>
						{label}
					</Text>
				</Tappable>
			</View>
		</Animated.View>
	);
}
