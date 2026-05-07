# Ex2 — Application React

Application React construite avec Vite, incluant des tests Jest et un pipeline CI/CD déployé sur GitHub Pages.

## Pré-requis

- [Node.js](https://nodejs.org/) version **20.x** ou **22.x**
- [npm](https://www.npmjs.com/) version **9+** (inclus avec Node.js)
- [Git](https://git-scm.com/)

## Installation et lancement

Cloner le dépôt :

```bash
git clone https://github.com/FreeZe060/test_fenoll_m1_deploy.git
cd test_fenoll_m1_deploy
```

Installer les dépendances :

```bash
npm install
```

Lancer l'application en développement :

```bash
npm run dev
```

L'application est disponible sur [http://localhost:5173](http://localhost:5173).

## Exécuter les tests

Lancer les tests avec couverture de code :

```bash
npm test
```

Le rapport de couverture est généré dans le dossier `coverage/`.

## Build de production

```bash
npm run build
```

Les fichiers compilés sont générés dans le dossier `dist/`.

## Générer la documentation

```bash
npm run jsdoc
```

La documentation est générée dans le dossier `docs/`.

## Déploiement

Le déploiement sur GitHub Pages est automatique via GitHub Actions à chaque push sur `master`, uniquement si tous les tests passent.

Application disponible sur : https://FreeZe060.github.io/test_fenoll_m1_deploy
