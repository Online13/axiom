import { observer } from "@legendapp/state/react";
import type { ColorScheme } from "@docs/lib/tokens";
import { RotateCcw } from "lucide-react";
import {
	BLACK,
	WHITE,
	buildScheme,
	primitiveLabel,
	primitiveSteps,
	primitives,
	resolve,
} from "../../lib/theme";
import { setRole, theme$ } from "../../state/theme";
import { announce, back, navigate, ui$ } from "../../state/ui";
import { HexField } from "./HexField";
import { PageHeader } from "./PageHeader";

const schemes: ColorScheme[] = ["light", "dark"];

/**
 * One role in one scheme: any color, or a step of the palette. Picking a step
 * or typing a hex is a choice made, so the page closes on it; dragging the
 * color picker is not, so it stays open.
 */
export const ColorPage = observer(function ColorPage({
	path,
	scheme,
}: {
	path: string;
	scheme: ColorScheme;
}) {
	const theme = theme$.get();
	const swatch = buildScheme(scheme, theme.overrides).find(
		(entry) => `${entry.role}.${entry.key}` === path,
	);
	if (!swatch) return null;

	// Picking the shipped value hands the role back to Axiom.
	const set = (value: string) => {
		setRole(path, scheme, value === swatch.auto ? null : value);
		announce(`${path} → ${primitiveLabel(value)} (${scheme})`);
	};
	const choose = (value: string) => {
		set(value);
		back();
	};

	return (
		<>
			<PageHeader title={path} detail={swatch.usage} />

			<div className="tb-segmented" role="group" aria-label="Scheme">
				{schemes.map((option) => (
					<button
						key={option}
						type="button"
						aria-pressed={option === scheme}
						onClick={() => {
							ui$.scheme.set(option);
							navigate({ kind: "color", path, scheme: option });
						}}
					>
						{option === "light" ? "Light" : "Dark"}
					</button>
				))}
			</div>

			<div className="tb-crole__value">
				<span className="tb-seed__swatch">
					<input
						type="color"
						value={swatch.hex}
						aria-label={`${path} in ${scheme}`}
						onChange={(event) => set(event.target.value.toLowerCase())}
					/>
				</span>
				<HexField
					value={swatch.hex}
					label={`${path} in ${scheme}, hex value`}
					onCommit={choose}
				/>
				<span className="tb-crole__source">
					{swatch.custom && <span className="tb-custom">Custom</span>}
					{primitiveLabel(swatch.value)}
				</span>
				{swatch.custom && (
					<button
						type="button"
						className="tb-crole__reset"
						aria-label={`Back to the shipped ${primitiveLabel(swatch.auto)}`}
						title={`Back to ${primitiveLabel(swatch.auto)}`}
						onClick={() => set(swatch.auto)}
					>
						<RotateCcw size={13} aria-hidden="true" />
					</button>
				)}
			</div>

			<PrimitiveList
				label={`Palette steps for ${path} in ${scheme}`}
				value={swatch.value}
				auto={swatch.auto}
				onPick={choose}
			/>
		</>
	);
});

/**
 * Every step of every ramp, then raw white and black, labelled by token name
 * (`gray` row, `500` column → `gray.500`).
 */
function PrimitiveList({
	label,
	value,
	auto,
	onPick,
}: {
	label: string;
	value: string;
	auto: string;
	onPick: (value: string) => void;
}) {
	const swatch = (primitive: string, name: string) => (
		<button
			key={primitive}
			type="button"
			className="tb-primitive"
			style={{ background: resolve(primitive) }}
			aria-label={name}
			title={primitive === auto ? `${name} · Axiom default` : name}
			aria-pressed={primitive === value}
			data-auto={primitive === auto ? "" : undefined}
			onClick={() => onPick(primitive)}
		/>
	);

	return (
		<div className="tb-primitives" role="group" aria-label={label}>
			<div className="tb-primitives__row" aria-hidden="true">
				<span className="tb-primitives__label" />
				<span className="tb-primitives__steps">
					{primitiveSteps.map((step) => (
						<span className="tb-primitives__step" key={step}>
							{step}
						</span>
					))}
				</span>
			</div>
			{primitives.map((row) => (
				<div className="tb-primitives__row" key={row.hue}>
					<span className="tb-primitives__label">{row.hue}</span>
					<span className="tb-primitives__steps">
						{row.values.map((primitive) => swatch(primitive, primitive))}
					</span>
				</div>
			))}
			<div className="tb-primitives__row">
				<span className="tb-primitives__label">base</span>
				<span className="tb-primitives__steps">
					{swatch(WHITE, "white")}
					{swatch(BLACK, "black")}
				</span>
			</div>
		</div>
	);
}
