#!/usr/bin/env node
import { watch } from 'node:fs';
import { join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';

import { copyItems, type CopyOptions, type OverwriteAnswer } from './copy.ts';
import { askIconSource, missingIcons, parseIconSource } from './icons.ts';
import { aliasToDir, missingDependencies, readConfig, writeConfig } from './project.ts';
import { readRegistry, resolveItems } from './registry.ts';
import { COMPONENTS_FILE, projectTokenEntries, registerTokens, syncTokens } from './tokens.ts';

const USAGE = `Usage: axiom add [items...] --registry <path> [--icons <source>] [--overwrite] [--watch] [--cwd <path>]

Copies items and their internal dependencies into the project, using the
styling and aliases of its axiom.json. Without items, copies again every item
already listed in axiom.json.

Existing files:
  - an item you name that differs from the registry asks before being overwritten;
  - a dependency already in the project is kept as it is;
  - a file the project owns once created (like the icon registry) is never overwritten.

Icons:
  The first item that needs icons asks where they come from, and saves the
  answer as "icons" in axiom.json: expo-symbols (Expo projects) or custom.

Options:
  --registry <path>  Registry folder (the one holding registry.json)
  --icons <source>   Icon source, when axiom.json has none: expo-symbols or custom
  --overwrite        Overwrite the items you name without asking
  --watch            Copy again whenever a registry file changes. Overwrites
                     dependencies too: use it on a project that mirrors the registry
  --cwd <path>       Project root (default: current folder)`;

async function confirmOverwrite(path: string): Promise<OverwriteAnswer> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    for (;;) {
      const answer = (await rl.question(`  ${path} differs from the registry. Overwrite? [y]es [n]o [a]ll [N]one `)).trim();
      if (answer === 'y') return 'yes';
      if (answer === 'n' || answer === '') return 'no';
      if (answer === 'a') return 'all';
      if (answer === 'N') return 'none';
    }
  } finally {
    rl.close();
  }
}

async function run(
  names: string[],
  registryRoot: string,
  cwd: string,
  overwrite: CopyOptions['overwrite'],
  iconsFlag?: string,
) {
  const registry = readRegistry(registryRoot);
  let config = readConfig(cwd);

  const requested = names.length ? names : config.items;
  const items = resolveItems(registry, requested);
  const interactive = process.stdin.isTTY && process.stdout.isTTY;

  if (items.some((item) => item.iconSources) && !config.icons) {
    if (iconsFlag) config = { ...config, icons: parseIconSource(iconsFlag, cwd) };
    else if (interactive) config = { ...config, icons: await askIconSource(cwd) };
    else throw new Error('Choose where icons come from: pass --icons expo-symbols or --icons custom.');
  }

  const all = new Set([...config.items, ...items.map((item) => item.name)]);
  const projectItems = resolveItems(registry, [...all]);

  // The theme's components.ts is compared with its tokens registered, so copying the theme again
  // doesn't drop them, and an unchanged file isn't rewritten in watch mode.
  const componentsFile = join(aliasToDir(cwd, config.aliases.theme), COMPONENTS_FILE);

  // Without a terminal, there is nobody to ask: differing files are kept.
  const result = await copyItems(items, config, registryRoot, cwd, {
    requested: new Set(requested),
    overwrite,
    confirm: interactive ? confirmOverwrite : undefined,
    // Read when the file is reached: tokens files copied earlier in this run are on disk by then.
    transform: (destination, content) =>
      destination === componentsFile
        ? registerTokens(content, projectTokenEntries(projectItems, config.aliases, cwd))
        : content,
  });

  writeConfig(cwd, { ...config, items: [...all].sort() });

  // When the theme was already in the project, register the new components in it.
  const tokensFile = syncTokens(projectItems, config.aliases, cwd);

  for (const path of result.written) console.log(`  wrote ${path}`);
  if (tokensFile) console.log(`  registered component tokens in ${tokensFile}`);

  const declined = result.kept.filter((file) => file.reason === 'declined');
  if (declined.length) {
    const hint = interactive ? '' : ' Run in a terminal to be asked, or pass --overwrite.';
    console.log(`\nKept your version of ${declined.map((file) => file.path).join(', ')}.${hint}`);
  }

  const icons = missingIcons(items, projectItems, config, cwd);
  if (icons) {
    console.log(`\nAdd these icons to ${icons.file}:`);
    for (const [name, users] of icons.missing) console.log(`  ${name.padEnd(16)} used by ${users.join(', ')}`);
  }

  const missing = missingDependencies(cwd, result.dependencies);
  if (missing.length) {
    console.log(`\nMissing dependencies. Install them with:\n  bun expo install ${missing.join(' ')}`);
  }

  return result;
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      registry: { type: 'string' },
      icons: { type: 'string' },
      overwrite: { type: 'boolean', default: false },
      watch: { type: 'boolean', default: false },
      cwd: { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  const [command, ...names] = positionals;
  if (values.help || command !== 'add') {
    console.log(USAGE);
    process.exit(values.help ? 0 : 1);
  }

  // No hosted registry yet: the path is required.
  if (!values.registry) {
    console.error('--registry is required for now.\n\n' + USAGE);
    process.exit(1);
  }

  const registryRoot = resolve(values.registry);
  const cwd = resolve(values.cwd ?? process.cwd());
  const overwrite = values.watch ? 'force' : values.overwrite ? 'always' : 'ask';

  const result = await run(names, registryRoot, cwd, overwrite, values.icons);
  console.log(`\n${result.written.length} written, ${result.unchanged.length} unchanged, ${result.kept.length} kept.`);

  if (!values.watch) return;

  console.log(`\nWatching ${registryRoot}…`);
  let timer: ReturnType<typeof setTimeout> | undefined;
  watch(registryRoot, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Re-read axiom.json each time so items added meanwhile are kept in sync.
      run([], registryRoot, cwd, 'force').catch((error: Error) => console.error(`  ${error.message}`));
    }, 100);
  });
}

main().catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});
