import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import "./theme-switcher.css";

declare global {
	interface Window {
		/** Defined by ThemeScript.astro before first paint. */
		axiomTheme: { get(): string; set(preference: string): void };
	}
}

const options = [
	{
		value: "dark",
		label: "Dark",
		icon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
	},
	{
		value: "light",
		label: "Light",
		icon: (
			<>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
			</>
		),
	},
	{
		value: "system",
		label: "System",
		icon: (
			<>
				<rect x="3" y="4" width="18" height="12" rx="2" />
				<path d="M8 20h8M12 16v4" />
			</>
		),
	},
	{
		value: "mystery",
		label: "Mystery",
		icon: (
			<>
				<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
				<path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7Z" />
			</>
		),
	},
];

/** Menu height plus gap, to decide whether the menu fits under the trigger. */
const MENU_SPACE = 200;

/**
 * Site-wide theme picker: an icon button opening a menu of radio items. The trigger icon follows
 * <html data-theme-pref> in CSS, so it is right before hydration too. The menu opens downward,
 * or upward when there is no room below (e.g. in a footer). Colors come from the host: `color`
 * for the text, `--theme-switch-line` for borders, `--theme-switch-bg` for the menu surface.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
	const [preference, setPreference] = useState("dark");
	const [open, setOpen] = useState(false);
	const [side, setSide] = useState<"top" | "bottom">("bottom");
	const root = useRef<HTMLDivElement>(null);
	const trigger = useRef<HTMLButtonElement>(null);
	const menu = useRef<HTMLDivElement>(null);
	const menuId = useId();

	useEffect(() => {
		const sync = () => setPreference(window.axiomTheme.get());
		sync();
		window.addEventListener("axiom:themechange", sync);
		return () => window.removeEventListener("axiom:themechange", sync);
	}, []);

	useEffect(() => {
		if (!open) return;
		menu.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
		const closeOutside = (event: PointerEvent) => {
			if (!root.current?.contains(event.target as Node)) setOpen(false);
		};
		document.addEventListener("pointerdown", closeOutside);
		return () => document.removeEventListener("pointerdown", closeOutside);
	}, [open]);

	const toggle = () => {
		if (!open && trigger.current) {
			const { bottom } = trigger.current.getBoundingClientRect();
			setSide(window.innerHeight - bottom < MENU_SPACE ? "top" : "bottom");
		}
		setOpen(!open);
	};

	const close = () => {
		setOpen(false);
		trigger.current?.focus();
	};

	const choose = (value: string) => {
		window.axiomTheme.set(value);
		close();
	};

	const onMenuKeyDown = (event: KeyboardEvent) => {
		const items = [...(menu.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])];
		const index = items.indexOf(document.activeElement as HTMLElement);
		const move = (to: number) => items[(to + items.length) % items.length]?.focus();

		if (event.key === "ArrowDown") move(index + 1);
		else if (event.key === "ArrowUp") move(index - 1);
		else if (event.key === "Home") move(0);
		else if (event.key === "End") move(items.length - 1);
		else if (event.key === "Escape") close();
		else if (event.key === "Tab") setOpen(false);
		else return;
		if (event.key !== "Tab") event.preventDefault();
	};

	return (
		<div ref={root} className={className ? `theme-switch ${className}` : "theme-switch"}>
			<button
				ref={trigger}
				type="button"
				className="theme-switch__trigger"
				aria-label="Theme"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls={open ? menuId : undefined}
				onClick={toggle}
			>
				{options.map((option) => (
					<svg key={option.value} data-for={option.value} viewBox="0 0 24 24" aria-hidden="true">
						{option.icon}
					</svg>
				))}
			</button>
			{open && (
				<div
					ref={menu}
					id={menuId}
					role="menu"
					aria-label="Theme"
					className="theme-switch__menu"
					data-side={side}
					onKeyDown={onMenuKeyDown}
				>
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							role="menuitemradio"
							aria-checked={preference === option.value}
							tabIndex={-1}
							className="theme-switch__item"
							onClick={() => choose(option.value)}
						>
							<svg viewBox="0 0 24 24" aria-hidden="true">
								{option.icon}
							</svg>
							<span>{option.label}</span>
							<svg className="theme-switch__check" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M5 12.5l4.5 4.5L19 7.5" />
							</svg>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
