import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Menu } from '@/components/ui/menu';
import { Text } from '@/components/ui/text';
import { Label, Panel, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';
import { useTheme } from '@/theme';

export default function DialogScreen() {
  const { tokens, colors } = useTheme();
  const [events, setEvents] = useState<string[]>([]);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [sort, setSort] = useState('date');

  const log = (event: string) => setEvents((previous) => [event, ...previous].slice(0, 4));

  return (
    <Screen>
      <Section title="Dialog" description="Backdrop and Android back close it, unless it isn't dismissible.">
        <Panel>
          <Dialog.Root onOpenChange={(open) => log(`delete: ${open ? 'open' : 'closed'}`)}>
            <Dialog.Trigger asChild>
              <Button variant="destructive" leadingIcon="delete">
                Delete draft
              </Button>
            </Dialog.Trigger>
            <Dialog.Content
              media={
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.feedback.errorSubtle,
                  }}
                >
                  <Icon name="delete" color="error" />
                </View>
              }
              onDismiss={() => log('delete: dismissed')}
            >
              <Dialog.Title>Delete this draft?</Dialog.Title>
              <Dialog.Description>{`"Launch announcement" will be deleted. You can't undo this.`}</Dialog.Description>
              <Dialog.Actions>
                <Dialog.Cancel>Cancel</Dialog.Cancel>
                <Dialog.Action destructive onPress={() => log('delete: confirmed')}>
                  Delete
                </Dialog.Action>
              </Dialog.Actions>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant="outline">Unsaved changes</Button>
            </Dialog.Trigger>
            <Dialog.Content dismissible={false}>
              <Dialog.Title>Save changes?</Dialog.Title>
              <Dialog.Description>You edited the event title and time.</Dialog.Description>
              <Dialog.Actions orientation="vertical">
                <Dialog.Action onPress={() => log('saved')}>Save</Dialog.Action>
                <Dialog.Action variant="ghost" destructive onPress={() => log('discarded')}>
                  Discard
                </Dialog.Action>
                <Dialog.Cancel>Keep editing</Dialog.Cancel>
              </Dialog.Actions>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root open={signOutOpen} onOpenChange={setSignOutOpen}>
            <Dialog.Trigger asChild>
              <Button variant="ghost">Sign out everywhere (async)</Button>
            </Dialog.Trigger>
            <Dialog.Content dismissible={!signingOut}>
              <Dialog.Title>Sign out of all devices?</Dialog.Title>
              <Dialog.Description>{"You'll need to sign in again on each one."}</Dialog.Description>
              <Dialog.Actions>
                <Dialog.Cancel disabled={signingOut}>Cancel</Dialog.Cancel>
                <Dialog.Action
                  closeOnPress={false}
                  loading={signingOut}
                  onPress={() => {
                    setSigningOut(true);
                    setTimeout(() => {
                      setSigningOut(false);
                      setSignOutOpen(false);
                      log('signed out');
                    }, 1500);
                  }}
                >
                  Sign out
                </Dialog.Action>
              </Dialog.Actions>
            </Dialog.Content>
          </Dialog.Root>

          <Label muted>{events.length ? events.join('\n') : 'Events show up here.'}</Label>
        </Panel>
      </Section>

      <Section title="Menu" description={`Sort: ${sort}. Long press the card, or press the button.`}>
        <Panel>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text weight="semibold">Documents</Text>
            <Menu.Root>
              <Menu.Trigger action="press" asChild>
                <IconButton icon="settings" variant="tinted" accessibilityLabel="More" />
              </Menu.Trigger>
              <Menu.Content align="end">
                <Menu.Group label="Sort by">
                  {['date', 'name', 'size'].map((value) => (
                    <Menu.Item key={value} checked={sort === value} onPress={() => setSort(value)}>
                      {value[0].toUpperCase() + value.slice(1)}
                    </Menu.Item>
                  ))}
                </Menu.Group>
                <Menu.Separator />
                <Menu.Sub label="Share" icon="share">
                  <Menu.Item onPress={() => log('copied link')}>Copy link</Menu.Item>
                  <Menu.Item subtitle="Only people you invite" onPress={() => log('invited')}>
                    Invite people
                  </Menu.Item>
                </Menu.Sub>
                <Menu.Item disabled>Archive</Menu.Item>
              </Menu.Content>
            </Menu.Root>
          </View>
        </Panel>

        <Menu.Root onOpenChange={(open) => log(`context menu: ${open ? 'open' : 'closed'}`)}>
          <Menu.Trigger>
            <View
              style={{
                padding: tokens.spacing[4],
                gap: tokens.spacing[1],
                borderRadius: tokens.radius.lg,
                backgroundColor: colors.background.elevated,
              }}
            >
              <Text weight="semibold">Launch announcement</Text>
              <Text variant="bodySm" color="muted">
                Long press for options. The card lifts above the backdrop.
              </Text>
            </View>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item icon="share" onPress={() => log('share')}>
              Share
            </Menu.Item>
            <Menu.Item icon="favorite" onPress={() => log('favorite')}>
              Add to favorites
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item icon="delete" destructive onPress={() => log('delete')}>
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Section>
    </Screen>
  );
}
