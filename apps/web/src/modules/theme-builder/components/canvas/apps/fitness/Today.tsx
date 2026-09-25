// The hero screen: one big ring and big numbers with plenty of air. Success
// marks the goal already met, warning the one that is slipping.

import {
	Activity,
	ChartColumn,
	Check,
	Dumbbell,
	Flame,
	Play,
	TriangleAlert,
	User,
} from "lucide-react";
import { DeviceFrame } from "../../DeviceFrame";
import { Ring } from "../charts";

const metrics = [
	["Steps", "8,420", "steps", true],
	["Calories", "512", "kcal", false],
	["Training", "42", "min", false],
] as const;

export function Today() {
	return (
		<DeviceFrame label="Today" caption="Today">
			<div
				className="ax-row"
				data-justify="between"
				style={{ padding: "8px 20px 0" }}
			>
				<span className="ax-stack" data-gap="4">
					<span className="ax-footnote ax-muted">
						Thursday, 25 September
					</span>
					<span className="ax-large-title">Today</span>
				</span>
				<span className="ax-avatar" data-photo="1">
					RM
				</span>
			</div>

			<div
				className="ax-row"
				data-justify="center"
				style={{ paddingTop: 24 }}
			>
				<Ring value={0.72} size={236} width={20}>
					<span
						className="ax-caption ax-muted"
						style={{ letterSpacing: "0.08em" }}
					>
						MOVE
					</span>
					<span
						style={{
							fontSize: 64,
							fontFamily: "var(--ax-font-heading)",
							lineHeight: "68px",
							fontWeight: 800,
							letterSpacing: "-2px",
							fontVariantNumeric: "tabular-nums",
						}}
					>
						72%
					</span>
					<span className="ax-footnote ax-muted">of daily goal</span>
				</Ring>
			</div>

			<div style={{ padding: "28px 20px 0" }}>
				<div className="ax-card" data-variant="filled">
					<div className="ax-row" style={{ padding: "16px 4px" }}>
						{metrics.map(([label, value, unit, done]) => (
							<span
								className="ax-stack"
								style={{ flex: 1, alignItems: "center", gap: 2 }}
								key={label}
							>
								<span
									className="ax-row ax-caption ax-muted"
									data-gap="4"
								>
									{done && (
										<Check
											className="ax-glyph ax-success"
											size={13}
											strokeWidth={3}
										/>
									)}
									{label}
								</span>
								<span
									className="ax-title2"
									style={{ fontVariantNumeric: "tabular-nums" }}
								>
									{value}
								</span>
								<span className="ax-caption ax-muted">{unit}</span>
							</span>
						))}
					</div>
				</div>
			</div>

			<div className="ax-body" style={{ padding: "12px 20px 0" }}>
				<div className="ax-alert" data-variant="warning">
					<TriangleAlert
						className="ax-glyph"
						size={20}
						strokeWidth={1.9}
					/>
					<span className="ax-stack" style={{ gap: 2 }}>
						<span className="ax-alert-title">Stand goal slipping</span>
						<span className="ax-alert-desc">
							Stand for 2 more hours to close it.
						</span>
					</span>
				</div>
			</div>

			<div
				className="ax-row"
				data-gap="12"
				style={{ padding: "16px 20px 0" }}
			>
				<span
					className="ax-tile"
					data-size="lg"
					style={{
						background: "var(--ax-highlight-default)",
						color: "var(--ax-highlight-on)",
					}}
				>
					<Flame className="ax-glyph" size={22} strokeWidth={2} />
				</span>
				<span className="ax-stack" style={{ gap: 0 }}>
					<span className="ax-headline">6 day streak</span>
					<span className="ax-footnote ax-muted">
						Your best is 14 days
					</span>
				</span>
			</div>

			<div className="ax-fill" />

			<div style={{ padding: "0 20px 16px" }}>
				<span className="ax-btn" data-size="lg" data-block>
					<Play
						className="ax-glyph"
						size={18}
						strokeWidth={1.6}
						fill="currentColor"
					/>
					Start workout
				</span>
			</div>

			<div className="ax-tabbar">
				<span className="ax-tabbar-item" data-active>
					<Activity className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Today</span>
				</span>
				<span className="ax-tabbar-item">
					<Dumbbell className="ax-glyph" size={24} strokeWidth={1.9} />
					<span>Workouts</span>
				</span>
				<span className="ax-tabbar-item">
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
