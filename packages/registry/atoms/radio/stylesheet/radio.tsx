import { createContext, use, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Tappable } from "@/components/core/tappable";
import { Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";
import { useTheme, type Spacing } from "@/theme";

type RadioGroupContextValue = {
	value: string | undefined;
	select: (value: string) => void;
	disabled: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioGroupProps = {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: "vertical" | "horizontal";
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
	const { tokens } = useTheme();
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
				style={[
					{ gap: tokens.spacing[gap] },
					orientation === "horizontal" && styles.horizontal,
					style,
				]}
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
	const { components } = useTheme();
	const states = components.radio.default;
	const colors = {
		...states.default,
		...(checked ? states.checked : undefined),
		...(disabled ? states.disabled : undefined),
	};

	return (
		<View style={[styles.circle, { borderColor: colors.border }]}>
			{checked ? (
				<View style={[styles.dot, { backgroundColor: colors.indicator }]} />
			) : null}
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
	const { tokens } = useTheme();

	return (
		<View style={[styles.row, { gap: tokens.spacing[3] }]}>
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

const styles = StyleSheet.create({
	horizontal: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	circle: {
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	text: {
		flexShrink: 1,
		gap: 2,
	},
});
