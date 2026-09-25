# Axiom Theme Builder — Refonte des previews d’apps

## Objectif

Modifier la zone de preview du Theme Builder pour qu’elle soit plus attractive visuellement et montre réellement l’impact d’un thème Axiom.

Le problème actuel n’est pas la propreté des écrans, mais leur ressemblance trop forte avec des écrans de documentation :
- beaucoup de listes ;
- beaucoup de separators ;
- trop de blanc ;
- peu de hiérarchie visuelle ;
- les apps se ressemblent entre elles ;
- les changements de couleur, radius ou typo ne paraissent pas assez importants.

Le Theme Builder doit donner l’impression de personnaliser de **vraies apps**, pas de tester une collection de composants.

---

# 1. Nouvelle logique générale

Remplacer les previews actuelles :

- Todo
- Productivity
- Recipes
- Social

par 4 apps plus visuelles :

- `Music`
- `Travel`
- `Fitness`
- `Finance`

Chaque app doit avoir :
- sa propre identité ;
- des layouts différents ;
- des composants différents ;
- des usages différents des couleurs ;
- des écrans suffisamment graphiques pour rendre les changements de thème évidents.

Important :
les apps utilisent toujours les vrais composants, primitives et tokens Axiom.

Il ne faut pas créer de design statique ou fake uniquement pour la preview.

---

# 2. Séparer "Apps" et "Components"

Le Theme Builder doit avoir deux usages clairement séparés.

## Apps

But :

> Montrer à quoi peut ressembler une vraie application construite avec le thème courant.

Les previews doivent être émotionnelles et visuelles.

Elles servent notamment à tester :
- typography ;
- surfaces ;
- accent ;
- radius ;
- contrastes ;
- hiérarchie ;
- dark/light mode.

## Components

Ajouter ou conserver une vue dédiée aux composants individuels.

Elle sert à tester précisément :
- Button
- Input
- Select
- Switch
- Checkbox
- Radio
- Alert
- Dialog
- Sheet
- Tabs
- Card
- Badge
- List item
- destructive states
- disabled states
- focus states

Ne pas essayer de montrer tous ces états dans les apps de démonstration.

---

# 3. Navigation de la preview

Remplacer la navigation actuelle par quelque chose proche de :

```txt
Apps

Music
Travel
Fitness
Finance

────────────

Components
Color roles
Palette
Code
```

Ou conserver la barre horizontale actuelle si elle est déjà bien intégrée.

L’important est de distinguer visuellement :

```txt
App previews
vs
Theme inspection
```

---

# 4. Nouvelle présentation d’une app

Ne plus afficher systématiquement trois téléphones de même taille.

Créer une hiérarchie.

Exemple :

```txt
Music

Listen without the noise.


             ┌───────────────┐
             │               │
             │   MAIN SCREEN │
             │               │
             └───────────────┘

      ┌───────────┐      ┌───────────┐
      │ secondary │      │ secondary │
      └───────────┘      └───────────┘
```

Le téléphone principal doit être environ :

```txt
1.2x à 1.3x
```

plus grand que les autres.

Les deux écrans secondaires servent à montrer d’autres états de l’app.

Éviter :

```txt
phone = phone = phone
```

car cela donne une impression de catalogue.

---

# 5. Réduire fortement le texte descriptif

Supprimer les phrases répétées du type :

> Every screen is drawn with the real Axiom primitives...

Cette information doit être expliquée une seule fois ailleurs dans le Theme Builder.

Pour chaque app, utiliser seulement :

```txt
Nom
Courte phrase
```

Exemple :

```txt
Wave

Music for wherever you are.
```

Pas de gros paragraphe explicatif.

---

# 6. App 01 — Music

Nom interne possible :

```txt
Wave
```

Catégorie :

```txt
Music
```

Cette app doit être la preview la plus spectaculaire.

## Screen principal — Player

Créer un écran de lecture musicale avec :

- grande artwork carrée ;
- nom du morceau ;
- artiste ;
- progress slider ;
- temps actuel / durée ;
- play/pause ;
- previous / next ;
- shuffle ;
- repeat ;
- favorite ;
- device/output action.

Le visuel de l’album doit prendre une grande partie de l’écran.

Le screen doit faire ressortir fortement :
- accent ;
- background ;
- surface ;
- typography ;
- radius ;
- icon colors.

## Screen secondaire — Discover

Contenu :

- heading `Made for you`
- grand album ou playlist featured ;
- carousel horizontal ;
- chips de genres ;
- section `Recently played`
- mini player fixe en bas.

Éviter les longues listes verticales.

## Screen secondaire — Album

Contenu :

- grosse artwork ;
- titre album ;
- artiste ;
- metadata ;
- gros CTA `Play`
- CTA secondaire ;
- quelques tracks seulement.

Pas besoin d’afficher 15 morceaux.

---

# 7. App 02 — Travel

Nom interne possible :

```txt
Roam
```

Catégorie :

```txt
Travel
```

Cette app doit avoir un rendu plus éditorial.

## Screen principal — Destination

Exemple :

```txt
Kyoto
Japan
```

Contenu :

- grande image de destination ;
- title ;
- short subtitle ;
- weather ;
- duration ;
- rating ;
- itinerary preview ;
- CTA `Plan trip`.

L’image doit occuper une grande partie du haut de l’écran.

## Screen secondaire — Explore

Contenu :

- search ;
- destination featured ;
- catégories ;
- cards horizontales ;
- `Popular now`.

Ne pas transformer cet écran en grille dense.

## Screen secondaire — Trip

Contenu :

- dates ;
- timeline ;
- flight ;
- hotel ;
- activity ;
- transport.

Chaque étape doit utiliser des cards visuellement distinctes.

---

# 8. App 03 — Fitness

Nom interne possible :

```txt
Pulse
```

Catégorie :

```txt
Fitness
```

Cette app sert particulièrement à tester les données et couleurs sémantiques.

## Screen principal — Today

Contenu :

- gros chiffre de progression ;
- activity/progress ring ;
- calories ;
- steps ;
- training time ;
- streak ;
- CTA `Start workout`.

Le layout doit avoir de gros chiffres et beaucoup d’air.

## Screen secondaire — Workout

Contenu :

- workout name ;
- timer très visible ;
- exercise actuel ;
- reps ;
- sets ;
- progression ;
- CTA `Pause`;
- `Next exercise`.

## Screen secondaire — Progress

Contenu :

- weekly chart ;
- streak ;
- personal record ;
- small achievements ;
- progression globale.

Éviter un dashboard trop dense.

---

# 9. App 04 — Finance

Nom interne possible :

```txt
North
```

Catégorie :

```txt
Finance
```

Cette app doit être plus premium et minimale.

## Screen principal — Portfolio

Contenu :

- balance principale très visible ;
- évolution en pourcentage ;
- graphique ;
- asset allocation ;
- actions rapides :

```txt
Add
Send
Exchange
```

- quelques assets.

Pas de longue liste de transactions sur cet écran.

## Screen secondaire — Asset

Contenu :

- asset name ;
- current value ;
- variation ;
- large chart ;
- period selector :

```txt
1D
1W
1M
1Y
```

- stats ;
- actions `Buy` / `Sell`.

## Screen secondaire — Card

Contenu :

- virtual card ;
- available balance ;
- card controls ;
- spending limit ;
- 3 transactions maximum.

---

# 10. Utilisation des couleurs

Chaque preview doit utiliser réellement les rôles définis dans le Theme Builder.

Exemple :

```txt
neutral
accent
highlight
success
warning
error
```

Mais ne pas forcer toutes les couleurs dans tous les écrans.

Exemples :

## Music

Accent :
- active controls ;
- progress slider ;
- selected chips.

Highlight :
- featured playlist.

## Travel

Accent :
- CTA ;
- selected destination ;
- navigation.

Highlight :
- badges ;
- recommendation.

## Fitness

Success :
- completed goal.

Warning :
- goal slipping.

Error :
- missed activity si nécessaire.

## Finance

Success :
- positive variation.

Error :
- negative variation.

Accent :
- chart ;
- selected controls.

Le but est que les changements de semantic colors soient immédiatement visibles.

---

# 11. Radius

Les previews doivent comporter suffisamment de formes pour montrer clairement le choix :

```txt
Sharp
Subtle
Default
Round
```

Les radius doivent notamment affecter :

- cards ;
- buttons ;
- chips ;
- album artwork ;
- input ;
- mini-player ;
- charts containers ;
- image containers.

Éviter d’avoir uniquement des listes avec separators, car elles ne montrent presque pas le radius.

---

# 12. Typography

La typographie choisie dans le Theme Builder doit avoir un impact visible.

Utiliser une vraie hiérarchie :

```txt
display
heading
title
body
caption
label
numeric
```

Les écrans doivent inclure :
- grands titres ;
- grands chiffres ;
- body text ;
- metadata ;
- petites labels.

Cela rend le changement de font immédiatement perceptible.

---

# 13. Images et contenu visuel

Les apps Music et Travel doivent contenir de vrais visuels de démo.

Éviter les gros rectangles bleus actuellement utilisés comme placeholders.

Prévoir des assets locaux stables.

Exemple :

```txt
/assets/demo/music/
/assets/demo/travel/
/assets/demo/fitness/
/assets/demo/finance/
```

Les images doivent rester secondaires par rapport au thème :

elles ne doivent pas contenir elles-mêmes une identité colorimétrique trop forte qui empêcherait de voir les tokens Axiom.

---

# 14. Mobile realism

Chaque app doit ressembler à une vraie application mobile.

Conserver :
- status bar ;
- safe areas ;
- native spacing ;
- bottom tabs lorsque pertinent ;
- navigation header ;
- touch targets réalistes.

Mais ne pas forcer une bottom tab bar sur tous les screens.

Certaines vues peuvent utiliser :
- back navigation ;
- full-screen player ;
- modal ;
- sheet ;
- floating action ;
- segmented control.

Le but est aussi de montrer la variété des patterns Axiom.

---

# 15. Éviter les répétitions structurelles

Aujourd’hui beaucoup de previews suivent :

```txt
Header
Search
List
List
List
Bottom tabs
```

Ne plus utiliser ce modèle partout.

Chaque app doit avoir une composition dominante différente.

## Music

```txt
Artwork
Controls
Player
```

## Travel

```txt
Hero image
Editorial content
Cards
```

## Fitness

```txt
Metrics
Progress
Large numbers
```

## Finance

```txt
Balance
Chart
Financial actions
```

---

# 16. Gestion de l’espace

Continuer à privilégier l’espace vide.

Axiom ne doit pas devenir une UI remplie de cards.

Principes :

- gros padding ;
- peu d’éléments par écran ;
- sections clairement séparées ;
- une information dominante ;
- pas de grille dense ;
- pas de décoration gratuite.

L’espace vide fait partie du design.

---

# 17. Background du Theme Builder

Conserver l’environnement sombre actuel autour des devices.

Le background extérieur doit rester neutre pour laisser les previews ressortir.

Pas de gradient.

Pas d’effet glow.

Pas de grosse lumière autour des phones.

Les shadows des téléphones doivent rester discrètes.

---

# 18. Light / Dark

Les apps doivent fonctionner réellement dans les deux modes.

Ne pas seulement inverser :

```txt
white → black
```

Les surfaces doivent utiliser les rôles du thème.

Vérifier notamment :

- image overlays ;
- text contrast ;
- borders ;
- charts ;
- cards ;
- selected states ;
- inactive states ;
- semantic colors.

Music et Finance doivent être particulièrement convaincants en dark mode.

---

# 19. Contenu des apps

Le contenu doit sembler crédible mais rester très court.

Éviter le lorem ipsum.

Utiliser des noms cohérents.

Exemple Music :

```txt
Quiet Hours
Nova
3:42
```

Travel :

```txt
Kyoto
4 days
18°C
```

Fitness :

```txt
8,420 steps
42 min
6 day streak
```

Finance :

```txt
$24,820
+4.8%
```

Pas besoin de créer beaucoup de contenu.

---

# 20. Architecture recommandée

Créer une structure commune pour les previews.

Exemple :

```txt
theme-builder/
  previews/
    music/
      player
      discover
      album

    travel/
      explore
      destination
      trip

    fitness/
      today
      workout
      progress

    finance/
      portfolio
      asset
      card
```

Les previews doivent consommer uniquement le thème actif.

Éviter des valeurs de style hardcodées qui bypassent les tokens.

---

# 21. Source de vérité

Tous les exemples doivent utiliser :

```txt
Theme
ThemeColors
Component tokens
Axiom primitives
```

Ne pas créer un système de styles spécial uniquement pour le Theme Builder.

Le Theme Builder doit montrer exactement le rendu qu’un développeur pourrait obtenir dans son app.

---

# 22. Interactions

Les écrans n’ont pas besoin d’être des apps complètement fonctionnelles.

Mais quelques interactions utiles peuvent fonctionner :

- tabs ;
- segmented controls ;
- favorite ;
- play/pause ;
- slider ;
- switch ;
- selected card ;
- navigation entre les 3 previews.

Ne pas investir dans de la logique métier inutile.

Le but principal reste la visualisation du thème.

---

# 23. Priorité d’implémentation

Faire dans cet ordre :

```txt
1. Music
2. Travel
3. Fitness
4. Finance
5. Components view
```

Commencer par Music.

Elle doit servir de référence pour la qualité visuelle du nouveau Theme Builder.

Ne pas refaire les quatre apps en parallèle avant d’avoir validé la direction de Music.

---

# Résultat attendu

Avant :

```txt
Theme Builder
→ plusieurs écrans propres
→ beaucoup de listes
→ faible différence visuelle entre les thèmes
```

Après :

```txt
Theme Builder
→ galerie de vraies expériences mobiles
→ chaque app possède une identité différente
→ les changements de thème sont immédiatement visibles
→ les composants restent réellement ceux d’Axiom
```

Le sentiment recherché est :

> “Je ne suis pas en train de choisir quelques couleurs.
> Je suis en train de définir l’identité de mon application.”
```