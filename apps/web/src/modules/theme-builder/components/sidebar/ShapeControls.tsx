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

// The corner each radius scale draws on its 28px tile: the md token, enlarged
// so the scales read apart at a glance, and kept inside the tile.
const cornerOf = (scale: RadiusScale) => radiusValues(scale).md * 1.4;

// The corner a control shape gives a button drawn 20px tall.
const controlCorner: Record<ControlShape, number> = {
	square: 3,
	rounded: 6,
	pill: 10,
};

/**
 * Corners and control shapes are picked by their look, not their name: each
 * option draws the shape it gives. The name stays for the tooltip and for a
 * screen reader.
 */
export const ShapeControls = observer(function ShapeControls() {
	const current = theme$.radius.get();
	const controls = theme$.controls.get();
	const { sm, md, lg, xl } = radiusValues(current);

	return (
		<div className="tb-group">
			<span className="tb-field__label">Corners</span>
			<div
				className="tb-shapes"
				role="group"
				aria-label="Corner radius scale"
			>
				{(Object.keys(radiusScales) as RadiusScale[]).map((scale) => (
					<button
						key={scale}
						type="button"
						className="tb-shape"
						aria-pressed={scale === current}
						aria-label={radiusScales[scale].label}
						title={radiusScales[scale].label}
						onClick={() => {
							theme$.radius.set(scale);
							announce(`${radiusScales[scale].label} corners`);
						}}
					>
						<span
							className="tb-shape__corner"
							style={{ borderTopLeftRadius: cornerOf(scale) }}
							aria-hidden="true"
						/>
					</button>
				))}
			</div>
			<p className="tb-note">
				Scales the radius tokens: sm {sm} · md {md} · lg {lg} · xl {xl}.
			</p>

			<span className="tb-field__label">Controls</span>
			<div className="tb-shapes" role="group" aria-label="Control shape">
				{(Object.keys(controlShapes) as ControlShape[]).map((shape) => (
					<button
						key={shape}
						type="button"
						className="tb-shape"
						aria-pressed={shape === controls}
						aria-label={controlShapes[shape].label}
						title={controlShapes[shape].label}
						onClick={() => {
							theme$.controls.set(shape);
							announce(`${controlShapes[shape].label} controls`);
						}}
					>
						<span
							className="tb-shape__control"
							style={{ borderRadius: controlCorner[shape] }}
							aria-hidden="true"
						/>
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
