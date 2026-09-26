import { observer } from "@legendapp/state/react";
import {
	controlShapes,
	radiusScales,
	radiusValues,
	type ControlShape,
	type RadiusScale,
} from "../../lib/theme";
import { theme$ } from "../../state/theme";
import { announce } from "../../state/ui";

export const ShapeControls = observer(function ShapeControls() {
	const current = theme$.radius.get();
	const controls = theme$.controls.get();
	const { sm, md, lg, xl } = radiusValues(current);

	return (
		<div className="tb-group">
			<div
				className="tb-segmented"
				role="group"
				aria-label="Corner radius scale"
			>
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

			<div className="tb-segmented" role="group" aria-label="Control shape">
				{(Object.keys(controlShapes) as ControlShape[]).map((shape) => (
					<button
						key={shape}
						type="button"
						aria-pressed={shape === controls}
						onClick={() => {
							theme$.controls.set(shape);
							announce(`${controlShapes[shape].label} controls`);
						}}
					>
						{controlShapes[shape].label}
					</button>
				))}
			</div>
			<p className="tb-note">
				The corner of buttons, inputs, segmented controls and chips. Written
				into their component tokens on export.
			</p>
		</div>
	);
});
