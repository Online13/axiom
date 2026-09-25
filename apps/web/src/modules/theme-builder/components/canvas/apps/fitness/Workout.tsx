// Workout — a live session: a huge timer, the current exercise and its sets.
// Done sets are success, the current one the link color.

import { Ellipsis, Pause, SkipForward, X } from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";

const stats = [
	["Reps", "10"],
	["Set", "2 / 4"],
	["Weight", "16 kg"],
] as const;

const sets = ["done", "done", "current", "next"] as const;

const setColor = {
	done: "var(--ax-feedback-success)",
	current: "var(--ax-content-link)",
	next: "var(--ax-border-default)",
} as const;

export function Workout() {
	return (
		<DeviceFrame label="Workout" caption="Workout">
			<div className="ax-appbar">
				<span className="ax-appbar-slot">
					<span className="ax-icon-btn">
						<X className="ax-glyph" size={24} strokeWidth={1.9} />
					</span>
				</span>
				<span className="ax-appbar-title">Lower body</span>
				<span className="ax-appbar-slot" data-side="end">
					<span className="ax-icon-btn">
						<Ellipsis className="ax-glyph" size={24} strokeWidth={1.9} />
					</span>
				</span>
			</div>

			<div
				className="ax-stack"
				data-gap="8"
				style={{ padding: "8px 20px 0" }}
			>
				<div className="ax-row" data-justify="between">
					<span className="ax-footnote ax-muted">Exercise 3 of 6</span>
					<span className="ax-footnote ax-muted">50%</span>
				</div>
				<div className="ax-progress">
					<span style={{ width: "50%" }} />
				</div>
			</div>

			<div
				className="ax-stack"
				style={{ alignItems: "center", gap: 0, padding: "40px 20px 0" }}
			>
				<span
					style={{
						fontSize: 88,
						fontFamily: "var(--ax-font-heading)",
						lineHeight: "92px",
						fontWeight: 700,
						letterSpacing: "-3px",
						fontVariantNumeric: "tabular-nums",
					}}
				>
					12:48
				</span>
				<span className="ax-footnote ax-muted">Elapsed</span>
			</div>

			<div style={{ padding: "36px 20px 0" }}>
				<div className="ax-card">
					<div className="ax-stack" data-gap="16" style={{ padding: 20 }}>
						<span className="ax-stack" style={{ gap: 2 }}>
							<span
								className="ax-caption ax-link"
								style={{ letterSpacing: "0.08em" }}
							>
								NOW
							</span>
							<span className="ax-title2">Bulgarian split squat</span>
						</span>
						<div className="ax-row" data-justify="between">
							{stats.map(([label, value]) => (
								<span
									className="ax-stack"
									style={{ gap: 0 }}
									key={label}
								>
									<span className="ax-caption ax-muted">{label}</span>
									<span className="ax-title3">{value}</span>
								</span>
							))}
						</div>
						<div className="ax-row" data-gap="8">
							{sets.map((set, i) => (
								<span
									key={i}
									style={{
										flex: 1,
										height: 6,
										borderRadius: 999,
										background: setColor[set],
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "20px 24px 0" }}
			>
				<span className="ax-stack" style={{ gap: 0 }}>
					<span className="ax-caption ax-muted">Up next</span>
					<span className="ax-subhead ax-semibold">
						Romanian deadlift · 3 × 12
					</span>
				</span>
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
					<Pause
						className="ax-glyph"
						size={18}
						strokeWidth={1.6}
						fill="currentColor"
					/>
					Pause
				</span>
				<span className="ax-btn" data-size="lg" style={{ flex: 1 }}>
					Next exercise
					<SkipForward
						className="ax-glyph"
						size={18}
						strokeWidth={1.6}
						fill="currentColor"
					/>
				</span>
			</div>
		</DeviceFrame>
	);
}
