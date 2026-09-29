import { readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import ts from "typescript";

import { registryAddress, sets } from "./copy.ts";
import { resolveItems } from "./registry.ts";
import {
	DEFAULT_ALIASES,
	VARIANT_OF,
	type FileSet,
	type ProjectConfig,
	type Registry,
	type RegistryItem,
} from "./types.ts";

// `add --standalone` writes one self-contained file: the requested item, the Axiom items it stands on
// (core, hooks, other components) inlined, and the theme replaced by the values it resolves to.
//
//   1. every source file is parsed, and each identifier is bound to what it refers to: a top-level
//      declaration of some file, an npm import, or the theme;
//   2. the theme is read three ways — `useTheme()`, the `theme` Unistyles hands to `StyleSheet.create`
//      and `uniProps`, and `useUnistyles()` — and each becomes a reference to one `theme` constant;
//   3. declarations nothing reaches are dropped, and names two files share are made unique;
//   4. the light theme is evaluated, and only the parts the file reads are written into `theme`.
//      Token groups and component tokens are written whole, typed by their registry types: their
//      optional keys (a state, a `fontFamily`) would be lost on a literal.

export type StandaloneConfig = Pick<ProjectConfig, "styling" | "icons">;

export type StandaloneResult = {
	item: RegistryItem;
	/** `<item>.tsx`, or `.ts` when nothing in it is JSX. */
	fileName: string;
	content: string;
	dependencies: string[];
	/** Icons the item renders itself that the inlined icon registry doesn't have. */
	missingIcons: string[];
};

const THEME_ALIAS = DEFAULT_ALIASES.theme;
const THEME_MODULE = `${THEME_ALIAS}/theme`;
const TOKENS_MODULE = `${THEME_ALIAS}/tokens`;
/** Theme files inlined for their types. Their values are read from the evaluated theme. */
const TYPE_MODULES = [TOKENS_MODULE, `${THEME_ALIAS}/components/states`];
/** Types that describe the resolved theme itself, rather than being declared in a type module. */
const THEME_TYPES: Record<string, string[]> = {
	Theme: [],
	ThemeColors: ["colors"],
};
const ROOT_NAME = "theme";

/** Stands for `StyleSheet.hairlineWidth` while the tokens are evaluated: only the device knows it. */
const HAIRLINE = Object.freeze({ hairline: true });

type Module = {
	item: RegistryItem;
	path: string;
	entry: boolean;
	/** A theme file inlined for its types. */
	types: boolean;
	/** The component tokens file of `item`. */
	tokens: boolean;
	/** What the file's section is headed with: the item, or the theme file. */
	label: string;
	source: ts.SourceFile;
	statements: Statement[];
	/** Other modules this one imports. */
	imports: Set<Module>;
};

type Decl = {
	kind: "decl";
	module: Module;
	name: string;
	statements: Statement[];
	exported: boolean;
};
type External = {
	kind: "external";
	from: string;
	/** `default`, `*`, or the exported name. */
	imported: string;
	local: string;
	typeOnly: boolean;
};
/** A part of the theme a file imports by name: `metrics`, the `Theme` type… */
type ThemePart = { kind: "theme"; name: string; path: string[]; type: boolean };
type Root = { kind: "root" };
/**
 * A part of the theme written whole and typed: a token group (`const typography: Typography`) or
 * the tokens of one component (`const switchTokens: SwitchTokens`).
 */
type Slice = { kind: "slice"; path: [string, string]; type: Decl; preferred: string };
type Entity = Decl | External | ThemePart | Root | Slice;
type Binding = Entity | { kind: "module"; module: Module; name: string } | "useTheme";

type Edit = {
	start: number;
	end: number;
	/** Replacement text, or the final name of `entity`. */
	text?: string;
	entity?: Entity;
	/** Set on a shorthand property (`{ styles }`), which keeps its key when the name changes. */
	shorthand?: string;
	/** Written before the name. */
	before?: string;
};

type Statement = {
	module: Module;
	node: ts.Statement;
	decl?: Decl;
	deps: Set<Entity>;
	edits: Edit[];
	/** Starts with `export` in the output. */
	addExport?: boolean;
};

const ROOT: Root = { kind: "root" };

export function buildStandalone(
	registry: Registry,
	registryRoot: string,
	name: string,
	config: StandaloneConfig,
): StandaloneResult {
	const variant = VARIANT_OF[config.styling];
	const items = resolveItems(registry, [name]);
	const requested = items[0];

	if (requested.type === "foundations") {
		throw new Error(
			`"${name}" is part of the theme: standalone components resolve it inline.`,
		);
	}
	const blocked = items.filter((item) => item.standalone === false);
	if (blocked.length) {
		throw new Error(
			`"${name}" isn't available standalone yet: it depends on ${blocked
				.map((item) => `"${item.name}"`)
				.join(" and ")}, which ${blocked.length > 1 ? "have" : "has"} no standalone form.`,
		);
	}
	for (const item of items) {
		if (item.variants && !item.variants[variant]) {
			throw new Error(`"${item.name}" has no ${variant} variant yet.`);
		}
		if (item.iconSources && !config.icons) {
			throw new Error(`"${item.name}" needs an icon source.`);
		}
		if (item.iconSources && config.icons && !item.iconSources[config.icons]) {
			throw new Error(
				`"${item.name}" doesn't support the "${config.icons}" icon source.`,
			);
		}
	}

	// The theme is read from the registry even when no item depends on it: `tappable` only reads a token.
	const all = [...new Set([...items, ...resolveItems(registry, ["theme"])])];
	const fileSets = new Map(all.map((item) => [item, sets(item, { ...config })]));
	const theme = evaluateTheme(all, fileSets, registryRoot);

	// Every file the items are made of, addressed the way registry sources import them. Of the
	// theme, only the files its types live in.
	const files: { item: RegistryItem; path: string; address: string }[] = [];
	for (const item of all) {
		for (const file of fileSets.get(item)!.flatMap((set) => set.files ?? [])) {
			const address = registryAddress(file, item);
			if (item.type === "foundations" && !TYPE_MODULES.includes(address)) continue;
			files.push({ item, path: normalize(resolve(registryRoot, pathOf(file))), address });
		}
	}

	const program = createProgram(
		new Map(files.map(({ path }) => [path, readFileSync(path, "utf8")])),
	);
	const checker = program.getTypeChecker();

	const modules = files.map(({ item, path, address }): Module => {
		const tokens = item.tokens !== undefined && path === normalize(resolve(registryRoot, item.tokens));
		return {
			item,
			path,
			entry: item === requested && !tokens,
			types: TYPE_MODULES.includes(address),
			tokens,
			label: TYPE_MODULES.includes(address) ? address.replace(/^@\//, "") : item.name,
			source: program.getSourceFile(path)!,
			statements: [],
			imports: new Set(),
		};
	});
	const byAddress = new Map(files.map((file, i) => [file.address, modules[i]]));
	const byPath = new Map(modules.map((module) => [stripExtension(module.path), module]));
	const typeModules = modules.filter((module) => module.types);

	const internalModule = (specifier: string, from: Module) => {
		if (specifier.startsWith(".")) {
			const target = byPath.get(stripExtension(normalize(resolve(dirname(from.path), specifier))));
			if (!target) {
				throw new Error(`${from.path}: "${specifier}" isn't a file of "${from.item.name}".`);
			}
			return target;
		}
		return byAddress.get(specifier);
	};

	// Top-level declarations.
	const decls = new Map<ts.Node, Decl>();
	const declsByName = new Map<Module, Map<string, Decl>>();
	for (const module of modules) {
		const names = new Map<string, Decl>();
		declsByName.set(module, names);

		for (const statement of module.source.statements) {
			if (ts.isImportDeclaration(statement)) continue;
			if (ts.isExportAssignment(statement)) {
				throw new Error(`${module.path}: default exports aren't supported standalone.`);
			}

			const record: Statement = { module, node: statement, deps: new Set(), edits: [] };
			module.statements.push(record);

			for (const [node, declName] of declarationsOf(statement)) {
				let decl = names.get(declName);
				if (!decl) {
					decl = { kind: "decl", module, name: declName, statements: [], exported: false };
					names.set(declName, decl);
				}
				if (!decl.statements.includes(record)) decl.statements.push(record);
				record.decl = decl;
				decls.set(node, decl);
				if (module.entry && hasExport(statement)) decl.exported = true;
			}
		}
	}

	// Imports.
	const bindings = new Map<ts.Node, Binding>();
	const externals = new Map<string, External>();
	const themeParts = new Map<string, ThemePart>();

	const external = (from: string, imported: string, local: string, typeOnly: boolean) => {
		const key = `${from}\0${imported}`;
		const found = externals.get(key);
		if (found) {
			found.typeOnly &&= typeOnly;
			return found;
		}
		const created: External = { kind: "external", from, imported, local, typeOnly };
		externals.set(key, created);
		return created;
	};

	/** What a name imported from the theme stands for, standalone. */
	const fromTheme = (imported: string, typeOnly: boolean, module: Module): Binding => {
		if (imported === "useTheme") return "useTheme";

		const known = themeParts.get(imported);
		if (known) return known;
		if (imported in THEME_TYPES) {
			const part: ThemePart = { kind: "theme", name: imported, path: THEME_TYPES[imported], type: true };
			themeParts.set(imported, part);
			return part;
		}

		// A type the theme's files declare, like `Spacing` or `States`, is inlined as written.
		for (const typeModule of typeModules) {
			const decl = declsByName.get(typeModule)!.get(imported);
			if (decl?.statements.every(({ node }) => isTypeDeclaration(node))) {
				return { kind: "module", module: typeModule, name: imported };
			}
		}

		// A value, like `metrics`, is found in the evaluated theme.
		const path = typeOnly ? undefined : findPath(theme.value, theme.namespace[imported]);
		if (!path) {
			throw new Error(`${module.path}: standalone mode can't resolve "${imported}" from the theme.`);
		}
		const part: ThemePart = { kind: "theme", name: imported, path, type: false };
		themeParts.set(imported, part);
		return part;
	};

	for (const module of modules) {
		for (const statement of module.source.statements) {
			if (!ts.isImportDeclaration(statement)) continue;
			const specifier = (statement.moduleSpecifier as ts.StringLiteral).text;
			const clause = statement.importClause;
			if (!clause) {
				throw new Error(`${module.path}: side-effect imports aren't supported standalone.`);
			}

			const clauseTypeOnly = clause.phaseModifier === ts.SyntaxKind.TypeKeyword;
			const target = internalModule(specifier, module);
			const bind = (node: ts.Node, imported: string, local: string, typeOnly: boolean) => {
				if (target && !target.types) {
					if (imported === "default" || imported === "*") {
						throw new Error(`${module.path}: import Axiom files by name.`);
					}
					module.imports.add(target);
					bindings.set(node, { kind: "module", module: target, name: imported });
				} else if (isTheme(specifier)) {
					const binding = fromTheme(imported, typeOnly, module);
					if (typeof binding !== "string" && binding.kind === "module") module.imports.add(binding.module);
					bindings.set(node, binding);
				} else if (specifier.startsWith("@/")) {
					throw new Error(`${module.path}: "${specifier}" isn't part of this item's dependencies.`);
				} else {
					bindings.set(node, external(specifier, imported, local, typeOnly));
				}
			};

			if (clause.name) bind(clause, "default", clause.name.text, clauseTypeOnly);
			const named = clause.namedBindings;
			if (named && ts.isNamespaceImport(named)) {
				bind(named, "*", named.name.text, clauseTypeOnly);
			} else if (named) {
				for (const element of named.elements) {
					bind(
						element,
						(element.propertyName ?? element.name).text,
						element.name.text,
						clauseTypeOnly || element.isTypeOnly,
					);
				}
			}
		}
	}

	// Re-exports: `export { useCalendar } from "../use-calendar"` exports that declaration directly.
	for (const module of modules) {
		for (const record of module.statements) {
			const statement = record.node;
			if (!ts.isExportDeclaration(statement)) continue;
			const clause = statement.exportClause;
			if (!clause || !ts.isNamedExports(clause)) {
				throw new Error(`${module.path}: "export *" isn't supported standalone.`);
			}
			const specifier = statement.moduleSpecifier as ts.StringLiteral | undefined;
			const target = specifier ? internalModule(specifier.text, module) : module;
			if (!target) {
				throw new Error(`${module.path}: re-exports from "${specifier!.text}" aren't supported standalone.`);
			}
			if (!module.entry) continue;
			for (const element of clause.elements) {
				const decl = declsByName.get(target)!.get((element.propertyName ?? element.name).text);
				if (!decl) continue;
				decl.exported = true;
				// The statement goes away; what it exported stays reachable through it.
				record.deps.add(decl);
			}
		}
	}

	// Declarations the theme comes through: parameters, `useTheme()` results. Filled below.
	const rootDecls = new Set<ts.Node>();

	const bindingOf = (node: ts.Identifier) => {
		const symbol = checker.getSymbolAtLocation(node);
		for (const declaration of symbol?.declarations ?? []) {
			const binding = bindings.get(declaration);
			if (binding) return binding;
		}
		return undefined;
	};

	const isExternal = (node: ts.Expression, from: string, imported: string) => {
		if (!ts.isIdentifier(node)) return false;
		const binding = bindingOf(node);
		return (
			typeof binding === "object" &&
			binding.kind === "external" &&
			binding.from === from &&
			binding.imported === imported
		);
	};

	const targetOf = (node: ts.Identifier): Entity | undefined => {
		const symbol =
			ts.isShorthandPropertyAssignment(node.parent) && node.parent.name === node
				? checker.getShorthandAssignmentValueSymbol(node.parent)
				: checker.getSymbolAtLocation(node);
		for (const declaration of symbol?.declarations ?? []) {
			if (rootDecls.has(declaration)) return ROOT;
			const decl = decls.get(declaration);
			if (decl) return decl;
			const binding = bindings.get(declaration);
			if (binding === "useTheme") {
				throw new Error(`${node.getSourceFile().fileName}: useTheme is only supported as a call.`);
			}
			if (binding?.kind === "module") {
				const target = declsByName.get(binding.module)!.get(binding.name);
				if (!target) {
					throw new Error(
						`${node.getSourceFile().fileName}: "${binding.name}" isn't declared in ${binding.module.path}.`,
					);
				}
				return target;
			}
			if (binding) return binding;
		}
		return undefined;
	};

	/** The type a declaration is annotated with, as a top-level declaration: `): SwitchTokens =>`. */
	const declaredType = (type: ts.TypeNode | undefined, what: string): Decl => {
		const target =
			type && ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)
				? targetOf(type.typeName)
				: undefined;
		if (target?.kind !== "decl") throw new Error(`${what} needs a named type.`);
		return target;
	};

	// The parts of the theme written whole: each token group, typed by its member of `Tokens`, and
	// each component's tokens, typed by what its tokens function returns.
	const slices = new Map<string, Slice>();
	const tokensModule = byAddress.get(TOKENS_MODULE);
	const tokensType = tokensModule && declsByName.get(tokensModule)!.get("Tokens")?.statements[0]?.node;
	if (!tokensType || !ts.isTypeAliasDeclaration(tokensType) || !ts.isTypeLiteralNode(tokensType.type)) {
		throw new Error(`The registry's ${TOKENS_MODULE} has no "Tokens" type.`);
	}
	for (const member of tokensType.type.members) {
		if (!ts.isPropertySignature(member) || !ts.isIdentifier(member.name)) continue;
		const group = member.name.text;
		slices.set(`tokens.${group}`, {
			kind: "slice",
			path: ["tokens", group],
			type: declaredType(member.type, `Tokens.${group}`),
			preferred: group,
		});
	}
	for (const module of modules) {
		if (!module.tokens) continue;
		const key = camelCase(module.item.name);
		const fn = declsByName.get(module)!.get(`${key}Tokens`)?.statements[0]?.node;
		const initializer =
			fn && ts.isVariableStatement(fn) ? fn.declarationList.declarations[0].initializer : undefined;
		const type =
			initializer && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))
				? initializer.type
				: undefined;
		slices.set(`components.${key}`, {
			kind: "slice",
			path: ["components", key],
			type: declaredType(type, `${module.path}: ${key}Tokens`),
			preferred: `${key}Tokens`,
		});
	}

	// References, and the rewrites that turn every way of reading the theme into `theme`.
	for (const module of modules) {
		const params = new Set<ts.ParameterDeclaration>();
		// Called directly too (`foreground(theme)`), so their arity stays.
		const mappers = new Set<ts.ParameterDeclaration>();

		const collect = (node: ts.Node) => {
			// StyleSheet.create((theme) => …), from Unistyles.
			if (
				ts.isCallExpression(node) &&
				ts.isPropertyAccessExpression(node.expression) &&
				node.expression.name.text === "create" &&
				isExternal(node.expression.expression, "react-native-unistyles", "StyleSheet")
			) {
				const param = node.arguments[0] && firstParameter(node.arguments[0]);
				if (param) params.add(param);
			}
			// uniProps={(theme) => …}
			if (
				ts.isJsxAttribute(node) &&
				ts.isIdentifier(node.name) &&
				node.name.text === "uniProps" &&
				node.initializer &&
				ts.isJsxExpression(node.initializer) &&
				node.initializer.expression
			) {
				const param = firstParameter(node.initializer.expression);
				if (param) params.add(param);
			}
			// (theme: Theme) => …, the mappers Unistyles components are given.
			if (
				variant === "unistyles" &&
				ts.isParameter(node) &&
				node.type &&
				ts.isTypeReferenceNode(node.type) &&
				ts.isIdentifier(node.type.typeName) &&
				!node.type.typeArguments
			) {
				const binding = bindingOf(node.type.typeName);
				if (typeof binding === "object" && binding.kind === "theme" && binding.name === "Theme") {
					params.add(node);
					mappers.add(node);
				}
			}
			ts.forEachChild(node, collect);
		};
		collect(module.source);

		for (const param of params) {
			if (!ts.isIdentifier(param.name)) {
				throw new Error(`${module.path}: destructure the theme inside the function, not in its parameters.`);
			}
			rootDecls.add(param);
		}

		for (const record of module.statements) {
			if (ts.isExportDeclaration(record.node)) continue;

			const { edits, deps } = record;
			const remove = (start: number, end: number) => edits.push({ start, end, text: "" });

			const visit = (node: ts.Node): void => {
				if (ts.isParameter(node) && params.has(node)) {
					removeParameter(node, edits, mappers.has(node));
					return;
				}

				// const { tokens } = useTheme();  →  const { tokens } = theme;
				// const theme = useTheme();        →  (removed)
				if (
					ts.isCallExpression(node) &&
					ts.isIdentifier(node.expression) &&
					bindingOf(node.expression) === "useTheme"
				) {
					const declaration = node.parent;
					if (ts.isVariableDeclaration(declaration) && declaration.initializer === node && ts.isIdentifier(declaration.name)) {
						const list = declaration.parent;
						const statement = list.parent;
						if (!ts.isVariableDeclarationList(list) || list.declarations.length !== 1 || !ts.isVariableStatement(statement)) {
							throw new Error(`${module.path}: declare the theme on its own.`);
						}
						rootDecls.add(declaration);
						remove(statement.getFullStart(), statement.getEnd());
						return;
					}
					deps.add(ROOT);
					edits.push({ start: node.getStart(), end: node.getEnd(), entity: ROOT });
					return;
				}

				// ReturnType<typeof useTheme>  →  typeof theme
				if (
					ts.isTypeReferenceNode(node) &&
					ts.isIdentifier(node.typeName) &&
					node.typeName.text === "ReturnType" &&
					node.typeArguments?.length === 1
				) {
					const [argument] = node.typeArguments;
					if (
						ts.isTypeQueryNode(argument) &&
						ts.isIdentifier(argument.exprName) &&
						bindingOf(argument.exprName) === "useTheme"
					) {
						deps.add(ROOT);
						edits.push({ start: node.getStart(), end: node.getEnd(), entity: ROOT, before: "typeof " });
						return;
					}
				}

				// const { theme, rt } = useUnistyles();  →  const { rt } = useUnistyles();
				if (
					ts.isVariableStatement(node) &&
					node.declarationList.declarations.some(
						(declaration) =>
							declaration.initializer &&
							ts.isCallExpression(declaration.initializer) &&
							isExternal(declaration.initializer.expression, "react-native-unistyles", "useUnistyles"),
					)
				) {
					const [declaration] = node.declarationList.declarations;
					const pattern = declaration.name;
					if (node.declarationList.declarations.length !== 1 || !ts.isObjectBindingPattern(pattern)) {
						throw new Error(`${module.path}: destructure useUnistyles() on its own.`);
					}
					const themeElement = pattern.elements.find(
						(element) => (element.propertyName ?? element.name).getText() === "theme",
					);
					if (themeElement) {
						rootDecls.add(themeElement);
						if (pattern.elements.length === 1) {
							remove(node.getFullStart(), node.getEnd());
							return;
						}
						removeListElement(themeElement, pattern.elements, edits);
						for (const element of pattern.elements) {
							if (element !== themeElement) visit(element);
						}
						visit(declaration.initializer!);
						return;
					}
				}

				if (ts.isIdentifier(node)) {
					const target = targetOf(node);
					if (target) {
						deps.add(target);
						const shorthand =
							ts.isShorthandPropertyAssignment(node.parent) && node.parent.name === node
								? node.text
								: undefined;
						edits.push({ start: node.getStart(), end: node.getEnd(), entity: target, shorthand });
					}
					return;
				}

				ts.forEachChild(node, visit);
			};

			visit(record.node);

			// Only the requested item keeps its exports.
			const exportKeyword = ts.canHaveModifiers(record.node)
				? ts.getModifiers(record.node)?.find((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
				: undefined;
			if (exportKeyword && !record.decl?.exported) {
				remove(exportKeyword.getStart(), skipSpaces(module.source.text, exportKeyword.getEnd()));
			}
			if (!exportKeyword && record.decl?.exported) record.addExport = true;
		}
	}

	// The requested item's statements, and anything with effects, are kept; the rest only when reached.
	const ordered = order(modules);
	const hairline = external("react-native", "StyleSheet", "StyleSheet", false);

	const valuePartAt = (path: string[]) =>
		[...themeParts.values()].find(
			(part) => !part.type && part.path.join(".") === path.join("."),
		);

	const link = (written: Slice[]) => {
		const kept = new Set<Statement>();
		const used = new Set<Entity>(written);
		const queue: Statement[] = written.flatMap((slice) => slice.type.statements);
		for (const module of modules) {
			for (const record of module.statements) {
				if (module.entry || (!record.decl && !module.types && !module.tokens)) queue.push(record);
			}
		}
		while (queue.length) {
			const record = queue.pop()!;
			if (kept.has(record)) continue;
			kept.add(record);
			for (const dep of record.deps) {
				used.add(dep);
				if (dep.kind === "decl") queue.push(...dep.statements);
			}
		}
		const keptOf = (module: Module) =>
			module.statements.filter((record) => kept.has(record) && !ts.isExportDeclaration(record.node));

		// Names: the requested item's first, then the theme, then the rest, renamed on a clash.
		const names = new Map<Entity, string>();
		const taken = new Set<string>();
		const allocate = (entity: Entity, preferred: string, fallback: string) => {
			if (names.has(entity)) return;
			let name = taken.has(preferred) ? fallback : preferred;
			for (let i = 2; taken.has(name); i++) name = `${fallback}${i}`;
			taken.add(name);
			names.set(entity, name);
		};
		const allocateModules = (group: Module[]) => {
			for (const module of group) {
				for (const decl of declsByName.get(module)!.values()) {
					if (decl.statements.some((record) => kept.has(record))) {
						allocate(decl, decl.name, prefixed(module.item.name, decl.name));
					}
				}
			}
			for (const record of group.flatMap(keptOf)) {
				for (const dep of record.deps) {
					if (dep.kind === "external") allocate(dep, dep.local, prefixed(dep.from, dep.imported));
				}
			}
		};
		const entries = ordered.filter((module) => module.entry);
		allocateModules(entries);
		allocate(ROOT, ROOT_NAME, "axiomTheme");
		for (const part of themeParts.values()) {
			if (used.has(part)) allocate(part, part.name, prefixed(ROOT_NAME, part.name));
		}
		for (const slice of written) {
			// `import { metrics }` and the `metrics` slice are the same value: one name.
			const part = valuePartAt(slice.path);
			if (part && names.has(part)) names.set(slice, names.get(part)!);
			else allocate(slice, slice.preferred, prefixed(slice.path[0], slice.preferred));
		}
		allocateModules(ordered.filter((module) => !module.entry));
		allocate(hairline, hairline.local, prefixed(hairline.from, hairline.imported));

		const nameOf = (entity: Entity) => {
			const found = names.get(entity);
			if (found === undefined) throw new Error("Standalone: an entity has no name.");
			return found;
		};

		const body = ordered
			.map((module) => {
				const code = keptOf(module)
					.map((record) => render(record, nameOf))
					.join("")
					.replace(/^\s*\n/, "")
					.trim();
				if (!code) return "";
				return module.entry ? code : `// ${module.label}\n${code}`;
			})
			.filter(Boolean)
			.join("\n\n");

		return { body, used, nameOf };
	};

	// Linked once to find what the file reads of the theme, then again with the slices that needs.
	const first = link([]);
	const parts = [...themeParts.values()].filter((part) => first.used.has(part));
	const marks = themeUsage(
		first.body,
		first.nameOf(ROOT),
		parts.map((part) => ({ name: first.nameOf(part), part })),
	);

	const written = new Set<Slice>();
	const loose: string[][] = [];
	for (const mark of marks) {
		const [group, key] = mark;
		const matching = [...slices.values()].filter(
			(slice) =>
				(group === undefined || slice.path[0] === group) &&
				(key === undefined || slice.path[1] === key),
		);
		matching.forEach((slice) => written.add(slice));
		// What no slice covers stays a plain value: the colors, and anything read whole.
		if (mark.length < 2 || !matching.length) loose.push(mark);
	}
	const { body, used, nameOf } = link([...written]);

	// The resolved theme.
	const importsUsed = new Set<External>(
		[...used].filter((entity): entity is External => entity.kind === "external"),
	);
	const printHairline = () => {
		importsUsed.add(hairline);
		return `${nameOf(hairline)}.hairlineWidth`;
	};

	const declarations: string[] = [];
	const tree = clone(loose.length ? pick(theme.value, loose) : {}) as Record<string, Record<string, unknown>>;
	for (const slice of written) {
		const [group, key] = slice.path;
		const value = (theme.value as Record<string, Record<string, unknown>>)[group]?.[key];
		if (value === undefined) {
			throw new Error(`Standalone: the theme has no ${group}.${key}.`);
		}
		declarations.push(
			`const ${nameOf(slice)}: ${nameOf(slice.type)} = ${printValue(value, "", printHairline)};`,
		);
		tree[group] = { ...tree[group], [key]: new Reference(nameOf(slice)) };
	}
	const sliced = (part: ThemePart) =>
		!part.type && [...written].some((slice) => valuePartAt(slice.path) === part);
	// `theme` itself is only written when something still reads it rather than a slice.
	if (used.has(ROOT) || parts.some((part) => !sliced(part))) {
		declarations.push(
			`const ${nameOf(ROOT)} = ${printValue(sortLike(tree, theme.value), "", printHairline)} as const;`,
		);
	}
	for (const part of parts) {
		if (sliced(part)) continue;
		const access = nameOf(ROOT) + part.path.map(accessor).join("");
		declarations.push(
			part.type
				? `type ${nameOf(part)} = typeof ${access};`
				: `const ${nameOf(part)} = ${access};`,
		);
	}

	const header = [
		`// Standalone ${requested.name}, added by axiom with the ${variant} styling.`,
		"// No theme: the values below are Axiom's light theme, resolved when the file was added.",
		"// Light / dark and any restyling happen here, in a file that is yours to edit.",
	].join("\n");

	const content =
		[header, printImports([...importsUsed], nameOf), declarations.join("\n\n"), body]
			.filter(Boolean)
			.join("\n\n") + "\n";

	const dependencies = new Set<string>();
	for (const item of items) {
		if (item.type === "foundations") continue;
		for (const set of fileSets.get(item)!) {
			for (const dependency of set.dependencies ?? []) dependencies.add(dependency);
		}
	}

	// The icons the item draws itself have to be in the icon registry it now carries.
	const iconRegistry = items
		.filter((item) => item.iconSources)
		.flatMap((item) => fileSets.get(item)!.flatMap((set) => set.files ?? []))
		.map(pathOf)
		.find((path) => path.endsWith("icons.tsx"));
	const iconSource = iconRegistry ? readFileSync(resolve(registryRoot, iconRegistry), "utf8") : undefined;
	const missingIcons = iconSource
		? (requested.requiredIcons ?? []).filter((icon) => !hasIcon(iconSource, icon))
		: [];

	return {
		item: requested,
		fileName: `${requested.name}${modules.some((module) => module.entry && module.path.endsWith(".tsx")) ? ".tsx" : ".ts"}`,
		content,
		dependencies: [...dependencies],
		missingIcons,
	};
}

/** An entry of an icon registry object: `close:` or `'chevron-right':`. */
export function hasIcon(source: string, name: string) {
	const key = /^[A-Za-z_$][\w$]*$/.test(name) ? `(?:${name}|['"]${name}['"])` : `['"]${name}['"]`;
	return new RegExp(`^\\s*${key}\\s*:`, "m").test(source);
}

// ─── Theme ────────────────────────────────────────────────────────────────────

/**
 * The light theme, with the component tokens of `items`, evaluated from the registry sources. It is
 * what `useTheme()` returns in a project where these items were added with the theme.
 */
function evaluateTheme(
	items: RegistryItem[],
	fileSets: Map<RegistryItem, FileSet[]>,
	registryRoot: string,
) {
	const foundations = new Map<string, string>();
	for (const item of items) {
		if (item.type !== "foundations") continue;
		for (const file of fileSets.get(item)!.flatMap((set) => set.files ?? [])) {
			foundations.set(registryAddress(file, item), resolve(registryRoot, pathOf(file)));
		}
	}

	const tokenFunctions: Record<string, (colors: unknown, tokens: unknown) => unknown> = {};
	const cache = new Map<string, Record<string, unknown>>();

	const load = (path: string): Record<string, unknown> => {
		const cached = cache.get(path);
		if (cached) return cached;

		const { outputText } = ts.transpileModule(readFileSync(path, "utf8"), {
			fileName: path,
			compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
		});
		const module = { exports: {} as Record<string, unknown> };
		cache.set(path, module.exports);

		const require = (specifier: string) => {
			if (specifier === "react-native") {
				return { StyleSheet: { hairlineWidth: HAIRLINE } };
			}
			// The template `axiom add` fills, filled with the tokens of `items`.
			if (specifier === `${THEME_ALIAS}/components`) {
				return {
					components: (colors: unknown, tokens: unknown) =>
						Object.fromEntries(
							Object.entries(tokenFunctions).map(([key, fn]) => [key, fn(colors, tokens)]),
						),
				};
			}
			const target = specifier.startsWith(".")
				? [...foundations.values()].find(
						(file) => stripExtension(file) === stripExtension(resolve(dirname(path), specifier)),
					)
				: foundations.get(specifier);
			if (!target) throw new Error(`${path}: standalone mode can't evaluate "${specifier}".`);
			return load(target);
		};

		new Function("require", "module", "exports", outputText)(require, module, module.exports);
		cache.set(path, module.exports);
		return module.exports;
	};

	for (const item of items) {
		if (!item.tokens) continue;
		const key = camelCase(item.name);
		const fn = load(resolve(registryRoot, item.tokens))[`${key}Tokens`];
		if (typeof fn !== "function") {
			throw new Error(`${item.tokens} doesn't export ${key}Tokens.`);
		}
		tokenFunctions[key] = fn as (colors: unknown, tokens: unknown) => unknown;
	}

	const themeFile = foundations.get(THEME_MODULE);
	if (!themeFile) throw new Error(`The registry has no ${THEME_MODULE}.`);
	const value = load(themeFile).light;

	// What `@/theme` and its files export by name: `metrics`, `lightColors`…
	const namespace: Record<string, unknown> = {};
	for (const exports of cache.values()) Object.assign(namespace, exports);

	return { value, namespace };
}

/** Where `target` sits in the theme, two levels deep at most: `metrics` is `tokens.metrics`. */
function findPath(theme: unknown, target: unknown): string[] | undefined {
	if (target === undefined || target === null || typeof target !== "object") return undefined;
	if (theme === target) return [];
	for (const [key, child] of Object.entries(theme as object)) {
		if (child === target) return [key];
		if (child && typeof child === "object") {
			for (const [inner, value] of Object.entries(child)) {
				if (value === target) return [key, inner];
			}
		}
	}
	return undefined;
}

/**
 * The parts of the theme `code` reads, as paths from its root. A path stops where the access stops
 * being static: `tokens.spacing[gap]` needs all of `tokens.spacing`.
 */
function themeUsage(
	code: string,
	rootName: string,
	parts: { name: string; part: ThemePart }[],
): string[][] {
	const prelude = [
		`declare const ${rootName}: any;`,
		...parts.map(({ name, part }) =>
			part.type ? `type ${name} = any;` : `declare const ${name}: any;`,
		),
	].join("\n");
	const file = "/standalone.tsx";
	const program = createProgram(new Map([[file, `${prelude}\n${code}`]]));
	const checker = program.getTypeChecker();
	const source = program.getSourceFile(file)!;

	const references = new Map<ts.Symbol, ts.Identifier[]>();
	const index = (node: ts.Node) => {
		if (ts.isIdentifier(node)) {
			const symbol =
				ts.isShorthandPropertyAssignment(node.parent) && node.parent.name === node
					? checker.getShorthandAssignmentValueSymbol(node.parent)
					: checker.getSymbolAtLocation(node);
			if (symbol) references.set(symbol, [...(references.get(symbol) ?? []), node]);
		}
		ts.forEachChild(node, index);
	};
	index(source);

	const marks: string[][] = [];
	const seen = new Set<ts.Symbol>();

	const follow = (
		symbol: ts.Symbol | undefined,
		path: string[],
		declaration: ts.Node,
		prelude = false,
	) => {
		if (!symbol || seen.has(symbol)) {
			marks.push(path);
			return;
		}
		seen.add(symbol);
		const uses = (references.get(symbol) ?? []).filter((id) => id.parent !== declaration);
		// Declared in the code and never read: the key still has to exist.
		if (!uses.length && !prelude) marks.push(path);
		for (const id of uses) use(id, path);
	};

	const use = (id: ts.Identifier, base: string[]) => {
		let node: ts.Node = id;
		const path = [...base];

		for (;;) {
			const parent = node.parent;
			if (ts.isPropertyAccessExpression(parent) && parent.expression === node) {
				path.push(parent.name.text);
			} else if (
				ts.isElementAccessExpression(parent) &&
				parent.expression === node &&
				(ts.isStringLiteral(parent.argumentExpression) || ts.isNumericLiteral(parent.argumentExpression))
			) {
				path.push(parent.argumentExpression.text);
			} else if (ts.isQualifiedName(parent) && parent.left === node) {
				path.push(parent.right.text);
			} else if (
				ts.isIndexedAccessTypeNode(parent) &&
				parent.objectType === node &&
				ts.isLiteralTypeNode(parent.indexType) &&
				(ts.isStringLiteral(parent.indexType.literal) || ts.isNumericLiteral(parent.indexType.literal))
			) {
				path.push(parent.indexType.literal.text);
			} else if (
				!(
					ts.isTypeReferenceNode(parent) ||
					ts.isTypeQueryNode(parent) ||
					ts.isParenthesizedExpression(parent) ||
					ts.isNonNullExpression(parent)
				)
			) {
				break;
			}
			node = parent;
		}

		const parent = node.parent;
		if (ts.isVariableDeclaration(parent) && parent.initializer === node) {
			bind(parent.name, path, parent);
			return;
		}
		marks.push(path);
	};

	const bind = (name: ts.BindingName, path: string[], declaration: ts.Node) => {
		if (ts.isIdentifier(name)) {
			follow(checker.getSymbolAtLocation(name), path, declaration);
			return;
		}
		if (ts.isArrayBindingPattern(name)) {
			marks.push(path);
			return;
		}
		for (const element of name.elements) {
			const key = element.propertyName ?? element.name;
			if (element.dotDotDotToken || !(ts.isIdentifier(key) || ts.isStringLiteral(key) || ts.isNumericLiteral(key))) {
				marks.push(path);
				continue;
			}
			bind(element.name, [...path, key.text], element);
		}
	};

	const bases = [[] as string[], ...parts.map(({ part }) => part.path)];
	source.statements.slice(0, bases.length).forEach((statement, i) => {
		const node = ts.isVariableStatement(statement)
			? statement.declarationList.declarations[0].name
			: (statement as ts.TypeAliasDeclaration).name;
		follow(checker.getSymbolAtLocation(node), bases[i], node.parent, true);
	});

	return marks;
}

/** `value`, with only what the paths reach. A path to a missing key keeps the key, as `undefined`. */
function pick(value: unknown, paths: string[][]): unknown {
	if (paths.some((path) => path.length === 0)) return value;
	if (value === HAIRLINE || !value || typeof value !== "object") return value;

	const groups = new Map<string, string[][]>();
	for (const [key, ...rest] of paths) groups.set(key, [...(groups.get(key) ?? []), rest]);

	const result: Record<string, unknown> = {};
	for (const [key, child] of Object.entries(value)) {
		const rest = groups.get(key);
		if (rest) result[key] = pick(child, rest);
	}
	for (const key of groups.keys()) {
		if (!(key in result)) result[key] = undefined;
	}
	return result;
}

/** Two levels of `value` copied, so the slices can be set on it. */
function clone(value: unknown): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(value as object).map(([key, child]) => [
			key,
			child && typeof child === "object" && child !== HAIRLINE ? { ...child } : child,
		]),
	);
}

/** `tree` with the keys of its first two levels in the order `like` has them. */
function sortLike(tree: Record<string, unknown>, like: unknown): Record<string, unknown> {
	const order = (object: Record<string, unknown>, reference: unknown) => {
		const keys = Object.keys((reference ?? {}) as object);
		return Object.fromEntries(
			Object.entries(object).sort(([a], [b]) => keys.indexOf(a) - keys.indexOf(b)),
		);
	};
	const sorted = order(tree, like);
	for (const [key, child] of Object.entries(sorted)) {
		if (child && typeof child === "object" && !(child instanceof Reference) && child !== HAIRLINE) {
			sorted[key] = order(child as Record<string, unknown>, (like as Record<string, unknown>)[key]);
		}
	}
	return sorted;
}

/** A name printed as is in the resolved theme. */
class Reference {
	constructor(readonly name: string) {}
}

function printValue(value: unknown, indent: string, hairline: () => string): string {
	if (value === HAIRLINE) return hairline();
	if (value instanceof Reference) return value.name;
	if (value === undefined) return "undefined";
	if (value === null || typeof value !== "object") return JSON.stringify(value);

	const inner = indent + "\t";
	if (Array.isArray(value)) {
		if (!value.length) return "[]";
		return `[\n${value.map((entry) => `${inner}${printValue(entry, inner, hairline)},`).join("\n")}\n${indent}]`;
	}
	const entries = Object.entries(value);
	if (!entries.length) return "{}";
	return `{\n${entries
		.map(([key, entry]) =>
			entry instanceof Reference && entry.name === key
				? `${inner}${key},`
				: `${inner}${printKey(key)}: ${printValue(entry, inner, hairline)},`,
		)
		.join("\n")}\n${indent}}`;
}

function printKey(key: string) {
	if (/^[A-Za-z_$][\w$]*$/.test(key)) return key;
	if (/^(0|[1-9]\d*)$/.test(key)) return key;
	return JSON.stringify(key);
}

function accessor(key: string) {
	return /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}

// ─── Output ───────────────────────────────────────────────────────────────────

function printImports(externals: External[], nameOf: (entity: Entity) => string) {
	const rank = (from: string) => (from === "react" ? 0 : from === "react-native" ? 1 : 2);
	const byModule = new Map<string, External[]>();
	for (const entity of externals) {
		byModule.set(entity.from, [...(byModule.get(entity.from) ?? []), entity]);
	}

	return [...byModule]
		.sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
		.flatMap(([from, entities]) => {
			const lines: string[] = [];
			const namespace = entities.find((entity) => entity.imported === "*");
			if (namespace) lines.push(`import * as ${nameOf(namespace)} from "${from}";`);

			const defaultImport = entities.find((entity) => entity.imported === "default");
			const named = entities
				.filter((entity) => entity.imported !== "*" && entity.imported !== "default")
				.sort((a, b) => a.imported.localeCompare(b.imported));
			const typeOnly = !defaultImport && named.length > 0 && named.every((entity) => entity.typeOnly);
			const specifiers = named.map((entity) => {
				const name = nameOf(entity);
				const binding = name === entity.imported ? name : `${entity.imported} as ${name}`;
				return entity.typeOnly && !typeOnly ? `type ${binding}` : binding;
			});

			const head = `import ${typeOnly ? "type " : ""}${defaultImport ? nameOf(defaultImport) : ""}`;
			if (!specifiers.length) {
				if (defaultImport) lines.push(`${head} from "${from}";`);
				return lines;
			}
			const joiner = defaultImport ? ", " : "";
			const inline = `${head}${joiner}{ ${specifiers.join(", ")} } from "${from}";`;
			// Long imports wrap one name per line, the way the registry sources are formatted.
			lines.push(
				inline.length <= 80
					? inline
					: `${head}${joiner}{\n${specifiers.map((specifier) => `\t${specifier},`).join("\n")}\n} from "${from}";`,
			);
			return lines;
		})
		.join("\n");
}

function render(record: Statement, nameOf: (entity: Entity) => string) {
	const source = record.module.source.text;
	const start = record.node.getFullStart();
	const end = record.node.getEnd();
	const edits = [...record.edits].sort((a, b) => a.start - b.start);

	let text = "";
	let cursor = start;
	for (const edit of edits) {
		if (edit.start < cursor) continue;
		text += source.slice(cursor, edit.start);
		if (edit.entity) {
			const name = nameOf(edit.entity);
			text +=
				(edit.before ?? "") +
				(edit.shorthand && edit.shorthand !== name ? `${edit.shorthand}: ${name}` : name);
		} else {
			text += edit.text ?? "";
		}
		cursor = edit.end;
	}
	text += source.slice(cursor, end);

	if (record.addExport) {
		const offset = record.node.getStart() - start;
		text = `${text.slice(0, offset)}export ${text.slice(offset)}`;
	}
	return text;
}

/** Modules in dependency order: a module comes after every module it imports. */
function order(modules: Module[]) {
	const result: Module[] = [];
	const visited = new Set<Module>();
	const visit = (module: Module) => {
		if (visited.has(module)) return;
		visited.add(module);
		for (const dependency of module.imports) visit(dependency);
		result.push(module);
	};
	// Dependencies first, so a top-level value is defined before the requested item uses it.
	for (const module of modules) if (!module.entry) visit(module);
	for (const module of modules) if (module.entry) visit(module);
	return result;
}

// ─── Syntax helpers ───────────────────────────────────────────────────────────

function createProgram(files: Map<string, string>) {
	const options: ts.CompilerOptions = {
		noLib: true,
		noResolve: true,
		types: [],
		jsx: ts.JsxEmit.Preserve,
		target: ts.ScriptTarget.Latest,
	};
	const host = ts.createCompilerHost(options);
	host.getSourceFile = (fileName, languageVersion) => {
		const text = files.get(fileName);
		return text === undefined
			? undefined
			: ts.createSourceFile(
					fileName,
					text,
					languageVersion,
					true,
					fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
				);
	};
	host.fileExists = (fileName) => files.has(fileName);
	host.readFile = (fileName) => files.get(fileName);
	return ts.createProgram([...files.keys()], options, host);
}

/** The names a top-level statement declares, by the node the checker resolves each one to. */
function declarationsOf(statement: ts.Statement): [ts.Node, string][] {
	if (
		(ts.isFunctionDeclaration(statement) ||
			ts.isClassDeclaration(statement) ||
			ts.isTypeAliasDeclaration(statement) ||
			ts.isInterfaceDeclaration(statement) ||
			ts.isEnumDeclaration(statement)) &&
		statement.name
	) {
		return [[statement, statement.name.text]];
	}
	if (ts.isVariableStatement(statement)) {
		const found: [ts.Node, string][] = [];
		const names = (name: ts.BindingName, node: ts.Node) => {
			if (ts.isIdentifier(name)) {
				found.push([node, name.text]);
				return;
			}
			for (const element of name.elements) {
				if (ts.isBindingElement(element)) names(element.name, element);
			}
		};
		for (const declaration of statement.declarationList.declarations) {
			names(declaration.name, declaration);
		}
		return found;
	}
	return [];
}

function isTypeDeclaration(node: ts.Node) {
	return ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node);
}

function hasExport(statement: ts.Statement) {
	return (
		ts.canHaveModifiers(statement) &&
		(ts.getModifiers(statement) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
	);
}

function firstParameter(fn: ts.Node): ts.ParameterDeclaration | undefined {
	if (!ts.isArrowFunction(fn) && !ts.isFunctionExpression(fn)) return undefined;
	return fn.parameters[0];
}

/**
 * Drops a parameter the theme came through; the body now reads the file's `theme`. With
 * `keepArity`, the function still takes an argument, and ignores it.
 */
function removeParameter(param: ts.ParameterDeclaration, edits: Edit[], keepArity: boolean) {
	const params = (param.parent as ts.SignatureDeclaration).parameters;
	const index = params.indexOf(param);
	const last = index === params.length - 1;

	if (keepArity || !last) {
		edits.push({
			start: param.getStart(),
			end: param.getEnd(),
			text: last ? "_theme?: unknown" : "_theme: unknown",
		});
		return;
	}
	if (params.length === 1) {
		// `theme => …` has no parentheses to keep.
		const before = param.getSourceFile().text.slice(0, param.getStart()).trimEnd();
		edits.push({ start: param.getStart(), end: param.getEnd(), text: before.endsWith("(") ? "" : "()" });
		return;
	}
	edits.push({ start: params[index - 1].getEnd(), end: param.getEnd(), text: "" });
}

function removeListElement(element: ts.Node, elements: ts.NodeArray<ts.Node>, edits: Edit[]) {
	const index = elements.indexOf(element);
	if (index < elements.length - 1) {
		edits.push({ start: element.getStart(), end: elements[index + 1].getStart(), text: "" });
	} else {
		edits.push({ start: elements[index - 1].getEnd(), end: element.getEnd(), text: "" });
	}
}

function skipSpaces(text: string, position: number) {
	while (text[position] === " ") position++;
	return position;
}

function isTheme(specifier: string) {
	return specifier === THEME_ALIAS || specifier.startsWith(`${THEME_ALIAS}/`);
}

function pathOf(file: string | { path: string }) {
	return typeof file === "string" ? file : file.path;
}

function normalize(path: string) {
	return path.replace(/\\/g, "/");
}

function stripExtension(path: string) {
	const extension = extname(path);
	return [".ts", ".tsx", ".js", ".jsx"].includes(extension)
		? path.slice(0, -extension.length)
		: path;
}

const camelCase = (name: string) =>
	name.replace(/[-/.@]+([a-z0-9])/gi, (_, char: string) => char.toUpperCase());

/** `styles` from `text` → `textStyles`; `Root` from `badge` → `BadgeRoot`. */
function prefixed(owner: string, name: string) {
	const prefix = camelCase(owner.replace(/^@/, ""));
	const capital = name[0] === name[0].toUpperCase() && name[0] !== name[0].toLowerCase();
	const head = capital ? prefix[0].toUpperCase() + prefix.slice(1) : prefix;
	return head + name[0].toUpperCase() + name.slice(1);
}
