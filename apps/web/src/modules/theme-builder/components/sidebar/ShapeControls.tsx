import { observer } from "@legendapp/state/react";
import { radiusScales, radiusValues, type RadiusScale } from "../../lib/theme";
import { theme$ } from "../../state/theme";
import { announce } from "../../state/ui";

export const ShapeControls = observer(function ShapeControls() {
	const current = theme$.radius.get();
	const { sm, md, lg, xl } = radiusValues(current);

	return (
		<section className="tb-group">
			<h2 className="tb-eyebrow">Shape</h2>
			<div className="tb-segmented" role="group" aria-label="Corner radius scale">
				{(Object.keys(radiusScales) as RadiusScale[]).map((scale) => (
					<button
						key={scale}
						type="button"
						aria-pressed={scale === current}
						onClick={() => {
							theme$.radius.set(scale);
							announce(`${radiusScales[scale].label} corners`);
						}}
					>
						{radiusScales[scale].label}
					</button>
				))}
			</div>
			<p className="tb-note">
				Scales the radius tokens: sm {sm} · md {md} · lg {lg} · xl {xl}.
			</p>
		</section>
	);
});
