import { useState } from 'react';
import { View } from 'react-native';

import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label, Panel, Row, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';
import { useTheme } from '@/theme';

const VARIANTS: ButtonVariant[] = ['solid', 'outline', 'ghost'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];

export default function ButtonScreen() {
  const { tokens } = useTheme();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [presses, setPresses] = useState(0);
  const [paying, setPaying] = useState(false);

  const pay = () => {
    setPaying(true);
    setTimeout(() => setPaying(false), 2000);
  };

  return (
    <Screen>
      <Panel>
        <Row label="Disabled">
          <Switch value={disabled} onValueChange={setDisabled} accessibilityLabel="Disabled" />
        </Row>
        <Row label="Loading">
          <Switch value={loading} onValueChange={setLoading} accessibilityLabel="Loading" />
        </Row>
        <Label muted>Presses: {presses}</Label>
      </Panel>

      <Section title="Variants and sizes" description="sm is 32pt tall but keeps a 44pt touch area.">
        <Panel>
          {VARIANTS.map((variant) => (
            <View key={variant} style={{ gap: tokens.spacing[2] }}>
              <Label muted>{variant}</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[2] }}>
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    variant={variant}
                    size={size}
                    disabled={disabled}
                    loading={loading}
                    onPress={() => setPresses((value) => value + 1)}
                  >
                    {size}
                  </Button>
                ))}
              </View>
            </View>
          ))}
        </Panel>
      </Section>

      <Section title="Icons">
        <Panel>
          <Button
            leadingIcon="add"
            disabled={disabled}
            loading={loading}
            onPress={() => setPresses((value) => value + 1)}
          >
            Leading icon
          </Button>
          <Button
            variant="outline"
            trailingIcon="chevron-right"
            disabled={disabled}
            onPress={() => setPresses((value) => value + 1)}
          >
            Trailing icon
          </Button>
        </Panel>
      </Section>

      <Section title="Use cases">
        <Panel>
          <Button size="lg" fullWidth leadingIcon="check" loading={paying} onPress={pay}>
            {paying ? 'Paying' : 'Pay $88.90'}
          </Button>
          <View style={{ flexDirection: 'row', gap: tokens.spacing[2] }}>
            <Button variant="outline" style={{ flex: 1 }} disabled={disabled}>
              Decline
            </Button>
            <Button style={{ flex: 1 }} disabled={disabled}>
              Accept
            </Button>
          </View>
          <Button variant="ghost" fullWidth>
            Skip
          </Button>
        </Panel>
      </Section>
    </Screen>
  );
}
