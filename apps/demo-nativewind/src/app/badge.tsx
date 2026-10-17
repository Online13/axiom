import { useState } from "react";
import { View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

export default function BadgeScreen() {
	const { tokens } = useTheme();
	const [count, setCount] = useState(3);
	const [hidden, setHidden] = useState(false);

	return (
		<Screen>
			<Section
				title="Badge"
				description="Semantic variants, dot, icon, sizes."
			>
				<Panel>
					<View
						className="flex-row flex-wrap"
						style={{ gap: tokens.spacing[2] }}
					>
						<Badge>Archived</Badge>
						<Badge variant="highlight">Featured</Badge>
						<Badge variant="info" dot>
							Building
						</Badge>
						<Badge variant="success" icon="check">
							Delivered
						</Badge>
						<Badge variant="warning">Queued</Badge>
						<Badge variant="error" dot>
							Failed
						</Badge>
						<Badge variant="outline">Preview</Badge>
						<Badge variant="inverse">Pro</Badge>
						<Badge variant="success" size="sm">
							sm
						</Badge>
					</View>
				</Panel>
			</Section>

			<Section
				title="Counter on an anchor"
				description="0 hides the counter; above 99 it shows 99+. The dot animates in and out."
			>
				<Panel>
					<View
						className="flex-row items-center"
						style={{ gap: tokens.spacing[6] }}
					>
						{/* Static: the badge appears and disappears at once. */}
						<Badge.Anchor
							badge={
								hidden ? null : (
									<Badge
										count={count}
										accessibilityLabel={`${count} unread messages`}
									/>
								)
							}
						>
							<IconButton
								icon="search"
								variant="tinted"
								accessibilityLabel="Inbox"
								onPress={() => setCount((c) => c + 1)}
							/>
						</Badge.Anchor>
						{/* Animated: opt in by wrapping the badge in an Animated.View. */}
						<Badge.Anchor
							badge={
								hidden ? null : (
									<Animated.View entering={ZoomIn} exiting={ZoomOut}>
										<Badge dot />
									</Animated.View>
								)
							}
							placement="bottom-right"
						>
							<Avatar name="Jane Cooper" colorFromName />
						</Badge.Anchor>
						<Badge count={120} />
						<Text variant="bodySm" color="muted" style={{ flex: 1 }}>
							Press the icon to add one.
						</Text>
					</View>
					<Row label="Hide badges">
						<Switch
							value={hidden}
							onValueChange={setHidden}
							accessibilityLabel="Hide badges"
						/>
					</Row>
					<Row label="Reset counter">
						<IconButton
							icon="close"
							size="sm"
							variant="tinted"
							accessibilityLabel="Reset"
							onPress={() => setCount(0)}
						/>
					</Row>
				</Panel>
			</Section>
		</Screen>
	);
}
