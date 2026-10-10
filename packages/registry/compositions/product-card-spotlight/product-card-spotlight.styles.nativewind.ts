import type { ViewStyle } from "react-native";

export function useProductCardSpotlightStyles() {
	return {
		media: { className: "p-4 pb-0" },
		// A square the product fits in, whatever the size of its file.
		frame: { style: { aspectRatio: 1 } satisfies ViewStyle },
		overlay: { className: "absolute inset-0 items-start p-3" },
	};
}
