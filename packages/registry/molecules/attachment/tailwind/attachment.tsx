import { Image, View, type StyleProp, type ViewStyle } from "react-native";

import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useTheme, type Theme } from "@/theme";

import {
	useAttachment,
	type AttachmentFile,
	type AttachmentStatus,
} from "../use-attachment";

export type { AttachmentFile, AttachmentStatus } from "../use-attachment";
export { formatBytes } from "../use-attachment";

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

/** Colors of an attachment for a variant and a status; missing properties fall back to `default`. */
export function attachmentColors(
	components: Theme["components"],
	variant: AttachmentVariant,
	status: AttachmentStatus,
) {
	const states = components.attachment[variant];
	return {
		...states.default,
		...(status === "idle" ? undefined : states[status]),
	};
}

const THUMBNAIL = 40;
const TILE = 72;
/** Darkens a tile under its spinner or error icon. */
const SCRIM = "rgba(0, 0, 0, 0.45)";

function Thumbnail({
	uri,
	icon,
	size,
	radius,
	colors,
}: {
	uri: string | undefined;
	icon: ReturnType<typeof useAttachment>["icon"];
	size: number;
	radius: number;
	colors: ReturnType<typeof attachmentColors>;
}) {
	return uri ? (
		<Image
			source={{ uri }}
			style={{ width: size, height: size, borderRadius: radius }}
		/>
	) : (
		<View
			className="items-center justify-center"
			style={{
				width: size,
				height: size,
				borderRadius: radius,
				backgroundColor: colors.thumbnail,
			}}
		>
			<Icon name={icon} size="md" color={colors.icon} />
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
	style,
	...props
}: AttachmentProps) {
	const { tokens, components } = useTheme();
	const attachment = useAttachment({
		file,
		status: statusProp,
		progress,
		error,
		onRetry,
		onPress,
		formatSize,
	});
	const colors = attachmentColors(components, "row", attachment.status);
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
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					borderCurve: "continuous",
					padding: tokens.spacing[2],
					gap: tokens.spacing[3],
					borderRadius: tokens.radius.md,
					borderWidth: tokens.metrics.hairline,
					borderColor: colors.border,
					backgroundColor: colors.background,
				},
				style,
			]}
		>
			<Thumbnail
				uri={attachment.thumbnail}
				icon={attachment.icon}
				size={THUMBNAIL}
				radius={tokens.radius.sm}
				colors={colors}
			/>
			<View className="flex-1 justify-center gap-[2px]">
				<Text
					variant="bodySm"
					weight="semibold"
					numberOfLines={1}
					style={{ color: colors.text }}
				>
					{file.name}
				</Text>
				{attachment.note ? (
					<Text
						variant="footnote"
						numberOfLines={1}
						style={{ color: colors.meta }}
					>
						{attachment.note}
					</Text>
				) : null}
				{attachment.status === "uploading" &&
				attachment.percent !== undefined ? (
					<View
						className="h-[4px] rounded-[2px] overflow-hidden"
						style={{
							marginTop: tokens.spacing[1],
							backgroundColor: colors.progressTrack,
						}}
					>
						<View
							className="h-full rounded-[2px]"
							style={{
								width: `${attachment.percent}%`,
								backgroundColor: colors.progressFill,
							}}
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
	style,
	...props
}: AttachmentProps) {
	const { tokens, components } = useTheme();
	const attachment = useAttachment({
		file,
		status: statusProp,
		progress,
		error,
		onRetry,
		onPress,
		formatSize,
	});
	const colors = attachmentColors(components, "tile", attachment.status);
	const retrying = attachment.status === "error" && onRetry !== undefined;

	return (
		<Tappable
			{...props}
			accessibilityLabel={attachment.accessibilityLabel}
			accessibilityRole={attachment.press ? "button" : "image"}
			disabled={!attachment.press}
			onPress={attachment.press}
			style={[
				{
					overflow: "hidden",
					borderWidth: 1.5,
					borderCurve: "continuous",
					width: TILE,
					height: TILE,
					borderRadius: tokens.radius.md,
					backgroundColor: colors.background,
					borderColor:
						attachment.status === "error" ? colors.border : "transparent",
				},
				style,
			]}
		>
			<Thumbnail
				uri={attachment.thumbnail}
				icon={attachment.icon}
				size={TILE}
				radius={tokens.radius.md}
				colors={colors}
			/>
			{attachment.status === "uploading" ? (
				<View
					className="absolute inset-0 items-center justify-center"
					style={{ backgroundColor: SCRIM }}
				>
					<Spinner size="sm" color="inverse" label="Uploading" />
				</View>
			) : null}
			{attachment.status === "error" ? (
				<View
					className="absolute inset-0 items-center justify-center"
					style={{ backgroundColor: SCRIM }}
				>
					<Icon
						name={retrying ? "refresh" : "error"}
						size="md"
						color="inverse"
					/>
				</View>
			) : null}
			{onRemove ? (
				<View
					className="absolute"
					style={{ top: 0, end: 0, margin: tokens.spacing[1] }}
				>
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
