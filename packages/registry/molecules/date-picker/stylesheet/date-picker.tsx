import type { ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Calendar, type CalendarRootProps } from "@/components/ui/calendar";
import { Chip, type ChipProps } from "@/components/ui/chip";
import { inputColors } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useField } from "@/components/ui/use-input";
import type { HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { useTheme } from "@/theme";

import {
	DatePickerContext,
	formatDateValue,
	useDatePicker,
	useDatePickerContext,
	type DatePickerConfirm,
	type DatePickerMode,
	type DatePickerValue,
} from "../use-date-picker";

export { formatDateValue, type DatePickerValue } from "../use-date-picker";

export type DatePickerProps = {
	mode?: DatePickerMode;
	/** The selected date or range. `null` shows the placeholder. */
	value?: DatePickerValue;
	/** Called with the new value on Done, Clear, or the first press with `confirm="instant"`. */
	onChange?: (value: DatePickerValue) => void;
	/** `done` waits for DatePicker.Done, `instant` closes on the first press of a single date. */
	confirm?: DatePickerConfirm;
	/** Played when a day or a preset is picked. `false` turns it off. */
	haptic?: HapticKind | false;
	/** The trigger and the sheet: write them where you want them. */
	children?: ReactNode;
};

/**
 * Holds the committed value and the draft being edited, and opens a bottom sheet. Everything
 * visible is a part you write: the trigger, the sheet header, the calendar and its actions.
 */
function DatePickerRoot({
	mode,
	value,
	onChange,
	confirm,
	haptic,
	children,
}: DatePickerProps) {
	const picker = useDatePicker({ mode, value, onChange, confirm, haptic });

	return (
		<DatePickerContext value={picker}>
			<BottomSheet.Root open={picker.open} onOpenChange={picker.setOpen}>
				{children}
			</BottomSheet.Root>
		</DatePickerContext>
	);
}

export type DatePickerTriggerProps = Omit<
	TappableProps,
	"children" | "style" | "onPress"
> & {
	placeholder?: string;
	/** How the value is written. Defaults to `formatDateValue` in the device's locale. */
	format?: (value: DatePickerValue) => string;
	/** Inside a Field, it follows the Field. */
	invalid?: boolean;
	style?: StyleProp<ViewStyle>;
};

/** A field that shows the value and opens the sheet. Inside a Field, it announces its label. */
function DatePickerTrigger({
	placeholder = "Select a date",
	format = formatDateValue,
	invalid: invalidProp,
	disabled: disabledProp,
	accessibilityLabel,
	accessibilityHint,
	style,
	...props
}: DatePickerTriggerProps) {
	const { tokens, components } = useTheme();
	const picker = useDatePickerContext();
	const field = useField();

	const disabled = disabledProp ?? field?.disabled ?? false;
	const invalid = invalidProp ?? field?.invalid ?? false;
	const state = disabled
		? "disabled"
		: invalid
			? "invalid"
			: picker.open
				? "focused"
				: "default";
	const colors = inputColors(components, "outline", state);
	const text = picker.isEmpty ? placeholder : format(picker.value);
	const hint = [
		field?.required ? "Required" : undefined,
		field?.error ?? field?.description,
		accessibilityHint ?? "Opens a calendar",
	]
		.filter(Boolean)
		.join(". ");

	return (
		<BottomSheet.Trigger asChild disabled={disabled}>
			<Tappable
				accessibilityRole="button"
				accessibilityLabel={accessibilityLabel ?? field?.label}
				accessibilityValue={{ text }}
				accessibilityHint={hint}
				{...props}
				disabled={disabled}
				style={[
					styles.control,
					{
						height: tokens.sizes.input.md,
						paddingHorizontal: tokens.spacing[3],
						gap: tokens.spacing[2],
						borderRadius: components.input.radius,
						backgroundColor: colors.background ?? "transparent",
						borderColor: colors.border ?? "transparent",
					},
					style,
				]}
			>
				<Icon name="calendar" size="md" color={colors.affix} />
				<Text
					maxFontSizeMultiplier={MAX_FONT_SCALE.control}
					numberOfLines={1}
					style={[
						styles.value,
						{ color: picker.isEmpty ? colors.placeholder : colors.text },
					]}
				>
					{text}
				</Text>
			</Tappable>
		</BottomSheet.Trigger>
	);
}

export type DatePickerCalendarProps = Omit<
	CalendarRootProps,
	"mode" | "selected" | "onSelect"
>;

/** A Calendar.Root bound to the draft. Put the Calendar parts you want inside it. */
function DatePickerCalendar(props: DatePickerCalendarProps) {
	const picker = useDatePickerContext();

	return (
		<Calendar.Root
			{...props}
			mode={picker.mode}
			selected={picker.draft}
			onSelect={picker.select}
		/>
	);
}

export type DatePickerActionProps = Omit<ButtonProps, "onPress">;

/** Drops the draft and closes. */
function DatePickerCancel({ children = "Cancel", ...props }: DatePickerActionProps) {
	const picker = useDatePickerContext();

	return (
		<Button variant="ghost" size="sm" {...props} onPress={picker.cancel}>
			{children}
		</Button>
	);
}

/** Applies the draft and closes. Leave it out with `confirm="instant"`. */
function DatePickerDone({ children = "Done", ...props }: DatePickerActionProps) {
	const picker = useDatePickerContext();

	return (
		<Button variant="ghost" size="sm" {...props} onPress={picker.done}>
			{children}
		</Button>
	);
}

/** Sets the value to `null` and closes. */
function DatePickerClear({
	children = "Clear",
	disabled,
	...props
}: DatePickerActionProps) {
	const picker = useDatePickerContext();

	return (
		<Button
			variant="ghost"
			{...props}
			disabled={disabled ?? picker.isEmpty}
			onPress={picker.clear}
		>
			{children}
		</Button>
	);
}

export type DatePickerPresetProps = Omit<ChipProps, "onPress" | "selected"> & {
	/** Picked into the draft, like a press on the calendar. */
	value: DatePickerValue;
};

/** A shortcut chip, such as "Today" or "Next weekend". */
function DatePickerPreset({ value, ...props }: DatePickerPresetProps) {
	const picker = useDatePickerContext();

	return <Chip {...props} onPress={() => picker.select(value ?? undefined)} />;
}

export const DatePicker = Object.assign(DatePickerRoot, {
	Trigger: DatePickerTrigger,
	Calendar: DatePickerCalendar,
	Cancel: DatePickerCancel,
	Done: DatePickerDone,
	Clear: DatePickerClear,
	Preset: DatePickerPreset,
});

const styles = StyleSheet.create({
	control: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderCurve: "continuous",
	},
	value: {
		flex: 1,
	},
});
