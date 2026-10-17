import * as Haptics from "expo-haptics";

import { haptic, type HapticKind } from "@/components/core/haptics";

beforeEach(() => jest.clearAllMocks());

describe("haptic", () => {
	test.each<[HapticKind, jest.Mock, unknown[]]>([
		["selection", Haptics.selectionAsync as jest.Mock, []],
		["light", Haptics.impactAsync as jest.Mock, [Haptics.ImpactFeedbackStyle.Light]],
		["medium", Haptics.impactAsync as jest.Mock, [Haptics.ImpactFeedbackStyle.Medium]],
		["heavy", Haptics.impactAsync as jest.Mock, [Haptics.ImpactFeedbackStyle.Heavy]],
		[
			"success",
			Haptics.notificationAsync as jest.Mock,
			[Haptics.NotificationFeedbackType.Success],
		],
		[
			"warning",
			Haptics.notificationAsync as jest.Mock,
			[Haptics.NotificationFeedbackType.Warning],
		],
		[
			"error",
			Haptics.notificationAsync as jest.Mock,
			[Haptics.NotificationFeedbackType.Error],
		],
	])("%s plays the matching expo-haptics feedback", (kind, fn, args) => {
		haptic(kind);

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(...args);
	});

	test("a failing haptic is swallowed: the interaction goes on", async () => {
		(Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(
			new Error("Haptics unavailable"),
		);
		const unhandled = jest.fn();
		process.on("unhandledRejection", unhandled);

		expect(() => haptic("light")).not.toThrow();
		await new Promise(process.nextTick);

		process.off("unhandledRejection", unhandled);
		expect(unhandled).not.toHaveBeenCalled();
	});
});
