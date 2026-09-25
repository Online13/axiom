// Small data shapes for the Fitness and Finance previews. They only read
// `--ax-*` variables, so a seed change recolors them like any component.

import type { ReactNode } from "react";

/** A progress ring with its content centered inside. */
export function Ring({
	value,
	size,
	width,
	color = "var(--ax-content-link)",
	children,
}: {
	value: number;
	size: number;
	width: number;
	color?: string;
	children?: ReactNode;
}) {
	const r = (size - width) / 2;
	const length = 2 * Math.PI * r;
	return (
		<span
			style={{
				position: "relative",
				display: "inline-flex",
				width: size,
				height: size,
			}}
		>
			<svg
				width={size}
				height={size}
				aria-hidden="true"
				style={{ transform: "rotate(-90deg)" }}
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					strokeWidth={width}
					style={{ stroke: "var(--ax-border-subtle)" }}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					strokeWidth={width}
					strokeLinecap="round"
					strokeDasharray={`${length * value} ${length}`}
					style={{ stroke: color }}
				/>
			</svg>
			<span
				className="ax-stack"
				style={{
					position: "absolute",
					inset: 0,
					alignItems: "center",
					justifyContent: "center",
					gap: 0,
				}}
			>
				{children}
			</span>
		</span>
	);
}

/** Vertical bars; the radius follows the theme's small radius. */
export function Bars({
	values,
	labels,
	height,
	color,
}: {
	values: readonly number[];
	labels: readonly string[];
	height: number;
	/** Per-bar fill, e.g. to single out today or a missed day. */
	color: (index: number) => string;
}) {
	const max = Math.max(...values, 1);
	return (
		<div className="ax-stack" data-gap="8">
			<div
				className="ax-row"
				style={{ alignItems: "flex-end", height, gap: 10 }}
			>
				{values.map((value, i) => (
					<span
						key={i}
						style={{
							flex: 1,
							height: `${Math.max(value / max, 0.04) * 100}%`,
							borderRadius: "var(--ax-radius-sm)",
							background: color(i),
						}}
					/>
				))}
			</div>
			<div className="ax-row" style={{ gap: 10 }}>
				{labels.map((label, i) => (
					<span
						key={i}
						className="ax-caption ax-muted"
						style={{ flex: 1, textAlign: "center" }}
					>
						{label}
					</span>
				))}
			</div>
		</div>
	);
}

/** A line chart with a soft area under it. */
export function LineChart({
	points,
	width,
	height,
	color = "var(--ax-content-link)",
}: {
	points: readonly number[];
	width: number;
	height: number;
	color?: string;
}) {
	const min = Math.min(...points);
	const max = Math.max(...points);
	const x = (i: number) => (i / (points.length - 1)) * width;
	const y = (v: number) =>
		height - 4 - ((v - min) / (max - min || 1)) * (height - 8);
	const line = points
		.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
		.join(" ");
	const last = points[points.length - 1];
	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			aria-hidden="true"
			style={{ display: "block", overflow: "visible" }}
		>
			<path
				d={`${line} L${width} ${height} L0 ${height} Z`}
				style={{ fill: color }}
				opacity={0.12}
			/>
			<path
				d={line}
				fill="none"
				strokeWidth={2.5}
				strokeLinejoin="round"
				strokeLinecap="round"
				style={{ stroke: color }}
			/>
			<circle
				cx={width}
				cy={y(last)}
				r={5}
				strokeWidth={3}
				style={{ fill: color, stroke: "var(--ax-background-default)" }}
			/>
		</svg>
	);
}
