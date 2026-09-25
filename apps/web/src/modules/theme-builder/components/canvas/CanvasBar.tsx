import { observer } from "@legendapp/state/react";
import { appTabs, inspectTabs, ui$, type Tab } from "../../state/ui";
import { RenderSettings } from "./RenderSettings";

export const CanvasBar = observer(function CanvasBar() {
	const active = ui$.tab.get();

	const tab = (id: Tab, label: string) => (
		<button
			key={id}
			type="button"
			role="tab"
			id={`tb-tab-${id}`}
			aria-controls="tb-view"
			aria-selected={id === active}
			onClick={() => ui$.tab.set(id)}
		>
			{label}
		</button>
	);

	return (
		<div className="tb-canvas__bar">
			<div
				className="tb-tabs"
				role="tablist"
				aria-label="Preview and inspection views"
			>
				<span className="tb-tabs__group" aria-hidden="true">
					Apps
				</span>
				{(Object.keys(appTabs) as (keyof typeof appTabs)[]).map((id) =>
					tab(id, appTabs[id].label),
				)}
				<span className="tb-tabs__sep" aria-hidden="true" />
				<span className="tb-tabs__group" aria-hidden="true">
					Inspect
				</span>
				{(Object.keys(inspectTabs) as (keyof typeof inspectTabs)[]).map(
					(id) => tab(id, inspectTabs[id]),
				)}
			</div>

			<RenderSettings />
		</div>
	);
});
