import { describe, expect, test } from "bun:test";

import { inlineStyles } from "../src/inline.ts";

const names = {
	stylesModule: "./card.styles",
	componentModule: "./card",
	stylesFile: "card.styles.stylesheet.tsx",
};

const component = `import { View, type ViewProps } from "react-native";

import { CardIcon, useCardStyles } from "./card.styles";

export type CardProps = ViewProps & { tone?: "plain" | "raised" };

export function Card({ tone = "plain", ...props }: CardProps) {
	const styles = useCardStyles(tone);
	return (
		<View {...props} {...styles.root(props)}>
			<CardIcon {...styles.icon} />
		</View>
	);
}

export function CardFooter(props: ViewProps) {
	const styles = useCardStyles();
	return <View {...props} style={[styles.footer, props.style]} />;
}
`;

const styles = `import { StyleSheet, type ViewProps } from "react-native";

import { useTheme } from "@/theme";
import { Icon } from "@/components/ui/icon";

import type { CardProps } from "./card";

export const CardIcon = Icon;

export function useCardStyles(tone?: CardProps["tone"]) {
	const { tokens, colors } = useTheme();
	const raised = tone === "raised";

	return {
		root: ({ style }: Pick<ViewProps, "style">) => ({
			style: [sheet.root, raised && { borderColor: colors.border.default }, style],
		}),
		icon: { name: "star", size: tokens.sizes.icon.sm },
		footer: sheet.footer,
	};
}

const sheet = StyleSheet.create({ root: { borderWidth: 1 }, footer: { flexDirection: "row" } });
`;

describe("inlineStyles", () => {
	const result = inlineStyles(component, styles, names);

	test("writes an entry as the props of its element", () => {
		expect(result).toContain(
			"<View {...props} style={[sheet.root, raised && { borderColor: colors.border.default }, props.style]}>",
		);
		expect(result).toContain(
			'<CardIcon name="star" size={tokens.sizes.icon.sm} />',
		);
		expect(result).toContain("style={[sheet.footer, props.style]}");
	});

	test("puts the statements of the hook where it was called, without the unused ones", () => {
		expect(result).toContain(
			'\tconst { tokens, colors } = useTheme();\n\tconst raised = tone === "raised";\n\treturn (',
		);
		// CardFooter reads nothing of the theme.
		expect(result).toContain(
			"export function CardFooter(props: ViewProps) {\n\treturn <View",
		);
		expect(result).not.toContain("useCardStyles");
	});

	test("merges the imports and moves the rest under the component", () => {
		expect(result).toContain(
			'import { View, type ViewProps, StyleSheet } from "react-native";',
		);
		expect(result).toContain('import { useTheme } from "@/theme";');
		expect(result).not.toContain("./card.styles");
		expect(result).not.toContain('from "./card"');
		expect(result).toContain("\nconst CardIcon = Icon;");
		expect(result.trimEnd().endsWith("});")).toBe(true);
	});

	test("refuses a styles file that breaks the contract", () => {
		const block = styles.replace(
			"footer: sheet.footer,",
			"footer: () => { return sheet.footer; },",
		);
		expect(() => inlineStyles(component, block, names)).toThrow(
			/returns an expression/,
		);

		const taken = component.replace(
			"const styles = useCardStyles(tone);",
			"const raised = 1;\n\tconst styles = useCardStyles(tone);",
		);
		expect(() => inlineStyles(taken, styles, names)).toThrow(
			/"raised" is already a variable/,
		);
	});

	test("leaves behind a type only the entries named", () => {
		const typed = styles
			.replace(
				"export const CardIcon",
				'type Styled = Pick<ViewProps, "style">;\ntype Tone = CardProps["tone"];\n\nexport const CardIcon',
			)
			.replace(
				'({ style }: Pick<ViewProps, "style">)',
				"({ style }: Styled)",
			)
			.replace(
				"const sheet =",
				'const TONES: Tone[] = ["plain", "raised"];\n\nconst sheet =',
			);
		const merged = inlineStyles(component, typed, names);
		expect(merged).not.toContain("Styled");
		expect(merged).toContain('type Tone = CardProps["tone"];');
	});
});
