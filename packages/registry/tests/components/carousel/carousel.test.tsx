import { createRef } from "react";
import { Dimensions, Text } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { useReducedMotion } from "react-native-reanimated";

import { Carousel, type CarouselRef } from "@/components/ui/carousel";
import { metrics, spacing } from "@/theme/tokens";

import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const SLIDES = ["Sunrise", "Lake", "Forest"];
// Full-width items: the viewport minus the screen margin on each side, then the gap.
const inset = metrics.screenMargin;
const interval = Dimensions.get("window").width - inset * 2 + spacing[3];

type Props = Partial<React.ComponentProps<typeof Carousel<string>>> & { autoPlay?: { interval: number; loop?: boolean } };

function Gallery({ autoPlay, data = SLIDES, ...props }: Props) {
	return (
		<Carousel data={data} renderItem={({ item, index }) => <Text>{`${index}:${item}`}</Text>} {...props}>
			<Carousel.List testID="list" />
			<Carousel.Pagination />
			{autoPlay ? <Carousel.AutoPlay {...autoPlay} /> : null}
		</Carousel>
	);
}

const list = () => screen.getByTestId("list");
const page = () => screen.getByLabelText(/^Page \d of \d$/).props.accessibilityLabel as string;

/** The finger lets go and the list settles at this offset. */
async function swipeTo(offset: number) {
	await fireEvent(list(), "momentumScrollEnd", { nativeEvent: { contentOffset: { x: offset, y: 0 } } });
}

describe("Carousel", () => {
	test("renders each item with its index", async () => {
		await render(<Gallery />);

		expect(screen.getByText("0:Sunrise")).toBeOnTheScreen();
		expect(screen.getByText("1:Lake")).toBeOnTheScreen();
	});

	test("the pagination is one element read as 'Page 1 of 3'", async () => {
		await render(<Gallery />);

		expect(page()).toBe("Page 1 of 3");
	});

	test("a single item has no pagination", async () => {
		await render(<Gallery data={["Only"]} />);

		expect(screen.queryByLabelText(/^Page/)).toBeNull();
	});

	describe("swipe", () => {
		test("settling on an item makes it active and reports it", async () => {
			const onIndexChange = jest.fn();
			await render(<Gallery onIndexChange={onIndexChange} />);

			await swipeTo(interval * 2);

			expect(onIndexChange).toHaveBeenCalledWith(2);
			expect(page()).toBe("Page 3 of 3");
		});

		test("rounds to the nearest item and stays within the list", async () => {
			const onIndexChange = jest.fn();
			await render(<Gallery onIndexChange={onIndexChange} />);

			await swipeTo(interval * 0.6);
			expect(onIndexChange).toHaveBeenLastCalledWith(1);

			await swipeTo(interval * 40);
			expect(onIndexChange).toHaveBeenLastCalledWith(2);
		});

		test("settling back on the same item is not a change", async () => {
			const onIndexChange = jest.fn();
			await render(<Gallery onIndexChange={onIndexChange} haptic="selection" />);

			await swipeTo(interval * 0.2);

			expect(onIndexChange).not.toHaveBeenCalled();
			expect(Haptics.selectionAsync).not.toHaveBeenCalled();
		});

		test("plays the haptic when a swipe lands on another item, never for code", async () => {
			const ref = createRef<CarouselRef>();
			await render(<Gallery haptic="selection" ref={ref} />);

			await swipeTo(interval);
			expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);

			await act(() => ref.current!.next());
			expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
		});
	});

	describe("imperative API", () => {
		test("next, prev and scrollToIndex move the active item, within bounds", async () => {
			const ref = createRef<CarouselRef>();
			const onIndexChange = jest.fn();
			await render(<Gallery ref={ref} onIndexChange={onIndexChange} />);

			await act(() => ref.current!.next());
			expect(page()).toBe("Page 2 of 3");

			await act(() => ref.current!.scrollToIndex(99));
			expect(page()).toBe("Page 3 of 3");

			await act(() => ref.current!.next());
			expect(page()).toBe("Page 3 of 3");

			await act(() => ref.current!.scrollToIndex(-5));
			expect(page()).toBe("Page 1 of 3");
			expect(onIndexChange.mock.calls).toEqual([[1], [2], [0]]);
		});
	});

	test("controlled: follows index", async () => {
		const view = await render(<Gallery index={0} />);

		await view.rerender(<Gallery index={2} />);

		expect(page()).toBe("Page 3 of 3");
	});

	describe("snapping", () => {
		test("item: a stop at each item, the last one included", async () => {
			await render(<Gallery />);

			expect(list()).toHaveProp("snapToOffsets", [0, interval, interval * 2]);
		});

		test("none: free scrolling", async () => {
			await render(<Gallery snap="none" />);

			expect(list()).toHaveProp("snapToOffsets", undefined);
		});

		test("page: one stop per screenful of narrow items", async () => {
			await render(<Gallery snap="page" itemWidth={100} data={["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]} />);

			const step = Math.floor((Dimensions.get("window").width - inset) / (100 + spacing[3])) * (100 + spacing[3]);
			const offsets = list().props.snapToOffsets as number[];
			expect(offsets[1]).toBe(step);
			expect(offsets.at(-1)).toBe(9 * (100 + spacing[3]));
		});
	});

	test("ends with half a viewport of padding, so the last item can be centered", async () => {
		await render(<Gallery />);

		expect(list().props.contentContainerStyle).toEqual(
			expect.arrayContaining([expect.objectContaining({ paddingEnd: inset + Dimensions.get("window").width / 2 })]),
		);
	});

	describe("autoplay", () => {
		test("moves to the next item on each tick, and stops at the end", async () => {
			await render(<Gallery autoPlay={{ interval: 3000 }} />);

			await advance(3000);
			expect(page()).toBe("Page 2 of 3");
			await advance(3000);
			await advance(3000);
			expect(page()).toBe("Page 3 of 3");
		});

		test("loop goes back to the first item after the last", async () => {
			await render(<Gallery autoPlay={{ interval: 1000, loop: true }} />);

			await advance(3000);

			expect(page()).toBe("Page 1 of 3");
		});

		test("skips its ticks while the list is touched", async () => {
			await render(<Gallery autoPlay={{ interval: 1000 }} />);

			await fireEvent(list(), "touchStart");
			await advance(5000);
			expect(page()).toBe("Page 1 of 3");

			await fireEvent(list(), "touchEnd");
			await advance(1000);
			expect(page()).toBe("Page 2 of 3");
		});

		test("stays off with Reduce Motion", async () => {
			jest.mocked(useReducedMotion).mockReturnValue(true);
			await render(<Gallery autoPlay={{ interval: 1000 }} />);

			await advance(5000);

			expect(page()).toBe("Page 1 of 3");
			jest.mocked(useReducedMotion).mockReturnValue(false);
		});
	});

	test("parts outside a Carousel throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Carousel.Pagination />)).rejects.toThrow("This part must be rendered inside <Carousel>.");
	});
});
