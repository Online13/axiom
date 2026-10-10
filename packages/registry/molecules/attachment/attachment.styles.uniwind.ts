import { withUniwind } from "uniwind";

import { Icon } from "@/components/ui/icon";
import { cx } from "@/theme";
import { metrics } from "@/theme/tokens";

import type { AttachmentProps, AttachmentVariant } from "./attachment";
import type { AttachmentStatus } from "./use-attachment";

const THUMBNAIL = 40;
const TILE = 72;

// Every class is written whole, so Tailwind finds it. The colors are the attachment's own tokens,
// in `theme/components/attachment.css`. An upload in progress keeps the default colors.
const ROW: Record<AttachmentStatus, string> = {
	idle: "border-attachment-row-border bg-attachment-row",
	uploading: "border-attachment-row-border bg-attachment-row",
	done: "border-attachment-row-border-done bg-attachment-row-done",
	error: "border-attachment-row-border-error bg-attachment-row-error",
};

// The tile keeps its border width in every state, so nothing moves when an error shows it.
const TILE_SURFACE: Record<AttachmentStatus, string> = {
	idle: "border-transparent bg-attachment-tile",
	uploading: "border-transparent bg-attachment-tile",
	done: "border-transparent bg-attachment-tile-done",
	error: "border-attachment-tile-border-error bg-attachment-tile-error",
};

const THUMBNAIL_FILL: Record<
	AttachmentVariant,
	Record<AttachmentStatus, string>
> = {
	row: {
		idle: "bg-attachment-row-thumbnail",
		uploading: "bg-attachment-row-thumbnail",
		done: "bg-attachment-row-thumbnail-done",
		error: "bg-attachment-row-thumbnail-error",
	},
	tile: {
		idle: "bg-attachment-tile-thumbnail",
		uploading: "bg-attachment-tile-thumbnail",
		done: "bg-attachment-tile-thumbnail-done",
		error: "bg-attachment-tile-thumbnail-error",
	},
};

const ICON: Record<AttachmentVariant, Record<AttachmentStatus, string>> = {
	row: {
		idle: "accent-attachment-row-icon",
		uploading: "accent-attachment-row-icon",
		done: "accent-attachment-row-icon-done",
		error: "accent-attachment-row-icon-error",
	},
	tile: {
		idle: "accent-attachment-tile-icon",
		uploading: "accent-attachment-tile-icon",
		done: "accent-attachment-tile-icon-done",
		error: "accent-attachment-tile-icon-error",
	},
};

const NAME: Record<AttachmentVariant, Record<AttachmentStatus, string>> = {
	row: {
		idle: "text-attachment-row-text",
		uploading: "text-attachment-row-text",
		done: "text-attachment-row-text-done",
		error: "text-attachment-row-text-error",
	},
	tile: {
		idle: "text-attachment-tile-text",
		uploading: "text-attachment-tile-text",
		done: "text-attachment-tile-text-done",
		error: "text-attachment-tile-text-error",
	},
};

const NOTE: Record<AttachmentVariant, Record<AttachmentStatus, string>> = {
	row: {
		idle: "text-attachment-row-meta",
		uploading: "text-attachment-row-meta",
		done: "text-attachment-row-meta-done",
		error: "text-attachment-row-meta-error",
	},
	tile: {
		idle: "text-attachment-tile-meta",
		uploading: "text-attachment-tile-meta",
		done: "text-attachment-tile-meta-done",
		error: "text-attachment-tile-meta-error",
	},
};

const TRACK: Record<AttachmentStatus, string> = {
	idle: "bg-attachment-row-progress-track",
	uploading: "bg-attachment-row-progress-track",
	done: "bg-attachment-row-progress-track-done",
	error: "bg-attachment-row-progress-track-error",
};

const FILL: Record<AttachmentStatus, string> = {
	idle: "bg-attachment-row-progress-fill",
	uploading: "bg-attachment-row-progress-fill",
	done: "bg-attachment-row-progress-fill-done",
	error: "bg-attachment-row-progress-fill-error",
};

// The icon takes its color as a prop. Uniwind reads it from the `accent-` class of
// `colorClassName`, which the icon gets by being wrapped.
export const AttachmentIcon = withUniwind(Icon);

export function useAttachmentStyles() {
	return {
		row: (
			status: AttachmentStatus,
			{ className, style }: Pick<AttachmentProps, "className" | "style">,
		) => ({
			className: cx(
				"flex-row items-center gap-3 rounded-md p-2",
				ROW[status],
				className,
			),
			style: [
				// Only the device knows the width of a hairline.
				{
					borderWidth: metrics.hairline,
					borderCurve: "continuous" as const,
				},
				style,
			],
		}),
		tile: (
			status: AttachmentStatus,
			{ className, style }: Pick<AttachmentProps, "className" | "style">,
		) => ({
			className: cx(
				"overflow-hidden rounded-md border-[1.5px]",
				TILE_SURFACE[status],
				className,
			),
			style: [
				{ width: TILE, height: TILE, borderCurve: "continuous" as const },
				style,
			],
		}),
		thumbnailImage: (tile: boolean) => ({
			className: tile ? "rounded-md" : "rounded-sm",
			style: {
				width: tile ? TILE : THUMBNAIL,
				height: tile ? TILE : THUMBNAIL,
			},
		}),
		thumbnailFallback: (
			variant: AttachmentVariant,
			status: AttachmentStatus,
			tile: boolean,
		) => ({
			className: cx(
				"items-center justify-center",
				tile ? "rounded-md" : "rounded-sm",
				THUMBNAIL_FILL[variant][status],
			),
			style: {
				width: tile ? TILE : THUMBNAIL,
				height: tile ? TILE : THUMBNAIL,
			},
		}),
		tint: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			colorClassName: ICON[variant][status],
		}),
		content: { className: "flex-1 justify-center gap-[2px]" },
		name: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			className: NAME[variant][status],
		}),
		note: (variant: AttachmentVariant, status: AttachmentStatus) => ({
			className: NOTE[variant][status],
		}),
		track: (status: AttachmentStatus) => ({
			className: cx(
				"mt-1 h-[4px] overflow-hidden rounded-[2px]",
				TRACK[status],
			),
		}),
		// The width follows the progress: a number, so it stays a style.
		fill: (status: AttachmentStatus, percent: number) => ({
			className: cx("h-full rounded-[2px]", FILL[status]),
			style: { width: `${percent}%` as const },
		}),
		scrim: {
			className: "absolute inset-0 items-center justify-center bg-black/45",
		},
		remove: { className: "absolute end-0 top-0 m-1" },
	};
}
