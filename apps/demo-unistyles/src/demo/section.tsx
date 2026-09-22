import { createContext, useContext, type ReactNode } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";

type SectionProps = {
	title: string;
	description?: string;
	children: ReactNode;
};

const SectionFilter = createContext<readonly string[] | null>(null);

/** Selects the examples shown by a component route. */
export function SectionScope({
	titles,
	children,
}: {
	titles?: readonly string[];
	children: ReactNode;
}) {
	return <SectionFilter value={titles ?? null}>{children}</SectionFilter>;
}

export function Section({ title, description, children }: SectionProps) {
	const visible = useContext(SectionFilter);

	if (visible && !visible.includes(title)) return null;

	return (
		<View style={styles.section}>
			<View style={styles.heading}>
				<Title>{title}</Title>
				{description ? (
					<Text variant="bodySm" color="muted">
						{description}
					</Text>
				) : null}
			</View>
			{children}
		</View>
	);
}

export function Label({
	children,
	muted,
}: {
	children: ReactNode;
	muted?: boolean;
}) {
	return (
		<Text variant="caption" color={muted ? "muted" : "default"}>
			{children}
		</Text>
	);
}

/** A surface on `background.elevated`, like a card. */
export function Panel({ children }: { children: ReactNode }) {
	return <View style={styles.panel}>{children}</View>;
}

/** A label on the left, a control on the right. */
export function Row({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<View style={styles.row}>
			<View style={styles.rowLabel}>
				<Text>{label}</Text>
				{description ? (
					<Text variant="footnote" color="muted">
						{description}
					</Text>
				) : null}
			</View>
			{children}
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	section: { gap: theme.tokens.spacing[3] },
	heading: { gap: theme.tokens.spacing[1] },
	panel: {
		overflow: "hidden",
		padding: theme.tokens.spacing[4],
		gap: theme.tokens.spacing[3],
		borderRadius: theme.tokens.radius.lg,
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.default,
		backgroundColor: theme.colors.background.elevated,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
	},
	rowLabel: { flex: 1, gap: 2 },
}));
