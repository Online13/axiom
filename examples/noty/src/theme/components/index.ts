import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";

// Component tokens: <component>.<variant>.<state>.<property>.
// Each component brings its own tokens file, copied into this folder as `<component>.ts`;
// `axiom add` registers it below. Customize a component in its tokens file, not here.

// axiom:imports:start
import { appBarTokens } from './app-bar';
import { badgeTokens } from './badge';
import { cardTokens } from './card';
import { checkboxTokens } from './checkbox';
import { chipTokens } from './chip';
import { emptyTokens } from './empty';
import { iconButtonTokens } from './icon-button';
import { inputTokens } from './input';
import { searchBarTokens } from './search-bar';
// axiom:imports:end

export type { States } from "./states";

// Pure: reads `colors` for color and `tokens` for shape. No raw values and no branching on the scheme.
export const components = (colors: ThemeColors, tokens: Tokens) => ({
	// axiom:components:start
	appBar: appBarTokens(colors, tokens),
	badge: badgeTokens(colors, tokens),
	card: cardTokens(colors, tokens),
	checkbox: checkboxTokens(colors, tokens),
	chip: chipTokens(colors, tokens),
	empty: emptyTokens(colors, tokens),
	iconButton: iconButtonTokens(colors, tokens),
	input: inputTokens(colors, tokens),
	searchBar: searchBarTokens(colors, tokens),
	// axiom:components:end
});

export type Components = ReturnType<typeof components>;
