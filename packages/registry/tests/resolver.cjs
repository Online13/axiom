/* global __dirname */
// Resolves the packages a test imports from the demo running it, as that demo's own code does.
// A demo can have its own copy of a package (expo-router, expo…) next to the hoisted one: without
// this, a test would get a second instance, with its own React contexts.
const path = require("path");

// Wrapped rather than replaced: it keeps worklets on their non-native files in Jest.
const resolveWorklets = require("react-native-worklets/jest/resolver.js");

module.exports = (request, options) => {
	const fromTests = options.basedir.startsWith(__dirname);
	const isPackage = !request.startsWith(".") && !path.isAbsolute(request);
	return resolveWorklets(
		request,
		fromTests && isPackage ? { ...options, basedir: options.rootDir } : options,
	);
};
