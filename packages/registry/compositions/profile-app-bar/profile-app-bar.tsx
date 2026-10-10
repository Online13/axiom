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

import { useProfileAppBarStyles } from "./profile-app-bar.styles";

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
	const styles = useProfileAppBarStyles();

	const identity = (
		<View {...styles.identity}>
			<Avatar source={avatar} name={name} size="sm" colorFromName />
			<View {...styles.shrink}>
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
				{/* No leading control: the avatar lines up with the screen margin. */}
				<AppBar.Center inset {...styles.start}>
					{onProfilePress ? (
						<Tappable
							onPress={onProfilePress}
							accessibilityRole="button"
							accessibilityLabel={`${profileLabel}, ${name}`}
							{...styles.pressable}
						>
							{identity}
						</Tappable>
					) : (
						<View
							accessible
							accessibilityLabel={
								greeting ? `${greeting}, ${name}` : name
							}
							{...styles.shrink}
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
