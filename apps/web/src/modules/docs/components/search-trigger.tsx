import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import type { FullSearchTriggerProps } from "fumadocs-ui/layouts/shared/slots/search-trigger";

const hints = [
	"Search a component...",
	"Find a hook...",
	"Search about styling...",
	"How to contribute?",
];

const typeDelay = 60;
const eraseDelay = 30;
const holdDelay = 1800;

// Types a hint, holds it, erases it letter by letter, then moves to the next one.
function useTypedHint() {
	const [hint, setHint] = useState(0);
	const [length, setLength] = useState(0);
	const [erasing, setErasing] = useState(false);
	const [animated, setAnimated] = useState(false);

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setAnimated(!query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);

	useEffect(() => {
		if (!animated) return;
		const full = hints[hint].length;
		let next: () => void;
		let delay: number;

		if (!erasing && length < full) {
			next = () => setLength(length + 1);
			delay = typeDelay;
		} else if (!erasing) {
			next = () => setErasing(true);
			delay = holdDelay;
		} else if (length > 0) {
			next = () => setLength(length - 1);
			delay = eraseDelay;
		} else {
			next = () => {
				setErasing(false);
				setHint((hint + 1) % hints.length);
			};
			delay = typeDelay * 4;
		}

		const timer = setTimeout(next, delay);
		return () => clearTimeout(timer);
	}, [animated, hint, length, erasing]);

	return animated ? hints[hint].slice(0, length) : hints[0];
}

// Replaces fumadocs' full search trigger, whose label is a fixed "Search".
export function TypedSearchTrigger({
	hideIfDisabled,
	className,
	...props
}: FullSearchTriggerProps) {
	const { enabled, hotKey, setOpenSearch } = useSearchContext();
	const text = useTypedHint();
	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			data-search-full=""
			aria-label="Search"
			{...props}
			onClick={() => setOpenSearch(true)}
			className={`inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground ${className ?? ""}`}
		>
			<Search className="size-4 shrink-0" />
			<span aria-hidden className="min-w-0 truncate whitespace-pre">
				{text}
				<span className="docs-search-caret" />
			</span>
			<div className="ms-auto inline-flex gap-0.5">
				{hotKey.map((key, i) => (
					<kbd key={i} className="rounded-md border bg-fd-background px-1.5">
						{key.display}
					</kbd>
				))}
			</div>
		</button>
	);
}
