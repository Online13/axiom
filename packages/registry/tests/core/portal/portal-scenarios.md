# Portal

A thin wrapper around `react-native-teleport`. The tests run with the library's Jest mock, which renders the content in place: they check what the wrapper hands the library.

## Covered by `portal.test.tsx`

- `Portal` targets the `root` host by default, or the `hostName` given, and keeps its `name`.
- `Portal` and `PortalHost` let touches through where they have no content (`pointerEvents: "box-none"`).
- `PortalHost` is named `root` by default, fills the screen, and merges the caller's style.

## Checked on a device

- Content teleported to the root host draws above the screen and the navigation bars.
