import { useRef, useState } from "react";
import type { TextInput } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { TextArea } from "@/components/ui/text-area";
import { Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const isPostcode = (value: string) =>
	/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(value.trim());

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
					<Input
						label="Email"
						placeholder="name@example.com"
						keyboardType="email-address"
						autoComplete="email"
						autoCapitalize="none"
						value={email}
						onChangeText={setEmail}
						variant={variant}
						disabled={disabled}
						required
					/>
					<Input
						label="Password"
						secureTextEntry={!visible}
						autoComplete="current-password"
						value={password}
						onChangeText={setPassword}
						variant={variant}
						disabled={disabled}
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
				</Panel>
			</Section>

			<Section
				title="Validation on blur"
				description="The error replaces the helper once the field is left."
			>
				<Panel>
					<Input
						label="Postcode"
						helper="Postcodes look like NW1 6XE."
						autoCapitalize="characters"
						value={postcode}
						onChangeText={setPostcode}
						onFocus={() => setTouched(false)}
						onBlur={() => setTouched(true)}
						error={
							touched && !isPostcode(postcode)
								? "Enter a valid postcode, like NW1 6XE."
								: undefined
						}
						variant={variant}
						disabled={disabled}
					/>
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
					<Input
						label="Username"
						prefix="@"
						defaultValue="kjohnson"
						variant={variant}
						disabled={disabled}
					/>
					<Input
						label="Amount"
						size="lg"
						keyboardType="decimal-pad"
						prefix="$"
						suffix="USD"
						defaultValue="120.00"
						helper="Balance: $1,240.18"
						variant={variant}
						disabled={disabled}
					/>
				</Panel>
			</Section>

			<Section
				title="Chain fields"
				description="The return key moves to the next field."
			>
				<Panel>
					<Input
						label="First name"
						returnKeyType="next"
						submitBehavior="submit"
						onSubmitEditing={() => lastName.current?.focus()}
						variant={variant}
						disabled={disabled}
					/>
					<Input
						ref={lastName}
						label="Last name"
						returnKeyType="done"
						variant={variant}
						disabled={disabled}
					/>
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
					<TextArea
						label="Your review"
						helper="Be specific, it helps others."
						maxLength={120}
						showCount
						value={review}
						onChangeText={setReview}
						variant={variant}
						disabled={disabled}
					/>
					<TextArea
						label="Owner reply"
						defaultValue="No reply yet."
						minRows={2}
						disabled
						variant={variant}
					/>
				</Panel>
			</Section>
		</Screen>
	);
}
