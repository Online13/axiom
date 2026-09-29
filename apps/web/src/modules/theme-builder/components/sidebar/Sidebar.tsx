import { observer } from "@legendapp/state/react";
import { ChevronDown, RotateCcw } from "lucide-react";
import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { resetRoles, resetTheme, theme$ } from "../../state/theme";
import {
	announce,
	back,
	type SidebarPage,
	type SidebarSection,
	ui$,
} from "../../state/ui";
import { ThemeName } from "../ThemeName";
import { ColorPage } from "./ColorPage";
import { ColorRolesPage, EssentialColors } from "./ColorRoles";
import { FontField, FontPage } from "./FontControl";
import { PresetField, PresetPage } from "./PresetControl";
import { ShapeControls } from "./ShapeControls";
import { SidebarHide } from "./SidebarToggle";
import { SpacingControls } from "./SpacingControls";

/** How many pages can stack over the sections: every color, then one of them. */
const LEVELS = 2;

const keyOf = (page: SidebarPage) =>
	page.kind === "font"
		? page.role
		: page.kind === "color"
			? page.path
			: page.kind;

/**
 * The sections, then one pane per page that can stack over them: whatever
 * value is being picked, or the list of every color and a value of it. Opening
 * a page slides the track left; the panes out of view are inert, so neither
 * the keyboard nor a screen reader lands in them. A list page widens the panel
 * to twice its width as it slides in. The whole panel floats over the canvas
 * and folds away into its top-left corner.
 */
export const Sidebar = observer(function Sidebar() {
	const pages = ui$.pages.get();
	const depth = pages.length;
	const top = pages.at(-1);
	const shownPanel = ui$.sidebarOpen.get();
	// A page keeps its content while it slides back out of view.
	const [shown, setShown] = useState<SidebarPage[]>([]);
	const panes = useRef<(HTMLDivElement | null)[]>([]);
	const lastDepth = useRef(0);
	// Lists of fonts and presets get twice the room; a color page does not.
	const wide = top?.kind === "font" || top?.kind === "preset";

	if (pages.some((page, index) => page !== shown[index]))
		setShown([...pages, ...shown.slice(depth)]);

	// A page opens scrolled to the top, focus on its search field or its way
	// back. Switching the scheme of the same role is not a new page, and
	// coming back to a page leaves it as it was.
	const key = top ? `${depth}:${keyOf(top)}` : null;
	useEffect(() => {
		const returning = depth < lastDepth.current;
		lastDepth.current = depth;
		const pane = panes.current[depth];
		if (!key || returning || !pane) return;
		pane.scrollTop = 0;
		const target =
			pane.querySelector<HTMLElement>("[data-autofocus]") ??
			pane.querySelector<HTMLElement>(".tb-page__back");
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
				<ThemeName />
			</div>
			<div
				className="tb-nav"
				style={{ "--depth": depth } as CSSProperties}
			>
				<div className="tb-nav__pane" inert={depth > 0}>
					<Sections />
				</div>
				{Array.from({ length: LEVELS }, (_, index) => {
					const page = shown[index];
					return (
						<div
							key={index}
							className="tb-nav__pane tb-page"
							ref={(node) => {
								panes.current[index + 1] = node;
							}}
							inert={depth !== index + 1}
							onKeyDown={(event) => event.key === "Escape" && back()}
						>
							{page?.kind === "color" && (
								<ColorPage path={page.path} scheme={page.scheme} />
							)}
							{page?.kind === "colors" && <ColorRolesPage />}
							{page?.kind === "font" && <FontPage role={page.role} />}
							{page?.kind === "preset" && <PresetPage />}
						</div>
					);
				})}
			</div>
		</aside>
	);
});

const Sections = observer(function Sections() {
	const custom = Object.keys(theme$.overrides.get()).length;

	return (
		<>
			<PresetField />
			<Section id="spacing" title="Spacing">
				<SpacingControls />
			</Section>
			<Section id="colors" title="Colors">
				<EssentialColors />
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
