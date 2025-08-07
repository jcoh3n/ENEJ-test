# 🗄️ Guide de Consultation de la Base de Données

Ce guide vous explique comment consulter et explorer la base de données MongoDB de votre application Actualités.

## 🚀 Méthodes de Consultation

### 1. **Scripts npm (Recommandé)**

Les commandes les plus simples pour consulter votre base de données :

```bash
# Vue d'ensemble de la base de données
npm run view-db

# Voir tous les utilisateurs
npm run view-users

# Voir toutes les actualités
npm run view-actualites

# Statistiques détaillées
npm run db-stats
```

### 2. **Script personnalisé**

Pour plus de contrôle :

```bash
# Vue générale
node scripts/view-database.js

# Collections spécifiques
node scripts/view-database.js users
node scripts/view-database.js actualites
node scripts/view-database.js stats

# Aide
node scripts/view-database.js help
```

### 3. **MongoDB Shell direct**

Pour les utilisateurs avancés :

```bash
# Se connecter au shell MongoDB
docker exec -it actualites-mongodb mongosh

# Une fois dans le shell :
use('ActualitesDb')
db.users.find().pretty()
db.actualites.find().pretty()
```

### 4. **Commandes MongoDB directes**

```bash
# Compter les documents
docker exec actualites-mongodb mongosh --quiet --eval "use('ActualitesDb'); print('Users:', db.users.countDocuments()); print('Actualités:', db.actualites.countDocuments())"

# Voir la structure des collections
docker exec actualites-mongodb mongosh --quiet --eval "use('ActualitesDb'); db.users.findOne()"
```

## 📊 Structure de la Base de Données

### Base de données : `ActualitesDb`

#### Collection `users`
```javascript
{
  "_id": ObjectId,
  "email": "string",           // Optionnel
  "prenom": "string",
  "nom": "string",
  "profil": "string",          // "eleve", "professeur", "direction"
  "motDePasse": "string",      // Hash BCrypt
  "dateCreation": Date
}
```

#### Collection `actualites`
```javascript
{
  "_id": ObjectId,
  "titre": "string",
  "description": "string",
  "profilsDiffusion": ["string"],    // Array de profils
  "datePublication": Date,
  "dateExpiration": Date,
  "dateCreation": Date,
  "dateModification": Date,          // Optionnel
  "actif": boolean,
  "createurId": ObjectId,
  "createurInfo": {
    "prenom": "string",
    "nom": "string",
    "profil": "string"
  },
  "image": "string"                  // Optionnel
}
```

## 🔍 Requêtes Utiles

### Requêtes sur les utilisateurs

```javascript
// Compter les utilisateurs par profil
db.users.aggregate([
  { $group: { _id: "$profil", count: { $sum: 1 } } }
])

// Trouver un utilisateur par email
db.users.findOne({ email: "admin@example.com" })

// Tous les professeurs
db.users.find({ profil: "professeur" })
```

### Requêtes sur les actualités

```javascript
// Actualités pour un profil spécifique
db.actualites.find({ profilsDiffusion: "eleve" })

// Actualités actives non expirées
db.actualites.find({ 
  actif: true, 
  dateExpiration: { $gt: new Date() } 
})

// Actualités créées par un utilisateur
db.actualites.find({ "createurInfo.profil": "direction" })

// Actualités récentes (30 derniers jours)
db.actualites.find({ 
  dateCreation: { 
    $gte: new Date(Date.now() - 30*24*60*60*1000) 
  } 
})
```

### Statistiques avancées

```javascript
// Nombre d'actualités par créateur
db.actualites.aggregate([
  { 
    $group: { 
      _id: { prenom: "$createurInfo.prenom", nom: "$createurInfo.nom" },
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])

// Actualités les plus populaires (par nombre de profils ciblés)
db.actualites.aggregate([
  {
    $project: {
      titre: 1,
      nbProfils: { $size: "$profilsDiffusion" }
    }
  },
  { $sort: { nbProfils: -1 } }
])
```

## 🛠️ Outils de Gestion

### Nettoyage de la base

```bash
# Supprimer toutes les actualités de test
docker exec actualites-mongodb mongosh --eval "
use('ActualitesDb'); 
db.actualites.deleteMany({ titre: { \$regex: /test/i } })
"

# Supprimer les actualités expirées
docker exec actualites-mongodb mongosh --eval "
use('ActualitesDb'); 
db.actualites.deleteMany({ dateExpiration: { \$lt: new Date() } })
"
```

### Sauvegarde et Restauration

```bash
# Exporter la base de données
docker exec actualites-mongodb mongodump --db ActualitesDb --out /backup

# Copier la sauvegarde vers l'hôte
docker cp actualites-mongodb:/backup ./mongodb-backup

# Restaurer
docker exec actualites-mongodb mongorestore --db ActualitesDb /backup/ActualitesDb
```

## 🚨 Dépannage

### Le conteneur MongoDB n'est pas en cours d'exécution

```bash
# Vérifier l'état
docker ps | grep mongo

# Démarrer MongoDB
npm run setup
# ou
docker-compose up -d
```

### Problèmes de connexion

```bash
# Vérifier les logs MongoDB
docker logs actualites-mongodb

# Redémarrer le conteneur
docker restart actualites-mongodb
```

### Base de données vide

```bash
# Réinitialiser les données
npm run create-users
npm run create-news
```

## 📝 Conseils

1. **Utilisez toujours les scripts npm** pour les tâches courantes
2. **Sauvegardez régulièrement** vos données importantes
3. **Testez vos requêtes** sur un petit échantillon avant de les appliquer massivement
4. **Surveillez les performances** avec des requêtes complexes
5. **Documentez vos requêtes personnalisées** pour les réutiliser

## 🔗 Liens Utiles

- [Documentation MongoDB](https://docs.mongodb.com/)
- [MongoDB Shell (mongosh)](https://docs.mongodb.com/mongodb-shell/)
- [Agrégation Pipeline](https://docs.mongodb.com/manual/aggregation/)
- [Requêtes MongoDB](https://docs.mongodb.com/manual/tutorial/query-documents/)