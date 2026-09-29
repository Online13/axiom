import { observer } from "@legendapp/state/react";
import type { ColorRole, ColorScheme } from "@docs/lib/tokens";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";
import { primitiveLabel, themeScheme, type Swatch } from "../../lib/theme";
import { setDarkMode, theme$ } from "../../state/theme";
import { announce, navigate, ui$ } from "../../state/ui";
import { PageHeader } from "./PageHeader";

// Same groups, same order as theme/colors.ts.
export const groupLabels: Record<ColorRole, string> = {
	background: "Background",
	content: "Content",
	border: "Border",
	primary: "Primary",
	highlight: "Highlight",
	feedback: "Feedback",
};

/**
 * The few roles that set the look of a theme, a fill with the text drawn on
 * it. The others follow from them, and stay one page away.
 */
const essentials: {
	title: string;
	rows: { path: string; label: string }[];
}[] = [
	{
		title: "Primary",
		rows: [
			{ path: "primary.default", label: "Fill" },
			{ path: "primary.on", label: "Text on it" },
		],
	},
	{
		title: "Background",
		rows: [
			{ path: "background.default", label: "Fill" },
			{ path: "content.default", label: "Text" },
			{ path: "content.muted", label: "Secondary text" },
		],
	},
	{
		title: "Surface",
		rows: [
			{ path: "background.elevated", label: "Cards and sheets" },
			{ path: "border.default", label: "Border" },
		],
	},
	{
		title: "Highlight",
		rows: [
			{ path: "highlight.default", label: "Fill" },
			{ path: "highlight.on", label: "Text on it" },
		],
	},
];

const schemes: ColorScheme[] = ["light", "dark"];

const pathOf = (swatch: Swatch) => `${swatch.role}.${swatch.key}`;

/**
 * Every role of the theme in both schemes, by path. Without a dark mode, the
 * dark values are the light ones, and cannot be opened.
 */
function useSwatches() {
	const theme = theme$.get();
	const byPath = (scheme: ColorScheme) =>
		new Map(
			themeScheme(theme, scheme).map((swatch) => [pathOf(swatch), swatch]),
		);
	return {
		light: byPath("light"),
		dark: byPath("dark"),
		darkMode: theme.darkMode,
	};
}

type Swatches = ReturnType<typeof useSwatches>;

// Opening a value also previews its scheme, so the edit shows on the phones.
const open = (path: string, scheme: ColorScheme) => {
	ui$.scheme.set(scheme);
	navigate({ kind: "color", path, scheme });
};

/** Titles a group of rows, over its light and dark columns. */
function GroupHead({ title }: { title: string }) {
	return (
		<div className="tb-croles__head">
			<h3 className="tb-croles__title">{title}</h3>
			<span className="tb-croles__scheme">Light</span>
			<span className="tb-croles__scheme">Dark</span>
		</div>
	);
}

/** One role: its name, then its light and its dark value, each opening its page. */
function RoleRow({
	path,
	name,
	code = false,
	swatches,
}: {
	path: string;
	name: string;
	/** The name is the role's key rather than a plain label. */
	code?: boolean;
	swatches: Swatches;
}) {
	const light = swatches.light.get(path) as Swatch;
	const Name = code ? "code" : "span";
	return (
		<li
			className="tb-crole"
			data-path={path}
			onAnimationEnd={(event) =>
				event.currentTarget.removeAttribute("data-flash")
			}
		>
			<Name className="tb-crole__name" title={light.usage}>
				{name}
			</Name>
			{schemes.map((scheme) => {
				const swatch = swatches[scheme].get(path) as Swatch;
				const follows = scheme === "dark" && !swatches.darkMode;
				return (
					<button
						key={scheme}
						type="button"
						className="tb-crole__chip"
						style={{ background: swatch.hex }}
						data-custom={swatch.custom && !follows ? "" : undefined}
						disabled={follows}
						aria-label={`${path}, ${scheme}: ${primitiveLabel(swatch.value)}${follows ? ", same as light" : ""}`}
						title={
							follows
								? `${path} · dark · same as light`
								: `${path} · ${scheme} · ${primitiveLabel(swatch.value)}`
						}
						onClick={() => open(path, scheme)}
					/>
				);
			})}
		</li>
	);
}

/** Whether the theme has a dark scheme of its own, or dark follows light. */
function DarkModeSwitch({ on }: { on: boolean }) {
	return (
		<label className="tb-switch">
			<span>Dark mode</span>
			<input
				type="checkbox"
				role="switch"
				checked={on}
				onChange={(event) => {
					setDarkMode(event.target.checked);
					announce(
						event.target.checked
							? "Dark mode on"
							: "Dark mode off, dark follows light",
					);
				}}
			/>
		</label>
	);
}

/**
 * The colors section: the essential roles, and the way to every other role.
 */
export const EssentialColors = observer(function EssentialColors() {
	const swatches = useSwatches();
	const total = swatches.light.size;

	return (
		<div className="tb-croles">
			<DarkModeSwitch on={swatches.darkMode} />
			<p className="tb-note">
				{swatches.darkMode
					? "The colors that set the look. Click a light or dark value to change it."
					: "The colors that set the look. Click a value to change it; dark follows light."}
			</p>
			{essentials.map((group) => (
				<div className="tb-croles__group" key={group.title}>
					<GroupHead title={group.title} />
					<ul className="tb-croles__list">
						{group.rows.map((row) => (
							<RoleRow
								key={row.path}
								path={row.path}
								name={row.label}
								swatches={swatches}
							/>
						))}
					</ul>
				</div>
			))}
			<button
				type="button"
				className="tb-btn tb-btn--ghost tb-btn--block"
				onClick={() => navigate({ kind: "colors" })}
			>
				<SlidersHorizontal size={15} aria-hidden="true" />
				Customize all {total} colors
				<ChevronRight size={15} aria-hidden="true" />
			</button>
		</div>
	);
});

/**
 * Every semantic color of the theme, laid out like theme/colors.ts: each role
 * with its light and its dark value. A value opens its own page to be changed.
 */
export const ColorRolesPage = observer(function ColorRolesPage() {
	const swatches = useSwatches();
	const focused = ui$.focusedRoles.get();
	const list = useRef<HTMLDivElement>(null);
	const paths = [...swatches.light.keys()];
	const groups = [...new Set(paths.map((path) => path.split(".")[0]))];

	// A part picked on a phone flashes every role it is drawn with.
	// Waits a frame: the sidebar scrolls a page it has just opened to the top.
	useEffect(() => {
		if (!focused) return;
		const frame = requestAnimationFrame(() => {
			const rows = focused.paths
				.map((path) => list.current?.querySelector(`[data-path="${path}"]`))
				.filter((row): row is HTMLElement => row instanceof HTMLElement);
			rows[0]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
			for (const row of rows) {
				row.removeAttribute("data-flash");
				void row.offsetWidth; // restarts the animation on a repeat pick
				row.setAttribute("data-flash", "");
			}
		});
		return () => cancelAnimationFrame(frame);
	}, [focused]);

	return (
		<>
			<PageHeader
				title="All colors"
				detail="The roles every component reads. Click a light or dark value to change it — or click any part of a phone to find its roles."
			/>
			<div className="tb-croles" ref={list}>
				{groups.map((role) => (
					<div className="tb-croles__group" key={role}>
						<GroupHead title={groupLabels[role as ColorRole]} />
						<ul className="tb-croles__list">
							{paths
								.filter((path) => path.startsWith(`${role}.`))
								.map((path) => (
									<RoleRow
										key={path}
										path={path}
										name={path.split(".")[1]}
										code
										swatches={swatches}
									/>
								))}
						</ul>
					</div>
				))}
			</div>
		</>
	);
});
