import { useLocalSearchParams } from 'expo-router';
import type { ComponentType } from 'react';

import { Text } from '@/components/ui/text';
import AsyncContentState from '@/demo/experiences/async-content-state';
import CollapsibleHeader from '@/demo/experiences/collapsible-header';
import DragToReorder from '@/demo/experiences/drag-to-reorder';
import DynamicToolbar from '@/demo/experiences/dynamic-toolbar';
import FloatingActionMenu from '@/demo/experiences/floating-action-menu';
import Guidelines from '@/demo/experiences/guidelines';
import HideOnScroll from '@/demo/experiences/hide-on-scroll';
import LongPress from '@/demo/experiences/long-press';
import OtpVerification from '@/demo/experiences/otp-verification';
import Pagination from '@/demo/experiences/pagination';
import PullToRefresh from '@/demo/experiences/pull-to-refresh';
import ScrollAwareAppBar from '@/demo/experiences/scroll-aware-app-bar';
import ScrollToTop from '@/demo/experiences/scroll-to-top';
import SearchExperience from '@/demo/experiences/search-experience';
import SelectionMode from '@/demo/experiences/selection-mode';
import SwipeActions from '@/demo/experiences/swipe-actions';
import UndoableAction from '@/demo/experiences/undoable-action';
import { Screen } from '@/demo/screen';

/** One entry per slug of `EXPERIENCES`. */
const SCREENS: Record<string, ComponentType> = {
  'pull-to-refresh': PullToRefresh,
  'hide-on-scroll': HideOnScroll,
  'collapsible-header': CollapsibleHeader,
  'scroll-to-top': ScrollToTop,
  'scroll-aware-app-bar': ScrollAwareAppBar,
  pagination: Pagination,
  'long-press': LongPress,
  'swipe-actions': SwipeActions,
  'drag-to-reorder': DragToReorder,
  'dynamic-toolbar': DynamicToolbar,
  'otp-verification': OtpVerification,
  'undoable-action': UndoableAction,
  'search-experience': SearchExperience,
  'selection-mode': SelectionMode,
  'floating-action-menu': FloatingActionMenu,
  'async-content-state': AsyncContentState,
  guidelines: Guidelines,
};

export default function ExperienceRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const Experience = SCREENS[slug];

  if (!Experience) {
    return (
      <Screen title="Experience">
        <Text>This experience has no screen yet.</Text>
      </Screen>
    );
  }

  return <Experience />;
}
