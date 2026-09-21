import { observer } from "@legendapp/state/react";
import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { theme$ } from "../state/theme";

/**
 * The theme's name lives in the header, centred, and is edited in place: a
 * click turns the title into an input, Enter or a blur commits, Escape backs
 * out.
 */
export const ThemeName = observer(function ThemeName() {
	const name = theme$.name.get();
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(name);
	const input = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!editing) return;
		input.current?.focus();
		input.current?.select();
	}, [editing]);

	const commit = () => {
		theme$.name.set(draft.trim() || "Untitled");
		setEditing(false);
	};

	const start = () => {
		setDraft(theme$.name.peek());
		setEditing(true);
	};

	if (editing)
		return (
			<input
				ref={input}
				className="tb-name__input"
				value={draft}
				spellCheck={false}
				aria-label="Theme name"
				onChange={(event) => setDraft(event.target.value)}
				onBlur={commit}
				onKeyDown={(event) => {
					if (event.key === "Enter") commit();
					if (event.key === "Escape") setEditing(false);
				}}
			/>
		);

	return (
		<button
			type="button"
			className="tb-name"
			onClick={start}
			onDoubleClick={start}
			title="Rename this theme"
		>
			<span className="tb-name__text">{name}</span>
			<Pencil className="tb-name__pencil" size={13} aria-hidden="true" />
		</button>
	);
});
