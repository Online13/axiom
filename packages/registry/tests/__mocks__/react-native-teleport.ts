// The mock react-native-teleport ships: `Portal` renders its content in place, so what a sheet or a
// menu shows is found in the tree like any other element.
// @ts-ignore: CommonJS replaces the whole module, which Jest needs; not every demo loads Node's types.
module.exports = jest.requireActual("react-native-teleport/jest");
