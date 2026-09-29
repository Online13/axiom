import { ListingCard } from "@/components/compositions/listing-card";
import { ListingCardBooking } from "@/components/compositions/listing-card-booking";
import { ListingCardDetailed } from "@/components/compositions/listing-card-detailed";
import { ListingCardOverlay } from "@/components/compositions/listing-card-overlay";
import { ListingCardOverlayDetailed } from "@/components/compositions/listing-card-overlay-detailed";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { AGENT, HOME_SPECS, images, STAY_SPECS } from "../fixtures";
import { notify, Rail } from "../shared";

const { listings } = images;

export default function ListingCardScreen() {
	return (
		<Screen>
			<Section
				title="ListingCard"
				description="Photo, price per unit and specs."
			>
				<ListingCard
					title="Sunny loft"
					subtitle="Quiet, bright, near the park"
					price="$3,679"
					priceUnit="/mo"
					badge="Guest favorite"
					image={listings.sunnyLoft}
					specs={STAY_SPECS}
					onPress={notify("Open Sunny loft")}
				/>
			</Section>

			<Section
				title="ListingCardDetailed"
				description="Price label, agent and a call to action."
			>
				<ListingCardDetailed
					price="$250,000"
					priceLabel="List price"
					title="White villa"
					subtitle="18 Harbor Rd, Seaview"
					badge="Prime pick"
					image={listings.whiteVilla}
					specs={HOME_SPECS}
					agent={AGENT}
					meta="2 days ago"
					onAction={notify("Contact the agent")}
					onPress={notify("Open White villa")}
				/>
			</Section>

			<Section
				title="ListingCardOverlay"
				description="Text over the photo, for rails."
			>
				<Rail>
					<ListingCardOverlay
						title="Red cabin"
						subtitle="254 Highland Ave, Lochside"
						price="$200k"
						badge="Newly listed"
						image={listings.redCabin}
						specs={STAY_SPECS}
						onPress={notify("Open Red cabin")}
						style={{ width: 260 }}
					/>
					<ListingCardOverlay
						title="Alpine lodge"
						subtitle="7 Summit Ln, Pinewood"
						price="$340k"
						image={listings.alpineLodge}
						specs={STAY_SPECS}
						onPress={notify("Open Alpine lodge")}
						style={{ width: 260 }}
					/>
				</Rail>
			</Section>

			<Section
				title="ListingCardOverlayDetailed"
				description="Overlay with a price label and the agent."
			>
				<ListingCardOverlayDetailed
					price="$250,000"
					priceLabel="List price"
					title="Pool villa"
					subtitle="3 Cliff Rd, Seaview"
					badge="Prime pick"
					image={listings.poolVilla}
					specs={HOME_SPECS}
					agent={AGENT}
					meta="2 days ago"
					onPress={notify("Open Pool villa")}
				/>
			</Section>

			<Section
				title="ListingCardBooking"
				description="A stay with its nightly price and a booking button."
			>
				<ListingCardBooking
					title="The Hill Guest House"
					subtitle="58 Hullbrook Rd, Alpendorf"
					price="$620"
					priceUnit="/night"
					image={listings.alpineLodge}
					specs={STAY_SPECS}
					onAction={notify("Booking started")}
					onPress={notify("Open The Hill Guest House")}
				/>
			</Section>
		</Screen>
	);
}
