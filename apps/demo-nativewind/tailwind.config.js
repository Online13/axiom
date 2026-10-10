/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [
		require("nativewind/preset"),
		// The Axiom theme: colors, radius, sizes and typography as Tailwind names.
		require("./src/theme/nativewind-preset"),
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
