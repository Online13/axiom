import { Title, type TitleVariant } from "@/components/ui/title";
import { Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const TITLE_VARIANTS: TitleVariant[] = [
	"display",
	"headingLg",
	"heading",
	"headingSm",
	"subheading",
];

export default function TitleScreen() {
	return (
		<Screen>
			<Section
				title="Title"
				description="Announced as a heading by screen readers."
			>
				<Panel>
					{TITLE_VARIANTS.map((variant) => (
						<Title key={variant} variant={variant} numberOfLines={1}>
							{variant}
						</Title>
					))}
					<Title variant="subheading" color="muted">
						subheading · muted
					</Title>
				</Panel>
			</Section>
		</Screen>
	);
}
