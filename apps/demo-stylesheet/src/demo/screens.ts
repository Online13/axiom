export const SCREENS = [
  { name: 'foundations', title: 'Foundations', group: 'Foundations', description: 'Colors, typography, spacing, radius, targets, states' },
  { name: 'tappable', title: 'Tappable', group: 'Core', description: 'Pressed state, disabled, 44pt touch target' },
  { name: 'overlay', title: 'Portal & Overlay', group: 'Core', description: 'Backdrop rendered in the root portal host' },
  { name: 'typography', title: 'Text & Title', group: 'Typography', description: 'Variants, colors, weights, nesting' },
  { name: 'icon', title: 'Icon', group: 'Atoms', description: 'Registry, sizes, colors, accessibility' },
  { name: 'icon-button', title: 'IconButton', group: 'Atoms', description: 'Variants, sizes, shapes, toggles' },
  { name: 'button', title: 'Button', group: 'Atoms', description: 'Variants, sizes, loading, disabled, icons' },
  { name: 'switch', title: 'Switch', group: 'Atoms', description: 'Controlled, uncontrolled, sizes, disabled' },
  { name: 'bottom-sheet', title: 'BottomSheet', group: 'Atoms', description: 'Snap points, gestures, scroll, footer, detached' },
] as const;
