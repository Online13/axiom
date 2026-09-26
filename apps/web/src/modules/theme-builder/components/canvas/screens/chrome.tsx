// The pieces every Index screen shares: the tab bar, the back bar, the
// wordmark, bylines and the story row. Repeating the same parts is the point:
// a theme change shows up the same way everywhere.

import {
	Bookmark,
	ChevronLeft,
	Compass,
	House,
	User,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Artwork } from "./Artwork";
import { type AuthorId, authors, type Collection, type Story } from "./content";
import { space } from "./space";

const tabs = [
	["home", "Home", House],
	["explore", "Explore", Compass],
	["saved", "Saved", Bookmark],
	["profile", "Profile", User],
] as const;

export type TabId = (typeof tabs)[number][0];

/** The bottom tab bar, pinned over the content so a long screen runs under it. */
export function TabBar({ active }: { active: TabId }) {
	return (
		<div
			className="ax-tabbar"
			style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 16 }}
		>
			{tabs.map(([id, label, Icon]) => (
				<span
					key={id}
					className="ax-tabbar-item"
					data-active={id === active || undefined}
				>
					<Icon
						className="ax-glyph"
						size={24}
						strokeWidth={1.9}
						fill={id === active && id === "saved" ? "currentColor" : "none"}
					/>
					<span>{label}</span>
				</span>
			))}
		</div>
	);
}

/** A pushed screen's bar: back on the left, actions on the right. */
export function AppBar({ title, end }: { title?: string; end?: ReactNode }) {
	return (
		<div className="ax-appbar">
			<span className="ax-appbar-slot">
				<span className="ax-icon-btn">
					<ChevronLeft className="ax-glyph" size={26} strokeWidth={1.9} />
				</span>
			</span>
			<span className="ax-appbar-title">{title}</span>
			<span className="ax-appbar-slot" data-side="end">
				{end}
			</span>
		</div>
	);
}

/** Index has no brand color: its name is set in the heading font, in the text color. */
export const Wordmark = ({ size = 22 }: { size?: number }) => (
	<span
		style={{
			fontFamily: "var(--ax-font-heading)",
			fontSize: size,
			lineHeight: 1,
			fontWeight: 800,
			letterSpacing: "-0.04em",
		}}
	>
		Index.
	</span>
);

/** The small uppercase line over a title: a topic, a kind of page. */
export const Kicker = ({ children }: { children: ReactNode }) => (
	<span
		className="ax-caption ax-link"
		style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}
	>
		{children}
	</span>
);

export function Byline({ author, meta }: { author: AuthorId; meta?: string }) {
	const { name, initials } = authors[author];
	return (
		<span className="ax-row" data-gap="8">
			<span className="ax-avatar" data-size="xs">
				{initials}
			</span>
			<span className="ax-footnote">
				<span className="ax-semibold">{name}</span>
				{meta && <span className="ax-muted"> · {meta}</span>}
			</span>
		</span>
	);
}

/** A story in a list: the same row on Home, Search, Saved and every profile. */
export function StoryRow({
	story,
	detail,
	trailing,
}: {
	story: Story;
	/** Replaces the author line, e.g. a search snippet. */
	detail?: ReactNode;
	trailing?: ReactNode;
}) {
	return (
		<div className="ax-row" data-gap="12" data-align="start">
			<Artwork cover={story.cover} size={72} radius="md" />
			<span className="ax-stack ax-grow" data-gap="4">
				<span className="ax-caption ax-muted">
					{story.topic} · {story.minutes} min
				</span>
				<span className="ax-headline">{story.title}</span>
				<span className="ax-footnote ax-muted">
					{detail ?? authors[story.author].name}
				</span>
			</span>
			{trailing}
		</div>
	);
}

/** Four covers in a square grid: how a collection shows what it holds. */
export function Mosaic({
	collection,
	height,
	radius = "lg",
}: {
	collection: Collection;
	height: number;
	radius?: "sm" | "md" | "lg";
}) {
	return (
		<span
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: space(2),
				height,
				overflow: "hidden",
				borderRadius: `var(--ax-radius-${radius})`,
			}}
		>
			{collection.covers.map((cover) => (
				<Artwork
					key={cover}
					cover={cover}
					size="fill"
					height={(height - 2) / 2}
					radius="none"
				/>
			))}
		</span>
	);
}

/** A selected card or option: the primary color draws its ring. */
export const selected: CSSProperties = {
	boxShadow: "inset 0 0 0 2px var(--ax-primary-default)",
};

/** Onboarding step: where the reader is, and a way out. */
export function Steps({ step, of }: { step: number; of: number }) {
	return (
		<div className="ax-stack" data-gap="8" style={{ padding: space(4, 20, 0) }}>
			<span className="ax-row" data-justify="between">
				<span className="ax-footnote ax-muted">
					Step {step} of {of}
				</span>
				<span className="ax-footnote ax-semibold">Skip</span>
			</span>
			<span className="ax-progress">
				<span style={{ width: `${(step / of) * 100}%` }} />
			</span>
		</div>
	);
}
