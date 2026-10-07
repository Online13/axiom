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
		default: "hsla(0, 0%, 100%, 1)",
		subtle: palette.gray[50],
		elevated: "hsla(0, 0%, 100%, 1)",
		inverse: palette.gray[950],
	},
	content: {
		default: palette.gray[950],
		muted: palette.gray[600],
		subtle: palette.gray[400],
		disabled: palette.gray[300],
		inverse: "hsla(0, 0%, 100%, 1)",
		link: palette.blue[500],
	},
	border: {
		default: palette.gray[200],
		subtle: palette.gray[100],
		strong: palette.gray[400],
		focus: palette.blue[500],
	},
	// Primary defaults to the neutral ramp, so actions stay black on white. Point it at another
	// hue to give the actions a brand color.
	primary: {
		default: palette.gray[950],
		pressed: palette.gray[600],
		subtle: palette.gray[100],
		on: "hsla(0, 0%, 100%, 1)",
	},
	highlight: {
		default: palette.yellow[500],
		subtle: palette.yellow[100],
		on: palette.gray[950],
	},
	feedback: {
		info: palette.blue[500],
		infoSubtle: palette.blue[50],
		success: palette.green[500],
		successSubtle: palette.green[50],
		warning: palette.orange[500],
		warningSubtle: palette.orange[50],
		error: palette.red[500],
		errorSubtle: palette.red[50],
	},
} satisfies ThemeColors;

// Feedback and link colors use step 400 instead of 500 to stay readable on dark surfaces.
export const darkColors = {
	background: {
		default: "hsla(0, 0%, 0%, 1)",
		subtle: palette.gray[950],
		elevated: palette.gray[900],
		inverse: palette.gray[50],
	},
	content: {
		default: palette.gray[50],
		muted: palette.gray[400],
		subtle: palette.gray[600],
		disabled: palette.gray[700],
		inverse: palette.gray[950],
		link: palette.blue[400],
	},
	border: {
		default: palette.gray[800],
		subtle: palette.gray[900],
		strong: palette.gray[600],
		focus: palette.blue[400],
	},
	primary: {
		default: palette.gray[50],
		pressed: palette.gray[400],
		subtle: palette.gray[900],
		on: palette.gray[950],
	},
	// The highlight keeps step 500 in both schemes: yellow is already light enough to carry black text.
	highlight: {
		default: palette.yellow[500],
		subtle: palette.yellow[950],
		on: palette.gray[950],
	},
	feedback: {
		info: palette.blue[400],
		infoSubtle: palette.blue[950],
		success: palette.green[400],
		successSubtle: palette.green[950],
		warning: palette.orange[400],
		warningSubtle: palette.orange[950],
		error: palette.red[400],
		errorSubtle: palette.red[950],
	},
} satisfies ThemeColors;
