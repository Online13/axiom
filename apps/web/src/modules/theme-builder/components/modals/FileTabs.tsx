import type { ExportFile } from "../../lib/export";

/** Switches between the files of a multi-file export. Renders nothing for a single file. */
export function FileTabs({
	files,
	selected,
	onSelect,
}: {
	files: ExportFile[];
	selected: ExportFile;
	onSelect: (index: number) => void;
}) {
	if (files.length < 2) return null;
	return (
		<div className="tb-filetabs" role="tablist" aria-label="Exported files">
			{files.map((file, index) => (
				<button
					key={file.path}
					type="button"
					role="tab"
					aria-selected={file.path === selected.path}
					onClick={() => onSelect(index)}
				>
					{file.path}
				</button>
			))}
		</div>
	);
}
