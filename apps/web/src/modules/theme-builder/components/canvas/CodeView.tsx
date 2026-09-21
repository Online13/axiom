import { observer } from "@legendapp/state/react";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import {
	buildExport,
	exportFormats,
	type ExportFormat,
} from "../../lib/export";
import { theme$ } from "../../state/theme";
import { announce, ui$ } from "../../state/ui";

export const CodeView = observer(function CodeView() {
	const options = ui$.exportOptions.get();
	const code = buildExport(theme$.get(), options);
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard?.writeText(code);
		setCopied(true);
		announce("Copied to the clipboard.");
		setTimeout(() => setCopied(false), 1600);
	};

	return (
		<>
			<div className="tb-code__bar">
				<p className="tb-view__intro" style={{ marginBottom: 0 }}>
					The same output Export produces. Change what goes in it from the export
					dialog.
				</p>
				<div className="tb-row">
					<div className="tb-segmented">
						{(Object.keys(exportFormats) as ExportFormat[]).map((format) => (
							<button
								key={format}
								type="button"
								aria-pressed={options.format === format}
								onClick={() => ui$.exportOptions.format.set(format)}
							>
								{exportFormats[format].label}
							</button>
						))}
					</div>
					<button type="button" className="tb-btn tb-btn--ghost" onClick={copy}>
						{copied ? <Check size={15} /> : <Copy size={15} />}
						<span>{copied ? "Copied" : "Copy"}</span>
					</button>
				</div>
			</div>
			<pre className="tb-code">
				<code>{code}</code>
			</pre>
		</>
	);
});
