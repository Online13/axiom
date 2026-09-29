import { observer } from "@legendapp/state/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { ui$ } from "../../state/ui";
import { nearestScreen, showScreen } from "./camera";
import { screens } from "./screens/IndexApp";

const indexOf = (label: string | null) =>
	screens.findIndex(({ name }) => name === label);

/**
 * Steps `delta` screens from the one brought forward. With none forward yet,
 * the screen nearest the middle comes forward instead.
 */
function step(delta: number) {
	const current = indexOf(ui$.focusedScreen.peek());
	if (current < 0) {
		const nearest = nearestScreen();
		if (nearest) showScreen(nearest);
		return;
	}
	const next = Math.min(Math.max(current + delta, 0), screens.length - 1);
	if (next !== current) showScreen(screens[next].name);
}

const KEYS: Record<string, number> = {
	ArrowLeft: -1,
	ArrowUp: -1,
	ArrowRight: 1,
	ArrowDown: 1,
};

/**
 * In slide mode, the screens come forward one at a time: the arrow keys, or
 * the buttons under the canvas, step to the previous or the next.
 */
export const SlideControls = observer(function SlideControls() {
	const on = ui$.tools.slides.get() && ui$.view.get() === "preview";
	const index = indexOf(ui$.focusedScreen.get());

	useEffect(() => {
		if (!on) return;
		// Switching the mode on brings a screen forward straight away.
		const current = ui$.focusedScreen.peek();
		if (current) showScreen(current);
		else step(0);

		// Anywhere on the page but where the arrows already mean something:
		// a field, the sidebar, or an open dialog.
		const key = (event: KeyboardEvent) => {
			const delta = KEYS[event.key];
			const target = event.target as HTMLElement | null;
			if (
				delta === undefined ||
				event.defaultPrevented ||
				event.altKey ||
				event.metaKey ||
				event.ctrlKey ||
				ui$.exportOpen.peek() ||
				ui$.loadOpen.peek() ||
				target?.closest(
					"input, textarea, select, [contenteditable], .tb-panel",
				)
			)
				return;
			event.preventDefault();
			step(delta);
		};
		window.addEventListener("keydown", key);
		return () => window.removeEventListener("keydown", key);
	}, [on]);

	if (!on) return null;
	return (
		<div className="tb-slides tb-float" role="group" aria-label="Slides">
			<button
				type="button"
				aria-label="Previous screen"
				disabled={index === 0}
				onClick={() => step(-1)}
			>
				<ChevronLeft size={16} aria-hidden="true" />
			</button>
			<span className="tb-slides__label" aria-live="polite">
				{index < 0
					? `${screens.length} screens`
					: `${String(index + 1).padStart(2, "0")} / ${screens.length} · ${screens[index].name}`}
			</span>
			<button
				type="button"
				aria-label="Next screen"
				disabled={index === screens.length - 1}
				onClick={() => step(1)}
			>
				<ChevronRight size={16} aria-hidden="true" />
			</button>
		</div>
	);
});
