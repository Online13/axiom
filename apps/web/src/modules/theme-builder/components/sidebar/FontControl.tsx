import { observer } from "@legendapp/state/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
	SYSTEM_FONT,
	allFonts,
	curatedFonts,
	loadFont,
	systemEntry,
	type FontEntry,
} from "../../lib/fonts";
import { setFont, theme$ } from "../../state/theme";
import { announce } from "../../state/ui";

/**
 * A searchable list of real Google Fonts. Each row previews itself in its own
 * face, and picking one loads the stylesheet, so the phones change typeface for
 * real rather than falling back to the system stack.
 */
export const FontControl = observer(function FontControl() {
	const current = theme$.font.get();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [catalogue, setCatalogue] = useState<FontEntry[]>(curatedFonts);
	const box = useRef<HTMLDivElement>(null);

	useEffect(() => {
		allFonts().then(setCatalogue);
	}, []);

	const results = useMemo(() => {
		const needle = query.trim().toLowerCase();
		const list = [systemEntry, ...catalogue];
		const matches = needle
			? list.filter((font) => font.family.toLowerCase().includes(needle))
			: list;
		return matches.slice(0, 80);
	}, [query, catalogue]);

	// Only the visible rows are loaded — the catalogue can be two thousand
	// families deep and each one is a network request.
	useEffect(() => {
		if (!open) return;
		for (const font of results.slice(0, 24)) loadFont(font.family);
	}, [open, results]);

	useEffect(() => {
		if (!open) return;
		const close = (event: MouseEvent) => {
			if (!box.current?.contains(event.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", close);
		return () => document.removeEventListener("mousedown", close);
	}, [open]);

	const pick = (family: string) => {
		setFont(family);
		announce(`${family} typeface`);
		setOpen(false);
		setQuery("");
	};

	return (
		<section className="tb-group">
			<h2 className="tb-eyebrow">Typeface</h2>
			<div className="tb-fontpicker" ref={box}>
				<button
					type="button"
					className="tb-fontpicker__trigger"
					aria-expanded={open}
					aria-haspopup="listbox"
					onClick={() => setOpen((value) => !value)}
					style={{
						fontFamily:
							current === SYSTEM_FONT ? undefined : `'${current}', system-ui`,
					}}
				>
					<span className="tb-truncate">{current}</span>
					<ChevronDown size={14} aria-hidden="true" />
				</button>

				{open && (
					<div className="tb-fontpicker__menu">
						<div className="tb-fontpicker__search">
							<Search size={14} aria-hidden="true" />
							<input
								autoFocus
								type="search"
								value={query}
								placeholder="Search Google Fonts"
								aria-label="Search fonts"
								onChange={(event) => setQuery(event.target.value)}
							/>
						</div>
						<ul className="tb-fontpicker__list" role="listbox">
							{results.map((font) => (
								<li key={font.family}>
									<button
										type="button"
										role="option"
										aria-selected={font.family === current}
										onMouseEnter={() => loadFont(font.family)}
										onClick={() => pick(font.family)}
									>
										<span
											className="tb-truncate"
											style={{
												fontFamily:
													font.family === SYSTEM_FONT
														? undefined
														: `'${font.family}', system-ui`,
											}}
										>
											{font.family}
										</span>
										{font.family === current && (
											<Check size={14} aria-hidden="true" />
										)}
									</button>
								</li>
							))}
							{results.length === 0 && (
								<li className="tb-fontpicker__empty">No font matches that.</li>
							)}
						</ul>
					</div>
				)}
			</div>
			<p className="tb-note">
				{catalogue.length > curatedFonts.length
					? `${catalogue.length} families from the Google Fonts catalogue.`
					: "A curated set of Google Fonts — set PUBLIC_GOOGLE_FONTS_API_KEY for the full catalogue."}
			</p>
		</section>
	);
});
