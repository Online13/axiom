# EventCard

## Covered by `event-card.test.tsx`

- The date tile is read as the full date; each detail line is shown.
- Pressable: one button read as title and date.
- Up to 3 attendee avatars, and a count of everyone ("4 going"); `attendeeCount` covers people not listed.
- The action names the event ("Get tickets, Night Market") and keeps its own press.
- Without attendees or an action there is no footer.
