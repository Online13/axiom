import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Insets = { top: number; bottom: number; left: number; right: number };

/** A `wrapper` for `render` that gives the screen these safe-area insets, like a phone with a notch. */
export function withInsets(insets: Partial<Insets>) {
	const metrics = {
		insets: { top: 0, bottom: 0, left: 0, right: 0, ...insets },
		frame: { x: 0, y: 0, width: 390, height: 844 },
	};
	return function SafeArea({ children }: { children: ReactNode }) {
		return <SafeAreaProvider initialMetrics={metrics}>{children}</SafeAreaProvider>;
	};
}
