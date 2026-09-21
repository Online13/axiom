import { observer } from "@legendapp/state/react";
import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import {
	buildExport,
	exportFilename,
	exportFormats,
	downloadExport,
	type ExportFormat,
	type ExportOptions,
} from "../../lib/export";
import { theme$ } from "../../state/theme";
import { announce, ui$ } from "../../state/ui";
import { Modal } from "./Modal";

type Toggle = Exclude<keyof ExportOptions, "format">;

const includes: { id: Toggle; label: string; hint: string }[] = [
	{ id: "palette", label: "Palette ramps", hint: "Eleven steps for each of the five seeds" },
	{ id: "light", label: "Light roles", hint: "The semantic roles of the light scheme" },
	{ id: "dark", label: "Dark roles", hint: "The semantic roles of the dark scheme" },
	{ id: "radius", label: "Radius scale", hint: "sm, md, lg, xl and full" },
	{ id: "typography", label: "Typography", hint: "The font family and its stack" },
];

export const ExportModal = observer(function ExportModal() {
	const options = ui$.exportOptions.get();
	const theme = theme$.get();
	const code = buildExport(theme, options);
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard?.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1600);
	};

	const close = () => ui$.exportOpen.set(false);
	const nothingSelected = includes.every(({ id }) => !options[id]);

	return (
		<Modal
			title={`Export “${theme.name}”`}
			description="Pick a format and what goes into it. The preview below is exactly what you get."
			size="lg"
			onClose={close}
			footer={
				<>
					<span className="tb-modal__file">{exportFilename(theme, options)}</span>
					<div className="tb-row">
						<button type="button" className="tb-btn tb-btn--ghost" onClick={copy}>
							{copied ? <Check size={15} /> : <Copy size={15} />}
							<span>{copied ? "Copied" : "Copy"}</span>
						</button>
						<button
							type="button"
							className="tb-btn"
							disabled={nothingSelected}
							onClick={() => {
								downloadExport(theme, options);
								announce(`Downloaded ${exportFilename(theme, options)}`);
								close();
							}}
						>
							<Download size={15} />
							<span>Download</span>
						</button>
					</div>
				</>
			}
		>
			<div className="tb-export">
				<div className="tb-export__controls">
					<section className="tb-group">
						<h3 className="tb-eyebrow">Format</h3>
						<ul className="tb-choices">
							{(Object.keys(exportFormats) as ExportFormat[]).map((format) => (
								<li key={format}>
									<label className="tb-choice">
										<input
											type="radio"
											name="export-format"
											checked={options.format === format}
											onChange={() => ui$.exportOptions.format.set(format)}
										/>
										<span className="tb-choice__text">
											<span className="tb-choice__label">
												{exportFormats[format].label}
											</span>
											<span className="tb-choice__hint">
												.{exportFormats[format].extension}
											</span>
										</span>
									</label>
								</li>
							))}
						</ul>
					</section>

					<section className="tb-group">
						<h3 className="tb-eyebrow">Include</h3>
						<ul className="tb-choices">
							{includes.map(({ id, label, hint }) => (
								<li key={id}>
									<label className="tb-choice">
										<input
											type="checkbox"
											checked={options[id]}
											onChange={(event) =>
												ui$.exportOptions[id].set(event.target.checked)
											}
										/>
										<span className="tb-choice__text">
											<span className="tb-choice__label">{label}</span>
											<span className="tb-choice__hint">{hint}</span>
										</span>
									</label>
								</li>
							))}
						</ul>
						{nothingSelected && (
							<p className="tb-note tb-note--warn">
								Nothing is selected — pick at least one section.
							</p>
						)}
					</section>
				</div>

				<pre className="tb-code tb-code--modal">
					<code>{code}</code>
				</pre>
			</div>
		</Modal>
	);
});
