import { observer } from "@legendapp/state/react";
import {
	spacingScales,
	spacingValues,
	type SpacingScale,
} from "../../lib/theme";
import { theme$ } from "../../state/theme";
import { announce } from "../../state/ui";

/** The density of the whole theme: one choice, applied to every spacing token. */
export const SpacingControls = observer(function SpacingControls() {
	const current = theme$.spacing.get();
	const steps = spacingValues(current);

	return (
		<div className="tb-group">
			<div
				className="tb-segmented"
				data-vertical
				role="group"
				aria-label="Spacing density"
			>
				{(Object.keys(spacingScales) as SpacingScale[]).map((scale) => (
					<button
						key={scale}
						type="button"
						aria-pressed={scale === current}
						onClick={() => {
							theme$.spacing.set(scale);
							announce(`${spacingScales[scale].label} spacing`);
						}}
					>
						{spacingScales[scale].label}
					</button>
				))}
			</div>
			<p className="tb-note">
				Paddings, gaps and margins, everywhere at once: spacing 1 · 2 · 4 ·
				6 is {steps[1]} · {steps[2]} · {steps[4]} · {steps[6]}.
			</p>
		</div>
	);
});
