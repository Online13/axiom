// Account: the reader's own page, a longer form, then the utility screens —
// grouped lists, switches and chevrons, closer to a native settings layout.

import {
	Bell,
	Camera,
	Check,
	ChevronRight,
	Download,
	Globe,
	Info,
	LifeBuoy,
	Lock,
	Settings as SettingsIcon,
	Share2,
	Sun,
	Type,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { ColorScheme } from "@docs/lib/tokens";
import { Artwork } from "./Artwork";
import { AppBar, Mosaic, selected, TabBar } from "./chrome";
import { authors, collections, reader, saved, stories } from "./content";
import { space } from "./space";

export function Profile() {
	return (
		<>
			<div className="ax-row" data-justify="end" style={{ padding: space(0, 12) }}>
				<span className="ax-anchor">
					<span className="ax-icon-btn">
						<Bell className="ax-glyph" size={22} strokeWidth={1.9} />
					</span>
					<span className="ax-badge" data-kind="count" style={{ top: 4, right: 2 }}>
						3
					</span>
				</span>
				<span className="ax-icon-btn">
					<SettingsIcon className="ax-glyph" size={22} strokeWidth={1.9} />
				</span>
			</div>

			<div className="ax-stack" data-gap="12" style={{ padding: space(0, 20) }}>
				<span className="ax-row" data-gap="16">
					<span className="ax-avatar" data-size="xl">
						{reader.initials}
					</span>
					<span className="ax-stack" style={{ gap: space(2) }}>
						<span className="ax-title2">{reader.name}</span>
						<span className="ax-subhead ax-muted">{reader.handle}</span>
					</span>
				</span>
				<span className="ax-subhead">{reader.bio}</span>
				<span className="ax-row" data-gap="8">
					{[
						["128", "saved"],
						["4", "collections"],
						["36", "following"],
					].map(([value, label]) => (
						<span key={label} className="ax-card" data-variant="filled" style={{ flex: 1, padding: space(10, 12) }}>
							<span className="ax-headline">{value}</span>
							<span className="ax-caption ax-muted">{label}</span>
						</span>
					))}
				</span>
				<span className="ax-row" data-gap="8">
					<span className="ax-btn" data-variant="outline" style={{ flex: 1 }}>
						Edit profile
					</span>
					<span className="ax-icon-btn" data-variant="outline">
						<Share2 className="ax-glyph" size={20} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div className="ax-tabs" style={{ marginTop: space(20) }}>
				<span data-active>Collections</span>
				<span>Activity</span>
			</div>

			<div className="ax-row" data-gap="12" data-align="start" style={{ padding: space(16, 20, 0) }}>
				{[saved.architecture, saved.ideas].map((collection) => (
					<span key={collection.title} className="ax-stack ax-grow" data-gap="8">
						<Mosaic collection={collection} height={140} />
						<span className="ax-row" data-justify="between">
							<span className="ax-stack" style={{ gap: 0 }}>
								<span className="ax-headline">{collection.title}</span>
								<span className="ax-caption ax-muted">{collection.count} stories</span>
							</span>
							<span className="ax-badge" data-variant="outline">
								Public
							</span>
						</span>
					</span>
				))}
			</div>

			<TabBar active="profile" />
		</>
	);
}

export function EditProfile() {
	return (
		<>
			<AppBar title="Edit profile" />
			<div className="ax-stack" data-gap="8" style={{ padding: space(8, 24, 0), alignItems: "center" }}>
				<span className="ax-anchor">
					<span className="ax-avatar" data-size="xl">
						{reader.initials}
					</span>
					<span
						className="ax-icon-btn"
						data-variant="solid"
						data-size="sm"
						style={{ position: "absolute", right: -4, bottom: -4, boxShadow: "0 0 0 3px var(--ax-background-default)" }}
					>
						<Camera className="ax-glyph" size={16} strokeWidth={2} />
					</span>
				</span>
				<span className="ax-footnote ax-link">Change photo</span>
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(20, 24, 0) }}>
				<div className="ax-field">
					<span className="ax-label">Display name</span>
					<span className="ax-control">
						<span className="ax-value">{reader.name}</span>
					</span>
				</div>
				<div className="ax-field">
					<span className="ax-label">Username</span>
					<span className="ax-input-group">
						<span className="ax-addon">index.app/</span>
						<span className="ax-grow">
							<span className="ax-value">samreads</span>
						</span>
					</span>
					<span className="ax-helper">
						<span className="ax-row ax-success" data-gap="4">
							<Check size={14} strokeWidth={2.6} /> Available
						</span>
					</span>
				</div>
				<div className="ax-field" data-state="focused">
					<span className="ax-label">Bio</span>
					<span className="ax-textarea" data-state="focused">
						<span className="ax-caret">{reader.bio}</span>
					</span>
					<span className="ax-counter">84 / 160</span>
				</div>
				<div className="ax-field" data-state="disabled">
					<span className="ax-label">Email</span>
					<span className="ax-control">
						<span className="ax-value">{reader.email}</span>
						<Lock className="ax-glyph" size={16} strokeWidth={2} />
					</span>
					<span className="ax-helper">Change it in Account settings.</span>
				</div>
			</div>

			<div className="ax-fill" />
			<div style={{ padding: space(12, 24, 44) }}>
				<span className="ax-btn" data-size="lg" data-block>
					Save changes
				</span>
			</div>
		</>
	);
}

type Row = { icon: typeof Sun; title: string; trailing: ReactNode };

const chevron = (value?: string) => (
	<>
		{value}
		<ChevronRight className="ax-glyph" size={18} strokeWidth={2} />
	</>
);

const settingGroups: [string, Row[]][] = [
	[
		"General",
		[
			{ icon: Sun, title: "Appearance", trailing: chevron("Dark") },
			{ icon: Type, title: "Text size", trailing: chevron("Default") },
			{ icon: Globe, title: "Language", trailing: chevron("English") },
		],
	],
	[
		"Notifications & privacy",
		[
			{ icon: Bell, title: "Notifications", trailing: chevron("On") },
			{ icon: Lock, title: "Private profile", trailing: <span className="ax-switch" /> },
			{ icon: Download, title: "Offline reading", trailing: <span className="ax-switch" data-checked /> },
		],
	],
	[
		"About",
		[
			{ icon: LifeBuoy, title: "Help center", trailing: chevron() },
			{ icon: Info, title: "About Index", trailing: chevron("2.4.1") },
		],
	],
];

export function Settings() {
	return (
		<>
			<AppBar title="Settings" />
			<div className="ax-list" style={{ marginTop: space(8) }}>
				<div className="ax-item" data-size="lg">
					<span className="ax-avatar" data-size="lg">
						{reader.initials}
					</span>
					<span className="ax-item-content">
						<span className="ax-item-title ax-semibold">{reader.name}</span>
						<span className="ax-item-desc">{reader.email}</span>
					</span>
					<span className="ax-item-trailing">{chevron()}</span>
				</div>
			</div>

			{settingGroups.map(([group, rows]) => (
				<div key={group}>
					<div className="ax-section">{group}</div>
					<div className="ax-list" data-inset>
						{rows.map(({ icon: Icon, title, trailing }) => (
							<div key={title} className="ax-item">
								<span className="ax-tile" data-color="subtle">
									<Icon className="ax-glyph" size={18} strokeWidth={2} />
								</span>
								<span className="ax-item-content">
									<span className="ax-item-title">{title}</span>
								</span>
								<span className="ax-item-trailing">{trailing}</span>
							</div>
						))}
					</div>
				</div>
			))}

			<div className="ax-list" style={{ marginTop: space(24) }}>
				<div className="ax-item" style={{ justifyContent: "center" }}>
					<span className="ax-danger">Sign out</span>
				</div>
			</div>
		</>
	);
}

/** A tiny screen drawn with the theme in one scheme, whatever the phone shows. */
function SchemeThumb({ scheme, style }: { scheme: ColorScheme; style?: CSSProperties }) {
	const bar = (width: string, height: number, color: string) => (
		<span style={{ width, height, flex: "none", borderRadius: height / 2, background: `var(--ax-${color})` }} />
	);
	return (
		<span
			data-ax-preview
			data-scheme={scheme}
			style={{
				display: "flex",
				flex: 1,
				flexDirection: "column",
				gap: space(6),
				padding: space(10),
				background: "var(--ax-background-default)",
				...style,
			}}
		>
			{bar("70%", 6, "content-default")}
			{bar("90%", 4, "content-subtle")}
			<span style={{ flex: 1, borderRadius: "var(--ax-radius-sm)", background: "var(--ax-background-subtle)" }} />
			{bar("55%", 12, "primary-default")}
		</span>
	);
}

const modes = [
	["System", ["light", "dark"]],
	["Light", ["light"]],
	["Dark", ["dark"]],
] as const;

export function Appearance() {
	return (
		<>
			<AppBar title="Appearance" />
			<div className="ax-section">Theme</div>
			<div className="ax-row" data-gap="12" style={{ padding: space(0, 16) }}>
				{modes.map(([label, schemes]) => {
					const on = label === "Dark";
					return (
						<span
							key={label}
							className="ax-card"
							data-variant="outlined"
							style={{ flex: 1, gap: space(10), padding: space(6), ...(on ? selected : undefined) }}
						>
							<span
								style={{
									display: "flex",
									height: 112,
									overflow: "hidden",
									borderRadius: "var(--ax-radius-md)",
									boxShadow: "0 0 0 1px var(--ax-border-subtle)",
								}}
							>
								{schemes.map((scheme) => (
									<SchemeThumb key={scheme} scheme={scheme} />
								))}
							</span>
							<span className="ax-row" data-justify="center" style={{ paddingBottom: space(6) }}>
								<span className="ax-radio" data-checked={on || undefined} />
								<span className="ax-subhead ax-semibold">{label}</span>
							</span>
						</span>
					);
				})}
			</div>

			<div className="ax-section">Reading</div>
			<div className="ax-list">
				<div className="ax-item" style={{ flexDirection: "column", alignItems: "stretch", gap: space(10), paddingBlock: space(14) }}>
					<span className="ax-row" data-justify="between">
						<span className="ax-item-title">Text size</span>
						<span className="ax-subhead ax-muted">18 pt</span>
					</span>
					<span className="ax-row" data-gap="12">
						<span className="ax-footnote">A</span>
						<span className="ax-slider ax-grow" style={{ "--to": "58%" } as CSSProperties}>
							<span className="ax-thumb" style={{ left: "58%" }} />
						</span>
						<span className="ax-title3">A</span>
					</span>
				</div>
				<div className="ax-item">
					<span className="ax-item-content">
						<span className="ax-item-title">Serif for long reads</span>
					</span>
					<span className="ax-switch" data-checked />
				</div>
				<div className="ax-item">
					<span className="ax-item-content">
						<span className="ax-item-title">Reduce motion</span>
					</span>
					<span className="ax-switch" />
				</div>
			</div>
			<div className="ax-footnote-block">
				Dark follows your theme's dark colors, even when the rest of your phone
				is light.
			</div>
		</>
	);
}

const topicsSettings = [
	["New recommendations", "A few picks from what you read", true, false],
	["Saved collection updates", "When a saved collection grows", true, false],
	["New followers", "When someone follows you", false, false],
	["Product updates", "Off in your email preferences", false, true],
] as const;

export function NotificationSettings() {
	return (
		<>
			<AppBar title="Notifications" />
			<div className="ax-list" style={{ marginTop: space(8) }}>
				<div className="ax-item" data-size="lg">
					<span className="ax-item-content">
						<span className="ax-item-title ax-semibold">Allow notifications</span>
						<span className="ax-item-desc">Never between 22:00 and 8:00</span>
					</span>
					<span className="ax-switch" data-checked />
				</div>
			</div>

			<div className="ax-section">Stories</div>
			<div className="ax-list">
				{topicsSettings.map(([title, detail, on, disabled]) => (
					<div key={title} className="ax-item" data-size="lg" data-state={disabled ? "disabled" : undefined}>
						<span className="ax-item-content">
							<span className="ax-item-title">{title}</span>
							<span className="ax-item-desc">{detail}</span>
						</span>
						<span className="ax-switch" data-checked={on || undefined} data-disabled={disabled || undefined} />
					</div>
				))}
			</div>

			<div className="ax-section">How often</div>
			<div style={{ padding: space(0, 16) }}>
				<div className="ax-segmented">
					<span>As it happens</span>
					<span data-active>Daily</span>
					<span>Weekly</span>
				</div>
			</div>
			<div className="ax-footnote-block">
				Index never sends more than three notifications a day.
			</div>
		</>
	);
}

type Event = {
	who: ReactNode;
	what: ReactNode;
	when: string;
	unread?: boolean;
	aside?: ReactNode;
};

const Avatar = ({ initials }: { initials: string }) => (
	<span className="ax-avatar" data-size="sm">
		{initials}
	</span>
);

const events: [string, Event[]][] = [
	[
		"Today",
		[
			{
				who: <Avatar initials={authors.noor.initials} />,
				what: (
					<>
						<span className="ax-semibold">{authors.noor.name}</span> published “{stories.materials.title}”
					</>
				),
				when: "12 min ago",
				unread: true,
				aside: <Artwork cover={stories.materials.cover} size={44} radius="sm" />,
			},
			{
				who: (
					<span style={{ width: 32, flex: "none" }}>
						<Mosaic collection={collections.calm} height={32} radius="sm" />
					</span>
				),
				what: (
					<>
						<span className="ax-semibold">{collections.calm.title}</span> has 2 new stories
					</>
				),
				when: "1 h ago",
				unread: true,
			},
			{
				who: <Avatar initials={authors.theo.initials} />,
				what: (
					<>
						<span className="ax-semibold">{authors.theo.name}</span> started following you
					</>
				),
				when: "3 h ago",
				unread: true,
				aside: (
					<span className="ax-btn" data-size="sm">
						Follow back
					</span>
				),
			},
		],
	],
	[
		"Yesterday",
		[
			{
				who: (
					<span className="ax-tile" data-color="subtle" style={{ width: 32, height: 32, borderRadius: 999 }}>
						<Check className="ax-glyph ax-success" size={16} strokeWidth={2.6} />
					</span>
				),
				what: (
					<>
						Your collection <span className="ax-semibold">Architecture</span> reached 20 stories
					</>
				),
				when: "Yesterday",
			},
			{
				who: <Avatar initials={authors.jonas.initials} />,
				what: (
					<>
						Picked for you: “{stories.kyoto.title}” by {authors.jonas.name}
					</>
				),
				when: "Yesterday",
				aside: <Artwork cover={stories.kyoto.cover} size={44} radius="sm" />,
			},
		],
	],
];

export function NotificationCenter() {
	return (
		<>
			<AppBar
				title="Activity"
				end={<span className="ax-footnote ax-link ax-semibold" style={{ paddingRight: space(8) }}>Mark all read</span>}
			/>
			<div className="ax-tabs">
				<span data-active>
					All <span className="ax-badge" data-kind="count">3</span>
				</span>
				<span>Following</span>
				<span>Collections</span>
			</div>

			{events.map(([day, items]) => (
				<div key={day}>
					<div className="ax-section" style={{ paddingTop: space(16) }}>
						{day}
					</div>
					{items.map((event, i) => (
						<div
							key={i}
							className="ax-row"
							data-gap="12"
							data-align="start"
							style={{
								padding: space(12, 20),
								background: event.unread ? "var(--ax-primary-subtle)" : undefined,
							}}
						>
							{event.who}
							<span className="ax-stack ax-grow" data-gap="4">
								<span className="ax-subhead">{event.what}</span>
								<span className="ax-row ax-caption ax-muted" data-gap="4">
									{event.unread && <span className="ax-badge-dot ax-link" />}
									{event.when}
								</span>
							</span>
							{event.aside}
						</div>
					))}
				</div>
			))}
		</>
	);
}
