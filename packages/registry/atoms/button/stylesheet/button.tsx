import type { ReactNode } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Slot } from "@/components/core/slot";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { useTheme, type Theme } from "@/theme";
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
	const { tokens, components } = useTheme();
	const inactive = disabled || loading;

	const containerStyle = (state: ButtonState): StyleProp<ViewStyle> => {
		const colors = buttonColors(components, variant, state);
		return [
			styles.container,
			{
				minHeight: tokens.sizes.control[size],
				paddingHorizontal: PADDING[size](tokens),
				gap: tokens.spacing[2],
				borderRadius: tokens.radius.md,
				backgroundColor: colors.background ?? "transparent",
				borderWidth: colors.border ? 1 : 0,
				borderColor: colors.border,
			},
			fullWidth && styles.fullWidth,
			style,
		];
	};

	const label = (state: ButtonState) => {
		const { foreground } = buttonColors(components, variant, state);
		const typography =
			tokens.typography[
				size === "sm"
					? "subheadline"
					: size === "md"
						? "callout"
						: "headline"
			];
		const spinner = <ActivityIndicator size="small" color={foreground} />;
		const iconSize = size === "sm" ? "sm" : "md";

		return (
			<>
				{loading && leadingIcon ? spinner : null}
				{!loading && leadingIcon ? (
					<Icon name={leadingIcon} size={iconSize} color={foreground} />
				) : null}
				<View
					style={[styles.label, loading && !leadingIcon && styles.hidden]}
				>
					{typeof children === "string" || typeof children === "number" ? (
						<Text
							numberOfLines={1}
							maxFontSizeMultiplier={MAX_FONT_SCALE.control}
							style={[
								typography,
								{ color: foreground, fontWeight: FONT_WEIGHT.semibold },
							]}
						>
							{children}
						</Text>
					) : (
						children
					)}
				</View>
				{trailingIcon ? (
					<Icon name={trailingIcon} size={iconSize} color={foreground} />
				) : null}
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
			pressScale={tokens.metrics.pressScale}
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

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "flex-start",
	},
	fullWidth: {
		alignSelf: "stretch",
	},
	label: {
		flexShrink: 1,
	},
	hidden: {
		opacity: 0,
	},
	spinnerOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: "center",
		justifyContent: "center",
	},
});
