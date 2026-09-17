import { useState } from 'react';
import { View } from 'react-native';

import { Accordion } from '@/components/ui/accordion';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Item } from '@/components/ui/item';
import { OptionItem } from '@/components/ui/option-item';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Label, Panel, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';
import { useTheme } from '@/theme';

function Surface({ children }: { children: React.ReactNode }) {
  const { tokens, colors } = useTheme();
  return (
    <View
      style={{
        overflow: 'hidden',
        borderRadius: tokens.radius.lg,
        borderWidth: tokens.metrics.hairline,
        borderColor: colors.border.default,
        backgroundColor: colors.background.elevated,
      }}
    >
      {children}
    </View>
  );
}

export default function CardScreen() {
  const { tokens } = useTheme();
  const [presses, setPresses] = useState(0);
  const [language, setLanguage] = useState('en');
  const [wifi, setWifi] = useState(true);
  const [notify, setNotify] = useState<Set<string>>(new Set(['mentions']));
  const [range, setRange] = useState('week');
  const [open, setOpen] = useState<string[]>(['shipping']);

  return (
    <Screen>
      <Section title="Card" description={`Elevated, outlined, filled. Pressed ${presses} times.`}>
        <Card onPress={() => setPresses((p) => p + 1)} accessibilityLabel="Weekend in Porto">
          <Card.Media source={{ uri: 'https://picsum.photos/seed/porto/800/450' }}>
            <Badge variant="inverse">New</Badge>
          </Card.Media>
          <Card.Header>
            <Card.Title>Weekend in Porto</Card.Title>
            <Card.Description>3 days · from $240</Card.Description>
          </Card.Header>
          <Card.Footer>
            <Button size="sm">Book</Button>
            <Button size="sm" variant="ghost">
              Save
            </Button>
          </Card.Footer>
        </Card>
        <Card variant="outlined">
          <Card.Header>
            <Card.Title>Outlined</Card.Title>
            <Card.Description>For plain backgrounds.</Card.Description>
          </Card.Header>
          <Card.Content>
            <Text variant="bodySm">Content goes here.</Text>
          </Card.Content>
        </Card>
        <Card variant="filled" padding={4}>
          <Text>Filled, with padding and no sub-components.</Text>
        </Card>
      </Section>

      <Section title="Item" description="Leading, content, trailing. Dividers, sizes, selection.">
        <Surface>
          <Item onPress={() => {}} divider="inset">
            <Item.Leading>
              <Avatar name="Jane Cooper" colorFromName />
            </Item.Leading>
            <Item.Content>
              <Item.Title>Jane Cooper</Item.Title>
              <Item.Description>Product designer</Item.Description>
            </Item.Content>
            <Item.Trailing>
              <Icon name="chevron-right" size="sm" color="subtle" />
            </Item.Trailing>
          </Item>
          <Item selected onPress={() => {}} divider="inset">
            <Item.Leading>
              <Avatar name="Wade Warren" colorFromName />
            </Item.Leading>
            <Item.Content>
              <Item.Title>Wade Warren</Item.Title>
              <Item.Description>Selected</Item.Description>
            </Item.Content>
            <Item.Trailing>
              <Badge count={2} />
            </Item.Trailing>
          </Item>
          <Item size="lg" align="start" disabled onPress={() => {}}>
            <Item.Content>
              <Item.Title>Disabled, large, aligned to the top</Item.Title>
              <Item.Description numberOfLines={3}>
                A longer description that wraps on several lines to show the start alignment of the trailing area.
              </Item.Description>
            </Item.Content>
            <Item.Trailing>
              <IconButton icon="share" size="sm" accessibilityLabel="Share" disabled />
            </Item.Trailing>
          </Item>
        </Surface>
      </Section>

      <Section title="OptionItem" description={`Language: ${language}`}>
        <Surface>
          {[
            ['en', 'English'],
            ['fr', 'Français'],
            ['mg', 'Malagasy'],
          ].map(([value, label]) => (
            <OptionItem key={value} label={label} selected={language === value} divider onPress={() => setLanguage(value)} />
          ))}
        </Surface>
        <Surface>
          <OptionItem
            label="Wi-Fi"
            icon="settings"
            iconColor="blue"
            trailing={<Switch value={wifi} onValueChange={setWifi} accessibilityLabel="Wi-Fi" />}
            divider="inset"
          />
          <OptionItem label="Notifications" icon="warning" iconColor="red" value="Mentions" chevron divider="inset" onPress={() => {}} />
          <OptionItem label="Favorites" icon="favorite" iconColor="pink" chevron onPress={() => {}} />
        </Surface>
        <Surface>
          {['all', 'mentions', 'none'].map((value) => (
            <OptionItem
              key={value}
              label={value === 'all' ? 'All messages' : value === 'mentions' ? 'Mentions only' : 'Nothing'}
              indicator="checkbox"
              selected={notify.has(value)}
              divider
              onPress={() =>
                setNotify((previous) => {
                  const next = new Set(previous);
                  if (next.has(value)) next.delete(value);
                  else next.add(value);
                  return next;
                })
              }
            />
          ))}
          <OptionItem label="Radio indicator" description="With a description" indicator="radio" selected divider onPress={() => {}} />
          <OptionItem label="Sign out" destructive onPress={() => {}} />
        </Surface>
      </Section>

      <Section title="Accordion" description={`Multiple. Open: ${open.join(', ') || 'none'}`}>
        <Panel>
          <Accordion type="multiple" value={open} onValueChange={(value) => setOpen(value as string[])}>
            <Accordion.Item value="shipping">
              <Accordion.Trigger>Shipping</Accordion.Trigger>
              <Accordion.Content>Orders ship within 2 business days, from our warehouse in Lyon.</Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="returns">
              <Accordion.Trigger>Returns</Accordion.Trigger>
              <Accordion.Content>
                <View style={{ gap: tokens.spacing[2] }}>
                  <Text variant="bodySm" color="muted">
                    Return any item within 30 days. Custom content can hold anything.
                  </Text>
                  <Button size="sm" variant="outline">
                    Start a return
                  </Button>
                </View>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="gift" disabled>
              <Accordion.Trigger>Gift cards (disabled)</Accordion.Trigger>
              <Accordion.Content>Unavailable.</Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Panel>
        <Panel>
          <Label muted>Single, collapsible</Label>
          <Accordion defaultValue="a">
            <Accordion.Item value="a">
              <Accordion.Trigger>First</Accordion.Trigger>
              <Accordion.Content>Opening another section closes this one.</Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="b">
              <Accordion.Trigger>Second</Accordion.Trigger>
              <Accordion.Content forceMount>Kept mounted while closed.</Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Panel>
      </Section>

      <Section title="ButtonGroup" description="Attached, spaced, vertical, full width.">
        <Panel>
          <ButtonGroup variant="outline" size="sm">
            {['day', 'week', 'month'].map((value) => (
              <Button key={value} variant={range === value ? 'solid' : undefined} onPress={() => setRange(value)}>
                {value[0].toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup attached={false} fullWidth>
            <Button variant="outline">Cancel</Button>
            <Button>Continue</Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical" variant="outline">
            <Button>Top</Button>
            <Button>Middle</Button>
            <Button>Bottom</Button>
          </ButtonGroup>
          <ButtonGroup variant="outline" disabled>
            <Button>Disabled</Button>
            <Button>Group</Button>
          </ButtonGroup>
        </Panel>
      </Section>
    </Screen>
  );
}
