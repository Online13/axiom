import { observer } from "@legendapp/state/react";
import { Moon, Smartphone, Sun, Tablet } from "lucide-react";
import { type DeviceKind, ui$ } from "../../state/ui";

const devices: { id: DeviceKind; label: string; Icon: typeof Smartphone }[] = [
	{ id: "ios", label: "iPhone", Icon: Smartphone },
	{ id: "android", label: "Android", Icon: Tablet },
];

/** How the mockups are rendered: the device shell and the color scheme. */
export const RenderSettings = observer(function RenderSettings() {
	const device = ui$.device.get();
	const scheme = ui$.scheme.get();

	return (
		<>
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

			<div
				className="tb-segmented tb-float"
				role="group"
				aria-label="Color scheme"
			>
				<button
					type="button"
					aria-pressed={scheme === "light"}
					onClick={() => ui$.scheme.set("light")}
				>
					<Sun size={14} aria-hidden="true" />
					Light
				</button>
				<button
					type="button"
					aria-pressed={scheme === "dark"}
					onClick={() => ui$.scheme.set("dark")}
				>
					<Moon size={14} aria-hidden="true" />
					Dark
				</button>
			</div>
		</>
	);
});
