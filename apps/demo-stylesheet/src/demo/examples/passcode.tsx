import { useState } from 'react';

import { Passcode } from '@/components/ui/passcode';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Label, Panel, Row, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';

const PIN = '1234';

export default function PasscodeScreen() {
  const [secure, setSecure] = useState(true);
  const [attempts, setAttempts] = useState(3);
  const [unlocked, setUnlocked] = useState(false);
  const [biometrics, setBiometrics] = useState(0);

  const [first, setFirst] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <Screen>
      <Panel>
        <Row label="Secure" description="Off shows the digits instead of dots.">
          <Switch value={secure} onValueChange={setSecure} accessibilityLabel="Secure" />
        </Row>
      </Panel>

      <Section title="Unlocking" description={`The code is ${PIN}. A wrong one shakes the dots and clears them.`}>
        <Panel>
          <Passcode
            length={4}
            secure={secure}
            onComplete={(code) => {
              const ok = code === PIN;
              if (ok) setUnlocked(true);
              else setAttempts((left) => Math.max(left - 1, 0));
              return ok;
            }}
          >
            <Passcode.Group />
            <Passcode.Keyboard>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <Passcode.Key key={digit} value={digit} />
              ))}
              <Passcode.KeyAction action="biometrics" onPress={() => setBiometrics((count) => count + 1)} />
              <Passcode.Key value="0" />
              <Passcode.KeyAction action="delete" />
            </Passcode.Keyboard>
          </Passcode>
          <Label muted>
            {unlocked ? 'Unlocked.' : `${attempts} attempts left.`}
            {biometrics > 0 ? ` Biometrics pressed ${biometrics}×.` : ''}
          </Label>
        </Panel>
      </Section>

      <Section title="Verifying" description="A promise puts the keypad in the verifying state until it settles.">
        <Panel>
          <Passcode
            length={4}
            secure={secure}
            onComplete={async (code) => {
              await new Promise((resolve) => setTimeout(resolve, 900));
              return code === PIN;
            }}
          />
          <Label muted>Any code takes 900ms to answer; only {PIN} succeeds.</Label>
        </Panel>
      </Section>

      <Section title="Creating a PIN" description="The same component twice: enter, then confirm. Box slots, flat keys.">
        <Panel>
          <Text variant="bodySm" weight="semibold">
            {saved ? 'PIN saved.' : first ? 'Confirm your PIN' : 'Choose a PIN'}
          </Text>
          <Passcode
            key={first ? 'confirm' : 'create'}
            length={4}
            secure={secure}
            onComplete={(code) => {
              if (!first) {
                setFirst(code);
                return true;
              }
              if (code !== first) {
                setFirst(null);
                return false;
              }
              setSaved(code);
              return true;
            }}
          >
            <Passcode.Group variant="box" gap={2} />
            <Passcode.Keyboard variant="flat" letters={false}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <Passcode.Key key={digit} value={digit} />
              ))}
              <Passcode.KeyAction action="custom" />
              <Passcode.Key value="0" />
              <Passcode.KeyAction action="delete" />
            </Passcode.Keyboard>
          </Passcode>
        </Panel>
      </Section>
    </Screen>
  );
}
