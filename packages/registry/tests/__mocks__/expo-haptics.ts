// Every haptic the components play goes through `@/components/core/haptics`, then here.
// A test asserts on these to check which feedback an interaction plays.
export enum ImpactFeedbackStyle {
	Light = "light",
	Medium = "medium",
	Heavy = "heavy",
	Soft = "soft",
	Rigid = "rigid",
}

export enum NotificationFeedbackType {
	Success = "success",
	Warning = "warning",
	Error = "error",
}

export const selectionAsync = jest.fn(() => Promise.resolve());
export const impactAsync = jest.fn((_style?: ImpactFeedbackStyle) =>
	Promise.resolve(),
);
export const notificationAsync = jest.fn(
	(_type?: NotificationFeedbackType) => Promise.resolve(),
);
