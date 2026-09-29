import type { ListingSpec } from "@/components/compositions/listing-card";

// Bundled with the app: every example shows at once, offline, without waiting on the network.

export const images = {
	products: {
		chambrayShirt: require("@/assets/images/compositions/products/chambray-shirt.webp"),
		daypack: require("@/assets/images/compositions/products/daypack.webp"),
		smartWatch: require("@/assets/images/compositions/products/smart-watch.webp"),
		steelBottle: require("@/assets/images/compositions/products/steel-bottle.webp"),
		blackTee: require("@/assets/images/compositions/products/black-tee.webp"),
		steelBottleCutout: require("@/assets/images/compositions/products/steel-bottle-cutout.webp"),
		daypackCutout: require("@/assets/images/compositions/products/daypack-cutout.webp"),
		blackTeeCutout: require("@/assets/images/compositions/products/black-tee-cutout.webp"),
		chambrayShirtCutout: require("@/assets/images/compositions/products/chambray-shirt-cutout.webp"),
	},
	listings: {
		sunnyLoft: require("@/assets/images/compositions/listings/sunny-loft.webp"),
		whiteVilla: require("@/assets/images/compositions/listings/white-villa.webp"),
		poolVilla: require("@/assets/images/compositions/listings/pool-villa.webp"),
		redCabin: require("@/assets/images/compositions/listings/red-cabin.webp"),
		alpineLodge: require("@/assets/images/compositions/listings/alpine-lodge.webp"),
	},
	redCurry: require("@/assets/images/compositions/recipes/red-curry.webp"),
	mountains: require("@/assets/images/compositions/articles/mountains.webp"),
	skyline: require("@/assets/images/compositions/articles/skyline.webp"),
	concert: require("@/assets/images/compositions/events/concert.webp"),
	conference: require("@/assets/images/compositions/events/conference.webp"),
};

export const avatars = {
	ana: require("@/assets/images/compositions/avatars/ana.jpg"),
	leo: require("@/assets/images/compositions/avatars/leo.jpg"),
	maya: require("@/assets/images/compositions/avatars/maya.jpg"),
	noah: require("@/assets/images/compositions/avatars/noah.jpg"),
	sam: require("@/assets/images/compositions/avatars/sam.jpg"),
	waleed: require("@/assets/images/compositions/avatars/waleed.jpg"),
};

export const STAY_SPECS: ListingSpec[] = [
	{ icon: "bed", value: "2", label: "Beds" },
	{ icon: "bath", value: "1", label: "Bath" },
	{ icon: "area", value: "1,150", label: "sqft" },
];

export const HOME_SPECS: ListingSpec[] = [
	{ icon: "area", value: "29 m²", label: "Living" },
	{ icon: "bed", value: "2", label: "Rooms" },
];

export const AGENT = { name: "Waleed Sabir", avatar: avatars.waleed };
