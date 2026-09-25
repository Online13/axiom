import type { ReactElement, ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarRootProps } from "@/components/ui/calendar";
import { Chip } from "@/components/ui/chip";
import { Field, inputColors } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import type { HapticKind } from "@/components/core/haptics";
import { Tappable } from "@/components/core/tappable";
import { useTheme } from "@/theme";

import {
	useDatePicker,
	type DatePickerConfirm,
	type DatePickerMode,
	type DatePickerValue,
} from "../use-date-picker";

export { formatDateValue, type DatePickerValue } from "../use-date-picker";

export type DatePickerPreset = {
	label: string;
	value: DatePickerValue;
};

export type DatePickerProps = {
	mode?: DatePickerMode;
	/** Played when a day or a preset is picked. `false` turns it off. */
	haptic?: HapticKind | false;
	/** The selected date or range. `null` shows the placeholder. */
	value?: DatePickerValue;
	/** Called with the new value when the user confirms. */
	onChange?: (value: DatePickerValue) => void;
	confirm?: DatePickerConfirm;
	label?: string;
	placeholder?: string;
	helper?: string;
	/** Puts the field in the `invalid` state. A string also replaces `helper`. */
	error?: string | boolean;
	/** How the value is written in the field. */
	format?: (value: DatePickerValue) => string;
	/** Title of the sheet. Defaults to `label`. */
	title?: string;
	minDate?: Date;
	maxDate?: Date;
	isDateDisabled?: (date: Date) => boolean;
	/** Shortcut chips above the calendar: "Today", "Next weekend". */
	presets?: DatePickerPreset[];
	/** Adds a Clear action in the sheet that sets the value to `null`. */
	clearable?: boolean;
	disabled?: boolean;
	/** Replaces the default field, for example with a Chip or a Button. */
	trigger?: ReactElement;
	/** Any other `Calendar.Root` prop, like `weekStartsOn` or `minRange`. */
	calendarProps?: Partial<CalendarRootProps>;
	/** Children of the `Calendar.Root` inside the sheet, to change its parts. */
	renderCalendar?: () => ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
};

export function DatePicker({
	mode = "single",
	haptic,
	value = null,
	onChange,
	confirm = "done",
	label,
	placeholder = "Select a date",
	helper,
	error,
	format,
	title,
	minDate,
	maxDate,
	isDateDisabled,
	presets,
	clearable = false,
	disabled = false,
	trigger,
	calendarProps,
	renderCalendar,
	containerStyle,
}: DatePickerProps) {
	const { tokens, components } = useTheme();
	const picker = useDatePicker({
		mode,
		value,
		onChange,
		confirm,
		format,
		locale: calendarProps?.locale,
		haptic,
	});

	const invalid = error !== undefined && error !== false && error !== "";
	const message =
		typeof error === "string" && error !== "" ? error : undefined;
	const state = disabled
		? "disabled"
		: invalid
			? "invalid"
			: picker.open
				? "focused"
				: "default";
	const colors = inputColors(components, "outline", state);

	const field = trigger ?? (
		<Tappable
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityValue={{
				text: picker.isEmpty ? placeholder : picker.text,
			}}
			accessibilityHint="Opens a calendar"
			disabled={disabled}
			style={[
				styles.control,
				{
					minHeight: tokens.sizes.control.md,
					paddingHorizontal: tokens.spacing[3],
					gap: tokens.spacing[2],
					borderRadius: tokens.radius.md,
					backgroundColor: colors.background ?? "transparent",
					borderColor: colors.border ?? "transparent",
				},
			]}
		>
			<Icon name="calendar" size="md" color={colors.affix} />
			<Text
				maxFontSizeMultiplier={MAX_FONT_SCALE.control}
				numberOfLines={1}
				style={{
					flex: 1,
					color: picker.isEmpty ? colors.placeholder : colors.text,
				}}
			>
				{picker.isEmpty ? placeholder : picker.text}
			</Text>
		</Tappable>
	);

	return (
		<BottomSheet.Root open={picker.open} onOpenChange={picker.setOpen}>
			<Field
				label={label}
				helper={helper}
				message={message}
				disabled={disabled}
				style={containerStyle}
			>
				<BottomSheet.Trigger asChild disabled={disabled}>
					{field}
				</BottomSheet.Trigger>
			</Field>

			<BottomSheet.Content>
				<BottomSheet.Handle />
				<BottomSheet.Header
					title={title ?? label}
					leading={
						<Button variant="ghost" size="sm" onPress={picker.cancel}>
							Cancel
						</Button>
					}
					trailing={
						confirm === "instant" ? undefined : (
							<Button variant="ghost" size="sm" onPress={picker.done}>
								Done
							</Button>
						)
					}
				/>

				<View
					style={{
						paddingHorizontal: tokens.metrics.screenMargin,
						gap: tokens.spacing[3],
					}}
				>
					{presets && presets.length > 0 ? (
						<View style={[styles.presets, { gap: tokens.spacing[2] }]}>
							{presets.map((preset) => (
								<Chip
									key={preset.label}
									onPress={() =>
										picker.select(preset.value ?? undefined)
									}
								>
									{preset.label}
								</Chip>
							))}
						</View>
					) : null}

					<Calendar.Root
						mode={mode}
						selected={picker.draft}
						onSelect={picker.select}
						minDate={minDate}
						maxDate={maxDate}
						isDateDisabled={isDateDisabled}
						{...calendarProps}
					>
						{renderCalendar?.() ?? (
							<>
								<Calendar.Header>
									<Calendar.Title />
									<Calendar.Nav>
										<Calendar.PrevButton />
										<Calendar.NextButton />
									</Calendar.Nav>
								</Calendar.Header>
								<Calendar.Grid>
									<Calendar.Weekdays />
									<Calendar.Days />
								</Calendar.Grid>
							</>
						)}
					</Calendar.Root>

					{clearable ? (
						<Button
							variant="ghost"
							fullWidth
							onPress={picker.clear}
							disabled={picker.isEmpty}
						>
							Clear
						</Button>
					) : null}
				</View>
			</BottomSheet.Content>
		</BottomSheet.Root>
	);
}

const styles = StyleSheet.create({
	control: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderCurve: "continuous",
	},
	presets: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
});
