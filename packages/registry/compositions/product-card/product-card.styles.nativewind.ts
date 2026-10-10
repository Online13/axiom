import type { StyleProp, ViewStyle } from "react-native";

export function useProductCardStyles() {
	return {
		// Width:height, with media. The width comes from the caller.
		card: (withMedia: boolean, style: StyleProp<ViewStyle>) => ({
			style: [withMedia ? { aspectRatio: 3 / 4 } : undefined, style],
		}),
		// Takes the height the text leaves.
		media: { className: "grow" },
		overlay: { className: "absolute inset-0 items-start p-3" },
		inline: { className: "items-start" },
		price: { className: "mt-1" },
	};
}
