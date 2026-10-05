import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { composeRefs, Slot } from "@/components/core/slot";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Menu } from "@/components/ui/menu";
import { useMenuContext } from "@/components/ui/use-menu";

export type ContextMenuTriggerProps = Omit<
	TappableProps,
	"children" | "style" | "onPress" | "onLongPress"
> & {
	/** Lifts a copy of the content above the backdrop. A node shows that node in its place instead. */
	preview?: boolean | ReactNode;
	/** Played when the menu opens, to confirm the press was long enough. `false` turns it off. */
	haptic?: HapticKind | false;
	asChild?: boolean;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

/** Opens the menu on a long press on content, and lifts that content above the backdrop, iOS style. */
function ContextMenuTrigger({
	preview = true,
	haptic: hapticKind = "medium",
	asChild = false,
	children,
	style,
	ref,
	...props
}: ContextMenuTriggerProps) {
	const { triggerRef, openFromTrigger } = useMenuContext();
	const previewNode =
		preview === true ? children : preview === false ? null : preview;
	const open = () => {
		if (hapticKind) haptic(hapticKind);
		openFromTrigger(previewNode);
	};

	if (asChild) {
		return (
			<View
				{...props}
				ref={composeRefs(triggerRef, ref)}
				collapsable={false}
				style={style}
			>
				<Slot onLongPress={open}>{children}</Slot>
			</View>
		);
	}

	return (
		<Tappable
			// Screen readers reach the menu through the long press action.
			accessibilityHint="Long press for options"
			{...props}
			ref={composeRefs(triggerRef, ref)}
			onLongPress={open}
			style={style}
		>
			{children}
		</Tappable>
	);
}

/** Menu's parts, opened by a long press on content instead of a button. */
export const ContextMenu = {
	...Menu,
	Trigger: ContextMenuTrigger,
};
