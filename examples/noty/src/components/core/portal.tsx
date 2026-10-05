import type { ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import {
	Portal as TeleportPortal,
	PortalHost as TeleportPortalHost,
	PortalProvider,
	usePortal as useTeleportPortal,
} from "react-native-teleport";

// Thin wrapper around react-native-teleport. Components import this file, never the library,
// so replacing it only touches this file.

export const DEFAULT_HOST = "root";

export { PortalProvider };

export type PortalHostProps = {
	name?: string;
	style?: StyleProp<ViewStyle>;
};

/** Fills the screen and lets touches through where it has no content. */
export function PortalHost({ name = DEFAULT_HOST, style }: PortalHostProps) {
	return <TeleportPortalHost name={name} style={[styles.host, style]} />;
}

export type PortalProps = {
	/** Target host. Unlike the library, content goes to `root` by default instead of rendering in place. */
	hostName?: string;
	name?: string;
	children?: ReactNode;
};

export function Portal({
	hostName = DEFAULT_HOST,
	name,
	children,
}: PortalProps) {
	return (
		<TeleportPortal
			hostName={hostName}
			name={name}
			style={styles.passThrough}
		>
			{children}
		</TeleportPortal>
	);
}

export function usePortal(hostName: string = DEFAULT_HOST) {
	return useTeleportPortal(hostName);
}

// Host and portal fill the screen: only their content catches touches.
const styles = StyleSheet.create({
	host: {
		...StyleSheet.absoluteFill,
		pointerEvents: "box-none",
	},
	passThrough: {
		pointerEvents: "box-none",
	},
});
