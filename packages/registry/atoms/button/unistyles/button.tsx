import type { ReactNode } from "react";
import {
	ActivityIndicator,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Slot } from "@/components/core/slot";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import type { Theme } from "@/theme";
import { metrics } from "@/theme/tokens";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from "@/components/ui/text";

export type ButtonVariant = "solid" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

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

type ButtonState = "default" | "pressed" | "disabled";

function buttonColors(
	components: Theme["components"],
	variant: ButtonVariant,
	state: ButtonState,
) {
	const states = components.button[variant];
	return {
		...states.default,
		...(state === "default" ? undefined : states[state]),
	};
}

// The spinner and the icon take their color as a prop, not as a style. Wrapped once, here, so each
// instance only has to map the theme to that prop through `uniProps`.
const ThemedSpinner = withUnistyles(ActivityIndicator);
const ThemedIcon = withUnistyles(Icon);

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
	style,
	...props
}: ButtonProps) {
	const inactive = disabled || loading;

	const containerStyle = (state: ButtonState): StyleProp<ViewStyle> => [
		styles.container(variant, state, size, fullWidth),
		style,
	];

	const label = (state: ButtonState) => {
		const foreground = (theme: Theme) =>
			buttonColors(theme.components, variant, state).foreground;
		const spinner = (
			<ThemedSpinner
				size="small"
				uniProps={(theme) => ({ color: foreground(theme) })}
			/>
		);
		const iconSize = size === "sm" ? "sm" : "md";
		const icon = (name: IconName) => (
			<ThemedIcon
				name={name}
				size={iconSize}
				uniProps={(theme) => ({ color: foreground(theme) })}
			/>
		);

		return (
			<>
				{loading && leadingIcon ? spinner : null}
				{!loading && leadingIcon ? icon(leadingIcon) : null}
				<View
					style={[styles.label, loading && !leadingIcon && styles.hidden]}
				>
					{typeof children === "string" || typeof children === "number" ? (
						<Text
							numberOfLines={1}
							maxFontSizeMultiplier={MAX_FONT_SCALE.control}
							style={styles.text(variant, state, size)}
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
					<View style={styles.spinnerOverlay}>{spinner}</View>
				) : null}
			</>
		);
	};

	if (asChild) {
		return (
			<Slot
				{...props}
				style={containerStyle(inactive ? "disabled" : "default")}
			>
				{children}
			</Slot>
		);
	}

	return (
		<Tappable
			pressScale={metrics.pressScale}
			{...props}
			disabled={inactive}
			accessibilityState={{ ...accessibilityState, busy: loading }}
			style={({ pressed }) =>
				containerStyle(
					disabled ? "disabled" : pressed ? "pressed" : "default",
				)
			}
		>
			{({ pressed }) =>
				label(disabled ? "disabled" : pressed ? "pressed" : "default")
			}
		</Tappable>
	);
}

const PADDING: Record<ButtonSize, (tokens: Theme["tokens"]) => number> = {
	sm: (tokens) => tokens.spacing[3],
	md: (tokens) => tokens.spacing[4],
	lg: (tokens) => tokens.spacing[5],
};

const TYPOGRAPHY = {
	sm: "subheadline",
	md: "callout",
	lg: "headline",
} as const satisfies Record<ButtonSize, keyof Theme["tokens"]["typography"]>;

const styles = StyleSheet.create((theme) => ({
	container: (
		variant: ButtonVariant,
		state: ButtonState,
		size: ButtonSize,
		fullWidth: boolean,
	) => {
		const colors = buttonColors(theme.components, variant, state);
		return {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			alignSelf: fullWidth ? "stretch" : "flex-start",
			minHeight: theme.tokens.sizes.control[size],
			paddingHorizontal: PADDING[size](theme.tokens),
			gap: theme.tokens.spacing[2],
			borderRadius: theme.components.button.radius,
			backgroundColor: colors.background ?? "transparent",
			borderWidth: colors.border ? 1 : 0,
			borderColor: colors.border,
		};
	},
	text: (variant: ButtonVariant, state: ButtonState, size: ButtonSize) => ({
		...theme.tokens.typography[TYPOGRAPHY[size]],
		color: buttonColors(theme.components, variant, state).foreground,
		fontWeight: FONT_WEIGHT.semibold,
	}),
	label: {
		flexShrink: 1,
	},
	hidden: {
		opacity: 0,
	},
	spinnerOverlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
}));
