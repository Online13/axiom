import { useState } from 'react';
import { Appearance, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { icons, type IconName } from '@/components/ui/icons';
import { Label, Panel, Section } from '@/demo/section';
import {
  paletteSteps,
  useTheme,
  type Hue,
  type ThemeColors,
  type TypographyVariant,
} from '@/theme';

type SchemeChoice = 'unspecified' | 'light' | 'dark';

const SCHEMES: { value: SchemeChoice; label: string }[] = [
  { value: 'unspecified', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function Foundations() {
  const { tokens, colors } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background.subtle }}
      contentContainerStyle={{
        padding: tokens.metrics.screenMargin,
        paddingBottom: tokens.spacing[12],
        gap: tokens.spacing[10],
      }}
    >
      <SchemeSwitcher />
      <Colors />
      <Palette />
      <TypographyScale />
      <Spacing />
      <Radius />
      <Icons />
      <TapTargets />
      <States />
    </ScrollView>
  );
}

function SchemeSwitcher() {
  const { tokens, colors } = useTheme();
  const [choice, setChoice] = useState<SchemeChoice>('unspecified');

  const select = (value: SchemeChoice) => {
    setChoice(value);
    Appearance.setColorScheme(value);
  };

  return (
    <View
      style={[
        styles.row,
        {
          padding: tokens.spacing[1],
          gap: tokens.spacing[1],
          borderRadius: tokens.radius.md,
          backgroundColor: colors.background.default,
          borderWidth: tokens.metrics.hairline,
          borderColor: colors.border.default,
        },
      ]}
    >
      {SCHEMES.map(({ value, label }) => {
        const selected = value === choice;
        return (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => select(value)}
            style={[
              styles.segment,
              {
                minHeight: tokens.sizes.control.sm,
                borderRadius: tokens.radius.sm,
                backgroundColor: selected ? colors.background.inverse : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                tokens.typography.subheadline,
                { color: selected ? colors.content.inverse : colors.content.default },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Colors() {
  const { tokens, colors } = useTheme();
  const roles = Object.keys(colors) as (keyof ThemeColors)[];

  return (
    <Section title="Colors" description="Semantic colors. They change with the scheme.">
      {roles.map((role) => (
        <Panel key={role}>
          <Text style={[tokens.typography.headline, { color: colors.content.default }]}>{role}</Text>
          <View style={[styles.wrap, { gap: tokens.spacing[3] }]}>
            {Object.entries(colors[role]).map(([key, value]) => (
              <View key={key} style={[styles.swatchItem, { gap: tokens.spacing[1] }]}>
                <View
                  style={{
                    height: tokens.sizes.control.md,
                    borderRadius: tokens.radius.sm,
                    backgroundColor: value,
                    borderWidth: tokens.metrics.hairline,
                    borderColor: colors.border.default,
                  }}
                />
                <Label>{key}</Label>
                <Label muted>{value}</Label>
              </View>
            ))}
          </View>
        </Panel>
      ))}
    </Section>
  );
}

function Palette() {
  const { tokens, colors } = useTheme();
  const hues = Object.keys(tokens.palette) as Hue[];

  return (
    <Section title="Palette" description="Raw steps from 50 to 950. Components never read them.">
      <Panel>
        {hues.map((hue) => (
          <View key={hue} style={{ gap: tokens.spacing[1] }}>
            <Label muted>{hue}</Label>
            <View style={[styles.row, { borderRadius: tokens.radius.sm, overflow: 'hidden' }]}>
              {paletteSteps.map((step) => (
                <View key={step} style={[styles.step, { backgroundColor: tokens.palette[hue][step] }]} />
              ))}
            </View>
          </View>
        ))}
        <View style={styles.row}>
          {paletteSteps.map((step) => (
            <Text key={step} style={[styles.stepLabel, { color: colors.content.subtle }]}>
              {step}
            </Text>
          ))}
        </View>
      </Panel>
    </Section>
  );
}

function TypographyScale() {
  const { tokens, colors } = useTheme();
  const variants = Object.keys(tokens.typography) as TypographyVariant[];

  return (
    <Section title="Typography" description="The type scale, from 34 down to 12.">
      <Panel>
        {variants.map((variant) => {
          const style = tokens.typography[variant];
          return (
            <View key={variant} style={{ gap: tokens.spacing[1] }}>
              <Text style={[style, { color: colors.content.default }]} numberOfLines={1}>
                {variant}
              </Text>
              <Label muted>
                {style.fontSize} / {style.lineHeight} · {style.fontWeight}
              </Label>
            </View>
          );
        })}
      </Panel>
    </Section>
  );
}

function Spacing() {
  const { tokens, colors } = useTheme();

  return (
    <Section title="Spacing" description="A 4pt grid.">
      <Panel>
        {Object.entries(tokens.spacing).map(([key, value]) => (
          <View key={key} style={[styles.row, styles.center, { gap: tokens.spacing[3] }]}>
            <View style={styles.scaleKey}>
              <Label>{key}</Label>
            </View>
            <View style={styles.scaleKey}>
              <Label muted>{value}</Label>
            </View>
            <View
              style={{
                width: value,
                height: tokens.spacing[4],
                borderRadius: 2,
                backgroundColor: colors.feedback.info,
              }}
            />
          </View>
        ))}
      </Panel>
    </Section>
  );
}

function Radius() {
  const { tokens, colors } = useTheme();

  return (
    <Section title="Radius" description="Corner rounding of surfaces and controls.">
      <View style={[styles.wrap, { gap: tokens.spacing[3] }]}>
        {Object.entries(tokens.radius).map(([key, value]) => (
          <View key={key} style={[styles.center, { gap: tokens.spacing[1] }]}>
            <View
              style={{
                width: tokens.spacing[12] + tokens.spacing[6],
                height: tokens.spacing[12] + tokens.spacing[6],
                borderRadius: value,
                backgroundColor: colors.background.elevated,
                borderWidth: 1,
                borderColor: colors.border.strong,
              }}
            />
            <Label>{key}</Label>
            <Label muted>{value}</Label>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Icons() {
  const { tokens, colors } = useTheme();
  const names = Object.keys(icons) as IconName[];

  return (
    <Section title="Icons" description="Your registry in icons.tsx, at the icon size tokens.">
      <Panel>
        <View style={[styles.row, styles.end, { gap: tokens.spacing[4] }]}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <View key={size} style={[styles.center, { gap: tokens.spacing[1] }]}>
              <Icon name="settings" size={size} />
              <Label>
                {size} · {tokens.sizes.icon[size]}
              </Label>
            </View>
          ))}
        </View>
        <View style={[styles.wrap, { gap: tokens.spacing[3] }]}>
          {names.map((name) => (
            <View key={name} style={[styles.iconCell, { gap: tokens.spacing[1] }]}>
              <View
                style={{
                  padding: tokens.spacing[2],
                  borderRadius: tokens.radius.md,
                  backgroundColor: colors.background.subtle,
                }}
              >
                <Icon name={name} size="lg" />
              </View>
              <Label muted>{name}</Label>
            </View>
          ))}
        </View>
        <View style={[styles.row, { gap: tokens.spacing[3] }]}>
          {(['muted', 'link', 'success', 'warning', 'error'] as const).map((color) => (
            <Icon key={color} name="info" color={color} />
          ))}
        </View>
      </Panel>
    </Section>
  );
}

function TapTargets() {
  const { tokens, colors } = useTheme();
  const [count, setCount] = useState(0);
  const icon = tokens.sizes.icon.lg;
  const slop = (tokens.metrics.touchTarget - icon) / 2;

  return (
    <Section
      title="Tap targets"
      description={`Anything pressable gets at least ${tokens.metrics.touchTarget}pt. A ${icon}pt element gets ${slop}pt of hitSlop on each side.`}
    >
      <Panel>
        <View style={[styles.row, styles.center, { gap: tokens.spacing[6] }]}>
          <View
            style={[
              styles.center,
              styles.centerContent,
              {
                width: tokens.metrics.touchTarget,
                height: tokens.metrics.touchTarget,
                borderRadius: tokens.radius.sm,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: colors.feedback.info,
                backgroundColor: colors.feedback.infoSubtle,
              },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Increment"
              hitSlop={slop}
              onPress={() => setCount((value) => value + 1)}
              style={({ pressed }) => ({
                width: icon,
                height: icon,
                borderRadius: tokens.radius.full,
                backgroundColor: pressed ? colors.content.muted : colors.content.default,
              })}
            />
          </View>
          <View style={{ gap: tokens.spacing[1] }}>
            <Label>Tap around the dot, inside the dashed area.</Label>
            <Label muted>Taps: {count}</Label>
          </View>
        </View>
        <View
          style={{
            height: tokens.metrics.hairline,
            marginHorizontal: -tokens.spacing[4],
            backgroundColor: colors.border.default,
          }}
        />
        <Label muted>
          screenMargin {tokens.metrics.screenMargin} · hairline {tokens.metrics.hairline.toFixed(2)}
        </Label>
      </Panel>
    </Section>
  );
}

type TokenStates = Record<string, Record<string, string> | undefined>;

function States() {
  const { tokens, colors, components } = useTheme();

  return (
    <Section
      title="States"
      description="Component tokens of the components in this project. Each state only lists what changes from default."
    >
      {Object.entries(components).map(([component, variants]) => (
        <Panel key={component}>
          <Text style={[tokens.typography.headline, { color: colors.content.default }]}>{component}</Text>
          {Object.entries(variants as Record<string, TokenStates>).map(([variant, states]) => (
            <View key={variant} style={{ gap: tokens.spacing[2] }}>
              <Label muted>{variant}</Label>
              {Object.entries(states).map(([state, properties]) => (
                <View key={state} style={[styles.row, styles.center, { gap: tokens.spacing[2] }]}>
                  <View style={styles.stateName}>
                    <Label>{state}</Label>
                  </View>
                  <View style={[styles.wrap, styles.flex, { gap: tokens.spacing[2] }]}>
                    {Object.entries(properties ?? {}).map(([property, value]) => (
                      <View key={property} style={[styles.row, styles.center, { gap: tokens.spacing[1] }]}>
                        <View
                          style={{
                            width: tokens.sizes.icon.md,
                            height: tokens.sizes.icon.md,
                            borderRadius: tokens.radius.sm,
                            borderWidth: tokens.metrics.hairline,
                            borderColor: colors.border.strong,
                            backgroundColor: value,
                          }}
                        />
                        <Label muted>{property}</Label>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </Panel>
      ))}
    </Section>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  center: { alignItems: 'center' },
  centerContent: { justifyContent: 'center' },
  end: { alignItems: 'flex-end' },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  swatchItem: { width: '30%' },
  step: { flex: 1, height: 28 },
  stepLabel: { flex: 1, fontSize: 8, textAlign: 'center' },
  scaleKey: { width: 24 },
  iconCell: { width: '22%', alignItems: 'center' },
  stateName: { width: 64 },
});
