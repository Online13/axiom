import { observer } from "@legendapp/state/react";
import type { ColorRole, ColorScheme } from "@docs/lib/tokens";
import { useEffect, useRef } from "react";
import {
	buildScheme,
	primitiveLabel,
	type Swatch,
} from "../../lib/theme";
import { theme$ } from "../../state/theme";
import { navigate, ui$ } from "../../state/ui";

// Same groups, same order as theme/colors.ts.
export const groupLabels: Record<ColorRole, string> = {
	background: "Background",
	content: "Content",
	border: "Border",
	primary: "Primary",
	highlight: "Highlight",
	feedback: "Feedback",
};

const schemes: ColorScheme[] = ["light", "dark"];

const pathOf = (swatch: Swatch) => `${swatch.role}.${swatch.key}`;

/**
 * The semantic colors of the theme, laid out like theme/colors.ts: every role
 * with its light and its dark value. A value opens its own page to be changed.
 */
export const ColorRoles = observer(function ColorRoles() {
	const theme = theme$.get();
	const focused = ui$.focusedRoles.get();
	const list = useRef<HTMLDivElement>(null);

	const byScheme = {
		light: buildScheme("light", theme.overrides),
		dark: buildScheme("dark", theme.overrides),
	};
	const groups = [...new Set(byScheme.light.map((swatch) => swatch.role))];

	// A part picked on a phone flashes every role it is drawn with.
	useEffect(() => {
		if (!focused) return;
		const rows = focused.paths
			.map((path) => list.current?.querySelector(`[data-path="${path}"]`))
			.filter((row): row is HTMLElement => row instanceof HTMLElement);
		rows[0]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
		for (const row of rows) {
			row.removeAttribute("data-flash");
			void row.offsetWidth; // restarts the animation on a repeat pick
			row.setAttribute("data-flash", "");
		}
	}, [focused]);

	// Opening a value also previews its scheme, so the edit shows on the phones.
	const open = (path: string, scheme: ColorScheme) => {
		ui$.scheme.set(scheme);
		navigate({ kind: "color", path, scheme });
	};

	return (
		<div className="tb-croles" ref={list}>
			<p className="tb-note">
				The roles every component reads. Click a light or dark value to
				change it — or click any part of a phone to find its roles.
			</p>
			{groups.map((role) => (
				<div className="tb-croles__group" key={role}>
					<div className="tb-croles__head">
						<h3 className="tb-croles__title">{groupLabels[role]}</h3>
						<span className="tb-croles__scheme">Light</span>
						<span className="tb-croles__scheme">Dark</span>
					</div>
					<ul className="tb-croles__list">
						{byScheme.light
							.filter((swatch) => swatch.role === role)
							.map((swatch) => {
								const path = pathOf(swatch);
								const pair = {
									light: swatch,
									dark: byScheme.dark.find(
										(other) => pathOf(other) === path,
									) as Swatch,
								};
								return (
									<li
										className="tb-crole"
										key={path}
										data-path={path}
										onAnimationEnd={(event) =>
											event.currentTarget.removeAttribute("data-flash")
										}
									>
										<code className="tb-crole__name" title={swatch.usage}>
											{swatch.key}
										</code>
										{schemes.map((scheme) => (
											<button
												key={scheme}
												type="button"
												className="tb-crole__chip"
												style={{ background: pair[scheme].hex }}
												data-custom={pair[scheme].custom ? "" : undefined}
												aria-label={`${path}, ${scheme}: ${primitiveLabel(pair[scheme].value)}`}
												title={`${scheme} · ${primitiveLabel(pair[scheme].value)}`}
												onClick={() => open(path, scheme)}
											/>
										))}
									</li>
								);
							})}
					</ul>
				</div>
			))}
		</div>
	);
});
