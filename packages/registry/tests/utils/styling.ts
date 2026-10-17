// The demo running the tests: "@/" is its src folder, so this is its own axiom.json.
import config from "@/../axiom.json";

/** The styling of the demo running the tests. */
export const styling = config.styling as "stylesheet" | "unistyles" | "nativewind" | "uniwind";

/**
 * For tests on safe-area insets. Unistyles reads them from its own runtime, which its Jest mock
 * fixes at 0 when the styles are created: there, these tests are skipped and checked on a device.
 */
export const testWithInsets = styling === "unistyles" ? test.skip : test;
