// Finds which `--ax-*` color paints an element of a mockup. The previews only
// color through those variables — preview.css rules and inline styles — so
// the declarations that apply to an element name its color directly, with no
// guessing from computed pixels (an ink primary and the neutral ramp share
// values, their variables don't).

const COLOR_VAR = /var\(\s*(--ax-[a-z0-9-]+)/;

// Checked in this order on the element itself: what fills it wins over what
// outlines it, which wins over its text.
const FILL = ["background", "background-color", "background-image", "fill"];
const LINE = [
	"border",
	"border-color",
	"border-top",
	"border-right",
	"border-bottom",
	"border-left",
	"outline",
	"outline-color",
	"stroke",
];
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

export type Inspected = {
	/** What to outline: the element that carries the color. */
	element: Element;
	variable: string;
};

/**
 * The color behind whatever is under the pointer. Text and glyphs inherit
 * their color, so for them the search climbs `color` only; a bare box shows
 * the fill of the nearest painted ancestor instead.
 */
export function inspect(target: Element, screen: Element): Inspected | null {
	if (!screen.contains(target)) return null;
	const all = [...FILL, ...LINE, ...TEXT];

	// A chart path carries its own stroke; an icon's paths take the svg's color.
	const direct = declared(target, all);
	if (direct) return { element: target, variable: direct };
	const element = target.closest("svg") ?? target;
	const own = element === target ? null : declared(element, all);
	if (own) return { element, variable: own };

	const text = element instanceof SVGElement || hasText(element);
	for (
		let parent = element.parentElement;
		parent && screen.contains(parent);
		parent = parent.parentElement
	) {
		const variable = declared(parent, text ? TEXT : FILL);
		if (variable) return { element: text ? element : parent, variable };
	}
	return null;
}
