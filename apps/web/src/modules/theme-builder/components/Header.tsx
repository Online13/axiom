import { observer } from "@legendapp/state/react";
import { Download, FolderOpen, Save } from "lucide-react";
import { saveTheme } from "../state/library";
import { theme$ } from "../state/theme";
import { announce, ui$ } from "../state/ui";
import { ThemeName } from "./ThemeName";

export const Header = observer(function Header() {
	const save = () => {
		const entry = saveTheme(theme$.peek());
		announce(`Saved “${entry.name}” to this browser.`);
	};

	return (
		<header className="tb-header">
			<div className="tb-header__side">
				<a href="/" className="tb-wordmark">
					AXIOM
				</a>
				<span className="tb-header__sep" aria-hidden="true" />
				<span className="tb-header__title">Theme builder</span>
			</div>

			<ThemeName />

			<div className="tb-header__side tb-header__side--end">
				<button type="button" className="tb-btn tb-btn--ghost" onClick={save}>
					<Save size={15} aria-hidden="true" />
					<span>Save</span>
				</button>
				<button
					type="button"
					className="tb-btn tb-btn--ghost"
					onClick={() => ui$.loadOpen.set(true)}
				>
					<FolderOpen size={15} aria-hidden="true" />
					<span>Load</span>
				</button>
				<button
					type="button"
					className="tb-btn"
					onClick={() => ui$.exportOpen.set(true)}
				>
					<Download size={15} aria-hidden="true" />
					<span>Export theme</span>
				</button>
			</div>
		</header>
	);
});
