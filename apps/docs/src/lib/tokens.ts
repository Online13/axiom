// Default token values shown on the Foundations > Tokens pages.
// The visuals read from here, so keep the code blocks in the MDX pages in sync with these values.

export const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type PaletteStep = (typeof paletteSteps)[number];

// Colors are `hsla()` strings, rounded to whole numbers.
// Step 500 is the iOS system color; the other steps are derived from it in OKLCH.
export const palette = {
  gray: { 50: 'hsla(0, 0%, 96%, 1)', 100: 'hsla(240, 2%, 91%, 1)', 200: 'hsla(240, 2%, 82%, 1)', 300: 'hsla(240, 3%, 73%, 1)', 400: 'hsla(240, 2%, 65%, 1)', 500: 'hsla(240, 2%, 57%, 1)', 600: 'hsla(240, 2%, 48%, 1)', 700: 'hsla(240, 2%, 39%, 1)', 800: 'hsla(240, 2%, 30%, 1)', 900: 'hsla(240, 3%, 20%, 1)', 950: 'hsla(240, 4%, 14%, 1)' },
  red: { 50: 'hsla(7, 100%, 97%, 1)', 100: 'hsla(8, 100%, 93%, 1)', 200: 'hsla(8, 100%, 86%, 1)', 300: 'hsla(7, 98%, 77%, 1)', 400: 'hsla(6, 99%, 69%, 1)', 500: 'hsla(3, 100%, 59%, 1)', 600: 'hsla(2, 74%, 50%, 1)', 700: 'hsla(0, 86%, 39%, 1)', 800: 'hsla(359, 96%, 29%, 1)', 900: 'hsla(359, 100%, 20%, 1)', 950: 'hsla(359, 100%, 14%, 1)' },
  orange: { 50: 'hsla(25, 100%, 96%, 1)', 100: 'hsla(27, 100%, 93%, 1)', 200: 'hsla(28, 100%, 85%, 1)', 300: 'hsla(28, 100%, 77%, 1)', 400: 'hsla(29, 99%, 68%, 1)', 500: 'hsla(35, 100%, 50%, 1)', 600: 'hsla(34, 95%, 43%, 1)', 700: 'hsla(33, 89%, 35%, 1)', 800: 'hsla(34, 95%, 26%, 1)', 900: 'hsla(33, 98%, 17%, 1)', 950: 'hsla(31, 100%, 12%, 1)' },
  yellow: { 50: 'hsla(46, 91%, 95%, 1)', 100: 'hsla(44, 100%, 92%, 1)', 200: 'hsla(44, 97%, 85%, 1)', 300: 'hsla(44, 98%, 78%, 1)', 400: 'hsla(45, 99%, 69%, 1)', 500: 'hsla(48, 100%, 50%, 1)', 600: 'hsla(48, 98%, 42%, 1)', 700: 'hsla(47, 93%, 34%, 1)', 800: 'hsla(47, 91%, 26%, 1)', 900: 'hsla(46, 93%, 17%, 1)', 950: 'hsla(45, 96%, 11%, 1)' },
  green: { 50: 'hsla(124, 58%, 95%, 1)', 100: 'hsla(126, 63%, 90%, 1)', 200: 'hsla(125, 60%, 82%, 1)', 300: 'hsla(127, 57%, 72%, 1)', 400: 'hsla(130, 56%, 62%, 1)', 500: 'hsla(135, 59%, 49%, 1)', 600: 'hsla(137, 72%, 39%, 1)', 700: 'hsla(141, 96%, 27%, 1)', 800: 'hsla(141, 100%, 20%, 1)', 900: 'hsla(139, 100%, 14%, 1)', 950: 'hsla(135, 100%, 9%, 1)' },
  mint: { 50: 'hsla(172, 60%, 95%, 1)', 100: 'hsla(174, 61%, 90%, 1)', 200: 'hsla(174, 60%, 81%, 1)', 300: 'hsla(175, 58%, 70%, 1)', 400: 'hsla(176, 58%, 59%, 1)', 500: 'hsla(177, 100%, 39%, 1)', 600: 'hsla(177, 91%, 35%, 1)', 700: 'hsla(177, 82%, 29%, 1)', 800: 'hsla(177, 89%, 21%, 1)', 900: 'hsla(177, 94%, 14%, 1)', 950: 'hsla(177, 96%, 9%, 1)' },
  teal: { 50: 'hsla(189, 58%, 95%, 1)', 100: 'hsla(191, 64%, 90%, 1)', 200: 'hsla(190, 59%, 81%, 1)', 300: 'hsla(190, 57%, 71%, 1)', 400: 'hsla(190, 56%, 61%, 1)', 500: 'hsla(189, 61%, 48%, 1)', 600: 'hsla(189, 73%, 38%, 1)', 700: 'hsla(188, 94%, 28%, 1)', 800: 'hsla(188, 96%, 21%, 1)', 900: 'hsla(189, 95%, 14%, 1)', 950: 'hsla(189, 100%, 10%, 1)' },
  cyan: { 50: 'hsla(202, 90%, 96%, 1)', 100: 'hsla(202, 95%, 92%, 1)', 200: 'hsla(202, 90%, 84%, 1)', 300: 'hsla(202, 84%, 75%, 1)', 400: 'hsla(201, 80%, 66%, 1)', 500: 'hsla(199, 78%, 55%, 1)', 600: 'hsla(198, 74%, 45%, 1)', 700: 'hsla(197, 91%, 33%, 1)', 800: 'hsla(198, 94%, 25%, 1)', 900: 'hsla(198, 93%, 17%, 1)', 950: 'hsla(199, 100%, 12%, 1)' },
  blue: { 50: 'hsla(218, 100%, 96%, 1)', 100: 'hsla(216, 100%, 92%, 1)', 200: 'hsla(215, 98%, 84%, 1)', 300: 'hsla(215, 98%, 74%, 1)', 400: 'hsla(215, 98%, 65%, 1)', 500: 'hsla(211, 100%, 50%, 1)', 600: 'hsla(212, 94%, 44%, 1)', 700: 'hsla(212, 95%, 36%, 1)', 800: 'hsla(213, 99%, 28%, 1)', 900: 'hsla(214, 98%, 20%, 1)', 950: 'hsla(215, 100%, 15%, 1)' },
  indigo: { 50: 'hsla(233, 100%, 97%, 1)', 100: 'hsla(232, 95%, 92%, 1)', 200: 'hsla(233, 90%, 85%, 1)', 300: 'hsla(234, 77%, 76%, 1)', 400: 'hsla(237, 68%, 67%, 1)', 500: 'hsla(241, 61%, 59%, 1)', 600: 'hsla(242, 46%, 51%, 1)', 700: 'hsla(242, 47%, 43%, 1)', 800: 'hsla(243, 52%, 34%, 1)', 900: 'hsla(245, 60%, 25%, 1)', 950: 'hsla(248, 71%, 19%, 1)' },
  purple: { 50: 'hsla(278, 100%, 97%, 1)', 100: 'hsla(277, 94%, 93%, 1)', 200: 'hsla(277, 92%, 86%, 1)', 300: 'hsla(278, 79%, 77%, 1)', 400: 'hsla(279, 72%, 69%, 1)', 500: 'hsla(280, 68%, 60%, 1)', 600: 'hsla(280, 51%, 51%, 1)', 700: 'hsla(280, 54%, 41%, 1)', 800: 'hsla(281, 63%, 32%, 1)', 900: 'hsla(283, 85%, 21%, 1)', 950: 'hsla(283, 97%, 15%, 1)' },
  pink: { 50: 'hsla(0, 100%, 97%, 1)', 100: 'hsla(0, 100%, 94%, 1)', 200: 'hsla(359, 97%, 87%, 1)', 300: 'hsla(358, 100%, 80%, 1)', 400: 'hsla(355, 100%, 72%, 1)', 500: 'hsla(349, 100%, 59%, 1)', 600: 'hsla(346, 80%, 48%, 1)', 700: 'hsla(344, 96%, 36%, 1)', 800: 'hsla(345, 93%, 29%, 1)', 900: 'hsla(346, 98%, 20%, 1)', 950: 'hsla(348, 100%, 14%, 1)' },
  brown: { 50: 'hsla(33, 36%, 95%, 1)', 100: 'hsla(33, 33%, 89%, 1)', 200: 'hsla(35, 31%, 79%, 1)', 300: 'hsla(33, 29%, 69%, 1)', 400: 'hsla(33, 28%, 60%, 1)', 500: 'hsla(34, 27%, 50%, 1)', 600: 'hsla(34, 29%, 42%, 1)', 700: 'hsla(33, 31%, 34%, 1)', 800: 'hsla(34, 37%, 25%, 1)', 900: 'hsla(34, 47%, 17%, 1)', 950: 'hsla(34, 61%, 11%, 1)' },
} satisfies Record<string, Record<PaletteStep, string>>;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const typography = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
};

export const sizes = {
  icon: { sm: 16, md: 20, lg: 24 },
  avatar: { sm: 32, md: 40, lg: 56 },
  control: { sm: 32, md: 44, lg: 52 },
};

export const metrics = {
  touchTarget: 44,
  screenMargin: 16,
  hairline: 1,
};

// Semantic colors shown on the Foundations > Colors page.
// A value is either a palette reference (`hue.step`) or a raw `hsla()` value for pure white and black.

type PaletteRef = `${keyof typeof palette}.${PaletteStep}`;
type ColorValue = PaletteRef | `hsla(${string})`;

type ColorEntry = { usage: string; light: ColorValue; dark: ColorValue };

export const colorRoles = {
  background: {
    default: { usage: 'Screen background', light: 'hsla(0, 0%, 100%, 1)', dark: 'hsla(0, 0%, 0%, 1)' },
    subtle: { usage: 'Grouped lists, secondary areas', light: 'gray.50', dark: 'gray.950' },
    elevated: { usage: 'Cards, sheets, dialogs, menus', light: 'hsla(0, 0%, 100%, 1)', dark: 'gray.900' },
    inverse: { usage: 'Toasts, snackbars, tooltips', light: 'gray.950', dark: 'gray.50' },
  },
  content: {
    default: { usage: 'Titles and body text, icons', light: 'gray.950', dark: 'gray.50' },
    muted: { usage: 'Secondary text, descriptions', light: 'gray.600', dark: 'gray.400' },
    subtle: { usage: 'Placeholders, captions', light: 'gray.400', dark: 'gray.600' },
    disabled: { usage: 'Disabled labels and icons', light: 'gray.300', dark: 'gray.700' },
    inverse: { usage: 'Text on inverse backgrounds', light: 'hsla(0, 0%, 100%, 1)', dark: 'gray.950' },
    link: { usage: 'Links and text actions', light: 'blue.500', dark: 'blue.400' },
  },
  border: {
    default: { usage: 'Inputs, cards, separators', light: 'gray.200', dark: 'gray.800' },
    subtle: { usage: 'Dividers inside a surface', light: 'gray.100', dark: 'gray.900' },
    strong: { usage: 'Unchecked checkboxes and radios', light: 'gray.400', dark: 'gray.600' },
    focus: { usage: 'Focused input, selected item', light: 'blue.500', dark: 'blue.400' },
  },
  feedback: {
    info: { usage: 'Informative icon, text or fill', light: 'blue.500', dark: 'blue.400' },
    infoSubtle: { usage: 'Informative alert background', light: 'blue.50', dark: 'blue.950' },
    success: { usage: 'Confirmation icon, text or fill', light: 'green.500', dark: 'green.400' },
    successSubtle: { usage: 'Success alert background', light: 'green.50', dark: 'green.950' },
    warning: { usage: 'Warning icon, text or fill', light: 'orange.500', dark: 'orange.400' },
    warningSubtle: { usage: 'Warning alert background', light: 'orange.50', dark: 'orange.950' },
    error: { usage: 'Error icon, text, destructive action', light: 'red.500', dark: 'red.400' },
    errorSubtle: { usage: 'Error alert background', light: 'red.50', dark: 'red.950' },
  },
} satisfies Record<string, Record<string, ColorEntry>>;

export type ColorRole = keyof typeof colorRoles;
export type ColorScheme = 'light' | 'dark';

export function resolveColor(value: ColorValue): string {
  if (value.startsWith('hsla(')) return value;
  const [hue, step] = value.split('.') as [keyof typeof palette, `${PaletteStep}`];
  return palette[hue][Number(step) as PaletteStep];
}

// Hex value of a semantic color for one scheme, e.g. `roleColor('dark', 'border', 'focus')`.
export function roleColor<R extends ColorRole>(scheme: ColorScheme, role: R, key: keyof (typeof colorRoles)[R]): string {
  return resolveColor((colorRoles[role][key] as ColorEntry)[scheme]);
}

// Component tokens shown on the Foundations > Component tokens page.
// Shape: component → variant → state → property → semantic color (`role.key`).
// States other than `default` only list what changes; the rest falls back to `default`.

export type ColorRef = {
  [R in ColorRole]: `${R}.${Extract<keyof (typeof colorRoles)[R], string>}`;
}[ColorRole];

type ComponentStates = Record<string, Record<string, ColorRef>>;

export const componentTokens = {
  button: {
    solid: {
      default: { background: 'background.inverse', foreground: 'content.inverse' },
      pressed: { background: 'content.muted' },
      disabled: { background: 'border.default', foreground: 'content.disabled' },
    },
    outline: {
      default: { background: 'background.default', foreground: 'content.default', border: 'border.default' },
      pressed: { background: 'background.subtle' },
      disabled: { foreground: 'content.disabled', border: 'border.subtle' },
    },
    ghost: {
      default: { foreground: 'content.default' },
      pressed: { background: 'background.subtle' },
      disabled: { foreground: 'content.disabled' },
    },
    destructive: {
      default: { background: 'feedback.error', foreground: 'content.inverse' },
      pressed: { foreground: 'feedback.errorSubtle' },
      disabled: { background: 'border.default', foreground: 'content.disabled' },
    },
  },
  switch: {
    default: {
      default: { track: 'border.default', thumb: 'background.elevated' },
      checked: { track: 'feedback.success' },
      disabled: { track: 'border.subtle' },
    },
  },
  checkbox: {
    default: {
      default: { border: 'border.strong', indicator: 'content.inverse' },
      checked: { background: 'content.link', border: 'content.link' },
      invalid: { border: 'feedback.error' },
      disabled: { border: 'border.subtle', indicator: 'content.disabled' },
    },
  },
  iconButton: {
    ghost: {
      default: { foreground: 'content.default' },
      pressed: { background: 'background.subtle' },
      selected: { background: 'background.subtle' },
      disabled: { foreground: 'content.disabled' },
    },
    tinted: {
      default: { background: 'background.subtle', foreground: 'content.default' },
      pressed: { background: 'border.default' },
      selected: { background: 'border.default' },
      disabled: { foreground: 'content.disabled' },
    },
    outline: {
      default: { background: 'background.default', foreground: 'content.default', border: 'border.default' },
      pressed: { background: 'background.subtle' },
      selected: { border: 'border.focus' },
      disabled: { foreground: 'content.disabled', border: 'border.subtle' },
    },
    solid: {
      default: { background: 'background.inverse', foreground: 'content.inverse' },
      pressed: { background: 'content.muted' },
      selected: { background: 'content.muted' },
      disabled: { background: 'border.default', foreground: 'content.disabled' },
    },
  },
  floatingButton: {
    solid: {
      default: { background: 'background.inverse', foreground: 'content.inverse' },
      pressed: { background: 'content.muted' },
      disabled: { background: 'border.default', foreground: 'content.disabled' },
    },
    tinted: {
      default: { background: 'background.elevated', foreground: 'content.default', border: 'border.default' },
      pressed: { background: 'background.subtle' },
      disabled: { foreground: 'content.disabled' },
    },
  },
  radio: {
    default: {
      default: { border: 'border.strong', indicator: 'content.link' },
      checked: { border: 'content.link' },
      disabled: { border: 'border.subtle', indicator: 'content.disabled' },
    },
  },
  segmentedControl: {
    default: {
      default: { track: 'background.subtle', indicator: 'background.elevated', border: 'border.default', foreground: 'content.muted' },
      selected: { foreground: 'content.default' },
      disabled: { foreground: 'content.disabled' },
    },
  },
  slider: {
    default: {
      default: { track: 'border.default', fill: 'content.link', thumb: 'content.link' },
      disabled: { fill: 'content.disabled', thumb: 'content.disabled' },
    },
  },
  input: {
    outline: {
      default: { background: 'background.default', border: 'border.default', text: 'content.default', placeholder: 'content.subtle', affix: 'content.muted', caret: 'content.link' },
      focused: { border: 'border.focus' },
      invalid: { border: 'feedback.error', caret: 'feedback.error' },
      disabled: { background: 'background.subtle', border: 'border.subtle', text: 'content.disabled', affix: 'content.disabled' },
    },
    filled: {
      default: { background: 'background.subtle', text: 'content.default', placeholder: 'content.subtle', affix: 'content.muted', caret: 'content.link' },
      focused: { border: 'border.focus' },
      invalid: { border: 'feedback.error', caret: 'feedback.error' },
      disabled: { text: 'content.disabled', affix: 'content.disabled' },
    },
  },
  inputGroup: {
    default: {
      default: { addon: 'background.subtle', divider: 'border.default' },
      disabled: { divider: 'border.subtle' },
    },
  },
  inputOtp: {
    default: {
      default: { background: 'background.default', border: 'border.default', text: 'content.default', caret: 'content.link' },
      active: { border: 'border.focus' },
      invalid: { background: 'feedback.errorSubtle', border: 'feedback.error', text: 'feedback.error' },
      success: { background: 'feedback.successSubtle', border: 'feedback.success', text: 'feedback.success' },
      disabled: { background: 'background.subtle', border: 'border.subtle', text: 'content.disabled' },
    },
  },
  badge: {
    neutral: { default: { background: 'background.subtle', foreground: 'content.muted' } },
    info: { default: { background: 'feedback.infoSubtle', foreground: 'feedback.info' } },
    success: { default: { background: 'feedback.successSubtle', foreground: 'feedback.success' } },
    warning: { default: { background: 'feedback.warningSubtle', foreground: 'feedback.warning' } },
    error: { default: { background: 'feedback.errorSubtle', foreground: 'feedback.error' } },
    outline: { default: { foreground: 'content.default', border: 'border.default' } },
    inverse: { default: { background: 'background.inverse', foreground: 'content.inverse' } },
    count: { default: { background: 'feedback.error', foreground: 'content.inverse', border: 'background.default' } },
  },
  avatar: {
    default: { default: { background: 'border.default', foreground: 'content.muted', ring: 'background.default' } },
    status: { default: { online: 'feedback.success', away: 'feedback.warning', busy: 'feedback.error', offline: 'content.subtle' } },
  },
  chip: {
    outline: {
      default: { background: 'background.default', foreground: 'content.default', border: 'border.default' },
      pressed: { background: 'background.subtle' },
      selected: { background: 'background.inverse', foreground: 'content.inverse', border: 'background.inverse' },
      disabled: { foreground: 'content.disabled', border: 'border.subtle' },
    },
    filled: {
      default: { background: 'background.subtle', foreground: 'content.default' },
      pressed: { background: 'border.default' },
      selected: { background: 'background.inverse', foreground: 'content.inverse' },
      disabled: { foreground: 'content.disabled' },
    },
  },
  card: {
    elevated: { default: { background: 'background.elevated' }, pressed: { background: 'background.subtle' } },
    outlined: { default: { background: 'background.default', border: 'border.default' }, pressed: { background: 'background.subtle' } },
    filled: { default: { background: 'background.subtle' }, pressed: { background: 'border.subtle' } },
  },
  item: {
    default: {
      default: { divider: 'border.default' },
      pressed: { background: 'background.subtle' },
      selected: { background: 'feedback.infoSubtle' },
    },
  },
  skeleton: {
    default: { default: { background: 'border.subtle', highlight: 'border.default' } },
  },
  alert: {
    info: { default: { background: 'feedback.infoSubtle', icon: 'feedback.info' } },
    success: { default: { background: 'feedback.successSubtle', icon: 'feedback.success' } },
    warning: { default: { background: 'feedback.warningSubtle', icon: 'feedback.warning' } },
    error: { default: { background: 'feedback.errorSubtle', icon: 'feedback.error' } },
    neutral: { default: { background: 'background.subtle', icon: 'content.muted', border: 'border.subtle' } },
  },
  empty: {
    neutral: { default: { media: 'background.subtle', icon: 'content.muted' } },
    error: { default: { media: 'feedback.errorSubtle', icon: 'feedback.error' } },
  },
  toast: {
    default: {
      default: { background: 'background.elevated', border: 'border.subtle', icon: 'content.default' },
      success: { icon: 'feedback.success' },
      error: { icon: 'feedback.error' },
      info: { icon: 'feedback.info' },
    },
  },
  snackbar: {
    default: { default: { background: 'background.inverse', foreground: 'content.inverse', action: 'feedback.info' } },
  },
  calendar: {
    day: {
      default: { foreground: 'content.default', range: 'feedback.infoSubtle', dot: 'content.link' },
      pressed: { background: 'background.subtle' },
      today: { foreground: 'content.link' },
      selected: { background: 'content.link', foreground: 'content.inverse', dot: 'content.inverse' },
      inRange: { foreground: 'content.default' },
      outside: { foreground: 'content.subtle' },
      disabled: { foreground: 'content.disabled' },
    },
  },
  bottomSheet: {
    default: {
      default: { background: 'background.elevated', handle: 'border.strong' },
    },
  },
  dialog: {
    default: { default: { background: 'background.elevated' } },
  },
  menu: {
    default: {
      default: { background: 'background.elevated', separator: 'background.subtle', foreground: 'content.default' },
      pressed: { item: 'background.subtle' },
      destructive: { foreground: 'feedback.error' },
      disabled: { foreground: 'content.disabled' },
    },
  },
} satisfies Record<string, Record<string, ComponentStates>>;

export type ComponentName = keyof typeof componentTokens;

export function refColor(scheme: ColorScheme, ref: ColorRef): string {
  const [role, key] = ref.split('.') as [ColorRole, string];
  return roleColor(scheme, role, key as never);
}

// Flat list of `{ path, ref }` for one component, e.g. `{ path: 'button.solid.pressed.background', ref: 'content.muted' }`.
export function flattenComponent(name: ComponentName) {
  return Object.entries(componentTokens[name] as Record<string, ComponentStates>).flatMap(([variant, states]) =>
    Object.entries(states).flatMap(([state, props]) =>
      Object.entries(props).map(([prop, ref]) => ({ variant, state, prop, ref, path: `${name}.${variant}.${state}.${prop}` })),
    ),
  );
}
