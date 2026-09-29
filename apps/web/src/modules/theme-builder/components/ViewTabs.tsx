import { observer } from "@legendapp/state/react";
import { LayoutGrid, Smartphone } from "lucide-react";
import { type CanvasView, ui$ } from "../state/ui";

const views: { id: CanvasView; label: string; Icon: typeof Smartphone }[] = [
	{ id: "preview", label: "Preview", Icon: Smartphone },
	{ id: "system", label: "Design system", Icon: LayoutGrid },
];

/** Switches the canvas between the app's screens and the component sheet. */
export const ViewTabs = observer(function ViewTabs() {
	const current = ui$.view.get();
	return (
		<div
			className="tb-segmented tb-views"
			role="group"
			aria-label="Canvas view"
		>
			{views.map(({ id, label, Icon }) => (
				<button
					key={id}
					type="button"
					aria-pressed={id === current}
					onClick={() => {
						ui$.focusedScreen.set(null);
						ui$.view.set(id);
					}}
				>
					<Icon size={14} aria-hidden="true" />
					{label}
				</button>
			))}
		</div>
	);
});
