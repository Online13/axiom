import { Image, View, type StyleProp, type ViewStyle } from "react-native";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";

import { AttachmentIcon, useAttachmentStyles } from "./attachment.styles";

import {
	useAttachment,
	type AttachmentFile,
	type AttachmentStatus,
} from "./use-attachment";

export type { AttachmentFile, AttachmentStatus } from "./use-attachment";
export { formatBytes } from "./use-attachment";

export type AttachmentVariant = "row" | "tile";

export type AttachmentProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> & {
	file: AttachmentFile;
	/** Upload state. Derived from `progress` and `error` when not set. */
	status?: AttachmentStatus;
	/** Upload progress from 0 to 1. Shows a bar on a row, a spinner on a tile. */
	progress?: number;
	/** Error state: red border and the message instead of the size. */
	error?: string | boolean;
	/** Opens the file, for example in a preview. */
	onPress?: () => void;
	/** Shows a remove button. While uploading, cancelling the request is up to you. */
	onRemove?: () => void;
	/** In the error state, pressing the attachment or the retry icon calls it. */
	onRetry?: () => void;
	formatSize?: (bytes: number) => string;
	style?: StyleProp<ViewStyle>;
};

function Thumbnail({
	uri,
	icon,
	variant,
	status,
}: {
	uri: string | undefined;
	icon: ReturnType<typeof useAttachment>["icon"];
	variant: AttachmentVariant;
	status: AttachmentStatus;
}) {
	const styles = useAttachmentStyles();
	const tile = variant === "tile";

	return uri ? (
		<Image source={{ uri }} {...styles.thumbnailImage(tile)} />
	) : (
		<View {...styles.thumbnailFallback(variant, status, tile)}>
			<AttachmentIcon
				name={icon}
				size="md"
				{...styles.tint(variant, status)}
			/>
		</View>
	);
}

/** A document in a row: thumbnail, name, size or error, and a progress bar while it uploads. */
export function Attachment({
	file,
	status: statusProp,
	progress,
	error,
	onPress,
	onRemove,
	onRetry,
	formatSize,
	...props
}: AttachmentProps) {
	const styles = useAttachmentStyles();
	const attachment = useAttachment({
		file,
		status: statusProp,
		progress,
		error,
		onRetry,
		onPress,
		formatSize,
	});
	const retrying = attachment.status === "error" && onRetry !== undefined;

	return (
		<Tappable
			{...props}
			accessibilityLabel={attachment.accessibilityLabel}
			accessibilityHint={retrying ? "Retries the upload" : undefined}
			accessibilityRole={attachment.press ? "button" : "none"}
			disabled={!attachment.press}
			minTouchTarget={false}
			onPress={attachment.press}
			{...styles.row(attachment.status, props)}
		>
			<Thumbnail
				uri={attachment.thumbnail}
				icon={attachment.icon}
				variant="row"
				status={attachment.status}
			/>
			<View {...styles.content}>
				<Text
					variant="bodySm"
					weight="semibold"
					numberOfLines={1}
					{...styles.name("row", attachment.status)}
				>
					{file.name}
				</Text>
				{attachment.note ? (
					<Text
						variant="footnote"
						numberOfLines={1}
						{...styles.note("row", attachment.status)}
					>
						{attachment.note}
					</Text>
				) : null}
				{attachment.status === "uploading" &&
				attachment.percent !== undefined ? (
					<View {...styles.track(attachment.status)}>
						<View
							{...styles.fill(attachment.status, attachment.percent)}
						/>
					</View>
				) : null}
			</View>
			{retrying ? (
				<IconButton
					icon="refresh"
					size="sm"
					accessibilityLabel={`Retry ${file.name}`}
					color="error"
					onPress={onRetry}
				/>
			) : onRemove ? (
				<IconButton
					icon="close"
					size="sm"
					accessibilityLabel={`Remove ${file.name}`}
					onPress={onRemove}
				/>
			) : null}
		</Tappable>
	);
}

/** A square thumbnail for a grid of photos: a spinner while it uploads, a remove button in the corner. */
export function AttachmentTile({
	file,
	status: statusProp,
	progress,
	error,
	onPress,
	onRemove,
	onRetry,
	formatSize,
	...props
}: AttachmentProps) {
	const styles = useAttachmentStyles();
	const attachment = useAttachment({
		file,
		status: statusProp,
		progress,
		error,
		onRetry,
		onPress,
		formatSize,
	});
	const retrying = attachment.status === "error" && onRetry !== undefined;

	return (
		<Tappable
			{...props}
			accessibilityLabel={attachment.accessibilityLabel}
			accessibilityRole={attachment.press ? "button" : "image"}
			disabled={!attachment.press}
			onPress={attachment.press}
			{...styles.tile(attachment.status, props)}
		>
			<Thumbnail
				uri={attachment.thumbnail}
				icon={attachment.icon}
				variant="tile"
				status={attachment.status}
			/>
			{attachment.status === "uploading" ? (
				<View {...styles.scrim}>
					<Spinner size="sm" color="inverse" label="Uploading" />
				</View>
			) : null}
			{attachment.status === "error" ? (
				<View {...styles.scrim}>
					<Icon
						name={retrying ? "refresh" : "error"}
						size="md"
						color="inverse"
					/>
				</View>
			) : null}
			{onRemove ? (
				<View {...styles.remove}>
					<IconButton
						icon="close"
						size="sm"
						variant="solid"
						shape="circle"
						accessibilityLabel={`Remove ${file.name}`}
						onPress={onRemove}
					/>
				</View>
			) : null}
		</Tappable>
	);
}
