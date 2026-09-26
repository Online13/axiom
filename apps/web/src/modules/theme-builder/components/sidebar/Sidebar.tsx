import { observer } from "@legendapp/state/react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { resetRoles, resetTheme, theme$ } from "../../state/theme";
import {
	announce,
	back,
	type SidebarPage,
	type SidebarSection,
	ui$,
} from "../../state/ui";
import { ColorPage } from "./ColorPage";
import { ColorRoles } from "./ColorRoles";
import { FontField, FontPage } from "./FontControl";
import { PresetField, PresetPage } from "./PresetControl";
import { ShapeControls } from "./ShapeControls";
import { SidebarHide } from "./SidebarToggle";
import { SpacingControls } from "./SpacingControls";

type Page = Exclude<SidebarPage, { kind: "root" }>;

/**
 * Two panes side by side: the sections, and the page of whatever value is
 * being picked. Opening a page slides the track left; the pane out of view is
 * inert, so neither the keyboard nor a screen reader lands in it. A list page
 * widens the panel to twice its width as it slides in. The whole
 * panel floats over the canvas and folds away into its top-left corner.
 */
export const Sidebar = observer(function Sidebar() {
	const page = ui$.page.get();
	const open = page.kind !== "root";
	const shownPanel = ui$.sidebarOpen.get();
	// The page keeps its content while it slides back out of view.
	const [shown, setShown] = useState<Page | null>(null);
	const pane = useRef<HTMLDivElement>(null);
	// Lists of fonts and presets get twice the room; a color page does not.
	const wide = page.kind === "font" || page.kind === "preset";

	if (open && page !== shown) setShown(page);

	// A page opens scrolled to the top, focus on its search field or its way
	// back. Switching the scheme of the same role is not a new page.
	const key = !open
		? null
		: page.kind === "font"
			? page.role
			: page.kind === "color"
				? page.path
				: page.kind;
	useEffect(() => {
		if (!key || !pane.current) return;
		pane.current.scrollTop = 0;
		const target =
			pane.current.querySelector<HTMLElement>("[data-autofocus]") ??
			pane.current.querySelector<HTMLElement>(".tb-page__back");
		target?.focus({ preventScroll: true });
	}, [key]);

	return (
		<aside
			id="tb-panel"
			className="tb-panel"
			aria-label="Theme controls"
			data-open={shownPanel ? "" : undefined}
			data-wide={wide ? "" : undefined}
			inert={!shownPanel}
		>
			<div className="tb-panel__head">
				<SidebarHide />
				<span className="tb-panel__title">Theme</span>
			</div>
			<div className="tb-nav" data-page={open ? "" : undefined}>
				<div className="tb-nav__pane" inert={open}>
					<Sections />
				</div>
				<div
					className="tb-nav__pane tb-page"
					ref={pane}
					inert={!open}
					onKeyDown={(event) => event.key === "Escape" && back()}
				>
					{shown?.kind === "color" && (
						<ColorPage path={shown.path} scheme={shown.scheme} />
					)}
					{shown?.kind === "font" && <FontPage role={shown.role} />}
					{shown?.kind === "preset" && <PresetPage />}
				</div>
			</div>
		</aside>
	);
});

const Sections = observer(function Sections() {
	const custom = Object.keys(theme$.overrides.get()).length;

	return (
		<>
			<PresetField />
			<Section id="colors" title="Colors">
				<ColorRoles />
			</Section>
			<Section id="fonts" title="Fonts">
				<FontField role="heading" />
				<FontField role="body" />
				<p className="tb-note">
					Titles use the heading font; everything else uses the body font.
				</p>
			</Section>
			<Section id="shape" title="Shape">
				<ShapeControls />
			</Section>
			<Section id="spacing" title="Spacing">
				<SpacingControls />
			</Section>

			<section className="tb-group tb-group--actions">
				{custom > 0 && (
					<button
						type="button"
						className="tb-btn tb-btn--ghost tb-btn--block"
						onClick={() => {
							resetRoles();
							announce("Every role is back to its default");
						}}
					>
						<RotateCcw size={15} aria-hidden="true" />
						Reset {custom} custom {custom === 1 ? "role" : "roles"}
					</button>
				)}
				<button
					type="button"
					className="tb-btn tb-btn--ghost tb-btn--block"
					onClick={() => {
						resetTheme();
						announce("Reset to the Axiom defaults");
					}}
				>
					<RotateCcw size={15} aria-hidden="true" />
					Reset to Axiom
				</button>
			</section>

			<p className="tb-note">
				Every preview is drawn with the real Axiom primitives, so the theme
				flows through it exactly as it would in a shipped app.
			</p>

			<p className="tb-status" aria-live="polite">
				{ui$.status.get()}
			</p>
		</>
	);
});

/** A foldable section; which ones are open is remembered between visits. */
const Section = observer(function Section({
	id,
	title,
	children,
}: {
	id: SidebarSection;
	title: string;
	children: ReactNode;
}) {
	// A section added since the visit that saved the others starts folded.
	const open = ui$.sections[id].get() ?? false;
	const body = `tb-section-${id}`;
	return (
		<section className="tb-section">
			<h2 className="tb-section__title">
				<button
					type="button"
					className="tb-section__toggle"
					aria-expanded={open}
					aria-controls={body}
					onClick={() => ui$.sections[id].set(!open)}
				>
					{title}
					<ChevronDown size={14} aria-hidden="true" />
				</button>
			</h2>
			<div className="tb-section__body" id={body} hidden={!open}>
				{children}
			</div>
		</section>
	);
});
