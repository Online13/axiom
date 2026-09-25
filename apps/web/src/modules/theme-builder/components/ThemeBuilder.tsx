import { observer, useObserve } from "@legendapp/state/react";
import { loadThemeFonts, syncUrl, theme$ } from "../state/theme";
import { ui$ } from "../state/ui";
import { Canvas } from "./canvas/Canvas";
import { Header } from "./Header";
import { ExportModal } from "./modals/ExportModal";
import { LoadModal } from "./modals/LoadModal";
import { Sidebar } from "./sidebar/Sidebar";
import { ThemeStyle } from "./ThemeStyle";

export default observer(function ThemeBuilder() {
	// The address bar always carries the theme on screen, and the picked face is
	// always loaded — including the one that came back from storage or a link.
	useObserve(() => {
		const theme = theme$.get();
		syncUrl(theme);
		loadThemeFonts(theme);
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
