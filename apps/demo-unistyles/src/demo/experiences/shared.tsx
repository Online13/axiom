import type { ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { AppBar } from "@/components/ui/app-bar";
import { Scaffold } from "@/components/ui/scaffold";
import { Text } from "@/components/ui/text";
import { BackButton, useRouteTitle } from "@/demo/screen";

export type ExperienceScreenProps = {
	children: ReactNode;
	title?: string;
	/** Actions on the right of the bar. */
	actions?: ReactNode;
	/** Replaces the whole bar, for the screens that animate it. */
	appBar?: ReactNode;
	background?: "default" | "subtle";
};

/** A behavior or pattern screen: the demo chrome, and the body left free to do its thing. */
export function ExperienceScreen({
	children,
	title,
	actions,
	appBar,
	background = "subtle",
}: ExperienceScreenProps) {
	// The bar takes its background as a prop, not as a style.
	const { theme } = useUnistyles();
	const routeTitle = useRouteTitle("Experience");

	return (
		<Scaffold
			background={background}
			safeAreaEdges={["top"]}
			keyboardAvoiding={false}
		>
			{appBar ?? (
				<AppBar
					safeArea={false}
					bordered
					backgroundColor={theme.colors.background[background]}
				>
					<AppBar.Leading>
						<BackButton />
					</AppBar.Leading>
					<AppBar.Title>{title ?? routeTitle}</AppBar.Title>
					{actions ? <AppBar.Actions>{actions}</AppBar.Actions> : null}
				</AppBar>
			)}
			{children}
		</Scaffold>
	);
}

/** One line of explanation under the bar, or a live read-out at the bottom of a demo. */
export function Note({ children }: { children: ReactNode }) {
	return (
		<View style={styles.note}>
			<Text variant="footnote" color="muted">
				{children}
			</Text>
		</View>
	);
}

/** A row-shaped placeholder used by the list demos. */
export function ListRow({
	title,
	subtitle,
	trailing,
	selected = false,
	onPress,
	onLongPress,
}: {
	title: string;
	subtitle?: string;
	trailing?: ReactNode;
	selected?: boolean;
	onPress?: () => void;
	onLongPress?: () => void;
}) {
	const content = (
		<>
			<View style={styles.rowText}>
				<Text weight="medium">{title}</Text>
				{subtitle ? (
					<Text variant="bodySm" color="muted" numberOfLines={1}>
						{subtitle}
					</Text>
				) : null}
			</View>
			{trailing}
		</>
	);

	const style = styles.row(selected);

	if (onPress || onLongPress) {
		return (
			<Tappable
				accessibilityLabel={title}
				accessibilityState={{ selected }}
				onPress={onPress}
				onLongPress={onLongPress}
				style={style}
			>
				{content}
			</Tappable>
		);
	}

	return <View style={style}>{content}</View>;
}

/** Deterministic filler, so a demo list always reads the same. */
export function fakeRows(count: number, offset = 0) {
	const subjects = [
		"Weekly report",
		"Invoice #4021",
		"Design review",
		"Trip to Lisbon",
		"Server maintenance",
		"New teammate",
		"Payment received",
		"Storage almost full",
	];

	return Array.from({ length: count }, (_, index) => {
		const id = offset + index;
		return {
			id,
			title: subjects[id % subjects.length],
			subtitle: `Updated ${(id % 12) + 1} min ago`,
		};
	});
}

const styles = StyleSheet.create((theme) => ({
	note: {
		paddingHorizontal: theme.tokens.metrics.screenMargin,
		paddingVertical: theme.tokens.spacing[3],
		backgroundColor: theme.colors.background.elevated,
		borderBottomWidth: theme.tokens.metrics.hairline,
		borderBottomColor: theme.colors.border.subtle,
	},
	rowText: { flex: 1, gap: 2 },
	row: (selected: boolean) => ({
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
		paddingHorizontal: theme.tokens.metrics.screenMargin,
		paddingVertical: theme.tokens.spacing[3],
		backgroundColor: selected
			? theme.colors.background.subtle
			: theme.colors.background.elevated,
		borderBottomWidth: theme.tokens.metrics.hairline,
		borderBottomColor: theme.colors.border.subtle,
	}),
}));
