import { useState } from "react";

import { TrackItem } from "@/components/compositions/track-item";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { images } from "../fixtures";
import { List, notify } from "../shared";

const TRACKS = [
	{
		id: "1",
		title: "Midnight City",
		artist: "M83",
		duration: 243,
		artwork: images.skyline,
	},
	{
		id: "2",
		title: "Instant Crush",
		artist: "Daft Punk",
		duration: 337,
		artwork: images.concert,
		explicit: true,
	},
	{
		id: "3",
		title: "Breathe",
		artist: "Télépopmusik",
		duration: 280,
		artwork: images.mountains,
	},
];

export default function TrackItemScreen() {
	const [playing, setPlaying] = useState("1");

	return (
		<Screen>
			<Section
				title="TrackItem"
				description="Artwork, duration and the playing track. Tap one to play it."
			>
				<List>
					{TRACKS.map((track) => (
						<TrackItem
							key={track.id}
							title={track.title}
							artist={track.artist}
							artwork={track.artwork}
							duration={track.duration}
							explicit={track.explicit}
							playing={playing === track.id}
							onPress={() => setPlaying(track.id)}
							onMore={notify(`More on ${track.title}`)}
						/>
					))}
				</List>
			</Section>

			<Section
				title="Numbered"
				description="An album tracklist, without artwork."
			>
				<List>
					{TRACKS.map((track, index) => (
						<TrackItem
							key={track.id}
							index={index + 1}
							title={track.title}
							artist={track.artist}
							duration={track.duration}
							explicit={track.explicit}
							playing={playing === track.id}
							onPress={() => setPlaying(track.id)}
						/>
					))}
				</List>
			</Section>
		</Screen>
	);
}
