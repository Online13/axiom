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
import ProductCardScreen from "@/demo/examples/compositions/cards/product-card";
import ListingCardScreen from "@/demo/examples/compositions/cards/listing-card";
import RecipeCardScreen from "@/demo/examples/compositions/cards/recipe-card";
import ArticleCardScreen from "@/demo/examples/compositions/cards/article-card";
import EventCardScreen from "@/demo/examples/compositions/cards/event-card";
import ProfileCardScreen from "@/demo/examples/compositions/cards/profile-card";
import OfferCardScreen from "@/demo/examples/compositions/cards/offer-card";
import PricingCardScreen from "@/demo/examples/compositions/cards/pricing-card";
import StatsCardScreen from "@/demo/examples/compositions/cards/stats-card";
import SettingsItemScreen from "@/demo/examples/compositions/rows/settings-item";
import TrackItemScreen from "@/demo/examples/compositions/rows/track-item";
import ConversationItemScreen from "@/demo/examples/compositions/rows/conversation-item";
import NotificationItemScreen from "@/demo/examples/compositions/rows/notification-item";
import SearchResultItemScreen from "@/demo/examples/compositions/rows/search-result-item";
import SearchAppBarScreen from "@/demo/examples/compositions/bars/search-app-bar";
import ProfileAppBarScreen from "@/demo/examples/compositions/bars/profile-app-bar";
import SettingsSectionScreen from "@/demo/examples/blocks/settings-section";
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
		titles: ["Search", "Small", "Medium", "Large", "Elevation"],
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
	calendar: {
		Component: CalendarExamples,
		titles: ["Events", "Compact month", "Stay"],
	},
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
	// Compositions and blocks: one screen each, every section shown.
	"product-card": { Component: ProductCardScreen },
	"listing-card": { Component: ListingCardScreen },
	"recipe-card": { Component: RecipeCardScreen },
	"article-card": { Component: ArticleCardScreen },
	"event-card": { Component: EventCardScreen },
	"profile-card": { Component: ProfileCardScreen },
	"offer-card": { Component: OfferCardScreen },
	"pricing-card": { Component: PricingCardScreen },
	"stats-card": { Component: StatsCardScreen },
	"settings-item": { Component: SettingsItemScreen },
	"track-item": { Component: TrackItemScreen },
	"conversation-item": { Component: ConversationItemScreen },
	"notification-item": { Component: NotificationItemScreen },
	"search-result-item": { Component: SearchResultItemScreen },
	"search-app-bar": { Component: SearchAppBarScreen },
	"profile-app-bar": { Component: ProfileAppBarScreen },
	"settings-section": { Component: SettingsSectionScreen },
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
