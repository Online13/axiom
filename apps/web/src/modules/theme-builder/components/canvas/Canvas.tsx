import { observer } from "@legendapp/state/react";
import { appTabs, isAppTab, ui$ } from "../../state/ui";
import { CanvasBar } from "./CanvasBar";
import { CodeView } from "./CodeView";
import { PalettesView } from "./PalettesView";
import { RolesView } from "./RolesView";
import { ProductivityApp } from "./apps/ProductivityApp";
import { RecipesApp } from "./apps/RecipesApp";
import { SocialApp } from "./apps/SocialApp";
import { TodoApp } from "./apps/TodoApp";

const apps = {
	todo: TodoApp,
	productivity: ProductivityApp,
	recipes: RecipesApp,
	social: SocialApp,
} as const;

export const Canvas = observer(function Canvas() {
	const tab = ui$.tab.get();
	const scheme = ui$.scheme.get();

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
					<>
						<p className="tb-view__intro">{appTabs[tab].caption} — every screen is
							drawn with the real Axiom primitives, so the seeds flow through it
							exactly as they would in a shipped app.</p>
						<div className="tb-devices" data-ax-preview data-scheme={scheme}>
							{(() => {
								const App = apps[tab];
								return <App />;
							})()}
						</div>
					</>
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
