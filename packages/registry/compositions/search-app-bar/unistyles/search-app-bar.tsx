import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { AppBar } from "@/components/ui/app-bar";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import type { IconName } from "@/components/ui/icons";
import { SearchBar, type SearchBarProps } from "@/components/ui/search-bar";

export type AppBarAction = {
	icon: IconName;
	/** Read by screen readers: "Filters". */
	label: string;
	onPress: () => void;
	/** A number shows a counter on the icon, `true` a dot. */
	badge?: number | boolean;
};

export type SearchAppBarProps = Omit<
	SearchBarProps,
	"showCancel" | "cancelLabel" | "onCancel" | "size" | "containerStyle"
> & {
	/** `back` shows an arrow, `close` a cross, for a search opened as a modal. */
	navigation?: "back" | "close";
	/** Shows the navigation button. */
	onNavigate?: () => void;
	navigationLabel?: string;
	/** Up to two buttons after the field: filters, scan. */
	actions?: AppBarAction[];
	/** Hairline under the bar. */
	bordered?: boolean;
	/** Adds the top safe-area inset. `false` when Scaffold already owns it. */
	safeArea?: boolean;
	barStyle?: StyleProp<ViewStyle>;
};

export function SearchAppBar({
	navigation = "back",
	onNavigate,
	navigationLabel = navigation === "back" ? "Back" : "Close",
	actions,
	bordered = true,
	safeArea = true,
	barStyle,
	variant = "filled",
	...searchProps
}: SearchAppBarProps) {
	return (
		<AppBar bordered={bordered} safeArea={safeArea} style={barStyle}>
			{onNavigate ? (
				<AppBar.Leading>
					<IconButton
						icon={navigation === "back" ? "arrow-left" : "close"}
						onPress={onNavigate}
						accessibilityLabel={navigationLabel}
					/>
				</AppBar.Leading>
			) : null}
			<AppBar.Title>
				<View
					style={[styles.field, !onNavigate && styles.inset]}
				>
					<SearchBar
						{...searchProps}
						variant={variant}
						size="sm"
						showCancel={false}
					/>
				</View>
			</AppBar.Title>
			{actions?.length ? (
				<AppBar.Actions>
					{actions.slice(0, 2).map((action, index) => (
						<ActionButton key={index} action={action} />
					))}
				</AppBar.Actions>
			) : null}
		</AppBar>
	);
}

function ActionButton({ action }: { action: AppBarAction }) {
	const button = (
		<IconButton
			icon={action.icon}
			onPress={action.onPress}
			accessibilityLabel={
				typeof action.badge === "number" && action.badge > 0
					? `${action.label}, ${action.badge}`
					: action.label
			}
		/>
	);
	if (!action.badge) return button;
	return (
		<Badge.Anchor
			badge={
				action.badge === true ? <Badge dot /> : <Badge count={action.badge} />
			}
		>
			{button}
		</Badge.Anchor>
	);
}

const styles = StyleSheet.create((theme) => ({
	field: {
		alignSelf: "stretch",
		justifyContent: "center",
	},
	inset: {
		paddingHorizontal: theme.tokens.spacing[3],
	},
}));
