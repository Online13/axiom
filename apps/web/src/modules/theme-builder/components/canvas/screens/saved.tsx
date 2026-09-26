// The reader's library, empty and full, and the two overlays that act on it:
// the sheet that saves a story, the dialog that removes one. Both overlays sit
// on the real screen they open from.

import { Bookmark, Check, Plus, Search, Trash2, X } from "lucide-react";
import { Mosaic, StoryRow, TabBar } from "./chrome";
import { saved, stories } from "./content";
import { Article } from "./reading";
import { space } from "./space";

function SavedHeader() {
	return (
		<div className="ax-row" data-justify="between" style={{ padding: space(4, 20, 0) }}>
			<span className="ax-large-title">Saved</span>
			<span className="ax-row" data-gap="8">
				<span className="ax-icon-btn" data-variant="tinted" data-size="sm">
					<Search className="ax-glyph" size={18} strokeWidth={2} />
				</span>
				<span className="ax-icon-btn" data-variant="tinted" data-size="sm">
					<Plus className="ax-glyph" size={18} strokeWidth={2.2} />
				</span>
			</span>
		</div>
	);
}

export function Saved() {
	return (
		<>
			<SavedHeader />
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: space(16, 12),
					padding: space(16, 20, 0),
				}}
			>
				{Object.values(saved).map((collection, i) => (
					<span key={collection.title} className="ax-stack" data-gap="8">
						<span style={{ position: "relative" }}>
							<Mosaic collection={collection} height={128} />
							{i === 0 && (
								<span className="ax-badge" data-variant="inverse" style={{ position: "absolute", left: 8, bottom: 8 }}>
									3 unread
								</span>
							)}
						</span>
						<span className="ax-stack" style={{ gap: 0 }}>
							<span className="ax-headline">{collection.title}</span>
							<span className="ax-caption ax-muted">{collection.count} stories</span>
						</span>
					</span>
				))}
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(24, 20, 0) }}>
				<span className="ax-row" data-justify="between">
					<span className="ax-title3">Recent</span>
					<span className="ax-footnote ax-link">See all</span>
				</span>
				{[stories.quiet, stories.slowCity].map((story) => (
					<StoryRow
						key={story.title}
						story={story}
						trailing={
							<Bookmark className="ax-glyph ax-link" size={20} strokeWidth={1.9} fill="currentColor" />
						}
					/>
				))}
			</div>
			<TabBar active="saved" />
		</>
	);
}

export function SavedEmpty() {
	return (
		<>
			<SavedHeader />
			<div className="ax-center" style={{ paddingBottom: 120 }}>
				<span className="ax-empty-media">
					<Bookmark className="ax-glyph" size={28} strokeWidth={1.8} />
				</span>
				<span className="ax-title2">Nothing saved yet</span>
				<span className="ax-subhead ax-muted" style={{ maxWidth: 280 }}>
					Tap the bookmark on any story to keep it here. It stays available
					offline.
				</span>
				<span className="ax-btn" style={{ marginTop: space(8) }}>
					Explore stories
				</span>
			</div>
			<TabBar active="saved" />
		</>
	);
}

const targets = [
	[saved.later, true],
	[saved.design, true],
	[saved.architecture, false],
	[saved.ideas, false],
] as const;

export function SaveSheet() {
	return (
		<>
			<Article />
			<div className="ax-scrim" />
			<div className="ax-sheet" style={{ borderRadius: "var(--ax-radius-xl) var(--ax-radius-xl) 0 0" }}>
				<span className="ax-handle" />
				<div className="ax-sheet-header">
					<span className="ax-title3">Save to collection</span>
					<span className="ax-icon-btn" data-variant="tinted" data-size="sm">
						<X className="ax-glyph" size={18} strokeWidth={2.2} />
					</span>
				</div>
				<div className="ax-list" data-variant="plain" style={{ margin: space(8, -16, 0) }}>
					{targets.map(([collection, on]) => (
						<div key={collection.title} className="ax-item" data-inset>
							<span style={{ width: 44, flex: "none" }}>
								<Mosaic collection={collection} height={44} radius="sm" />
							</span>
							<span className="ax-item-content">
								<span className="ax-item-title">{collection.title}</span>
								<span className="ax-item-desc">{collection.count} stories</span>
							</span>
							<span className="ax-checkbox" data-checked={on || undefined}>
								{on && <Check size={14} strokeWidth={3} />}
							</span>
						</div>
					))}
					<div className="ax-item">
						<span className="ax-tile" data-color="subtle" data-size="lg">
							<Plus className="ax-glyph" size={22} strokeWidth={2} />
						</span>
						<span className="ax-item-content">
							<span className="ax-item-title ax-link">Create new collection</span>
						</span>
					</div>
				</div>
				<span className="ax-btn" data-size="lg" data-block style={{ marginTop: space(12) }}>
					Done
				</span>
			</div>
		</>
	);
}

export function RemoveDialog() {
	return (
		<>
			<Saved />
			<div className="ax-scrim" style={{ zIndex: 20 }} />
			<div className="ax-layer" style={{ zIndex: 21 }}>
				<div className="ax-dialog">
					<div className="ax-dialog-body">
						<span className="ax-empty-media" data-tone="error" style={{ width: 48, height: 48, marginBottom: space(6) }}>
							<Trash2 className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
						<span className="ax-title3">Remove from saved?</span>
						<span className="ax-subhead ax-muted">
							“{stories.quiet.title}” will also leave Read later and Design.
						</span>
					</div>
					<div className="ax-dialog-actions">
						<span className="ax-btn" data-variant="outline">
							Cancel
						</span>
						<span className="ax-btn" data-variant="destructive">
							Remove
						</span>
					</div>
				</div>
			</div>
		</>
	);
}
