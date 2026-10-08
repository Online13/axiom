import { OfferCard } from "@/components/compositions/offer-card";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { images } from "../fixtures";
import { notify } from "../shared";

export default function OfferCardScreen() {
	return (
		<Screen>
			<Section
				title="OfferCard"
				description="A benefit, its highlights and the fee."
			>
				<OfferCard
					title="Sapphire Travel card"
					benefit="5% back on travel"
					image={images.skyline}
					badge="Limited offer"
					highlights={[
						"60,000 bonus points after $4,000 spent",
						"No foreign transaction fees",
					]}
					fee="$0 the first year"
					onAction={notify("Apply")}
					onPress={notify("Open the offer")}
				/>
			</Section>

			<Section title="Without image" description="Text only.">
				<OfferCard
					title="Everyday cash card"
					benefit="2% back on everything"
					highlights={["No annual fee", "Instant card number"]}
					fee="$0"
					onAction={notify("Apply")}
				/>
			</Section>
		</Screen>
	);
}
