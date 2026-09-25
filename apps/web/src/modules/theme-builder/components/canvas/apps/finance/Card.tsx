// Card — the virtual card on the inverse surface, its controls, the spending
// limit and no more than three transactions.

import {
	Coffee,
	Globe,
	Nfc,
	Plus,
	RotateCcw,
	Snowflake,
	TramFront,
} from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";

const controls = [
	[Snowflake, "Freeze card", false],
	[Globe, "Online payments", true],
	[Nfc, "Contactless", true],
] as const;

const transactions = [
	[Coffee, "Café Lune", "Today · 08:12", "−$4.80", false],
	[TramFront, "Metro", "Yesterday", "−$2.40", false],
	[RotateCcw, "Refund · Nomad", "Tuesday", "+$18.00", true],
] as const;

export function Card() {
	return (
		<DeviceFrame label="Card" caption="Card">
			<div className="ax-appbar">
				<span className="ax-appbar-slot" />
				<span className="ax-appbar-title">Card</span>
				<span className="ax-appbar-slot" data-side="end">
					<span className="ax-icon-btn">
						<Plus className="ax-glyph" size={24} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div style={{ padding: "12px 20px 0" }}>
				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						height: 212,
						padding: 20,
						overflow: "hidden",
						borderRadius: "var(--ax-radius-xl)",
						background: "var(--ax-background-inverse)",
						color: "var(--ax-content-inverse)",
					}}
				>
					<svg
						width="240"
						height="240"
						viewBox="0 0 240 240"
						aria-hidden="true"
						style={{
							position: "absolute",
							right: -70,
							top: -40,
							opacity: 0.08,
						}}
					>
						{[40, 80, 120].map((r) => (
							<circle
								key={r}
								cx="120"
								cy="120"
								r={r}
								fill="none"
								stroke="currentColor"
								strokeWidth="18"
							/>
						))}
					</svg>
					<div className="ax-row" data-justify="between">
						<span className="ax-headline">North</span>
						<Nfc className="ax-glyph" size={22} strokeWidth={1.9} />
					</div>
					<span
						style={{
							width: 42,
							height: 32,
							borderRadius: "var(--ax-radius-sm)",
							background: "var(--ax-highlight-default)",
						}}
					/>
					<div
						className="ax-row"
						data-justify="between"
						style={{ alignItems: "flex-end" }}
					>
						<span className="ax-stack" style={{ gap: 2 }}>
							<span
								className="ax-callout"
								style={{ letterSpacing: "0.12em" }}
							>
								•••• 4821
							</span>
							<span className="ax-caption" style={{ opacity: 0.7 }}>
								RAYANE M.
							</span>
						</span>
						<span className="ax-caption" style={{ opacity: 0.7 }}>
							09/29
						</span>
					</div>
				</div>
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "20px 20px 0" }}
			>
				<span className="ax-stack" style={{ gap: 0 }}>
					<span className="ax-footnote ax-muted">Available</span>
					<span className="ax-title1">$3,240.18</span>
				</span>
				<span className="ax-btn" data-size="sm" data-variant="outline">
					Top up
				</span>
			</div>

			<div
				className="ax-list"
				data-variant="outlined"
				style={{ margin: "16px 20px 0" }}
			>
				{controls.map(([Icon, label, on]) => (
					<div className="ax-item" key={label}>
						<Icon
							className="ax-glyph ax-muted"
							size={20}
							strokeWidth={1.9}
						/>
						<span className="ax-item-content">
							<span className="ax-item-title">{label}</span>
						</span>
						<span className="ax-switch" data-checked={on || undefined} />
					</div>
				))}
			</div>

			<div
				className="ax-stack"
				data-gap="8"
				style={{ padding: "20px 20px 0" }}
			>
				<span className="ax-row" data-justify="between">
					<span className="ax-subhead ax-semibold">Spending limit</span>
					<span className="ax-footnote ax-muted">$1,240 of $2,000</span>
				</span>
				<div className="ax-progress">
					<span style={{ width: "62%" }} />
				</div>
			</div>

			<div className="ax-stack" style={{ gap: 14, padding: "20px 20px 0" }}>
				{transactions.map(([Icon, name, when, amount, credit]) => (
					<span className="ax-row" data-gap="12" key={name}>
						<span className="ax-avatar" data-size="sm">
							<Icon className="ax-glyph" size={16} strokeWidth={2} />
						</span>
						<span className="ax-stack ax-grow" style={{ gap: 0 }}>
							<span className="ax-subhead ax-semibold">{name}</span>
							<span className="ax-caption ax-muted">{when}</span>
						</span>
						<span
							className={`ax-subhead ax-semibold${credit ? " ax-success" : ""}`}
						>
							{amount}
						</span>
					</span>
				))}
			</div>

			<div className="ax-fill" />
		</DeviceFrame>
	);
}
