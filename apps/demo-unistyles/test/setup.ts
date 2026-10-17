// Runs after the shared setup (packages/registry/tests/setup.ts): Unistyles is native too.
import "react-native-unistyles/mocks";

// The themes, registered after the Unistyles mocks as the app's index.ts does at startup.
import "@/theme/unistyles";
