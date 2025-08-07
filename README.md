# 📰 Application de Gestion d'Actualités

Une application complète de gestion d'actualités développée avec Angular, .NET et MongoDB, permettant aux utilisateurs de créer, consulter et gérer des actualités selon leur profil.

## 🏗️ Architecture

- **Frontend**: Angular 18 avec Angular Material
- **Backend**: .NET 8.0 Web API
- **Base de données**: MongoDB
- **Containerisation**: Docker pour MongoDB

## 📋 Fonctionnalités

### 👥 Gestion des utilisateurs
- 3 profils d'utilisateurs : élève, professeur, direction
- Authentification sécurisée avec hashage des mots de passe (BCrypt)
- Gestion des sessions utilisateur

### 📰 Gestion des actualités
- **Dashboard** : Affichage des 5 dernières actualités pertinentes
- **Liste complète** : Pagination par 5 actualités, triées par date
- **Consultation détaillée** : Vue complète d'une actualité
- **Création/Modification** : Réservée aux profils direction
- **Suppression** : Réservée au créateur de l'actualité
- **Filtrage automatique** : Selon le profil de l'utilisateur

### 🎯 Règles métier
- Les actualités sont filtrées selon les profils de diffusion
- Seuls les profils "direction" peuvent créer des actualités
- Seul le créateur peut supprimer ses actualités
- Les actualités ont une date d'expiration
- Pagination intelligente (5 actualités par page)

## 🚀 Installation et démarrage

### Prérequis
- Node.js 20.x
- .NET 8.0 SDK
- Docker et Docker Compose
- Git

### 1. Cloner le projet
```bash
git clone <repository-url>
cd ENEJ-test
```

### 2. Démarrage automatique (recommandé)
```bash
# Démarrer tous les services
./start-project.sh
```

### 3. Démarrage manuel

#### MongoDB
```bash
docker-compose up -d mongodb
```

#### Backend .NET
```bash
cd ActualitesApi
dotnet restore
dotnet run --urls="http://localhost:5000"
```

#### Frontend Angular
```bash
cd actualites-frontend
npm install
npm start
```

### 4. Initialisation des données de test
```bash
# Créer les utilisateurs de test
./create-test-users.sh

# Créer les actualités de test
./create-test-actualites.sh
```

## 🌐 Accès à l'application

- **Frontend Angular** : http://localhost:4200
- **API Backend** : http://localhost:5000
- **API Documentation** : http://localhost:5000/swagger
- **MongoDB** : localhost:27017

## 👤 Comptes de test

| Profil | Login | Mot de passe | Description |
|--------|-------|--------------|-------------|
| direction | admin | admin123 | Administrateur - peut créer/modifier toutes les actualités |
| professeur | prof1 | prof123 | Professeur Jean Martin |
| professeur | prof2 | prof123 | Professeur Paul Rousseau |
| eleve | eleve1 | eleve123 | Élève Marie Dupont |
| eleve | eleve2 | eleve123 | Élève Sophie Moreau |

## 📱 Guide d'utilisation

### Connexion
1. Accéder à http://localhost:4200
2. Utiliser un des comptes de test ci-dessus
3. Cliquer sur "Se connecter"

### Dashboard
- Affiche les 5 dernières actualités selon votre profil
- Bouton "Voir toutes les actualités" pour accéder à la liste complète
- Bouton "Créer une actualité" (visible uniquement pour les profils direction)

### Navigation
- **Toutes les actualités** : Liste paginée avec bouton "Charger plus"
- **Détail d'une actualité** : Clic sur une carte d'actualité
- **Création/Modification** : Formulaire complet avec sélection des profils de diffusion

## 🗄️ Structure de la base de données

### Collection `users`
```json
{
  "_id": "ObjectId",
  "nom": "string",
  "prenom": "string", 
  "profil": "eleve|professeur|direction",
  "login": "string (unique)",
  "motDePasse": "string (hashed)",
  "dateCreation": "Date",
  "derniereConnexion": "Date"
}
```

### Collection `actualites`
```json
{
  "_id": "ObjectId",
  "titre": "string",
  "profilsDiffusion": ["eleve", "professeur", "direction"],
  "description": "string",
  "image": "string (optional)",
  "datePublication": "Date",
  "dateExpiration": "Date",
  "createurId": "ObjectId",
  "createurInfo": {
    "nom": "string",
    "prenom": "string",
    "profil": "string"
  },
  "dateCreation": "Date",
  "dateModification": "Date",
  "actif": "boolean"
}
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Création d'un nouvel utilisateur

### Actualités
- `GET /api/actualites/dashboard/{userId}` - 5 dernières actualités pour le dashboard
- `GET /api/actualites/user/{userId}?page=0&size=5` - Liste paginée des actualités
- `GET /api/actualites/{id}` - Détail d'une actualité
- `POST /api/actualites?userId={userId}` - Création d'une actualité
- `PUT /api/actualites/{id}?userId={userId}` - Modification d'une actualité
- `DELETE /api/actualites/{id}?userId={userId}` - Suppression d'une actualité

## 🛠️ Technologies utilisées

### Frontend
- **Angular 18** - Framework principal
- **Angular Material** - Composants UI
- **TypeScript** - Langage de programmation
- **RxJS** - Programmation réactive
- **SCSS** - Styles

### Backend
- **.NET 8.0** - Framework web API
- **ASP.NET Core** - API REST
- **MongoDB.Driver** - Client MongoDB
- **BCrypt.Net** - Hashage des mots de passe

### Base de données
- **MongoDB 7.0** - Base de données NoSQL
- **Docker** - Containerisation de MongoDB

## 📊 Fonctionnalités avancées

### Sécurité
- Hashage BCrypt des mots de passe
- Validation des données côté client et serveur
- Protection des routes avec guards Angular
- Filtrage automatique des données selon le profil

### Performance
- Pagination intelligente (5 éléments par page)
- Index MongoDB optimisés
- Lazy loading des modules Angular
- Mise en cache des données utilisateur

### UX/UI
- Design moderne avec Angular Material
- Interface responsive
- Feedback utilisateur (snackbars, spinners)
- Navigation intuitive

## 🚀 Scénarios de test

1. **Connexion multi-profils** : Tester avec différents comptes (admin, prof1, eleve1)
2. **Création d'actualités** : Se connecter en tant qu'admin et créer diverses actualités
3. **Filtrage automatique** : Vérifier que chaque profil ne voit que ses actualités
4. **Pagination** : Tester le chargement par pages de 5 actualités
5. **Modification** : Modifier une actualité existante
6. **Suppression** : Supprimer une actualité (seulement le créateur)

## 🐛 Dépannage

### Problèmes courants
- **MongoDB non accessible** : Vérifier que Docker fonctionne et que le port 27017 est libre
- **API non accessible** : Vérifier que le port 5000 est libre et que .NET est installé
- **Frontend non accessible** : Vérifier que Node.js est installé et que le port 4200 est libre
- **CORS errors** : Vérifier que l'API backend est démarrée avant le frontend

### Logs
- **Backend** : Logs dans la console où `dotnet run` est exécuté
- **Frontend** : Console du navigateur (F12)
- **MongoDB** : `docker logs actualites-mongodb`

## 📈 Améliorations possibles

### Fonctionnalités bonus (mentionnées dans le cahier des charges)
- [ ] Marquer les actualités comme lues
- [ ] Gestion des pièces jointes
- [ ] Authentification via IDP externe
- [ ] Cache automatique avec invalidation après 10 minutes

### Autres améliorations
- [ ] Tests unitaires et d'intégration
- [ ] Déploiement avec Docker Compose complet
- [ ] Monitoring et métriques
- [ ] Gestion des rôles plus fine
- [ ] Interface d'administration

---

## 👨‍💻 Développement

Ce projet a été développé selon les bonnes pratiques :
- Architecture en couches
- Séparation des responsabilités
- Code propre et documenté
- Gestion d'erreurs robuste
- Interface utilisateur moderne

**Temps de développement estimé** : 2-3 jours pour un développeur expérimenté

---

*Projet réalisé dans le cadre d'un test technique - Mise en pratique Angular, .NET et MongoDB*