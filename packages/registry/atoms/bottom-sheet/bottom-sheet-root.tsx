import { createContext, use, type ReactNode } from 'react';
import type { GestureResponderEvent } from 'react-native';

import { Slot } from '@/components/core/slot';
import { Tappable, type TappableProps } from '@/components/core/tappable';
import { useControllableState } from '@/hooks/use-controllable-state';

type BottomSheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export function useBottomSheet() {
  const context = use(BottomSheetContext);
  if (!context) {
    throw new Error('BottomSheet parts must be rendered inside BottomSheet.Root.');
  }
  return context;
}

export type BottomSheetRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  /** Called when the sheet opens or closes, including by swipe, backdrop press or the Android back button. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

export function BottomSheetRoot({ open, defaultOpen = false, onOpenChange, children }: BottomSheetRootProps) {
  const [current, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });

  return <BottomSheetContext value={{ open: current, setOpen }}>{children}</BottomSheetContext>;
}

export type BottomSheetTriggerProps = TappableProps & {
  asChild?: boolean;
};

export function BottomSheetTrigger({ asChild = false, onPress, children, ...props }: BottomSheetTriggerProps) {
  const { setOpen } = useBottomSheet();

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event);
    setOpen(true);
  };

  if (asChild) {
    return (
      <Slot {...props} onPress={handlePress}>
        {children as ReactNode}
      </Slot>
    );
  }

  return (
    <Tappable {...props} onPress={handlePress}>
      {children}
    </Tappable>
  );
}
