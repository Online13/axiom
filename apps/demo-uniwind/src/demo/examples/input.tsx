import { useRef, useState } from "react";
import { View, type TextInput } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Field, Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { TextArea } from "@/components/ui/text-area";
import { Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const isPostcode = (value: string) =>
	/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(value.trim());

const REVIEW_LENGTH = 120;

export default function InputScreen() {
	const [disabled, setDisabled] = useState(false);
	const [variant, setVariant] = useState<"outline" | "filled">("outline");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [visible, setVisible] = useState(false);
	const [postcode, setPostcode] = useState("NW1");
	const [touched, setTouched] = useState(true);
	const [review, setReview] = useState("");
	const lastName = useRef<TextInput>(null);

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
				title="Login form"
				description="Keyboard types, autofill, a visibility toggle as suffix."
			>
				<Panel>
					<Field required disabled={disabled}>
						<Field.Label>Email</Field.Label>
						<Input
							placeholder="name@example.com"
							keyboardType="email-address"
							autoComplete="email"
							autoCapitalize="none"
							value={email}
							onChangeText={setEmail}
							variant={variant}
						/>
					</Field>
					<Field disabled={disabled}>
						<Field.Label>Password</Field.Label>
						<Input
							secureTextEntry={!visible}
							autoComplete="current-password"
							value={password}
							onChangeText={setPassword}
							variant={variant}
							suffix={
								<IconButton
									icon={visible ? "hidden" : "visible"}
									size="sm"
									accessibilityLabel={
										visible ? "Hide password" : "Show password"
									}
									disabled={disabled}
									onPress={() => setVisible(!visible)}
								/>
							}
						/>
					</Field>
				</Panel>
			</Section>

			<Section
				title="Validation on blur"
				description="The error replaces the description once the field is left."
			>
				<Panel>
					<Field disabled={disabled}>
						<Field.Label>Postcode</Field.Label>
						<Input
							autoCapitalize="characters"
							value={postcode}
							onChangeText={setPostcode}
							onFocus={() => setTouched(false)}
							onBlur={() => setTouched(true)}
							variant={variant}
						/>
						{touched && !isPostcode(postcode) ? (
							<Field.Error>Enter a valid postcode, like NW1 6XE.</Field.Error>
						) : (
							<Field.Description>Postcodes look like NW1 6XE.</Field.Description>
						)}
					</Field>
				</Panel>
			</Section>

			<Section title="Prefix, suffix and sizes">
				<Panel>
					<Input
						size="sm"
						placeholder="Search"
						prefix="#"
						variant={variant}
						disabled={disabled}
						accessibilityLabel="Tag"
					/>
					<Field disabled={disabled}>
						<Field.Label>Username</Field.Label>
						<Input prefix="@" defaultValue="kjohnson" variant={variant} />
					</Field>
					<Field disabled={disabled}>
						<Field.Label>Amount</Field.Label>
						<Input
							size="lg"
							keyboardType="decimal-pad"
							prefix="$"
							suffix="USD"
							defaultValue="120.00"
							variant={variant}
						/>
						<Field.Description>Balance: $1,240.18</Field.Description>
					</Field>
				</Panel>
			</Section>

			<Section
				title="Chain fields"
				description="The return key moves to the next field."
			>
				<Panel>
					<Field disabled={disabled}>
						<Field.Label>First name</Field.Label>
						<Input
							returnKeyType="next"
							submitBehavior="submit"
							onSubmitEditing={() => lastName.current?.focus()}
							variant={variant}
						/>
					</Field>
					<Field disabled={disabled}>
						<Field.Label>Last name</Field.Label>
						<Input ref={lastName} returnKeyType="done" variant={variant} />
					</Field>
				</Panel>
			</Section>

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
