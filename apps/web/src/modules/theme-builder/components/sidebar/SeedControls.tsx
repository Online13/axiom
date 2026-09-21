import { observer } from "@legendapp/state/react";
import { useState } from "react";
import { seedNames, seeds } from "../../lib/theme";
import { setSeed, theme$ } from "../../state/theme";
import { announce } from "../../state/ui";

const VALID_HEX = /^#?[0-9a-f]{6}$/i;

const SeedRow = observer(function SeedRow({
	name,
}: {
	name: (typeof seedNames)[number];
}) {
	const value = theme$.seeds[name].get();
	const [draft, setDraft] = useState(value.toUpperCase());
	const [invalid, setInvalid] = useState(false);
	const [known, setKnown] = useState(value);

	// The picker and the hex field are two views of one value. The field keeps
	// whatever is being typed, and only re-syncs when the seed moves elsewhere
	// — the picker, a reset, a loaded theme.
	if (known !== value) {
		setKnown(value);
		setDraft(value.toUpperCase());
		setInvalid(false);
	}

	const commit = () => {
		if (!VALID_HEX.test(draft)) {
			setInvalid(true);
			setDraft(theme$.seeds[name].peek().toUpperCase());
			announce("Enter a six-digit hex color.");
			return;
		}
		setInvalid(false);
		setSeed(name, `#${draft.replace("#", "")}`);
		announce(`${seeds[name].label} updated`);
	};

	return (
		<li className="tb-seed">
			<span className="tb-seed__swatch">
				<input
					type="color"
					value={value}
					aria-label={`${seeds[name].label} color`}
					onChange={(event) => setSeed(name, event.target.value)}
				/>
			</span>
			<span className="tb-seed__text">
				<span className="tb-seed__label">{seeds[name].label}</span>
				<span className="tb-seed__usage">{seeds[name].usage}</span>
			</span>
			<input
				className="tb-input tb-input--hex"
				type="text"
				maxLength={7}
				spellCheck={false}
				value={draft}
				aria-invalid={invalid}
				aria-label={`${seeds[name].label} hex value`}
				onChange={(event) => {
					setInvalid(false);
					setDraft(event.target.value);
				}}
				onBlur={commit}
				onKeyDown={(event) => event.key === "Enter" && commit()}
			/>
		</li>
	);
});

export function SeedControls() {
	return (
		<section className="tb-group">
			<h2 className="tb-eyebrow">Core colors</h2>
			<p className="tb-note">
				Each seed becomes an eleven-step ramp. The semantic roles of both
				schemes are read off those ramps, exactly like the shipped tokens.
			</p>
			<ul className="tb-seeds">
				{seedNames.map((name) => (
					<SeedRow key={name} name={name} />
				))}
			</ul>
		</section>
	);
}
