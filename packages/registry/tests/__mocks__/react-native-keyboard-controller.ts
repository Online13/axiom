// The mock react-native-keyboard-controller ships: views render as plain views, the keyboard never shows.
// @ts-ignore: CommonJS replaces the whole module, which Jest needs; not every demo loads Node's types.
module.exports = jest.requireActual("react-native-keyboard-controller/jest");
