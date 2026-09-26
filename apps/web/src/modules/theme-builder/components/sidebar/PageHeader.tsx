import { ChevronLeft } from "lucide-react";
import { back } from "../../state/ui";

/** The top of a sidebar page: the way back, and what is being picked. */
export function PageHeader({
	title,
	detail,
}: {
	title: string;
	detail?: string;
}) {
	return (
		<header className="tb-page__head">
			<button type="button" className="tb-page__back" onClick={back}>
				<ChevronLeft size={16} aria-hidden="true" />
				Back
			</button>
			<h2 className="tb-page__title">{title}</h2>
			{detail && <p className="tb-note">{detail}</p>}
		</header>
	);
}
