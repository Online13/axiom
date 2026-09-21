import { observer } from "@legendapp/state/react";
import { themeCss } from "../lib/theme";
import { theme$ } from "../state/theme";

/**
 * The generated theme, as a real stylesheet. The phones read these `--ax-*`
 * variables, so this one element is the whole bridge between the controls and
 * the previews.
 */
export const ThemeStyle = observer(function ThemeStyle() {
	return (
		<style
			// biome-ignore lint/security/noDangerouslySetInnerHtml: generated CSS, not user HTML.
			dangerouslySetInnerHTML={{ __html: themeCss(theme$.get()) }}
		/>
	);
});
