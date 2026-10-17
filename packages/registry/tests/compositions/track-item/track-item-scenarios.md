# TrackItem

## Covered by `track-item.test.tsx`

- Read as title, artist, "Explicit", length; the playing track adds "Now playing" and is selected.
- Without artwork it shows its position.
- A press plays; a long press and "More, title" open the menu, without playing.
- Disabled: can't be played.
- `formatDuration` writes m:ss and h:mm:ss, rounds, and never goes negative.
