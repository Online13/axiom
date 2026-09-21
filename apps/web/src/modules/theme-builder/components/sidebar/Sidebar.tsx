import { observer } from "@legendapp/state/react";
import { Dices, RotateCcw } from "lucide-react";
import { oklchToHex } from "../../lib/color";
import type { SeedName } from "../../lib/theme";
import { resetTheme, theme$ } from "../../state/theme";
import { announce, ui$ } from "../../state/ui";
import { FontControl } from "./FontControl";
import { SeedControls } from "./SeedControls";
import { ShapeControls } from "./ShapeControls";

// Keeps each seed inside its own family: a random warning is still orange.
function randomSeeds(): Record<SeedName, string> {
	const around = (base: number, spread: number) =>
		base + (Math.random() * 2 - 1) * spread;
	return {
		neutral: oklchToHex({ l: 0.56, c: 0.012, h: around(280, 180) }),
		accent: oklchToHex({
			l: 0.5 + Math.random() * 0.2,
			c: 0.13 + Math.random() * 0.08,
			h: Math.random() * 360,
		}),
		success: oklchToHex({ l: 0.68, c: 0.17, h: around(145, 25) }),
		warning: oklchToHex({ l: 0.76, c: 0.16, h: around(70, 18) }),
		error: oklchToHex({ l: 0.6, c: 0.21, h: around(27, 18) }),
	};
}

export const Sidebar = observer(function Sidebar() {
	return (
		<aside className="tb-panel" aria-label="Theme controls">
			<SeedControls />
			<ShapeControls />
			<FontControl />

			<section className="tb-group tb-group--actions">
				<button
					type="button"
					className="tb-btn tb-btn--ghost tb-btn--block"
					onClick={() => {
						theme$.seeds.set(randomSeeds());
						announce("Random seeds");
					}}
				>
					<Dices size={15} aria-hidden="true" />
					Randomize seeds
				</button>
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

			<p className="tb-status" aria-live="polite">
				{ui$.status.get()}
			</p>
		</aside>
	);
});
