import {
	createContext,
	use,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";
import { useTheme } from "@/theme";

type EmptySize = "sm" | "md";

const SizeContext = createContext<EmptySize>("md");

export type EmptyTone = "neutral" | "error";

export type EmptyProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	children?: ReactNode;
	/** `md` for a full screen, `sm` for a section or a sheet. */
	size?: EmptySize;
	/** Takes the remaining height and centers its content. */
	fill?: boolean;
	style?: StyleProp<ViewStyle>;
};

function EmptyRoot({
	children,
	size = "md",
	fill = true,
	style,
	...props
}: EmptyProps) {
	const { tokens } = useTheme();

	return (
		<SizeContext value={size}>
			<View
				{...props}
				style={[
					styles.root,
					fill && styles.fill,
					{
						gap: tokens.spacing[size === "md" ? 6 : 4],
						padding: tokens.spacing[size === "md" ? 8 : 4],
					},
					style,
				]}
			>
				{children}
			</View>
		</SizeContext>
	);
}

export type EmptyHeaderProps = ComponentPropsWithRef<typeof View>;

function EmptyHeader({ children, style, ...props }: EmptyHeaderProps) {
	const { tokens } = useTheme();
	const size = use(SizeContext);

	return (
		<View
			// Read as one block: "No projects yet. Create one to get started."
			accessible
			{...props}
			style={[
				styles.header,
				{ gap: tokens.spacing[size === "md" ? 2 : 1] },
				style,
			]}
		>
			{children}
		</View>
	);
}

export type EmptyMediaProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	icon?: IconName;
	/** `error` tints the tile, for failures. */
	tone?: EmptyTone;
	/** Custom media instead of `icon`. */
	children?: ReactNode;
};

function EmptyMedia({
	icon,
	tone = "neutral",
	children,
	style,
	...props
}: EmptyMediaProps) {
	const { tokens, components } = useTheme();
	const size = use(SizeContext);
	const colors = components.empty[tone].default;
	const tile = size === "md" ? 64 : 48;

	return (
		<View
			{...props}
			style={[
				{ marginBottom: tokens.spacing[size === "md" ? 3 : 2] },
				style,
			]}
		>
			{children ?? (
				<View
					style={[
						styles.tile,
						{
							width: tile,
							height: tile,
							borderRadius: tile / 2,
							backgroundColor: colors.media,
						},
					]}
				>
					{icon ? (
						<Icon
							name={icon}
							size={size === "md" ? "lg" : "md"}
							color={colors.icon}
						/>
					) : null}
				</View>
			)}
		</View>
	);
}

function EmptyTitle(props: TitleProps) {
	const size = use(SizeContext);
	return (
		<Title
			variant={size === "md" ? "headingSm" : "subheading"}
			align="center"
			{...props}
		/>
	);
}

function EmptyDescription(props: TextProps) {
	const size = use(SizeContext);
	return (
		<Text
			variant={size === "md" ? "body" : "bodySm"}
			color="muted"
			align="center"
			{...props}
		/>
	);
}

export type EmptyContentProps = ComponentPropsWithRef<typeof View>;

function EmptyContent({ children, style, ...props }: EmptyContentProps) {
	const { tokens } = useTheme();
	return (
		<View
			{...props}
			style={[styles.content, { gap: tokens.spacing[2] }, style]}
		>
			{children}
		</View>
	);
}

export const Empty = Object.assign(EmptyRoot, {
	Header: EmptyHeader,
	Media: EmptyMedia,
	Title: EmptyTitle,
	Description: EmptyDescription,
	Content: EmptyContent,
});

const styles = StyleSheet.create({
	root: {
		alignItems: "center",
		justifyContent: "center",
	},
	fill: {
		flex: 1,
	},
	header: {
		alignItems: "center",
		maxWidth: 320,
	},
	tile: {
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		alignItems: "center",
	},
});
