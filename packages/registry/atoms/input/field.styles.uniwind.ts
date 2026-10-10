import { cx } from "@/theme";

import type { FieldProps } from "./field";

export function useFieldStyles() {
	return {
		field: ({ className }: Pick<FieldProps, "className">) => ({
			className: cx("gap-2", className),
		}),
	};
}
