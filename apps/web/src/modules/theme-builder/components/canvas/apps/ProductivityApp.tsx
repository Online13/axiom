// Tempo — focus sessions and habits. The one that stresses data surfaces:
// progress, stats, segmented controls and a dense settings screen.

import {
	BarChart3,
	Bell,
	ChevronLeft,
	ChevronRight,
	Clock,
	Grid3x3,
	Home,
	Moon,
	MoreHorizontal,
	Play,
	Sun,
	TriangleAlert,
	User,
} from "lucide-react";
import { DeviceFrame } from "../DeviceFrame";

const sessions = [
	["Deep work", "10:30 · 90 min", "DW"],
	["Design review", "12:00 · 45 min", "DR"],
	["Pairing on inputs", "14:30 · 60 min", "PI"],
	["Retro", "16:00 · 30 min", "RE"],
] as const;

const habits = [
	["Morning pages", 86],
	["Read 30 minutes", 62],
	["No phone before 9", 41],
] as const;

const settings = [
	["Appearance", "System", "accent", Sun],
	["Reminders", "On", "error", Bell],
	["Focus hours", "Weekdays", "neutral", Clock],
	["Connected apps", "4 apps", "success", Grid3x3],
] as const;

export function ProductivityApp() {
	return (
		<>
			<DeviceFrame label="Focus dashboard" caption="Focus">
				<div className="ax-appbar">
					<span className="ax-appbar-slot">
						<span className="ax-avatar" data-size="sm" data-photo="1">
							AM
						</span>
					</span>
					<span className="ax-appbar-title">Tempo</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-icon-btn">
							<Bell className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
					</span>
				</div>
				<div className="ax-large-heading">Today</div>

				<div className="ax-body">
					<div className="ax-card">
						<div className="ax-card-content">
							<div className="ax-row" data-justify="between">
								<span className="ax-footnote ax-muted">Focus time</span>
								<span className="ax-badge" data-variant="success">
									+18%
								</span>
							</div>
							<div className="ax-title2">4 h 20</div>
							<div className="ax-progress" style={{ marginTop: 10 }}>
								<span style={{ width: "68%" }} />
							</div>
							<div className="ax-footnote ax-muted" style={{ marginTop: 8 }}>
								12 of 18 sessions complete
							</div>
						</div>
					</div>
				</div>

				<div className="ax-body">
					<div className="ax-row">
						<span className="ax-btn" data-block style={{ flex: 1 }}>
							<Play className="ax-glyph" size={16} strokeWidth={2} fill="currentColor" />
							Start focus
						</span>
						<span className="ax-btn" data-variant="outline" data-block style={{ flex: 1 }}>
							Schedule
						</span>
					</div>
				</div>

				<div className="ax-section">Schedule</div>
				<div className="ax-list" data-inset>
					{sessions.map(([title, meta, initials]) => (
						<div className="ax-item" key={title}>
							<span className="ax-avatar" data-photo="2">
								{initials}
							</span>
							<span className="ax-item-content">
								<span className="ax-item-title">{title}</span>
								<span className="ax-item-desc">{meta}</span>
							</span>
							<span className="ax-item-trailing">
								<ChevronRight className="ax-glyph" size={18} strokeWidth={1.9} />
							</span>
						</div>
					))}
				</div>

				<div className="ax-fill" />
				<div className="ax-tabbar">
					<span className="ax-tabbar-item" data-active>
						<Home className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Today</span>
					</span>
					<span className="ax-tabbar-item">
						<BarChart3 className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Stats</span>
					</span>
					<span className="ax-tabbar-item">
						<Grid3x3 className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Habits</span>
					</span>
					<span className="ax-tabbar-item">
						<User className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Profile</span>
					</span>
				</div>
			</DeviceFrame>

			<DeviceFrame label="Habit detail" caption="Habits">
				<div className="ax-appbar" data-border>
					<span className="ax-appbar-slot">
						<span className="ax-appbar-back">
							<ChevronLeft className="ax-glyph" size={22} strokeWidth={1.9} />
							Today
						</span>
					</span>
					<span className="ax-appbar-title">Habits</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-icon-btn">
							<MoreHorizontal className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
					</span>
				</div>

				<div className="ax-body">
					<div className="ax-row" data-justify="between">
						<span className="ax-badge" data-variant="info">
							This week
						</span>
						<span className="ax-footnote ax-muted">Resets Monday</span>
					</div>
					<div className="ax-title2">Three streaks alive</div>
					<div className="ax-subhead ax-muted">
						Your longest run is 23 days on morning pages.
					</div>

					<div className="ax-segmented">
						<span data-active>Week</span>
						<span>Month</span>
						<span>Year</span>
					</div>
				</div>

				<div className="ax-body" style={{ gap: 14 }}>
					{habits.map(([title, value]) => (
						<div className="ax-stack" data-gap="6" key={title}>
							<div className="ax-row" data-justify="between">
								<span className="ax-subhead">{title}</span>
								<span className="ax-footnote ax-muted">{value}%</span>
							</div>
							<div className="ax-progress">
								<span style={{ width: `${value}%` }} />
							</div>
						</div>
					))}
				</div>

				<div className="ax-body">
					<div className="ax-alert" data-variant="warning">
						<TriangleAlert className="ax-glyph" size={20} strokeWidth={1.9} />
						<span className="ax-stack" data-gap="4">
							<span className="ax-alert-title">One habit is slipping</span>
							<span className="ax-alert-desc">
								No phone before 9 missed three days.
							</span>
						</span>
					</div>
				</div>

				<div className="ax-fill" />
			</DeviceFrame>

			<DeviceFrame label="Settings" caption="Settings" grouped>
				<div className="ax-appbar">
					<span className="ax-appbar-slot" />
					<span className="ax-appbar-title">Settings</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-link ax-text">Done</span>
					</span>
				</div>

				<div className="ax-body">
					<div className="ax-list" style={{ margin: 0 }}>
						<div className="ax-item" data-size="lg">
							<span className="ax-avatar" data-size="lg" data-photo="2">
								AM
							</span>
							<span className="ax-item-content">
								<span className="ax-item-title ax-semibold">Alex Morgan</span>
								<span className="ax-item-desc">alex@tempo.app</span>
							</span>
							<span className="ax-item-trailing">
								<ChevronRight className="ax-glyph" size={18} strokeWidth={1.9} />
							</span>
						</div>
					</div>
				</div>

				<div className="ax-section">Preferences</div>
				<div className="ax-list" data-inset>
					{settings.map(([title, value, color, Icon]) => (
						<div className="ax-item" key={title}>
							<span className="ax-tile" data-color={color}>
								<Icon className="ax-glyph" size={18} strokeWidth={2.2} />
							</span>
							<span className="ax-item-content">
								<span className="ax-item-title">{title}</span>
							</span>
							<span className="ax-item-trailing">
								{value}
								<ChevronRight className="ax-glyph" size={18} strokeWidth={1.9} />
							</span>
						</div>
					))}
					<div className="ax-item">
						<span className="ax-tile" data-color="subtle">
							<Moon className="ax-glyph" size={18} strokeWidth={2.2} />
						</span>
						<span className="ax-item-content">
							<span className="ax-item-title">Reduce motion</span>
						</span>
						<span className="ax-item-trailing">
							<span className="ax-switch" data-checked />
						</span>
					</div>
				</div>

				<div className="ax-section">Account</div>
				<div className="ax-list" data-inset>
					<div className="ax-item">
						<span className="ax-item-content">
							<span className="ax-item-title ax-link">Export data</span>
						</span>
					</div>
					<div className="ax-item">
						<span className="ax-item-content">
							<span className="ax-item-title ax-danger">Delete account</span>
						</span>
					</div>
				</div>
				<div className="ax-footnote-block">Version 1.4.0 · Built with Axiom</div>

				<div className="ax-fill" />
			</DeviceFrame>
		</>
	);
}
