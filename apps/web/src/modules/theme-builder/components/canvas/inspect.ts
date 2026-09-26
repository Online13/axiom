// Finds which `--ax-*` color paints an element of a mockup. The previews only
// color through those variables — preview.css rules and inline styles — so
// the declarations that apply to an element name its color directly, with no
// guessing from computed pixels (an ink primary and the neutral ramp share
// values, their variables don't).

import type { Paint } from "../../state/ui";

// Color variables only: the elevation, radius, size and font tokens are not.
const COLOR_VAR =
	/var\(\s*(--ax-(?!shadow|radius|control|font|scale)[a-z0-9-]+)/;

const FILL = ["background", "background-color", "background-image"];
const LINE = [
	"border",
	"border-color",
	"border-top",
	"border-right",
	"border-bottom",
	"border-left",
	"outline",
	"outline-color",
	// Outlined buttons draw their border as an inset ring.
	"box-shadow",
];
// What an svg shape paints with — a chart line or a pie slice.
const SHAPE = ["stroke", "fill"];
const TEXT = ["color"];

let rules: CSSStyleRule[] = [];
let sheetCount = -1;

function collect(list: CSSRuleList, into: CSSStyleRule[]) {
	for (const rule of list) {
		if (rule instanceof CSSStyleRule) into.push(rule);
		if ("cssRules" in rule) collect((rule as CSSGroupingRule).cssRules, into);
	}
}

// Rebuilt when a stylesheet is added — a font picked from Google adds one.
function styleRules(): CSSStyleRule[] {
	if (document.styleSheets.length === sheetCount) return rules;
	sheetCount = document.styleSheets.length;
	rules = [];
	for (const sheet of document.styleSheets) {
		try {
			collect(sheet.cssRules, rules);
		} catch {
			// Cross-origin sheets (Google Fonts) cannot be read, nor do they color.
		}
	}
	return rules;
}

const matches = (element: Element, rule: CSSStyleRule) => {
	try {
		return element.matches(rule.selectorText);
	} catch {
		return false;
	}
};

/** The variable an element declares for one of `props`: inline style first, then the last matching rule. */
function declared(element: Element, props: string[]): string | null {
	const inline = (element as HTMLElement).style;
	const all = styleRules();
	for (const prop of props) {
		const own = inline?.getPropertyValue(prop).match(COLOR_VAR);
		if (own) return own[1];
		for (let i = all.length - 1; i >= 0; i--) {
			const value = all[i].style.getPropertyValue(prop);
			if (!value) continue;
			const found = value.match(COLOR_VAR);
			if (found && matches(element, all[i])) return found[1];
		}
	}
	return null;
}

const hasText = (element: Element) =>
	[...element.childNodes].some(
		(node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
	);

export type Inspected = Paint & {
	/** What to outline: the part these colors belong to. */
	element: Element;
};

/** The first element from `start` up to the screen that declares one of `props`. */
function climb(start: Element, screen: Element, props: string[]) {
	for (
		let element: Element | null = start;
		element && screen.contains(element);
		element = element.parentElement
	) {
		const variable = declared(element, props);
		if (variable) return { element, variable };
	}
	return null;
}

/**
 * The part under the pointer and the colors it is drawn with. Text and icons
 * inherit their color and sit on an ancestor's fill, so both are climbed for;
 * a bare wrapper stands for the nearest filled box around it instead.
 */
export function inspect(target: Element, screen: Element): Inspected | null {
	if (!screen.contains(target)) return null;

	// A chart path paints itself; an icon's paths take the svg's color.
	const shape = target instanceof SVGElement ? declared(target, SHAPE) : null;
	let element = shape ? target : (target.closest("svg") ?? target);

	const painted =
		shape ||
		element instanceof SVGElement ||
		hasText(element) ||
		declared(element, [...FILL, ...LINE]);
	if (!painted) {
		const box = climb(element, screen, FILL);
		if (!box) return null;
		element = box.element;
	}

	// The border of the box the part sits in — a label inside an outlined
	// button — but never one from beyond the fill it sits on.
	const fill = climb(element, screen, FILL);
	const line = climb(element, screen, LINE);
	const border =
		line && (!fill || fill.element.contains(line.element))
			? line.variable
			: undefined;

	return {
		element,
		text: shape ?? climb(element, screen, TEXT)?.variable,
		background: fill?.variable,
		border,
	};
}
