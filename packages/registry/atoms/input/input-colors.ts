import type { Theme } from "@/theme";

import type { InputVariant } from "./field";
import type { InputState } from "./use-input";
import { stateColors } from "@/theme/components/states";

/** Colors of a text field for a variant and a state. */
export function inputColors(
	components: Theme["components"],
	variant: InputVariant,
	state: InputState,
) {
	return stateColors(components.input[variant], state);
}
