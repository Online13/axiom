import { observer } from "@legendapp/state/react";
import { Trash2 } from "lucide-react";
import { buildScheme, normalizeTheme } from "../../lib/theme";
import { deleteTheme, library$ } from "../../state/library";
import { loadThemeFonts, theme$ } from "../../state/theme";
import { announce, ui$ } from "../../state/ui";
import { Modal } from "./Modal";

// The roles that tell two saved themes apart at a glance.
const chipRoles = [
	"background.default",
	"content.default",
	"primary.default",
	"highlight.default",
	"content.link",
];

const when = (timestamp: number) =>
	new Date(timestamp).toLocaleString(undefined, {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});

export const LoadModal = observer(function LoadModal() {
	const saved = library$.themes.get();
	const close = () => ui$.loadOpen.set(false);

	return (
		<Modal
			title="Saved themes"
			description="Themes you saved in this browser. Loading one replaces what is on screen."
			onClose={close}
		>
			{saved.length === 0 ? (
				<p className="tb-note">
					Nothing saved yet. Hit <strong>Save</strong> in the header and
					the theme lands here under its name.
				</p>
			) : (
				<ul className="tb-library">
					{[...saved]
						.sort((a, b) => b.savedAt - a.savedAt)
						.map((entry) => (
							<li className="tb-library__row" key={entry.id}>
								<button
									type="button"
									className="tb-library__load"
									onClick={() => {
										const theme = normalizeTheme(entry.theme);
										loadThemeFonts(theme);
										theme$.set(theme);
										announce(`Loaded “${entry.name}”`);
										close();
									}}
								>
									<span
										className="tb-library__chips"
										aria-hidden="true"
									>
										{buildScheme(
											"light",
											normalizeTheme(entry.theme).overrides,
										)
											.filter(({ role, key }) =>
												chipRoles.includes(`${role}.${key}`),
											)
											.map((swatch) => (
												<span
													key={swatch.variable}
													style={{ background: swatch.hex }}
												/>
											))}
									</span>
									<span className="tb-library__text">
										<span className="tb-library__name">
											{entry.name}
										</span>
										<span className="tb-library__meta">
											{normalizeTheme(entry.theme).fonts.heading} ·{" "}
											{entry.theme.radius} corners ·{" "}
											{when(entry.savedAt)}
										</span>
									</span>
								</button>
								<button
									type="button"
									className="tb-iconbtn"
									aria-label={`Delete ${entry.name}`}
									onClick={() => {
										deleteTheme(entry.id);
										announce(`Deleted “${entry.name}”`);
									}}
								>
									<Trash2 size={15} aria-hidden="true" />
								</button>
							</li>
						))}
				</ul>
			)}
		</Modal>
	);
});
