import { useState } from "react";
import { View } from "react-native";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { useTheme } from "@/theme";

export default function AccordionScreen() {
	const { tokens } = useTheme();
	const [open, setOpen] = useState<string[]>(["shipping"]);

	return (
		<Screen>
			<Section
				title="Accordion"
				description={`Multiple. Open: ${open.join(", ") || "none"}`}
			>
				<Panel>
					<Accordion
						type="multiple"
						value={open}
						onValueChange={(value) => setOpen(value as string[])}
					>
						<Accordion.Item value="shipping">
							<Accordion.Trigger>Shipping</Accordion.Trigger>
							<Accordion.Content>
								Orders ship within 2 business days, from our warehouse
								in Lyon.
							</Accordion.Content>
						</Accordion.Item>
						<Separator />
						<Accordion.Item value="returns">
							<Accordion.Trigger>Returns</Accordion.Trigger>
							<Accordion.Content>
								<View style={{ gap: tokens.spacing[2] }}>
									<Text variant="bodySm" color="muted">
										Return any item within 30 days. Custom content can
										hold anything.
									</Text>
									<Button size="sm" variant="outline">
										Start a return
									</Button>
								</View>
							</Accordion.Content>
						</Accordion.Item>
						<Separator />
						<Accordion.Item value="gift" disabled>
							<Accordion.Trigger>
								Gift cards (disabled)
							</Accordion.Trigger>
							<Accordion.Content>Unavailable.</Accordion.Content>
						</Accordion.Item>
					</Accordion>
				</Panel>
				<Panel>
					<Label muted>Single, collapsible</Label>
					<Accordion defaultValue="a">
						<Accordion.Item value="a">
							<Accordion.Trigger>First</Accordion.Trigger>
							<Accordion.Content>
								Opening another section closes this one.
							</Accordion.Content>
						</Accordion.Item>
						<Separator />
						<Accordion.Item value="b">
							<Accordion.Trigger>Second</Accordion.Trigger>
							<Accordion.Content forceMount>
								Kept mounted while closed.
							</Accordion.Content>
						</Accordion.Item>
					</Accordion>
				</Panel>
			</Section>
		</Screen>
	);
}
