import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

export default function EmptyScreen() {
	return (
		<Screen>
			<Section
				title="Empty"
				description="Full-screen or compact, neutral or error."
			>
				<Panel>
					<Empty fill={false}>
						<Empty.Header>
							<Empty.Media icon="search" />
							<Empty.Title>No results</Empty.Title>
							<Empty.Description>
								Try another word, or check the spelling.
							</Empty.Description>
						</Empty.Header>
						<Empty.Content>
							<Button variant="outline">Clear search</Button>
						</Empty.Content>
					</Empty>
				</Panel>
				<Panel>
					<Empty size="sm" fill={false}>
						<Empty.Header>
							<Empty.Media icon="error" tone="error" />
							<Empty.Title>{"Couldn't load messages"}</Empty.Title>
							<Empty.Description>
								Check your connection.
							</Empty.Description>
						</Empty.Header>
						<Empty.Content>
							<Button size="sm">Retry</Button>
						</Empty.Content>
					</Empty>
				</Panel>
			</Section>
		</Screen>
	);
}
