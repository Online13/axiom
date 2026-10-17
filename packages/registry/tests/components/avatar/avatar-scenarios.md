# Avatar

## Covered by `avatar.test.tsx`

- An `image` named after the person; the status is added: "Ada Lovelace, online".
- Without a name or a label it is decorative.
- Without an image it shows initials (first and last word); an explicit `fallback` wins.
- The initials stay while the image loads, and go once it has loaded.
- When the image fails, the initials come back and the image is dropped.
- `Avatar.Group` shows every avatar; `Avatar.Overflow` shows `+3`, read as "3 more".
- `initials()` handles case, extra spaces, a single word, hyphenated names and an empty name.

## Checked on a device

- The overlap and ring in a group, and the status dot at every size.
