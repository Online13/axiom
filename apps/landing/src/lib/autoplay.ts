type Autoplay = {
	/** Call after a manual selection so the next switch waits a full interval. */
	restart: () => void;
};

/**
 * Cycles through `count` items, looping at the end. The timer is the CSS animation of the
 * `[data-progress]` bar inside the active item: when it ends, the next item is selected.
 *
 * The helper sets `data-autoplay`, `--autoplay-duration` and `--autoplay-state` on `root`.
 * The bar only runs while `root` is on screen, pauses (keeping its progress) while the pointer
 * or focus is inside it, and stays off for reduced motion.
 */
export function autoplay(
	root: HTMLElement,
	count: number,
	current: () => number,
	select: (index: number) => void,
	duration = 5000,
): Autoplay {
	let visible = false;
	let hovered = false;
	let focused = false;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || count < 2) {
		return { restart: () => {} };
	}

	root.dataset.autoplay = '';
	root.style.setProperty('--autoplay-duration', `${duration}ms`);

	function sync() {
		const running = visible && !hovered && !focused;
		root.style.setProperty('--autoplay-state', running ? 'running' : 'paused');
	}
	sync();

	root.addEventListener('animationend', (event) => {
		if (event.animationName === 'autoplay-progress') select((current() + 1) % count);
	});

	new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		sync();
	}).observe(root);

	root.addEventListener('pointerenter', () => ((hovered = true), sync()));
	root.addEventListener('pointerleave', () => ((hovered = false), sync()));
	root.addEventListener('focusin', () => ((focused = true), sync()));
	root.addEventListener('focusout', (event) => {
		if (root.contains(event.relatedTarget as Node | null)) return;
		focused = false;
		sync();
	});

	return {
		restart() {
			// Selecting another item restarts its bar on its own; this covers re-selecting the same one.
			root.querySelectorAll<HTMLElement>('[data-progress]').forEach((bar) => {
				bar.style.animation = 'none';
				void bar.offsetWidth;
				bar.style.animation = '';
			});
		},
	};
}
