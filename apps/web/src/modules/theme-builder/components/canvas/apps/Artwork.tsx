// Album covers and destination pictures: real photos from Pexels (free to use,
// no attribution required), kept local so the previews never depend on the
// network. Most are muted or black and white, so a picture never fights the
// tokens it sits next to; the radius still comes from the theme.

import dune from "../../../assets/demo/music/dune.jpg?url";
import glass from "../../../assets/demo/music/glass.jpg?url";
import hours from "../../../assets/demo/music/hours.jpg?url";
import mix from "../../../assets/demo/music/mix.jpg?url";
import tide from "../../../assets/demo/music/tide.jpg?url";
import coast from "../../../assets/demo/travel/coast.jpg?url";
import fjord from "../../../assets/demo/travel/fjord.jpg?url";
import kyoto from "../../../assets/demo/travel/kyoto.jpg?url";
import lisbon from "../../../assets/demo/travel/lisbon.jpg?url";

const photos = {
	hours, // pexels.com/photo/39110
	tide, // pexels.com/photo/20949440
	mix, // pexels.com/photo/1367192
	glass, // pexels.com/photo/2276927
	dune, // pexels.com/photo/2387793
	kyoto, // pexels.com/photo/7526805
	lisbon, // pexels.com/photo/28962469
	fjord, // pexels.com/photo/2454681
	coast, // pexels.com/photo/18912997
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
