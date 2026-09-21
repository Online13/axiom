// Lumen — a task list. Leans on lists, checkboxes, chips and the FAB: the
// places where the accent and the neutral ramp do most of the work.

import {
	Bell,
	Calendar,
	Check,
	ChevronRight,
	CircleCheck,
	Flag,
	Inbox,
	ListTodo,
	Plus,
	Search,
	Tag,
	User,
} from "lucide-react";
import { DeviceFrame } from "../DeviceFrame";

const today = [
	["Ship the colour tokens", "9:00 · Design system", true],
	["Review the input states", "11:30 · Engineering", true],
	["Write the migration note", "Today", false],
	["Audit dark mode contrast", "Today", false],
] as const;

const upcoming = [
	["Prepare the handoff deck", "Tomorrow", "Design"],
	["Close the icon backlog", "Thursday", "Icons"],
	["Retro notes", "Friday", "Team"],
] as const;

const lists = [
	["Inbox", "12", "accent", Inbox],
	["Today", "4", "success", ListTodo],
	["Flagged", "2", "warning", Flag],
	["Tags", "9", "error", Tag],
] as const;

export function TodoApp() {
	return (
		<>
			<DeviceFrame label="Task list" caption="Today">
				<div className="ax-appbar">
					<span className="ax-appbar-slot">
						<span className="ax-avatar" data-size="sm" data-photo="1">
							RM
						</span>
					</span>
					<span className="ax-appbar-title">Lumen</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-icon-btn">
							<Bell className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
					</span>
				</div>
				<div className="ax-large-heading">Today</div>

				<div className="ax-body">
					<div className="ax-searchbar">
						<Search className="ax-glyph" size={18} strokeWidth={1.9} />
						<span className="ax-placeholder">Search tasks</span>
					</div>
				</div>

				<div className="ax-chips">
					<span className="ax-chip" data-size="sm" data-selected>
						All
					</span>
					<span className="ax-chip" data-size="sm">
						Due
					</span>
					<span className="ax-chip" data-size="sm">
						Flagged
					</span>
					<span className="ax-chip" data-size="sm">
						Done
					</span>
				</div>

				<div className="ax-body">
					<div className="ax-card">
						<div className="ax-card-content">
							<div className="ax-row" data-justify="between">
								<span className="ax-footnote ax-muted">Completed today</span>
								<span className="ax-badge" data-variant="success">
									2 of 4
								</span>
							</div>
							<div className="ax-progress" style={{ marginTop: 10 }}>
								<span style={{ width: "50%" }} />
							</div>
						</div>
					</div>
				</div>

				<div className="ax-section">Today</div>
				<div className="ax-list" data-inset>
					{today.map(([title, meta, done]) => (
						<div className="ax-item" key={title}>
							<span className="ax-checkbox" data-checked={done ? "true" : undefined}>
								{done && <Check className="ax-glyph" size={14} strokeWidth={3} />}
							</span>
							<span className="ax-item-content">
								<span className={`ax-item-title${done ? " ax-muted" : ""}`}>
									{title}
								</span>
								<span className="ax-item-desc">{meta}</span>
							</span>
						</div>
					))}
				</div>

				<div className="ax-fill" />
				<div className="ax-fab-layer">
					<span className="ax-fab" data-extended>
						<Plus className="ax-glyph" size={20} strokeWidth={1.9} />
						New task
					</span>
				</div>
				<div className="ax-tabbar">
					<span className="ax-tabbar-item" data-active>
						<ListTodo className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Tasks</span>
					</span>
					<span className="ax-tabbar-item">
						<Calendar className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Upcoming</span>
					</span>
					<span className="ax-tabbar-item">
						<Inbox className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Inbox</span>
					</span>
					<span className="ax-tabbar-item">
						<User className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Profile</span>
					</span>
				</div>
			</DeviceFrame>

			<DeviceFrame label="Lists" caption="Lists" grouped>
				<div className="ax-appbar">
					<span className="ax-appbar-slot" />
					<span className="ax-appbar-title">Lists</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-link ax-text">Edit</span>
					</span>
				</div>

				<div className="ax-section">Smart lists</div>
				<div className="ax-list" data-inset>
					{lists.map(([title, count, color, Icon]) => (
						<div className="ax-item" key={title}>
							<span className="ax-tile" data-color={color}>
								<Icon className="ax-glyph" size={18} strokeWidth={2.2} />
							</span>
							<span className="ax-item-content">
								<span className="ax-item-title">{title}</span>
							</span>
							<span className="ax-item-trailing">
								{count}
								<ChevronRight className="ax-glyph" size={18} strokeWidth={1.9} />
							</span>
						</div>
					))}
				</div>

				<div className="ax-section">Upcoming</div>
				<div className="ax-list" data-inset>
					{upcoming.map(([title, when, project]) => (
						<div className="ax-item" key={title}>
							<span className="ax-checkbox" />
							<span className="ax-item-content">
								<span className="ax-item-title">{title}</span>
								<span className="ax-item-desc">
									{when} · {project}
								</span>
							</span>
						</div>
					))}
				</div>

				<div className="ax-body">
					<div className="ax-alert" data-variant="info">
						<CircleCheck className="ax-glyph" size={20} strokeWidth={1.9} />
						<span className="ax-stack" data-gap="4">
							<span className="ax-alert-title">You are ahead of schedule</span>
							<span className="ax-alert-desc">
								Nothing is overdue this week.
							</span>
						</span>
					</div>
				</div>

				<div className="ax-fill" />
			</DeviceFrame>
		</>
	);
}
