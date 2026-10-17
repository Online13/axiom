// The mock react-native-safe-area-context ships: insets are 0, unless a test renders inside a
// `SafeAreaProvider` with `initialMetrics` (see utils/safe-area.tsx).
// @ts-ignore: CommonJS replaces the whole module, which Jest needs; not every demo loads Node's types.
module.exports = jest.requireActual("react-native-safe-area-context/jest/mock").default;
