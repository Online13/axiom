// The hero screen: the balance first, then its curve, three actions and the
// allocation. Premium means few things, large, with room around them.

import { ArrowLeftRight, ArrowUpRight, Bell, Plus } from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";
import { LineChart } from "../charts";

const curve = [
	18.2, 18.9, 18.4, 19.6, 20.1, 19.7, 21.2, 21.9, 21.4, 22.8, 23.5, 23.1, 24.2,
	24.8,
] as const;

const actions = [
	[Plus, "Add", "solid"],
	[ArrowUpRight, "Send", "tinted"],
	[ArrowLeftRight, "Exchange", "tinted"],
] as const;

const allocation = [
	["Equity", 52, "var(--ax-link-600)"],
	["Crypto", 28, "var(--ax-link-300)"],
	["Cash", 12, "var(--ax-highlight-default)"],
	["Gold", 8, "var(--ax-neutral-400)"],
] as const;

const assets = [
	["EQ", "Global equity", "$12,906", "+1.2%", true],
	["₿", "Bitcoin", "$8,412", "−2.1%", false],
	["AU", "Gold", "$1,985", "+0.4%", true],
] as const;

export function Portfolio() {
	return (
		<DeviceFrame label="Portfolio" caption="Portfolio">
			<div className="ax-appbar">
				<span className="ax-appbar-slot" style={{ paddingLeft: 12 }}>
					<span className="ax-avatar" data-size="sm" data-photo="1">
						RM
					</span>
				</span>
				<span className="ax-appbar-title">North</span>
				<span className="ax-appbar-slot" data-side="end">
					<span className="ax-icon-btn">
						<Bell className="ax-glyph" size={22} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div
				className="ax-stack"
				data-gap="4"
				style={{ padding: "16px 20px 0" }}
			>
				<span className="ax-footnote ax-muted">Total balance</span>
				<span
					style={{
						fontSize: 48,
						fontFamily: "var(--ax-font-heading)",
						lineHeight: "54px",
						fontWeight: 700,
						letterSpacing: "-1.5px",
						fontVariantNumeric: "tabular-nums",
					}}
				>
					$24,820<span className="ax-subtle">.45</span>
				</span>
				<span className="ax-row" data-gap="8">
					<span className="ax-badge" data-variant="success">
						+4.8%
					</span>
					<span className="ax-footnote ax-muted">+$1,136 this month</span>
				</span>
			</div>

			<div style={{ padding: "24px 20px 0" }}>
				<LineChart points={curve} width={353} height={130} />
			</div>

			<div
				className="ax-row"
				data-justify="center"
				style={{ gap: 36, padding: "28px 20px 0" }}
			>
				{actions.map(([Icon, label, variant]) => (
					<span
						className="ax-stack"
						data-gap="8"
						style={{ alignItems: "center" }}
						key={label}
					>
						<span
							className="ax-icon-btn"
							data-variant={variant}
							data-size="lg"
						>
							<Icon className="ax-glyph" size={22} strokeWidth={2} />
						</span>
						<span className="ax-footnote">{label}</span>
					</span>
				))}
			</div>

			<div
				className="ax-stack"
				data-gap="12"
				style={{ padding: "28px 20px 0" }}
			>
				<span className="ax-row" data-justify="between">
					<span className="ax-headline">Allocation</span>
					<span className="ax-footnote ax-muted">4 assets</span>
				</span>
				<span className="ax-row" style={{ gap: 3, height: 10 }}>
					{allocation.map(([name, share, color]) => (
						<span
							key={name}
							style={{
								flex: share,
								height: "100%",
								borderRadius: "var(--ax-radius-sm)",
								background: color,
							}}
						/>
					))}
				</span>
				<span className="ax-row" data-justify="between">
					{allocation.map(([name, share, color]) => (
						<span className="ax-row ax-caption" data-gap="4" key={name}>
							<span
								className="ax-badge-dot"
								style={{ background: color }}
							/>
							{name} <span className="ax-muted">{share}%</span>
						</span>
					))}
				</span>
			</div>

			<div
				className="ax-list"
				data-variant="plain"
				style={{ marginTop: 12 }}
			>
				{assets.map(([mark, name, value, change, up]) => (
					<div
						className="ax-item"
						key={name}
						style={{ padding: "10px 20px" }}
					>
						<span className="ax-avatar" data-size="sm">
							{mark}
						</span>
						<span className="ax-item-content">
							<span className="ax-item-title">{name}</span>
						</span>
						<span
							className="ax-stack"
							style={{ alignItems: "flex-end", gap: 0 }}
						>
							<span className="ax-subhead ax-semibold">{value}</span>
							<span
								className={`ax-footnote ${up ? "ax-success" : "ax-danger"}`}
							>
								{change}
							</span>
						</span>
					</div>
				))}
			</div>

			<div className="ax-fill" />
		</DeviceFrame>
	);
}
