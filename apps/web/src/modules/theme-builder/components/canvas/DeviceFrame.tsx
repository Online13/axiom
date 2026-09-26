import { observer } from "@legendapp/state/react";
import { type MouseEvent, type ReactNode, useRef } from "react";
import { roleForVariable } from "../../lib/theme";
import { announce, back, ui$ } from "../../state/ui";
import { focusScreen } from "./camera";
import { inspect } from "./inspect";

const pick = (event: MouseEvent<HTMLDivElement>) =>
	inspect(event.target as Element, event.currentTarget);

/**
 * Shows the roles that paint the part in the sidebar, text first. A part drawn
 * with a raw palette step has no role to change.
 */
function focus(variables: (string | undefined)[]) {
	const paths = [
		...new Set(
			variables
				.filter((variable): variable is string => !!variable)
				.map(roleForVariable)
				.filter((path) => path !== undefined),
		),
	];
	if (!paths.length) {
		announce("This part uses a fixed palette step, not a role.");
		return;
	}
	back();
	ui$.sections.colors.set(true);
	ui$.focusedRoles.set({ paths, at: Date.now() });
}

/**
 * A phone drawn at real device points and scaled down, so the previews use real
 * sizes. iOS is an iPhone 15 (393 × 852) with the Dynamic Island; Android is a
 * Pixel-shaped 412 × 915 with a punch-hole camera and a gesture bar.
 */
export const DeviceFrame = observer(function DeviceFrame({
	label,
	caption,
	grouped,
	children,
}: {
	label: string;
	caption?: string;
	grouped?: boolean;
	children: ReactNode;
}) {
	const device = ui$.device.get();
	const hovered = useRef<Element | null>(null);

	// The outline is a DOM attribute, not React state: hovering must not
	// re-render the mockup under the pointer.
	const outline = (element: Element | null) => {
		if (hovered.current === element) return;
		hovered.current?.removeAttribute("data-tb-inspect");
		hovered.current = element;
		element?.setAttribute("data-tb-inspect", "");
	};

	return (
		<figure className="tb-device">
			<div className="tb-phone" data-device={device}>
				<div
					className="ax-screen"
					data-device={device}
					data-grouped={grouped ? "true" : undefined}
					// The mockups are pictures, not apps: nothing inside is focusable.
					// Pointing at a part outlines it; clicking brings the phone to the
					// middle of the canvas and opens the part's colors in the sidebar,
					// which is where they are edited from the keyboard.
					onMouseOver={(event) => outline(pick(event)?.element ?? null)}
					onMouseLeave={() => outline(null)}
					onClick={(event) => {
						const phone = event.currentTarget.parentElement;
						if (phone) focusScreen(phone);
						const hit = pick(event);
						if (hit) focus([hit.text, hit.background, hit.border]);
					}}
				>
					<div className="ax-status" aria-hidden="true">
						<span>9:41</span>
						{device === "ios" ? (
							<span className="ax-island" />
						) : (
							<span className="ax-punchhole" />
						)}
						<StatusIcons />
					</div>
					<div className="ax-viewport" aria-label={label}>
						{children}
					</div>
					<div className="ax-home" aria-hidden="true" />
				</div>
			</div>
			{caption && (
				<figcaption className="tb-device__caption">{caption}</figcaption>
			)}
		</figure>
	);
});

const StatusIcons = () => (
	<svg
		width="44"
		height="12"
		viewBox="0 0 44 12"
		fill="currentColor"
		aria-hidden="true"
	>
		<rect x="0" y="7" width="3" height="4" rx="1" />
		<rect x="4.5" y="5" width="3" height="6" rx="1" />
		<rect x="9" y="3" width="3" height="8" rx="1" />
		<rect x="13.5" y="1" width="3" height="10" rx="1" />
		<rect
			x="21"
			y="1"
			width="20"
			height="10"
			rx="3"
			fill="none"
			stroke="currentColor"
			strokeOpacity="0.4"
		/>
		<rect x="23" y="3" width="14" height="6" rx="1.5" />
		<rect x="42" y="4" width="1.5" height="4" rx="0.75" opacity="0.4" />
	</svg>
);
