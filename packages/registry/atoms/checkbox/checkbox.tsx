import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";

import { CheckboxIcon, useCheckboxStyles } from "./checkbox.styles";

export type CheckedState = boolean | "indeterminate";

export type CheckboxProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> & {
	checked?: CheckedState;
	defaultChecked?: boolean;
	/** Called with the new state. Pressing an indeterminate checkbox calls it with `true`. */
	onCheckedChange?: (checked: boolean) => void;
	/** Text next to the box. The whole row becomes pressable. */
	label?: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
	/** Error border, for a required checkbox left unchecked. */
	error?: boolean;
	/** Played when the user changes the value. Off unless you pass a kind, e.g. `"selection"`. */
	haptic?: HapticKind | false;
	/** Required when there is no `label`. */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

export function Checkbox({
	checked,
	defaultChecked = false,
	onCheckedChange,
	label,
	description,
	disabled = false,
	error = false,
	haptic: hapticKind,
	accessibilityLabel,
	...props
}: CheckboxProps) {
	const styles = useCheckboxStyles();
	const [value, setValue] = useControllableState<CheckedState>({
		value: checked,
		defaultValue: defaultChecked,
		onChange: (next) => onCheckedChange?.(next === true),
	});

	return (
		<Tappable
			{...props}
			disabled={disabled}
			accessibilityRole="checkbox"
			accessibilityLabel={
				accessibilityLabel ??
				(typeof label === "string" ? label : undefined)
			}
			accessibilityState={{
				checked: value === "indeterminate" ? "mixed" : value,
			}}
			onPress={() => {
				if (hapticKind) haptic(hapticKind);
				setValue(value !== true);
			}}
			{...styles.row(props)}
		>
			<CheckboxIndicator checked={value} error={error} disabled={disabled} />
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
							color={disabled ? "disabled" : error ? "error" : "muted"}
						>
							{description}
						</Text>
					) : (
						description
					)}
				</View>
			) : null}
		</Tappable>
	);
}

/** The box only, for custom rows. */
export function CheckboxIndicator({
	checked,
	error = false,
	disabled = false,
}: {
	checked: CheckedState;
	error?: boolean;
	disabled?: boolean;
}) {
	const styles = useCheckboxStyles();
	const on = checked !== false;

	return (
		<View {...styles.box(on, error, disabled)}>
			{on ? (
				<CheckboxIcon
					name={checked === "indeterminate" ? "minus" : "check"}
					size="sm"
					{...styles.indicator(on, error, disabled)}
				/>
			) : null}
		</View>
	);
}
