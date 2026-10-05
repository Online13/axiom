import {
	createContext,
	use,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";

type EmptySize = "sm" | "md";
export type EmptyTone = "neutral" | "error";

const SizeContext = createContext<EmptySize>("md");

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

function EmptyRoot({
	children,
	size = "md",
	fill = true,
	style,
	...props
}: EmptyProps) {
	return (
		<SizeContext value={size}>
			<View {...props} style={[styles.root(size, fill), style]}>
				{children}
			</View>
		</SizeContext>
	);
}

export type EmptyHeaderProps = ComponentPropsWithRef<typeof View>;

function EmptyHeader({ children, style, ...props }: EmptyHeaderProps) {
	const size = use(SizeContext);

	return (
		<View
			// Read as one block: "No projects yet. Create one to get started."
			accessible
			{...props}
			style={[styles.header(size), style]}
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
	const size = use(SizeContext);

	return (
		<View {...props} style={[styles.media(size), style]}>
			{children ?? (
				<View style={styles.tile(size, tone)}>
					{icon ? (
						<ThemedIcon
							name={icon}
							size={size === "md" ? "lg" : "md"}
							uniProps={(theme) => ({
								color: theme.components.empty[tone].default.icon,
							})}
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
	return (
		<View {...props} style={[styles.content, style]}>
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

const styles = StyleSheet.create((theme) => ({
	root: (size: EmptySize, fill: boolean) => ({
		alignItems: "center",
		justifyContent: "center",
		gap: theme.tokens.spacing[size === "md" ? 6 : 4],
		padding: theme.tokens.spacing[size === "md" ? 8 : 4],
		...(fill && { flex: 1 }),
	}),
	header: (size: EmptySize) => ({
		alignItems: "center",
		maxWidth: 320,
		gap: theme.tokens.spacing[size === "md" ? 2 : 1],
	}),
	media: (size: EmptySize) => ({
		marginBottom: theme.tokens.spacing[size === "md" ? 3 : 2],
	}),
	tile: (size: EmptySize, tone: EmptyTone) => {
		const tile = size === "md" ? 64 : 48;
		return {
			alignItems: "center",
			justifyContent: "center",
			width: tile,
			height: tile,
			borderRadius: tile / 2,
			backgroundColor: theme.components.empty[tone].default.media,
		};
	},
	content: {
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
}));
