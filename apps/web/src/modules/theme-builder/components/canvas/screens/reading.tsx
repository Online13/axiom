// Content: the article is the reference for type — hierarchy, line height,
// measure, text colors. The collection and the author page repeat the story
// parts with a different rhythm.

import {
	Bell,
	Bookmark,
	ChevronLeft,
	Ellipsis,
	Share2,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Artwork } from "./Artwork";
import { AppBar, Kicker, StoryRow } from "./chrome";
import { authors, collections, stories } from "./content";
import { space } from "./space";

const body: CSSProperties = { margin: 0, fontSize: 17, lineHeight: "27px" };

/** A collection's running order, set light in the heading font. */
const numeral: CSSProperties = {
	fontFamily: "var(--ax-font-heading)",
	fontSize: 28,
	lineHeight: "30px",
	fontWeight: 300,
	color: "var(--ax-content-link)",
};

/** The article page, also drawn behind the "Save to collection" sheet. */
export function Article() {
	const story = stories.quiet;
	const author = authors[story.author];
	return (
		<>
			<div className="ax-row" data-justify="between" style={{ padding: space(0, 8, 6) }}>
				<span className="ax-icon-btn">
					<ChevronLeft className="ax-glyph" size={26} strokeWidth={1.9} />
				</span>
				<span className="ax-row" style={{ gap: 0 }}>
					<span className="ax-icon-btn">
						<Bookmark className="ax-glyph" size={21} strokeWidth={1.9} />
					</span>
					<span className="ax-icon-btn">
						<Share2 className="ax-glyph" size={21} strokeWidth={1.9} />
					</span>
					<span className="ax-icon-btn">
						<Ellipsis className="ax-glyph" size={22} strokeWidth={1.9} />
					</span>
				</span>
			</div>
			<div className="ax-progress" style={{ height: 3, borderRadius: 0 }}>
				<span style={{ width: "18%" }} />
			</div>

			<Artwork cover={story.cover} size="fill" height={210} radius="none" label="A hand drawing a floor plan in ink" />
			<span className="ax-caption ax-subtle" style={{ padding: space(8, 24, 0) }}>
				Plans for a reading room with one door and no clocks.
			</span>

			<div className="ax-stack" data-gap="12" style={{ padding: space(20, 24, 0) }}>
				<Kicker>Essay · {story.topic}</Kicker>
				<span className="ax-large-title" style={{ fontSize: 32, lineHeight: "36px" }}>
					{story.title}
				</span>
				<span
					style={{
						fontFamily: "var(--ax-font-heading)",
						fontSize: 19,
						lineHeight: "26px",
						color: "var(--ax-content-muted)",
					}}
				>
					The best interfaces don't compete for your eyes. They wait, and
					they're there when you need them.
				</span>
				<span className="ax-row" data-gap="12" style={{ paddingTop: space(4) }}>
					<span className="ax-avatar" data-size="sm">
						{author.initials}
					</span>
					<span className="ax-stack" style={{ gap: 0 }}>
						<span className="ax-footnote ax-semibold">{author.name}</span>
						<span className="ax-caption ax-muted">
							26 Sept 2026 · {story.minutes} min read
						</span>
					</span>
				</span>
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(20, 24, 0) }}>
				<div className="ax-separator" />
				<p style={body}>
					Most screens are built to be noticed. Badges count up, banners slide
					in, and every surface asks for a second of your time. Added together,
					those seconds are most of a day.
				</p>
				<span className="ax-title3">Calm is a layout decision</span>
				<p style={body}>
					Quiet interfaces start with fewer things on screen, not smaller ones:
					one action per view, generous margins, and type set for reading
					rather than scanning.
				</p>
				<blockquote
					className="ax-stack"
					data-gap="8"
					style={{
						margin: space(4, 0),
						padding: space(2, 0, 2, 16),
						borderLeft: "3px solid var(--ax-highlight-default)",
					}}
				>
					<span className="ax-title3">
						“A good tool disappears into the work. You notice it when it's
						missing.”
					</span>
					<span className="ax-caption ax-muted">MIRA HOUTMAN, DESIGNER</span>
				</blockquote>
				<Artwork cover="stones" size="fill" height={150} radius="md" />
				<span className="ax-caption ax-muted">
					Stone, wood and paper: the materials Haddad calls quiet by default.
				</span>
			</div>
		</>
	);
}

export function CollectionDetail() {
	const collection = collections.calm;
	const curator = authors.noor;
	const [lead, ...rest] = [stories.quiet, stories.materials, stories.rooms, stories.tide];
	return (
		<>
			<div style={{ position: "relative", padding: space(0, 16) }}>
				<Artwork cover="cabin" size="fill" height={220} radius="xl" label="A small timber cabin in the woods" />
				<span
					className="ax-icon-btn"
					style={{
						position: "absolute",
						top: 12,
						left: 28,
						background: "var(--ax-background-elevated)",
						boxShadow: "var(--ax-shadow)",
					}}
				>
					<ChevronLeft className="ax-glyph" size={24} strokeWidth={1.9} />
				</span>
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(20, 20, 0) }}>
				<Kicker>Collection · {collection.count} stories</Kicker>
				<span className="ax-title1">{collection.title}</span>
				<span className="ax-subhead ax-muted">
					Twelve essays on screens that respect your attention, from type to
					notifications.
				</span>
				<span className="ax-row" data-gap="8" style={{ paddingTop: space(4) }}>
					<span className="ax-avatar" data-size="xs">
						{curator.initials}
					</span>
					<span className="ax-footnote ax-muted">
						Curated by <span className="ax-semibold" style={{ color: "var(--ax-content-default)" }}>{curator.name}</span>
					</span>
				</span>
			</div>

			<div className="ax-row" data-gap="8" style={{ padding: space(16, 20, 0) }}>
				<span className="ax-btn" data-variant="outline" style={{ flex: 1 }}>
					<Bookmark className="ax-glyph" size={18} strokeWidth={2} />
					Save collection
				</span>
				<span className="ax-icon-btn" data-variant="outline">
					<Share2 className="ax-glyph" size={20} strokeWidth={1.9} />
				</span>
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(24, 20, 0) }}>
				<div className="ax-row" data-gap="12" data-align="start">
					<span
						style={numeral}
					>
						01
					</span>
					<span className="ax-stack ax-grow" data-gap="8">
						<Artwork cover={lead.cover} size="fill" height={120} radius="md" />
						<span className="ax-title3">{lead.title}</span>
						<span className="ax-caption ax-muted">
							{authors[lead.author].name} · {lead.minutes} min
						</span>
					</span>
				</div>
				{rest.map((story, i) => (
					<div key={story.title} className="ax-stack" data-gap="16">
						<div className="ax-separator" data-variant="subtle" />
						<div className="ax-row" data-gap="12" data-align="start">
							<span
								style={numeral}
							>
								0{i + 2}
							</span>
							<span className="ax-stack ax-grow" data-gap="4">
								<span className="ax-headline">{story.title}</span>
								<span className="ax-caption ax-muted">
									{authors[story.author].name} · {story.minutes} min
								</span>
							</span>
							<Artwork cover={story.cover} size={56} radius="sm" />
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export function Author() {
	const author = authors.noor;
	return (
		<>
			<AppBar
				end={
					<span className="ax-icon-btn">
						<Ellipsis className="ax-glyph" size={22} strokeWidth={1.9} />
					</span>
				}
			/>
			<div className="ax-stack" data-gap="12" style={{ padding: space(4, 24, 0), alignItems: "center", textAlign: "center" }}>
				<span className="ax-avatar" data-size="xl">
					{author.initials}
				</span>
				<span className="ax-stack" style={{ gap: space(2) }}>
					<span className="ax-title2">{author.name}</span>
					<span className="ax-footnote ax-muted">{author.role}</span>
				</span>
				<span className="ax-subhead">{author.bio}</span>
				<span className="ax-row" data-gap="16" style={{ padding: space(4, 0) }}>
					{[
						["84", "Stories"],
						["6", "Collections"],
						["12.4k", "Followers"],
					].map(([value, label], i) => (
						<span key={label} className="ax-row" data-gap="16">
							{i > 0 && <span className="ax-separator" data-orientation="vertical" />}
							<span className="ax-stack" style={{ gap: 0 }}>
								<span className="ax-headline">{value}</span>
								<span className="ax-caption ax-muted">{label}</span>
							</span>
						</span>
					))}
				</span>
				<span className="ax-row" data-gap="8" style={{ alignSelf: "stretch" }}>
					<span className="ax-btn" style={{ flex: 1 }}>
						Follow
					</span>
					<span className="ax-icon-btn" data-variant="outline">
						<Bell className="ax-glyph" size={20} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div className="ax-tabs" style={{ marginTop: space(20) }}>
				<span data-active>Stories</span>
				<span>Collections</span>
				<span>About</span>
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(16, 20, 0) }}>
				<StoryRow story={stories.quiet} detail="2 days ago" />
				<div className="ax-separator" data-variant="subtle" />
				<StoryRow story={stories.materials} detail="Last week" />
				<div className="ax-separator" data-variant="subtle" />
				<StoryRow story={stories.treeline} detail="With Jonas Vey · Sept 12" />
			</div>
		</>
	);
}
