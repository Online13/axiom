/**
 * Paddings, gaps and margins in points, scaled by the density of the theme:
 * `space(12, 24, 0)` reads `--ax-space`, which the theme sets on the screen.
 */
export const space = (...points: number[]) =>
	points.map((n) => (n ? `calc(${n} * var(--ax-space))` : "0")).join(" ");
