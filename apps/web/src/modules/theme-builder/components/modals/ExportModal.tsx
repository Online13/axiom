import { observer } from "@legendapp/state/react";
import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import {
	buildExportFiles,
	downloadFile,
	exportFormats,
	usesIncludes,
	type ExportFormat,
	type ExportOptions,
} from "../../lib/export";
import { FileTabs } from "./FileTabs";
import { theme$ } from "../../state/theme";
import { announce, ui$ } from "../../state/ui";
import { Modal } from "./Modal";

type Toggle = Exclude<keyof ExportOptions, "format">;

const includes: { id: Toggle; label: string; hint: string }[] = [
	{
		id: "palette",
		label: "Palette ramps",
		hint: "Eleven steps for each seed",
	},
	{
		id: "light",
		label: "Light roles",
		hint: "The semantic roles of the light scheme",
	},
	{
		id: "dark",
		label: "Dark roles",
		hint: "The semantic roles of the dark scheme",
	},
	{ id: "radius", label: "Radius scale", hint: "sm, md, lg, xl and full" },
	{
		id: "typography",
		label: "Typography",
		hint: "The heading and body fonts",
	},
];

export const ExportModal = observer(function ExportModal() {
	const options = ui$.exportOptions.get();
	const theme = theme$.get();
	const files = buildExportFiles(theme, options);
	const [selected, setSelected] = useState(0);
	const file = files[Math.min(selected, files.length - 1)];
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard?.writeText(file.code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1600);
	};

	const close = () => ui$.exportOpen.set(false);
	const withIncludes = usesIncludes(options.format);
	const nothingSelected =
		withIncludes && includes.every(({ id }) => !options[id]);

	return (
		<Modal
			title={`Export “${theme.name}”`}
			description="Pick a format and what goes into it. The preview below is exactly what you get."
			size="lg"
			onClose={close}
			footer={
				<>
					<span className="tb-modal__file">{file.path}</span>
					<div className="tb-row">
						<button
							type="button"
							className="tb-btn tb-btn--ghost"
							onClick={copy}
						>
							{copied ? <Check size={15} /> : <Copy size={15} />}
							<span>{copied ? "Copied" : "Copy"}</span>
						</button>
						<button
							type="button"
							className="tb-btn"
							disabled={nothingSelected}
							onClick={() => {
								downloadFile(file);
								announce(`Downloaded ${file.path}`);
								if (files.length === 1) close();
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
							{(Object.keys(exportFormats) as ExportFormat[]).map(
								(format) => (
									<li key={format}>
										<label className="tb-choice">
											<input
												type="radio"
												name="export-format"
												checked={options.format === format}
												onChange={() =>
													ui$.exportOptions.format.set(format)
												}
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
								),
							)}
						</ul>
					</section>

					{withIncludes ? (
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
													ui$.exportOptions[id].set(
														event.target.checked,
													)
												}
											/>
											<span className="tb-choice__text">
												<span className="tb-choice__label">
													{label}
												</span>
												<span className="tb-choice__hint">
													{hint}
												</span>
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
					) : (
						<section className="tb-group">
							<h3 className="tb-eyebrow">Files</h3>
							<p className="tb-note">
								Drop-in replacements for your project's theme folder:
								the shipped files with your values in them. A component
								file only appears when its shape differs from Axiom's.
								To go further, edit those component files by hand —
								every variant and state is there.
							</p>
						</section>
					)}
				</div>

				<div className="tb-export__preview">
					<FileTabs files={files} selected={file} onSelect={setSelected} />
					<pre className="tb-code tb-code--modal">
						<code>{file.code}</code>
					</pre>
				</div>
			</div>
		</Modal>
	);
});
