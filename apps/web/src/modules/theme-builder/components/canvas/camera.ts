// The canvas camera: the screens sit on a world layer drawn at real device
// points, and the camera moves and scales that layer inside the view, the way
// a design tool's canvas does. Dragging or scrolling pans it, a pinch or
// ⌘/Ctrl + scroll zooms it around the pointer.

import { observable } from "@legendapp/state";
import { type RefObject, useLayoutEffect } from "react";
import { type DeviceKind, ui$ } from "../../state/ui";

/** Where the world's top-left corner sits in the view, and its scale. */
export type Camera = { x: number; y: number; z: number };

export const camera$ = observable<Camera>({ x: 0, y: 0, z: 0.6 });

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 4;
/** The step of the zoom buttons and keys. */
const STEP = 1.25;
/** Room left around the screens when they are fitted to the view. */
const MARGIN = 40;
/** How far the pointer travels before a press becomes a drag, not a click. */
const DRAG_THRESHOLD = 4;
/** The fitted zoom never enlarges past what reads well. */
const MAX_FIT = 0.75;
/** The zoom a screen is brought in at from the zoom controls. */
const FOCUS_ZOOM = 0.83;
/** The grid's cell in world points, and how many cells a major line spans. */
const GRID = 24;
const GRID_MAJOR = 4;

// The one canvas on the page registers its elements for the commands below.
let view: HTMLElement | null = null;
let world: HTMLElement | null = null;

const clamp = (z: number) => Math.min(Math.max(z, MIN_ZOOM), MAX_ZOOM);

// The glide to a clicked screen, and the screen it ended on.
let frame = 0;
let focused: Element | null = null;

/** Every move but the glide goes through here, and cuts the glide short. */
function move(next: Camera) {
	cancelAnimationFrame(frame);
	focused = null;
	camera$.set(next);
}

export const panBy = (dx: number, dy: number) => {
	const { x, y, z } = camera$.peek();
	move({ x: x + dx, y: y + dy, z });
};

/** Scales by `factor`, keeping the world point under (`px`, `py`) in place. */
export function zoomAt(factor: number, px: number, py: number) {
	const { x, y, z } = camera$.peek();
	const next = clamp(z * factor);
	const k = next / z;
	move({ x: px - (px - x) * k, y: py - (py - y) * k, z: next });
}

const center = () => ({
	px: (view?.clientWidth ?? 0) / 2,
	py: (view?.clientHeight ?? 0) / 2,
});

/**
 * The part of the view the floating sidebar leaves free: fitting and focusing
 * center the screens there rather than behind the panel.
 */
function area() {
	const width = view?.clientWidth ?? 0;
	const height = view?.clientHeight ?? 0;
	const panel = ui$.sidebarOpen.peek()
		? document.querySelector(".tb-panel")?.getBoundingClientRect()
		: undefined;
	const left =
		panel && view
			? Math.max(panel.right - view.getBoundingClientRect().left, 0)
			: 0;
	return { left, width: width - left, height };
}

export function zoomBy(factor: number) {
	const { px, py } = center();
	zoomAt(factor, px, py);
}

export const zoomIn = () => zoomBy(STEP);
export const zoomOut = () => zoomBy(1 / STEP);
export const zoomTo = (z: number) => zoomBy(z / camera$.z.peek());

/** Every screen in view, centered. */
export function fitAll() {
	if (!view || !world) return;
	const { left, width, height } = area();
	const ww = world.offsetWidth;
	const wh = world.offsetHeight;
	const z = clamp(
		Math.min((width - MARGIN * 2) / ww, (height - MARGIN * 2) / wh, 1),
	);
	move({ x: left + (width - ww * z) / 2, y: (height - wh * z) / 2, z });
}

/** A full row across the view, from the top: where a visit starts. */
export function fitWidth() {
	if (!view || !world) return;
	const { left, width } = area();
	const ww = world.offsetWidth;
	const z = clamp(Math.min((width - MARGIN * 2) / ww, MAX_FIT));
	move({ x: left + (width - ww * z) / 2, y: MARGIN, z });
}

const GLIDE_MS = 320;
const ease = (t: number) => 1 - (1 - t) ** 3;

/** Where `element` sits in the world, at scale 1. */
function bounds(element: Element) {
	const { z } = camera$.peek();
	const box = element.getBoundingClientRect();
	const origin = (world as HTMLElement).getBoundingClientRect();
	return {
		left: (box.left - origin.left) / z,
		top: (box.top - origin.top) / z,
		width: box.width / z,
		height: box.height / z,
	};
}

/**
 * Glides to `element` (a phone) and centers it in the free part of the view,
 * at `zoom`, or fitted when none is given. Clicking the phone it already rests
 * on leaves the camera be, so a part can be picked on a phone zoomed in on.
 */
export function focusScreen(element: Element, zoom?: number) {
	if (!view || !world || element === focused) return;
	const from = camera$.peek();
	const { left, top, width, height } = bounds(element);
	const free = area();

	const z = clamp(
		zoom ??
			Math.min(
				(free.width - MARGIN * 2) / width,
				(free.height - MARGIN * 2) / height,
				1,
			),
	);
	const to = {
		x: free.left + free.width / 2 - (left + width / 2) * z,
		y: free.height / 2 - (top + height / 2) * z,
		z,
	};

	cancelAnimationFrame(frame);
	focused = element;
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
		camera$.set(to);
		return;
	}
	view.dataset.moving = "";
	const start = performance.now();
	const step = (now: number) => {
		const t = Math.min((now - start) / GLIDE_MS, 1);
		const k = ease(t);
		camera$.set({
			x: from.x + (to.x - from.x) * k,
			y: from.y + (to.y - from.y) * k,
			z: from.z + (to.z - from.z) * k,
		});
		if (t < 1) frame = requestAnimationFrame(step);
		else delete view?.dataset.moving;
	};
	frame = requestAnimationFrame(step);
}

/** Brings the phone nearest the middle of the free view in, at about 83%. */
export function focusNearest() {
	if (!view || !world) return;
	const { x, y, z } = camera$.peek();
	const free = area();
	// The middle of the free view, in world points.
	const cx = (free.left + free.width / 2 - x) / z;
	const cy = (free.height / 2 - y) / z;
	let nearest: Element | null = null;
	let best = Number.POSITIVE_INFINITY;
	for (const phone of world.querySelectorAll(".tb-phone")) {
		const b = bounds(phone);
		const d = Math.hypot(
			b.left + b.width / 2 - cx,
			b.top + b.height / 2 - cy,
		);
		if (d < best) {
			best = d;
			nearest = phone;
		}
	}
	if (!nearest) return;
	// Pressed again on the same phone, the glide is not skipped: the zoom may
	// have moved since.
	focused = null;
	focusScreen(nearest, FOCUS_ZOOM);
}

// A mouse wheel reports lines on some systems; the rest report pixels.
const pixels = (event: WheelEvent, delta: number) =>
	event.deltaMode === WheelEvent.DOM_DELTA_LINE ? delta * 16 : delta;

const typing = (target: EventTarget | null) =>
	target instanceof HTMLElement &&
	(target.isContentEditable ||
		["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/**
 * Wires the view's pointer, wheel and keyboard to the camera, and draws the
 * camera onto the world. The world is fitted to a row on first render and
 * whenever the device, and so the size of every screen, changes.
 */
export function useCamera(
	viewRef: RefObject<HTMLElement | null>,
	worldRef: RefObject<HTMLElement | null>,
	device: DeviceKind,
) {
	useLayoutEffect(() => {
		const v = viewRef.current;
		const w = worldRef.current;
		if (!v || !w) return;
		view = v;
		world = w;

		// Drawn straight onto the element: a pan must not re-render the screens.
		// The grid is the view's background, moved and scaled with the world;
		// its cell doubles as the zoom drops so the lines never crowd.
		const draw = ({ x, y, z }: Camera) => {
			w.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
			let cell = GRID * z;
			while (cell < 12) cell *= 2;
			v.style.setProperty("--grid-cell", `${cell}px`);
			v.style.setProperty("--grid-major", `${cell * GRID_MAJOR}px`);
			v.style.setProperty("--grid-x", `${x}px`);
			v.style.setProperty("--grid-y", `${y}px`);
		};
		draw(camera$.peek());
		const stopDrawing = camera$.onChange(({ value }) => draw(value));

		// The layer is only promoted while it moves, so text redraws sharp once
		// the camera settles.
		let settle: ReturnType<typeof setTimeout> | undefined;
		const moving = () => {
			v.dataset.moving = "";
			clearTimeout(settle);
			settle = setTimeout(() => delete v.dataset.moving, 150);
		};

		const local = (event: { clientX: number; clientY: number }) => {
			const box = v.getBoundingClientRect();
			return { px: event.clientX - box.left, py: event.clientY - box.top };
		};

		// A pinch on a trackpad arrives as a wheel with Ctrl held.
		const wheel = (event: WheelEvent) => {
			event.preventDefault();
			moving();
			const dx = pixels(event, event.deltaX);
			const dy = pixels(event, event.deltaY);
			if (event.ctrlKey || event.metaKey) {
				const { px, py } = local(event);
				const delta = Math.min(Math.max(dy, -50), 50);
				zoomAt(Math.exp(-delta * 0.01), px, py);
			} else if (event.shiftKey && dx === 0) {
				panBy(-dy, 0);
			} else {
				panBy(-dx, -dy);
			}
		};

		// One pointer pans once it has moved past the threshold; two pinch.
		const pointers = new Map<number, { x: number; y: number }>();
		let dragged = false;
		let pinch = 0;

		const spread = () => {
			const [a, b] = [...pointers.values()];
			return {
				distance: Math.hypot(a.x - b.x, a.y - b.y),
				...local({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }),
			};
		};

		const down = (event: PointerEvent) => {
			if (event.button !== 0 && event.button !== 1) return;
			// The middle button would start the browser's autoscroll.
			if (event.button === 1) event.preventDefault();
			pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
			if (pointers.size === 1) dragged = false;
			if (pointers.size === 2) pinch = spread().distance;
		};

		const move = (event: PointerEvent) => {
			const last = pointers.get(event.pointerId);
			if (!last) return;
			const dx = event.clientX - last.x;
			const dy = event.clientY - last.y;

			if (pointers.size === 2) {
				pointers.set(event.pointerId, {
					x: event.clientX,
					y: event.clientY,
				});
				const { distance, px, py } = spread();
				if (pinch) zoomAt(distance / pinch, px, py);
				pinch = distance;
				dragged = true;
				moving();
				return;
			}

			if (!dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
			if (!dragged) {
				dragged = true;
				v.setPointerCapture(event.pointerId);
				v.dataset.panning = "";
			}
			pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
			panBy(dx, dy);
			moving();
		};

		const up = (event: PointerEvent) => {
			pointers.delete(event.pointerId);
			pinch = 0;
			if (!pointers.size) delete v.dataset.panning;
		};

		// A drag ends in a click; it must not pick the part it was released on.
		const click = (event: MouseEvent) => {
			if (!dragged) return;
			dragged = false;
			event.stopPropagation();
			event.preventDefault();
		};

		const key = (event: KeyboardEvent) => {
			if (typing(event.target)) return;
			const mod = event.metaKey || event.ctrlKey;
			const pan = event.shiftKey ? 240 : 48;
			const actions: Record<string, (() => void) | undefined> = {
				ArrowLeft: () => panBy(pan, 0),
				ArrowRight: () => panBy(-pan, 0),
				ArrowUp: () => panBy(0, pan),
				ArrowDown: () => panBy(0, -pan),
				"+": zoomIn,
				"=": zoomIn,
				"-": zoomOut,
				// Shift+0 and Shift+1 as in Figma; `code` holds on every layout.
				Digit0: event.shiftKey || mod ? () => zoomTo(1) : undefined,
				Digit1: event.shiftKey ? fitAll : undefined,
				Digit2: event.shiftKey ? fitWidth : undefined,
				Digit3: event.shiftKey ? focusNearest : undefined,
			};
			const action = actions[event.key] ?? actions[event.code];
			if (!action) return;
			event.preventDefault();
			action();
		};

		v.addEventListener("wheel", wheel, { passive: false });
		v.addEventListener("pointerdown", down);
		v.addEventListener("pointermove", move);
		v.addEventListener("pointerup", up);
		v.addEventListener("pointercancel", up);
		v.addEventListener("click", click, true);
		v.addEventListener("keydown", key);
		return () => {
			stopDrawing();
			clearTimeout(settle);
			cancelAnimationFrame(frame);
			focused = null;
			v.removeEventListener("wheel", wheel);
			v.removeEventListener("pointerdown", down);
			v.removeEventListener("pointermove", move);
			v.removeEventListener("pointerup", up);
			v.removeEventListener("pointercancel", up);
			v.removeEventListener("click", click, true);
			v.removeEventListener("keydown", key);
			view = null;
			world = null;
		};
	}, [viewRef, worldRef]);

	// Screens change size with the device: start over from a fitted row.
	useLayoutEffect(() => {
		fitWidth();
	}, [device]);
}
