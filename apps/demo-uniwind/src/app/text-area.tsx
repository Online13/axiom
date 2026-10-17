import { useState } from "react";
import { View } from "react-native";

import { Field } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { TextArea } from "@/components/ui/text-area";
import { Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const REVIEW_LENGTH = 120;

export default function TextAreaScreen() {
	const [disabled, setDisabled] = useState(false);
	const [variant, setVariant] = useState<"outline" | "filled">("outline");
	const [review, setReview] = useState("");

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
				<SegmentedControl
					options={["outline", "filled"]}
					value={variant}
					onValueChange={(value) =>
						setVariant(value as "outline" | "filled")
					}
				/>
			</Panel>

			<Section
				title="TextArea"
				description="Auto-grow from 1 to 5 lines, then scroll."
			>
				<Panel>
					<TextArea
						autoGrow
						minRows={1}
						maxRows={5}
						placeholder="Message"
						accessibilityLabel="Message"
						variant={variant}
						disabled={disabled}
					/>
					<Field disabled={disabled}>
						<Field.Label>Your review</Field.Label>
						<TextArea
							maxLength={REVIEW_LENGTH}
							value={review}
							onChangeText={setReview}
							variant={variant}
						/>
						{/* A row you write: the description and a count next to it. */}
						<View className="flex-row gap-[12px]">
							<Field.Description style={{ flex: 1 }}>
								Be specific, it helps others.
							</Field.Description>
							<Text
								variant="footnote"
								color={review.length >= REVIEW_LENGTH ? "error" : "muted"}
							>
								{review.length} / {REVIEW_LENGTH}
							</Text>
						</View>
					</Field>
					<Field disabled>
						<Field.Label>Owner reply</Field.Label>
						<TextArea defaultValue="No reply yet." minRows={2} variant={variant} />
					</Field>
				</Panel>
			</Section>
		</Screen>
	);
}
