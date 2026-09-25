// Scales the three phones so the whole row fits the window: same size for
// every screen, no scrolling to see the bottom of one. The phones are drawn
// at real device points and zoomed by `--ax-scale`, so the scale is simply
// the smaller of the height and width ratios.

import { type RefObject, useLayoutEffect } from "react";
import type { DeviceKind } from "../../state/ui";

/** Outer size of a phone at scale 1: the screen plus the bezel. */
const phones: Record<DeviceKind, { width: number; height: number }> = {
	ios: { width: 393 + 24, height: 852 + 24 },
	android: { width: 412 + 20, height: 915 + 20 },
};

const COUNT = 3;
/** Caption under each phone, which does not scale. */
const CAPTION = 32;
/** Room kept free under the row. */
const BOTTOM = 24;
const MAX_SCALE = 0.85;
/** Below this the row is unreadable: stack the phones and scroll instead. */
const MIN_ROW_SCALE = 0.34;

export function useFitScale(
	ref: RefObject<HTMLElement | null>,
	device: DeviceKind,
) {
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;

		const fit = () => {
			const phone = phones[device];
			const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
			const top = el.getBoundingClientRect().top + window.scrollY;
			const height = window.innerHeight - top - CAPTION - BOTTOM;
			const width = el.clientWidth;

			const row = Math.min(
				height / phone.height,
				(width - gap * (COUNT - 1)) / (COUNT * phone.width),
				MAX_SCALE,
			);
			const stack = row < MIN_ROW_SCALE;
			const scale = stack ? Math.min(width / phone.width, 0.62) : row;

			el.style.setProperty("--ax-scale", scale.toFixed(3));
			el.dataset.layout = stack ? "stack" : "row";
		};

		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(el);
		window.addEventListener("resize", fit);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", fit);
		};
	}, [ref, device]);
}
