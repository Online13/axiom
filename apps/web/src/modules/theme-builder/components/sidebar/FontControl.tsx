import { observer } from "@legendapp/state/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronRight, Search } from "lucide-react";
import {
	SYSTEM_FONT,
	googleFonts,
	loadFont,
	systemEntry,
	type FontEntry,
} from "../../lib/fonts";
import { setFont, theme$, type FontRole } from "../../state/theme";
import { announce, back, navigate } from "../../state/ui";
import { PageHeader } from "./PageHeader";

const roleLabels: Record<FontRole, string> = {
	heading: "Heading font",
	body: "Body font",
};

const PAGE = 40;

type Category = "all" | FontEntry["category"];

const categories: { value: Category; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "sans-serif", label: "Sans" },
	{ value: "serif", label: "Serif" },
	{ value: "display", label: "Display" },
	{ value: "handwriting", label: "Script" },
	{ value: "monospace", label: "Mono" },
];

const face = (family: string) =>
	family === SYSTEM_FONT ? undefined : `'${family}', system-ui`;

const samples: Record<FontRole, string> = {
	heading: "Discover things worth keeping",
	body: "The quick brown fox jumps over the lazy dog.",
};

/**
 * The face of one font role, shown as a specimen set in itself: a large Aa,
 * its name and a line of text. Opens the font list.
 */
export const FontField = observer(function FontField({
	role,
}: {
	role: FontRole;
}) {
	const current = theme$.fonts[role].get();
	const category =
		current === SYSTEM_FONT
			? "System"
			: (categories.find(
					({ value }) =>
						value ===
						googleFonts.find((font) => font.family === current)?.category,
				)?.label ?? "");
	return (
		<button
			type="button"
			className="tb-fontcard"
			aria-label={`${roleLabels[role]}: ${current}`}
			onClick={() => navigate({ kind: "font", role })}
		>
			<span className="tb-fontcard__head">
				<span className="tb-field__label">{roleLabels[role]}</span>
				<ChevronRight size={14} aria-hidden="true" />
			</span>
			<span
				className="tb-fontcard__body"
				style={{ fontFamily: face(current) }}
			>
				<span
					className="tb-fontcard__sample"
					data-role={role}
					aria-hidden="true"
				>
					Aa
				</span>
				<span className="tb-fontcard__meta">
					<span className="tb-fontcard__family tb-truncate">
						{current}
					</span>
					<span className="tb-fontcard__category">{category}</span>
				</span>
			</span>
			<span
				className="tb-fontcard__line tb-truncate"
				style={{ fontFamily: face(current) }}
				aria-hidden="true"
			>
				{samples[role]}
			</span>
		</button>
	);
});

/**
 * A searchable list of real Google Fonts for one role. Each row previews
 * itself in its own face, and picking one loads the stylesheet, so the phones
 * change typeface for real rather than falling back to the system stack.
 */
export const FontPage = observer(function FontPage({
	role,
}: {
	role: FontRole;
}) {
	const current = theme$.fonts[role].get();
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<Category>("all");
	const [shown, setShown] = useState(PAGE);

	const results = useMemo(() => {
		const needle = query.trim().toLowerCase();
		const list: FontEntry[] = [systemEntry, ...googleFonts];
		return list.filter(
			(font) =>
				(category === "all" ||
					(font.category === category && font !== systemEntry)) &&
				font.family.toLowerCase().includes(needle),
		);
	}, [query, category]);

	// A new search or filter starts again from the first page.
	useEffect(() => setShown(PAGE), [results]);

	const page = useMemo(() => results.slice(0, shown), [results, shown]);

	// Each family is a network request, so only the rendered rows load theirs.
	useEffect(() => {
		for (const font of page) loadFont(font.family);
	}, [page]);

	// The next page renders when the end of the list scrolls into view.
	const sentinelRef = useRef<HTMLLIElement>(null);
	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) setShown((count) => count + PAGE);
			},
			{ rootMargin: "200px 0px" },
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [page.length]);

	const pick = (family: string) => {
		setFont(role, family);
		announce(`${family} for ${role === "heading" ? "titles" : "body text"}`);
		back();
	};

	return (
		<>
			<PageHeader
				title={roleLabels[role]}
				detail={`${googleFonts.length} families from the Google Fonts catalogue.`}
			/>
			<div className="tb-fontpicker__search">
				<Search size={14} aria-hidden="true" />
				<input
					type="search"
					value={query}
					placeholder="Search Google Fonts"
					aria-label="Search fonts"
					data-autofocus
					onChange={(event) => setQuery(event.target.value)}
				/>
			</div>
			<div
				className="tb-fontpicker__filters"
				role="group"
				aria-label="Font category"
			>
				{categories.map(({ value, label }) => (
					<button
						key={value}
						type="button"
						aria-pressed={value === category}
						onClick={() => setCategory(value)}
					>
						{label}
					</button>
				))}
			</div>
			<ul className="tb-fontpicker__list" aria-label="Fonts">
				{page.map((font) => (
					<li key={font.family}>
						<button
							type="button"
							aria-pressed={font.family === current}
							onClick={() => pick(font.family)}
						>
							<span
								className="tb-fontpicker__sample"
								style={{ fontFamily: face(font.family) }}
								aria-hidden="true"
							>
								Aa
							</span>
							<span
								className="tb-fontpicker__family tb-truncate"
								style={{ fontFamily: face(font.family) }}
							>
								{font.family}
							</span>
							{font.family === current && (
								<Check size={14} aria-hidden="true" />
							)}
						</button>
					</li>
				))}
				{shown < results.length && (
					<li ref={sentinelRef} className="tb-fontpicker__empty">
						Loading more…
					</li>
				)}
				{results.length === 0 && (
					<li className="tb-fontpicker__empty">No font matches that.</li>
				)}
			</ul>
		</>
	);
});
