import { observer, useObserve } from "@legendapp/state/react";
import { useEffect } from "react";
import { loadFont } from "../lib/fonts";
import { hydrateFromUrl, syncUrl, theme$ } from "../state/theme";
import { ui$ } from "../state/ui";
import { Canvas } from "./canvas/Canvas";
import { Header } from "./Header";
import { ExportModal } from "./modals/ExportModal";
import { LoadModal } from "./modals/LoadModal";
import { Sidebar } from "./sidebar/Sidebar";
import { ThemeStyle } from "./ThemeStyle";

export default observer(function ThemeBuilder() {
	// A link carrying a theme wins over the persisted draft.
	useEffect(hydrateFromUrl, []);

	// The address bar always carries the theme on screen, and the picked face is
	// always loaded — including the one that came back from storage or a link.
	useObserve(() => {
		const theme = theme$.get();
		syncUrl(theme);
		loadFont(theme.font);
	});

	return (
		<div className="tb">
			<ThemeStyle />
			<Header />
			<div className="tb-main">
				<Sidebar />
				<Canvas />
			</div>
			{ui$.exportOpen.get() && <ExportModal />}
			{ui$.loadOpen.get() && <LoadModal />}
		</div>
	);
});
