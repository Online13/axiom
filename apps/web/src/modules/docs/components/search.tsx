"use client";
import {
	SearchDialog,
	SearchDialogClose,
	SearchDialogContent,
	SearchDialogHeader,
	SearchDialogIcon,
	SearchDialogInput,
	SearchDialogList,
	SearchDialogOverlay,
	type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { type SearchClient, useDocsSearch } from "fumadocs-core/search/client";
import { staticClient } from "fumadocs-core/search/client/orama-static";
import type { SortedResult } from "fumadocs-core/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

// The full-text score ignores page titles: "app-bar" splits into "app" + "bar",
// so pages repeating those words outrank AppBar itself. Put pages whose slug
// matches the query first, keeping the engine's order otherwise.
function slugRank(url: string, query: string) {
	const slug = normalize(url.split(/[#?]/)[0].split("/").pop() ?? "");
	if (slug === query) return 0;
	if (slug.startsWith(query)) return 1;
	if (slug.includes(query)) return 2;
	return 3;
}

function rankBySlug(results: SortedResult[], rawQuery: string) {
	const query = normalize(rawQuery);
	if (!query) return results;
	const groups: SortedResult[][] = [];
	for (const item of results) {
		if (item.type === "page" || groups.length === 0) groups.push([item]);
		else groups[groups.length - 1].push(item);
	}
	return groups
		.map((group) => ({ group, rank: slugRank(group[0].url, query) }))
		.sort((a, b) => a.rank - b.rank)
		.flatMap(({ group }) => group);
}

function rankedClient(client: SearchClient): SearchClient {
	return {
		deps: client.deps,
		async search(query) {
			return rankBySlug(await client.search(query), query);
		},
	};
}

export default function DefaultSearchDialog(props: SharedProps) {
	const { locale } = useI18n(); // (optional) for i18n
	const { search, setSearch, query } = useDocsSearch({
		client: rankedClient(staticClient({ locale })),
	});

	return (
		<SearchDialog
			search={search}
			onSearchChange={setSearch}
			isLoading={query.isLoading}
			{...props}
		>
			<SearchDialogOverlay />
			<SearchDialogContent>
				<SearchDialogHeader>
					<SearchDialogIcon />
					<SearchDialogInput />
					<SearchDialogClose />
				</SearchDialogHeader>
				<SearchDialogList
					items={query.data !== "empty" ? query.data : null}
				/>
			</SearchDialogContent>
		</SearchDialog>
	);
}
