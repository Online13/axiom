import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { DEFAULT_HOST, Portal, PortalHost } from "@/components/core/portal";

// The Jest mock of react-native-teleport renders `Portal` and `PortalHost` as host elements named after
// them: these tests check what the wrapper hands the library, not the teleport itself.
const hosts = (type: string) => screen.container.queryAll((node) => node.type === type);

describe("Portal", () => {
	test("sends its content to the root host by default", async () => {
		await render(
			<Portal>
				<Text>Sheet</Text>
			</Portal>,
		);

		expect(DEFAULT_HOST).toBe("root");
		expect(hosts("Portal")[0]).toHaveProp("hostName", "root");
		expect(screen.getByText("Sheet")).toBeOnTheScreen();
	});

	test("targets another host and keeps its name", async () => {
		await render(<Portal hostName="modal" name="menu" />);

		expect(hosts("Portal")[0]).toHaveProp("hostName", "modal");
		expect(hosts("Portal")[0]).toHaveProp("name", "menu");
	});

	test("lets touches through where it has no content", async () => {
		await render(<Portal />);

		expect(hosts("Portal")[0]).toHaveStyle({ pointerEvents: "box-none" });
	});
});

describe("PortalHost", () => {
	test("is the root host by default and fills the screen without catching touches", async () => {
		await render(<PortalHost />);

		const host = hosts("PortalHost")[0];
		expect(host).toHaveProp("name", "root");
		expect(host).toHaveStyle({ position: "absolute", pointerEvents: "box-none" });
	});

	test("merges the caller's style", async () => {
		await render(<PortalHost name="top" style={{ zIndex: 10 }} />);

		const host = hosts("PortalHost")[0];
		expect(host).toHaveProp("name", "top");
		expect(host).toHaveStyle({ zIndex: 10, position: "absolute" });
	});
});
