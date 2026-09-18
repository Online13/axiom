# Tester demo-stylesheet sur iOS avec native-sim

`native-sim` compile `apps/demo-stylesheet` sur un runner macOS GitHub et affiche le simulateur iOS dans le navigateur. Le [workflow](../../.github/workflows/native-sim.yml) installe le monorepo avec Bun et régénère les composants Axiom avant le build. Il lance une build native, sans Expo Go.

## Avant le test

Depuis la racine du dépôt, vérifie que `gh` est connecté avec `gh auth status`. Si nécessaire, lance `gh auth login`.

Termine tes changements, puis commit et pousse-les sur `main`. Le runner utilise le commit publié sur GitHub. Le [lanceur du dépôt](../../scripts/native-sim.mjs) refuse de démarrer si le commit local n'est pas encore poussé. Si tu modifies un composant copié dans la démo, reporte le changement dans `packages/registry` : les copies de `src/theme`, `src/hooks` et `src/components` sont ignorées par Git et régénérées sur le runner.

## Lancer et ouvrir le simulateur

```bash
bun run sim:ios up --minutes 60
```

La commande affiche d'abord le lien du run GitHub Actions. Elle affiche ensuite une ligne `Simulator:` contenant l'URL à ouvrir dans le navigateur. Cette URL contient une clé `?k=...` qui donne accès au simulateur : garde-la privée.

Pour retrouver l'URL pendant que la session tourne :

```bash
bun run sim:ios status
```

Ouvre **l'URL de la ligne `Simulator:`**. La ligne `in_progress:` renvoie uniquement à GitHub Actions. Le flux peut être disponible avant l'app : attends que l'étape **Install and launch app** réussisse. L'étape **Start Expo Go** apparaît dans la liste, mais elle est ignorée en mode `build`. **Hold the stream open** reste en cours tant que le simulateur est accessible.

Le premier build natif peut prendre environ 30 minutes. Les sessions suivantes réutilisent la build en cache si les entrées natives n'ont pas changé ; le bundle JavaScript est alors actualisé.

## Arrêter la session

```bash
bun run sim:ios down
```

Le flux s'arrête immédiatement. Sans cette commande, le workflow ferme la session après la durée demandée avec `--minutes`.

Le contrôle automatisé avec `agent-device` est facultatif. Il demande une installation séparée et l'option `--agent` au lancement ; les commandes ci-dessus suffisent pour utiliser le simulateur dans le navigateur.

Voir aussi le [guide native-sim](https://reactnativefeel.com/sim/llm.txt).
