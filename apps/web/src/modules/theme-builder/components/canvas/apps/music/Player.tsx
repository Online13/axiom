// The hero screen: a full-screen player. One huge cover, big type and a row
// of controls — the link color carries the active controls, the scrubber and the
// output device; the radius shows on the cover.

import {
	ChevronDown,
	Ellipsis,
	Heart,
	ListMusic,
	MonitorSpeaker,
	Pause,
	Repeat,
	Share2,
	Shuffle,
	SkipBack,
	SkipForward,
} from "lucide-react";
import type { CSSProperties } from "react";
import { DeviceFrame } from "../../DeviceFrame";
import { Artwork } from "../Artwork";

const played = "38%";

export function Player() {
	return (
		<DeviceFrame label="Now playing" caption="Player">
			<div className="ax-appbar">
				<span className="ax-appbar-slot">
					<span className="ax-icon-btn">
						<ChevronDown
							className="ax-glyph"
							size={26}
							strokeWidth={1.9}
						/>
					</span>
				</span>
				<span className="ax-appbar-title">
					<span
						className="ax-stack"
						style={{ alignItems: "center", gap: 0 }}
					>
						<span className="ax-caption ax-muted">Playing from</span>
						<span className="ax-footnote ax-semibold">Made for you</span>
					</span>
				</span>
				<span className="ax-appbar-slot" data-side="end">
					<span className="ax-icon-btn">
						<Ellipsis className="ax-glyph" size={24} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div style={{ padding: "24px 28px 0" }}>
				<Artwork
					cover="hours"
					size="fill"
					radius="xl"
					label="Quiet Hours cover"
				/>
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "32px 28px 0" }}
			>
				<span className="ax-stack" data-gap="4">
					<span className="ax-title1">Quiet Hours</span>
					<span className="ax-callout ax-muted">Nova</span>
				</span>
				<Heart
					className="ax-glyph ax-link"
					size={28}
					strokeWidth={1.9}
					fill="currentColor"
				/>
			</div>

			<div style={{ padding: "20px 28px 0" }}>
				<div
					className="ax-slider"
					style={{ "--to": played } as CSSProperties}
				>
					<span className="ax-thumb" style={{ left: played }} />
				</div>
				<div
					className="ax-ticks"
					style={{ fontVariantNumeric: "tabular-nums" }}
				>
					<span>1:24</span>
					<span>-2:18</span>
				</div>
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "20px 24px 0" }}
			>
				<span className="ax-icon-btn">
					<Shuffle
						className="ax-glyph ax-link"
						size={22}
						strokeWidth={2}
					/>
				</span>
				<span className="ax-icon-btn">
					<SkipBack
						className="ax-glyph"
						size={30}
						strokeWidth={1.6}
						fill="currentColor"
					/>
				</span>
				<span
					className="ax-icon-btn"
					data-variant="solid"
					data-size="lg"
					style={{ width: 76, height: 76 }}
				>
					<Pause
						className="ax-glyph"
						size={32}
						strokeWidth={1.6}
						fill="currentColor"
					/>
				</span>
				<span className="ax-icon-btn">
					<SkipForward
						className="ax-glyph"
						size={30}
						strokeWidth={1.6}
						fill="currentColor"
					/>
				</span>
				<span className="ax-icon-btn">
					<Repeat
						className="ax-glyph ax-subtle"
						size={22}
						strokeWidth={2}
					/>
				</span>
			</div>

			<div className="ax-fill" />

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "0 28px 44px" }}
			>
				<span className="ax-row ax-footnote ax-link" data-gap="4">
					<MonitorSpeaker
						className="ax-glyph"
						size={18}
						strokeWidth={1.9}
					/>
					Living room
				</span>
				<span className="ax-row ax-muted" data-gap="16">
					<Share2 className="ax-glyph" size={20} strokeWidth={1.9} />
					<ListMusic className="ax-glyph" size={20} strokeWidth={1.9} />
				</span>
			</div>
		</DeviceFrame>
	);
}
