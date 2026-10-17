# PricingCardToggle

## Covered by `pricing-card-toggle.test.tsx`

- Starts on monthly, reading the monthly price.
- Switching to yearly shows the yearly price, read with the price it replaces and the discount, and the yearly caption.
- The action receives the billing shown and names it ("Choose plan, Pro, Yearly").
- Controlled billing, shared across cards: the card follows `billing`.
