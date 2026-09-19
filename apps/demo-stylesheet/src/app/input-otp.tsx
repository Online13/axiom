import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Panel, Row, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

// The code the demo accepts.
const CODE = "481902";

export default function InputOTPScreen() {
	const [disabled, setDisabled] = useState(false);
	const [code, setCode] = useState("");
	const [status, setStatus] = useState<
		"idle" | "verifying" | "success" | "error"
	>("idle");
	const [key, setKey] = useState("");
	const [pin, setPin] = useState("");

	const verify = (value: string) => {
		setStatus("verifying");
		setTimeout(() => setStatus(value === CODE ? "success" : "error"), 600);
	};

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

			<Section
				title="Verify a code"
				description={`Type or paste ${CODE}. Any other code shakes the cells.`}
			>
				<Panel>
					<InputOTP
						autoFocus={false}
						value={code}
						onChange={(value) => {
							if (status === "error") setStatus("idle");
							setCode(value);
						}}
						onComplete={verify}
						error={status === "error"}
						success={status === "success"}
						disabled={
							disabled || status === "verifying" || status === "success"
						}
					/>
					<Text
						variant="bodySm"
						align="center"
						color={
							status === "error"
								? "error"
								: status === "success"
									? "success"
									: "muted"
						}
					>
						{status === "verifying"
							? "Checking…"
							: status === "error"
								? "That code doesn't match."
								: status === "success"
									? "Number verified"
									: "Enter the 6-digit code."}
					</Text>
					<Button
						variant="ghost"
						onPress={() => {
							setCode("");
							setStatus("idle");
						}}
					>
						Reset
					</Button>
				</Panel>
			</Section>

			<Section
				title="Grouped license key"
				description="Alphanumeric, split 3 + 3. Spaces and dashes are dropped on paste."
			>
				<Panel>
					<InputOTP
						size="sm"
						autoFocus={false}
						type="alphanumeric"
						autoCapitalize="characters"
						groups={[3, 3]}
						value={key}
						onChange={(value) => setKey(value.toUpperCase())}
						disabled={disabled}
						accessibilityLabel="Gift card code"
					/>
				</Panel>
			</Section>

			<Section
				title="PIN"
				description="secure draws dots instead of digits."
			>
				<Panel>
					<InputOTP
						length={4}
						secure
						autoFocus={false}
						value={pin}
						onChange={setPin}
						disabled={disabled}
						accessibilityLabel="PIN"
					/>
				</Panel>
			</Section>
		</Screen>
	);
}
