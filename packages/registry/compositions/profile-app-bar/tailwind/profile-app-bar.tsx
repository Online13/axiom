import type { ReactNode } from "react";
import {
	View,
	type ImageSourcePropType,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Tappable } from "@/components/core/tappable";
import { AppBar } from "@/components/ui/app-bar";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { useTheme } from "@/theme";

export type ProfileAppBarProps = {
	/** The signed-in user. Gives the avatar its initials when there is no photo. */
	name: string;
	avatar?: ImageSourcePropType;
	/** Small line above the name: "Good morning". */
	greeting?: string;
	/** Makes the avatar and the name pressable, to open the profile or the account switcher. */
	onProfilePress?: () => void;
	profileLabel?: string;
	/** Buttons at the end, such as notifications or a menu. Rendered as written, however many. */
	children?: ReactNode;
	/** Hairline under the bar. */
	bordered?: boolean;
	/** Adds the top safe-area inset. `false` when Scaffold already owns it. */
	safeArea?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function ProfileAppBar({
	name,
	avatar,
	greeting,
	onProfilePress,
	profileLabel = "Profile",
	children,
	bordered = false,
	safeArea = true,
	style,
}: ProfileAppBarProps) {
	const { tokens } = useTheme();

	const identity = (
		<View className="flex-row items-center" style={{ gap: tokens.spacing[2] }}>
			<Avatar source={avatar} name={name} size="sm" colorFromName />
			<View className="shrink">
				{greeting ? (
					<Text variant="caption" color="muted" numberOfLines={1}>
						{greeting}
					</Text>
				) : null}
				<Title variant="subheading" numberOfLines={1}>
					{name}
				</Title>
			</View>
		</View>
	);

	return (
		<AppBar bordered={bordered} safeArea={safeArea} style={style}>
			<AppBar.Row>
				{/* No leading control: the avatar lines up with the screen margin. The pressable hugs
				    the avatar and the name instead of stretching across the row. */}
				<AppBar.Center inset style={{ alignItems: "flex-start" }}>
					{onProfilePress ? (
						<Tappable
							onPress={onProfilePress}
							accessibilityRole="button"
							accessibilityLabel={`${profileLabel}, ${name}`}
							style={({ pressed }) => ({
								flexShrink: 1,
								opacity: pressed ? 0.6 : 1,
							})}
						>
							{identity}
						</Tappable>
					) : (
						<View
							accessible
							accessibilityLabel={
								greeting ? `${greeting}, ${name}` : name
							}
							className="shrink"
						>
							{identity}
						</View>
					)}
				</AppBar.Center>
				{children}
			</AppBar.Row>
		</AppBar>
	);
}
