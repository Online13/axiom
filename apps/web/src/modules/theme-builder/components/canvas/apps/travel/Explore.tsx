// Explore — search, categories, one featured destination and a row of
// popular places. The selected card carries the focus ring.

import { Bookmark, Compass, Plane, Search, Star, User } from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";
import { Artwork, type Cover } from "../Artwork";

const categories = ["All", "Cities", "Coast", "Mountains", "Food"] as const;

const popular: readonly [string, string, Cover][] = [
	["Reykjavík", "4.9", "fjord"],
	["Amalfi", "4.7", "coast"],
	["Kyoto", "4.8", "kyoto"],
];

export function Explore() {
	return (
		<DeviceFrame label="Explore" caption="Explore">
			<div
				className="ax-stack"
				data-gap="4"
				style={{ padding: "8px 20px 0" }}
			>
				<span className="ax-footnote ax-muted">Hi Rayane</span>
				<span className="ax-title1">Where to next?</span>
			</div>

			<div className="ax-body" style={{ padding: "16px 20px 0" }}>
				<div className="ax-searchbar">
					<Search className="ax-glyph" size={18} strokeWidth={1.9} />
					<span className="ax-placeholder">Search places</span>
				</div>
			</div>

			<div className="ax-chips" style={{ padding: "16px 20px 0" }}>
				{categories.map((category, i) => (
					<span
						className="ax-chip"
						data-size="sm"
						data-selected={i === 0 || undefined}
						key={category}
					>
						{category}
					</span>
				))}
			</div>

			<div style={{ padding: "20px 20px 0" }}>
				<div className="ax-card">
					<Artwork cover="lisbon" size="fill" height={170} radius="none" />
					<div
						className="ax-row"
						data-justify="between"
						style={{ padding: "12px 16px 14px" }}
					>
						<span className="ax-stack" style={{ gap: 2 }}>
							<span className="ax-title2">Lisbon</span>
							<span className="ax-footnote ax-muted">
								Portugal · 5 days · from $890
							</span>
						</span>
						<span
							className="ax-badge"
							style={{
								background: "var(--ax-highlight-default)",
								color: "var(--ax-highlight-on)",
							}}
						>
							Featured
						</span>
					</div>
				</div>
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "24px 20px 12px" }}
			>
				<span className="ax-title3">Popular now</span>
				<span className="ax-footnote ax-link">See all</span>
			</div>
			<div className="ax-carousel" style={{ padding: "4px 20px 0" }}>
				{popular.map(([name, rating, cover], i) => (
					<span
						className="ax-stack"
						data-gap="8"
						style={{ width: 140 }}
						key={name}
					>
						<span
							style={{
								display: "block",
								borderRadius: "var(--ax-radius-lg)",
								boxShadow:
									i === 0
										? "0 0 0 2px var(--ax-background-default), 0 0 0 4px var(--ax-border-focus)"
										: undefined,
							}}
						>
							<Artwork cover={cover} size={140} height={110} />
						</span>
						<span className="ax-row" data-justify="between">
							<span className="ax-subhead ax-semibold">{name}</span>
							<span className="ax-row ax-footnote ax-muted" data-gap="4">
								<Star
									className="ax-glyph"
									size={13}
									style={{ color: "var(--ax-highlight-default)" }}
									fill="currentColor"
								/>
								{rating}
							</span>
						</span>
					</span>
				))}
			</div>

			<div className="ax-fill" />
			<div className="ax-tabbar">
				<span className="ax-tabbar-item" data-active>
					<Compass className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Explore</span>
				</span>
				<span className="ax-tabbar-item">
					<Plane className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Trips</span>
				</span>
				<span className="ax-tabbar-item">
					<Bookmark className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Saved</span>
				</span>
				<span className="ax-tabbar-item">
					<User className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Profile</span>
				</span>
			</div>
		</DeviceFrame>
	);
}
