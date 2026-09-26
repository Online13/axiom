// Onboarding: almost nothing on screen, then selection, then form controls in
// a context that needs them. Welcome shows the theme at its barest.

import { Check, Plus } from "lucide-react";
import { Artwork, type Cover } from "./Artwork";
import { selected, Steps, Wordmark } from "./chrome";
import { space } from "./space";

export function Welcome() {
	return (
		<>
			<div style={{ padding: space(8, 16, 0) }}>
				<Artwork
					cover="library"
					size="fill"
					height={340}
					radius="xl"
					label="Tall shelves in a quiet reading room"
				/>
			</div>
			<div className="ax-stack" data-gap="12" style={{ padding: space(32, 24, 0) }}>
				<Wordmark />
				<span className="ax-large-title">Keep what matters</span>
				<span className="ax-text ax-muted">
					Essays, stories and ideas worth coming back to, chosen by people who
					care and saved in one calm place.
				</span>
			</div>
			<div className="ax-fill" />
			<div className="ax-stack" data-gap="8" style={{ padding: space(0, 24, 44) }}>
				<span className="ax-btn" data-size="lg" data-block>
					Get started
				</span>
				<span className="ax-btn" data-variant="outline" data-size="lg" data-block>
					I already have an account
				</span>
			</div>
		</>
	);
}

const topicCards: readonly [string, Cover, string, boolean][] = [
	["Design", "plans", "2.4k stories", true],
	["Architecture", "quay", "1.8k stories", true],
	["Photography", "ridge", "960 stories", false],
	["Cities", "tram", "1.1k stories", false],
];

const topicChips: readonly [string, boolean][] = [
	["Culture", true],
	["Technology", false],
	["Science", false],
	["Product", false],
	["Writing", true],
	["Publishing", false],
];

export function Interests() {
	return (
		<>
			<Steps step={1} of={2} />
			<div className="ax-stack" data-gap="8" style={{ padding: space(24, 20, 0) }}>
				<span className="ax-title1">What are you into?</span>
				<span className="ax-subhead ax-muted">
					Pick three or more. Home starts from these, and you can change them
					any time.
				</span>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: space(12),
					padding: space(20, 20, 0),
				}}
			>
				{topicCards.map(([name, cover, count, on]) => (
					<span
						key={name}
						className="ax-card"
						data-variant="outlined"
						style={{ padding: space(4), ...(on ? selected : undefined) }}
					>
						<span style={{ position: "relative" }}>
							<Artwork cover={cover} size="fill" height={92} radius="md" />
							{on && (
								<span
									className="ax-checkbox"
									data-checked
									style={{ position: "absolute", top: 8, right: 8 }}
								>
									<Check size={14} strokeWidth={3} />
								</span>
							)}
						</span>
						<span className="ax-stack" style={{ gap: 0, padding: space(8, 8, 6) }}>
							<span className="ax-headline">{name}</span>
							<span className="ax-caption ax-muted">{count}</span>
						</span>
					</span>
				))}
			</div>

			<div className="ax-row" data-wrap style={{ padding: space(16, 20, 0) }}>
				{topicChips.map(([name, on]) => (
					<span key={name} className="ax-chip" data-selected={on || undefined}>
						{on ? (
							<Check className="ax-glyph" size={16} strokeWidth={2.4} />
						) : (
							<Plus className="ax-glyph" size={16} strokeWidth={2.2} />
						)}
						{name}
					</span>
				))}
			</div>

			<div className="ax-fill" />
			<div style={{ padding: space(12, 20, 44) }}>
				<span className="ax-btn" data-size="lg" data-block>
					Continue · 4 selected
				</span>
			</div>
		</>
	);
}

const briefs = [
	["Daily brief", "Five stories, every morning at 8", true],
	["Weekly digest", "The best of the week, on Sundays", false],
] as const;

export function Personalize() {
	return (
		<>
			<Steps step={2} of={2} />
			<div className="ax-stack" data-gap="8" style={{ padding: space(24, 20, 0) }}>
				<span className="ax-title1">Make it yours</span>
				<span className="ax-subhead ax-muted">
					A few choices to tune what shows up first.
				</span>
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(20, 20, 0) }}>
				<span className="ax-label">How long do you like to read?</span>
				<div className="ax-segmented">
					<span>Quick</span>
					<span data-active>Mixed</span>
					<span>Long reads</span>
				</div>
			</div>

			<div className="ax-stack" data-gap="8" style={{ padding: space(20, 20, 0) }}>
				<span className="ax-label">Your reading brief</span>
				{briefs.map(([title, detail, on]) => (
					<span
						key={title}
						className="ax-card"
						data-variant="outlined"
						style={
							on
								? { ...selected, background: "var(--ax-primary-subtle)" }
								: undefined
						}
					>
						<span className="ax-choice" style={{ padding: space(12, 14) }}>
							<span className="ax-radio" data-checked={on || undefined} />
							<span className="ax-stack" style={{ gap: space(2) }}>
								<span className="ax-headline">{title}</span>
								<span className="ax-footnote ax-muted">{detail}</span>
							</span>
						</span>
					</span>
				))}
			</div>

			<div className="ax-list" data-variant="outlined" style={{ margin: space(16, 20, 0) }}>
				<div className="ax-item">
					<span className="ax-item-content">
						<span className="ax-item-title">Audio versions</span>
					</span>
					<span className="ax-switch" />
				</div>
				<div className="ax-item">
					<span className="ax-item-content">
						<span className="ax-item-title">Picks from people I follow</span>
					</span>
					<span className="ax-switch" data-checked />
				</div>
			</div>

			<div className="ax-card" data-variant="filled" style={{ margin: space(16, 20, 0) }}>
				<div className="ax-stack" data-gap="8" style={{ padding: space(12, 14) }}>
					<span className="ax-caption ax-muted">YOUR INDEX</span>
					<span className="ax-row" data-wrap style={{ gap: space(6) }}>
						{["Design", "Architecture", "Culture", "Writing"].map((topic) => (
							<span key={topic} className="ax-badge" data-variant="outline">
								{topic}
							</span>
						))}
					</span>
					<span className="ax-footnote">Mixed lengths · Daily brief at 8:00</span>
				</div>
			</div>

			<div className="ax-fill" />
			<div style={{ padding: space(12, 20, 44) }}>
				<span className="ax-btn" data-size="lg" data-block>
					Start exploring
				</span>
			</div>
		</>
	);
}
