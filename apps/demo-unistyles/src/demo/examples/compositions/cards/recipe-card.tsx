import { RecipeCard } from "@/components/compositions/recipe-card";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { images } from "../fixtures";
import { notify } from "../shared";

export default function RecipeCardScreen() {
	return (
		<Screen>
			<Section
				title="RecipeCard"
				description="Stats, ingredients and a cook button."
			>
				<RecipeCard
					title="Thai red curry"
					description="A fragrant, spicy curry with coconut milk, lemongrass and fresh Thai basil."
					image={images.redCurry}
					badge="Spicy choice"
					stats={[
						{ icon: "time", value: "20", label: "mins" },
						{ icon: "people", value: "4", label: "servings" },
						{ icon: "calories", value: "540", label: "kcal" },
					]}
					ingredients={[
						"Coconut milk",
						"Red curry paste",
						"Chicken",
						"Lemongrass",
						"Thai basil",
						"Lime",
					]}
					onPress={notify("Open Thai red curry")}
					onAction={notify("Start cooking")}
				/>
			</Section>
		</Screen>
	);
}
