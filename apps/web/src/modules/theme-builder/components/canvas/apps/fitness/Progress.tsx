// Progress — one weekly chart, a headline number and two records. Today is
// the link color, the missed day the error color.

import {
	Activity,
	Award,
	ChartColumn,
	Dumbbell,
	Flame,
	Trophy,
	User,
} from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";
import { Bars } from "../charts";

const week = [42, 0, 55, 38, 64, 72, 30] as const;
const days = ["M", "T", "W", "T", "F", "S", "S"] as const;
const today = 6;
const missed = 1;

const records = [
	[Flame, "Streak", "6 days"],
	[Trophy, "Best 5K", "24:18"],
] as const;

export function Progress() {
	return (
		<DeviceFrame label="Progress" caption="Progress">
			<div style={{ padding: "8px 20px 0" }}>
				<span className="ax-large-title">Progress</span>
			</div>

			<div className="ax-segmented" style={{ margin: "12px 20px 0" }}>
				<span data-active>Week</span>
				<span>Month</span>
				<span>Year</span>
			</div>

			<div
				className="ax-stack"
				data-gap="4"
				style={{ padding: "24px 20px 0" }}
			>
				<span className="ax-footnote ax-muted">Training time</span>
				<span
					style={{
						fontSize: 48,
						fontFamily: "var(--ax-font-heading)",
						lineHeight: "54px",
						fontWeight: 800,
						letterSpacing: "-1.5px",
						fontVariantNumeric: "tabular-nums",
					}}
				>
					5 h 12 min
				</span>
				<span className="ax-row" data-gap="8">
					<span className="ax-badge" data-variant="success">
						+18%
					</span>
					<span className="ax-footnote ax-muted">vs last week</span>
				</span>
			</div>

			<div style={{ padding: "24px 20px 0" }}>
				<Bars
					values={week}
					labels={days}
					height={130}
					color={(i) =>
						i === today
							? "var(--ax-content-link)"
							: i === missed
								? "var(--ax-feedback-error)"
								: "var(--ax-border-default)"
					}
				/>
				<div className="ax-row" data-gap="8" style={{ marginTop: 12 }}>
					<span className="ax-badge" data-variant="error">
						Missed Tuesday
					</span>
				</div>
			</div>

			<div
				className="ax-row"
				data-gap="12"
				style={{ padding: "20px 20px 0" }}
			>
				{records.map(([Icon, label, value]) => (
					<div
						className="ax-card"
						data-variant="filled"
						style={{ flex: 1 }}
						key={label}
					>
						<div
							className="ax-stack"
							data-gap="8"
							style={{ padding: 16 }}
						>
							<Icon
								className="ax-glyph ax-link"
								size={22}
								strokeWidth={1.9}
							/>
							<span className="ax-stack" style={{ gap: 0 }}>
								<span className="ax-footnote ax-muted">{label}</span>
								<span className="ax-title2">{value}</span>
							</span>
						</div>
					</div>
				))}
			</div>

			<div className="ax-chips" style={{ padding: "16px 20px 0" }}>
				{["First 10K", "Early bird", "30 workouts"].map((badge) => (
					<span
						className="ax-chip"
						data-size="sm"
						data-variant="filled"
						key={badge}
					>
						<Award className="ax-glyph" size={14} strokeWidth={2} />
						{badge}
					</span>
				))}
			</div>

			<div className="ax-fill" />
			<div className="ax-tabbar">
				<span className="ax-tabbar-item">
					<Activity className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Today</span>
				</span>
				<span className="ax-tabbar-item">
					<Dumbbell className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Workouts</span>
				</span>
				<span className="ax-tabbar-item" data-active>
					<ChartColumn className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Progress</span>
				</span>
				<span className="ax-tabbar-item">
					<User className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Profile</span>
				</span>
			</div>
		</DeviceFrame>
	);
}
