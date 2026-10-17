import { Children, type ReactNode } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { toast } from "@/components/ui/toast";

/** A press handler that only says what it would do. */
export const notify = (title: string) => () => toast.show({ title });

/**
 * Cards side by side, scrolling past the screen margins.
 * A FlatList, so it nests as a child list instead of inside a plain ScrollView.
 */
export function Rail({ children }: { children: ReactNode }) {
	const { width } = useWindowDimensions();
	const {
		theme: { tokens },
	} = useUnistyles();

	return (
		<FlatList
			horizontal
			data={Children.toArray(children)}
			renderItem={({ item }) => <>{item}</>}
			showsHorizontalScrollIndicator={false}
			style={{ marginHorizontal: -tokens.metrics.screenMargin }}
			contentContainerStyle={{
				paddingStart: tokens.metrics.screenMargin,
				// Room past the last card, so the rail never stops on a wall.
				paddingEnd: tokens.metrics.screenMargin + width / 2,
				gap: tokens.spacing[3],
			}}
		/>
	);
}

/** Cards sharing a row equally: give each `style={{ flex: 1 }}`. */
export function Columns({ children }: { children: ReactNode }) {
	const {
		theme: { tokens },
	} = useUnistyles();

	return (
		<View style={{ flexDirection: "row", gap: tokens.spacing[3] }}>
			{children}
		</View>
	);
}

/** Rows on a surface, like a list screen. */
export function List({ children }: { children: ReactNode }) {
	const {
		theme: { tokens, colors },
	} = useUnistyles();

	return (
		<View
			style={{
				overflow: "hidden",
				paddingVertical: tokens.spacing[1],
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

/** Full-bleed content, for pieces that own the screen margins. */
export function Bleed({ children }: { children: ReactNode }) {
	const {
		theme: { tokens, colors },
	} = useUnistyles();

	return (
		<View
			style={{
				marginHorizontal: -tokens.metrics.screenMargin,
				paddingVertical: tokens.spacing[2],
				borderTopWidth: tokens.metrics.hairline,
				borderBottomWidth: tokens.metrics.hairline,
				borderColor: colors.border.default,
				backgroundColor: colors.background.default,
			}}
		>
			{children}
		</View>
	);
}
