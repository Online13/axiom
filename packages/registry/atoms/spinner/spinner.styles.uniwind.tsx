import type { ComponentProps } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import type { TextColor } from "@/components/ui/text";
import { cx } from "@/theme";

import type { SpinnerProps, SpinnerSize } from "./spinner";

const FRAME: Record<Exclude<SpinnerSize, number>, string> = {
	sm: "size-icon-sm",
	md: "size-icon-md",
	lg: "size-icon-lg",
};

const COLOR: Record<TextColor, string> = {
	default: "border-content",
	muted: "border-content-muted",
	subtle: "border-content-subtle",
	disabled: "border-content-disabled",
	inverse: "border-content-inverse",
	link: "border-content-link",
	success: "border-feedback-success",
	warning: "border-feedback-warning",
	error: "border-feedback-error",
};

type RingProps = ComponentProps<typeof Animated.View> & {
	ringClassName?: string;
	ringStyle?: StyleProp<ViewStyle>;
};

/**
 * The ring, which turns. An animated view takes `style` only, so it keeps the rotation, and the
 * view inside it takes the classes that draw the ring.
 */
export function SpinnerRing({ ringClassName, ringStyle, ...props }: RingProps) {
	return (
		<Animated.View {...props}>
			<View className={ringClassName} style={ringStyle} />
		</Animated.View>
	);
}

export function useSpinnerStyles(size: SpinnerSize, color: TextColor) {
	return {
		frame: (
			visible: boolean,
			{ className, style }: Pick<SpinnerProps, "className" | "style">,
		) => ({
			className: cx(
				typeof size !== "number" && FRAME[size],
				!visible && "opacity-0",
				className,
			),
			style: [
				typeof size === "number" && { width: size, height: size },
				style,
			],
		}),
		// One transparent side draws the gap of the ring. The size tokens all take a stroke of 2.
		ring: {
			ringClassName: cx(
				"flex-1 rounded-full border-2",
				COLOR[color],
				"border-t-transparent",
			),
			ringStyle:
				typeof size === "number"
					? { borderWidth: Math.max(2, Math.round(size / 10)) }
					: undefined,
		},
		spin: { flex: 1 } satisfies ViewStyle,
	};
}
