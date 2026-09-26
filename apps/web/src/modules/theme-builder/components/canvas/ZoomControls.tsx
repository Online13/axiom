import { observer } from "@legendapp/state/react";
import { Focus, Minus, Plus } from "lucide-react";
import { camera$, fitAll, focusNearest, zoomIn, zoomOut } from "./camera";

/**
 * Zoom out, the current zoom (a click fits every screen), zoom in, and focus:
 * the screen nearest the middle, brought in at about 83%.
 */
export const ZoomControls = observer(function ZoomControls() {
	const zoom = Math.round(camera$.z.get() * 100);

	return (
		<div className="tb-zoom tb-float" role="group" aria-label="Zoom">
			<button type="button" aria-label="Zoom out" onClick={zoomOut}>
				<Minus size={14} aria-hidden="true" />
			</button>
			<button
				type="button"
				className="tb-zoom__level"
				title="Fit every screen (Shift+1)"
				aria-label={`Zoom ${zoom}%, fit every screen`}
				onClick={fitAll}
			>
				{zoom}%
			</button>
			<button type="button" aria-label="Zoom in" onClick={zoomIn}>
				<Plus size={14} aria-hidden="true" />
			</button>
			<button
				type="button"
				title="Focus the screen in the middle (Shift+3)"
				aria-label="Focus the screen in the middle"
				onClick={focusNearest}
			>
				<Focus size={14} aria-hidden="true" />
			</button>
		</div>
	);
});
