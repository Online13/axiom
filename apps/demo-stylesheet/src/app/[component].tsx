import { Stack, useLocalSearchParams } from "expo-router";
import OverlayScreen from "@/app/overlay";

import AlertExamples from "@/demo/examples/alert";
import AppBarExamples from "@/demo/examples/app-bar";
import AttachmentExamples from "@/demo/examples/attachment";
import BadgeExamples from "@/demo/examples/badge";
import CalendarExamples from "@/demo/examples/calendar";
import CardExamples from "@/demo/examples/card";
import CheckboxExamples from "@/demo/examples/checkbox";
import DatePickerExamples from "@/demo/examples/date-picker";
import DialogExamples from "@/demo/examples/dialog";
import InputExamples from "@/demo/examples/input";
import PasscodeExamples from "@/demo/examples/passcode";
import SearchBarExamples from "@/demo/examples/search-bar";
import SegmentedControlExamples from "@/demo/examples/segmented-control";
import ScaffoldExamples from "@/demo/examples/scaffold";
import TabExamples from "@/demo/examples/tab";
import ToastExamples from "@/demo/examples/toast";
import ToolBarExamples from "@/demo/examples/tool-bar";
import BottomTabBarExamples from "@/demo/examples/bottom-tab-bar";
import TypographyExamples from "@/demo/examples/typography";
import { SectionScope } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { Text } from "@/components/ui/text";
import { SCREENS } from "@/demo/screens";

const EXAMPLES = {
	alert: { Component: AlertExamples, titles: ["Alert"] },
	spinner: { Component: AlertExamples, titles: ["Spinner"] },
	skeleton: { Component: AlertExamples, titles: ["Skeleton"] },
	empty: { Component: AlertExamples, titles: ["Empty"] },
	"app-bar": {
		Component: AppBarExamples,
		titles: ["AppBar", "Large title and search", "Elevation"],
	},
	attachment: {
		Component: AttachmentExamples,
		titles: ["Attachment", "Error and retry", "Tiles"],
	},
	badge: {
		Component: BadgeExamples,
		titles: ["Badge", "Counter on an anchor"],
	},
	avatar: { Component: BadgeExamples, titles: ["Avatar"] },
	chip: { Component: BadgeExamples, titles: ["Chip"] },
	separator: { Component: BadgeExamples, titles: ["Separator"] },
	calendar: { Component: CalendarExamples, titles: ["Calendar"] },
	carousel: { Component: CalendarExamples, titles: ["Carousel"] },
	card: { Component: CardExamples, titles: ["Card"] },
	item: { Component: CardExamples, titles: ["Item"] },
	"option-item": { Component: CardExamples, titles: ["OptionItem"] },
	accordion: { Component: CardExamples, titles: ["Accordion"] },
	checkbox: {
		Component: CheckboxExamples,
		titles: ["Checkbox", "Select all"],
	},
	radio: {
		Component: CheckboxExamples,
		titles: ["Radio", "Horizontal and custom rows"],
	},
	"date-picker": {
		Component: DatePickerExamples,
		titles: ["DatePicker", "Instant and presets", "Range", "Custom trigger"],
	},
	dialog: { Component: DialogExamples, titles: ["Dialog"] },
	menu: { Component: DialogExamples, titles: ["Menu"] },
	input: {
		Component: InputExamples,
		titles: [
			"Login form",
			"Validation on blur",
			"Prefix, suffix and sizes",
			"Chain fields",
		],
	},
	"text-area": { Component: InputExamples, titles: ["TextArea"] },
	passcode: {
		Component: PasscodeExamples,
		titles: ["Unlocking", "Verifying", "Creating a PIN"],
	},
	"search-bar": {
		Component: SearchBarExamples,
		titles: ["SearchBar", "Live results", "Filtering a local list", "Sizes"],
	},
	"segmented-control": {
		Component: SegmentedControlExamples,
		titles: ["SegmentedControl"],
	},
	slider: { Component: SegmentedControlExamples, titles: ["Slider"] },
	scaffold: {
		Component: ScaffoldExamples,
		titles: ["Scaffold", "A form", "Without scrolling"],
	},
	tab: { Component: TabExamples },
	"tool-bar": {
		Component: ToolBarExamples,
		titles: ["ToolBar", "Floating", "Justify"],
	},
	"bottom-tab-bar": {
		Component: BottomTabBarExamples,
		titles: ["BottomTabBar", "Floating", "Main action"],
	},
	toast: { Component: ToastExamples, titles: ["Toast"] },
	snackbar: { Component: ToastExamples, titles: ["Snackbar"] },
	text: {
		Component: TypographyExamples,
		titles: ["Text variants", "Colors", "Weight, alignment, nesting"],
	},
	title: { Component: TypographyExamples, titles: ["Title"] },
	portal: { Component: PortalExamples, titles: ["Portal"] },
} as const;

function PortalExamples() {
	return <OverlayScreen focus="portal" />;
}

export default function ComponentScreen() {
	const { component } = useLocalSearchParams<{ component: string }>();
	const example = EXAMPLES[component as keyof typeof EXAMPLES];
	const title =
		SCREENS.find((screen) => screen.name === component)?.title ?? "Component";

	if (!example) {
		return (
			<Screen>
				<Stack.Screen options={{ title }} />
				<Text>Component example unavailable.</Text>
			</Screen>
		);
	}

	return (
		<SectionScope titles={"titles" in example ? example.titles : undefined}>
			<Stack.Screen options={{ title }} />
			<example.Component />
		</SectionScope>
	);
}
