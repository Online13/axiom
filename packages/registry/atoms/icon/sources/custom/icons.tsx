import type { IconRegistry } from "../../icon-types";

// The icon registry of your app. Every icon the app shows is declared here, and only here.
// `axiom add icon` creates this file once and never overwrites it: it's yours.
//
// Rules:
// - screens and components use <Icon name="…" />, never an icon library directly;
// - name an icon after what it means (`close`, `settings`), not after the glyph (`xmark`, `gear`);
// - names are kebab-case;
// - every entry takes { size, color, strokeWidth? }: wrap a set with other props in an adapter;
// - import each icon on its own, so the bundle only holds the icons listed here.
//
// Source: custom. Fill the registry with your own icons or any set. When a component needs an icon
// (`close` for a sheet header, `check` for a checkbox), `axiom add` tells you, and <Icon name="close" />
// doesn't compile until the entry exists.
//
// An icon set whose props already match:
//
//   import { Bell, X } from 'lucide-react-native';
//
//   export const icons = {
//     close: X,
//     notifications: Bell,
//   } satisfies IconRegistry;
//
// An SVG component with other props, through an adapter:
//
//   import type { IconComponent } from '../../icon-types';
//   import CloseSvg from '@/assets/icons/close.svg';
//
//   const svg = (Svg: typeof CloseSvg): IconComponent =>
//     function SvgIcon({ size, color }) {
//       return <Svg width={size} height={size} color={color} />;
//     };
//
//   export const icons = { close: svg(CloseSvg) } satisfies IconRegistry;

export const icons = {} satisfies IconRegistry;

export type IconName = keyof typeof icons;
