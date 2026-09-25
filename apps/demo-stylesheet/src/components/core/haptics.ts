import * as Haptics from "expo-haptics";

export type HapticKind =
	"selection" | "light" | "medium" | "heavy" | "success" | "warning" | "error";

const play: Record<HapticKind, () => Promise<void>> = {
	selection: () => Haptics.selectionAsync(),
	light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
	medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
	heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
	success: () =>
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
	warning: () =>
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
	error: () =>
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

/**
 * Plays a haptic through expo-haptics. Axiom components call this adapter and
 * never depend on the native library directly.
 */
export function haptic(kind: HapticKind): void {
	// Fire and forget: a failed haptic must never break the interaction.
	play[kind]().catch(() => {});
}
