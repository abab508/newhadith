# Milaghaiba — accueil indépendant

Projet neuf React + Vite. **Aucun lien** avec les anciens dépôts, la base des hadiths ni les anciens services Render. Uniquement une page d'accueil fondée sur la capture validée.

## Démarrer

```bash
npm install
npm run dev
```

## Compilation / Render

```bash
npm run build
npm start
```

Render : nouveau **Web Service**, nouveau dépôt GitHub. Runtime Node, branche `main`, build `npm install && npm run build`, start `npm start`, région Frankfurt, plan Free si disponible. Le port d'écoute utilise `PORT` fourni par Render.

## État

- Bureau : reproduction géométrique fondée sur la capture 1448×1086, zones de sélection interactives. La capture entière contient déjà le texte et le panneau par défaut ; les zones par-dessus activent un panneau HTML lors du choix d'un autre chapitre.
- Mobile : page distincte responsive, huit illustrations locales découpées de la capture.
- Recherche : filtre les **titres et sous-thèmes seulement**. Aucun moteur documentaire pour l'instant.
- Thèmes, Sources, Recherche documentaire : **aucune page secondaire créée**. Les boutons affichent un message d'attente.
- Les animations sont limitées aux halos, transitions et étoiles. Fontaine réelle et séquences 3D : non implémentées.
- Audio : non implémenté. Aucun son ne démarre automatiquement.
- Les libellés FR sont provisoires et les liens AR/EN sont réservés à de futures pages. Aucune fausse base de données.

## Contrôles
- `npm run build` doit passer avant déploiement.
- Tester 1448px, 1024px, 390px ; inspecter la capture à 100 %.
- Pas d'import de données ou de code depuis un ancien projet.
