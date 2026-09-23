import { useEffect, useId, useSyncExternalStore } from "react";

// Which modal surfaces are open, and in what order. A module-level store, like the one behind `toast`:
// surfaces find each other without a provider, and an app that only ever opens one pays nothing.
// It knows nothing about sheets, dialogs or menus — only who is open and who came last.

type Entry = { id: string; pushes: boolean };

let stack: Entry[] = [];
const listeners = new Set<() => void>();

function emit(next: Entry[]) {
	stack = next;
	listeners.forEach((listener) => listener());
}

/** How far a surface recedes, however many open on top of it. Past this, a stack stops reading as depth. */
export const MAX_OVERLAY_DEPTH = 2;

export type OverlayStackPosition = {
	/** Surfaces open above this one that push it back, capped at `MAX_OVERLAY_DEPTH`. */
	depth: number;
	/** Nothing is open above: this surface owns the gesture, the back action and the backdrop. */
	isTop: boolean;
};

/**
 * Registers an open surface and reports where it sits.
 * `pushes` is what this surface does to the ones below, not what happens to it: `false` opens over
 * them without pushing them back, and still takes the top spot.
 */
export function useOverlayStack(
	open: boolean,
	pushes = true,
): OverlayStackPosition {
	const id = useId();
	const entries = useSyncExternalStore(
		(listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		() => stack,
	);

	useEffect(() => {
		if (!open) return;
		emit([...stack, { id, pushes }]);
		// Leaves as soon as the surface starts closing, so the one below comes back on the same frame.
		return () => emit(stack.filter((entry) => entry.id !== id));
	}, [open, pushes, id]);

	const index = entries.findIndex((entry) => entry.id === id);
	// Closed, or open for the render before the effect registers it.
	if (index === -1) return { depth: 0, isTop: false };

	const above = entries.slice(index + 1);
	return {
		depth: Math.min(
			above.filter((entry) => entry.pushes).length,
			MAX_OVERLAY_DEPTH,
		),
		isTop: above.length === 0,
	};
}
