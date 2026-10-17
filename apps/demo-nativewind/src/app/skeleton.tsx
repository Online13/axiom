import { useState } from "react";
import { View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

export default function SkeletonScreen() {
	const { tokens } = useTheme();
	const [loading, setLoading] = useState(true);
	const [animation, setAnimation] = useState<"shimmer" | "pulse">("shimmer");

	return (
		<Screen>
			<Section
				title="Skeleton"
				description="One shared clock: every placeholder stays in sync."
			>
				<Panel>
					<Row label="Loading">
						<Switch
							value={loading}
							onValueChange={setLoading}
							accessibilityLabel="Loading"
						/>
					</Row>
					<Row label="Pulse instead of shimmer">
						<Switch
							value={animation === "pulse"}
							onValueChange={(on) =>
								setAnimation(on ? "pulse" : "shimmer")
							}
							accessibilityLabel="Pulse"
						/>
					</Row>
				</Panel>
				<Panel>
					{[0, 1].map((i) => (
						<View
							key={i}
							className="flex-row"
							style={{ gap: tokens.spacing[3] }}
						>
							<Skeleton
								loading={loading}
								variant={animation}
								width={40}
								height={40}
								radius="full"
							>
								<Avatar
									name={i === 0 ? "Jane Cooper" : "Wade Warren"}
									colorFromName
								/>
							</Skeleton>
							<View className="flex-1">
								<Skeleton.Text
									loading={loading}
									animation={animation}
									lines={2}
								>
									<Text weight="semibold">
										{i === 0 ? "Jane Cooper" : "Wade Warren"}
									</Text>
									<Text variant="bodySm" color="muted">
										Shared three photos from the trip to Porto.
									</Text>
								</Skeleton.Text>
							</View>
						</View>
					))}
					<Skeleton
						loading={loading}
						variant={animation}
						height={140}
						radius="lg"
					/>
				</Panel>
			</Section>
		</Screen>
	);
}
