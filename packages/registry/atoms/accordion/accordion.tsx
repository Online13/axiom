import { type ComponentPropsWithRef, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { useAccordionStyles } from "./accordion.styles";

import {
	AccordionContext,
	AccordionItemContext,
	useAccordion,
	useAccordionContent,
	useAccordionContext,
	useAccordionIndicator,
	useAccordionItem,
	type UseAccordionOptions,
} from "./use-accordion";

export type AccordionProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> &
	UseAccordionOptions & {
		/** Items, with a Separator between them where you want a line. */
		children?: ReactNode;
		style?: StyleProp<ViewStyle>;
	};

function AccordionRoot({
	children,
	style,
	type,
	value,
	defaultValue,
	onValueChange,
	collapsible,
	disabled,
	...props
}: AccordionProps) {
	const accordion = useAccordion({
		type,
		value,
		defaultValue,
		onValueChange,
		collapsible,
		disabled,
	});

	return (
		<AccordionContext value={accordion}>
			<View {...props} style={style}>
				{children}
			</View>
		</AccordionContext>
	);
}

export type AccordionItemProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	value: string;
	disabled?: boolean;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function AccordionItem({
	value,
	disabled = false,
	children,
	style,
	...props
}: AccordionItemProps) {
	const accordion = useAccordionContext();
	const inactive = disabled || accordion.disabled;

	return (
		<AccordionItemContext
			value={{
				value,
				open: !inactive && accordion.isOpen(value),
				disabled: inactive,
				toggle: () => accordion.toggle(value),
			}}
		>
			<View {...props} style={style}>
				{children}
			</View>
		</AccordionItemContext>
	);
}

export type AccordionTriggerProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> & {
	children?: ReactNode;
	/** Indicator on the right, rotated when open. `null` hides it. */
	icon?: ReactNode | null;
	leading?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function AccordionTrigger({
	children,
	icon,
	leading,
	...props
}: AccordionTriggerProps) {
	const styles = useAccordionStyles();
	const { open, disabled, toggle } = useAccordionItem();
	const indicatorStyle = useAccordionIndicator(open);

	return (
		<Tappable
			{...props}
			disabled={disabled}
			accessibilityState={{ expanded: open }}
			onPress={toggle}
			{...styles.trigger(props)}
		>
			{leading}
			<View {...styles.title}>
				{typeof children === "string" ? (
					<Text weight="medium" color={disabled ? "disabled" : "default"}>
						{children}
					</Text>
				) : (
					children
				)}
			</View>
			{icon === null ? null : (
				<Animated.View style={indicatorStyle}>
					{icon ?? (
						<Icon
							name="chevron-down"
							size="sm"
							color={disabled ? "disabled" : "muted"}
						/>
					)}
				</Animated.View>
			)}
		</Tappable>
	);
}

export type AccordionContentProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	children?: ReactNode;
	/** Keeps the content mounted while closed, to preserve its state. */
	forceMount?: boolean;
	style?: StyleProp<ViewStyle>;
};

function AccordionContent({
	children,
	forceMount = false,
	onLayout,
	...props
}: AccordionContentProps) {
	const styles = useAccordionStyles();
	const { open } = useAccordionItem();
	const content = useAccordionContent(open, forceMount);

	if (!content.rendered) return null;

	return (
		<Animated.View
			accessibilityElementsHidden={!open}
			importantForAccessibility={open ? "auto" : "no-hide-descendants"}
			style={[styles.clip, content.containerStyle]}
		>
			{/* Absolute, so it keeps its natural height while the container animates. */}
			<View
				{...props}
				onLayout={(event) => {
					content.onLayout(event);
					onLayout?.(event);
				}}
				{...styles.measure(props)}
			>
				{typeof children === "string" ? (
					<Text variant="bodySm" color="muted">
						{children}
					</Text>
				) : (
					children
				)}
			</View>
		</Animated.View>
	);
}

export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Content: AccordionContent,
});
