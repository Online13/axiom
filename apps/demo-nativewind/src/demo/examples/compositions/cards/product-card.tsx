import { Image } from "react-native";

import { ProductCard } from "@/components/compositions/product-card";
import { ProductCardSpotlight } from "@/components/compositions/product-card-spotlight";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { images } from "../fixtures";
import { Columns, notify, Rail } from "../shared";

const { products } = images;

export default function ProductCardScreen() {
	return (
		<Screen>
			<Section
				title="ProductCard"
				description="Outlined card, 3:4, image edge to edge, price under the name."
			>
				<Rail>
					<ProductCard
						title="Chambray shirt"
						subtitle="Indigo, 3 colors"
						price="$48.00"
						badge="New"
						media={
							<Image
								source={products.chambrayShirt}
								className="w-full flex-1"
							/>
						}
						onPress={notify("Open Chambray shirt")}
						onAction={notify("Added to cart")}
						style={{ width: 240 }}
					/>
					<ProductCard
						title="City daypack"
						subtitle="Navy, 18 L"
						price="$72.00"
						media={
							<Image
								source={products.daypack}
								className="w-full flex-1"
							/>
						}
						onPress={notify("Open City daypack")}
						onAction={notify("Added to cart")}
						style={{ width: 240 }}
					/>
					<ProductCard
						title="Steel bottle"
						subtitle="Sage, 500 ml"
						price="$25.60"
						badge="-20%"
						media={
							<Image
								source={products.steelBottle}
								className="w-full flex-1"
							/>
						}
						onPress={notify("Open Steel bottle")}
						onAction={notify("Added to cart")}
						style={{ width: 240 }}
					/>
				</Rail>
			</Section>

			<Section
				title="ProductCardSpotlight"
				description="Filled card, cut-out product on the card's background, price first."
			>
				<Columns>
					<ProductCardSpotlight
						title="Steel bottle"
						subtitle="Sage, 500 ml"
						price="$25.60"
						badge="-20%"
						media={
							<Image
								source={products.steelBottleCutout}
								resizeMode="contain"
								className="w-full h-full"
							/>
						}
						onPress={notify("Open Steel bottle")}
						style={{ flex: 1 }}
					/>
					<ProductCardSpotlight
						title="City daypack"
						subtitle="Navy, 18 L"
						price="$72.00"
						media={
							<Image
								source={products.daypackCutout}
								resizeMode="contain"
								className="w-full h-full"
							/>
						}
						onPress={notify("Open City daypack")}
						style={{ flex: 1 }}
					/>
				</Columns>
				<Columns>
					<ProductCardSpotlight
						title="Everyday tee"
						subtitle="Black, S to XL"
						price="$29.00"
						badge="New"
						media={
							<Image
								source={products.blackTeeCutout}
								resizeMode="contain"
								className="w-full h-full"
							/>
						}
						onPress={notify("Open Everyday tee")}
						style={{ flex: 1 }}
					/>
					<ProductCardSpotlight
						title="Chambray shirt"
						subtitle="Indigo, 3 colors"
						price="$48.00"
						media={
							<Image
								source={products.chambrayShirtCutout}
								resizeMode="contain"
								className="w-full h-full"
							/>
						}
						onPress={notify("Open Chambray shirt")}
						style={{ flex: 1 }}
					/>
				</Columns>
			</Section>

		</Screen>
	);
}
