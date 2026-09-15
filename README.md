# TaskFlow

Gestionnaire de tâches personnel — projet de fin de séquence D-CLIC
(Développement Web, Niveau Approfondi). Application full-stack
**React (front-end)** + **Laravel (API back-end)**, avec authentification,
catégories et suivi de statut des tâches.

Ce dépôt correspond au code décrit dans le **Cahier des charges**, le
**Dossier de conception technique** et le **Dossier de conception
visuelle** rédigés en semaine 5.

## Structure du dépôt

```
taskflow/
├── frontend/   → Application React (Vite + React Router + Bootstrap + Axios)
└── backend/    → Code Laravel spécifique à TaskFlow (voir backend/README.md)
```

## Démarrage rapide

### 1. Back-end (API Laravel)

Suis les instructions détaillées dans **`backend/README.md`** — un
projet Laravel doit d'abord être créé localement avec `composer
create-project`, puis les fichiers fournis y sont copiés (Packagist
n'était pas accessible dans l'environnement où ce code a été généré).

### 2. Front-end (React)

Le dossier `frontend/` est un projet Vite complet et fonctionnel, les
dépendances sont déjà déclarées dans `package.json`.

```bash
cd frontend
npm install
cp .env.example .env    # ajuster VITE_API_URL si besoin
npm run dev
```

L'application est alors disponible sur `http://localhost:5173`, et
communique avec l'API Laravel sur `http://localhost:8000/api` par défaut.

## Choix techniques (rappel)

- **Authentification** : Laravel Sanctum (token Bearer), stocké côté
  React dans `localStorage` et géré via `AuthContext` (Context API).
- **Style** : Bootstrap 5 (classes utilitaires + composants `card`,
  `btn`, `badge`, `navbar`, `form-control`...).
- **Navigation** : `react-router-dom`, avec un composant `PrivateRoute`
  qui protège les pages nécessitant une authentification.
- **Modèle de données** : `users`, `categories`, `tasks` (voir le
  Dossier de conception technique pour le détail des colonnes et
  relations).

## Prochaines étapes suggérées

1. Copier les fichiers back-end dans un vrai projet Laravel (voir
   `backend/README.md`) et lancer les migrations.
2. Lancer le front-end et vérifier la connexion à l'API (inscription,
   connexion, création d'une tâche).
3. Écrire les tests Laravel (Pest/PHPUnit) mentionnés dans le plan de
   validation du Dossier de conception technique.
4. Déposer le projet sur GitHub avec des commits réguliers, en suivant
   le calendrier de la semaine 6.
