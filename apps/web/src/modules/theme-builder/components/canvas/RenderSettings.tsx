import { observer } from "@legendapp/state/react";
import { Smartphone, Tablet } from "lucide-react";
import { type DeviceKind, ui$ } from "../../state/ui";

const devices: { id: DeviceKind; label: string; Icon: typeof Smartphone }[] = [
	{ id: "ios", label: "iPhone", Icon: Smartphone },
	{ id: "android", label: "Android", Icon: Tablet },
];

/** The device shell the mockups are drawn in. */
export const RenderSettings = observer(function RenderSettings() {
	const device = ui$.device.get();
	// The sheet has no device shell.
	const phones = ui$.view.get() === "preview";

	if (!phones) return null;
	return (
		<div
			className="tb-segmented tb-float"
			role="group"
			aria-label="Device mockup"
		>
			{devices.map(({ id, label, Icon }) => (
				<button
					key={id}
					type="button"
					aria-pressed={device === id}
					onClick={() => ui$.device.set(id)}
				>
					<Icon size={14} aria-hidden="true" />
					{label}
				</button>
			))}
		</div>
	);
});
