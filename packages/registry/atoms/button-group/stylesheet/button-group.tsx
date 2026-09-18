import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { ButtonSize, ButtonVariant } from '@/components/ui/button';
import { useTheme, type Spacing } from '@/theme';

export type ButtonGroupProps = {
  /** Button or IconButton elements. */
  children?: ReactNode;
  /** Merges adjacent borders and keeps only the outer corners rounded. */
  attached?: boolean;
  orientation?: 'horizontal' | 'vertical';
  /** Space between buttons when not attached. */
  gap?: keyof Spacing;
  /** Applied to every child that doesn't set its own. */
  size?: ButtonSize;
  variant?: ButtonVariant;
  /** Stretches the group and splits its width evenly. */
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

type ChildProps = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type ButtonGroupItemRenderProps = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled: boolean;
  /** Layout for a wrapper such as Menu.Trigger. */
  containerStyle: StyleProp<ViewStyle>;
  /** Corner shape for the visible button inside the wrapper. */
  buttonStyle: StyleProp<ViewStyle>;
};

export type ButtonGroupItemProps = {
  /** Use when a button must sit inside a wrapper such as Menu.Trigger. */
  render: (props: ButtonGroupItemRenderProps) => ReactNode;
  /** Set to false for a compact action in a full-width group. */
  grow?: boolean;
};

type InternalItemProps = ButtonGroupItemProps & { groupProps?: ButtonGroupItemRenderProps };

function ButtonGroupItem({ render, groupProps }: InternalItemProps) {
  return groupProps ? render(groupProps) : null;
}

/** Lays out buttons side by side. It doesn't track a selection: see SegmentedControl for that. */
function ButtonGroupRoot({
  children,
  attached = true,
  orientation = 'horizontal',
  gap = 2,
  size,
  variant,
  fullWidth = false,
  disabled = false,
  style,
}: ButtonGroupProps) {
  const { tokens } = useTheme();
  const horizontal = orientation === 'horizontal';
  const buttons = Children.toArray(children).filter(isValidElement) as ReactElement<ChildProps>[];
  const last = buttons.length - 1;

  return (
    <View
      style={[
        horizontal ? styles.row : styles.column,
        !attached && { gap: tokens.spacing[gap] },
        fullWidth ? styles.stretch : styles.hug,
        style,
      ]}
    >
      {buttons.map((button, i) => {
        const first = i === 0;
        const end = i === last;
        const attachedStyle: ViewStyle | undefined = attached
          ? horizontal
            ? {
                // Overlap by the border width so two borders read as one.
                marginStart: first ? 0 : -1,
                borderTopLeftRadius: first ? tokens.radius.md : 0,
                borderBottomLeftRadius: first ? tokens.radius.md : 0,
                borderTopRightRadius: end ? tokens.radius.md : 0,
                borderBottomRightRadius: end ? tokens.radius.md : 0,
              }
            : {
                marginTop: first ? 0 : -1,
                ...(!first && { borderTopLeftRadius: 0, borderTopRightRadius: 0 }),
                ...(!end && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
              }
          : undefined;

        if (button.type === ButtonGroupItem) {
          const item = button as ReactElement<InternalItemProps>;
          const { marginStart, marginTop, ...corners } = attachedStyle ?? {};
          return cloneElement(item, {
            key: item.key ?? i,
            groupProps: {
              size,
              variant,
              disabled,
              containerStyle: [
                { marginStart, marginTop },
                fullWidth && horizontal && item.props.grow !== false && styles.equal,
                !horizontal && styles.stretchSelf,
              ],
              buttonStyle: attached ? corners : undefined,
            },
          });
        }

        return cloneElement(button, {
          key: button.key ?? i,
          size: button.props.size ?? size,
          variant: button.props.variant ?? variant,
          disabled: button.props.disabled ?? disabled,
          style: [
            attachedStyle,
            fullWidth && horizontal && styles.equal,
            !horizontal && styles.stretchSelf,
            button.props.style,
          ],
        });
      })}
    </View>
  );
}

export const ButtonGroup = Object.assign(ButtonGroupRoot, { Item: ButtonGroupItem });

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  hug: {
    alignSelf: 'flex-start',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  equal: {
    flex: 1,
    alignSelf: 'auto',
  },
  stretchSelf: {
    alignSelf: 'stretch',
  },
});
