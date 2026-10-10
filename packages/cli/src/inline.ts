import ts from "typescript";

// A component of the registry reads what differs between variants from a styles file, through one
// hook: `const styles = useButtonStyles(variant, size, fullWidth)`. In a project there is one
// variant, so the two files are written as one, the way the component would be written by hand:
//
//   - the statements of the hook replace its call, without the ones the component doesn't reach;
//   - `styles.label(hidden)` becomes the expression the entry returns, with its arguments in place,
//     and `{...styles.label(hidden)}` on an element becomes the props themselves;
//   - everything else the styles file declares is moved under the component, and the imports merge.
//
// This only works on a styles file that keeps to the contract: one `use<Item>Styles` hook, whose
// parameters are named like the arguments it is called with, and whose last statement returns an
// object of entries, each one an expression or an arrow function returning one.

export type InlineNames = {
	/** How the component imports the styles file: `./button.styles`. */
	stylesModule: string;
	/** How the styles file imports the component: `./button`. */
	componentModule: string;
	/** The styles file, for error messages. */
	stylesFile: string;
};

type Entry = {
	params?: ts.NodeArray<ts.ParameterDeclaration>;
	body: ts.Expression;
};
type Edit = { start: number; end: number; text: string };

const HOOK = /^use[A-Z]\w*Styles$/;

export function inlineStyles(
	component: string,
	styles: string,
	names: InlineNames,
): string {
	const fail = (message: string): never => {
		throw new Error(`${names.stylesFile}: ${message}`);
	};
	const componentSource = parse("component.tsx", component);
	const stylesSource = parse("styles.tsx", styles);

	// The styles file: its hook, and what the hook returns.
	const hooks = stylesSource.statements.filter(
		(statement): statement is ts.FunctionDeclaration =>
			ts.isFunctionDeclaration(statement) &&
			HOOK.test(statement.name?.text ?? ""),
	);
	if (hooks.length !== 1)
		fail("a styles file declares exactly one `use<Item>Styles` function.");
	const hook = hooks[0];
	const hookName = hook.name!.text;
	const hookParams = hook.parameters.map((parameter) =>
		ts.isIdentifier(parameter.name)
			? parameter.name.text
			: fail(`${hookName} takes plain parameters.`),
	);
	const hookStatements = [...(hook.body?.statements ?? [])];
	const last = hookStatements.pop();
	const returned =
		last && ts.isReturnStatement(last) && last.expression
			? unwrap(last.expression)
			: undefined;
	if (!returned || !ts.isObjectLiteralExpression(returned)) {
		return fail(`${hookName} ends by returning an object of entries.`);
	}

	const entries = new Map<string, Entry>();
	for (const property of returned.properties) {
		if (ts.isShorthandPropertyAssignment(property)) {
			entries.set(property.name.text, { body: property.name });
			continue;
		}
		if (
			!ts.isPropertyAssignment(property) ||
			!ts.isIdentifier(property.name)
		) {
			return fail(`every entry of ${hookName} is written \`name: value\`.`);
		}
		const value = unwrap(property.initializer);
		if (!ts.isArrowFunction(value)) {
			entries.set(property.name.text, { body: value });
		} else if (ts.isBlock(value.body)) {
			fail(
				`the entry "${property.name.text}" returns an expression: move its statements to a function of the file.`,
			);
		} else {
			entries.set(property.name.text, {
				params: value.parameters,
				body: unwrap(value.body),
			});
		}
	}

	const edits: Edit[] = [];

	// Each call of the hook, and every read of what it returned.
	const visit = (node: ts.Node) => {
		const call = hookCall(node, hookName);
		if (call) {
			call.args.forEach((argument, i) => {
				if (!ts.isIdentifier(argument) || argument.text !== hookParams[i]) {
					fail(
						`${hookName} is called with variables named like its parameters (${hookParams.join(", ")}).`,
					);
				}
			});
			const owner =
				enclosingFunction(node) ??
				fail(`${hookName} is called inside a component.`);
			const snippets: string[] = [];

			const read = (inner: ts.Node) => {
				if (
					ts.isIdentifier(inner) &&
					inner.text === call.name &&
					inner !== call.declaration.name &&
					isReference(inner)
				) {
					const access = inner.parent;
					if (
						!ts.isPropertyAccessExpression(access) ||
						access.expression !== inner
					) {
						return fail(
							`\`${call.name}\` is only read one entry at a time: \`${call.name}.label\`.`,
						);
					}
					const entry =
						entries.get(access.name.text) ??
						fail(`${hookName} has no "${access.name.text}" entry.`);
					const invoked =
						ts.isCallExpression(access.parent) &&
						access.parent.expression === access;
					if (Boolean(entry.params) !== invoked) {
						return fail(
							`the entry "${access.name.text}" is ${entry.params ? "a function: call it" : "a value: don't call it"}.`,
						);
					}
					const target: ts.Expression = invoked
						? (access.parent as ts.CallExpression)
						: access;
					const map = entry.params
						? argumentsOf(
								entry.params,
								(access.parent as ts.CallExpression).arguments,
								componentSource,
								fail,
							)
						: new Map<string, string>();

					// On an element, an entry is its props.
					if (
						ts.isJsxSpreadAttribute(target.parent) &&
						isPlainObject(entry.body)
					) {
						const text = entry.body.properties
							.map((property) => attribute(property, map, stylesSource))
							.join(" ");
						snippets.push(text);
						edits.push({
							start: target.parent.getStart(componentSource),
							end: target.parent.end,
							text,
						});
					} else {
						const text = substitute(entry.body, map, stylesSource);
						snippets.push(text);
						edits.push({
							start: target.getStart(componentSource),
							end: target.end,
							text:
								needsParentheses(target.parent, target) &&
								!isAtomic(entry.body)
									? `(${text})`
									: text,
						});
					}
					return;
				}
				ts.forEachChild(inner, read);
			};
			read(owner);

			// The hook's statements take the place of its call, without the ones nothing here reads.
			const kept = reachable(
				hookStatements,
				snippets.join("\n"),
				stylesSource,
			);
			const taken = new Set(declaredIn(owner, call.declaration));
			for (const name of kept.names) {
				if (taken.has(name))
					fail(
						`"${name}" is already a variable where ${hookName} is called. Rename one.`,
					);
			}
			const start = call.statement.getStart(componentSource);
			const indent = lineIndent(component, start);
			edits.push(
				kept.text.length
					? {
							start,
							end: call.statement.end,
							text: kept.text.join(`\n${indent}`),
						}
					: // Nothing kept: the line goes with the call.
						{
							start: start - indent.length,
							end: lineEnd(component, call.statement.end),
							text: "",
						},
			);
			return;
		}
		ts.forEachChild(node, visit);
	};
	visit(componentSource);
	if (!edits.length) fail(`${hookName} isn't called by the component.`);

	// Imports: the component's, with what the styles file adds. Each one is filled in last, once
	// the rest of the file says which names are still read.
	const imports = new Map<string, Import>();
	const slots: { key: string; start: number; end: number }[] = [];
	for (const statement of componentSource.statements) {
		if (!ts.isImportDeclaration(statement)) continue;
		const specifier = (statement.moduleSpecifier as ts.StringLiteral).text;
		// The import of the styles file goes, and a module imported twice keeps its first line.
		const key =
			specifier === names.stylesModule || imports.has(specifier)
				? ""
				: specifier;
		if (specifier !== names.stylesModule)
			mergeImport(imports, statement, fail);
		slots.push({
			key,
			start: statement.getStart(componentSource),
			end: key ? statement.end : lineEnd(component, statement.end),
		});
	}
	const own = new Set(imports.keys());
	const added: string[] = [];
	for (const statement of stylesSource.statements) {
		if (!ts.isImportDeclaration(statement)) continue;
		const specifier = (statement.moduleSpecifier as ts.StringLiteral).text;
		if (specifier === names.componentModule) continue;
		if (!own.has(specifier) && !added.includes(specifier))
			added.push(specifier);
		mergeImport(imports, statement, fail);
	}

	// Everything else the styles file declares goes under the component, no longer exported.
	let moved = stylesSource.statements
		.filter(
			(statement) =>
				!ts.isImportDeclaration(statement) && statement !== hook,
		)
		.map((statement) => ({
			type:
				ts.isTypeAliasDeclaration(statement) ||
				ts.isInterfaceDeclaration(statement)
					? statement.name.text
					: undefined,
			text: withoutExport(statement, stylesSource),
		}));
	const declared = new Set(
		componentSource.statements
			// What the component imports from the styles file is what is being moved.
			.filter(
				(statement) =>
					!ts.isImportDeclaration(statement) ||
					(statement.moduleSpecifier as ts.StringLiteral).text !==
						names.stylesModule,
			)
			.flatMap((statement) => topLevelNames(statement)),
	);
	for (const statement of stylesSource.statements) {
		if (ts.isImportDeclaration(statement) || statement === hook) continue;
		for (const name of topLevelNames(statement)) {
			if (declared.has(name))
				fail(`"${name}" is declared by the component too. Rename one.`);
		}
	}

	const marks = slots;
	const mark = (i: number) => `\u0000${i}\u0000`;
	const inlined = apply(component, [
		...edits,
		...marks.map((slot, i) => ({
			start: slot.start,
			end: slot.end,
			text: mark(i),
		})),
	]).trimEnd();
	// A type only the parameters of the entries named has no reader left: it stays behind.
	for (let count = -1; count !== moved.length;) {
		count = moved.length;
		moved = moved.filter(
			(each) =>
				!each.type ||
				reads(
					[
						inlined,
						...moved
							.filter((other) => other !== each)
							.map((other) => other.text),
					].join("\n"),
					each.type,
				),
		);
	}
	const body =
		inlined +
		(moved.length
			? `\n\n${moved.map((each) => each.text).join("\n\n")}`
			: "") +
		"\n";

	const code = body.replace(/\u0000\d+\u0000/g, "");
	const print = (specifier: string) =>
		printImport(specifier, imports.get(specifier)!, code);
	const lastSlot = marks.length - 1;
	return body
		.replace(/\u0000(\d+)\u0000/g, (_, index: string) => {
			const i = Number(index);
			const lines = [
				marks[i].key ? print(marks[i].key) : "",
				...(i === lastSlot ? added.map(print) : []),
			].filter(Boolean);
			// The line of a removed import went with it; an import nothing reads anymore takes its own.
			if (!marks[i].key) return lines.length ? `${lines.join("\n")}\n` : "";
			return lines.length ? lines.join("\n") : "\u0001";
		})
		.replace(/\u0001\r?\n?/g, "");
}

function parse(fileName: string, text: string) {
	return ts.createSourceFile(
		fileName,
		text,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
}

function unwrap(expression: ts.Expression): ts.Expression {
	return ts.isParenthesizedExpression(expression)
		? unwrap(expression.expression)
		: expression;
}

/** `const styles = useButtonStyles(variant, size)` */
function hookCall(node: ts.Node, hookName: string) {
	if (
		!ts.isVariableStatement(node) ||
		node.declarationList.declarations.length !== 1
	)
		return undefined;
	const declaration = node.declarationList.declarations[0];
	const call = declaration.initializer;
	if (
		!call ||
		!ts.isCallExpression(call) ||
		!ts.isIdentifier(call.expression) ||
		call.expression.text !== hookName
	)
		return undefined;
	if (!ts.isIdentifier(declaration.name))
		throw new Error(`The result of ${hookName} is kept in one variable.`);
	return {
		statement: node,
		declaration,
		name: declaration.name.text,
		args: call.arguments,
	};
}

function enclosingFunction(node: ts.Node): ts.Node | undefined {
	for (let parent = node.parent; parent; parent = parent.parent) {
		if (ts.isFunctionLike(parent)) return parent;
	}
	return undefined;
}

/** An identifier that reads a variable, not one that names a property. */
function isReference(node: ts.Identifier) {
	const parent = node.parent;
	if (ts.isPropertyAccessExpression(parent)) return parent.expression === node;
	if (ts.isPropertyAssignment(parent)) return parent.initializer === node;
	if (
		ts.isJsxAttribute(parent) ||
		ts.isBindingElement(parent) ||
		ts.isParameter(parent)
	)
		return false;
	return true;
}

/** The text each parameter of an entry stands for at one call. */
function argumentsOf(
	params: ts.NodeArray<ts.ParameterDeclaration>,
	args: ts.NodeArray<ts.Expression>,
	source: ts.SourceFile,
	fail: (message: string) => never,
) {
	const map = new Map<string, string>();
	params.forEach((parameter, i) => {
		const argument = args[i];
		const text = argument ? argument.getText(source) : "undefined";
		const value = !argument || isAtomic(argument) ? text : `(${text})`;
		if (ts.isIdentifier(parameter.name)) {
			if (parameter.name.text !== text) map.set(parameter.name.text, value);
			return;
		}
		if (!ts.isObjectBindingPattern(parameter.name))
			return fail("an entry takes variables, or the props as `{ style }`.");
		for (const element of parameter.name.elements) {
			if (
				!ts.isIdentifier(element.name) ||
				element.propertyName ||
				element.initializer ||
				element.dotDotDotToken
			) {
				return fail(
					"an entry reads props by their own name: `{ style, className }`.",
				);
			}
			map.set(element.name.text, `${value}.${element.name.text}`);
		}
	});
	return map;
}

/** The text of `node`, with the parameters of its entry replaced by what they stand for. */
function substitute(
	node: ts.Node,
	map: Map<string, string>,
	source: ts.SourceFile,
): string {
	if (!map.size) return node.getText(source);
	const edits: Edit[] = [];
	const walk = (inner: ts.Node) => {
		if (ts.isTypeNode(inner)) return;
		if (ts.isShorthandPropertyAssignment(inner)) {
			const value = map.get(inner.name.text);
			if (value !== undefined) {
				edits.push({
					start: inner.getStart(source),
					end: inner.end,
					text: `${inner.name.text}: ${value}`,
				});
			}
			return;
		}
		if (ts.isIdentifier(inner) && map.has(inner.text)) {
			if (
				(ts.isBindingElement(inner.parent) ||
					ts.isParameter(inner.parent)) &&
				inner.parent.name === inner
			) {
				throw new Error(
					`"${inner.text}" is declared twice in one entry of a styles file.`,
				);
			}
			if (isReference(inner))
				edits.push({
					start: inner.getStart(source),
					end: inner.end,
					text: map.get(inner.text)!,
				});
			return;
		}
		ts.forEachChild(inner, walk);
	};
	walk(node);
	const start = node.getStart(source);
	return apply(
		source.text.slice(start, node.end),
		edits.map((edit) => ({
			...edit,
			start: edit.start - start,
			end: edit.end - start,
		})),
	);
}

function isPlainObject(
	expression: ts.Expression,
): expression is ts.ObjectLiteralExpression {
	return (
		ts.isObjectLiteralExpression(expression) &&
		expression.properties.every(
			(property) =>
				ts.isShorthandPropertyAssignment(property) ||
				(ts.isPropertyAssignment(property) &&
					ts.isIdentifier(property.name)),
		)
	);
}

/** One property of an entry, as a JSX attribute. */
function attribute(
	property: ts.ObjectLiteralElementLike,
	map: Map<string, string>,
	source: ts.SourceFile,
) {
	if (ts.isShorthandPropertyAssignment(property)) {
		return `${property.name.text}={${map.get(property.name.text) ?? property.name.text}}`;
	}
	const { name, initializer } = property as ts.PropertyAssignment;
	const key = (name as ts.Identifier).text;
	return ts.isStringLiteral(initializer) && !/["{}\\\n]/.test(initializer.text)
		? `${key}="${initializer.text}"`
		: `${key}={${substitute(initializer, map, source)}}`;
}

function isAtomic(expression: ts.Expression) {
	return (
		ts.isIdentifier(expression) ||
		ts.isPropertyAccessExpression(expression) ||
		ts.isElementAccessExpression(expression) ||
		ts.isCallExpression(expression) ||
		ts.isObjectLiteralExpression(expression) ||
		ts.isArrayLiteralExpression(expression) ||
		ts.isParenthesizedExpression(expression) ||
		ts.isLiteralExpression(expression) ||
		expression.kind === ts.SyntaxKind.TrueKeyword ||
		expression.kind === ts.SyntaxKind.FalseKeyword ||
		expression.kind === ts.SyntaxKind.NullKeyword
	);
}

/** Whether an expression put where `node` is could be split by what surrounds it. */
function needsParentheses(parent: ts.Node, node: ts.Node) {
	return (
		ts.isBinaryExpression(parent) ||
		ts.isConditionalExpression(parent) ||
		ts.isPrefixUnaryExpression(parent) ||
		ts.isSpreadElement(parent) ||
		ts.isSpreadAssignment(parent) ||
		ts.isJsxSpreadAttribute(parent) ||
		((ts.isPropertyAccessExpression(parent) ||
			ts.isElementAccessExpression(parent) ||
			ts.isCallExpression(parent)) &&
			parent.expression === node)
	);
}

/** The statements of the hook that `code` reads, directly or through one another, as text. */
function reachable(
	statements: ts.Statement[],
	code: string,
	source: ts.SourceFile,
) {
	const text: string[] = [];
	const names: string[] = [];
	let read = code;
	const reads = (name: string) =>
		new RegExp(`(?<![\\w$.])${name.replace(/\$/g, "\\$")}(?![\\w$])`).test(
			read,
		);

	for (const statement of [...statements].reverse()) {
		const full = statement.getFullText(source).trim();
		if (!ts.isVariableStatement(statement)) {
			text.unshift(full);
			read += `\n${full}`;
			continue;
		}
		const [declaration, ...others] = statement.declarationList.declarations;
		const pattern = declaration.name;
		// Of `const { tokens, components } = useTheme()`, only what is read stays.
		if (
			!others.length &&
			ts.isObjectBindingPattern(pattern) &&
			declaration.initializer &&
			pattern.elements.every(
				(element) =>
					ts.isIdentifier(element.name) &&
					!element.propertyName &&
					!element.initializer &&
					!element.dotDotDotToken,
			)
		) {
			const used = pattern.elements
				.map((element) => (element.name as ts.Identifier).text)
				.filter(reads);
			if (!used.length) continue;
			const initializer = declaration.initializer.getText(source);
			text.unshift(`const { ${used.join(", ")} } = ${initializer};`);
			names.push(...used);
			read += `\n${initializer}`;
			continue;
		}
		const own = statement.declarationList.declarations.flatMap((each) =>
			bindingNames(each.name),
		);
		if (!own.some(reads)) continue;
		text.unshift(full);
		names.push(...own);
		read += `\n${full}`;
	}
	return { text, names };
}

function bindingNames(name: ts.BindingName): string[] {
	if (ts.isIdentifier(name)) return [name.text];
	return name.elements.flatMap((element) =>
		ts.isOmittedExpression(element) ? [] : bindingNames(element.name),
	);
}

/** The variables and parameters of a component, apart from the hook's result. */
function declaredIn(owner: ts.Node, except: ts.VariableDeclaration) {
	const names: string[] = [];
	const walk = (node: ts.Node) => {
		if (
			(ts.isVariableDeclaration(node) ||
				ts.isParameter(node) ||
				ts.isBindingElement(node)) &&
			node !== except
		) {
			if (ts.isIdentifier(node.name)) names.push(node.name.text);
		}
		ts.forEachChild(node, walk);
	};
	walk(owner);
	return names;
}

function topLevelNames(statement: ts.Statement): string[] {
	if (ts.isVariableStatement(statement)) {
		return statement.declarationList.declarations.flatMap((declaration) =>
			bindingNames(declaration.name),
		);
	}
	if (ts.isImportDeclaration(statement)) {
		const clause = statement.importClause;
		const bindings = clause?.namedBindings;
		return [
			...(clause?.name ? [clause.name.text] : []),
			...(bindings && ts.isNamedImports(bindings)
				? bindings.elements.map((element) => element.name.text)
				: []),
			...(bindings && ts.isNamespaceImport(bindings)
				? [bindings.name.text]
				: []),
		];
	}
	if (
		(ts.isFunctionDeclaration(statement) ||
			ts.isClassDeclaration(statement) ||
			ts.isTypeAliasDeclaration(statement) ||
			ts.isInterfaceDeclaration(statement) ||
			ts.isEnumDeclaration(statement)) &&
		statement.name
	) {
		return [statement.name.text];
	}
	return [];
}

function withoutExport(statement: ts.Statement, source: ts.SourceFile) {
	const modifier = ts.canHaveModifiers(statement)
		? ts
				.getModifiers(statement)
				?.find((each) => each.kind === ts.SyntaxKind.ExportKeyword)
		: undefined;
	const full = statement.getFullText(source);
	if (!modifier) return full.trim();
	const start = modifier.getStart(source) - statement.getFullStart();
	return (
		full.slice(0, start) +
		full.slice(modifier.end - statement.getFullStart()).trimStart()
	).trim();
}

type Import = {
	sideEffect: boolean;
	defaultName?: string;
	namespace?: string;
	/** Local name → imported name, and whether every import of it is type-only. */
	named: Map<string, { imported: string; type: boolean }>;
};

function mergeImport(
	imports: Map<string, Import>,
	statement: ts.ImportDeclaration,
	fail: (message: string) => never,
) {
	const specifier = (statement.moduleSpecifier as ts.StringLiteral).text;
	const entry: Import = imports.get(specifier) ?? {
		sideEffect: false,
		named: new Map(),
	};
	imports.set(specifier, entry);

	const clause = statement.importClause;
	if (!clause) {
		entry.sideEffect = true;
		return;
	}
	if (clause.name) entry.defaultName = clause.name.text;
	const bindings = clause.namedBindings;
	if (bindings && ts.isNamespaceImport(bindings)) {
		if (entry.namespace && entry.namespace !== bindings.name.text)
			fail(`"${specifier}" is imported under two names.`);
		entry.namespace = bindings.name.text;
	}
	if (bindings && ts.isNamedImports(bindings)) {
		for (const element of bindings.elements) {
			const type = clause.isTypeOnly || element.isTypeOnly;
			const known = entry.named.get(element.name.text);
			entry.named.set(element.name.text, {
				imported: (element.propertyName ?? element.name).text,
				type: known ? known.type && type : type,
			});
		}
	}
}

function reads(code: string, name: string) {
	return new RegExp(`(?<![\\w$])${name.replace(/\$/g, "\\$")}(?![\\w$])`).test(
		code,
	);
}

/** One import, with only the names `code` still reads. */
function printImport(specifier: string, entry: Import, code: string) {
	const named = [...entry.named].filter(([local]) => reads(code, local));
	const defaultName =
		entry.defaultName && reads(code, entry.defaultName)
			? entry.defaultName
			: undefined;
	const namespace =
		entry.namespace && reads(code, entry.namespace)
			? entry.namespace
			: undefined;
	if (!named.length && !defaultName && !namespace)
		return entry.sideEffect ? `import "${specifier}";` : "";

	const typeOnly =
		!defaultName && !namespace && named.every(([, name]) => name.type);
	const parts = [
		...(defaultName ? [defaultName] : []),
		...(namespace ? [`* as ${namespace}`] : []),
		...(named.length
			? [
					`{ ${named
						.map(
							([local, name]) =>
								`${!typeOnly && name.type ? "type " : ""}${name.imported === local ? local : `${name.imported} as ${local}`}`,
						)
						.join(", ")} }`,
				]
			: []),
	];
	return `import ${typeOnly ? "type " : ""}${parts.join(", ")} from "${specifier}";`;
}

function lineIndent(text: string, position: number) {
	const start = text.lastIndexOf("\n", position - 1) + 1;
	return /^[ \t]*/.exec(text.slice(start, position))![0];
}

/** The position after the line break that follows `position`, if one does. */
function lineEnd(text: string, position: number) {
	if (text[position] === "\r") position++;
	return text[position] === "\n" ? position + 1 : position;
}

function apply(text: string, edits: Edit[]) {
	let result = text;
	for (const edit of [...edits].sort((a, b) => b.start - a.start)) {
		result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
	}
	return result;
}
