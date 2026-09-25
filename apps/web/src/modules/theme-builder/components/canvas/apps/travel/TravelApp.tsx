// Roam — a travel app with an editorial feel: big pictures, big type, cards.
// Accent carries the navigation and the selected place, highlight the picks.

import { Destination } from "./Destination";
import { Explore } from "./Explore";
import { Trip } from "./Trip";

export function TravelApp() {
	return (
		<>
			<Destination />
			<Explore />
			<Trip />
		</>
	);
}
