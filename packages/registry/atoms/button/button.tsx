import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { Slot } from "@/components/core/slot";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import type { IconName } from "@/components/ui/icons";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";

import { ButtonIcon, ButtonSpinner, useButtonStyles } from "./button.styles";

export type ButtonVariant = "solid" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonState = "default" | "pressed" | "disabled";

export type ButtonProps = Omit<TappableProps, "children" | "style"> & {
	children?: ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	/** An icon of your registry. Icons always go through Icon, never a raw element. */
	leadingIcon?: IconName;
	trailingIcon?: IconName;
	fullWidth?: boolean;
	asChild?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function Button({
	children,
	variant = "solid",
	size = "md",
	loading = false,
	disabled = false,
	leadingIcon,
	trailingIcon,
	fullWidth = false,
	asChild = false,
	accessibilityState,
	...props
}: ButtonProps) {
	const styles = useButtonStyles(variant, size, fullWidth);
	const inactive = disabled || loading;

	const label = (state: ButtonState) => {
		const spinner = <ButtonSpinner size="small" {...styles.tint(state)} />;
		const icon = (name: IconName) => (
			<ButtonIcon
				name={name}
				size={size === "sm" ? "sm" : "md"}
				{...styles.tint(state)}
			/>
		);

		return (
			<>
				{loading && leadingIcon ? spinner : null}
				{!loading && leadingIcon ? icon(leadingIcon) : null}
				<View {...styles.label(loading && !leadingIcon)}>
					{typeof children === "string" || typeof children === "number" ? (
						<Text
							numberOfLines={1}
							maxFontSizeMultiplier={MAX_FONT_SCALE.control}
							{...styles.text(state)}
						>
							{children}
						</Text>
					) : (
						children
					)}
				</View>
				{trailingIcon ? icon(trailingIcon) : null}
				{/* Without a leading icon, the spinner covers the hidden label so the width doesn't change. */}
				{loading && !leadingIcon ? (
					<View {...styles.spinnerOverlay}>{spinner}</View>
				) : null}
			</>
		);
	};

	if (asChild) {
		return (
			<Slot
				{...props}
				{...styles.container(inactive ? "disabled" : "default", props)}
			>
				{children}
			</Slot>
		);
	}

	return (
		<Tappable
			{...props}
			{...styles.pressable(disabled === true, props)}
			disabled={inactive}
			accessibilityState={{ ...accessibilityState, busy: loading }}
		>
			{({ pressed }) =>
				label(disabled ? "disabled" : pressed ? "pressed" : "default")
			}
		</Tappable>
	);
}
