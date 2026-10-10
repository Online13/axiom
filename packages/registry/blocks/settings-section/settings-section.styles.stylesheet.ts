import { useTheme } from "@/theme";

export function useSettingsSectionStyles() {
	const { tokens } = useTheme();

	return {
		section: { style: { gap: tokens.spacing[2] } },
		// Lined up with the rows of the section.
		text: { style: { paddingHorizontal: tokens.metrics.screenMargin } },
	};
}
