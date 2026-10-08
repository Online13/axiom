import { ArticleCard } from "@/components/compositions/article-card";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { avatars, images } from "../fixtures";
import { notify, Rail } from "../shared";

export default function ArticleCardScreen() {
	return (
		<Screen>
			<Section
				title="ArticleCard"
				description="Cover, category, excerpt and byline."
			>
				<ArticleCard
					title="A weekend above the clouds"
					image={images.mountains}
					category="Outdoors"
					excerpt="Three huts, one ridge and the quietest sunrise of the year."
					author={{ name: "Ana Ribeiro", avatar: avatars.ana }}
					meta="Mar 12 · 6 min read"
					onPress={notify("Open the article")}
				/>
			</Section>

			<Section title="In a rail" description="Fixed width, side by side.">
				<Rail>
					<ArticleCard
						title="Twelve hours downtown"
						image={images.skyline}
						category="Cities"
						author={{ name: "Leo Martin", avatar: avatars.leo }}
						meta="4 min read"
						onPress={notify("Open the article")}
						style={{ width: 260 }}
					/>
					<ArticleCard
						title="A weekend above the clouds"
						image={images.mountains}
						category="Outdoors"
						author={{ name: "Ana Ribeiro", avatar: avatars.ana }}
						meta="6 min read"
						onPress={notify("Open the article")}
						style={{ width: 260 }}
					/>
				</Rail>
			</Section>
		</Screen>
	);
}
