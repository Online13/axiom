import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';

import type { IconComponent, IconRegistry } from '../../icon-types';

// The icon registry of your app. Every icon the app shows is declared here, and only here.
// `axiom add icon` creates this file once and never overwrites it: it's yours.
//
// Rules:
// - screens and components use <Icon name="…" />, never an icon library directly;
// - name an icon after what it means (`close`, `settings`), not after the glyph (`xmark`, `gear`);
// - names are kebab-case;
// - every entry takes { size, color, strokeWidth? }: wrap a set with other props in an adapter, like `symbol` below;
// - to change set, change the entries here. Nothing else in the app moves.
//
// Source: `expo-symbols` (SF Symbols on iOS, Material Symbols on Android).
// Add entries with `symbol(iosName, androidName)`. To move to another set, replace the entries: nothing else changes.

type SymbolName = ComponentProps<typeof SymbolView>['name'];
type IosSymbol = Extract<SymbolName, string>;
type AndroidSymbol = NonNullable<Exclude<SymbolName, string>['android']>;

/** Adapter for `expo-symbols`. */
function symbol(ios: IosSymbol, android: AndroidSymbol): IconComponent {
  return function SymbolIcon({ size, color }) {
    return <SymbolView name={{ ios, android, web: android }} size={size} tintColor={color} />;
  };
}

export const icons = {
  add: symbol('plus', 'add'),
  'arrow-left': symbol('arrow.left', 'arrow_back'),
  check: symbol('checkmark', 'check'),
  'chevron-down': symbol('chevron.down', 'keyboard_arrow_down'),
  'chevron-right': symbol('chevron.right', 'chevron_right'),
  close: symbol('xmark', 'close'),
  delete: symbol('trash', 'delete'),
  error: symbol('exclamationmark.circle', 'error'),
  favorite: symbol('heart', 'favorite'),
  info: symbol('info.circle', 'info'),
  minus: symbol('minus', 'remove'),
  search: symbol('magnifyingglass', 'search'),
  settings: symbol('gearshape', 'settings'),
  share: symbol('square.and.arrow.up', 'share'),
  warning: symbol('exclamationmark.triangle', 'warning'),
} satisfies IconRegistry;

export type IconName = keyof typeof icons;
