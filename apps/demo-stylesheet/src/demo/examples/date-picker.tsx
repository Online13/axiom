import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DatePicker, type DatePickerValue } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { Label, Panel, Row, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';

const today = () => new Date();
const inDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export default function DatePickerScreen() {
  const [disabled, setDisabled] = useState(false);
  const [departure, setDeparture] = useState<DatePickerValue>(null);
  const [due, setDue] = useState<DatePickerValue>(today());
  const [stay, setStay] = useState<DatePickerValue>({ from: today(), to: inDays(4) });
  const [submitted, setSubmitted] = useState(false);

  return (
    <Screen>
      <Panel>
        <Row label="Disabled">
          <Switch value={disabled} onValueChange={setDisabled} accessibilityLabel="Disabled" />
        </Row>
      </Panel>

      <Section title="DatePicker" description="The field opens a calendar in a sheet. Cancel reverts, Done applies.">
        <Panel>
          <DatePicker
            label="Departure"
            placeholder="Select a date"
            value={departure}
            onChange={setDeparture}
            minDate={today()}
            disabled={disabled}
            error={submitted && departure === null ? 'Pick a departure date.' : undefined}
            helper="No date before today."
          />
          <Button fullWidth disabled={disabled} onPress={() => setSubmitted(true)}>
            Search
          </Button>
        </Panel>
      </Section>

      <Section title="Instant and presets" description="Closes on the first press, with shortcuts above the calendar.">
        <Panel>
          <DatePicker
            label="Due"
            confirm="instant"
            clearable
            value={due}
            onChange={setDue}
            disabled={disabled}
            presets={[
              { label: 'Today', value: today() },
              { label: 'Tomorrow', value: inDays(1) },
              { label: 'Next week', value: inDays(7) },
            ]}
          />
          <Label muted>{due === null ? 'No due date.' : 'Tap a chip or a day: the sheet closes at once.'}</Label>
        </Panel>
      </Section>

      <Section title="Range" description="A start and an end date, written as one line in the field.">
        <Panel>
          <DatePicker
            mode="range"
            label="Stay"
            placeholder="Select your dates"
            value={stay}
            onChange={setStay}
            disabled={disabled}
            calendarProps={{ minRange: 1 }}
          />
        </Panel>
      </Section>

      <Section title="Custom trigger" description="Any element can open the sheet in place of the field.">
        <Panel>
          <DatePicker
            value={due}
            onChange={setDue}
            disabled={disabled}
            title="Pick a day"
            trigger={
              <Button variant="outline" fullWidth disabled={disabled}>
                Change the date
              </Button>
            }
          />
        </Panel>
      </Section>
    </Screen>
  );
}
