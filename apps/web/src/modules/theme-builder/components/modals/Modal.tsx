import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

/** The builder's overlay: a scrim, Escape to close, and a focus trap by way of
 * simply not rendering the page behind it as interactive. */
export function Modal({
	title,
	description,
	size = "md",
	onClose,
	children,
	footer,
}: {
	title: string;
	description?: string;
	size?: "md" | "lg";
	onClose: () => void;
	children: ReactNode;
	footer?: ReactNode;
}) {
	useEffect(() => {
		const escape = (event: KeyboardEvent) =>
			event.key === "Escape" && onClose();
		document.addEventListener("keydown", escape);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", escape);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	return (
		<div className="tb-modal" role="presentation" onMouseDown={onClose}>
			<div
				className="tb-modal__panel"
				data-size={size}
				role="dialog"
				aria-modal="true"
				aria-label={title}
				onMouseDown={(event) => event.stopPropagation()}
			>
				<header className="tb-modal__head">
					<div>
						<h2 className="tb-modal__title">{title}</h2>
						{description && <p className="tb-note">{description}</p>}
					</div>
					<button
						type="button"
						className="tb-iconbtn"
						aria-label="Close"
						onClick={onClose}
					>
						<X size={16} aria-hidden="true" />
					</button>
				</header>

				<div className="tb-modal__body">{children}</div>

				{footer && <footer className="tb-modal__foot">{footer}</footer>}
			</div>
		</div>
	);
}
