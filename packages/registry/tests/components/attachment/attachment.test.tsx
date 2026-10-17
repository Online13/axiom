import { render, screen, userEvent } from "@testing-library/react-native";

import { Attachment, AttachmentTile, formatBytes } from "@/components/ui/attachment";

jest.useFakeTimers();

const PDF = { name: "invoice.pdf", size: 1_258_291, mimeType: "application/pdf" };
const PHOTO = { name: "beach.jpg", size: 2048, mimeType: "image/jpeg", uri: "file:///beach.jpg" };

const images = () => screen.container.queryAll((node) => node.type === "Image");

describe("Attachment", () => {
	test("is read as the file name and its size, which shows under the name", async () => {
		await render(<Attachment file={PDF} testID="row" />);

		expect(screen.getByLabelText("invoice.pdf, 1.2 MB")).toBeOnTheScreen();
		expect(screen.getByText("1.2 MB")).toBeOnTheScreen();
	});

	test("without onPress it isn't a button", async () => {
		await render(<Attachment file={PDF} />);

		expect(screen.queryByRole("button", { name: /invoice/ })).toBeNull();
	});

	test("with onPress it is a button that opens the file", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<Attachment file={PDF} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "invoice.pdf, 1.2 MB" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	describe("status, inferred from progress and error", () => {
		test("uploading: the percentage replaces the size, and is read", async () => {
			await render(<Attachment file={PDF} progress={0.426} />);

			expect(screen.getByText("43%")).toBeOnTheScreen();
			expect(screen.getByLabelText("invoice.pdf, 1.2 MB, uploading, 43%")).toBeOnTheScreen();
		});

		test("a progress of 1 is done", async () => {
			await render(<Attachment file={PDF} progress={1} />);

			expect(screen.getByLabelText("invoice.pdf, 1.2 MB, uploaded")).toBeOnTheScreen();
		});

		test("an error shows its message, or 'Upload failed'", async () => {
			const view = await render(<Attachment file={PDF} progress={0.5} error="File too large" />);
			expect(screen.getByText("File too large")).toBeOnTheScreen();
			expect(screen.getByLabelText("invoice.pdf, 1.2 MB, File too large")).toBeOnTheScreen();

			await view.rerender(<Attachment file={PDF} error />);
			expect(screen.getByText("Upload failed")).toBeOnTheScreen();
		});

		test("an explicit status wins", async () => {
			await render(<Attachment file={PDF} progress={0.2} status="done" />);

			expect(screen.getByLabelText("invoice.pdf, 1.2 MB, uploaded")).toBeOnTheScreen();
		});
	});

	describe("retry and remove", () => {
		test("a failed upload with onRetry retries from the row and from its own button", async () => {
			const user = userEvent.setup();
			const onRetry = jest.fn();
			const onPress = jest.fn();
			await render(<Attachment file={PDF} error onRetry={onRetry} onPress={onPress} />);

			const row = screen.getByRole("button", { name: "invoice.pdf, 1.2 MB, upload failed" });
			expect(row).toHaveProp("accessibilityHint", "Retries the upload");
			await user.press(row);
			await user.press(screen.getByRole("button", { name: "Retry invoice.pdf" }));

			expect(onRetry).toHaveBeenCalledTimes(2);
			expect(onPress).not.toHaveBeenCalled();
		});

		test("remove has its own button named after the file", async () => {
			const user = userEvent.setup();
			const onRemove = jest.fn();
			await render(<Attachment file={PDF} onRemove={onRemove} />);

			await user.press(screen.getByRole("button", { name: "Remove invoice.pdf" }));

			expect(onRemove).toHaveBeenCalledTimes(1);
		});

		test("the retry button takes the place of remove while it failed", async () => {
			await render(<Attachment file={PDF} error onRetry={() => {}} onRemove={() => {}} />);

			expect(screen.queryByRole("button", { name: "Remove invoice.pdf" })).toBeNull();
		});
	});

	test("an image shows its thumbnail; other files an icon", async () => {
		const view = await render(<Attachment file={PHOTO} />);
		expect(images()).toHaveLength(1);
		expect(images()[0]).toHaveProp("source", { uri: "file:///beach.jpg" });

		await view.rerender(<Attachment file={PDF} />);
		expect(images()).toHaveLength(0);
	});
});

describe("AttachmentTile", () => {
	test("is an image named like the row, with a remove button", async () => {
		const user = userEvent.setup();
		const onRemove = jest.fn();
		await render(<AttachmentTile file={PHOTO} onRemove={onRemove} />);

		expect(screen.getByRole("image", { name: "beach.jpg, 2.0 KB" })).toBeOnTheScreen();
		await user.press(screen.getByRole("button", { name: "Remove beach.jpg" }));
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	test("pressable, it is a button", async () => {
		await render(<AttachmentTile file={PHOTO} onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "beach.jpg, 2.0 KB" })).toBeOnTheScreen();
	});
});

describe("formatBytes", () => {
	test.each([
		[0, "0 B"],
		[-5, "0 B"],
		[512, "512 B"],
		[1024, "1.0 KB"],
		[1_536, "1.5 KB"],
		[5 * 1024 ** 2, "5.0 MB"],
		[3.2 * 1024 ** 3, "3.2 GB"],
		[2 * 1024 ** 4, "2048.0 GB"],
	])("%d bytes → %s", (bytes, text) => {
		expect(formatBytes(bytes)).toBe(text);
	});
});
