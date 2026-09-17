import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { DEFAULT_ALIASES, ICON_SOURCES, STYLINGS, type ProjectConfig } from './types.ts';

export const CONFIG_FILE = 'axiom.json';

export function readConfig(cwd: string): ProjectConfig {
  const file = join(cwd, CONFIG_FILE);
  if (!existsSync(file)) {
    throw new Error(`No ${CONFIG_FILE} in ${cwd}.`);
  }

  const raw = JSON.parse(readFileSync(file, 'utf8')) as Partial<ProjectConfig>;
  if (!raw.styling || !STYLINGS.includes(raw.styling)) {
    throw new Error(`${CONFIG_FILE}: "styling" must be one of ${STYLINGS.join(', ')}.`);
  }

  if (raw.icons !== undefined && !ICON_SOURCES.includes(raw.icons)) {
    throw new Error(`${CONFIG_FILE}: "icons" must be one of ${ICON_SOURCES.join(', ')}.`);
  }

  return {
    ...(raw.$schema ? { $schema: raw.$schema } : {}),
    styling: raw.styling,
    ...(raw.icons ? { icons: raw.icons } : {}),
    aliases: { ...DEFAULT_ALIASES, ...raw.aliases },
    items: raw.items ?? [],
  };
}

export function writeConfig(cwd: string, config: ProjectConfig) {
  // Always the same key order, whatever order the keys were set in.
  const { $schema, styling, icons, aliases, items } = config;
  const ordered = { $schema, styling, icons, aliases, items };
  writeFileSync(join(cwd, CONFIG_FILE), JSON.stringify(ordered, null, 2) + '\n');
}

/**
 * Maps an import alias (`@/components/ui`) to a folder on disk, using the
 * `paths` of the project's tsconfig.json (`"@/*": ["./src/*"]`).
 */
export function aliasToDir(cwd: string, alias: string): string {
  const tsconfig = join(cwd, 'tsconfig.json');
  const paths: Record<string, string[]> = existsSync(tsconfig)
    ? (JSON.parse(readFileSync(tsconfig, 'utf8')).compilerOptions?.paths ?? {})
    : {};

  const match = Object.entries(paths)
    .filter(([key]) => key.endsWith('/*') && alias.startsWith(key.slice(0, -1)))
    .sort(([a], [b]) => b.length - a.length)[0];

  if (!match) {
    throw new Error(`Alias "${alias}" doesn't match any "paths" entry in ${tsconfig}.`);
  }

  const [key, [target]] = match;
  return resolve(cwd, target.slice(0, -1) + alias.slice(key.length - 1));
}

export function hasDependency(cwd: string, name: string): boolean {
  const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
  return name in { ...pkg.dependencies, ...pkg.devDependencies };
}

export function missingDependencies(cwd: string, dependencies: string[]): string[] {
  const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
  const installed = { ...pkg.dependencies, ...pkg.devDependencies };
  return dependencies.filter((name) => !(name in installed));
}
