import {
	createContext,
	use,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { IconName } from "@/components/ui/icons";
import { Text, type TextProps } from "@/components/ui/text";
import { Title, type TitleProps } from "@/components/ui/title";

import { EmptyIcon, useEmptyStyles } from "./empty.styles";

export type EmptySize = "sm" | "md";

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
	...props
}: EmptyProps) {
	const styles = useEmptyStyles();

	return (
		<SizeContext value={size}>
			<View {...props} {...styles.root(size, fill, props)}>
				{children}
			</View>
		</SizeContext>
	);
}

export type EmptyHeaderProps = ComponentPropsWithRef<typeof View>;

function EmptyHeader({ children, ...props }: EmptyHeaderProps) {
	const styles = useEmptyStyles();
	const size = use(SizeContext);

	return (
		<View
			// Read as one block: "No projects yet. Create one to get started."
			accessible
			{...props}
			{...styles.header(size, props)}
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
	...props
}: EmptyMediaProps) {
	const styles = useEmptyStyles();
	const size = use(SizeContext);

	return (
		<View {...props} {...styles.media(size, props)}>
			{children ?? (
				<View {...styles.tile(size, tone)}>
					{icon ? (
						<EmptyIcon
							name={icon}
							size={size === "md" ? "lg" : "md"}
							{...styles.tint(tone)}
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

function EmptyContent({ children, ...props }: EmptyContentProps) {
	const styles = useEmptyStyles();

	return (
		<View {...props} {...styles.content(props)}>
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
