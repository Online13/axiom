// Album — a pushed screen: back navigation, a centered cover, the two CTAs
// and only a handful of tracks. The playing track picks up the link color.

import {
	AudioLines,
	ChevronLeft,
	Download,
	Ellipsis,
	Heart,
	Play,
	Shuffle,
} from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";
import { Artwork } from "../Artwork";

const tracks = [
	["Shoreline", "3:12"],
	["Quiet Hours", "3:42"],
	["Salt & Glass", "4:05"],
	["Undertow", "2:58"],
] as const;

const playing = 1;

export function Album() {
	return (
		<DeviceFrame label="Album" caption="Album">
			<div className="ax-appbar">
				<span className="ax-appbar-slot">
					<span className="ax-icon-btn">
						<ChevronLeft
							className="ax-glyph"
							size={28}
							strokeWidth={1.9}
						/>
					</span>
				</span>
				<span className="ax-appbar-title" />
				<span className="ax-appbar-slot" data-side="end">
					<span className="ax-icon-btn">
						<Ellipsis className="ax-glyph" size={24} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div
				className="ax-row"
				data-justify="center"
				style={{ paddingTop: 8 }}
			>
				<Artwork cover="tide" size={232} label="Low Tide cover" />
			</div>

			<div
				className="ax-stack"
				data-gap="4"
				style={{ alignItems: "center", padding: "24px 20px 0" }}
			>
				<span className="ax-title1">Low Tide</span>
				<span className="ax-callout ax-semibold ax-link">Nova</span>
				<span className="ax-caption ax-muted">
					Album · 2026 · 8 songs, 34 min
				</span>
			</div>

			<div
				className="ax-row"
				data-gap="12"
				style={{ padding: "24px 20px 0" }}
			>
				<span className="ax-btn" data-size="lg" style={{ flex: 1 }}>
					<Play
						className="ax-glyph"
						size={18}
						strokeWidth={1.6}
						fill="currentColor"
					/>
					Play
				</span>
				<span
					className="ax-btn"
					data-size="lg"
					data-variant="outline"
					style={{ flex: 1 }}
				>
					<Shuffle className="ax-glyph" size={18} strokeWidth={2} />
					Shuffle
				</span>
			</div>

			<div
				className="ax-row"
				data-justify="center"
				data-gap="16"
				style={{ paddingTop: 16 }}
			>
				<span className="ax-icon-btn" data-variant="tinted">
					<Heart className="ax-glyph" size={20} strokeWidth={1.9} />
				</span>
				<span className="ax-icon-btn" data-variant="tinted">
					<Download className="ax-glyph" size={20} strokeWidth={1.9} />
				</span>
			</div>

			<div
				className="ax-list"
				data-variant="plain"
				style={{ marginTop: 16, padding: "0 4px" }}
			>
				{tracks.map(([title, time], i) => (
					<div className="ax-item" key={title}>
						<span
							className="ax-footnote ax-muted"
							style={{
								width: 20,
								textAlign: "center",
								fontVariantNumeric: "tabular-nums",
							}}
						>
							{i === playing ? (
								<AudioLines
									className="ax-glyph ax-link"
									size={18}
									strokeWidth={2}
								/>
							) : (
								i + 1
							)}
						</span>
						<span className="ax-item-content">
							<span
								className={`ax-item-title${i === playing ? " ax-link ax-semibold" : ""}`}
							>
								{title}
							</span>
						</span>
						<span className="ax-item-trailing">{time}</span>
					</div>
				))}
			</div>

			<div className="ax-fill" />
		</DeviceFrame>
	);
}
