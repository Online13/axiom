import { extendTailwindMerge } from "tailwind-merge";

// The typography tokens are font sizes: without this, `text-callout` would be read as a color and
// dropped next to `text-content`.
const merge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{
					text: [
						"large-title",
						"title1",
						"title2",
						"title3",
						"headline",
						"body",
						"callout",
						"subheadline",
						"footnote",
						"caption",
					],
				},
			],
		},
	},
});

/**
 * Joins class names, skipping the falsy ones: `cx("flex-row", active && "opacity-50", className)`.
 *
 * A component writes its own classes first and the caller's `className` last: of two utilities that
 * set the same property, the last one wins, so `className="bg-highlight"` replaces a component's
 * own background.
 */
export function cx(...classes: (string | false | null | undefined)[]) {
	return merge(classes);
}
