import { createContext, use, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";
import type { Spacing, Theme } from "@/theme";

type RadioGroupContextValue = {
	value: string | undefined;
	select: (value: string) => void;
	disabled: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioOrientation = "vertical" | "horizontal";

export type RadioGroupProps = {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: RadioOrientation;
	/** Space between radios, from the spacing tokens. */
	gap?: keyof Spacing;
	disabled?: boolean;
	/** Name of the question, announced once for the group. */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
	children?: ReactNode;
};

export function RadioGroup({
	value,
	defaultValue,
	onValueChange,
	orientation = "vertical",
	gap = 3,
	disabled = false,
	accessibilityLabel,
	style,
	children,
}: RadioGroupProps) {
	const [selected, select] = useControllableState<string | undefined>({
		value,
		defaultValue,
		onChange: (next) => next !== undefined && onValueChange?.(next),
	});

	return (
		<RadioGroupContext value={{ value: selected, select, disabled }}>
			<View
				accessibilityRole="radiogroup"
				accessibilityLabel={accessibilityLabel}
				style={[styles.group(orientation, gap), style]}
			>
				{children}
			</View>
		</RadioGroupContext>
	);
}

export type RadioState = { checked: boolean; pressed: boolean };

export type RadioProps = {
	value: string;
	label?: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
	accessibilityLabel?: string;
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
	style,
}: RadioProps) {
	const group = use(RadioGroupContext);
	if (!group) {
		throw new Error("Radio must be rendered inside a RadioGroup.");
	}

	const checked = group.value === value;
	const disabled = disabledProp || group.disabled;

	return (
		<Tappable
			disabled={disabled}
			accessibilityRole="radio"
			accessibilityLabel={
				accessibilityLabel ??
				(typeof label === "string" ? label : undefined)
			}
			accessibilityState={{ checked }}
			onPress={() => group.select(value)}
			style={style}
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
	return (
		<View style={styles.circle(checked, disabled)}>
			{checked ? <View style={styles.dot(checked, disabled)} /> : null}
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
	return (
		<View style={styles.row}>
			<RadioIndicator checked={checked} disabled={disabled} />
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

const SIZE = 22;

function radioColors(
	components: Theme["components"],
	checked: boolean,
	disabled: boolean,
) {
	const states = components.radio.default;
	return {
		...states.default,
		...(checked ? states.checked : undefined),
		...(disabled ? states.disabled : undefined),
	};
}

const styles = StyleSheet.create((theme) => ({
	group: (orientation: RadioOrientation, gap: keyof Spacing) => ({
		gap: theme.tokens.spacing[gap],
		...(orientation === "horizontal" && {
			flexDirection: "row",
			flexWrap: "wrap",
		}),
	}),
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: theme.tokens.spacing[3],
	},
	circle: (checked: boolean, disabled: boolean) => ({
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
		borderColor: radioColors(theme.components, checked, disabled).border,
	}),
	dot: (checked: boolean, disabled: boolean) => ({
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: radioColors(theme.components, checked, disabled)
			.indicator,
	}),
	text: {
		flexShrink: 1,
		gap: 2,
	},
}));
