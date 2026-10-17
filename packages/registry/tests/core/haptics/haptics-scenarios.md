# Haptics

The adapter every component calls instead of `expo-haptics`. The project owns this file.

## Covered by `haptics.test.ts`

- Each `HapticKind` plays the matching `expo-haptics` call: `selection`, the three impacts, the three notifications.
- A haptic that fails (no engine, simulator) is swallowed: no throw, no unhandled rejection.

## Checked on a device

- Each kind is felt, and distinct, on iOS and Android.
