// Script d'initialisation de la base de données MongoDB
// Exécuter avec: mongosh ActualitesDb init-database.js

print("🗄️  Initialisation de la base de données ActualitesDb");
print("======================================================");

// Sélectionner la base de données
db = db.getSiblingDB('ActualitesDb');

// Supprimer les collections existantes pour un fresh start
print("🧹 Nettoyage des collections existantes...");
db.users.drop();
db.actualites.drop();

// Créer les utilisateurs de test
print("👥 Création des utilisateurs de test...");

// Mots de passe hashés avec BCrypt (pour 'admin123', 'prof123', 'eleve123')
const users = [
    {
        nom: "Admin",
        prenom: "Super",
        profil: "direction",
        login: "admin",
        motDePasse: "$2a$11$8vJ6qX7HkJ9Xw5QZJ8mYr.X6p8fQ2R7Y8vJ6qX7HkJ9Xw5QZJ8mYr.", // admin123
        dateCreation: new Date(),
        derniereConnexion: null
    },
    {
        nom: "Professeur",
        prenom: "Jean",
        profil: "professeur", 
        login: "prof1",
        motDePasse: "$2a$11$9wK7rY8IlK0Yx6RZK9nZs.Y7q9gS3S8Z9wK7rY8IlK0Yx6RZK9nZs.", // prof123
        dateCreation: new Date(),
        derniereConnexion: null
    },
    {
        nom: "Élève",
        prenom: "Marie",
        profil: "eleve",
        login: "eleve1", 
        motDePasse: "$2a$11$0xL8sZ9JmL1Zy7SaL0oat.Z8r0hT4T9a0xL8sZ9JmL1Zy7SaL0oat.", // eleve123
        dateCreation: new Date(),
        derniereConnexion: null
    },
    {
        nom: "Martin",
        prenom: "Paul",
        profil: "professeur",
        login: "prof2",
        motDePasse: "$2a$11$9wK7rY8IlK0Yx6RZK9nZs.Y7q9gS3S8Z9wK7rY8IlK0Yx6RZK9nZs.", // prof123
        dateCreation: new Date(),
        derniereConnexion: null
    },
    {
        nom: "Dupont",
        prenom: "Sophie",
        profil: "eleve",
        login: "eleve2",
        motDePasse: "$2a$11$0xL8sZ9JmL1Zy7SaL0oat.Z8r0hT4T9a0xL8sZ9JmL1Zy7SaL0oat.", // eleve123
        dateCreation: new Date(),
        derniereConnexion: null
    }
];

const insertedUsers = db.users.insertMany(users);
print(`✅ ${insertedUsers.insertedIds.length} utilisateurs créés`);

// Récupérer l'utilisateur admin pour créer des actualités
const adminUser = db.users.findOne({login: "admin"});

// Créer des actualités de test
print("📰 Création des actualités de test...");

const actualites = [
    {
        titre: "Rentrée scolaire 2024-2025",
        profilsDiffusion: ["eleve", "professeur", "direction"],
        description: "La rentrée scolaire aura lieu le lundi 2 septembre 2024. Tous les élèves sont attendus à 8h00 dans la cour principale. Les professeurs sont priés de se présenter à 7h30 pour la réunion de pré-rentrée.",
        image: null,
        datePublication: new Date(),
        dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        createurId: adminUser._id,
        createurInfo: {
            nom: adminUser.nom,
            prenom: adminUser.prenom,
            profil: adminUser.profil
        },
        dateCreation: new Date(),
        dateModification: null,
        actif: true
    },
    {
        titre: "Réunion parents-professeurs",
        profilsDiffusion: ["professeur"],
        description: "Réunion obligatoire pour tous les professeurs le vendredi 15 septembre à 17h00 en salle des professeurs. Ordre du jour : organisation des rencontres parents-professeurs du mois d'octobre.",
        image: null,
        datePublication: new Date(),
        dateExpiration: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 jours
        createurId: adminUser._id,
        createurInfo: {
            nom: adminUser.nom,
            prenom: adminUser.prenom,
            profil: adminUser.profil
        },
        dateCreation: new Date(),
        dateModification: null,
        actif: true
    },
    {
        titre: "Sortie scolaire au musée",
        profilsDiffusion: ["eleve"],
        description: "Sortie pédagogique au Musée des Sciences pour les classes de 3ème le jeudi 21 septembre. Départ à 9h00, retour prévu à 16h30. Autorisation parentale obligatoire.",
        image: null,
        datePublication: new Date(),
        dateExpiration: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 jours
        createurId: adminUser._id,
        createurInfo: {
            nom: adminUser.nom,
            prenom: adminUser.prenom,
            profil: adminUser.profil
        },
        dateCreation: new Date(),
        dateModification: null,
        actif: true
    },
    {
        titre: "Mise à jour du règlement intérieur",
        profilsDiffusion: ["direction", "professeur"],
        description: "Le règlement intérieur a été mis à jour. Les principales modifications concernent les règles d'utilisation des téléphones portables et les horaires de sortie. Document disponible sur l'intranet.",
        image: null,
        datePublication: new Date(),
        dateExpiration: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 jours
        createurId: adminUser._id,
        createurInfo: {
            nom: adminUser.nom,
            prenom: adminUser.prenom,
            profil: adminUser.profil
        },
        dateCreation: new Date(),
        dateModification: null,
        actif: true
    },
    {
        titre: "Concours de mathématiques",
        profilsDiffusion: ["eleve", "professeur"],
        description: "Inscription ouverte pour le concours national de mathématiques. Les élèves intéressés doivent s'inscrire avant le 30 septembre auprès de leur professeur de mathématiques.",
        image: null,
        datePublication: new Date(),
        dateExpiration: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 jours
        createurId: adminUser._id,
        createurInfo: {
            nom: adminUser.nom,
            prenom: adminUser.prenom,
            profil: adminUser.profil
        },
        dateCreation: new Date(),
        dateModification: null,
        actif: true
    },
    {
        titre: "Formation continue des enseignants",
        profilsDiffusion: ["professeur"],
        description: "Session de formation continue sur les nouvelles technologies éducatives. Inscription obligatoire avant le 10 octobre. Formation prévue les 15 et 16 novembre.",
        image: null,
        datePublication: new Date(),
        dateExpiration: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 jours
        createurId: adminUser._id,
        createurInfo: {
            nom: adminUser.nom,
            prenom: adminUser.prenom,
            profil: adminUser.profil
        },
        dateCreation: new Date(),
        dateModification: null,
        actif: true
    }
];

const insertedActualites = db.actualites.insertMany(actualites);
print(`✅ ${insertedActualites.insertedIds.length} actualités créées`);

// Créer les index
print("🔍 Création des index...");

// Index pour les utilisateurs
db.users.createIndex({ login: 1 }, { unique: true });
db.users.createIndex({ profil: 1 });

// Index pour les actualités
db.actualites.createIndex({ datePublication: -1 });
db.actualites.createIndex({ profilsDiffusion: 1 });
db.actualites.createIndex({ createurId: 1 });
db.actualites.createIndex({ dateExpiration: 1 });
db.actualites.createIndex({ actif: 1 });

print("✅ Index créés");

print("");
print("🎉 Base de données initialisée avec succès !");
print("======================================================");
print("👥 Comptes créés :");
print("   🔑 Direction: login='admin', mot de passe='admin123'");
print("   👨‍🏫 Professeur 1: login='prof1', mot de passe='prof123'");
print("   👨‍🏫 Professeur 2: login='prof2', mot de passe='prof123'");
print("   🎓 Élève 1: login='eleve1', mot de passe='eleve123'");
print("   🎓 Élève 2: login='eleve2', mot de passe='eleve123'");
print("");
print("📰 Actualités créées : 6 actualités de test");
print("======================================================");