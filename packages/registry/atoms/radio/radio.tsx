import {
	createContext,
	use,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";
import type { Spacing } from "@/theme";

import { useRadioStyles } from "./radio.styles";

type RadioGroupContextValue = {
	value: string | undefined;
	select: (value: string) => void;
	disabled: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioOrientation = "vertical" | "horizontal";

export type RadioGroupProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: RadioOrientation;
	/** Space between radios, from the spacing tokens. */
	gap?: keyof Spacing;
	disabled?: boolean;
	/** Played when the user picks another radio. Off unless you pass a kind, e.g. `"selection"`. */
	haptic?: HapticKind | false;
	/** Name of the question, announced once for the group. */
	accessibilityLabel?: string;
	children?: ReactNode;
};

export function RadioGroup({
	value,
	defaultValue,
	onValueChange,
	orientation = "vertical",
	gap = 3,
	disabled = false,
	haptic: hapticKind,
	children,
	...props
}: RadioGroupProps) {
	const styles = useRadioStyles();
	const [selected, select] = useControllableState<string | undefined>({
		value,
		defaultValue,
		onChange: (next) => next !== undefined && onValueChange?.(next),
	});
	const pick = (next: string) => {
		if (hapticKind && next !== selected) haptic(hapticKind);
		select(next);
	};

	return (
		<RadioGroupContext value={{ value: selected, select: pick, disabled }}>
			<View
				accessibilityRole="radiogroup"
				{...props}
				{...styles.group(orientation, gap, props)}
			>
				{children}
			</View>
		</RadioGroupContext>
	);
}

export type RadioState = { checked: boolean; pressed: boolean };

export type RadioProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> & {
	value: string;
	label?: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
	/** Replaces the default row, to build a selectable card around the radio. */
	children?: (state: RadioState) => ReactNode;
	style?: StyleProp<ViewStyle>;
};

export function Radio({
	value,
	label,
	description,
	disabled: disabledProp = false,
	accessibilityLabel,
	children,
	...props
}: RadioProps) {
	const group = use(RadioGroupContext);
	if (!group) {
		throw new Error("Radio must be rendered inside a RadioGroup.");
	}

	const checked = group.value === value;
	const disabled = disabledProp || group.disabled;

	return (
		<Tappable
			{...props}
			disabled={disabled}
			accessibilityRole="radio"
			accessibilityLabel={
				accessibilityLabel ??
				(typeof label === "string" ? label : undefined)
			}
			accessibilityState={{ checked }}
			onPress={() => group.select(value)}
		>
			{({ pressed }) =>
				children ? (
					children({ checked, pressed })
				) : (
					<RadioRow
						checked={checked}
						disabled={disabled}
						label={label}
						description={description}
					/>
				)
			}
		</Tappable>
	);
}

/** The circle only, for custom rows built with the render function. */
export function RadioIndicator({
	checked,
	disabled = false,
}: {
	checked: boolean;
	disabled?: boolean;
}) {
	const styles = useRadioStyles();

	return (
		<View {...styles.circle(checked, disabled)}>
			{checked ? <View {...styles.dot(checked, disabled)} /> : null}
		</View>
	);
}

function RadioRow({
	checked,
	disabled,
	label,
	description,
}: {
	checked: boolean;
	disabled: boolean;
	label?: ReactNode;
	description?: ReactNode;
}) {
	const styles = useRadioStyles();

	return (
		<View {...styles.row}>
			<RadioIndicator checked={checked} disabled={disabled} />
			{label !== undefined || description !== undefined ? (
				<View {...styles.text}>
					{typeof label === "string" ? (
						<Text color={disabled ? "disabled" : "default"}>{label}</Text>
					) : (
						label
					)}
					{typeof description === "string" ? (
						<Text
							variant="footnote"
							color={disabled ? "disabled" : "muted"}
						>
							{description}
						</Text>
					) : (
						description
					)}
				</View>
			) : null}
		</View>
	);
}
