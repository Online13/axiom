import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

import { ExperienceScreen, ListRow, Note, fakeRows } from "./shared";

const PAGE_SIZE = 12;
const LAST_PAGE = 3;

type Status = "idle" | "loading" | "error" | "done";

export default function PaginationScreen() {
	const { tokens } = useTheme();
	const [rows, setRows] = useState(() => fakeRows(PAGE_SIZE));
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<Status>("idle");
	const [failNext, setFailNext] = useState(false);

	const loadNext = useCallback(async () => {
		// Only one request in flight, and nothing left to ask for once the list is done.
		if (status === "loading" || status === "done") return;
		setStatus("loading");
		await new Promise((resolve) => setTimeout(resolve, 700));

		if (failNext) {
			setFailNext(false);
			setStatus("error");
			return;
		}

		const next = page + 1;
		setRows((current) => [
			...current,
			...fakeRows(PAGE_SIZE, current.length),
		]);
		setPage(next);
		setStatus(next >= LAST_PAGE ? "done" : "idle");
	}, [failNext, page, status]);

	return (
		<ExperienceScreen>
			<Note>
				The next page starts loading one screen before the end. Page {page}{" "}
				of {LAST_PAGE}.
			</Note>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					padding: tokens.metrics.screenMargin,
					gap: tokens.spacing[3],
				}}
			>
				<Text variant="bodySm">Fail next request</Text>
				<Switch
					value={failNext}
					onValueChange={setFailNext}
					accessibilityLabel="Fail next request"
				/>
			</View>
			<FlatList
				data={rows}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item }) => (
					<ListRow title={item.title} subtitle={item.subtitle} />
				)}
				// Scrolling never retries a failed page: only the button does.
				onEndReached={status === "error" ? undefined : loadNext}
				onEndReachedThreshold={1}
				contentContainerStyle={{ paddingBottom: tokens.spacing[12] * 2 }}
				ListFooterComponent={
					<View
						style={{
							padding: tokens.spacing[6],
							gap: tokens.spacing[3],
							alignItems: "center",
						}}
					>
						{status === "loading" ? (
							<Spinner label="Loading more orders" />
						) : null}
						{status === "error" ? (
							<>
								<Text variant="bodySm" color="error" align="center">
									Couldn&apos;t load more orders.
								</Text>
								<Button
									variant="outline"
									size="sm"
									onPress={() => {
										setStatus("idle");
										loadNext();
									}}
								>
									Try again
								</Button>
							</>
						) : null}
						{status === "done" ? (
							<Text variant="footnote" color="muted">
								That&apos;s everything.
							</Text>
						) : null}
					</View>
				}
			/>
		</ExperienceScreen>
	);
}
