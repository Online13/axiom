import { useState } from "react";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label, Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function SliderScreen() {
	const [disabled, setDisabled] = useState(false);
	const [volume, setVolume] = useState(0.4);
	const [price, setPrice] = useState<[number, number]>([40, 220]);
	const [committed, setCommitted] = useState<[number, number]>([40, 220]);
	const [rating, setRating] = useState(3);

	return (
		<Screen>
			<Panel>
				<Row label="Disabled">
					<Switch
						value={disabled}
						onValueChange={setDisabled}
						accessibilityLabel="Disabled"
					/>
				</Row>
			</Panel>

			<Section title="Slider">
				<Panel>
					<Label muted>Volume · {Math.round(volume * 100)}%</Label>
					<Slider
						value={volume}
						onValueChange={setVolume}
						min={0}
						max={1}
						step={0}
						disabled={disabled}
						accessibilityLabel="Volume"
						getAccessibilityValue={(value) =>
							`${Math.round(value * 100)} percent`
						}
					/>
					<Label muted>
						Price · ${price[0]}–${price[1]} (sent: ${committed[0]}–$
						{committed[1]})
					</Label>
					<Slider
						value={price}
						onValueChange={setPrice}
						onSlidingComplete={setCommitted}
						min={0}
						max={500}
						step={10}
						minRange={20}
						disabled={disabled}
						accessibilityLabel="Price"
					/>
					<Label muted>Rating · {rating}</Label>
					<Slider
						value={rating}
						onValueChange={setRating}
						haptic="selection"
						min={1}
						max={5}
						step={1}
						showSteps
						disabled={disabled}
						accessibilityLabel="Rating"
					/>
				</Panel>
			</Section>
		</Screen>
	);
}
