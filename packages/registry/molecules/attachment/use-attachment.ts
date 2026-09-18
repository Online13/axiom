export type AttachmentFile = {
  name: string;
  /** In bytes. */
  size?: number;
  mimeType?: string;
  /** Image and video files render it as a thumbnail. */
  uri?: string;
};

export type AttachmentStatus = 'idle' | 'uploading' | 'done' | 'error';

export type UseAttachmentOptions = {
  file: AttachmentFile;
  status?: AttachmentStatus;
  /** From 0 to 1. */
  progress?: number;
  error?: string | boolean;
  onRetry?: () => void;
  onPress?: () => void;
  formatSize?: (bytes: number) => string;
};

const UNITS = ['B', 'KB', 'MB', 'GB'];

/** `1.2 MB`, the size as a file manager writes it. */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1);
  const value = bytes / 1024 ** unit;
  // Whole bytes, one decimal above: "980 B", "1.2 MB".
  return `${unit === 0 ? Math.round(value) : value.toFixed(1)} ${UNITS[unit]}`;
}

/** Status, message and accessibility of an attachment, shared by every styling variant. */
export function useAttachment({
  file,
  status: statusProp,
  progress,
  error,
  onRetry,
  onPress,
  formatSize = formatBytes,
}: UseAttachmentOptions) {
  const failed = error !== undefined && error !== false && error !== '';
  const status: AttachmentStatus =
    statusProp ?? (failed ? 'error' : progress === undefined ? 'idle' : progress >= 1 ? 'done' : 'uploading');

  const message = typeof error === 'string' && error !== '' ? error : undefined;
  const percent = progress === undefined ? undefined : Math.round(Math.min(Math.max(progress, 0), 1) * 100);
  const size = file.size === undefined ? undefined : formatSize(file.size);

  // In the error state the whole attachment retries, so a failed upload is one tap away from another try.
  const press = status === 'error' && onRetry ? onRetry : onPress;

  const isImage = file.mimeType?.startsWith('image/') === true;
  const isVideo = file.mimeType?.startsWith('video/') === true;

  return {
    status,
    /** What sits under the file name: the error, the progress, or the size. */
    note:
      status === 'error'
        ? (message ?? 'Upload failed')
        : status === 'uploading' && percent !== undefined
          ? `${percent}%`
          : size,
    percent,
    /** Only images and videos have something to show; anything else falls back to an icon. */
    thumbnail: (isImage || isVideo) && file.uri ? file.uri : undefined,
    icon: isImage || isVideo ? ('image' as const) : ('file' as const),
    press,
    accessibilityLabel: [
      file.name,
      size,
      status === 'uploading' && percent !== undefined ? `uploading, ${percent}%` : undefined,
      status === 'done' ? 'uploaded' : undefined,
      status === 'error' ? (message ?? 'upload failed') : undefined,
    ]
      .filter(Boolean)
      .join(', '),
  };
}
