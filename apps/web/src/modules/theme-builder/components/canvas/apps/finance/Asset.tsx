// Asset — one holding: value, today's move in the error color, a full-bleed
// chart, the period selector and the two trade actions.

import { ChevronLeft, Star } from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";
import { LineChart } from "../charts";

const curve = [
	7.9, 8.1, 8.0, 8.3, 8.5, 8.4, 8.7, 8.9, 8.8, 8.95, 8.7, 8.6, 8.5, 8.41,
] as const;

const stats = [
	["Holdings", "0.1284 BTC"],
	["Avg. buy", "$7,120"],
	["24h high", "$8,640"],
	["24h low", "$8,310"],
] as const;

export function Asset() {
	return (
		<DeviceFrame label="Asset" caption="Asset">
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
				<span className="ax-appbar-title">Bitcoin</span>
				<span className="ax-appbar-slot" data-side="end">
					<span className="ax-icon-btn">
						<Star className="ax-glyph" size={22} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div
				className="ax-stack"
				data-gap="4"
				style={{ padding: "16px 20px 0" }}
			>
				<span className="ax-footnote ax-muted">BTC · Your position</span>
				<span
					style={{
						fontSize: 44,
						fontFamily: "var(--ax-font-heading)",
						lineHeight: "50px",
						fontWeight: 700,
						letterSpacing: "-1.4px",
						fontVariantNumeric: "tabular-nums",
					}}
				>
					$8,412.50
				</span>
				<span className="ax-row" data-gap="8">
					<span className="ax-badge" data-variant="error">
						−2.1%
					</span>
					<span className="ax-footnote ax-muted">−$180.40 today</span>
				</span>
			</div>

			<div style={{ padding: "32px 0 0" }}>
				<LineChart points={curve} width={393} height={210} />
			</div>

			<div className="ax-segmented" style={{ margin: "28px 20px 0" }}>
				<span>1D</span>
				<span>1W</span>
				<span data-active>1M</span>
				<span>1Y</span>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "20px 16px",
					padding: "28px 20px 0",
				}}
			>
				{stats.map(([label, value]) => (
					<span className="ax-stack" style={{ gap: 2 }} key={label}>
						<span className="ax-footnote ax-muted">{label}</span>
						<span className="ax-headline">{value}</span>
					</span>
				))}
			</div>

			<div className="ax-fill" />

			<div
				className="ax-row"
				data-gap="12"
				style={{ padding: "0 20px 40px" }}
			>
				<span
					className="ax-btn"
					data-size="lg"
					data-variant="outline"
					style={{ flex: 1 }}
				>
					Sell
				</span>
				<span className="ax-btn" data-size="lg" style={{ flex: 1 }}>
					Buy
				</span>
			</div>
		</DeviceFrame>
	);
}
