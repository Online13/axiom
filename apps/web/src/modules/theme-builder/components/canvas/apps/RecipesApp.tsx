// Sauté — a cooking app. The image-heavy one: media surfaces, cards, ratings
// and a step list, which is where the accent tints and the subtle backgrounds
// get judged.

import {
	Bookmark,
	ChevronLeft,
	Clock,
	Flame,
	Heart,
	Home,
	Search,
	ShoppingBag,
	Star,
	User,
	Users,
} from "lucide-react";
import { DeviceFrame } from "../DeviceFrame";

const featured = [
	["Miso butter ramen", "40 min · Japanese", "4.8"],
	["Charred broccoli salad", "20 min · Sides", "4.6"],
	["Saffron rice bowl", "35 min · Persian", "4.9"],
] as const;

const ingredients = [
	["Ramen noodles", "2 portions"],
	["White miso", "2 tbsp"],
	["Unsalted butter", "40 g"],
	["Soft-boiled eggs", "2"],
	["Spring onion", "1 stalk"],
] as const;

const steps = [
	["Build the broth", "Whisk miso into the hot stock until it dissolves."],
	["Melt the butter", "Swirl it in off the heat so the broth stays glossy."],
	["Cook the noodles", "Three minutes, no more — they finish in the bowl."],
] as const;

export function RecipesApp() {
	return (
		<>
			<DeviceFrame label="Recipe feed" caption="Discover">
				<div className="ax-appbar">
					<span className="ax-appbar-slot">
						<span className="ax-avatar" data-size="sm" data-photo="1">
							NR
						</span>
					</span>
					<span className="ax-appbar-title">Sauté</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-icon-btn">
							<Bookmark className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
					</span>
				</div>
				<div className="ax-large-heading">Tonight</div>

				<div className="ax-body">
					<div className="ax-searchbar">
						<Search className="ax-glyph" size={18} strokeWidth={1.9} />
						<span className="ax-placeholder">Search recipes</span>
					</div>
				</div>

				<div className="ax-chips">
					<span className="ax-chip" data-size="sm" data-selected>
						Quick
					</span>
					<span className="ax-chip" data-size="sm">
						Veg
					</span>
					<span className="ax-chip" data-size="sm">
						Comfort
					</span>
					<span className="ax-chip" data-size="sm">
						Baking
					</span>
				</div>

				<div className="ax-body">
					<div className="ax-card">
						<div className="ax-media" style={{ height: 150 }} />
						<div className="ax-card-content">
							<div className="ax-row" data-justify="between">
								<span className="ax-badge" data-variant="warning">
									Trending
								</span>
								<span className="ax-footnote ax-muted">
									<Star className="ax-glyph" size={12} strokeWidth={2} /> 4.8
								</span>
							</div>
							<div className="ax-title3">Miso butter ramen</div>
							<div className="ax-footnote ax-muted">
								40 min · Serves 2 · Japanese
							</div>
						</div>
					</div>
				</div>

				<div className="ax-section">Saved for later</div>
				<div className="ax-list" data-inset>
					{featured.map(([title, meta, rating]) => (
						<div className="ax-item" key={title}>
							<span className="ax-media" style={{ width: 48, height: 48 }} />
							<span className="ax-item-content">
								<span className="ax-item-title">{title}</span>
								<span className="ax-item-desc">{meta}</span>
							</span>
							<span className="ax-item-trailing">
								<Star className="ax-glyph" size={14} strokeWidth={2} />
								{rating}
							</span>
						</div>
					))}
				</div>

				<div className="ax-fill" />
				<div className="ax-tabbar">
					<span className="ax-tabbar-item" data-active>
						<Home className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Discover</span>
					</span>
					<span className="ax-tabbar-item">
						<Heart className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Saved</span>
					</span>
					<span className="ax-tabbar-item">
						<ShoppingBag className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Basket</span>
					</span>
					<span className="ax-tabbar-item">
						<User className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>You</span>
					</span>
				</div>
			</DeviceFrame>

			<DeviceFrame label="Recipe detail" caption="Recipe">
				<div className="ax-appbar" data-border>
					<span className="ax-appbar-slot">
						<span className="ax-appbar-back">
							<ChevronLeft className="ax-glyph" size={22} strokeWidth={1.9} />
							Discover
						</span>
					</span>
					<span className="ax-appbar-title">Ramen</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-icon-btn">
							<Heart className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
					</span>
				</div>

				<div className="ax-media" style={{ height: 170 }} />

				<div className="ax-body">
					<div className="ax-title2">Miso butter ramen</div>
					<div className="ax-subhead ax-muted">
						A weeknight bowl that tastes like it took all day.
					</div>

					<div className="ax-row" style={{ gap: 8 }}>
						<span className="ax-chip" data-size="sm">
							<Clock className="ax-glyph" size={13} strokeWidth={2} />
							40 min
						</span>
						<span className="ax-chip" data-size="sm">
							<Users className="ax-glyph" size={13} strokeWidth={2} />
							Serves 2
						</span>
						<span className="ax-chip" data-size="sm">
							<Flame className="ax-glyph" size={13} strokeWidth={2} />
							Medium
						</span>
					</div>

					<div className="ax-segmented">
						<span data-active>Ingredients</span>
						<span>Method</span>
						<span>Notes</span>
					</div>
				</div>

				<div className="ax-list" data-variant="outlined" style={{ marginInline: 16 }}>
					{ingredients.map(([item, amount]) => (
						<div className="ax-item" key={item}>
							<span className="ax-checkbox" />
							<span className="ax-item-content">
								<span className="ax-item-title">{item}</span>
							</span>
							<span className="ax-item-trailing">{amount}</span>
						</div>
					))}
				</div>

				<div className="ax-fill" />

				<div className="ax-body">
					<div className="ax-row">
						<span className="ax-btn" data-variant="outline" data-block style={{ flex: 1 }}>
							Add to basket
						</span>
						<span className="ax-btn" data-block style={{ flex: 1 }}>
							Start cooking
						</span>
					</div>
				</div>
				<div style={{ height: 24 }} />
			</DeviceFrame>

			<DeviceFrame label="Cooking mode" caption="Method" grouped>
				<div className="ax-appbar">
					<span className="ax-appbar-slot">
						<span className="ax-appbar-back">
							<ChevronLeft className="ax-glyph" size={22} strokeWidth={1.9} />
							Recipe
						</span>
					</span>
					<span className="ax-appbar-title">Step 2 of 3</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-link ax-text">Exit</span>
					</span>
				</div>

				<div className="ax-body">
					<div className="ax-progress">
						<span style={{ width: "66%" }} />
					</div>
				</div>

				<div className="ax-section">Method</div>
				<div className="ax-list" data-inset>
					{steps.map(([title, detail], index) => (
						<div className="ax-item" key={title}>
							<span className="ax-tile" data-color={index === 1 ? "accent" : "subtle"}>
								{index + 1}
							</span>
							<span className="ax-item-content">
								<span className="ax-item-title">{title}</span>
								<span className="ax-item-desc">{detail}</span>
							</span>
						</div>
					))}
				</div>

				<div className="ax-body">
					<div className="ax-card">
						<div className="ax-card-content">
							<span className="ax-footnote ax-muted">Timer</span>
							<div className="ax-title1">03:00</div>
							<div className="ax-row" style={{ marginTop: 12 }}>
								<span className="ax-btn" data-variant="outline" data-block style={{ flex: 1 }}>
									Reset
								</span>
								<span className="ax-btn" data-block style={{ flex: 1 }}>
									Pause
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="ax-fill" />
			</DeviceFrame>
		</>
	);
}
