# TaskFlow — Back-end Laravel

Ce dossier contient uniquement le **code métier spécifique à TaskFlow**
(migrations, modèles, contrôleurs, requêtes de validation, policies,
routes API). Il ne contient PAS un projet Laravel complet, car cet
environnement de génération n'a pas accès à Packagist pour exécuter
`composer install`. Tu dois donc créer le squelette Laravel toi-même
en local, puis copier ces fichiers par-dessus. Ça prend 5 minutes.

## Étapes d'installation (en local, chez toi)

1. **Créer le projet Laravel**
   ```bash
   composer create-project laravel/laravel backend
   cd backend
   ```

2. **Installer Sanctum et scaffolder l'authentification API**
   (Laravel 11+ fournit une commande dédiée qui publie la config
   Sanctum et active le middleware `auth:sanctum` automatiquement) :
   ```bash
   php artisan install:api
   ```
   Si tu es sur Laravel 10 ou antérieur, installe Sanctum manuellement :
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```

3. **Copier les fichiers de ce dossier** par-dessus le projet fraîchement
   créé, en écrasant les fichiers existants quand demandé :
   - `app/Models/User.php` (remplace le fichier par défaut)
   - `app/Models/Category.php`, `app/Models/Task.php` (nouveaux)
   - `app/Http/Controllers/Api/*.php` (nouveaux, créer le dossier `Api`)
   - `app/Http/Requests/*.php` (nouveaux)
   - `app/Policies/*.php` (nouveaux)
   - `database/migrations/*_create_categories_table.php` et
     `*_create_tasks_table.php` (nouveaux, à côté des migrations par défaut)
   - `routes/api.php` (remplace le fichier par défaut)

   > Les policies (`TaskPolicy`, `CategoryPolicy`) sont détectées
   > automatiquement par Laravel grâce à la convention de nommage
   > (`Task` → `TaskPolicy`), aucune déclaration supplémentaire n'est
   > nécessaire.

4. **Configurer la base de données** dans `.env` (MySQL ou SQLite — le
   plus rapide pour développer en local est SQLite) :
   ```
   DB_CONNECTION=sqlite
   ```
   puis créer le fichier vide :
   ```bash
   touch database/database.sqlite
   ```

5. **Autoriser les requêtes du front-end React (CORS)** — dans
   `config/cors.php`, s'assurer que :
   ```php
   'paths' => ['api/*'],
   'allowed_origins' => ['http://localhost:5173'], // URL du dev server Vite
   ```

6. **Lancer les migrations**
   ```bash
   php artisan migrate
   ```

7. **Démarrer le serveur**
   ```bash
   php artisan serve
   ```
   L'API est alors disponible sur `http://localhost:8000/api`, l'URL
   attendue par défaut par le front-end React (`VITE_API_URL`).

## Endpoints disponibles

| Méthode | URL                  | Auth requise | Description                          |
|---------|----------------------|:------------:|---------------------------------------|
| POST    | /api/register        | non          | Créer un compte                       |
| POST    | /api/login           | non          | Se connecter, retourne un token       |
| POST    | /api/logout          | oui          | Révoque le token courant              |
| GET     | /api/user            | oui          | Utilisateur connecté                  |
| GET     | /api/categories      | oui          | Liste des catégories                  |
| POST    | /api/categories      | oui          | Créer une catégorie                   |
| PUT     | /api/categories/{id} | oui          | Modifier une catégorie                |
| DELETE  | /api/categories/{id} | oui          | Supprimer une catégorie               |
| GET     | /api/tasks           | oui          | Liste des tâches (filtres : `status`, `category_id`, `search`) |
| POST    | /api/tasks           | oui          | Créer une tâche                       |
| GET     | /api/tasks/{id}      | oui          | Détail d'une tâche                    |
| PUT     | /api/tasks/{id}      | oui          | Modifier une tâche (y compris statut) |
| DELETE  | /api/tasks/{id}      | oui          | Supprimer une tâche                   |

Toutes les routes protégées vérifient, via les policies, que la
ressource appartient bien à l'utilisateur connecté (retour `403` sinon).

## Tests

Une fois le projet copié, tu peux écrire des tests Pest/PHPUnit dans
`tests/Feature/` pour couvrir : inscription, connexion, et le CRUD des
tâches/catégories (cf. section 11 du dossier de conception technique).
