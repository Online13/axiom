export function useProfileAppBarStyles() {
	return {
		// The pressable hugs the avatar and the name instead of stretching across the row.
		start: { className: "items-start" },
		identity: { className: "flex-row items-center gap-2" },
		shrink: { className: "shrink" },
		pressable: { className: "shrink active:opacity-60" },
	};
}
