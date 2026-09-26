import { useEffect, useState, type CSSProperties } from "react";
import { createHighlighterCore, type ThemedToken } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const languages = {
	ts: "typescript",
	json: "json",
	css: "css",
	md: "markdown",
} as const;

// Loaded once, on first use: only the grammars the export produces and the two
// VS Code themes. Tokens carry both palettes; the stylesheet picks one.
let highlighter: ReturnType<typeof createHighlighterCore> | undefined;
const getHighlighter = () =>
	(highlighter ??= createHighlighterCore({
		themes: [
			import("shiki/themes/dark-plus.mjs"),
			import("shiki/themes/light-plus.mjs"),
		],
		langs: [
			import("shiki/langs/typescript.mjs"),
			import("shiki/langs/json.mjs"),
			import("shiki/langs/css.mjs"),
			import("shiki/langs/markdown.mjs"),
		],
		engine: createJavaScriptRegexEngine(),
	}));

/** A file's code, highlighted like VS Code once the highlighter has loaded. */
export function CodeBlock({ path, code }: { path: string; code: string }) {
	const [highlighted, setHighlighted] = useState<{
		code: string;
		lines: ThemedToken[][];
	}>();
	const lang = languages[path.split(".").pop() as keyof typeof languages];

	useEffect(() => {
		if (!lang) return;
		let current = true;
		getHighlighter().then((shiki) => {
			if (!current) return;
			const { tokens } = shiki.codeToTokens(code, {
				lang,
				themes: { dark: "dark-plus", light: "light-plus" },
				defaultColor: false,
			});
			setHighlighted({ code, lines: tokens });
		});
		return () => {
			current = false;
		};
	}, [code, lang]);

	return (
		<pre className="tb-code tb-code--modal">
			<code>
				{highlighted?.code === code
					? highlighted.lines.map((line, n) => (
							<span key={n} className="tb-code__line">
								{line.map((token, i) => (
									<span
										key={i}
										style={token.htmlStyle as CSSProperties}
									>
										{token.content}
									</span>
								))}
							</span>
						))
					: code}
			</code>
		</pre>
	);
}
