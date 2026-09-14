# Design principles

These principles describe how Axiom thinks. Use them to judge any significant addition: a new component, behavior, pattern, dependency or API change.

They don't cover folders or implementation. For that, see [Architecture](./ARCHITECTURE.md).

## 1. Components are only the beginning

A visual component is one part of an experience. What makes a screen work on a phone sits around it:

- interaction and behavior
- gestures and transitions
- orchestration between several elements
- patterns that solve a recurring problem
- complete flows

A contribution that only draws something correctly is incomplete if it ignores how it's used.

## 2. Mobile first

Decisions start from what a phone can and can't do. Axiom is not a web library adapted to mobile.

That means thinking about:

- fingers rather than cursors, and touch targets sized for them
- press, drag, swipe and other gestures
- the software keyboard
- safe areas, notches and home indicators
- visual and haptic feedback
- transitions that match the platform

If an idea only makes sense with a mouse and a wide screen, it doesn't belong here.

## 3. Composition over configuration

Prefer small pieces that fit together over one large component with dozens of props.

When a new need appears, the first question is whether it can be built by composing existing pieces. Adding a prop comes second.

## 4. Own your code

Axiom code is copied into your app. You should be able to read it, understand it and change it without learning a framework first.

Avoid abstractions that make the code harder to modify than to rewrite. Axiom should never become a black box.

## 5. Progressive adoption

Take one piece or fifty. Using a single component must not require the rest of the system, a specific theme or a specific styling tool beyond what that piece needs.

## 6. Intentional dependencies

Every external dependency needs a clear reason. It ends up in the user's app, not only in Axiom.

A dependency is justified when it solves a hard problem well, such as gestures or animations running on the UI thread. It's not justified to avoid a few lines of simple code.

## 7. Native-quality interactions

Interactions should feel right on both iOS and Android. A feature isn't done because it works. It's done when it's pleasant to use: it responds immediately, it can be interrupted, and it behaves the way the platform leads people to expect.

## 8. Accessibility is part of the component

Accessibility is part of the contract of a component or pattern, not a later improvement. Roles, labels, states, focus, touch target size and screen reader behavior are reviewed with everything else.

## 9. Quality over quantity

A few solid pieces are worth more than a large, uneven catalog. Adding something means maintaining it, so each addition has to earn its place.

## 10. Consistency without rigidity

Axiom gives a coherent system: shared tokens, predictable APIs, consistent behavior. An app built with it should still look like itself. Theming and local changes are expected, not worked around.
