import { observer } from "@legendapp/state/react";
import { useRef } from "react";
import { ui$ } from "../../state/ui";
import { SidebarToggle } from "../sidebar/SidebarToggle";
import { useCamera } from "./camera";
import { RenderSettings } from "./RenderSettings";
import { IndexApp } from "./screens/IndexApp";
import { ZoomControls } from "./ZoomControls";

/**
 * Every screen of the app, four to a row, on a canvas that pans and zooms
 * rather than scrolls.
 */
export const Canvas = observer(function Canvas() {
	const scheme = ui$.scheme.get();
	const device = ui$.device.get();
	const view = useRef<HTMLElement>(null);
	const world = useRef<HTMLDivElement>(null);
	useCamera(view, world, device);

	return (
		<main className="tb-canvas">
			{/* Focusable so the keyboard can pan and zoom it. */}
			<section
				ref={view}
				className="tb-view"
				aria-label="App screens"
				aria-describedby="tb-view-help"
				tabIndex={0}
			>
				<p id="tb-view-help" hidden>
					Arrow keys pan, plus and minus zoom, Shift+1 fits every screen,
					Shift+3 focuses the screen in the middle, Shift+0 shows them at
					full size.
				</p>
				<div
					ref={world}
					className="tb-devices"
					data-ax-preview
					data-scheme={scheme}
				>
					<IndexApp />
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
