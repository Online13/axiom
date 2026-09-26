import { observer } from "@legendapp/state/react";
import { Check, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { loadFont, SYSTEM_FONT } from "../../lib/fonts";
import { type Preset, presets } from "../../lib/presets";
import { buildScheme, defaultTheme, type Theme } from "../../lib/theme";
import { applyPreset, theme$ } from "../../state/theme";
import { announce, back, navigate, ui$ } from "../../state/ui";
import { PageHeader } from "./PageHeader";

const choices: Preset[] = [
	{
		id: "axiom",
		description:
			"Axiom's own defaults: system typography, balanced radius and spacing.",
		theme: defaultTheme,
	},
	...presets,
];

/** The theme without its name, keys sorted, so equal themes read the same. */
const signature = ({ name: _, ...theme }: Theme) =>
	JSON.stringify(theme, (_key, value) =>
		value && typeof value === "object" && !Array.isArray(value)
			? Object.fromEntries(
					Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1)),
				)
			: value,
	);

const signatures = new Map(
	choices.map((choice) => [signature(choice.theme), choice]),
);

/** The preset the theme still matches; any edit afterwards makes it custom. */
const useCurrent = () => signatures.get(signature(theme$.get()));

const face = (family: string) =>
	family === SYSTEM_FONT ? undefined : `'${family}', system-ui`;

/** The preset the theme starts from. Opens the preset list. */
export const PresetField = observer(function PresetField() {
	const current = useCurrent();
	const label = current?.theme.name ?? "Custom";
	return (
		<div className="tb-field tb-preset">
			<span className="tb-field__label">Preset</span>
			<button
				type="button"
				className="tb-fontpicker__trigger"
				aria-label={`Preset: ${label}`}
				onClick={() => navigate({ kind: "preset" })}
			>
				<span className="tb-truncate">{label}</span>
				<ChevronRight size={14} aria-hidden="true" />
			</button>
			<p className="tb-note">
				{current?.description ??
					"Edited since the last preset. Picking one replaces the colors, fonts, shape and spacing."}
			</p>
		</div>
	);
});

/**
 * Every ready-made theme, each drawn with its own surface, accents and heading
 * face in the scheme on screen. Picking one replaces the whole theme.
 */
export const PresetPage = observer(function PresetPage() {
	const current = useCurrent();
	const scheme = ui$.scheme.get();

	useEffect(() => {
		for (const choice of choices) loadFont(choice.theme.fonts.heading);
	}, []);

	return (
		<>
			<PageHeader
				title="Presets"
				detail="Replaces the colors, fonts, shape and spacing. Every role stays editable."
			/>
			<ul className="tb-presets" aria-label="Presets">
				{choices.map((choice) => {
					const { theme } = choice;
					const hex = Object.fromEntries(
						buildScheme(scheme, theme.overrides).map((swatch) => [
							`${swatch.role}.${swatch.key}`,
							swatch.hex,
						]),
					);
					const selected = choice === current;
					const fonts =
						theme.fonts.heading === theme.fonts.body
							? theme.fonts.heading
							: `${theme.fonts.heading} + ${theme.fonts.body}`;
					return (
						<li key={choice.id}>
							<button
								type="button"
								className="tb-presets__card"
								aria-pressed={selected}
								data-autofocus={selected ? "" : undefined}
								onClick={() => {
									applyPreset(theme);
									announce(`${theme.name} preset applied`);
									back();
								}}
							>
								<span
									className="tb-presets__swatch"
									aria-hidden="true"
									style={{
										background: hex["background.default"],
										borderColor: hex["border.default"],
										color: hex["content.default"],
										fontFamily: face(theme.fonts.heading),
									}}
								>
									Aa
									<span className="tb-presets__dots">
										<i style={{ background: hex["primary.default"] }} />
										<i style={{ background: hex["highlight.default"] }} />
									</span>
								</span>
								<span className="tb-presets__text">
									<span className="tb-presets__name">
										{theme.name}
										{selected && <Check size={14} aria-hidden="true" />}
									</span>
									<span className="tb-presets__description">
										{choice.description}
									</span>
									<span className="tb-presets__meta">
										{fonts} · {theme.controls} · {theme.spacing}
									</span>
								</span>
							</button>
						</li>
					);
				})}
			</ul>
		</>
	);
});
