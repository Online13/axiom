export type HapticKind =
	| "selection"
	| "light"
	| "medium"
	| "heavy"
	| "success"
	| "warning"
	| "error";

/**
 * Plays a haptic. Axiom components call it and never import a haptics library.
 * Does nothing until you wire it to the library of your choice: see Integrations › Haptics in the docs.
 *
 * Keep it synchronous and never let it throw: a haptic that fails must not break the interaction.
 */
export function haptic(_kind: HapticKind): void {}
