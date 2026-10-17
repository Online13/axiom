import { router, type Href } from "expo-router";
import { useState, type ReactNode } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { StatsCardSparkline } from "@/components/compositions/stats-card-sparkline";
import { Tappable } from "@/components/core/tappable";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon, type IconName } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Scaffold } from "@/components/ui/scaffold";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Title } from "@/components/ui/title";
import { toast } from "@/components/ui/toast";
import { useTheme } from "@/theme";

type Period = "1W" | "1M" | "1Y";

const BALANCE: Record<Period, { change: string; data: number[] }> = {
	"1W": { change: "+2.1%", data: [21, 22, 21.5, 23, 22.6, 23.8, 24.5] },
	"1M": { change: "+6.4%", data: [19, 20.5, 20, 21.8, 21, 22.9, 23.4, 24.5] },
	"1Y": {
		change: "+18.9%",
		data: [12, 14, 13.2, 16, 17.5, 16.8, 20, 22, 24.5],
	},
};

const TRANSACTIONS = [
	{
		name: "Northwind Studio",
		note: "Salary",
		amount: "+$4,200.00",
		income: true,
	},
	{
		name: "Green Market",
		note: "Groceries",
		amount: "−$82.45",
		income: false,
	},
];

type Category = {
	label: string;
	icon: IconName;
	href: string;
	preview: () => ReactNode;
};

const CATEGORIES: Category[] = [
	{
		label: "Actions",
		icon: "tap",
		href: "/button",
		preview: () => <Button size="sm">Continue</Button>,
	},
	{
		label: "Forms",
		icon: "form",
		href: "/input",
		preview: () => <Input size="sm" value="maya@mail.com" />,
	},
	{
		label: "Overlays",
		icon: "layers",
		href: "/toast",
		preview: () => <ToastPreview />,
	},
	{
		label: "Controls",
		icon: "controls",
		href: "/switch",
		preview: () => <ControlsPreview />,
	},
];

const ACCENTS = [
	{ name: "Purple", color: "#635BFF" },
	{ name: "Orange", color: "#EA580C" },
	{ name: "Teal", color: "#0F766E" },
	{ name: "Pink", color: "#E11D48" },
	{ name: "Neutral", color: "#202020" },
];

export default function HomeScreen() {
	const { tokens } = useTheme();

	return (
		<Scaffold background="subtle" safeAreaEdges={["top"]}>
			<Scaffold.Content
				contentContainerStyle={{
					padding: tokens.metrics.screenMargin,
					// Room for the tab bar and the theme button.
					paddingBottom: tokens.spacing[12] * 3,
					gap: tokens.spacing[10],
				}}
			>
				<Header />
				<Hero />
				<FeaturedExperience />
				<ExploreComponents />
				<MakeItYours />
			</Scaffold.Content>
		</Scaffold>
	);
}

function Header() {
	const { tokens } = useTheme();

	return (
		<View
			accessible
			accessibilityRole="header"
			accessibilityLabel="Axiom"
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: tokens.spacing[2],
				paddingTop: tokens.spacing[2],
			}}
		>
			<AxiomMark size={22} />
			<Text variant="bodyLg" weight="bold" style={{ letterSpacing: -0.4 }}>
				axiom
			</Text>
		</View>
	);
}

/** The mark of the Axiom logo, without the wordmark. */
function AxiomMark({ size }: { size: number }) {
	const { colors } = useTheme();

	return (
		<Svg width={size} height={size} viewBox="0 0 99 100">
			<Path
				fill={colors.content.default}
				d="M9.36486 13.3333H53.5135C54.578 13.3333 55.5988 13.7548 56.3515 14.5049C57.1042 15.2551 57.527 16.2725 57.527 17.3333V36C57.527 37.7681 58.2318 39.4638 59.4862 40.714C60.7407 41.9643 62.4421 42.6667 64.2162 42.6667H82.9459C84.0104 42.6667 85.0313 43.0881 85.7839 43.8382C86.5366 44.5884 86.9595 45.6058 86.9595 46.6667V90.6667C86.9595 93.142 85.9728 95.516 84.2166 97.2663C82.4603 99.0167 80.0783 100 77.5946 100H9.36486C6.88115 100 4.49916 99.0167 2.74291 97.2663C0.986652 95.516 0 93.142 0 90.6667L0 22.6667C0 20.1913 0.986652 17.8173 2.74291 16.067C4.49916 14.3167 6.88115 13.3333 9.36486 13.3333Z"
			/>
			<Path
				fill={colors.content.default}
				d="M92.3108 0H76.2568C72.5624 0 69.5676 2.98477 69.5676 6.66667V22.6667C69.5676 26.3486 72.5624 29.3333 76.2568 29.3333H92.3108C96.0051 29.3333 99 26.3486 99 22.6667V6.66667C99 2.98477 96.0051 0 92.3108 0Z"
			/>
		</Svg>
	);
}

function Hero() {
	const { tokens } = useTheme();

	return (
		<View style={{ gap: tokens.spacing[3] }}>
			<Text
				variant="caption"
				color="muted"
				weight="semibold"
				style={{ letterSpacing: 1.2 }}
			>
				REACT NATIVE UI SYSTEM
			</Text>
			<Title variant="display">Build something beautiful.</Title>
			<Text variant="bodyLg" color="muted">
				Explore interfaces, components and experiences built with Axiom.
			</Text>
		</View>
	);
}

function SectionHeader({
	title,
	children,
}: {
	title: string;
	children?: ReactNode;
}) {
	const { tokens } = useTheme();

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				gap: tokens.spacing[3],
				minHeight: tokens.metrics.touchTarget,
			}}
		>
			<Title variant="headingSm">{title}</Title>
			{children}
		</View>
	);
}

function FeaturedExperience() {
	const { tokens, colors } = useTheme();

	return (
		<View style={{ gap: tokens.spacing[2] }}>
			<SectionHeader title="Featured experience">
				<Badge size="sm" variant="highlight">
					Interactive
				</Badge>
			</SectionHeader>
			<Card variant="outlined" padding="none" radius="xl">
				<View
					style={{
						padding: tokens.spacing[4],
						backgroundColor: colors.background.subtle,
					}}
				>
					<FinancePreview />
				</View>
				<Tappable
					accessibilityRole="link"
					accessibilityLabel="Finance dashboard. Open the StatsCard screen"
					onPress={() => router.push("/stats-card")}
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: tokens.spacing[3],
						padding: tokens.spacing[4],
						borderTopWidth: tokens.metrics.hairline,
						borderTopColor: colors.border.default,
					}}
				>
					<View style={{ flex: 1, gap: tokens.spacing[1] }}>
						<Text weight="semibold">Finance dashboard</Text>
						<Text variant="footnote" color="muted" numberOfLines={1}>
							Cards · Sparkline · SegmentedControl · Avatar
						</Text>
					</View>
					<View
						style={{
							width: tokens.sizes.control.sm,
							height: tokens.sizes.control.sm,
							borderRadius: tokens.radius.full,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: colors.background.subtle,
						}}
					>
						<Icon name="open" size="sm" />
					</View>
				</Tappable>
			</Card>
		</View>
	);
}

/** A small, working finance screen: the period switches the chart. */
function FinancePreview() {
	const { tokens, colors } = useTheme();
	const [period, setPeriod] = useState<Period>("1M");
	const balance = BALANCE[period];

	return (
		<View
			style={{
				gap: tokens.spacing[3],
				padding: tokens.spacing[4],
				borderRadius: tokens.radius.lg,
				borderWidth: tokens.metrics.hairline,
				borderColor: colors.border.default,
				backgroundColor: colors.background.default,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: tokens.spacing[3],
				}}
			>
				<Avatar name="Maya Chen" size="sm" colorFromName />
				<View style={{ flex: 1 }}>
					<Text variant="caption" color="muted">
						Good morning
					</Text>
					<Text variant="bodySm" weight="semibold">
						Maya Chen
					</Text>
				</View>
				<Icon name="notifications" size="sm" color="muted" />
			</View>
			<StatsCardSparkline
				label="Total balance"
				value="$24,562.80"
				icon="revenue"
				change={balance.change}
				trend="up"
				caption="vs previous period"
				data={balance.data}
			/>
			<SegmentedControl
				options={[
					{ value: "1W", label: "1W", accessibilityLabel: "1 week" },
					{ value: "1M", label: "1M", accessibilityLabel: "1 month" },
					{ value: "1Y", label: "1Y", accessibilityLabel: "1 year" },
				]}
				value={period}
				onValueChange={(value) => setPeriod(value as Period)}
			/>
			<View style={{ gap: tokens.spacing[3] }}>
				{TRANSACTIONS.map((transaction) => (
					<View
						key={transaction.name}
						accessible
						accessibilityLabel={`${transaction.name}, ${transaction.note}, ${transaction.amount}`}
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: tokens.spacing[3],
						}}
					>
						<Avatar name={transaction.name} size="sm" shape="square" />
						<View style={{ flex: 1 }}>
							<Text variant="bodySm" weight="medium" numberOfLines={1}>
								{transaction.name}
							</Text>
							<Text variant="caption" color="muted">
								{transaction.note}
							</Text>
						</View>
						<Text
							variant="bodySm"
							weight="semibold"
							color={transaction.income ? "success" : "default"}
						>
							{transaction.amount}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

function ExploreComponents() {
	const { tokens } = useTheme();
	const rows = [CATEGORIES.slice(0, 2), CATEGORIES.slice(2)];

	return (
		<View style={{ gap: tokens.spacing[2] }}>
			<SectionHeader title="Explore components">
				<Button
					variant="ghost"
					size="sm"
					trailingIcon="chevron-right"
					accessibilityRole="link"
					onPress={() => router.navigate("/components")}
				>
					View all
				</Button>
			</SectionHeader>
			<View style={{ gap: tokens.spacing[3] }}>
				{rows.map((row) => (
					<View
						key={row[0].label}
						style={{ flexDirection: "row", gap: tokens.spacing[3] }}
					>
						{row.map((category) => (
							<CategoryCard key={category.label} category={category} />
						))}
					</View>
				))}
			</View>
		</View>
	);
}

function CategoryCard({ category }: { category: Category }) {
	const { tokens, colors } = useTheme();

	return (
		<Card
			variant="outlined"
			padding={4}
			radius="xl"
			accessibilityRole="link"
			accessibilityLabel={category.label}
			onPress={() => router.push(category.href as Href)}
			style={{ flex: 1 }}
		>
			<View style={{ gap: tokens.spacing[4] }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: tokens.spacing[2],
					}}
				>
					<View
						style={{
							width: 28,
							height: 28,
							borderRadius: tokens.radius.md,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: colors.background.subtle,
						}}
					>
						<Icon name={category.icon} size="sm" />
					</View>
					<Text variant="bodySm" weight="semibold">
						{category.label}
					</Text>
				</View>
				{/* A picture of the category: the card is the link, the controls inside don't take touches. */}
				<View
					importantForAccessibility="no-hide-descendants"
					accessibilityElementsHidden
					style={{
						minHeight: 48,
						justifyContent: "center",
						alignItems: "flex-start",
						pointerEvents: "none",
					}}
				>
					{category.preview()}
				</View>
			</View>
		</Card>
	);
}

function ToastPreview() {
	const { tokens, colors } = useTheme();

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: tokens.spacing[2],
				paddingVertical: tokens.spacing[2],
				paddingHorizontal: tokens.spacing[3],
				borderRadius: tokens.radius.full,
				borderWidth: tokens.metrics.hairline,
				borderColor: colors.border.default,
				backgroundColor: colors.background.elevated,
			}}
		>
			<Icon name="success" size="sm" color="success" />
			<Text variant="bodySm" weight="semibold">
				Success!
			</Text>
		</View>
	);
}

function ControlsPreview() {
	const { tokens } = useTheme();

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: tokens.spacing[4],
			}}
		>
			<Switch size="sm" value />
			<Checkbox checked />
		</View>
	);
}

/** Recolors a local preview only: the app theme stays as it is. */
function MakeItYours() {
	const { tokens, colors } = useTheme();
	const [accent, setAccent] = useState(ACCENTS[0]);

	return (
		<Card variant="outlined" padding={5} radius="xl">
			<View style={{ gap: tokens.spacing[5] }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "flex-start",
						gap: tokens.spacing[3],
					}}
				>
					<View style={{ flex: 1, gap: tokens.spacing[1] }}>
						<Title variant="headingSm">Make it yours</Title>
						<Text variant="bodySm" color="muted">
							Personalize your experience.
						</Text>
					</View>
					<View
						style={{
							width: tokens.sizes.control.sm,
							height: tokens.sizes.control.sm,
							borderRadius: tokens.radius.full,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: colors.background.subtle,
						}}
					>
						<Icon name="customize" size="sm" color={accent.color} />
					</View>
				</View>

				<View
					accessibilityRole="radiogroup"
					accessibilityLabel="Accent color"
					style={{ flexDirection: "row", justifyContent: "space-between" }}
				>
					{ACCENTS.map((item) => {
						const selected = item.color === accent.color;

						return (
							<Tappable
								key={item.name}
								accessibilityRole="radio"
								accessibilityLabel={item.name}
								accessibilityState={{ checked: selected }}
								haptic="selection"
								onPress={() => setAccent(item)}
								style={{
									width: tokens.metrics.touchTarget,
									height: tokens.metrics.touchTarget,
									padding: 3,
									borderRadius: tokens.radius.full,
									borderWidth: 2,
									borderColor: selected ? item.color : "transparent",
								}}
							>
								<View
									style={{
										flex: 1,
										borderRadius: tokens.radius.full,
										alignItems: "center",
										justifyContent: "center",
										borderWidth: tokens.metrics.hairline,
										borderColor: colors.border.default,
										backgroundColor: item.color,
									}}
								>
									{selected ? (
										<Icon name="check" size="sm" color="#FFFFFF" />
									) : null}
								</View>
							</Tappable>
						);
					})}
				</View>

				<View
					style={{
						gap: tokens.spacing[3],
						padding: tokens.spacing[4],
						borderRadius: tokens.radius.lg,
						backgroundColor: colors.background.subtle,
					}}
				>
					<View
						accessible
						accessibilityLabel="Profile completion, 64%"
						style={{ gap: tokens.spacing[2] }}
					>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Text variant="bodySm" color="muted">
								Profile completion
							</Text>
							<Text
								variant="bodySm"
								weight="semibold"
								style={{ color: accent.color }}
							>
								64%
							</Text>
						</View>
						<View
							style={{
								height: 6,
								borderRadius: tokens.radius.full,
								backgroundColor: colors.border.default,
								overflow: "hidden",
							}}
						>
							<View
								style={{
									width: "64%",
									height: "100%",
									backgroundColor: accent.color,
								}}
							/>
						</View>
					</View>
					<Button
						fullWidth
						onPress={() =>
							toast.success(`${accent.name} looks good on you`)
						}
						style={{ backgroundColor: accent.color }}
					>
						<Text weight="semibold" style={{ color: "#FFFFFF" }}>
							Get started
						</Text>
					</Button>
				</View>
			</View>
		</Card>
	);
}
