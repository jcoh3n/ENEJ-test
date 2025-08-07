#!/usr/bin/env node

/**
 * Script pour consulter la base de données MongoDB
 * Usage: node scripts/view-database.js [collection]
 * 
 * Collections disponibles: users, actualites
 */

const { exec } = require('child_process');

const collection = process.argv[2] || 'all';

const mongoCommands = {
  users: `
use('ActualitesDb');
print('📊 UTILISATEURS (Total: ' + db.users.countDocuments() + ')');
print('=' .repeat(50));
db.users.find().forEach(user => {
  print('🆔 ID: ' + user._id);
  print('👤 Nom: ' + (user.prenom || 'N/A') + ' ' + (user.nom || 'N/A'));
  print('📧 Email: ' + (user.email || 'N/A'));
  print('👥 Profil: ' + (user.profil || 'N/A'));
  print('🔐 Mot de passe hashé: ' + (user.motDePasse ? 'Oui' : 'Non'));
  print('📅 Créé le: ' + (user.dateCreation || 'N/A'));
  print('-'.repeat(30));
});
  `,
  
  actualites: `
use('ActualitesDb');
print('📰 ACTUALITÉS (Total: ' + db.actualites.countDocuments() + ')');
print('=' .repeat(50));
db.actualites.find().sort({dateCreation: -1}).forEach(actualite => {
  print('🆔 ID: ' + actualite._id);
  print('📰 Titre: ' + actualite.titre);
  print('📝 Description: ' + (actualite.description ? actualite.description.substring(0, 100) + '...' : 'N/A'));
  print('👥 Profils: ' + actualite.profilsDiffusion.join(', '));
  print('👤 Créateur: ' + actualite.createurInfo.prenom + ' ' + actualite.createurInfo.nom);
  print('📅 Publication: ' + actualite.datePublication);
  print('⏰ Expiration: ' + actualite.dateExpiration);
  print('✅ Actif: ' + (actualite.actif ? 'Oui' : 'Non'));
  print('-'.repeat(30));
});
  `,
  
  stats: `
use('ActualitesDb');
print('📊 STATISTIQUES DE LA BASE DE DONNÉES');
print('==================================================');
print('👤 Utilisateurs: ' + db.users.countDocuments());
print('📰 Actualités: ' + db.actualites.countDocuments());
print('');
print('📊 RÉPARTITION DES PROFILS:');
db.users.aggregate([
  { \\$group: { _id: '\\$profil', count: { \\$sum: 1 } } },
  { \\$sort: { count: -1 } }
]).forEach(result => {
  print('  ' + (result._id || 'Non défini') + ': ' + result.count);
});
print('');
print('📊 ACTUALITÉS PAR PROFIL:');
db.actualites.aggregate([
  { \\$unwind: '\\$profilsDiffusion' },
  { \\$group: { _id: '\\$profilsDiffusion', count: { \\$sum: 1 } } },
  { \\$sort: { count: -1 } }
]).forEach(result => {
  print('  ' + result._id + ': ' + result.count);
});
  `,
  
  all: `
use('ActualitesDb');
print('🗄️  BASE DE DONNÉES: ActualitesDb');
print('=' .repeat(50));
print('');

print('📊 STATISTIQUES:');
print('  👤 Utilisateurs: ' + db.users.countDocuments());
print('  📰 Actualités: ' + db.actualites.countDocuments());
print('');

print('👤 UTILISATEURS:');
print('-'.repeat(30));
db.users.find().forEach(user => {
  print('• ' + (user.prenom || 'N/A') + ' ' + (user.nom || 'N/A') + ' (' + (user.profil || 'N/A') + ')');
});
print('');

print('📰 ACTUALITÉS RÉCENTES (5 dernières):');
print('-'.repeat(30));
db.actualites.find().sort({dateCreation: -1}).limit(5).forEach(actualite => {
  print('• ' + actualite.titre + ' [' + actualite.profilsDiffusion.join(', ') + ']');
});
  `
};

function runMongoCommand(command) {
  const dockerCommand = `docker exec actualites-mongodb mongosh --quiet --eval "${command}"`;
  
  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Erreur:', error.message);
      return;
    }
    if (stderr) {
      console.error('⚠️  Avertissement:', stderr);
    }
    console.log(stdout);
  });
}

// Afficher l'aide
if (collection === 'help' || collection === '--help' || collection === '-h') {
  console.log(`
🔍 CONSULTEUR DE BASE DE DONNÉES MONGODB
========================================

Usage: node scripts/view-database.js [collection]

Collections disponibles:
  users       - Afficher tous les utilisateurs
  actualites  - Afficher toutes les actualités
  stats       - Afficher les statistiques
  all         - Vue d'ensemble (par défaut)
  help        - Afficher cette aide

Exemples:
  node scripts/view-database.js
  node scripts/view-database.js users
  node scripts/view-database.js actualites
  node scripts/view-database.js stats
  `);
  process.exit(0);
}

// Vérifier que le conteneur MongoDB est en cours d'exécution
exec('docker ps --filter "name=actualites-mongodb" --format "{{.Names}}"', (error, stdout) => {
  if (error || !stdout.trim()) {
    console.error('❌ Le conteneur MongoDB "actualites-mongodb" n\'est pas en cours d\'exécution.');
    console.log('💡 Démarrez-le avec: npm run setup');
    process.exit(1);
  }
  
  // Exécuter la commande MongoDB appropriée
  const command = mongoCommands[collection];
  if (!command) {
    console.error(`❌ Collection inconnue: ${collection}`);
    console.log('💡 Collections disponibles: users, actualites, stats, all');
    console.log('💡 Utilisez "help" pour plus d\'informations');
    process.exit(1);
  }
  
  runMongoCommand(command);
});