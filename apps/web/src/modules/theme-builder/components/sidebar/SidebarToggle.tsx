import { observer } from "@legendapp/state/react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ui$ } from "../../state/ui";

/**
 * Puts the sidebar away or brings it back, and hands the focus to the button
 * that undoes it: the panel folds into the corner the other one sits in.
 */
function setSidebar(open: boolean) {
	ui$.sidebarOpen.set(open);
	// The button only takes the focus once its side is no longer inert.
	requestAnimationFrame(() =>
		document
			.querySelector<HTMLElement>(open ? ".tb-panel__hide" : ".tb-show")
			?.focus({ preventScroll: true }),
	);
}

/** In the sidebar's corner: folds it away. */
export function SidebarHide() {
	return (
		<button
			type="button"
			className="tb-panel__hide"
			title="Hide the sidebar"
			aria-label="Hide the sidebar"
			aria-controls="tb-panel"
			aria-expanded="true"
			onClick={() => setSidebar(false)}
		>
			<PanelLeftClose size={16} aria-hidden="true" />
		</button>
	);
}

/** Floating in the canvas corner while the sidebar is away: brings it back. */
export const SidebarToggle = observer(function SidebarToggle() {
	const open = ui$.sidebarOpen.get();
	return (
		<button
			type="button"
			className="tb-show tb-float"
			title="Show the sidebar"
			aria-label="Show the sidebar"
			aria-controls="tb-panel"
			aria-expanded="false"
			inert={open}
			onClick={() => setSidebar(true)}
		>
			<PanelLeftOpen size={16} aria-hidden="true" />
		</button>
	);
});
