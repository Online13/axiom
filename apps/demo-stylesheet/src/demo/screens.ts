/** One destination per documented atom. Groups only organize the index. */
export const SCREENS = [
  { name: 'foundations', title: 'Foundations', group: 'Foundations', description: 'Colors, typography, spacing and radius' },

  { name: 'button', title: 'Button', group: 'Actions', description: 'Primary actions, loading and paired actions' },
  { name: 'button-group', title: 'ButtonGroup', group: 'Actions', description: 'Split button, stepper and dialog actions' },
  { name: 'icon-button', title: 'IconButton', group: 'Actions', description: 'Compact actions and toggles' },
  { name: 'floating-button', title: 'FloatingButton', group: 'Actions', description: 'Floating primary actions' },

  { name: 'input', title: 'Input', group: 'Inputs', description: 'Login, validation, affixes and return key' },
  { name: 'text-area', title: 'TextArea', group: 'Inputs', description: 'Long-form text and character limits' },
  { name: 'input-group', title: 'InputGroup', group: 'Inputs', description: 'Shared borders, addons and inline actions' },
  { name: 'input-otp', title: 'InputOTP', group: 'Inputs', description: 'Verification codes and grouped keys' },
  { name: 'checkbox', title: 'Checkbox', group: 'Inputs', description: 'Consent, select all and filters' },
  { name: 'radio', title: 'Radio', group: 'Inputs', description: 'Single choice and selectable rows' },
  { name: 'switch', title: 'Switch', group: 'Inputs', description: 'Settings and dependent options' },
  { name: 'slider', title: 'Slider', group: 'Inputs', description: 'Volume, ranges and steps' },
  { name: 'segmented-control', title: 'SegmentedControl', group: 'Inputs', description: 'Views, filters and settings' },
  { name: 'calendar', title: 'Calendar', group: 'Inputs', description: 'Dates, ranges and marked days' },
  { name: 'chip', title: 'Chip', group: 'Inputs', description: 'Filters and removable tags' },

  { name: 'card', title: 'Card', group: 'Content', description: 'Summary, feed and media cards' },
  { name: 'item', title: 'Item', group: 'Content', description: 'Navigation and action rows' },
  { name: 'option-item', title: 'OptionItem', group: 'Content', description: 'Settings and selection lists' },
  { name: 'accordion', title: 'Accordion', group: 'Content', description: 'FAQ, order details and advanced options' },
  { name: 'carousel', title: 'Carousel', group: 'Content', description: 'Onboarding and galleries' },
  { name: 'avatar', title: 'Avatar', group: 'Content', description: 'People, initials and groups' },
  { name: 'badge', title: 'Badge', group: 'Content', description: 'Counts, status and labels' },
  { name: 'separator', title: 'Separator', group: 'Content', description: 'Dividers and grouped content' },
  { name: 'icon', title: 'Icon', group: 'Content', description: 'Registry, sizes and semantic colors' },
  { name: 'text', title: 'Text', group: 'Content', description: 'Body text, colors and weights' },
  { name: 'title', title: 'Title', group: 'Content', description: 'Accessible headings' },

  { name: 'alert', title: 'Alert', group: 'Feedback', description: 'Errors, warnings and contextual information' },
  { name: 'empty', title: 'Empty', group: 'Feedback', description: 'No results, offline and retry' },
  { name: 'skeleton', title: 'Skeleton', group: 'Feedback', description: 'List and card placeholders' },
  { name: 'spinner', title: 'Spinner', group: 'Feedback', description: 'Screen, list and inline loading' },
  { name: 'toast', title: 'Toast', group: 'Feedback', description: 'Background actions and requests' },
  { name: 'snackbar', title: 'Snackbar', group: 'Feedback', description: 'Undo and retry' },
  { name: 'dialog', title: 'Dialog', group: 'Overlays', description: 'Confirmation and async actions' },
  { name: 'menu', title: 'Menu', group: 'Overlays', description: 'App bar and context actions' },
  { name: 'bottom-sheet', title: 'BottomSheet', group: 'Overlays', description: 'Item actions and short forms' },

  { name: 'attachment', title: 'Attachment', group: 'Molecules', description: 'Upload progress, removal, errors and tiles' },
  { name: 'date-picker', title: 'DatePicker', group: 'Molecules', description: 'Date and range in a sheet, presets and custom triggers' },
  { name: 'search-bar', title: 'SearchBar', group: 'Molecules', description: 'Query, cancel, live results and local filtering' },

  { name: 'passcode', title: 'Passcode', group: 'Organisms', description: 'In-app keypad, wrong code, verifying and PIN setup' },

  { name: 'scaffold', title: 'Scaffold', group: 'Templates', description: 'Screen structure: bar, content, footer and safe areas' },
  { name: 'tab', title: 'Tab', group: 'Templates', description: 'Underline, pill and scrollable tabs' },
  { name: 'bottom-tab-bar', title: 'BottomTabBar', group: 'Templates', description: 'Destinations, badges, floating bar and main action' },
  { name: 'tool-bar', title: 'ToolBar', group: 'Templates', description: 'Contextual actions, docked or floating' },
  { name: 'app-bar', title: 'AppBar', group: 'Templates', description: 'Back navigation, large title, search and elevation' },

  { name: 'tappable', title: 'Tappable', group: 'Core', description: 'Press feedback and touch targets' },
  { name: 'overlay', title: 'Overlay', group: 'Core', description: 'Backdrop and dismissal' },
  { name: 'portal', title: 'Portal', group: 'Core', description: 'Render outside the current view tree' },
  { name: 'slot', title: 'Slot', group: 'Core', description: 'Forward behavior to a child' },
] as const;

export type Screen = (typeof SCREENS)[number];
export type ScreenGroup = Screen['group'];

/** The four tabs of the Components section, mapped from the registry categories. */
export const CATEGORIES = [
  { value: 'foundation', label: 'Foundation' },
  { value: 'atoms', label: 'Atoms' },
  { value: 'molecules', label: 'Molecules' },
  { value: 'organisms', label: 'Organisms' },
] as const;

export type Category = (typeof CATEGORIES)[number]['value'];

const CATEGORY_OF_GROUP: Record<ScreenGroup, Category> = {
  Foundations: 'foundation',
  Core: 'foundation',
  Actions: 'atoms',
  Inputs: 'atoms',
  Content: 'atoms',
  Feedback: 'atoms',
  Overlays: 'atoms',
  Molecules: 'molecules',
  Organisms: 'organisms',
  Templates: 'organisms',
};

export function screensOf(category: Category): Screen[] {
  return SCREENS.filter((screen) => CATEGORY_OF_GROUP[screen.group] === category);
}

/** The groups of a category, in the order they appear in `SCREENS`. */
export function groupsOf(category: Category): ScreenGroup[] {
  return [...new Set(screensOf(category).map((screen) => screen.group))];
}

export function screenTitle(name: string): string | undefined {
  return SCREENS.find((screen) => screen.name === name)?.title;
}
