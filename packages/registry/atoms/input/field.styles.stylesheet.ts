import { useTheme } from "@/theme";

import type { FieldProps } from "./field";

export function useFieldStyles() {
	const { tokens } = useTheme();

	return {
		field: ({ style }: Pick<FieldProps, "style">) => ({
			style: [{ gap: tokens.spacing[2] }, style],
		}),
	};
}
