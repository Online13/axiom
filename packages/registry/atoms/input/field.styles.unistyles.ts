import { StyleSheet } from "react-native-unistyles";

import type { FieldProps } from "./field";

export function useFieldStyles() {
	return {
		field: ({ style }: Pick<FieldProps, "style">) => ({
			style: [styles.field, style],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	field: {
		gap: theme.tokens.spacing[2],
	},
}));
