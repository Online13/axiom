import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { snackbar } from "@/components/ui/snackbar";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

import { ExperienceScreen, ListRow, Note, fakeRows } from "./shared";

type Row = { id: number; title: string; subtitle: string };

export default function UndoableActionScreen() {
	const { tokens } = useTheme();
	const [rows, setRows] = useState<Row[]>(() => fakeRows(6));
	const [log, setLog] = useState<string[]>([
		"Nothing sent to the server yet.",
	]);
	// Where each archived row came back to, if the user undoes it.
	const pending = useRef(new Map<number, { row: Row; index: number }>());

	const record = (entry: string) =>
		setLog((current) => [entry, ...current].slice(0, 5));

	const archive = (row: Row) => {
		const index = rows.findIndex((item) => item.id === row.id);
		pending.current.set(row.id, { row, index });
		// The row leaves now; the request waits for the snackbar to run out.
		setRows((current) => current.filter((item) => item.id !== row.id));
		record(`“${row.title}” archived locally`);

		snackbar.show({
			message: `${row.title} archived`,
			action: {
				label: "Undo",
				onPress: () => {
					const entry = pending.current.get(row.id);
					if (!entry) return;
					pending.current.delete(row.id);
					setRows((current) => {
						const next = [...current];
						next.splice(entry.index, 0, entry.row);
						return next;
					});
					record(`“${row.title}” put back, nothing sent`);
				},
			},
			onDismiss: (reason) => {
				if (reason === "action") return;
				if (!pending.current.delete(row.id)) return;
				record(`DELETE /items/${row.id} sent (${reason})`);
			},
		});
	};

	return (
		<ExperienceScreen>
			<Note>
				Archive a row. It leaves right away; the request only goes out once
				Undo is out of reach.
			</Note>
			<ScrollView
				contentContainerStyle={{ paddingBottom: tokens.spacing[12] * 2 }}
			>
				{rows.map((row) => (
					<ListRow
						key={row.id}
						title={row.title}
						subtitle={row.subtitle}
						trailing={
							<IconButton
								icon="file"
								variant="ghost"
								accessibilityLabel={`Archive ${row.title}`}
								onPress={() => archive(row)}
							/>
						}
					/>
				))}
				<View
					style={{
						padding: tokens.metrics.screenMargin,
						gap: tokens.spacing[1],
					}}
				>
					<Text variant="footnote" color="muted" weight="semibold">
						SERVER LOG
					</Text>
					{log.map((entry, index) => (
						<Text
							key={`${entry}-${index}`}
							variant="footnote"
							color="muted"
						>
							{entry}
						</Text>
					))}
				</View>
			</ScrollView>
		</ExperienceScreen>
	);
}
