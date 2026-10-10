import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";

import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { Icon } from "@/components/ui/icon/icon";
import type { Theme } from "@/theme";
import { stateColors } from "@/theme/components/states";

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
			style={[styles.row, props.style]}
		>
			<CheckboxIndicator checked={value} error={error} disabled={disabled} />
			{label !== undefined || description !== undefined ? (
				<View style={styles.text}>
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
	const on = checked !== false;

	return (
		<View style={styles.box(on, error, disabled)}>
			{on ? (
				<CheckboxIcon
					name={checked === "indeterminate" ? "minus" : "check"}
					size="sm"
					uniProps={(theme: Theme) => ({
						color: checkboxColors(theme.components, on, error, disabled)
							.indicator,
					})}
				/>
			) : null}
		</View>
	);
}

const BOX = 22;

function checkboxColors(
	components: Theme["components"],
	on: boolean,
	error: boolean,
	disabled: boolean,
) {
	const states = components.checkbox.default;
	return stateColors(
		states,
		on && "checked",
		error && !disabled && "invalid",
		disabled && "disabled",
	);
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `indicator` gives it.
const CheckboxIcon = withUnistyles(Icon);

const styles = StyleSheet.create((theme) => ({
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: theme.tokens.spacing[3],
	},
	box: (on: boolean, error: boolean, disabled: boolean) => {
		const colors = checkboxColors(theme.components, on, error, disabled);
		return {
			width: BOX,
			height: BOX,
			borderWidth: 2,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: theme.tokens.radius.sm,
			borderColor: colors.border,
			backgroundColor: colors.background ?? "transparent",
		};
	},
	text: {
		flex: 1,
		gap: 2,
	},
}));
