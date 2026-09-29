import { StatsCard } from "@/components/compositions/stats-card";
import { StatsCardInline } from "@/components/compositions/stats-card-inline";
import { StatsCardProgress } from "@/components/compositions/stats-card-progress";
import { StatsCardRing } from "@/components/compositions/stats-card-ring";
import { StatsCardSparkline } from "@/components/compositions/stats-card-sparkline";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { Columns, notify } from "../shared";

const REVENUE = [8.2, 9.1, 8.7, 10.4, 9.8, 11.6, 12.5];
const VISITORS = [9.4, 9.9, 9.1, 8.8, 9.2, 8.5, 8.2];

export default function StatsCardScreen() {
	return (
		<Screen>
			<Section title="StatsCard" description="A metric with its trend.">
				<Columns>
					<StatsCard
						label="Revenue"
						value="$12,480"
						icon="revenue"
						change="+12.4%"
						trend="up"
						caption="vs last week"
						style={{ flex: 1 }}
					/>
					<StatsCard
						label="Visitors"
						value="8,204"
						icon="people"
						change="-3%"
						trend="down"
						caption="vs last week"
						style={{ flex: 1 }}
					/>
				</Columns>
			</Section>

			<Section
				title="Trend that isn't good news"
				description="Spending up is shown as negative with positive={false}."
			>
				<Columns>
					<StatsCard
						label="Spending"
						value="$3,210"
						change="+8%"
						trend="up"
						positive={false}
						style={{ flex: 1 }}
					/>
					<StatsCard
						label="Orders"
						value="412"
						change="0%"
						trend="flat"
						variant="filled"
						style={{ flex: 1 }}
					/>
				</Columns>
			</Section>

			<Section
				title="StatsCardSparkline"
				description="The recent values as a line, colored like the change."
			>
				<Columns>
					<StatsCardSparkline
						label="Revenue"
						value="$12,480"
						icon="revenue"
						data={REVENUE}
						change="+12.4%"
						trend="up"
						caption="Last 7 days"
						style={{ flex: 1 }}
					/>
					<StatsCardSparkline
						label="Visitors"
						value="8,204"
						icon="people"
						data={VISITORS}
						change="-3%"
						trend="down"
						caption="Last 7 days"
						style={{ flex: 1 }}
					/>
				</Columns>
			</Section>

			<Section
				title="StatsCardProgress"
				description="How far the value is from a goal. Past the goal, the bar turns green."
			>
				<StatsCardProgress
					label="Steps"
					value="8,204"
					goal="/ 10,000"
					progress={0.82}
					icon="calories"
					caption="1,796 to go"
				/>
				<StatsCardProgress
					label="Savings"
					value="$5,400"
					goal="/ $5,000"
					progress={1.08}
					caption="Goal reached"
					variant="outlined"
				/>
			</Section>

			<Section
				title="StatsCardInline"
				description="Icon, value and change on one line, for a stack of metrics."
			>
				<StatsCardInline
					label="Revenue"
					value="$12,480"
					icon="revenue"
					change="+12.4%"
					trend="up"
					onPress={notify("Open revenue")}
				/>
				<StatsCardInline
					label="Visitors"
					value="8,204"
					icon="people"
					change="-3%"
					trend="down"
					onPress={notify("Open visitors")}
				/>
				<StatsCardInline
					label="Refunds"
					value="$212"
					icon="warning"
					change="+4%"
					trend="up"
					positive={false}
					variant="outlined"
				/>
			</Section>

			<Section
				title="StatsCardRing"
				description="A ring for the share of a goal, the percentage in the middle."
			>
				<StatsCardRing
					label="Move"
					value="420 kcal"
					progress={0.7}
					caption="of 600 kcal"
				/>
				<StatsCardRing
					label="Stand"
					value="12 h"
					progress={1}
					caption="Goal reached"
				/>
			</Section>
		</Screen>
	);
}
