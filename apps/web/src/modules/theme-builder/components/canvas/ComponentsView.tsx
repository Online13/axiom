// Every component on its own, in every state that matters — the precise
// check the app previews deliberately leave out. Each panel is an
// `.ax-screen`, so it reads the same radius, font and colors as the phones.

import { observer } from "@legendapp/state/react";
import {
	Check,
	ChevronDown,
	ChevronRight,
	CircleAlert,
	CircleCheck,
	Info,
	Search,
	Trash2,
	TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { ui$ } from "../../state/ui";

const focusRing = {
	outline: "2px solid var(--ax-border-focus)",
	outlineOffset: 2,
} as const;

function Sample({
	title,
	wide,
	children,
}: {
	title: string;
	wide?: boolean;
	children: ReactNode;
}) {
	return (
		<section className="tb-sample" data-wide={wide || undefined}>
			<h3 className="tb-sample__title">{title}</h3>
			<div className="ax-screen tb-sample__body">{children}</div>
		</section>
	);
}

export const ComponentsView = observer(function ComponentsView() {
	const scheme = ui$.scheme.get();

	return (
		<div className="tb-components" data-ax-preview data-scheme={scheme}>
			<Sample title="Button">
				<div className="ax-row" data-wrap data-gap="12">
					<span className="ax-btn">Solid</span>
					<span className="ax-btn" data-variant="outline">
						Outline
					</span>
					<span className="ax-btn" data-variant="ghost">
						Ghost
					</span>
				</div>
				<div className="ax-row" data-wrap data-gap="12">
					<span className="ax-btn" data-variant="destructive">
						<Trash2 className="ax-glyph" size={16} strokeWidth={2} />
						Delete
					</span>
					<span className="ax-btn" data-state="disabled">
						Disabled
					</span>
					<span className="ax-btn" style={focusRing}>
						Focused
					</span>
				</div>
				<div className="ax-row" data-wrap data-gap="12">
					<span className="ax-btn" data-size="sm">
						Small
					</span>
					<span className="ax-btn" data-size="lg">
						Large
					</span>
				</div>
			</Sample>

			<Sample title="Input">
				<div className="ax-field">
					<span className="ax-label">Email</span>
					<div className="ax-control">
						<span className="ax-placeholder">name@example.com</span>
					</div>
				</div>
				<div className="ax-field" data-state="focused">
					<span className="ax-label">Search</span>
					<div className="ax-control">
						<Search className="ax-glyph" size={18} strokeWidth={1.9} />
						<span className="ax-value ax-caret">Kyoto</span>
					</div>
				</div>
				<div className="ax-field" data-state="invalid">
					<span className="ax-label">Password</span>
					<div className="ax-control">
						<span className="ax-value">••••</span>
					</div>
					<span className="ax-helper">At least 8 characters.</span>
				</div>
				<div className="ax-field" data-state="disabled">
					<span className="ax-label">Username</span>
					<div className="ax-control">
						<span className="ax-value">rayane</span>
					</div>
				</div>
			</Sample>

			<Sample title="Select">
				<div className="ax-field">
					<span className="ax-label">Currency</span>
					<div className="ax-control">
						<span className="ax-value">Euro (EUR)</span>
						<ChevronDown
							className="ax-glyph"
							size={18}
							strokeWidth={1.9}
						/>
					</div>
				</div>
				<div className="ax-menu" style={{ width: "100%" }}>
					<span className="ax-menu-item">US Dollar (USD)</span>
					<span className="ax-menu-item" data-state="pressed">
						Euro (EUR)
						<Check
							className="ax-glyph ax-link"
							size={18}
							strokeWidth={2.2}
						/>
					</span>
					<span className="ax-menu-item" data-state="disabled">
						Yen (JPY)
					</span>
				</div>
			</Sample>

			<Sample title="Switch · Checkbox · Radio">
				<div className="ax-row" data-gap="16">
					<span className="ax-switch" data-checked />
					<span className="ax-switch" />
					<span className="ax-switch" data-disabled />
				</div>
				<div className="ax-row" data-gap="16">
					<span className="ax-checkbox" data-checked>
						<Check className="ax-glyph" size={14} strokeWidth={3} />
					</span>
					<span className="ax-checkbox" />
					<span className="ax-checkbox" data-invalid />
					<span className="ax-checkbox" data-disabled />
				</div>
				<div className="ax-row" data-gap="16">
					<span className="ax-radio" data-checked />
					<span className="ax-radio" />
					<span className="ax-radio" data-disabled />
				</div>
			</Sample>

			<Sample title="Alert" wide>
				<div className="ax-alert">
					<Info className="ax-glyph" size={20} strokeWidth={1.9} />
					<span className="ax-stack" data-gap="4">
						<span className="ax-alert-title">New version available</span>
						<span className="ax-alert-desc">Restart to update.</span>
					</span>
				</div>
				<div className="ax-alert" data-variant="success">
					<CircleCheck className="ax-glyph" size={20} strokeWidth={1.9} />
					<span className="ax-alert-title">Payment sent</span>
				</div>
				<div className="ax-alert" data-variant="warning">
					<TriangleAlert
						className="ax-glyph"
						size={20}
						strokeWidth={1.9}
					/>
					<span className="ax-alert-title">Storage almost full</span>
				</div>
				<div className="ax-alert" data-variant="error">
					<CircleAlert className="ax-glyph" size={20} strokeWidth={1.9} />
					<span className="ax-alert-title">Card declined</span>
				</div>
			</Sample>

			<Sample title="Dialog">
				<div className="tb-sample__stage">
					<div className="ax-scrim" />
					<div className="ax-layer">
						<div className="ax-dialog">
							<div className="ax-dialog-body">
								<span className="ax-headline">Delete this trip?</span>
								<span className="ax-subhead ax-muted">
									This can't be undone.
								</span>
							</div>
							<div className="ax-dialog-actions">
								<span className="ax-btn" data-variant="outline">
									Cancel
								</span>
								<span className="ax-btn" data-variant="destructive">
									Delete
								</span>
							</div>
						</div>
					</div>
				</div>
			</Sample>

			<Sample title="Sheet">
				<div className="tb-sample__stage">
					<div className="ax-scrim" />
					<div className="ax-sheet">
						<span className="ax-handle" />
						<div className="ax-sheet-header">
							<span className="ax-headline">Share playlist</span>
						</div>
						<span className="ax-btn" data-block>
							Copy link
						</span>
					</div>
				</div>
			</Sample>

			<Sample title="Tabs">
				<div className="ax-tabs">
					<span data-active>Overview</span>
					<span>Activity</span>
					<span>Settings</span>
				</div>
				<div className="ax-tabs" data-variant="pill" style={{ padding: 0 }}>
					<span data-active>All</span>
					<span>Unread</span>
					<span>Mentions</span>
				</div>
				<div className="ax-segmented">
					<span data-active>Day</span>
					<span>Week</span>
					<span>Month</span>
				</div>
			</Sample>

			<Sample title="Card">
				<div className="ax-card">
					<div className="ax-card-header">
						<span className="ax-headline">Elevated</span>
					</div>
					<div className="ax-card-content ax-subhead ax-muted">
						Sits above the screen.
					</div>
				</div>
				<div className="ax-row" data-gap="12">
					<div className="ax-card ax-grow" data-variant="outlined">
						<div className="ax-card-content ax-subhead">Outlined</div>
					</div>
					<div className="ax-card ax-grow" data-variant="filled">
						<div className="ax-card-content ax-subhead">Filled</div>
					</div>
				</div>
			</Sample>

			<Sample title="Badge">
				<div className="ax-row" data-wrap data-gap="8">
					<span className="ax-badge">Neutral</span>
					<span className="ax-badge" data-variant="info">
						Info
					</span>
					<span className="ax-badge" data-variant="success">
						Success
					</span>
					<span className="ax-badge" data-variant="warning">
						Warning
					</span>
					<span className="ax-badge" data-variant="error">
						Error
					</span>
					<span
						className="ax-badge"
						style={{
							background: "var(--ax-highlight-default)",
							color: "var(--ax-highlight-on)",
						}}
					>
						Highlight
					</span>
					<span className="ax-badge" data-variant="outline">
						Outline
					</span>
					<span className="ax-badge" data-kind="count">
						3
					</span>
				</div>
			</Sample>

			<Sample title="List item" wide>
				<div
					className="ax-list"
					data-variant="outlined"
					style={{ margin: 0 }}
				>
					<div className="ax-item">
						<span className="ax-item-content">
							<span className="ax-item-title">Default</span>
							<span className="ax-item-desc">With a description</span>
						</span>
						<span className="ax-item-trailing">
							<ChevronRight
								className="ax-glyph"
								size={18}
								strokeWidth={1.9}
							/>
						</span>
					</div>
					<div className="ax-item" data-state="selected">
						<span className="ax-item-content">
							<span className="ax-item-title">Selected</span>
						</span>
						<Check
							className="ax-glyph ax-link"
							size={18}
							strokeWidth={2.2}
						/>
					</div>
					<div className="ax-item" data-state="disabled">
						<span className="ax-item-content">
							<span className="ax-item-title">Disabled</span>
						</span>
					</div>
					<div className="ax-item">
						<span className="ax-item-content">
							<span className="ax-item-title ax-danger">
								Delete account
							</span>
						</span>
						<Trash2
							className="ax-glyph ax-danger"
							size={18}
							strokeWidth={1.9}
						/>
					</div>
				</div>
			</Sample>
		</div>
	);
});
