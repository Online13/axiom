// North — a finance app, premium and minimal: a balance, a chart, actions.
// Success and error carry every variation, the link color the charts.

import { Asset } from "./Asset";
import { Card } from "./Card";
import { Portfolio } from "./Portfolio";

export function FinanceApp() {
	return (
		<>
			<Portfolio />
			<Asset />
			<Card />
		</>
	);
}
