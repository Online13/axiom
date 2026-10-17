/*
 * Open Graph images: the docs banner redrawn at 1200×630 for link previews. The site image is
 * the banner itself; a docs page swaps the stack for its title and description. Rendered with
 * Takumi at build time, so the ribbons are a plain SVG in the dark palette (no CSS variables).
 */
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { Logo } from "./Logo";
import { BANNER_HEIGHT, BANNER_WIDTH, bannerRibbons, darkColors, edge, faintEdge, rounded, shape, type Ribbon } from "./ribbons";

const WIDTH = 1200;
const HEIGHT = 630;
const INK = "#0b1016";
const FG = "#f2f5f8";
const MUTED = "#8a97a8";

const ogSize = { width: WIDTH, height: HEIGHT };

// One request for every image of the build.
const fonts = googleFonts([
	{ name: "Inter", weight: [400, 600] },
	{ name: "Outfit", weight: 300 },
]);

/** The dark-mode recipe of Ribbons.astro, minus what only CSS can do. */
function ribbonsSvg(ribbons: Ribbon[]) {
	const defs: string[] = [
		`<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="36"/></filter>`,
		`<filter id="bloom" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>`,
		`<filter id="neon" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="tight"/><feGaussianBlur in="SourceGraphic" stdDeviation="14" result="wide"/><feMerge><feMergeNode in="wide"/><feMergeNode in="wide"/><feMergeNode in="tight"/><feMergeNode in="tight"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
	];
	const groups = rounded(ribbons).map((r, i) => {
		const [x1, y1] = r.points[0];
		const [x2, y2] = r.points.at(-1)!;
		const stops = r.colors.map((c, j) => `<stop offset="${j / (r.colors.length - 1)}" stop-color="${darkColors[c] ?? c}"/>`).join("");
		defs.push(
			`<linearGradient id="r${i}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient>`,
			`<clipPath id="c${i}"><path d="${shape(r)}"/></clipPath>`,
		);
		const paint = `url(#r${i})`;
		return `<g opacity="${r.opacity ?? 1}">
			<path d="${shape(r)}" fill="${paint}" fill-opacity="0.1"/>
			<g clip-path="url(#c${i})"><path d="${edge(r)}" stroke="${paint}" stroke-width="140" stroke-opacity="0.45" filter="url(#soft)"/></g>
			<path d="${faintEdge(r)}" stroke="${paint}" stroke-width="1" stroke-opacity="0.3"/>
			<path d="${edge(r)}" stroke="${paint}" stroke-width="36" stroke-opacity="0.35" filter="url(#bloom)"/>
			<path d="${edge(r)}" stroke="${paint}" stroke-width="3" filter="url(#neon)"/>
			<path d="${edge(r)}" stroke="#ffffff" stroke-width="1" stroke-opacity="0.8"/>
		</g>`;
	});
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${BANNER_WIDTH} ${BANNER_HEIGHT}" preserveAspectRatio="xMidYMid slice" fill="none"><defs>${defs.join("")}</defs>${groups.join("")}</svg>`;
}

const svgUrl = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;
const background = svgUrl(ribbonsSvg(bannerRibbons));

// The banner's stack of layers, Foundations at the bottom (axiom-banner.astro).
const layers = ["Foundations", "Primitives", "Compositions", "Blocks"];
const gap = 75;
const plane = "0,111 245,0 467,121 223,238";
const edgeAngle = (Math.atan2(121 - 238, 467 - 223) * 180) / Math.PI;
const stackHeight = (layers.length - 1) * gap + 238;
const stack = svgUrl(
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 475 ${stackHeight + 8}">${layers
		.map((_, i) => `<polygon transform="translate(0 ${(layers.length - 1 - i) * gap})" points="${plane}" fill="${INK}" stroke="${FG}" stroke-opacity="0.75" stroke-width="1.2" stroke-linejoin="round"/>`)
		.join("")}</svg>`,
);
const STACK_WIDTH = 341;
const stackScale = STACK_WIDTH / 475;

function Frame({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ display: "flex", position: "relative", width: "100%", height: "100%", backgroundColor: INK, color: FG, fontFamily: "Inter" }}>
			<img src={background} width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }} />
			{children}
		</div>
	);
}

/** The site's preview: the banner. */
function SiteImage() {
	return (
		<Frame>
			<div style={{ position: "absolute", left: 188, top: 227, display: "flex", flexDirection: "column", gap: 26 }}>
				<div style={{ display: "flex", fontSize: 90, color: FG }}>
					<Logo />
				</div>
				<div style={{ fontFamily: "Outfit", fontWeight: 300, fontSize: 32, lineHeight: 1.25, color: MUTED }}>
					Build mobile experiences,
					<br />
					not isolated components.
				</div>
			</div>
			<div style={{ position: "absolute", left: 714, top: 158, width: STACK_WIDTH, height: (stackHeight + 8) * stackScale, display: "flex" }}>
				<img src={stack} width={STACK_WIDTH} height={(stackHeight + 8) * stackScale} />
				{layers.map((name, i) => (
					<div
						style={{
							position: "absolute",
							left: (238 + 4) * stackScale,
							top: ((layers.length - 1 - i) * gap + 220 + 4) * stackScale - 13,
							fontSize: 13,
							letterSpacing: "0.14em",
							textTransform: "uppercase",
							color: "rgba(242, 245, 248, 0.8)",
							transform: `rotate(${edgeAngle}deg)`,
							transformOrigin: "0 100%",
						}}
					>
						{name}
					</div>
				))}
			</div>
		</Frame>
	);
}

/** A docs page's preview: its title and description over the banner's ribbons. */
function PageImage({ title, description, section }: { title: string; description?: string; section: string }) {
	return (
		<Frame>
			<div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "64px 72px" }}>
				<div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40 }}>
					<Logo />
					<div style={{ fontSize: 24, color: MUTED }}>{section}</div>
				</div>
				<div style={{ display: "flex", flexDirection: "column", marginTop: "auto", maxWidth: 820, gap: 20 }}>
					<div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.02em" }}>{title}</div>
					{description && <div style={{ fontSize: 28, lineHeight: 1.4, color: MUTED, lineClamp: 3 }}>{description}</div>}
				</div>
			</div>
		</Frame>
	);
}

export async function siteImage() {
	return new ImageResponse(<SiteImage />, { ...ogSize, format: "png", fonts: await fonts });
}

export async function pageImage(page: { title: string; description?: string; section?: string }) {
	return new ImageResponse(<PageImage section="Docs" {...page} />, { ...ogSize, format: "png", fonts: await fonts });
}
