import { Link } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Panel, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';

export default function SlotScreen() {
  return (
    <Screen>
      <Section title="Button as a link" description="Slot passes button behavior and styling to the Link child.">
        <Panel>
          <Button asChild>
            <Link href="/button">Open the Button demo</Link>
          </Button>
          <Text variant="bodySm" color="muted">The link has no extra button wrapper.</Text>
        </Panel>
      </Section>
    </Screen>
  );
}
