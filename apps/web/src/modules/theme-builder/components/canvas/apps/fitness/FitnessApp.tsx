// Pulse — a fitness app built on big numbers and data. The semantic colors
// do the talking: success for goals met, warning for slipping, error for missed.

import { Progress } from "./Progress";
import { Today } from "./Today";
import { Workout } from "./Workout";

export function FitnessApp() {
	return (
		<>
			<Today />
			<Workout />
			<Progress />
		</>
	);
}
