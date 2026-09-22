import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Menu } from "@/components/ui/menu";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function ButtonGroupScreen() {
	const [quantity, setQuantity] = useState(2);
	const [lastAction, setLastAction] = useState("None");

	return (
		<Screen>
			<Section
				title="Split button"
				description="The main action fills the row; the menu trigger stays compact."
			>
				<Panel>
					<Menu.Root>
						<ButtonGroup fullWidth>
							<Button onPress={() => setLastAction("Download PDF")}>
								Download PDF
							</Button>
							<ButtonGroup.Item
								grow={false}
								render={({
									containerStyle,
									buttonStyle,
									size,
									disabled,
								}) => (
									<Menu.Trigger
										action="press"
										asChild
										style={containerStyle}
									>
										<IconButton
											icon="chevron-down"
											accessibilityLabel="Other formats"
											variant="solid"
											shape="square"
											size={size}
											disabled={disabled}
											style={buttonStyle}
										/>
									</Menu.Trigger>
								)}
							/>
						</ButtonGroup>
						<Menu.Content>
							<Menu.Item onPress={() => setLastAction("Download CSV")}>
								Download CSV
							</Menu.Item>
							<Menu.Item onPress={() => setLastAction("Download XLSX")}>
								Download XLSX
							</Menu.Item>
						</Menu.Content>
					</Menu.Root>
					<Label muted>Last action: {lastAction}</Label>
				</Panel>
			</Section>

			<Section
				title="Stepper"
				description="Three attached controls for one quantity."
			>
				<Panel>
					<ButtonGroup variant="outline" size="sm">
						<IconButton
							icon="minus"
							shape="square"
							accessibilityLabel="Remove one"
							disabled={quantity <= 1}
							onPress={() => setQuantity((value) => value - 1)}
						/>
						<Button disabled>{quantity}</Button>
						<IconButton
							icon="add"
							shape="square"
							accessibilityLabel="Add one"
							onPress={() => setQuantity((value) => value + 1)}
						/>
					</ButtonGroup>
				</Panel>
			</Section>

			<Section
				title="Dialog actions"
				description="Two spaced actions share the dialog width."
			>
				<Panel>
					<Dialog.Root>
						<Dialog.Trigger asChild>
							<Button variant="outline">Leave the call</Button>
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Title>Leave the call?</Dialog.Title>
							<Dialog.Description>
								The others can keep talking.
							</Dialog.Description>
							<Dialog.Actions>
								<ButtonGroup
									attached={false}
									fullWidth
									style={{ flex: 1 }}
								>
									<Dialog.Cancel>Stay</Dialog.Cancel>
									<Dialog.Action
										onPress={() => setLastAction("Left the call")}
									>
										Leave
									</Dialog.Action>
								</ButtonGroup>
							</Dialog.Actions>
						</Dialog.Content>
					</Dialog.Root>
				</Panel>
			</Section>
		</Screen>
	);
}
