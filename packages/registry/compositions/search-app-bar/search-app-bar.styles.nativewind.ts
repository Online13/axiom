import type { ViewStyle } from "react-native";

import type { SearchBarVariant } from "@/components/ui/search-bar";

export function useSearchAppBarStyles() {
	return {
		// An animated view takes `style` only.
		cancel: { alignSelf: "stretch", overflow: "hidden" } satisfies ViewStyle,
		cancelInner: {
			className: "absolute bottom-0 start-0 top-0 justify-center px-2",
		},
		// The cancel button takes the color the search bar gives it, from its own tokens.
		cancelLabel: (variant: SearchBarVariant) => ({
			className:
				variant === "outline"
					? "text-search-bar-outline-cancel-focused"
					: "text-search-bar-filled-cancel",
		}),
	};
}
