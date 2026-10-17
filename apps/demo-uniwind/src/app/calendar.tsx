import { useState } from "react";
import { View } from "react-native";

import {
	Calendar,
	type CalendarSelection,
	type DateRange,
} from "@/components/ui/calendar";
import { Text } from "@/components/ui/text";
import { Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

// Built once: a formatter per render is slow on Android.
const DAY_MONTH = new Intl.DateTimeFormat(undefined, {
	day: "numeric",
	month: "short",
});
const MONTH = new Intl.DateTimeFormat(undefined, { month: "long" });

const format = (date: Date | undefined) =>
	date ? DAY_MONTH.format(date) : "…";

export default function CalendarScreen() {
	const [date, setDate] = useState<CalendarSelection>(new Date());
	const [month, setMonth] = useState<CalendarSelection>(new Date());
	const [range, setRange] = useState<CalendarSelection>();
	const today = new Date();
	const busy = new Set([3, 9, 17, 24]);
	const nights = range as DateRange | undefined;

	return (
		<Screen>
			<Section
				title="Events"
				description={`Selected: ${format(date instanceof Date ? date : undefined)}. The navigation sits before the month title.`}
			>
				<Panel>
					<Calendar.Root selected={date} onSelect={setDate}>
						<Calendar.Header>
							<Calendar.Nav>
								<Calendar.PrevButton variant="outline" shape="square" />
								<Calendar.NextButton variant="outline" shape="square" />
							</Calendar.Nav>
							<Calendar.Title />
						</Calendar.Header>
						<Calendar.Grid>
							<Calendar.Weekdays />
							<Calendar.Days weeks="fixed">
								{(day) => (
									<Calendar.Day day={day}>
										{busy.has(day.date.getDate()) &&
										!day.isOutside ? (
											<Calendar.Dot />
										) : null}
									</Calendar.Day>
								)}
							</Calendar.Days>
						</Calendar.Grid>
					</Calendar.Root>
				</Panel>
			</Section>

			<Section
				title="Compact month"
				description={`Selected: ${format(month instanceof Date ? month : undefined)}. This version places the title between standalone arrows.`}
			>
				<Panel>
					<Calendar.Root selected={month} onSelect={setMonth}>
						<Calendar.Header style={{ paddingStart: 0 }}>
							<Calendar.PrevButton variant="tinted" />
							<Calendar.Title>
								{(visibleMonth) => (
									<View className="items-center">
										<Text variant="bodyLg" weight="bold">
											{MONTH.format(visibleMonth)}
										</Text>
									</View>
								)}
							</Calendar.Title>
							<Calendar.NextButton variant="tinted" />
						</Calendar.Header>
						<Calendar.Grid>
							<Calendar.Weekdays format="narrow" />
							<Calendar.Days showOutsideDays={false} />
						</Calendar.Grid>
					</Calendar.Root>
				</Panel>
			</Section>

			<Section
				title="Stay"
				description={`From ${format(nights?.from)} to ${format(nights?.to)}. The grid comes first and the month controls sit below it.`}
			>
				<Panel>
					<Calendar.Root
						mode="range"
						selected={range}
						onSelect={setRange}
						minDate={today}
						maxRange={14}
						isDateDisabled={(d) => d.getDay() === 0}
						weekStartsOn={1}
					>
						<Calendar.Grid>
							<Calendar.Weekdays format="narrow" />
							<Calendar.Days showOutsideDays={false} />
						</Calendar.Grid>
						<Calendar.Header style={{ justifyContent: "center" }}>
							<Calendar.Nav>
								<Calendar.PrevButton variant="outline" />
								<Calendar.NextButton variant="outline" />
							</Calendar.Nav>
							<Calendar.Title format="month" />
						</Calendar.Header>
					</Calendar.Root>
				</Panel>
			</Section>
		</Screen>
	);
}
