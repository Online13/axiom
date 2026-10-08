import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { IconButton } from "@/components/ui/icon-button";
import { Menu } from "@/components/ui/menu";
import { Separator } from "@/components/ui/separator";
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
						<ButtonGroup style={{ alignSelf: "stretch" }}>
							<Button
								style={{ borderRadius: 0, flex: 1 }}
								onPress={() => setLastAction("Download PDF")}
							>
								Download PDF
							</Button>
							<Separator orientation="vertical" />
							<Menu.Trigger asChild>
								<IconButton
									icon="chevron-down"
									accessibilityLabel="Other formats"
									variant="solid"
									shape="square"
									style={{ borderRadius: 0 }}
								/>
							</Menu.Trigger>
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
				description="Ghost buttons in a bordered group read as one control."
			>
				<Panel>
					<ButtonGroup bordered>
						<IconButton
							icon="minus"
							variant="ghost"
							shape="square"
							size="sm"
							accessibilityLabel="Remove one"
							disabled={quantity <= 1}
							style={{ borderRadius: 0 }}
							onPress={() => setQuantity((value) => value - 1)}
						/>
						<Separator orientation="vertical" />
						<Button
							variant="ghost"
							size="sm"
							disabled
							style={{ borderRadius: 0 }}
						>
							{quantity}
						</Button>
						<Separator orientation="vertical" />
						<IconButton
							icon="add"
							variant="ghost"
							shape="square"
							size="sm"
							accessibilityLabel="Add one"
							style={{ borderRadius: 0 }}
							onPress={() => setQuantity((value) => value + 1)}
						/>
					</ButtonGroup>
				</Panel>
			</Section>

			<Section
				title="Pill"
				description="A large radius rounds the group's outer corners into a pill."
			>
				<Panel>
					<ButtonGroup radius={999} bordered>
						<Button variant="ghost" style={{ borderRadius: 0 }}>
							Day
						</Button>
						<Separator orientation="vertical" />
						<Button variant="ghost" style={{ borderRadius: 0 }}>
							Week
						</Button>
						<Separator orientation="vertical" />
						<Button variant="ghost" style={{ borderRadius: 0 }}>
							Month
						</Button>
					</ButtonGroup>
				</Panel>
			</Section>

			<Section
				title="Vertical"
				description="A stack of actions with a line between each."
			>
				<Panel>
					<ButtonGroup
						orientation="vertical"
						bordered
						style={{ alignSelf: "stretch" }}
					>
						<Button variant="ghost" fullWidth style={{ borderRadius: 0 }}>
							Edit
						</Button>
						<Separator />
						<Button variant="ghost" fullWidth style={{ borderRadius: 0 }}>
							Duplicate
						</Button>
						<Separator />
						<Button variant="ghost" fullWidth style={{ borderRadius: 0 }}>
							Archive
						</Button>
					</ButtonGroup>
				</Panel>
			</Section>
		</Screen>
	);
}
