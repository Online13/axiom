import { observer } from "@legendapp/state/react";
import { contrastRatio } from "../../lib/color";
import {
	buildPalette,
	buildScheme,
	contrastGrade,
	contrastPairs,
} from "../../lib/theme";
import { theme$ } from "../../state/theme";
import { ui$ } from "../../state/ui";

const groupLabel: Record<string, string> = {
	background: "Background",
	content: "Content",
	border: "Border",
	feedback: "Feedback",
};

export const RolesView = observer(function RolesView() {
	const generated = buildPalette(theme$.get());
	const light = buildScheme(generated, "light");
	const dark = buildScheme(generated, "dark");
	const active = ui$.scheme.get() === "dark" ? dark : light;
	const groups = [...new Set(light.map((swatch) => swatch.role))];

	const find = (list: typeof light, ref: string) =>
		list.find((swatch) => `${swatch.role}.${swatch.key}` === ref);

	return (
		<>
			<p className="tb-view__intro">
				Every component reads these roles, never a raw palette step. The two
				chips are the light and dark value of the same role.
			</p>

			{groups.map((role) => (
				<section className="tb-roles" key={role}>
					<h3 className="tb-eyebrow">{groupLabel[role] ?? role}</h3>
					<ul className="tb-roles__list">
						{light
							.filter((swatch) => swatch.role === role)
							.map((swatch) => {
								const other = find(dark, `${swatch.role}.${swatch.key}`);
								return (
									<li className="tb-role" key={swatch.variable}>
										<span className="tb-role__chips">
											<span
												className="tb-role__chip"
												style={{ background: swatch.hex }}
											/>
											<span
												className="tb-role__chip"
												style={{ background: other?.hex }}
											/>
										</span>
										<span className="tb-role__text">
											<code className="tb-role__var">{swatch.variable}</code>
											<span className="tb-role__usage">{swatch.usage}</span>
										</span>
										<span className="tb-role__values">
											<span>{swatch.hex.toUpperCase()}</span>
											<span>{other?.hex.toUpperCase()}</span>
										</span>
									</li>
								);
							})}
					</ul>
				</section>
			))}

			<section className="tb-roles">
				<h3 className="tb-eyebrow">
					Contrast · {ui$.scheme.get() === "dark" ? "dark" : "light"}
				</h3>
				<ul className="tb-contrast">
					{contrastPairs.map((pair) => {
						const on = find(active, pair.on);
						const over = find(active, pair.over);
						if (!on || !over) return null;
						const ratio = contrastRatio(on.hex, over.hex);
						const grade = contrastGrade(ratio);
						return (
							<li className="tb-contrast__row" key={pair.label}>
								<span className="tb-contrast__label">{pair.label}</span>
								<span className="tb-contrast__ratio">{ratio.toFixed(2)}</span>
								<span className="tb-contrast__grade" data-tone={grade.tone}>
									{grade.label}
								</span>
							</li>
						);
					})}
				</ul>
			</section>
		</>
	);
});
