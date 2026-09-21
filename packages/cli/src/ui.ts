import * as clack from "@clack/prompts";
import type {
	ConfirmOptions,
	SelectOptions,
	TextOptions,
} from "@clack/prompts";
import pc from "picocolors";

/**
 * The Axiom terminal style, over @clack/prompts. Everything the CLI prints or asks goes through
 * here, so the palette stays where it is decided: neutral by default, one accent, and colour only
 * where it carries meaning — green for what succeeded, yellow for what needs attention, red for
 * what failed.
 */

/** The single Axiom accent. Names, values and commands the user is meant to notice. */
export const accent = pc.cyan;
/** Secondary text: paths, counts, hints. */
export const muted = pc.dim;
export const success = pc.green;
export const warn = pc.yellow;
export const error = pc.red;
export const bold = pc.bold;

/** Clack's own levels: `info`, `success`, `step`, `warn`, `error`, `message`. */
export const log = clack.log;
export const note = clack.note;

export function intro(title: string) {
	clack.intro(`${accent("◼")} ${bold(title)}`);
}

export function outro(message: string) {
	clack.outro(message);
}

/** Ends the command on an error: the last line, red, with nothing after it. */
export function cancel(message: string) {
	clack.cancel(message);
}

export const isInteractive = () =>
	Boolean(process.stdin.isTTY && process.stdout.isTTY);

/**
 * Ends the command on Ctrl+C. A prompt that was cancelled leaves the project half set up, so no
 * caller gets a value back: they all stop here.
 */
function orCancel<T>(value: T): Exclude<T, symbol> {
	if (clack.isCancel(value)) {
		clack.cancel("Cancelled.");
		process.exit(0);
	}
	return value as Exclude<T, symbol>;
}

export async function text(options: TextOptions): Promise<string> {
	return orCancel(await clack.text(options));
}

export async function select<T>(options: SelectOptions<T>): Promise<T> {
	return orCancel(await clack.select(options));
}

export async function confirm(options: ConfirmOptions): Promise<boolean> {
	return orCancel(await clack.confirm(options));
}

/** Runs `fn` under a spinner, and leaves `stop` behind once it is done. */
export async function task<T>(
	start: string,
	fn: () => T | Promise<T>,
	stop: (result: T) => string = () => start,
): Promise<T> {
	const s = clack.spinner();
	s.start(start);
	try {
		const result = await fn();
		s.stop(stop(result));
		return result;
	} catch (failure) {
		s.error(start);
		throw failure;
	}
}
