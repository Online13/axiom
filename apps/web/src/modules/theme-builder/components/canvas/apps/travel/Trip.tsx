// Trip — dates, then a timeline where every step is its own kind of card:
// elevated flight, filled transfer, outlined hotel, tinted activity.

import {
	ChevronLeft,
	Hotel,
	MapPin,
	Plane,
	Share2,
	TrainFront,
} from "lucide-react";
import type { ReactNode } from "react";
import { DeviceFrame } from "../../DeviceFrame";
import { Artwork } from "../Artwork";

function Step({
	icon,
	time,
	children,
}: {
	icon: ReactNode;
	time: string;
	children: ReactNode;
}) {
	return (
		<div
			className="ax-row"
			data-align="start"
			data-gap="12"
			style={{ position: "relative" }}
		>
			<span
				className="ax-stack"
				data-gap="4"
				style={{ alignItems: "center", width: 44, paddingTop: 4 }}
			>
				<span className="ax-tile" data-color="link">
					{icon}
				</span>
				<span className="ax-caption ax-muted">{time}</span>
			</span>
			<div style={{ flex: 1, minWidth: 0 }}>{children}</div>
		</div>
	);
}

export function Trip() {
	return (
		<DeviceFrame label="Trip" caption="Trip" grouped>
			<div className="ax-appbar">
				<span className="ax-appbar-slot">
					<span className="ax-appbar-back">
						<ChevronLeft
							className="ax-glyph"
							size={28}
							strokeWidth={1.9}
						/>
						Trips
					</span>
				</span>
				<span className="ax-appbar-title">Kyoto</span>
				<span className="ax-appbar-slot" data-side="end">
					<span className="ax-icon-btn">
						<Share2 className="ax-glyph" size={20} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "8px 20px 16px" }}
			>
				<span className="ax-stack" data-gap="4">
					<span className="ax-title1">12 – 15 Oct</span>
					<span className="ax-footnote ax-muted">
						4 days · 2 travelers
					</span>
				</span>
				<span className="ax-avatar-group">
					<span className="ax-avatar" data-size="sm" data-photo="1">
						RM
					</span>
					<span className="ax-avatar" data-size="sm" data-photo="2">
						KJ
					</span>
				</span>
			</div>

			<div className="ax-tabs">
				<span data-active>Itinerary</span>
				<span>Bookings</span>
				<span>Notes</span>
			</div>

			<div
				className="ax-stack"
				data-gap="16"
				style={{ padding: "20px 20px 0" }}
			>
				<Step
					icon={<Plane className="ax-glyph" size={16} strokeWidth={2.2} />}
					time="11:40"
				>
					<div className="ax-card">
						<div className="ax-card-content">
							<div className="ax-row" data-justify="between">
								<span className="ax-title2">CDG</span>
								<span
									style={{
										flex: 1,
										height: 1,
										margin: "0 10px",
										background: "var(--ax-border-default)",
									}}
								/>
								<span className="ax-title2">KIX</span>
							</div>
							<div
								className="ax-row"
								data-justify="between"
								style={{ marginTop: 6 }}
							>
								<span className="ax-footnote ax-muted">
									AF 292 · arrives 07:55
								</span>
								<span className="ax-badge" data-variant="success">
									Confirmed
								</span>
							</div>
						</div>
					</div>
				</Step>

				<Step
					icon={
						<TrainFront
							className="ax-glyph"
							size={16}
							strokeWidth={2.2}
						/>
					}
					time="08:30"
				>
					<div className="ax-card" data-variant="filled">
						<div className="ax-card-content ax-stack" style={{ gap: 2 }}>
							<span className="ax-headline">Haruka Express</span>
							<span className="ax-footnote ax-muted">
								Kansai Airport → Kyoto · 75 min
							</span>
						</div>
					</div>
				</Step>

				<Step
					icon={<Hotel className="ax-glyph" size={16} strokeWidth={2.2} />}
					time="15:00"
				>
					<div className="ax-card" data-variant="outlined">
						<div className="ax-card-content ax-row" data-gap="12">
							<Artwork cover="kyoto" size={52} radius="md" />
							<span className="ax-stack ax-grow" style={{ gap: 2 }}>
								<span className="ax-headline">Hotel Kanra</span>
								<span className="ax-footnote ax-muted">
									Check-in · 3 nights
								</span>
							</span>
							<span className="ax-badge" data-variant="warning">
								Pending
							</span>
						</div>
					</div>
				</Step>

				<Step
					icon={
						<MapPin className="ax-glyph" size={16} strokeWidth={2.2} />
					}
					time="05:30"
				>
					<div className="ax-alert">
						<span className="ax-stack" style={{ gap: 2 }}>
							<span className="ax-alert-title">
								Fushimi Inari at dawn
							</span>
							<span className="ax-alert-desc">
								Day 2 · beat the crowds
							</span>
						</span>
					</div>
				</Step>
			</div>

			<div className="ax-fill" />
		</DeviceFrame>
	);
}
