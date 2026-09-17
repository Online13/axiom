import type { ComponentType } from 'react';

/**
 * Props every icon of the registry accepts. `Icon` resolves them from the theme.
 * A set with other prop names (`tintColor`, `width`…) gets a small adapter in `icons.tsx`.
 */
export type IconComponentProps = {
  size: number;
  color: string;
  strokeWidth?: number;
};

export type IconComponent = ComponentType<IconComponentProps>;

export type IconRegistry = Record<string, IconComponent>;
