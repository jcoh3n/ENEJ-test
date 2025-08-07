#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Se connecter comme admin pour créer les actualités
async function loginAsAdmin() {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      login: 'admin',
      motDePasse: 'admin123'
    });
    return response.data.success ? response.data.user : null;
  } catch (error) {
    console.error('❌ Erreur de connexion admin:', error.message);
    return null;
  }
}

const sampleNews = [
  {
    titre: 'Rentrée scolaire 2024',
    profilsDiffusion: ['eleve', 'professeur', 'direction'],
    description: 'La rentrée scolaire aura lieu le lundi 2 septembre 2024. Tous les élèves sont attendus à 8h00 dans la cour principale pour l\'accueil et la répartition dans les classes.',
    datePublication: new Date('2024-08-15'),
    dateExpiration: new Date('2024-09-15'),
    actif: true
  },
  {
    titre: 'Réunion parents-professeurs',
    profilsDiffusion: ['professeur', 'direction'],
    description: 'Réunion préparatoire pour organiser les rencontres parents-professeurs du trimestre. Présence obligatoire de tous les enseignants.',
    datePublication: new Date('2024-09-01'),
    dateExpiration: new Date('2024-09-30'),
    actif: true
  },
  {
    titre: 'Sortie éducative au musée',
    profilsDiffusion: ['eleve'],
    description: 'Sortie pédagogique au musée des sciences pour les classes de 3ème. Départ prévu à 9h00, retour à 16h30. Autorisation parentale requise.',
    datePublication: new Date('2024-09-10'),
    dateExpiration: new Date('2024-10-10'),
    actif: true
  },
  {
    titre: 'Conseil d\'établissement',
    profilsDiffusion: ['direction'],
    description: 'Conseil d\'établissement mensuel. Ordre du jour : budget, projets pédagogiques, travaux d\'amélioration des locaux.',
    datePublication: new Date('2024-09-05'),
    dateExpiration: new Date('2024-10-05'),
    actif: true
  },
  {
    titre: 'Journée portes ouvertes',
    profilsDiffusion: ['eleve', 'professeur', 'direction'],
    description: 'Journée portes ouvertes de l\'établissement le samedi 30 septembre. Présentation des filières, rencontre avec les équipes pédagogiques.',
    datePublication: new Date('2024-09-01'),
    dateExpiration: new Date('2024-10-01'),
    actif: true
  },
  {
    titre: 'Formation continue professeurs',
    profilsDiffusion: ['professeur'],
    description: 'Session de formation continue sur les nouvelles technologies éducatives. Inscription obligatoire avant le 20 septembre.',
    datePublication: new Date('2024-09-08'),
    dateExpiration: new Date('2024-09-25'),
    actif: true
  },
  {
    titre: 'Élections des délégués',
    profilsDiffusion: ['eleve'],
    description: 'Élections des délégués de classe. Campagne électorale du 15 au 20 septembre, vote le 21 septembre.',
    datePublication: new Date('2024-09-12'),
    dateExpiration: new Date('2024-09-25'),
    actif: true
  }
];

async function createNews() {
  console.log('🔄 Création des actualités de test...');
  
  // Se connecter comme admin
  const admin = await loginAsAdmin();
  if (!admin) {
    console.error('❌ Impossible de se connecter comme admin');
    return;
  }
  
  console.log('✅ Connecté comme admin');
  
  for (const news of sampleNews) {
    try {
      const response = await axios.post(`${API_BASE}/actualites?userId=${admin.id}`, news);
      console.log(`✅ Actualité créée: "${news.titre}" (${news.profilsDiffusion.join(', ')})`);
    } catch (error) {
      console.error(`❌ Erreur pour "${news.titre}":`, error.response?.data?.message || error.message);
    }
  }
  
  console.log('✅ Initialisation des actualités terminée!');
  console.log(`📰 ${sampleNews.length} actualités créées avec différents profils de diffusion\n`);
}

async function main() {
  await createNews();
}

if (require.main === module) {
  main().catch(console.error);
}