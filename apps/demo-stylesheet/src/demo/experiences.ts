/** The Experience section mirrors the documented behaviors and patterns, one destination each. */
export const EXPERIENCES = [
  {
    slug: 'pull-to-refresh',
    title: 'Pull-to-refresh',
    description: 'Drag a list down from the top to reload its content',
    section: 'behaviors',
    group: 'Scroll',
    status: 'available',
  },
  {
    slug: 'hide-on-scroll',
    title: 'Hide-on-scroll',
    description: 'Bars slide out on the way down and come back on the way up',
    section: 'behaviors',
    group: 'Scroll',
    status: 'demo',
  },
  {
    slug: 'collapsible-header',
    title: 'Collapsible header',
    description: 'A large title that shrinks into a compact bar',
    section: 'behaviors',
    group: 'Scroll',
    status: 'demo',
  },
  {
    slug: 'scroll-to-top',
    title: 'Scroll-to-top',
    description: 'A way back to the top of a long list',
    section: 'behaviors',
    group: 'Scroll',
    status: 'demo',
  },
  {
    slug: 'scroll-aware-app-bar',
    title: 'Scroll-aware AppBar',
    description: 'A bar that gains its background and title as content scrolls under it',
    section: 'behaviors',
    group: 'Scroll',
    status: 'demo',
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    description: 'Load the next page as the user nears the bottom',
    section: 'behaviors',
    group: 'Scroll',
    status: 'demo',
  },
  {
    slug: 'long-press',
    title: 'Long press',
    description: 'Hold an element to get the actions that apply to it',
    section: 'behaviors',
    group: 'Gestures',
    status: 'available',
  },
  {
    slug: 'swipe-actions',
    title: 'Swipe actions',
    description: 'Swipe a row sideways to reveal the actions behind it',
    section: 'behaviors',
    group: 'Gestures',
    status: 'demo',
  },
  {
    slug: 'drag-to-reorder',
    title: 'Drag-to-reorder',
    description: 'Lift an item and drag it to a new place in the list',
    section: 'behaviors',
    group: 'Gestures',
    status: 'spec',
  },
  {
    slug: 'dynamic-toolbar',
    title: 'Dynamic toolbar',
    description: 'A bottom bar that replaces navigation during a mode',
    section: 'behaviors',
    group: 'Contextual UI',
    status: 'demo',
  },
  {
    slug: 'otp-verification',
    title: 'OTP verification',
    description: 'Complete verification flow built around InputOTP',
    section: 'patterns',
    group: 'Patterns',
    status: 'demo',
  },
  {
    slug: 'undoable-action',
    title: 'Undoable action',
    description: 'An action that happens now and can be taken back for a few seconds',
    section: 'patterns',
    group: 'Patterns',
    status: 'demo',
  },
  {
    slug: 'search-experience',
    title: 'Search experience',
    description: 'From the field to the results, recents and no matches',
    section: 'patterns',
    group: 'Patterns',
    status: 'demo',
  },
  {
    slug: 'selection-mode',
    title: 'Contextual selection mode',
    description: 'Select items and act on them through a contextual toolbar',
    section: 'patterns',
    group: 'Patterns',
    status: 'demo',
  },
  {
    slug: 'floating-action-menu',
    title: 'Floating action menu',
    description: 'A floating button that expands into secondary actions',
    section: 'patterns',
    group: 'Patterns',
    status: 'demo',
  },
  {
    slug: 'async-content-state',
    title: 'Async content state',
    description: 'Loading, content, empty, error, offline and retry',
    section: 'patterns',
    group: 'Patterns',
    status: 'demo',
  },
  {
    slug: 'guidelines',
    title: 'Mobile design guidelines',
    description: 'Mobile design rules that shouldn’t become components',
    section: 'patterns',
    group: 'Patterns',
    status: 'reading',
  },
] as const;

export type Experience = (typeof EXPERIENCES)[number];
export type ExperienceSection = Experience['section'];
export type ExperienceStatus = Experience['status'];

export const SECTIONS = [
  { value: 'behaviors', label: 'Behaviors' },
  { value: 'patterns', label: 'Patterns' },
] as const;

/** Short badge next to an entry, telling how far the experience goes today. */
export const STATUS_LABEL: Record<ExperienceStatus, string> = {
  available: 'Hook',
  demo: 'Demo',
  spec: 'Spec',
  reading: 'Rules',
};

export function experiencesOf(section: ExperienceSection): Experience[] {
  return EXPERIENCES.filter((experience) => experience.section === section);
}

export function groupsOfSection(section: ExperienceSection): string[] {
  return [...new Set(experiencesOf(section).map((experience) => experience.group))];
}

export function experienceTitle(slug: string): string | undefined {
  return EXPERIENCES.find((experience) => experience.slug === slug)?.title;
}
