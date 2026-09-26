import { type Ref, useState } from "react";
import { announce } from "../../state/ui";

const VALID_HEX = /^#?[0-9a-f]{6}$/i;

/**
 * A six-digit hex field over a color that can also move elsewhere — a picker,
 * a reset, a loaded theme. It keeps whatever is being typed, re-syncs only when
 * the value changes from outside, and commits on blur or Enter.
 */
export function HexField({
	value,
	label,
	onCommit,
	inputRef,
}: {
	value: string;
	label: string;
	/** Called with a lowercase `#rrggbb` that differs from `value`. */
	onCommit: (hex: string) => void;
	inputRef?: Ref<HTMLInputElement>;
}) {
	const [draft, setDraft] = useState(value.toUpperCase());
	const [invalid, setInvalid] = useState(false);
	const [known, setKnown] = useState(value);

	if (known !== value) {
		setKnown(value);
		setDraft(value.toUpperCase());
		setInvalid(false);
	}

	const commit = () => {
		if (!VALID_HEX.test(draft)) {
			setInvalid(true);
			setDraft(value.toUpperCase());
			announce("Enter a six-digit hex color.");
			return;
		}
		setInvalid(false);
		const hex = `#${draft.replace("#", "")}`.toLowerCase();
		// Leaving an untouched field is not an edit.
		if (hex !== value.toLowerCase()) onCommit(hex);
	};

	return (
		<input
			ref={inputRef}
			className="tb-input tb-input--hex"
			type="text"
			maxLength={7}
			spellCheck={false}
			value={draft}
			aria-invalid={invalid}
			aria-label={label}
			onChange={(event) => {
				setInvalid(false);
				setDraft(event.target.value);
			}}
			onBlur={commit}
			onKeyDown={(event) => event.key === "Enter" && commit()}
		/>
	);
}
