import { observer } from "@legendapp/state/react";
import { useEffect, useRef } from "react";
import { Moon, Settings2, Smartphone, Sun, Tablet } from "lucide-react";
import { ui$, type DeviceKind } from "../../state/ui";

const devices: { id: DeviceKind; label: string; Icon: typeof Smartphone }[] = [
	{ id: "ios", label: "iPhone", Icon: Smartphone },
	{ id: "android", label: "Android", Icon: Tablet },
];

/** How the mockups are rendered — the device shell and the color scheme. */
export const RenderSettings = observer(function RenderSettings() {
	const open = ui$.settingsOpen.get();
	const device = ui$.device.get();
	const scheme = ui$.scheme.get();
	const box = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const close = (event: MouseEvent) => {
			if (!box.current?.contains(event.target as Node)) ui$.settingsOpen.set(false);
		};
		const escape = (event: KeyboardEvent) =>
			event.key === "Escape" && ui$.settingsOpen.set(false);
		document.addEventListener("mousedown", close);
		document.addEventListener("keydown", escape);
		return () => {
			document.removeEventListener("mousedown", close);
			document.removeEventListener("keydown", escape);
		};
	}, [open]);

	return (
		<div className="tb-settings" ref={box}>
			<button
				type="button"
				className="tb-iconbtn"
				aria-expanded={open}
				aria-haspopup="dialog"
				aria-label="Preview settings"
				onClick={() => ui$.settingsOpen.set(!open)}
			>
				<Settings2 size={16} aria-hidden="true" />
			</button>

			{open && (
				<div className="tb-settings__menu" role="dialog" aria-label="Preview settings">
					<div className="tb-settings__group">
						<h3 className="tb-eyebrow">Device</h3>
						<div className="tb-segmented" role="group" aria-label="Device mockup">
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
					</div>

					<div className="tb-settings__group">
						<h3 className="tb-eyebrow">Scheme</h3>
						<div className="tb-segmented" role="group" aria-label="Color scheme">
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
					</div>
				</div>
			)}
		</div>
	);
});
