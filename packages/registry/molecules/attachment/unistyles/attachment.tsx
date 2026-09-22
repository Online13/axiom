import { Image, View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import type { Theme } from "@/theme";

import {
	useAttachment,
	type AttachmentFile,
	type AttachmentStatus,
} from "../use-attachment";

export type { AttachmentFile, AttachmentStatus } from "../use-attachment";
export { formatBytes } from "../use-attachment";

export type AttachmentVariant = "row" | "tile";

export type AttachmentProps = {
	file: AttachmentFile;
	/** Upload state. Derived from `progress` and `error` when not set. */
	status?: AttachmentStatus;
	/** Upload progress from 0 to 1. Shows a bar (row) or a spinner (tile). */
	progress?: number;
	/** Error state: red border and the message instead of the size. */
	error?: string | boolean;
	/** `row` for documents with a name, `tile` for a square thumbnail in a grid. */
	variant?: AttachmentVariant;
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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

export function Attachment({
	file,
	status: statusProp,
	progress,
	error,
	variant = "row",
	onPress,
	onRemove,
	onRetry,
	formatSize,
	style,
}: AttachmentProps) {
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

	const thumbnail = (tile: boolean) =>
		attachment.thumbnail ? (
			<Image
				source={{ uri: attachment.thumbnail }}
				style={styles.thumbnailImage(tile)}
			/>
		) : (
			<View style={styles.thumbnailFallback(variant, attachment.status, tile)}>
				<ThemedIcon
					name={attachment.icon}
					size="md"
					uniProps={(theme) => ({
						color: attachmentColors(
							theme.components,
							variant,
							attachment.status,
						).icon,
					})}
				/>
			</View>
		);

	if (variant === "tile") {
		return (
			<Tappable
				accessibilityLabel={attachment.accessibilityLabel}
				accessibilityRole={attachment.press ? "button" : "image"}
				disabled={!attachment.press}
				onPress={attachment.press}
				style={[styles.tile(attachment.status), style]}
			>
				{thumbnail(true)}
				{attachment.status === "uploading" ? (
					<View style={styles.scrim}>
						<Spinner size="sm" color="inverse" label="Uploading" />
					</View>
				) : null}
				{attachment.status === "error" ? (
					<View style={styles.scrim}>
						<Icon
							name={retrying ? "refresh" : "error"}
							size="md"
							color="inverse"
						/>
					</View>
				) : null}
				{onRemove ? (
					<View style={styles.remove}>
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

	return (
		<Tappable
			accessibilityLabel={attachment.accessibilityLabel}
			accessibilityHint={retrying ? "Retries the upload" : undefined}
			accessibilityRole={attachment.press ? "button" : "none"}
			disabled={!attachment.press}
			minTouchTarget={false}
			onPress={attachment.press}
			style={[styles.row(attachment.status), style]}
		>
			{thumbnail(false)}
			<View style={styles.content}>
				<Text
					variant="bodySm"
					weight="semibold"
					numberOfLines={1}
					style={styles.name(variant, attachment.status)}
				>
					{file.name}
				</Text>
				{attachment.note ? (
					<Text
						variant="footnote"
						numberOfLines={1}
						style={styles.note(variant, attachment.status)}
					>
						{attachment.note}
					</Text>
				) : null}
				{attachment.status === "uploading" &&
				attachment.percent !== undefined ? (
					<View style={styles.track(attachment.status)}>
						<View
							style={styles.fill(attachment.status, attachment.percent)}
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

const styles = StyleSheet.create((theme) => ({
	row: (status: AttachmentStatus) => {
		const colors = attachmentColors(theme.components, "row", status);
		return {
			flexDirection: "row",
			alignItems: "center",
			borderCurve: "continuous",
			padding: theme.tokens.spacing[2],
			gap: theme.tokens.spacing[3],
			borderRadius: theme.tokens.radius.md,
			borderWidth: theme.tokens.metrics.hairline,
			borderColor: colors.border,
			backgroundColor: colors.background,
		};
	},
	tile: (status: AttachmentStatus) => {
		const colors = attachmentColors(theme.components, "tile", status);
		return {
			overflow: "hidden",
			borderWidth: 1.5,
			borderCurve: "continuous",
			width: TILE,
			height: TILE,
			borderRadius: theme.tokens.radius.md,
			backgroundColor: colors.background,
			borderColor: status === "error" ? colors.border : "transparent",
		};
	},
	thumbnailImage: (tile: boolean) => {
		const size = tile ? TILE : THUMBNAIL;
		return {
			width: size,
			height: size,
			borderRadius: tile ? theme.tokens.radius.md : theme.tokens.radius.sm,
		};
	},
	thumbnailFallback: (
		variant: AttachmentVariant,
		status: AttachmentStatus,
		tile: boolean,
	) => {
		const size = tile ? TILE : THUMBNAIL;
		return {
			alignItems: "center",
			justifyContent: "center",
			width: size,
			height: size,
			borderRadius: tile ? theme.tokens.radius.md : theme.tokens.radius.sm,
			backgroundColor: attachmentColors(theme.components, variant, status)
				.thumbnail,
		};
	},
	scrim: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.45)",
	},
	remove: {
		position: "absolute",
		top: 0,
		end: 0,
		margin: theme.tokens.spacing[1],
	},
	content: {
		flex: 1,
		justifyContent: "center",
		gap: 2,
	},
	name: (variant: AttachmentVariant, status: AttachmentStatus) => ({
		color: attachmentColors(theme.components, variant, status).text,
	}),
	note: (variant: AttachmentVariant, status: AttachmentStatus) => ({
		color: attachmentColors(theme.components, variant, status).meta,
	}),
	track: (status: AttachmentStatus) => ({
		height: 4,
		borderRadius: 2,
		overflow: "hidden",
		marginTop: theme.tokens.spacing[1],
		backgroundColor: attachmentColors(theme.components, "row", status)
			.progressTrack,
	}),
	fill: (status: AttachmentStatus, percent: number) => ({
		height: "100%",
		borderRadius: 2,
		width: `${percent}%`,
		backgroundColor: attachmentColors(theme.components, "row", status)
			.progressFill,
	}),
}));
