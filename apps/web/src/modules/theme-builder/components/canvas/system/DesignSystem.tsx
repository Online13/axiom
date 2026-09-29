// Design system board: one large sheet of Index's components, laid out like a
// design-system presentation — five columns of tiles on a tinted page. Every
// tile is drawn with the same `.ax-*` primitives as the phones, so colors,
// fonts, radius, control shape and density all follow the theme. It is a
// picture, not an app: nothing in it is focusable.
//
// The board shows how far Axiom's pieces go, not everything a UI kit could
// draw. A tile earns its place when:
// 1. it is a primitive or a composition Axiom ships, never a widget made up
//    for the picture;
// 2. it tells Index's story, with the people and stories of `content.ts`;
// 3. it shows a primitive or a combination no other tile shows;
// 4. every color, radius, font and spacing comes from the theme.

import {
	Bell,
	Bold,
	Bookmark,
	CalendarClock,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	FileDown,
	FilePen,
	Flame,
	Headphones,
	Highlighter,
	Italic,
	Link2,
	Minus,
	Pencil,
	Plus,
	Quote,
	RefreshCw,
	Rows2,
	Rows3,
	Rows4,
	Share2,
	Sparkles,
	Trash2,
	Type,
	Upload,
	Users,
	WifiOff,
	X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Artwork } from "../screens/Artwork";
import { Wordmark } from "../screens/chrome";
import {
	authors,
	collections,
	reader,
	stories,
	type Story,
} from "../screens/content";
import { space } from "../screens/space";

/** A white sheet on the tinted page: the unit every column stacks. */
function Tile({
	children,
	gap = 16,
	pad = 20,
}: {
	children: ReactNode;
	gap?: number;
	pad?: number;
}) {
	return (
		<div
			className="ax-card tb-ds__tile"
			style={{ gap: space(gap), padding: space(pad) }}
		>
			{children}
		</div>
	);
}

/* ---------- Column 1: brand and stories ---------- */

function Brand() {
	return (
		<Tile gap={20} pad={24}>
			<span className="ax-row" data-justify="between">
				<span className="tb-ds__logo">
					<Wordmark size={30} />
				</span>
				<span className="ax-btn" data-variant="outline" data-size="sm">
					<Upload className="ax-glyph" size={16} strokeWidth={2} />
					Update logo
				</span>
			</span>
			<span className="ax-stack" data-gap="8">
				<span className="ax-title1">Index</span>
				<span className="ax-subhead ax-muted">
					A quiet place for the stories worth keeping. Save what you read,
					sort it into collections and come back to it when there is time.
				</span>
			</span>
			<span className="ax-row">
				<span className="ax-badge">Reading</span>
				<span className="ax-badge" data-variant="outline">
					v2.5 beta
				</span>
			</span>
		</Tile>
	);
}

function StoryCard({ story }: { story: Story }) {
	return (
		<div className="ax-card tb-ds__tile" style={{ flex: 1 }}>
			<Artwork cover={story.cover} size="fill" height={150} radius="none" />
			<span
				className="ax-stack"
				data-gap="4"
				style={{ padding: space(12, 14, 16) }}
			>
				<span className="ax-headline">{story.title}</span>
				<span className="ax-footnote ax-muted">
					{story.topic} · {story.minutes} min
				</span>
			</span>
		</div>
	);
}

function SaveButton() {
	return (
		<span className="ax-btn" data-size="lg" data-block>
			<Bookmark className="ax-glyph" size={18} strokeWidth={2.2} />
			Save for later
			<span className="tb-ds__divider" />
			{stories.tide.minutes} min
		</span>
	);
}

function SavedToast() {
	return (
		<span className="ax-toast" data-shape="card">
			<Check
				className="ax-glyph"
				data-tone="success"
				size={20}
				strokeWidth={2.4}
			/>
			<span className="ax-stack ax-grow" data-gap="4">
				<span className="ax-semibold">Saved to Read later</span>
				<span className="ax-footnote ax-muted">
					You can find it offline in Saved.
				</span>
			</span>
			<X className="ax-glyph ax-muted" size={18} strokeWidth={2} />
		</span>
	);
}

/* ---------- Column 2: settings and editing ---------- */

function TypefacePicker() {
	return (
		<Tile gap={12}>
			<span className="ax-footnote ax-muted">Reading typeface</span>
			<span className="ax-row" data-gap="12">
				<span className="ax-segmented ax-grow">
					<span data-active>Sans</span>
					<span>Serif</span>
					<span>Mono</span>
				</span>
				<span className="ax-btn">Apply</span>
			</span>
		</Tile>
	);
}

function Beta() {
	return (
		<Tile gap={14}>
			<span className="ax-row" data-gap="12" data-align="start">
				<span className="ax-avatar" data-size="sm">
					{authors.noor.initials}
				</span>
				<span className="ax-stack ax-grow" data-gap="4">
					<span className="ax-headline">You're using Index 2.5 beta</span>
					<span className="ax-subhead ax-muted">
						Highlights and shared collections are new. Tell us what feels
						off.
					</span>
				</span>
			</span>
			<span className="ax-btn" data-variant="outline" data-block>
				Leave feedback
			</span>
		</Tile>
	);
}

function Publish() {
	return (
		<Tile gap={12}>
			<span className="ax-footnote ax-muted">
				Share “{collections.calm.title}”
			</span>
			<span className="ax-btn-group" data-block>
				<span className="ax-btn">
					<Share2 className="ax-glyph" size={18} strokeWidth={2.2} />
					Publish now
				</span>
				<span
					className="ax-btn"
					style={{ flex: "none", padding: space(0, 14) }}
				>
					<ChevronDown className="ax-glyph" size={18} strokeWidth={2.4} />
				</span>
			</span>
		</Tile>
	);
}

function ColorField() {
	return (
		<Tile>
			<div className="ax-field">
				<span className="ax-label">Highlight color</span>
				<span className="ax-control">
					<span className="tb-ds__swatch" />
					<span className="ax-value ax-grow">Highlight</span>
					<Trash2 className="ax-glyph" size={18} strokeWidth={2} />
				</span>
				<span className="ax-helper">Used on every passage you mark.</span>
			</div>
		</Tile>
	);
}

function Note() {
	return (
		<div className="ax-card tb-ds__tile">
			<span
				className="ax-row"
				data-justify="between"
				style={{ padding: space(10, 12, 0) }}
			>
				<span className="ax-icon-btn" data-size="sm">
					<ChevronLeft className="ax-glyph" size={22} strokeWidth={2} />
				</span>
				<span className="ax-headline">Note</span>
				<span
					className="ax-subhead ax-link ax-semibold"
					style={{ paddingRight: space(8) }}
				>
					Save
				</span>
			</span>
			<span
				className="ax-stack"
				data-gap="8"
				style={{ padding: space(12, 16, 16) }}
			>
				<div className="ax-textarea" data-state="focused">
					<span className="ax-caret">
						Read with the tide chapter. The bit on floating foundations is
						the argument for the studio brief.
					</span>
				</div>
				<span className="ax-row" data-justify="between">
					<span className="ax-footnote ax-link ax-semibold">
						Clear note
					</span>
					<span className="ax-counter">112 / 500</span>
				</span>
			</span>
		</div>
	);
}

function Highlight() {
	return (
		<Tile gap={12}>
			<span className="ax-row" data-justify="between">
				<span className="ax-row ax-caption ax-muted" data-gap="4">
					<Quote className="ax-glyph" size={14} strokeWidth={2.2} />
					{stories.quiet.title}
				</span>
				<span className="ax-icon-btn" data-size="sm" data-variant="tinted">
					<Pencil className="ax-glyph" size={16} strokeWidth={2} />
				</span>
			</span>
			<span className="tb-ds__bubble ax-callout">
				Attention is the only material an interface really works with;
				everything else is arrangement.
			</span>
			<span className="ax-caption ax-muted">Highlighted · 2 days ago</span>
		</Tile>
	);
}

/* ---------- Column 3: sorting and filtering ---------- */

function LibraryTabs() {
	return (
		<div className="ax-card tb-ds__tile" style={{ paddingTop: space(4) }}>
			<div className="ax-tabs">
				<span data-active>
					Stories <span className="ax-badge">34</span>
				</span>
				<span>
					Collections <span className="ax-badge">7</span>
				</span>
			</div>
			<span
				className="ax-stack"
				data-gap="12"
				style={{ padding: space(14, 16, 16) }}
			>
				{[stories.treeline, stories.presses].map((story) => (
					<span key={story.title} className="ax-row" data-gap="12">
						<Artwork cover={story.cover} size={44} radius="sm" />
						<span className="ax-stack ax-grow" style={{ gap: 0 }}>
							<span className="ax-subhead ax-semibold">
								{story.title}
							</span>
							<span className="ax-caption ax-muted">
								{authors[story.author].name}
							</span>
						</span>
					</span>
				))}
			</span>
		</div>
	);
}

function EditorToolbar() {
	const tools = [Bold, Italic, Highlighter, Link2, Quote];
	return (
		<Tile gap={0} pad={8}>
			<span className="ax-row" data-justify="between">
				{tools.map((Icon, i) => (
					<span
						key={i}
						className="ax-icon-btn"
						data-shape="square"
						data-variant={i === 2 ? "tinted" : undefined}
					>
						<Icon className="ax-glyph" size={20} strokeWidth={2} />
					</span>
				))}
				<span className="ax-separator" data-orientation="vertical" />
				<span className="ax-icon-btn" data-shape="square">
					<Trash2
						className="ax-glyph ax-danger"
						size={20}
						strokeWidth={2}
					/>
				</span>
			</span>
		</Tile>
	);
}

function Topics() {
	return (
		<Tile gap={12}>
			<span className="ax-footnote ax-muted">Topics you follow</span>
			<span className="ax-row" data-wrap>
				<span className="ax-chip">Design</span>
				<span className="ax-chip">Cities</span>
				<span className="ax-chip" data-variant="filled">
					Architecture
				</span>
				<span className="ax-chip" data-selected>
					<Check className="ax-glyph" size={16} strokeWidth={2.6} />
					Other
				</span>
			</span>
		</Tile>
	);
}

function Offline() {
	return (
		<div className="ax-card tb-ds__tile">
			<div className="ax-item" data-size="lg">
				<span className="ax-item-content">
					<span className="ax-item-title ax-semibold">
						Offline reading
					</span>
					<span className="ax-item-desc">
						Keeps 30 saved stories on this phone
					</span>
				</span>
				<span className="ax-switch" data-checked />
			</div>
		</div>
	);
}

const statuses = [
	["Unread", true],
	["In progress", false],
	["Finished", false],
	["Archived", false],
] as const;

function StatusFilter() {
	return (
		<Tile gap={14}>
			<span className="ax-headline">Filter by status</span>
			<span className="ax-stack" data-gap="12">
				{statuses.map(([label, on]) => (
					<span key={label} className="ax-row" data-gap="12">
						<span className="ax-checkbox" data-checked={on || undefined}>
							{on && <Check size={14} strokeWidth={3} />}
						</span>
						<span className="ax-subhead">{label}</span>
					</span>
				))}
			</span>
			<span className="ax-separator" data-variant="subtle" />
			<span className="ax-footnote ax-link ax-semibold">Clear</span>
		</Tile>
	);
}

function Attachments() {
	return (
		<Tile gap={12}>
			<span className="ax-footnote ax-muted">Cover images</span>
			<span className="ax-row" data-gap="12">
				{(["cabin", "latte", "fjord"] as const).map((cover) => (
					<span key={cover} className="ax-tile-attachment">
						<Artwork cover={cover} size={84} radius="none" />
						<span className="ax-remove">
							<X size={14} strokeWidth={2.6} />
						</span>
					</span>
				))}
			</span>
		</Tile>
	);
}

/* ---------- Column 4: dates and options ---------- */

// October 2026 starts on a Thursday: four days of September lead the grid.
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const days = [
	...[27, 28, 29, 30].map((day) => ({ day, outside: true })),
	...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, outside: false })),
];
const rangeStart = 12;
const rangeEnd = 16;

function dayProps(day: number, outside: boolean) {
	if (outside) return { "data-outside": true };
	if (day === rangeStart) return { "data-range-start": true };
	if (day === rangeEnd) return { "data-range-end": true };
	if (day > rangeStart && day < rangeEnd) return { "data-in-range": true };
	if (day === 6) return { "data-today": true };
	if (day === 21 || day === 27) return { "data-event": true };
	return {};
}

function Calendar() {
	return (
		<Tile gap={8}>
			<div className="ax-calendar">
				<div className="ax-calendar-head">
					<span className="ax-headline">October, 2026</span>
					<span className="ax-row" data-gap="4">
						<span className="ax-icon-btn" data-size="sm">
							<ChevronLeft
								className="ax-glyph"
								size={20}
								strokeWidth={2}
							/>
						</span>
						<span className="ax-icon-btn" data-size="sm">
							<ChevronRight
								className="ax-glyph"
								size={20}
								strokeWidth={2}
							/>
						</span>
					</span>
				</div>
				<div className="ax-calendar-grid">
					{weekdays.map((day, i) => (
						<span key={`w${i}`} className="ax-weekday">
							{day}
						</span>
					))}
					{days.map(({ day, outside }) => (
						<span
							key={`${outside ? "p" : "d"}${day}`}
							{...dayProps(day, outside)}
						>
							<i>{day}</i>
						</span>
					))}
				</div>
			</div>
			<span className="ax-row" data-justify="between">
				<span className="ax-footnote ax-muted">
					Reading streak · Oct 12 – 16
				</span>
				<span className="ax-badge" data-variant="success">
					5 days
				</span>
			</span>
		</Tile>
	);
}

const periods = ["Last week", "Last 30 days", "This year", "Last year"];

function Period() {
	return (
		<div className="ax-menu tb-ds__menu">
			<div className="ax-menu-label">Saved in</div>
			{periods.map((period, i) => (
				<div key={period} className="ax-menu-item">
					{period}
					{i === 0 && (
						<Check
							className="ax-glyph ax-check"
							size={18}
							strokeWidth={2.6}
						/>
					)}
				</div>
			))}
			<div className="ax-menu-gap" />
			<div className="ax-menu-item ax-link">Clear</div>
		</div>
	);
}

const publishOptions = [
	[FilePen, "Save as draft", "Only you can see the collection."],
	[CalendarClock, "Publish later…", "Pick a day and a time to go public."],
	[Users, "Share with readers…", "Invite people to read and add to it."],
] as const;

function PublishOptions() {
	return (
		<div className="ax-list tb-ds__list" data-inset>
			{publishOptions.map(([Icon, title, desc], i) => (
				<div
					key={title}
					className="ax-item"
					data-size="lg"
					data-state={i === 0 ? "selected" : undefined}
				>
					<span className="ax-tile" data-size="lg" data-color="subtle">
						<Icon className="ax-glyph" size={20} strokeWidth={2} />
					</span>
					<span className="ax-item-content">
						<span className="ax-item-title ax-semibold">{title}</span>
						<span className="ax-item-desc">{desc}</span>
					</span>
				</div>
			))}
		</div>
	);
}

/* ---------- Column 1, continued: labels and voices ---------- */

// Badge: every variant, each with the job it has in Index.
function Labels() {
	return (
		<Tile gap={12}>
			<span className="ax-footnote ax-muted">Story labels</span>
			<span className="ax-row" data-wrap>
				<span className="ax-badge" data-variant="highlight">
					New
				</span>
				<span className="ax-badge" data-variant="info">
					Popular
				</span>
				<span className="ax-badge" data-variant="success">
					<Headphones size={14} strokeWidth={2.2} />
					Audio
				</span>
				<span className="ax-badge" data-variant="warning">
					Free
				</span>
				<span className="ax-badge" data-variant="inverse">
					Pro
				</span>
			</span>
		</Tile>
	);
}

// Card, Avatar and Text: a reader's word, not a passage of a story.
function ReaderQuote() {
	return (
		<Tile gap={14} pad={24}>
			<span className="ax-row" data-gap="12">
				<span className="ax-avatar" data-size="sm" data-photo="4">
					{reader.initials}
				</span>
				<span className="ax-stack ax-grow" style={{ gap: 0 }}>
					<span className="ax-subhead ax-semibold">{reader.name}</span>
					<span className="ax-caption ax-muted">Reader since 2024</span>
				</span>
			</span>
			<span className="tb-ds__quote-mark" aria-hidden="true">
				“
			</span>
			<span className="ax-title3" style={{ fontWeight: 500 }}>
				Index is the only app where I finish what I save. Collections turned
				a pile of tabs into a reading list.
			</span>
		</Tile>
	);
}

// Card, Carousel: a collection's covers, one at a time, with its dots.
function CoverCarousel() {
	return (
		<div className="ax-card tb-ds__tile">
			<span style={{ position: "relative", display: "block" }}>
				<Artwork
					cover={collections.cities.covers[0]}
					size="fill"
					height={180}
					radius="none"
				/>
				<span className="ax-dots tb-ds__dots">
					<span data-active />
					<span />
					<span />
					<span />
				</span>
			</span>
			<span
				className="ax-stack"
				data-gap="4"
				style={{ padding: space(12, 14, 16) }}
			>
				<span className="ax-headline">{collections.cities.title}</span>
				<span className="ax-footnote ax-muted">
					{collections.cities.count} stories
				</span>
			</span>
		</div>
	);
}

/* ---------- Column 2, continued: people ---------- */

// Button, IconButton and Badge.Anchor side by side, in both button styles.
function FollowActions() {
	return (
		<Tile gap={12}>
			<span className="ax-footnote ax-muted">{authors.clara.name}</span>
			<span className="ax-row" data-gap="8">
				<span className="ax-btn" data-variant="outline" data-size="sm">
					<Plus className="ax-glyph" size={16} strokeWidth={2.2} />
					Follow
				</span>
				<span className="ax-btn" data-size="sm">
					<Check className="ax-glyph" size={16} strokeWidth={2.4} />
					Following
				</span>
				<span className="ax-grow" />
				<span className="ax-anchor">
					<span
						className="ax-icon-btn"
						data-variant="outline"
						data-size="sm"
					>
						<Bell className="ax-glyph" size={18} strokeWidth={2} />
					</span>
					<span className="ax-badge" data-kind="count">
						3
					</span>
				</span>
			</span>
		</Tile>
	);
}

/* ---------- Column 3, continued: progress ---------- */

// Item and Progress: a story row with its category and date, and how far in.
function ContinueReading() {
	const story = stories.slowCity;
	return (
		<Tile gap={12}>
			<span className="ax-footnote ax-muted">Continue reading</span>
			<span className="ax-row" data-gap="12">
				<Artwork cover={story.cover} size={56} radius="md" />
				<span className="ax-stack ax-grow" style={{ gap: space(2) }}>
					<span className="ax-caption ax-muted">
						{story.topic} · Sep 20
					</span>
					<span className="ax-subhead ax-semibold">{story.title}</span>
				</span>
			</span>
			<span className="ax-stack" data-gap="4">
				<span className="ax-progress">
					<span style={{ width: "62%" }} />
				</span>
				<span className="ax-caption ax-muted">
					4 of {story.minutes} min left
				</span>
			</span>
		</Tile>
	);
}

/* ---------- Column 4: a story up close ---------- */

// Card with a Badge and an IconButton over the media, and a call to action.
function FeaturedStory() {
	const story = stories.rooms;
	return (
		<div className="ax-card tb-ds__tile">
			<span style={{ position: "relative", display: "block" }}>
				<Artwork
					cover={story.cover}
					size="fill"
					height={220}
					radius="none"
				/>
				<span
					className="ax-badge tb-ds__on-media"
					data-variant="highlight"
					style={{ left: space(12) }}
				>
					New
				</span>
				<span
					className="ax-icon-btn tb-ds__on-media"
					data-size="sm"
					data-variant="solid"
					style={{ right: space(12) }}
				>
					<Bookmark className="ax-glyph" size={16} strokeWidth={2.2} />
				</span>
			</span>
			<span
				className="ax-stack"
				data-gap="12"
				style={{ padding: space(14, 16, 16) }}
			>
				<span className="ax-stack" data-gap="4">
					<span className="ax-title3">{story.title}</span>
					<span className="ax-footnote ax-muted">
						{authors[story.author].name} · {story.minutes} min
					</span>
				</span>
				<span
					className="ax-btn"
					data-size="sm"
					style={{ alignSelf: "flex-start" }}
				>
					Start reading
				</span>
			</span>
		</div>
	);
}

// ButtonGroup as a stepper, next to a Checkbox.
function DailyGoal() {
	return (
		<Tile gap={14}>
			<span className="ax-row" data-justify="between">
				<span className="ax-stack" style={{ gap: 0 }}>
					<span className="ax-headline">Daily goal</span>
					<span className="ax-caption ax-muted">Stories a day</span>
				</span>
				<span className="ax-btn-group" data-size="sm">
					<span className="ax-btn" data-size="sm" data-variant="outline">
						<Minus className="ax-glyph" size={16} strokeWidth={2.2} />
					</span>
					<span
						className="ax-btn"
						data-size="sm"
						data-variant="outline"
						style={{ minWidth: 44 }}
					>
						3
					</span>
					<span className="ax-btn" data-size="sm" data-variant="outline">
						<Plus className="ax-glyph" size={16} strokeWidth={2.2} />
					</span>
				</span>
			</span>
			<span className="ax-choice">
				<span className="ax-checkbox" data-checked>
					<Check size={14} strokeWidth={3} />
				</span>
				<span className="ax-subhead">Remind me at 8 pm</span>
			</span>
		</Tile>
	);
}

// Input, focused, with its label and helper.
function RenameCollection() {
	return (
		<Tile>
			<div className="ax-field" data-state="focused">
				<span className="ax-label">Collection name</span>
				<span className="ax-control">
					<span className="ax-value ax-caret ax-grow">Weekend reads</span>
				</span>
				<span className="ax-helper">
					Shown to the people you share it with.
				</span>
			</div>
		</Tile>
	);
}

// IconButton as a single choice: square buttons, the picked one tinted.
const spacings = [
	[Rows4, "Compact"],
	[Rows3, "Default"],
	[Rows2, "Relaxed"],
] as const;

function LineSpacing() {
	return (
		<Tile>
			<span className="ax-row" data-justify="between">
				<span className="ax-stack" style={{ gap: 0 }}>
					<span className="ax-footnote ax-muted">Line spacing</span>
					<span className="ax-subhead ax-semibold">Relaxed</span>
				</span>
				<span className="ax-row" data-gap="8">
					{spacings.map(([Icon, label], i) => (
						<span
							key={label}
							className="ax-icon-btn"
							data-shape="square"
							data-variant={i === 2 ? "solid" : "outline"}
						>
							<Icon className="ax-glyph" size={20} strokeWidth={2} />
						</span>
					))}
				</span>
			</span>
		</Tile>
	);
}

// Alert with a Progress inside: how close the streak is to breaking.
function Streak() {
	return (
		<div className="ax-alert" data-variant="warning">
			<Flame className="ax-glyph" size={20} strokeWidth={2.2} />
			<span className="ax-stack ax-grow" data-gap="8">
				<span className="ax-stack" style={{ gap: 0 }}>
					<span className="ax-alert-title">Read 1 more story today</span>
					<span className="ax-alert-desc">
						and keep your 5-day streak.
					</span>
				</span>
				<span className="ax-progress">
					<span style={{ width: "80%" }} />
				</span>
			</span>
		</div>
	);
}

// Card, Icon and Text as a list: what a plan includes.
const proFeatures = [
	[WifiOff, "Offline reading for every collection"],
	[RefreshCw, "Highlights synced on all your devices"],
	[FileDown, "Notes exported to Markdown"],
] as const;

function ProIncludes() {
	return (
		<Tile gap={14}>
			<span className="ax-headline">Index Pro includes</span>
			<span className="ax-stack" data-gap="12">
				{proFeatures.map(([Icon, label]) => (
					<span key={label} className="ax-row" data-gap="12">
						<Icon
							className="ax-glyph ax-muted"
							size={20}
							strokeWidth={2}
						/>
						<span className="ax-subhead">{label}</span>
					</span>
				))}
			</span>
		</Tile>
	);
}

/* ---------- Column 5, continued: about and plans ---------- */

// Card, Icon and Text as a grid: a story's facts at a glance.
function AboutStory() {
	const facts = [
		[Clock, `${stories.tide.minutes} min`],
		[Type, "2,400 words"],
		[Highlighter, "8 highlights"],
		[Headphones, "Audio"],
	] as const;
	return (
		<Tile gap={14}>
			<span className="ax-headline">About this story</span>
			<span className="tb-ds__facts">
				{facts.map(([Icon, label]) => (
					<span key={label} className="ax-stack" data-gap="8">
						<Icon className="ax-glyph" size={22} strokeWidth={1.8} />
						<span className="ax-caption ax-muted">{label}</span>
					</span>
				))}
			</span>
		</Tile>
	);
}

// Item with a struck-through price and a Button: a plan, as a cart line.
function ProOffer() {
	return (
		<Tile>
			<span className="ax-row" data-gap="12">
				<span className="ax-tile" data-size="lg" data-color="subtle">
					<Sparkles className="ax-glyph" size={20} strokeWidth={2} />
				</span>
				<span className="ax-stack ax-grow" style={{ gap: space(2) }}>
					<span className="ax-subhead ax-semibold">Index Pro</span>
					<span className="ax-row ax-footnote" data-gap="8">
						<span
							className="ax-muted"
							style={{ textDecoration: "line-through" }}
						>
							€48
						</span>
						<span className="ax-semibold">€36 / year</span>
					</span>
				</span>
				<span className="ax-btn" data-variant="outline" data-size="sm">
					Subscribe
				</span>
			</span>
		</Tile>
	);
}

/* ---------- Board ---------- */

export function DesignSystem() {
	return (
		<div className="ax-screen tb-ds" role="img" aria-label="Design system">
			<header className="tb-ds__head">
				<span className="ax-stack" data-gap="4">
					<span className="ax-footnote ax-muted">Index · Components</span>
					<span className="ax-large-title">Design system</span>
				</span>
				<span className="ax-row" data-gap="12">
					<span className="ax-badge" data-variant="outline">
						Light & dark
					</span>
					<span className="ax-badge" data-variant="highlight">
						Live theme
					</span>
				</span>
			</header>

			<div className="tb-ds__cols">
				<div className="tb-ds__col">
					<Brand />
					<div className="ax-row" data-gap="16" data-align="start">
						<StoryCard story={stories.tide} />
						<StoryCard story={stories.kyoto} />
					</div>
					<SaveButton />
					<SavedToast />
					<Labels />
					<ReaderQuote />
				</div>

				<div className="tb-ds__col">
					<TypefacePicker />
					<Beta />
					<Publish />
					<ColorField />
					<Note />
					<Highlight />
					<FollowActions />
				</div>

				<div className="tb-ds__col">
					<LibraryTabs />
					<EditorToolbar />
					<Topics />
					<Offline />
					<StatusFilter />
					<Attachments />
					<ContinueReading />
				</div>

				<div className="tb-ds__col">
					<FeaturedStory />
					<DailyGoal />
					<RenameCollection />
					<LineSpacing />
					<Streak />
					<ProIncludes />
				</div>

				<div className="tb-ds__col">
					<Calendar />
					<Period />
					<PublishOptions />
					<AboutStory />
					<CoverCarousel />
					<ProOffer />
				</div>
			</div>
		</div>
	);
}
