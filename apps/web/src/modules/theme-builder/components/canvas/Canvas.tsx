import { observer } from "@legendapp/state/react";
import { useRef } from "react";
import { type AppTab, appTabs, isAppTab, ui$ } from "../../state/ui";
import { CanvasBar } from "./CanvasBar";
import { CodeView } from "./CodeView";
import { PalettesView } from "./PalettesView";
import { RolesView } from "./RolesView";
import { ComponentsView } from "./ComponentsView";
import { FinanceApp } from "./apps/finance/FinanceApp";
import { FitnessApp } from "./apps/fitness/FitnessApp";
import { MusicApp } from "./apps/music/MusicApp";
import { TravelApp } from "./apps/travel/TravelApp";
import { useFitScale } from "./useFitScale";

const apps = {
	music: MusicApp,
	travel: TravelApp,
	fitness: FitnessApp,
	finance: FinanceApp,
} as const;

/** An app's three screens side by side, scaled to fit the window. */
const AppPreview = observer(function AppPreview({ tab }: { tab: AppTab }) {
	const scheme = ui$.scheme.get();
	const device = ui$.device.get();
	const ref = useRef<HTMLDivElement>(null);
	useFitScale(ref, device);
	const App = apps[tab];

	return (
		<>
			<header className="tb-app-head">
				<h2 className="tb-app-head__name">{appTabs[tab].name}</h2>
				<p className="tb-app-head__tagline">{appTabs[tab].tagline}</p>
			</header>
			<div
				ref={ref}
				className="tb-devices"
				data-ax-preview
				data-scheme={scheme}
			>
				<App />
			</div>
		</>
	);
});

export const Canvas = observer(function Canvas() {
	const tab = ui$.tab.get();

	return (
		<main className="tb-canvas">
			<CanvasBar />
			<div
				className="tb-view"
				role="tabpanel"
				id="tb-view"
				aria-labelledby={`tb-tab-${tab}`}
				tabIndex={0}
			>
				{isAppTab(tab) ? (
					<AppPreview tab={tab} />
				) : tab === "components" ? (
					<ComponentsView />
				) : tab === "roles" ? (
					<RolesView />
				) : tab === "palettes" ? (
					<PalettesView />
				) : (
					<CodeView />
				)}
			</div>
		</main>
	);
});
