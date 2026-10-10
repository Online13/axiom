import type { TextStyle } from "react-native";

export function useTrackItemStyles() {
	return {
		artwork: { className: "size-[48px] rounded-sm" },
		index: { className: "min-w-[24px] justify-center" },
		// Digits of one width, so a column of times stays aligned.
		digits: { style: { fontVariant: ["tabular-nums"] } satisfies TextStyle },
		row: { className: "flex-row items-center gap-1" },
		grow: { className: "flex-1" },
	};
}
