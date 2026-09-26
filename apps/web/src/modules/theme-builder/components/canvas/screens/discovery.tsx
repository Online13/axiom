// Discovery: Home is balanced and picture-led, Explore denser with mixed
// ratios, Search a real query with every kind of result.

import { Bell, ChevronRight, Search as SearchIcon, X } from "lucide-react";
import { Artwork } from "./Artwork";
import { Byline, Kicker, Mosaic, StoryRow, TabBar } from "./chrome";
import { authors, collections, reader, stories } from "./content";
import { space } from "./space";

/** Home's layout, shared with its loading skeleton so both keep one shape. */
export const home = {
	lead: 176,
	thumb: 56,
	card: { width: 150, image: 84 },
} as const;

export function Home() {
	const lead = stories.quiet;
	const current = stories.treeline;
	return (
		<>
			<div className="ax-row" data-justify="between" style={{ padding: space(4, 20, 0) }}>
				<span className="ax-stack" style={{ gap: 0 }}>
					<span className="ax-footnote ax-muted">Saturday 26 September</span>
					<span className="ax-title2">Good morning, Sam</span>
				</span>
				<span className="ax-row" data-gap="4">
					<span className="ax-anchor">
						<span className="ax-icon-btn">
							<Bell className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
						<span className="ax-badge" data-kind="dot" style={{ top: 10, right: 10 }} />
					</span>
					<span className="ax-avatar" data-size="sm">
						{reader.initials}
					</span>
				</span>
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(20, 20, 0) }}>
				<span className="ax-title3">For you</span>
				<Artwork cover={lead.cover} size="fill" height={home.lead} radius="lg" label="A hand drawing a floor plan in ink" />
				<span style={{ marginTop: space(4) }}>
					<Kicker>{lead.topic}</Kicker>
				</span>
				<span className="ax-title2">{lead.title}</span>
				<Byline author={lead.author} meta={`${lead.minutes} min read`} />
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(24, 20, 0) }}>
				<span className="ax-headline">Continue reading</span>
				<div className="ax-card" data-variant="outlined">
					<div className="ax-row" data-gap="12" style={{ padding: space(10) }}>
						<Artwork cover={current.cover} size={home.thumb} radius="sm" />
						<span className="ax-stack ax-grow" data-gap="8">
							<span className="ax-subhead ax-semibold ax-truncate">{current.title}</span>
							<span className="ax-row" data-gap="8">
								<span className="ax-progress ax-grow">
									<span style={{ width: "62%" }} />
								</span>
								<span className="ax-caption ax-muted">3 min left</span>
							</span>
						</span>
					</div>
				</div>
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(24, 0, 0) }}>
				<span className="ax-row" data-justify="between" style={{ padding: space(0, 20) }}>
					<span className="ax-headline">Recommended</span>
					<span className="ax-footnote ax-link">See all</span>
				</span>
				<div className="ax-carousel" style={{ padding: space(0, 20) }}>
					{[stories.tide, stories.presses, stories.kyoto].map((story) => (
						<span key={story.title} className="ax-stack" data-gap="8" style={{ width: home.card.width }}>
							<Artwork cover={story.cover} size="fill" height={home.card.image} radius="md" />
							<span className="ax-subhead ax-semibold">{story.title}</span>
						</span>
					))}
				</div>
			</div>

			<TabBar active="home" />
		</>
	);
}

const categories = ["For you", "Design", "Architecture", "Cities", "Culture"];

export function Explore() {
	const [big, top, bottom] = [stories.slowCity, stories.rooms, stories.presses];
	return (
		<>
			<div className="ax-stack" data-gap="12" style={{ padding: space(4, 20, 0) }}>
				<span className="ax-large-title">Explore</span>
				<span className="ax-searchbar">
					<SearchIcon className="ax-glyph" size={18} strokeWidth={2} />
					<span className="ax-placeholder">Stories, people, collections</span>
				</span>
			</div>

			<div className="ax-tabs" data-variant="pill" style={{ padding: space(16, 20, 0), overflow: "hidden" }}>
				{categories.map((category, i) => (
					<span key={category} data-active={i === 0 || undefined}>
						{category}
					</span>
				))}
			</div>

			<div className="ax-row" data-justify="between" style={{ padding: space(24, 20, 12) }}>
				<span className="ax-title3">Trending</span>
				<span className="ax-footnote ax-link">See all</span>
			</div>
			<div className="ax-row" data-gap="12" data-align="start" style={{ padding: space(0, 20) }}>
				<span className="ax-stack" data-gap="8" style={{ flex: 1.25, minWidth: 0 }}>
					<Artwork cover={big.cover} size="fill" height={236} radius="lg" label="A tram crossing an old city square" />
					<Kicker>{big.topic}</Kicker>
					<span className="ax-headline">{big.title}</span>
					<span className="ax-caption ax-muted">
						{authors[big.author].name} · {big.minutes} min
					</span>
				</span>
				<span className="ax-stack" data-gap="12" style={{ flex: 1, minWidth: 0 }}>
					{[top, bottom].map((story) => (
						<span key={story.title} className="ax-stack" data-gap="8">
							<Artwork cover={story.cover} size="fill" height={96} radius="lg" />
							<span className="ax-subhead ax-semibold">{story.title}</span>
						</span>
					))}
				</span>
			</div>

			<div className="ax-row" data-justify="between" style={{ padding: space(24, 20, 12) }}>
				<span className="ax-title3">Collections</span>
				<ChevronRight className="ax-glyph ax-subtle" size={20} />
			</div>
			<div className="ax-carousel" style={{ padding: space(0, 20) }}>
				{Object.values(collections).map((collection) => (
					<span key={collection.title} className="ax-stack" data-gap="8" style={{ width: 140 }}>
						<Mosaic collection={collection} height={112} radius="md" />
						<span className="ax-stack" style={{ gap: 0 }}>
							<span className="ax-subhead ax-semibold ax-truncate">{collection.title}</span>
							<span className="ax-caption ax-muted">{collection.count} stories</span>
						</span>
					</span>
				))}
			</div>

			<TabBar active="explore" />
		</>
	);
}

/** Search text with the query words set apart. */
const Snippet = ({ before, after }: { before: string; after: string }) => (
	<>
		{before}
		<span className="ax-highlight">interface design</span>
		{after}
	</>
);

export function Search() {
	const noor = authors.noor;
	return (
		<>
			<div className="ax-row" data-gap="12" style={{ padding: space(4, 16, 0) }}>
				<span className="ax-searchbar">
					<SearchIcon className="ax-glyph" size={18} strokeWidth={2} />
					<span className="ax-value ax-caret">interface design</span>
					<span className="ax-search-clear">
						<X size={12} strokeWidth={3} />
					</span>
				</span>
				<span className="ax-subhead ax-link">Cancel</span>
			</div>

			<div className="ax-tabs" style={{ marginTop: space(12) }}>
				<span data-active>All</span>
				<span>Stories</span>
				<span>People</span>
				<span>Collections</span>
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(16, 20, 0) }}>
				<span className="ax-caption ax-muted">TOP RESULTS · 48</span>
				<StoryRow
					story={stories.quiet}
					detail={<Snippet before="…calm " after=" starts with fewer things on screen." />}
				/>
				<div className="ax-separator" data-variant="subtle" />

				<div className="ax-row" data-gap="12">
					<span className="ax-avatar" data-size="lg">
						{noor.initials}
					</span>
					<span className="ax-stack ax-grow" style={{ gap: space(2) }}>
						<span className="ax-headline">{noor.name}</span>
						<span className="ax-footnote ax-muted">
							Writes about <span className="ax-highlight">interface design</span>
						</span>
					</span>
					<span className="ax-btn" data-variant="outline" data-size="sm">
						Follow
					</span>
				</div>
				<div className="ax-separator" data-variant="subtle" />

				<div className="ax-row" data-gap="12">
					<span style={{ width: 72, flex: "none" }}>
						<Mosaic collection={collections.calm} height={72} radius="md" />
					</span>
					<span className="ax-stack ax-grow" data-gap="4">
						<span className="ax-caption ax-muted">Collection · {collections.calm.count} stories</span>
						<span className="ax-headline">{collections.calm.title}</span>
						<span className="ax-footnote ax-muted">Curated by {noor.name}</span>
					</span>
				</div>
				<div className="ax-separator" data-variant="subtle" />

				<StoryRow
					story={stories.materials}
					detail={<Snippet before="Wood and paper in " after="." />}
				/>
			</div>

			<TabBar active="explore" />
		</>
	);
}
