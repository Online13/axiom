import Constants from "expo-constants";
import { Platform, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon";
import { Scaffold } from "@/components/ui/scaffold";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { EXPERIENCES } from "@/demo/experiences";
import { SCREENS } from "@/demo/screens";
import { useTheme } from "@/theme";

// Both Tailwind demos share these sources: the app's slug tells which binding styles this one.
const STYLING =
	Constants.expoConfig?.slug === "demo-uniwind" ? "Uniwind" : "NativeWind";
const OTHER_TAILWIND = STYLING === "Uniwind" ? "NativeWind" : "Uniwind";

const LEVELS: { icon: IconName; title: string; description: string }[] = [
	{
		icon: "file",
		title: "Components",
		description:
			"Primitives, compositions and blocks, owned by your app once installed.",
	},
	{
		icon: "refresh",
		title: "Behaviors",
		description:
			"Interaction logic: scroll, gestures and the bars that react to them.",
	},
	{
		icon: "favorite",
		title: "Patterns",
		description:
			"Complete flows such as verifying a code, searching or undoing an action.",
	},
];

export default function AboutScreen() {
	const { tokens, colors } = useTheme();
	const version = Constants.expoConfig?.version ?? "1.0.0";

	return (
		<Scaffold background="subtle" safeAreaEdges={["top"]}>
			<Scaffold.Content
				contentContainerStyle={{
					padding: tokens.metrics.screenMargin,
					paddingBottom: tokens.spacing[12] * 3,
					gap: tokens.spacing[6],
				}}
			>
				<Card variant="outlined" padding={4}>
					<View style={{ gap: tokens.spacing[2] }}>
						<Title variant="headingSm">Axiom</Title>
						<Text color="muted">
							An open source system for building mobile experiences with
							React Native and Expo. You install the source of a
							component in your app, so nothing stands between you and
							the code you ship.
						</Text>
					</View>
				</Card>

				<View style={{ gap: tokens.spacing[3] }}>
					<Text variant="footnote" color="muted" weight="semibold">
						WHAT IT COVERS
					</Text>
					<Card variant="outlined" padding={4}>
						<View style={{ gap: tokens.spacing[4] }}>
							{LEVELS.map((level, index) => (
								<View
									key={level.title}
									style={{ gap: tokens.spacing[4] }}
								>
									{index > 0 ? <Separator /> : null}
									<View
										className="flex-row"
										style={{ gap: tokens.spacing[3] }}
									>
										<View
											className="w-[36px] h-[36px] items-center justify-center"
											style={{
												borderRadius: tokens.radius.full,
												backgroundColor: colors.background.subtle,
											}}
										>
											<Icon
												name={level.icon}
												size="sm"
												color="muted"
											/>
										</View>
										<View className="flex-1 gap-[2px]">
											<Text weight="semibold">{level.title}</Text>
											<Text variant="bodySm" color="muted">
												{level.description}
											</Text>
										</View>
									</View>
								</View>
							))}
						</View>
					</Card>
				</View>

				<View style={{ gap: tokens.spacing[3] }}>
					<Text variant="footnote" color="muted" weight="semibold">
						THIS DEMO
					</Text>
					<Card variant="outlined" padding={4}>
						<View style={{ gap: tokens.spacing[3] }}>
							<Text variant="bodySm" color="muted">
								Every screen here is built with the components of the
								registry, including this app&apos;s own bars and tabs.
								Styling comes from the Tailwind variant through{" "}
								{STYLING}; the same demo exists for StyleSheet,
								Unistyles and {OTHER_TAILWIND}.
							</Text>
							<Separator />
							<Fact label="Components" value={`${SCREENS.length}`} />
							<Fact
								label="Experiences"
								value={`${EXPERIENCES.length}`}
							/>
							<Fact label="Styling" value={STYLING} />
							<Fact
								label="Platform"
								value={`${Platform.OS} · Expo SDK ${Constants.expoConfig?.sdkVersion ?? "57"}`}
							/>
							<Fact label="Version" value={version} />
						</View>
					</Card>
					<Text variant="footnote" color="muted">
						The floating button switches the theme, so any screen can be
						read in light and dark.
					</Text>
				</View>
			</Scaffold.Content>
		</Scaffold>
	);
}

function Fact({ label, value }: { label: string; value: string }) {
	const { tokens } = useTheme();

	return (
		<View
			className="flex-row justify-between"
			style={{ gap: tokens.spacing[3] }}
		>
			<Text variant="bodySm" color="muted">
				{label}
			</Text>
			<Text variant="bodySm" weight="medium">
				{value}
			</Text>
		</View>
	);
}
