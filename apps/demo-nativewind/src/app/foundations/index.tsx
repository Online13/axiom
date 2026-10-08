import { CatalogGroup, CatalogRow } from "@/demo/catalog";
import { Screen } from "@/demo/screen";
import { FOUNDATION_GROUPS, FOUNDATIONS } from "@/demo/screens";

/**
 * Index of the foundations. Each entry is its own route: the heavy ones — the palette, the icon
 * registry, the component tokens — are only mounted when they are opened.
 */
export default function Foundations() {
	return (
		<Screen>
			{FOUNDATION_GROUPS.map((group) => {
				const entries = FOUNDATIONS.filter(
					(foundation) => foundation.group === group,
				);

				return (
					<CatalogGroup key={group} title={group}>
						{entries.map((foundation, index) => (
							<CatalogRow
								key={foundation.name}
								href={`/foundations/${foundation.name}`}
								title={foundation.title}
								description={foundation.description}
								divider={index < entries.length - 1}
							/>
						))}
					</CatalogGroup>
				);
			})}
		</Screen>
	);
}
