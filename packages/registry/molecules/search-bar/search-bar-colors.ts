import type { Theme } from "@/theme";

import type { SearchBarVariant } from "./search-bar";
import type { SearchBarState } from "./use-search-bar";
import { stateColors } from "@/theme/components/states";

/** Colors of the bar for a variant and a state; missing properties fall back to `default`. */
export function searchBarColors(
	components: Theme["components"],
	variant: SearchBarVariant,
	state: SearchBarState,
) {
	const states = components.searchBar[variant];
	return stateColors(states, state);
}
