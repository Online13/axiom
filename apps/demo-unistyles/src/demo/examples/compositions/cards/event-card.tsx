import { EventCard } from "@/components/compositions/event-card";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { avatars, images } from "../fixtures";
import { notify } from "../shared";

export default function EventCardScreen() {
	return (
		<Screen>
			<Section
				title="EventCard"
				description="Date tile, details and who's going."
			>
				<EventCard
					title="Night Owls live"
					image={images.concert}
					date={new Date(2026, 10, 14, 20)}
					details={[
						{ icon: "time", label: "Sat · 8:00 PM" },
						{ icon: "location", label: "Brooklyn Steel, New York" },
					]}
					attendees={[
						{ name: "Maya", avatar: avatars.maya },
						{ name: "Leo", avatar: avatars.leo },
						{ name: "Sam", avatar: avatars.sam },
					]}
					attendeeCount={128}
					onAction={notify("Tickets")}
					onPress={notify("Open the event")}
				/>
			</Section>

			<Section title="Without attendees" description="Details only.">
				<EventCard
					title="Design Systems Summit"
					image={images.conference}
					date={new Date(2026, 11, 3, 9)}
					details={[
						{ icon: "time", label: "Thu · 9:00 AM" },
						{ icon: "location", label: "Moscone West, San Francisco" },
					]}
					actionLabel="Register"
					onAction={notify("Register")}
					onPress={notify("Open the event")}
				/>
			</Section>
		</Screen>
	);
}
