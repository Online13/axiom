import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";
import type { Theme } from "@/theme";

export type CheckedState = boolean | "indeterminate";

export type CheckboxProps = {
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
	/** Required when there is no `label`. */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

const BOX = 22;

function checkboxColors(
	components: Theme["components"],
	on: boolean,
	error: boolean,
	disabled: boolean,
) {
	const states = components.checkbox.default;
	return {
		...states.default,
		...(on ? states.checked : undefined),
		...(error && !disabled ? states.invalid : undefined),
		...(disabled ? states.disabled : undefined),
	};
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

export function Checkbox({
	checked,
	defaultChecked = false,
	onCheckedChange,
	label,
	description,
	disabled = false,
	error = false,
	accessibilityLabel,
	style,
}: CheckboxProps) {
	const [value, setValue] = useControllableState<CheckedState>({
		value: checked,
		defaultValue: defaultChecked,
		onChange: (next) => onCheckedChange?.(next === true),
	});

	return (
		<Tappable
			disabled={disabled}
			accessibilityRole="checkbox"
			accessibilityLabel={
				accessibilityLabel ??
				(typeof label === "string" ? label : undefined)
			}
			accessibilityState={{
				checked: value === "indeterminate" ? "mixed" : value,
			}}
			onPress={() => setValue(value !== true)}
			style={[styles.row, style]}
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
				<ThemedIcon
					name={checked === "indeterminate" ? "minus" : "check"}
					size="sm"
					uniProps={(theme) => ({
						color: checkboxColors(theme.components, on, error, disabled)
							.indicator,
					})}
				/>
			) : null}
		</View>
	);
}

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
