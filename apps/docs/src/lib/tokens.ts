// Default token values shown on the Foundations > Tokens pages.
// The visuals read from here, so keep the code blocks in the MDX pages in sync with these values.

export const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type PaletteStep = (typeof paletteSteps)[number];

// Step 500 is the iOS system color; the other steps are derived from it in OKLCH.
export const palette = {
  gray: { 50: '#F4F4F4', 100: '#E7E7E8', 200: '#D1D1D3', 300: '#B8B8BC', 400: '#A3A3A7', 500: '#8E8E93', 600: '#78787D', 700: '#616165', 800: '#4A4A4D', 900: '#323235', 950: '#222225' },
  red: { 50: '#FFF0EE', 100: '#FFE0DB', 200: '#FFC0B6', 300: '#FE9B8D', 400: '#FE7464', 500: '#FF3B30', 600: '#DD2821', 700: '#B80F0E', 800: '#910305', 900: '#660002', 950: '#490001' },
  orange: { 50: '#FFF4EC', 100: '#FFEAD9', 200: '#FFD7B5', 300: '#FFC18A', 400: '#FEAC5F', 500: '#FF9500', 600: '#D77D05', 700: '#AB630A', 800: '#824A03', 900: '#573001', 950: '#3B1E00' },
  yellow: { 50: '#FEF9E9', 100: '#FFF4D6', 200: '#FEEBB5', 300: '#FEE18E', 400: '#FED764', 500: '#FFCC00', 600: '#D6AB02', 700: '#A98606', 800: '#7E6406', 900: '#524003', 950: '#352801' },
  green: { 50: '#ECFAED', 100: '#D7F6DA', 200: '#B4ECB9', 300: '#8DE097', 400: '#66D479', 500: '#34C759', 600: '#1CA945', 700: '#038832', 800: '#006724', 900: '#004516', 950: '#002F0C' },
  mint: { 50: '#EBFAF8', 100: '#D6F5F2', 200: '#B0EBE5', 300: '#86DFD7', 400: '#5AD3CB', 500: '#00C7BE', 600: '#08A8A0', 700: '#0D857F', 800: '#066560', 900: '#024340', 950: '#012D2B' },
  teal: { 50: '#ECF8FA', 100: '#D6F0F6', 200: '#B1E1EB', 300: '#89D0DF', 400: '#62C0D3', 500: '#30B0C7', 600: '#1A95AA', 700: '#04788A', 800: '#025C69', 900: '#023D47', 950: '#002A31' },
  cyan: { 50: '#EBF7FE', 100: '#D6EFFE', 200: '#B1E0FB', 300: '#89CEF5', 400: '#63BEEE', 500: '#32ADE6', 600: '#1D92C6', 700: '#0875A1', 800: '#04597C', 900: '#033C54', 950: '#00283B' },
  blue: { 50: '#ECF3FF', 100: '#D5E6FF', 200: '#ACCEFE', 300: '#7DB2FE', 400: '#5098FD', 500: '#007AFF', 600: '#0768D9', 700: '#0554B1', 800: '#01418D', 900: '#012C64', 950: '#001F4B' },
  indigo: { 50: '#EEF0FF', 100: '#D9DEFE', 200: '#B5BDFB', 300: '#919AF1', 400: '#7379E4', 500: '#5856D6', 600: '#4B48BC', 700: '#3D39A0', 800: '#2F2A85', 900: '#211A67', 950: '#170E54' },
  purple: { 50: '#F9EFFF', 100: '#F1DCFE', 200: '#E3BBFC', 300: '#D197F3', 400: '#C076E9', 500: '#AF52DE', 600: '#9742C1', 700: '#7C30A1', 800: '#631E83', 900: '#480862', 950: '#35014A' },
  pink: { 50: '#FFF0F0', 100: '#FFDEDE', 200: '#FEBEBF', 300: '#FF979B', 400: '#FF6E79', 500: '#FF2D55', 600: '#DD1845', 700: '#B60434', 800: '#8D0527', 900: '#630118', 950: '#48000F' },
  brown: { 50: '#F7F3EE', 100: '#EDE5DB', 200: '#DBCDBA', 300: '#C7B299', 400: '#B59B7B', 500: '#A2845E', 600: '#8B704D', 700: '#71593B', 800: '#594429', 900: '#3F2E17', 950: '#2E1F0B' },
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
// A value is either a palette reference (`hue.step`) or a raw hex for pure white and black.

type PaletteRef = `${keyof typeof palette}.${PaletteStep}`;
type ColorValue = PaletteRef | `#${string}`;

type ColorEntry = { usage: string; light: ColorValue; dark: ColorValue };

export const colorRoles = {
  background: {
    default: { usage: 'Screen background', light: '#FFFFFF', dark: '#000000' },
    subtle: { usage: 'Grouped lists, secondary areas', light: 'gray.50', dark: 'gray.950' },
    elevated: { usage: 'Cards, sheets, dialogs, menus', light: '#FFFFFF', dark: 'gray.900' },
    inverse: { usage: 'Toasts, snackbars, tooltips', light: 'gray.950', dark: 'gray.50' },
  },
  content: {
    default: { usage: 'Titles and body text, icons', light: 'gray.950', dark: 'gray.50' },
    muted: { usage: 'Secondary text, descriptions', light: 'gray.600', dark: 'gray.400' },
    subtle: { usage: 'Placeholders, captions', light: 'gray.400', dark: 'gray.600' },
    disabled: { usage: 'Disabled labels and icons', light: 'gray.300', dark: 'gray.700' },
    inverse: { usage: 'Text on inverse backgrounds', light: '#FFFFFF', dark: 'gray.950' },
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
  if (value.startsWith('#')) return value;
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
  },
  input: {
    default: {
      default: { background: 'background.default', foreground: 'content.default', placeholder: 'content.subtle', border: 'border.default' },
      focused: { border: 'border.focus' },
      invalid: { border: 'feedback.error' },
      disabled: { background: 'background.subtle', foreground: 'content.disabled' },
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
      disabled: { border: 'border.subtle' },
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
