# useOverlayBackHandler

Closes an open sheet, dialog or menu on a back action instead of leaving the screen.

## Covered by `use-overlay-back-handler.test.tsx`

### Android back button

- While open: back calls `onClose` and is consumed.
- While closed: back is left to the screen.
- The listener goes away when the overlay closes or unmounts.
- A new `onClose` is used without subscribing again.
- An overlay that can't be dismissed (`onClose` undefined) still consumes back.

### Inside a screen (back gesture, header back button)

- The native dismissal (iOS swipe back) is blocked only while the overlay is open, and released on close and unmount.
- A back gesture closes the overlay and keeps the screen.
- A press that closes the overlay and calls `router.back()` still leaves: the navigation is replayed on the next frame.
- While closed, the screen is not held.

### Outside a screen

- Only the back button is handled, and nothing throws.

## Checked on a device

- iOS swipe back over an open sheet closes the sheet, not the screen.
- Android predictive back.
