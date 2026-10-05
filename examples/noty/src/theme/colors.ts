// Noty — generated with the Axiom theme builder.
import { palette } from "@/theme/tokens";

// Semantic colors: each role points to a palette step. The roles stay the same in both themes,
// only the step changes.

export type ThemeColors = {
	background: {
		default: string;
		subtle: string;
		elevated: string;
		inverse: string;
	};
	content: {
		default: string;
		muted: string;
		subtle: string;
		disabled: string;
		inverse: string;
		link: string;
	};
	border: {
		default: string;
		subtle: string;
		strong: string;
		focus: string;
	};
	/** The main action color: solid buttons, selected chips and tabs, checked controls. */
	primary: {
		default: string;
		pressed: string;
		subtle: string;
		/** Text and icons on a `default` fill. */
		on: string;
	};
	/** The brand highlight. Always a filled surface with `on` as its text, never text on a light surface. */
	highlight: {
		default: string;
		subtle: string;
		on: string;
	};
	feedback: {
		info: string;
		infoSubtle: string;
		success: string;
		successSubtle: string;
		warning: string;
		warningSubtle: string;
		error: string;
		errorSubtle: string;
	};
};

export const lightColors = {
	background: {
		default: "hsla(0, 0%, 97%, 1)",
		subtle: "hsla(240, 9%, 94%, 1)",
		elevated: "hsla(0, 0%, 100%, 1)",
		inverse: "hsla(210, 11%, 11%, 1)",
	},
	content: {
		default: "hsla(210, 11%, 11%, 1)",
		muted: "hsla(240, 1%, 45%, 1)",
		subtle: "hsla(208, 8%, 66%, 1)",
		disabled: "hsla(206, 6%, 79%, 1)",
		inverse: "hsla(0, 0%, 97%, 1)",
		link: "hsla(210, 100%, 46%, 1)",
	},
	border: {
		default: "hsla(240, 9%, 90%, 1)",
		subtle: "hsla(240, 6%, 93%, 1)",
		strong: "hsla(208, 8%, 66%, 1)",
		focus: "hsla(210, 100%, 46%, 1)",
	},
	primary: {
		default: "hsla(210, 100%, 46%, 1)",
		pressed: "hsla(210, 94%, 37%, 1)",
		subtle: "hsla(210, 66%, 89%, 1)",
		on: "hsla(0, 0%, 4%, 1)",
	},
	highlight: {
		default: "hsla(237, 87%, 73%, 1)",
		subtle: "hsla(237, 54%, 93%, 1)",
		on: "hsla(0, 0%, 4%, 1)",
	},
	feedback: {
		info: "hsla(210, 100%, 46%, 1)",
		infoSubtle: "hsla(210, 66%, 89%, 1)",
		success: "hsla(165, 100%, 33%, 1)",
		successSubtle: "hsla(167, 39%, 86%, 1)",
		warning: "hsla(32, 100%, 46%, 1)",
		warningSubtle: "hsla(33, 66%, 89%, 1)",
		error: "hsla(355, 74%, 56%, 1)",
		errorSubtle: "hsla(356, 55%, 90%, 1)",
	},
} satisfies ThemeColors;

// Feedback and link colors use step 400 instead of 500 to stay readable on dark surfaces.
export const darkColors = {
	background: {
		default: "hsla(0, 0%, 97%, 1)",
		subtle: "hsla(240, 9%, 94%, 1)",
		elevated: "hsla(0, 0%, 100%, 1)",
		inverse: "hsla(210, 11%, 11%, 1)",
	},
	content: {
		default: "hsla(210, 11%, 11%, 1)",
		muted: "hsla(240, 1%, 45%, 1)",
		subtle: "hsla(208, 8%, 66%, 1)",
		disabled: "hsla(206, 6%, 79%, 1)",
		inverse: "hsla(0, 0%, 97%, 1)",
		link: "hsla(210, 100%, 46%, 1)",
	},
	border: {
		default: "hsla(240, 9%, 90%, 1)",
		subtle: "hsla(240, 6%, 93%, 1)",
		strong: "hsla(208, 8%, 66%, 1)",
		focus: "hsla(210, 100%, 46%, 1)",
	},
	primary: {
		default: "hsla(210, 100%, 46%, 1)",
		pressed: "hsla(210, 94%, 37%, 1)",
		subtle: "hsla(210, 66%, 89%, 1)",
		on: "hsla(0, 0%, 4%, 1)",
	},
	highlight: {
		default: "hsla(237, 87%, 73%, 1)",
		subtle: "hsla(237, 54%, 93%, 1)",
		on: "hsla(0, 0%, 4%, 1)",
	},
	feedback: {
		info: "hsla(210, 100%, 46%, 1)",
		infoSubtle: "hsla(210, 66%, 89%, 1)",
		success: "hsla(165, 100%, 33%, 1)",
		successSubtle: "hsla(167, 39%, 86%, 1)",
		warning: "hsla(32, 100%, 46%, 1)",
		warningSubtle: "hsla(33, 66%, 89%, 1)",
		error: "hsla(355, 74%, 56%, 1)",
		errorSubtle: "hsla(356, 55%, 90%, 1)",
	},
} satisfies ThemeColors;
