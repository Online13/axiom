import { observer } from "@legendapp/state/react";
import { paletteSteps } from "@docs/lib/tokens";
import { hslaToHex } from "../../lib/color";
import { buildPalette, seedNames, seeds } from "../../lib/theme";
import { theme$ } from "../../state/theme";

export const PalettesView = observer(function PalettesView() {
	const generated = buildPalette(theme$.get());

	return (
		<>
			<p className="tb-view__intro">
				Step 500 is the seed you picked. The other steps follow the lightness and
				chroma curve of the Axiom palettes, in OKLCH.
			</p>

			{seedNames.map((name) => (
				<section className="tb-ramp" key={name}>
					<h3 className="tb-eyebrow">
						{seeds[name].label}
						<span className="tb-ramp__hue">{seeds[name].hue}</span>
					</h3>
					<ul className="tb-ramp__steps">
						{paletteSteps.map((step) => {
							const hex = hslaToHex(generated[name][step]);
							return (
								<li className="tb-ramp__step" key={step}>
									<span className="tb-ramp__chip" style={{ background: hex }} />
									<span className="tb-ramp__index">{step}</span>
									<span className="tb-ramp__hex">{hex.toUpperCase()}</span>
								</li>
							);
						})}
					</ul>
				</section>
			))}
		</>
	);
});
