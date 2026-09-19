import { createContext, useContext, type ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

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
	const { tokens } = useTheme();

	if (visible && !visible.includes(title)) return null;

	return (
		<View style={{ gap: tokens.spacing[3] }}>
			<View style={{ gap: tokens.spacing[1] }}>
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
	const { tokens, colors } = useTheme();

	return (
		<View
			style={{
				overflow: "hidden",
				padding: tokens.spacing[4],
				gap: tokens.spacing[3],
				borderRadius: tokens.radius.lg,
				borderWidth: tokens.metrics.hairline,
				borderColor: colors.border.default,
				backgroundColor: colors.background.elevated,
			}}
		>
			{children}
		</View>
	);
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
	const { tokens } = useTheme();

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: tokens.spacing[3],
			}}
		>
			<View style={{ flex: 1, gap: 2 }}>
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
