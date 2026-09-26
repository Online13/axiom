// Story covers: real photos from Pexels (free to use, no attribution
// required), kept local so the previews never depend on the network. Most are
// muted or black and white, so a picture never fights the tokens it sits next
// to; the radius still comes from the theme.

import cabin from "../../../assets/demo/editorial/cabin.jpg?url";
import library from "../../../assets/demo/editorial/library.jpg?url";
import plans from "../../../assets/demo/editorial/plans.jpg?url";
import quay from "../../../assets/demo/editorial/quay.jpg?url";
import ridge from "../../../assets/demo/editorial/ridge.jpg?url";
import stones from "../../../assets/demo/editorial/stones.jpg?url";
import bakery from "../../../assets/demo/maps/bakery.jpg?url";
import books from "../../../assets/demo/maps/books.jpg?url";
import cafe from "../../../assets/demo/maps/cafe.jpg?url";
import counter from "../../../assets/demo/maps/counter.jpg?url";
import latte from "../../../assets/demo/maps/latte.jpg?url";
import tram from "../../../assets/demo/maps/tram.jpg?url";
import coast from "../../../assets/demo/travel/coast.jpg?url";
import fjord from "../../../assets/demo/travel/fjord.jpg?url";
import kyoto from "../../../assets/demo/travel/kyoto.jpg?url";
import lisbon from "../../../assets/demo/travel/lisbon.jpg?url";

const photos = {
	kyoto, // pexels.com/photo/7526805
	lisbon, // pexels.com/photo/28962469
	fjord, // pexels.com/photo/2454681
	coast, // pexels.com/photo/18912997
	quay, // pexels.com/photo/262367
	plans, // pexels.com/photo/1109541
	library, // pexels.com/photo/1370296
	ridge, // pexels.com/photo/1054218
	stones, // pexels.com/photo/1029604
	cabin, // pexels.com/photo/1612351
	cafe, // pexels.com/photo/1024359
	latte, // pexels.com/photo/302899
	counter, // pexels.com/photo/2159065
	bakery, // pexels.com/photo/1855214
	books, // pexels.com/photo/694740
	tram, // pexels.com/photo/2346216
} as const;

export type Cover = keyof typeof photos;

export function Artwork({
	cover,
	size,
	height,
	radius = "lg",
	label,
}: {
	cover: Cover;
	/** A square side in points, or `fill` for the full width of the parent. */
	size: number | "fill";
	/** Overrides the height for a non-square picture. */
	height?: number;
	radius?: "none" | "sm" | "md" | "lg" | "xl";
	label?: string;
}) {
	return (
		<img
			className="tb-art"
			src={photos[cover]}
			alt={label ?? ""}
			style={{
				width: size === "fill" ? "100%" : size,
				height: height ?? (size === "fill" ? "auto" : size),
				aspectRatio: size === "fill" && !height ? "1" : undefined,
				objectFit: "cover",
				borderRadius: radius === "none" ? 0 : `var(--ax-radius-${radius})`,
			}}
		/>
	);
}
