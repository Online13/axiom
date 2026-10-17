import {
	Text,
	type TextColor,
	type TextVariant,
	type TextWeight,
} from "@/components/ui/text";
import { Label, Panel, Section } from "@/demo/section";
import { Screen } from "@/demo/screen";

const TEXT_VARIANTS: TextVariant[] = [
	"bodyLg",
	"body",
	"bodySm",
	"footnote",
	"caption",
];
const TEXT_COLORS: TextColor[] = [
	"default",
	"muted",
	"subtle",
	"disabled",
	"link",
	"success",
	"warning",
	"error",
];
const WEIGHTS: TextWeight[] = ["regular", "medium", "semibold", "bold"];

export default function TextScreen() {
	return (
		<Screen>
			<Section title="Text variants">
				<Panel>
					{TEXT_VARIANTS.map((variant) => (
						<Text key={variant} variant={variant}>
							{variant} · The quick brown fox jumps over the lazy dog.
						</Text>
					))}
				</Panel>
			</Section>

			<Section title="Colors">
				<Panel>
					{TEXT_COLORS.map((color) => (
						<Text key={color} color={color}>
							{color}
						</Text>
					))}
				</Panel>
			</Section>

			<Section title="Weight, alignment, nesting">
				<Panel>
					{WEIGHTS.map((weight) => (
						<Text key={weight} weight={weight}>
							{weight}
						</Text>
					))}
					<Text align="center">align center</Text>
					<Text align="right">align right</Text>
					<Text variant="bodySm" color="muted">
						A nested Text keeps the parent’s variant and color:{" "}
						<Text weight="semibold">semibold only</Text>, then{" "}
						<Text color="link">a link color</Text>.
					</Text>
					<Label muted>numberOfLines={1}</Label>
					<Text numberOfLines={1}>
						A very long line that doesn’t fit on the screen gets truncated
						with an ellipsis at the end.
					</Text>
				</Panel>
			</Section>
		</Screen>
	);
}
