import { useState } from "react";

import { PricingCard } from "@/components/compositions/pricing-card";
import { PricingCardCompact } from "@/components/compositions/pricing-card-compact";
import { PricingCardHero } from "@/components/compositions/pricing-card-hero";
import { PricingCardHorizontal } from "@/components/compositions/pricing-card-horizontal";
import { PricingCardTile } from "@/components/compositions/pricing-card-tile";
import {
	PricingCardToggle,
	type Billing,
} from "@/components/compositions/pricing-card-toggle";
import { RadioGroup } from "@/components/ui/radio";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { notify, Rail } from "../shared";

const PLANS = [
	{
		id: "free",
		name: "Free",
		price: "$0",
		description: "For trying things out.",
		features: ["3 projects", "Community support"],
	},
	{
		id: "pro",
		name: "Pro",
		price: "$12",
		period: "/month",
		description: "For people shipping every week.",
		features: ["Unlimited projects", "Version history", "Priority support"],
	},
	{
		id: "team",
		name: "Team",
		price: "$32",
		period: "/month",
		description: "Shared workspaces and roles.",
		features: ["Everything in Pro", "Up to 10 members", "Admin controls"],
	},
];

const TILES = [
	{
		value: "yearly",
		name: "Yearly",
		price: "$3.33",
		period: "/month",
		description: "$39.99 billed yearly",
		trial: "7-day free trial",
		badge: "Save 60%",
	},
	{
		value: "monthly",
		name: "Monthly",
		price: "$7.99",
		period: "/month",
		description: "Cancel anytime",
	},
	{
		value: "lifetime",
		name: "Lifetime",
		price: "$99",
		description: "Pay once, keep it forever",
	},
];

export default function PricingCardScreen() {
	const [plan, setPlan] = useState("free");
	const [compact, setCompact] = useState("yearly");
	const [tile, setTile] = useState("yearly");
	const [billing, setBilling] = useState<Billing>("yearly");

	return (
		<Screen>
			<Section
				title="PricingCard"
				description="Plans, featured and current. Pick one to make it current."
			>
				{PLANS.map((item) => (
					<PricingCard
						key={item.id}
						name={item.name}
						price={item.price}
						period={item.period}
						description={item.description}
						features={item.features}
						badge={item.id === "pro" ? "Most popular" : undefined}
						featured={item.id === "pro"}
						current={item.id === plan}
						onAction={() => setPlan(item.id)}
					/>
				))}
			</Section>

			<Section
				title="PricingCardCompact"
				description="One selectable row per plan, inside a RadioGroup. For a list or a bottom sheet."
			>
				<RadioGroup value={compact} onValueChange={setCompact} gap={2} haptic="selection">
					<PricingCardCompact
						value="yearly"
						name="Yearly"
						price="$99"
						period="/year"
						description="$8.25 a month"
						badge="Save 30%"
					/>
					<PricingCardCompact
						value="monthly"
						name="Monthly"
						price="$12"
						period="/month"
						description="Cancel anytime"
					/>
				</RadioGroup>
			</Section>

			<Section
				title="PricingCardToggle"
				description="Monthly or yearly: the yearly price strikes the monthly one. The two cards share the choice."
			>
				<PricingCardToggle
					name="Pro"
					monthlyPrice="$12"
					yearlyPrice="$9.60"
					discount="-20%"
					yearlyCaption="$115 billed yearly"
					description="For people shipping every week."
					features={["Unlimited projects", "Priority support"]}
					badge="Most popular"
					featured
					billing={billing}
					onBillingChange={setBilling}
					onAction={(choice) => notify(`Pro, ${choice}`)()}
				/>
				<PricingCardToggle
					name="Team"
					monthlyPrice="$32"
					yearlyPrice="$25.60"
					discount="-20%"
					yearlyCaption="$307 billed yearly"
					features={["Everything in Pro", "Admin controls"]}
					billing={billing}
					onBillingChange={setBilling}
					onAction={(choice) => notify(`Team, ${choice}`)()}
				/>
			</Section>

			<Section
				title="PricingCardHero"
				description="The plan to push, on the primary color. The others stay outlined."
			>
				<PricingCardHero
					name="Pro"
					price="$12"
					period="/month"
					description="For people shipping every week."
					features={["Unlimited projects", "Version history", "Priority support"]}
					badge="Most popular"
					actionLabel="Start free trial"
					onAction={notify("Start Pro trial")}
				/>
				<PricingCard
					name="Team"
					price="$32"
					period="/month"
					description="Shared workspaces and roles."
					features={["Everything in Pro", "Up to 10 members"]}
					onAction={notify("Choose Team")}
				/>
			</Section>

			<Section
				title="PricingCardHorizontal"
				description="Plan on the left, price and button on the right. Made for tablets and landscape."
			>
				<PricingCardHorizontal
					name="Pro"
					price="$12"
					period="/month"
					description="For people shipping every week."
					features={["Unlimited projects", "Priority support"]}
					badge="Popular"
					featured
					onAction={notify("Choose Pro")}
				/>
				<PricingCardHorizontal
					name="Free"
					price="$0"
					features={["3 projects"]}
					current
				/>
			</Section>

			<Section
				title="PricingCardTile"
				description="Large paywall tiles in a horizontal rail, App Store style."
			>
				<RadioGroup value={tile} onValueChange={setTile} haptic="selection">
					<Rail>
						{TILES.map((item) => (
							<PricingCardTile key={item.value} {...item} style={{ width: 168 }} />
						))}
					</Rail>
				</RadioGroup>
			</Section>
		</Screen>
	);
}
