import { observer } from "@legendapp/state/react";
import { useRef } from "react";
import { ui$ } from "../../state/ui";
import { SidebarToggle } from "../sidebar/SidebarToggle";
import { useCamera } from "./camera";
import { RenderSettings } from "./RenderSettings";
import { IndexApp } from "./screens/IndexApp";
import { DesignSystem } from "./system/DesignSystem";
import { ZoomControls } from "./ZoomControls";

/**
 * Every screen of the app, four to a row, or every component on one sheet, on
 * a canvas that pans and zooms rather than scrolls.
 */
export const Canvas = observer(function Canvas() {
	const scheme = ui$.scheme.get();
	const device = ui$.device.get();
	const shown = ui$.view.get();
	const focused = ui$.focusedScreen.get() !== null;
	const view = useRef<HTMLElement>(null);
	const world = useRef<HTMLDivElement>(null);
	useCamera(view, world, device, shown);

	return (
		<main className="tb-canvas">
			{/* Focusable so the keyboard can pan and zoom it. */}
			<section
				ref={view}
				className="tb-view"
				aria-label={shown === "preview" ? "App screens" : "Design system"}
				aria-describedby="tb-view-help"
				tabIndex={0}
				onKeyDown={(event) => {
					if (event.key === "Escape") ui$.focusedScreen.set(null);
				}}
			>
				<p id="tb-view-help" hidden>
					Arrow keys pan, plus and minus zoom, Shift+1 fits every screen,
					Shift+3 focuses the screen in the middle, Shift+0 shows them at
					full size.
				</p>
				<div
					ref={world}
					className={`tb-world ${shown === "preview" ? "tb-devices" : "tb-system"}`}
					data-ax-preview
					data-scheme={scheme}
				>
					{shown === "preview" ? (
						<>
							{/* Behind the screen brought forward, over every other:
							    a click on it puts them back. */}
							<div
								className="tb-dim"
								data-shown={focused ? "" : undefined}
								aria-hidden="true"
								onClick={() => ui$.focusedScreen.set(null)}
							/>
							<IndexApp />
						</>
					) : (
						<DesignSystem />
					)}
				</div>
			</section>
			{/* Floating over the canvas, as on a map; after the view in the
			    tab order, since they act on it. */}
			<SidebarToggle />
			<div className="tb-overlay">
				<RenderSettings />
				<ZoomControls />
			</div>
		</main>
	);
});
