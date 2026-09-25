// Wave — a music app, and the showcase preview: the player is the hero screen,
// Discover and Album show the rest of the app. Accent drives the active
// controls and the scrubber, highlight fills the featured mix.

import { Album } from "./Album";
import { Discover } from "./Discover";
import { Player } from "./Player";

export function MusicApp() {
	return (
		<>
			<Player />
			<Discover />
			<Album />
		</>
	);
}
