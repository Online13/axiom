```
00  NAV
    → PAS FULL SCREEN
    → sticky / ~72–88px

01  HERO
    → FULL SCREEN / 100vh

    Thesis
    CLI
    Deconstructed mobile experience

    Une seule composition forte.
    Beaucoup d'espace vide.
    Le téléphone peut occuper presque toute la hauteur disponible.


02  EXPERIENCE
    → FULL SCREEN / 100vh

    Real, complete mobile UI
    Components / Behaviors / Patterns / Blocks

    Une vraie expérience mobile prend le centre du viewport.
    Les catégories servent à changer ce qu'on observe,
    pas à créer 4 petites cards.


03  PRINCIPLE
    → PAS FULL SCREEN
    → ~55–70vh

    “Components are only the beginning.”

    Primitive
        ↓
    Component
        ↓
    Behavior
        ↓
    Pattern
        ↓
    Experience

    Section de transition conceptuelle.
    Très peu de texte, beaucoup d'espace.


04  SYSTEM
    → FULL SCREEN / ~90–100vh

    “Start with a system.”

    Foundations
        ↓
    Atoms
        ↓
    Molecules
        ↓
    Organisms
        ↓
    Templates
        ↓
    Blocks

    Ici le système doit avoir assez de place pour devenir
    une vraie composition graphique, pas une rangée de cards.


05  REGISTRY
    → FULL SCREEN / 100vh

    “Use only what you need.”

    CLI

    npx axiom add bottom-sheet

    +

    Dependency graph

                  bottom-sheet
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       portal       overlay      tappable
                                    │
                                   core

    Le graph peut être beaucoup plus grand que dans le mockup précédent.


06  MOBILE
    → FULL SCREEN / 100vh

    “Built for fingers, not cursors.”

    Press
    Drag
    Swipe
    Keyboard
    Gestures

    Une des sections les plus importantes.

    Je ne montrerais PAS 5 petites cards.
    Plutôt 1–3 grandes interactions à la fois,
    éventuellement animées/changées au scroll.


07  OWNERSHIP
    → FULL SCREEN / 100vh

    “Your app. Your code.”

    Copy-paste philosophy

    Traditional library          Axiom

        package                     source
           ↓                           ↓
       black box                  your code

    Là aussi : énorme espace.
    Presque une campagne publicitaire à elle seule.


08  PLATFORM
    → PAS FULL SCREEN
    → ~35–50vh

    Expo
    React Native
    iOS
    Android
    TypeScript
    New Architecture

    Section utilitaire.
    Pas besoin de lui donner la même importance
    qu'à Experience / Registry / Mobile.


09  OPEN SOURCE / GITHUB
    → PAS FULL SCREEN
    → ~45–60vh

    GitHub stars
    Contributors
    MIT
    Community

    Peut être beaucoup plus éditorial qu'une grille de statistiques.

    Potentiellement combinable avec PLATFORM si on veut
    raccourcir la landing.


10  FINAL CTA
    → FULL SCREEN / 90–100vh

    PRINCIPLE / 010

    Build the experience.

            npx axiom init

            [ Get started ]

    Presque rien d'autre.

    Beaucoup, beaucoup d'espace vide.


11  FOOTER
    → PAS FULL SCREEN
    → ~200–320px

    AXIOM
    Docs
    Registry
    GitHub
```
