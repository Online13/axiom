// Discover — one featured mix on the highlight fill, genre chips, a carousel
// of recent albums and the mini player docked above the tab bar. No long
// vertical lists: cards and covers carry the radius.

import { Heart, House, Library, Pause, Play, Search } from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";
import { Artwork, type Cover } from "../Artwork";

const genres = ["All", "Ambient", "Jazz", "Focus", "Electronic"] as const;

const recent: readonly [string, string, Cover][] = [
	["Low Tide", "Nova", "tide"],
	["Glasshouse", "Halden", "glass"],
	["Dune Songs", "Lune", "dune"],
];

export function Discover() {
	return (
		<DeviceFrame label="Discover" caption="Discover">
			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "8px 20px 0" }}
			>
				<span className="ax-stack" data-gap="4">
					<span className="ax-footnote ax-muted">Good evening</span>
					<span className="ax-large-title">Made for you</span>
				</span>
				<span className="ax-avatar" data-photo="1">
					RM
				</span>
			</div>

			<div className="ax-chips" style={{ padding: "20px 20px 0" }}>
				{genres.map((genre, i) => (
					<span
						className="ax-chip"
						data-size="sm"
						data-selected={i === 0 || undefined}
						key={genre}
					>
						{genre}
					</span>
				))}
			</div>

			<div style={{ padding: "24px 20px 0" }}>
				<div
					className="ax-card"
					style={{
						background: "var(--ax-highlight-default)",
						color: "var(--ax-highlight-on)",
						boxShadow: "none",
					}}
				>
					<div className="ax-row" data-gap="16" style={{ padding: 16 }}>
						<Artwork cover="mix" size={112} radius="md" />
						<span className="ax-stack ax-grow" data-gap="4">
							<span
								className="ax-caption"
								style={{ opacity: 0.7, letterSpacing: "0.06em" }}
							>
								DAILY MIX
							</span>
							<span className="ax-title2">Slow Mornings</span>
							<span className="ax-footnote" style={{ opacity: 0.75 }}>
								Nova, Halden, Lune
							</span>
						</span>
					</div>
					<div
						className="ax-row"
						data-justify="between"
						style={{ padding: "0 16px 16px" }}
					>
						<span className="ax-footnote" style={{ opacity: 0.75 }}>
							24 songs · 1 h 32 min
						</span>
						<span className="ax-icon-btn" data-variant="solid">
							<Play
								className="ax-glyph"
								size={20}
								strokeWidth={1.6}
								fill="currentColor"
							/>
						</span>
					</div>
				</div>
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "28px 20px 12px" }}
			>
				<span className="ax-title3">Recently played</span>
				<span className="ax-footnote ax-link">See all</span>
			</div>
			<div className="ax-carousel" style={{ padding: "0 20px" }}>
				{recent.map(([title, artist, cover]) => (
					<span
						className="ax-stack"
						data-gap="8"
						style={{ width: 140 }}
						key={title}
					>
						<Artwork cover={cover} size={140} />
						<span className="ax-stack" style={{ gap: 0 }}>
							<span className="ax-subhead ax-semibold ax-truncate">
								{title}
							</span>
							<span className="ax-footnote ax-muted">{artist}</span>
						</span>
					</span>
				))}
			</div>

			<div className="ax-fill" />

			<div style={{ padding: "0 10px 10px" }}>
				<div className="ax-card">
					<div
						className="ax-row"
						data-gap="12"
						style={{ padding: "8px 8px 6px" }}
					>
						<Artwork cover="hours" size={44} radius="sm" />
						<span className="ax-stack ax-grow" style={{ gap: 0 }}>
							<span className="ax-subhead ax-semibold ax-truncate">
								Quiet Hours
							</span>
							<span className="ax-footnote ax-link">
								Nova · Living room
							</span>
						</span>
						<Heart
							className="ax-glyph ax-link"
							size={22}
							strokeWidth={1.9}
							fill="currentColor"
						/>
						<span className="ax-icon-btn" data-size="sm">
							<Pause
								className="ax-glyph"
								size={22}
								strokeWidth={1.6}
								fill="currentColor"
							/>
						</span>
					</div>
					<div
						className="ax-progress"
						style={{ height: 2, margin: "0 14px 6px" }}
					>
						<span style={{ width: "38%" }} />
					</div>
				</div>
			</div>

			<div className="ax-tabbar">
				<span className="ax-tabbar-item" data-active>
					<House className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Home</span>
				</span>
				<span className="ax-tabbar-item">
					<Search className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Search</span>
				</span>
				<span className="ax-tabbar-item">
					<Library className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Library</span>
				</span>
			</div>
		</DeviceFrame>
	);
}
