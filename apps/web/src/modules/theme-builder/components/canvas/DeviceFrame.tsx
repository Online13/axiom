import { observer } from "@legendapp/state/react";
import type { ReactNode } from "react";
import { ui$ } from "../../state/ui";

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

	return (
		<figure className="tb-device">
			<div className="tb-phone" data-device={device}>
				<div
					className="ax-screen"
					data-device={device}
					data-grouped={grouped ? "true" : undefined}
					// The mockups are pictures, not apps: nothing inside is focusable.
					inert
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
			{caption && <figcaption className="tb-device__caption">{caption}</figcaption>}
		</figure>
	);
});

const StatusIcons = () => (
	<svg width="44" height="12" viewBox="0 0 44 12" fill="currentColor" aria-hidden="true">
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
