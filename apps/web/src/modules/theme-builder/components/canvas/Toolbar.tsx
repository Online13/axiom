import { observer } from "@legendapp/state/react";
import { GalleryHorizontal, Moon, Pipette, Sun } from "lucide-react";
import { type CanvasTool, ui$ } from "../../state/ui";

const tools: {
	id: CanvasTool;
	label: string;
	Icon: typeof Pipette;
}[] = [
	{
		id: "pick",
		label: "Pick colors: a click opens a part's roles",
		Icon: Pipette,
	},
	{
		id: "slides",
		label: "Slides: arrow keys step between screens",
		Icon: GalleryHorizontal,
	},
];

/**
 * Square toggles beside the sidebar: the modes the canvas can be in, and the
 * color scheme the mockups are drawn in.
 */
export const Toolbar = observer(function Toolbar() {
	const on = ui$.tools.get();
	const scheme = ui$.scheme.get();
	// The sheet has no phones to pick on or step through.
	const phones = ui$.view.get() === "preview";

	return (
		<div className="tb-tools tb-float" role="group" aria-label="Canvas tools">
			{phones &&
				tools.map(({ id, label, Icon }) => (
					<button
						key={id}
						type="button"
						title={label}
						aria-label={label}
						aria-pressed={on[id]}
						onClick={() => ui$.tools[id].set(!on[id])}
					>
						<Icon size={16} aria-hidden="true" />
					</button>
				))}
			<button
				type="button"
				title="Dark scheme"
				aria-label="Dark scheme"
				aria-pressed={scheme === "dark"}
				onClick={() => ui$.scheme.set(scheme === "dark" ? "light" : "dark")}
			>
				{scheme === "dark" ? (
					<Moon size={16} aria-hidden="true" />
				) : (
					<Sun size={16} aria-hidden="true" />
				)}
			</button>
		</div>
	);
});
