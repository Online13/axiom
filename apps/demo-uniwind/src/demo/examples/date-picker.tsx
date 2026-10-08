import { useState } from "react";
import { View } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker, type DatePickerValue } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

const today = () => new Date();
const inDays = (days: number) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date;
};

/** The calendar parts every sheet below shows. Change them here, or write them inline. */
function Month() {
	return (
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
	);
}

export default function DatePickerScreen() {
	const { tokens } = useTheme();
	const [disabled, setDisabled] = useState(false);
	const [departure, setDeparture] = useState<DatePickerValue>(null);
	const [due, setDue] = useState<DatePickerValue>(today());
	const [stay, setStay] = useState<DatePickerValue>({
		from: today(),
		to: inDays(4),
	});
	const [submitted, setSubmitted] = useState(false);
	const body = {
		paddingHorizontal: tokens.metrics.screenMargin,
		paddingBottom: tokens.spacing[4],
		gap: tokens.spacing[3],
	};

	return (
		<Screen>
			<Panel>
				<Row label="Disabled">
					<Switch
						value={disabled}
						onValueChange={setDisabled}
						accessibilityLabel="Disabled"
					/>
				</Row>
			</Panel>

			<Section
				title="DatePicker"
				description="A Field around a trigger that opens a calendar in a sheet. Cancel reverts, Done applies."
			>
				<Panel>
					<Field disabled={disabled}>
						<Field.Label>Departure</Field.Label>
						<DatePicker value={departure} onChange={setDeparture}>
							<DatePicker.Trigger />
							<BottomSheet.Content>
								<BottomSheet.Handle />
								<BottomSheet.Header
									title="Departure"
									leading={<DatePicker.Cancel />}
									trailing={<DatePicker.Done />}
								/>
								<View style={body}>
									<DatePicker.Calendar minDate={today()}>
										<Month />
									</DatePicker.Calendar>
								</View>
							</BottomSheet.Content>
						</DatePicker>
						{submitted && departure === null ? (
							<Field.Error>Pick a departure date.</Field.Error>
						) : (
							<Field.Description>No date before today.</Field.Description>
						)}
					</Field>
					<Button
						fullWidth
						disabled={disabled}
						onPress={() => setSubmitted(true)}
					>
						Search
					</Button>
				</Panel>
			</Section>

			<Section
				title="Instant and presets"
				description="Closes on the first press, with shortcuts above the calendar."
			>
				<Panel>
					<Field disabled={disabled}>
						<Field.Label>Due</Field.Label>
						<DatePicker confirm="instant" value={due} onChange={setDue}>
							<DatePicker.Trigger />
							<BottomSheet.Content>
								<BottomSheet.Handle />
								<BottomSheet.Header
									title="Due"
									leading={<DatePicker.Cancel />}
								/>
								<View style={body}>
									<View className="flex-row flex-wrap" style={{ gap: tokens.spacing[2] }}>
										<DatePicker.Preset value={today()}>Today</DatePicker.Preset>
										<DatePicker.Preset value={inDays(1)}>
											Tomorrow
										</DatePicker.Preset>
										<DatePicker.Preset value={inDays(7)}>
											Next week
										</DatePicker.Preset>
									</View>
									<DatePicker.Calendar>
										<Month />
									</DatePicker.Calendar>
									<DatePicker.Clear fullWidth />
								</View>
							</BottomSheet.Content>
						</DatePicker>
					</Field>
					<Label muted>
						{due === null
							? "No due date."
							: "Tap a chip or a day: the sheet closes at once."}
					</Label>
				</Panel>
			</Section>

			<Section
				title="Range"
				description="A start and an end date, written as one line in the field."
			>
				<Panel>
					<Field disabled={disabled}>
						<Field.Label>Stay</Field.Label>
						<DatePicker mode="range" value={stay} onChange={setStay}>
							<DatePicker.Trigger placeholder="Select your dates" />
							<BottomSheet.Content>
								<BottomSheet.Handle />
								<BottomSheet.Header
									title="Stay"
									leading={<DatePicker.Cancel />}
									trailing={<DatePicker.Done />}
								/>
								<View style={body}>
									<DatePicker.Calendar minRange={1}>
										<Month />
									</DatePicker.Calendar>
								</View>
							</BottomSheet.Content>
						</DatePicker>
					</Field>
				</Panel>
			</Section>

			<Section
				title="Custom trigger"
				description="Any element can open the sheet: the picker is a bottom sheet."
			>
				<Panel>
					<DatePicker value={due} onChange={setDue}>
						<BottomSheet.Trigger asChild disabled={disabled}>
							<Button variant="outline" fullWidth disabled={disabled}>
								Change the date
							</Button>
						</BottomSheet.Trigger>
						<BottomSheet.Content>
							<BottomSheet.Handle />
							<BottomSheet.Header
								title="Pick a day"
								leading={<DatePicker.Cancel />}
								trailing={<DatePicker.Done />}
							/>
							<View style={body}>
								<DatePicker.Calendar>
									<Month />
								</DatePicker.Calendar>
							</View>
						</BottomSheet.Content>
					</DatePicker>
				</Panel>
			</Section>
		</Screen>
	);
}
