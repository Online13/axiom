import { useState } from 'react';

import { Switch } from '@/components/ui/switch';
import { Label, Panel, Row, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';

export default function SwitchScreen() {
  const [readReceipts, setReadReceipts] = useState(true);
  const [scheduled, setScheduled] = useState(false);
  const [pending, setPending] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const toggleTwoFactor = (value: boolean) => {
    setTwoFactor(value);
    setPending(true);
    setTimeout(() => setPending(false), 1500);
  };

  return (
    <Screen>
      <Section title="Controlled" description="The row label describes the switch.">
        <Panel>
          <Row label="Read receipts">
            <Switch value={readReceipts} onValueChange={setReadReceipts} accessibilityLabel="Read receipts" />
          </Row>
          <Row label="Scheduled downtime" description="Reveals dependent options">
            <Switch value={scheduled} onValueChange={setScheduled} accessibilityLabel="Scheduled downtime" />
          </Row>
          {scheduled ? (
            <>
              <Row label="From">
                <Label muted>22:00</Label>
              </Row>
              <Row label="To">
                <Label muted>07:00</Label>
              </Row>
            </>
          ) : null}
        </Panel>
      </Section>

      <Section title="Uncontrolled">
        <Panel>
          <Row label="Default off">
            <Switch accessibilityLabel="Default off" />
          </Row>
          <Row label="Default on">
            <Switch defaultValue accessibilityLabel="Default on" />
          </Row>
        </Panel>
      </Section>

      <Section title="Sizes and states">
        <Panel>
          <Row label="sm" description="40×24, for dense rows">
            <Switch size="sm" defaultValue accessibilityLabel="Small" />
          </Row>
          <Row label="Disabled, off">
            <Switch disabled accessibilityLabel="Disabled off" />
          </Row>
          <Row label="Disabled, on">
            <Switch disabled value accessibilityLabel="Disabled on" />
          </Row>
          <Row label="Two-factor authentication" description={pending ? 'Saving…' : 'Disabled while saving'}>
            <Switch
              value={twoFactor}
              disabled={pending}
              onValueChange={toggleTwoFactor}
              accessibilityLabel="Two-factor authentication"
            />
          </Row>
        </Panel>
      </Section>
    </Screen>
  );
}
