// System states: success and error use their feedback color once, on the
// icon; the rest stays neutral. Loading is Home drawn in skeletons, part for
// part, so the shapes match the content that replaces them.

import { Check, CloudOff, RotateCw, X } from "lucide-react";
import type { CSSProperties } from "react";
import { AppBar, Mosaic, TabBar } from "./chrome";
import { saved } from "./content";
import { home } from "./discovery";
import { space } from "./space";

export function Success() {
	return (
		<>
			<div className="ax-appbar">
				<span className="ax-icon-btn">
					<X className="ax-glyph" size={24} strokeWidth={1.9} />
				</span>
			</div>
			<div className="ax-center" style={{ padding: space(0, 28) }}>
				<span
					className="ax-empty-media"
					style={{
						background: "var(--ax-feedback-success-subtle)",
						color: "var(--ax-feedback-success)",
					}}
				>
					<Check className="ax-glyph" size={30} strokeWidth={2.4} />
				</span>
				<span className="ax-title2" style={{ marginTop: space(4) }}>
					Collection created
				</span>
				<span className="ax-subhead ax-muted">
					Add stories to it from any article with the bookmark button.
				</span>
				<div
					className="ax-card"
					data-variant="outlined"
					style={{ alignSelf: "stretch", marginTop: space(12), textAlign: "left" }}
				>
					<div className="ax-row" data-gap="12" style={{ padding: space(10) }}>
						<span style={{ width: 56, flex: "none" }}>
							<Mosaic collection={saved.architecture} height={56} radius="sm" />
						</span>
						<span className="ax-stack ax-grow" style={{ gap: space(2) }}>
							<span className="ax-headline">Quiet buildings</span>
							<span className="ax-footnote ax-muted">Private · 3 stories</span>
						</span>
						<span className="ax-badge" data-variant="success">
							New
						</span>
					</div>
				</div>
			</div>
			<div className="ax-stack" data-gap="8" style={{ padding: space(0, 24, 44) }}>
				<span className="ax-btn" data-size="lg" data-block>
					View collection
				</span>
				<span className="ax-btn" data-variant="ghost" data-size="lg" data-block>
					Back to article
				</span>
			</div>
		</>
	);
}

export function ErrorState() {
	return (
		<>
			<AppBar />
			<div className="ax-center" style={{ padding: space(0, 32, 80) }}>
				<span className="ax-empty-media" data-tone="error">
					<CloudOff className="ax-glyph" size={28} strokeWidth={1.8} />
				</span>
				<span className="ax-title2" style={{ marginTop: space(4) }}>
					We couldn't load this story
				</span>
				<span className="ax-subhead ax-muted">
					Check your connection and try again. Stories you saved are still
					there offline.
				</span>
				<span className="ax-row" data-gap="8" style={{ marginTop: space(12) }}>
					<span className="ax-btn">
						<RotateCw className="ax-glyph" size={18} strokeWidth={2.2} />
						Try again
					</span>
					<span className="ax-btn" data-variant="outline">
						Go to Saved
					</span>
				</span>
				<span className="ax-caption ax-subtle" style={{ marginTop: space(16) }}>
					Error 503 · Ref 7F3A-21
				</span>
			</div>
		</>
	);
}

const line = (width: number | string, height = 14): CSSProperties => ({ width, height });

/** Home while it loads: the same paddings and sizes, every part a skeleton. */
export function Loading() {
	return (
		<>
			<div className="ax-row" data-justify="between" style={{ padding: space(4, 20, 0) }}>
				<span className="ax-stack" data-gap="8">
					<span className="ax-skeleton" style={line(150, 12)} />
					<span className="ax-skeleton" style={line(210, 22)} />
				</span>
				<span className="ax-row" data-gap="12">
					<span className="ax-skeleton" data-shape="circle" style={line(26, 26)} />
					<span className="ax-skeleton" data-shape="circle" style={line(32, 32)} />
				</span>
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(20, 20, 0) }}>
				<span className="ax-skeleton" style={line(90, 20)} />
				<span className="ax-skeleton" data-shape="block" style={line("100%", home.lead)} />
				<span className="ax-skeleton" style={{ ...line(64, 12), marginTop: space(4) }} />
				<span className="ax-skeleton" style={line("100%", 22)} />
				<span className="ax-skeleton" style={line("62%", 22)} />
				<span className="ax-row" data-gap="8">
					<span className="ax-skeleton" data-shape="circle" style={line(24, 24)} />
					<span className="ax-skeleton" style={line(140, 12)} />
				</span>
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(24, 20, 0) }}>
				<span className="ax-skeleton" style={line(130, 16)} />
				<div className="ax-card" data-variant="outlined">
					<div className="ax-row" data-gap="12" style={{ padding: space(10) }}>
						<span className="ax-skeleton" style={{ ...line(home.thumb, home.thumb), borderRadius: "var(--ax-radius-sm)" }} />
						<span className="ax-stack ax-grow" data-gap="8">
							<span className="ax-skeleton" style={line("80%")} />
							<span className="ax-skeleton" style={line("100%", 4)} />
						</span>
					</div>
				</div>
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(24, 0, 0) }}>
				<span className="ax-skeleton" style={{ ...line(120, 16), marginLeft: space(20) }} />
				<div className="ax-carousel" style={{ padding: space(0, 20) }}>
					{[0, 1, 2].map((i) => (
						<span key={i} className="ax-stack" data-gap="8" style={{ width: home.card.width }}>
							<span className="ax-skeleton" style={{ ...line("100%", home.card.image), borderRadius: "var(--ax-radius-md)" }} />
							<span className="ax-skeleton" style={line("90%")} />
							<span className="ax-skeleton" style={line("60%")} />
						</span>
					))}
				</div>
			</div>

			<TabBar active="home" />
		</>
	);
}
