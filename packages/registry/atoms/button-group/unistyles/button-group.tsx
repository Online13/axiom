import {
	Children,
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { ButtonSize, ButtonVariant } from "@/components/ui/button";
import type { Spacing } from "@/theme";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupProps = {
	/** Button or IconButton elements. */
	children?: ReactNode;
	/** Merges adjacent borders and keeps only the outer corners rounded. */
	attached?: boolean;
	orientation?: ButtonGroupOrientation;
	/** Space between buttons when not attached. */
	gap?: keyof Spacing;
	/** Applied to every child that doesn't set its own. */
	size?: ButtonSize;
	variant?: ButtonVariant;
	/** Stretches the group and splits its width evenly. */
	fullWidth?: boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

type ChildProps = {
	size?: ButtonSize;
	variant?: ButtonVariant;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

export type ButtonGroupItemRenderProps = {
	size?: ButtonSize;
	variant?: ButtonVariant;
	disabled: boolean;
	/** Layout for a wrapper such as Menu.Trigger. */
	containerStyle: StyleProp<ViewStyle>;
	/** Corner shape for the visible button inside the wrapper. */
	buttonStyle: StyleProp<ViewStyle>;
};

export type ButtonGroupItemProps = {
	/** Use when a button must sit inside a wrapper such as Menu.Trigger. */
	render: (props: ButtonGroupItemRenderProps) => ReactNode;
	/** Set to false for a compact action in a full-width group. */
	grow?: boolean;
};

type InternalItemProps = ButtonGroupItemProps & {
	groupProps?: ButtonGroupItemRenderProps;
};

function ButtonGroupItem({ render, groupProps }: InternalItemProps) {
	return groupProps ? render(groupProps) : null;
}

/** Lays out buttons side by side. It doesn't track a selection: see SegmentedControl for that. */
function ButtonGroupRoot({
	children,
	attached = true,
	orientation = "horizontal",
	gap = 2,
	size,
	variant,
	fullWidth = false,
	disabled = false,
	style,
}: ButtonGroupProps) {
	const horizontal = orientation === "horizontal";
	const buttons = Children.toArray(children).filter(
		isValidElement,
	) as ReactElement<ChildProps>[];
	const last = buttons.length - 1;

	return (
		<View
			style={[
				styles.group(orientation, fullWidth, attached, gap),
				style,
			]}
		>
			{buttons.map((button, i) => {
				const first = i === 0;
				const end = i === last;
				// The offset and the corners are kept apart: a ButtonGroup.Item puts the offset on its
				// wrapper and the corners on the button inside it.
				const offset = attached
					? styles.attachedOffset(orientation, first)
					: undefined;
				const corners = attached
					? styles.attachedCorners(orientation, first, end)
					: undefined;

				if (button.type === ButtonGroupItem) {
					const item = button as ReactElement<InternalItemProps>;
					return cloneElement(item, {
						key: item.key ?? i,
						groupProps: {
							size,
							variant,
							disabled,
							containerStyle: [
								offset,
								fullWidth &&
									horizontal &&
									item.props.grow !== false &&
									styles.equal,
								!horizontal && styles.stretchSelf,
							],
							buttonStyle: corners,
						},
					});
				}

				return cloneElement(button, {
					key: button.key ?? i,
					size: button.props.size ?? size,
					variant: button.props.variant ?? variant,
					disabled: button.props.disabled ?? disabled,
					style: [
						offset,
						corners,
						fullWidth && horizontal && styles.equal,
						!horizontal && styles.stretchSelf,
						button.props.style,
					],
				});
			})}
		</View>
	);
}

export const ButtonGroup = Object.assign(ButtonGroupRoot, {
	Item: ButtonGroupItem,
});

const styles = StyleSheet.create((theme) => ({
	group: (
		orientation: ButtonGroupOrientation,
		fullWidth: boolean,
		attached: boolean,
		gap: keyof Spacing,
	) => ({
		flexDirection: orientation === "horizontal" ? "row" : "column",
		alignSelf: fullWidth ? "stretch" : "flex-start",
		...(!attached && { gap: theme.tokens.spacing[gap] }),
	}),
	// Overlap by the border width so two borders read as one.
	attachedOffset: (
		orientation: ButtonGroupOrientation,
		first: boolean,
	) =>
		orientation === "horizontal"
			? { marginStart: first ? 0 : -1 }
			: { marginTop: first ? 0 : -1 },
	attachedCorners: (
		orientation: ButtonGroupOrientation,
		first: boolean,
		end: boolean,
	) => {
		const radius = theme.tokens.radius.md;
		return orientation === "horizontal"
			? {
					borderTopLeftRadius: first ? radius : 0,
					borderBottomLeftRadius: first ? radius : 0,
					borderTopRightRadius: end ? radius : 0,
					borderBottomRightRadius: end ? radius : 0,
				}
			: {
					...(!first && {
						borderTopLeftRadius: 0,
						borderTopRightRadius: 0,
					}),
					...(!end && {
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
					}),
				};
	},
	equal: {
		flex: 1,
		alignSelf: "auto",
	},
	stretchSelf: {
		alignSelf: "stretch",
	},
}));
