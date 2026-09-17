import { createContext, use, useCallback, useState } from 'react';

import type { InputState } from '@/components/ui/use-input';

export type InputGroupSize = 'sm' | 'md' | 'lg';

export type UseInputGroupOptions = {
  size?: InputGroupSize;
  error?: boolean;
  disabled?: boolean;
};

/** Size, error and disabled state passed to the parts, and the focused border drawn around the whole group. */
export function useInputGroup({ size = 'md', error = false, disabled = false }: UseInputGroupOptions) {
  // A count rather than a boolean: focus moving between two inputs of the group fires blur and focus in any order.
  const [focusCount, setFocusCount] = useState(0);

  const onPartFocus = useCallback(() => setFocusCount((count) => count + 1), []);
  const onPartBlur = useCallback(() => setFocusCount((count) => Math.max(0, count - 1)), []);

  const state: InputState = disabled ? 'disabled' : error ? 'invalid' : focusCount > 0 ? 'focused' : 'default';

  return {
    state,
    context: { size, disabled, state, onPartFocus, onPartBlur },
  };
}

export type InputGroupContextValue = ReturnType<typeof useInputGroup>['context'];

export const InputGroupContext = createContext<InputGroupContextValue | null>(null);

export function useInputGroupContext() {
  const context = use(InputGroupContext);
  if (!context) {
    throw new Error('This part must be rendered inside InputGroup.');
  }
  return context;
}
