/**
 * The page backdrop: one continuous strip of shapes behind the whole page.
 *
 * It has a `left` and a `right` group, pinned to the left and right edges of the
 * viewport so the shapes frame the content at any width. Each group is a pattern
 * tile GROUP_WIDTH × TILE_HEIGHT (CSS pixels) that repeats down the page.
 *
 * Lines are connectors: each end sits on the edge of a card or tile, on the outer
 * viewport edge, or on the tile seam. A line that leaves the bottom of the tile
 * re-enters at the top at the same x. Lines run through empty space, never over a shape.
 */

export const GROUP_WIDTH = 640;
export const TILE_HEIGHT = 4800;
export const CARD_RADIUS = 32;
export const TILE_RADIUS = 14;
export const LINE_RADIUS = 32;

type Point = [x: number, y: number];

export type Shape =
	/** Rounded panel. */
	| { kind: 'card'; x: number; y: number; w: number; h: number }
	/** Small rounded square. */
	| { kind: 'tile'; x: number; y: number; s: number }
	/** Polyline with rounded corners. */
	| { kind: 'line'; points: Point[] };

/** Builds a path through `points` with each corner rounded by `radius`. */
export function route(points: Point[], radius = LINE_RADIUS): string {
	const [start, ...rest] = points;
	let d = `M${start[0]} ${start[1]}`;

	for (let i = 0; i < rest.length - 1; i++) {
		const prev = points[i];
		const corner = rest[i];
		const next = rest[i + 1];
		const r = Math.min(radius, dist(prev, corner) / 2, dist(corner, next) / 2);
		const a = toward(corner, prev, r);
		const b = toward(corner, next, r);
		d += ` L${a[0]} ${a[1]} Q${corner[0]} ${corner[1]} ${b[0]} ${b[1]}`;
	}

	const end = points[points.length - 1];
	return `${d} L${end[0]} ${end[1]}`;
}

function dist(a: Point, b: Point) {
	return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

function toward(from: Point, to: Point, length: number): Point {
	const d = dist(from, to) || 1;
	return [from[0] + ((to[0] - from[0]) / d) * length, from[1] + ((to[1] - from[1]) / d) * length];
}

// Left edge of the viewport is x = 0. Seam lines: x = 370 and x = 535.
export const left: Shape[] = [
	{ kind: 'card', x: -80, y: 300, w: 230, h: 560 },
	{ kind: 'card', x: 90, y: 460, w: 260, h: 520 },
	{ kind: 'card', x: 210, y: 180, w: 380, h: 380 },
	{ kind: 'tile', x: 500, y: 150, s: 70 },
	{ kind: 'line', points: [[535, 0], [535, 150]] },
	{ kind: 'line', points: [[370, 0], [370, 180]] },
	{ kind: 'line', points: [[470, 560], [470, 700], [350, 700]] },
	{ kind: 'line', points: [[556, 560], [556, 1380]] },

	{ kind: 'card', x: -100, y: 1300, w: 280, h: 300 },
	{ kind: 'card', x: -60, y: 1700, w: 220, h: 320 },
	{ kind: 'card', x: 40, y: 1960, w: 300, h: 380 },
	{ kind: 'tile', x: 520, y: 1380, s: 72 },
	{ kind: 'line', points: [[180, 1416], [520, 1416]] },
	{ kind: 'line', points: [[556, 1452], [556, 2150], [340, 2150]] },
	{ kind: 'line', points: [[80, 1600], [80, 1700]] },

	{ kind: 'card', x: -40, y: 2500, w: 240, h: 240 },
	{ kind: 'card', x: 150, y: 2640, w: 300, h: 300 },
	{ kind: 'tile', x: 360, y: 2440, s: 64 },
	{ kind: 'tile', x: 60, y: 2960, s: 80 },
	{ kind: 'card', x: -80, y: 3100, w: 260, h: 420 },
	{ kind: 'tile', x: 388, y: 3300, s: 64 },
	{ kind: 'line', points: [[300, 2340], [300, 2390], [392, 2390], [392, 2440]] },
	{ kind: 'line', points: [[392, 2504], [392, 2640]] },
	{ kind: 'line', points: [[100, 2740], [100, 2960]] },
	{ kind: 'line', points: [[140, 3000], [420, 3000], [420, 3300]] },
	{ kind: 'line', points: [[420, 3364], [420, 3900]] },

	{ kind: 'card', x: -60, y: 3700, w: 300, h: 300 },
	{ kind: 'card', x: 120, y: 3900, w: 360, h: 360 },
	{ kind: 'tile', x: 500, y: 3760, s: 70 },
	{ kind: 'card', x: -100, y: 4300, w: 240, h: 380 },
	{ kind: 'line', points: [[535, 3830], [535, 4800]] },
	{ kind: 'line', points: [[140, 4400], [370, 4400], [370, 4800]] },
];

// Right edge of the viewport is x = 640. Seam line: x = 150.
export const right: Shape[] = [
	{ kind: 'card', x: 470, y: 140, w: 270, h: 500 },
	{ kind: 'card', x: 520, y: 300, w: 220, h: 340 },
	{ kind: 'card', x: 380, y: 540, w: 240, h: 420 },
	{ kind: 'tile', x: 440, y: 360, s: 74 },
	{ kind: 'line', points: [[150, 0], [150, 280], [470, 280]] },
	{ kind: 'line', points: [[440, 397], [260, 397], [260, 1535], [170, 1535]] },

	{ kind: 'card', x: 400, y: 1250, w: 300, h: 300 },
	{ kind: 'card', x: 520, y: 1640, w: 200, h: 320 },
	{ kind: 'card', x: 440, y: 2000, w: 300, h: 300 },
	{ kind: 'tile', x: 100, y: 1500, s: 70 },
	{ kind: 'line', points: [[135, 1570], [135, 1780], [520, 1780]] },
	{ kind: 'line', points: [[440, 2150], [335, 2150], [335, 2560]] },

	{ kind: 'card', x: 460, y: 2520, w: 260, h: 380 },
	{ kind: 'tile', x: 300, y: 2560, s: 70 },
	{ kind: 'tile', x: 520, y: 2440, s: 64 },
	{ kind: 'tile', x: 200, y: 3100, s: 64 },
	{ kind: 'card', x: 460, y: 3050, w: 260, h: 300 },
	{ kind: 'card', x: 380, y: 3380, w: 280, h: 280 },
	{ kind: 'line', points: [[370, 2595], [420, 2595], [420, 2472], [520, 2472]] },
	{ kind: 'line', points: [[335, 2630], [335, 2800], [460, 2800]] },
	{ kind: 'line', points: [[264, 3132], [460, 3132]] },
	{ kind: 'line', points: [[215, 3164], [215, 3760]] },

	{ kind: 'card', x: 480, y: 3700, w: 260, h: 420 },
	{ kind: 'card', x: 300, y: 3950, w: 240, h: 240 },
	{ kind: 'tile', x: 160, y: 3760, s: 70 },
	{ kind: 'card', x: 420, y: 4300, w: 300, h: 360 },
	{ kind: 'line', points: [[195, 3830], [195, 4070], [300, 4070]] },
	{ kind: 'line', points: [[420, 4400], [150, 4400], [150, 4800]] },
];
