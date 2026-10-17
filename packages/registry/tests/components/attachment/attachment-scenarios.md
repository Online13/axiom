# Attachment

## Covered by `attachment.test.tsx`

### Row

- Read as the file name and its size ("invoice.pdf, 1.2 MB"); the size shows under the name.
- Without `onPress` it isn't a button; with it, a button that opens the file.
- The status comes from `progress` and `error`: uploading shows and reads the percentage, `1` is uploaded, an error shows its message or "Upload failed". An explicit `status` wins.
- A failed upload with `onRetry`: the row retries (and says so in its hint), so does its "Retry invoice.pdf" button; `onPress` isn't called.
- `onRemove` adds a "Remove invoice.pdf" button; while failed with `onRetry`, Retry takes its place.
- Images show a thumbnail; other files an icon.

### Tile

- An `image` named like the row, a button when pressable, with a remove button.

### `formatBytes`

- Bytes, KB, MB, GB, with one decimal past bytes; zero and negatives are "0 B"; it stops at GB.

## Checked on a device

- The progress bar, and the retry scrim on a tile.
