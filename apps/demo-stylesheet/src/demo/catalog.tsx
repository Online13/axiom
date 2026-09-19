import { router, type Href } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Item } from "@/components/ui/item";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

/** A titled card of rows, the shape both catalogue tabs use. */
export function CatalogGroup({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	const { tokens, colors } = useTheme();

	return (
		<View style={{ gap: tokens.spacing[2] }}>
			<Text
				variant="footnote"
				color="muted"
				weight="semibold"
				style={{ paddingHorizontal: tokens.spacing[4] }}
			>
				{title.toUpperCase()}
			</Text>
			<View
				style={{
					overflow: "hidden",
					borderRadius: tokens.radius.lg,
					borderWidth: tokens.metrics.hairline,
					borderColor: colors.border.default,
					backgroundColor: colors.background.elevated,
				}}
			>
				{children}
			</View>
		</View>
	);
}

export type CatalogRowProps = {
	href: string;
	title: string;
	description: string;
	/** Short status next to the title, such as `Spec`. */
	badge?: string;
	/** `false` on the last row of a group. */
	divider?: boolean;
};

export function CatalogRow({
	href,
	title,
	description,
	badge,
	divider = true,
}: CatalogRowProps) {
	const { tokens } = useTheme();

	return (
		<Item
			accessibilityRole="link"
			accessibilityLabel={`${title}. ${description}`}
			size="lg"
			divider={divider}
			align="center"
			onPress={() => router.push(href as Href)}
		>
			<Item.Content>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: tokens.spacing[2],
					}}
				>
					<Item.Title>{title}</Item.Title>
					{badge ? <Badge size="sm">{badge}</Badge> : null}
				</View>
				<Item.Description numberOfLines={2}>{description}</Item.Description>
			</Item.Content>
			<Item.Trailing>
				<Icon name="chevron-right" size="sm" color="muted" />
			</Item.Trailing>
		</Item>
	);
}
