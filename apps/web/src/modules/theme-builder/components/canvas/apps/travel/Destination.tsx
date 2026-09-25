// The hero screen: an editorial destination page. A tall picture, big type,
// three facts and a short itinerary — highlight marks the recommendation.

import { CalendarDays, ChevronLeft, Heart, Star, Sun } from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";
import { Artwork } from "../Artwork";

const onImage = {
	background: "var(--ax-background-elevated)",
	boxShadow: "var(--ax-shadow)",
};

const facts = [
	[Sun, "18°C", "Mild, dry"],
	[CalendarDays, "4 days", "Suggested"],
	[Star, "4.8", "2.1k reviews"],
] as const;

const days = [
	["Day 1", "Fushimi Inari", "Sunrise hike"],
	["Day 2", "Arashiyama", "Bamboo grove"],
	["Day 3", "Gion", "Tea at dusk"],
] as const;

export function Destination() {
	return (
		<DeviceFrame label="Destination" caption="Destination">
			<div style={{ position: "relative" }}>
				<Artwork
					cover="kyoto"
					size="fill"
					height={320}
					radius="none"
					label="Kyoto"
				/>
				<div
					className="ax-row"
					data-justify="between"
					style={{ position: "absolute", top: 8, left: 16, right: 16 }}
				>
					<span className="ax-icon-btn" style={onImage}>
						<ChevronLeft
							className="ax-glyph"
							size={24}
							strokeWidth={1.9}
						/>
					</span>
					<span className="ax-icon-btn" style={onImage}>
						<Heart
							className="ax-glyph ax-link"
							size={20}
							strokeWidth={1.9}
							fill="currentColor"
						/>
					</span>
				</div>
				<span
					className="ax-badge"
					style={{
						position: "absolute",
						left: 20,
						bottom: 16,
						background: "var(--ax-highlight-default)",
						color: "var(--ax-highlight-on)",
					}}
				>
					Editor's pick
				</span>
			</div>

			<div
				className="ax-stack"
				data-gap="4"
				style={{ padding: "20px 20px 0" }}
			>
				<span
					className="ax-caption ax-muted"
					style={{ letterSpacing: "0.08em" }}
				>
					JAPAN · KANSAI
				</span>
				<span className="ax-large-title">Kyoto</span>
				<span className="ax-subhead ax-muted">
					Temples at dawn, tea at dusk.
				</span>
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "20px 20px 0" }}
			>
				{facts.map(([Icon, value, label]) => (
					<span className="ax-row" data-gap="12" key={value}>
						<Icon
							className="ax-glyph"
							size={22}
							strokeWidth={1.9}
							style={
								Icon === Star
									? { color: "var(--ax-highlight-default)" }
									: undefined
							}
							fill={Icon === Star ? "currentColor" : "none"}
						/>
						<span className="ax-stack" style={{ gap: 0 }}>
							<span className="ax-headline">{value}</span>
							<span className="ax-caption ax-muted">{label}</span>
						</span>
					</span>
				))}
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "24px 20px 12px" }}
			>
				<span className="ax-title3">Itinerary</span>
				<span className="ax-footnote ax-link">See all</span>
			</div>
			<div className="ax-carousel" style={{ padding: "0 20px" }}>
				{days.map(([day, place, note]) => (
					<div
						className="ax-card"
						data-variant="outlined"
						style={{ width: 150 }}
						key={day}
					>
						<div className="ax-stack" style={{ gap: 2, padding: 12 }}>
							<span className="ax-caption ax-link">{day}</span>
							<span className="ax-subhead ax-semibold">{place}</span>
							<span className="ax-footnote ax-muted">{note}</span>
						</div>
					</div>
				))}
			</div>

			<div className="ax-fill" />

			<div
				className="ax-row"
				data-gap="16"
				style={{ padding: "0 20px 36px" }}
			>
				<span className="ax-stack" style={{ gap: 0 }}>
					<span className="ax-caption ax-muted">From</span>
					<span className="ax-title3">$1,240</span>
				</span>
				<span className="ax-btn" data-size="lg" style={{ flex: 1 }}>
					Plan trip
				</span>
			</div>
		</DeviceFrame>
	);
}
