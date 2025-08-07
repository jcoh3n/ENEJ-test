#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

const testUsers = [
  {
    nom: 'Admin',
    prenom: 'Système',
    profil: 'direction',
    login: 'admin',
    motDePasse: 'admin123'
  },
  {
    nom: 'Dupont',
    prenom: 'Marie',
    profil: 'professeur',
    login: 'marie.dupont',
    motDePasse: 'prof123'
  },
  {
    nom: 'Martin',
    prenom: 'Pierre',
    profil: 'professeur',
    login: 'pierre.martin',
    motDePasse: 'prof123'
  },
  {
    nom: 'Durand',
    prenom: 'Sophie',
    profil: 'eleve',
    login: 'sophie.durand',
    motDePasse: 'eleve123'
  },
  {
    nom: 'Bernard',
    prenom: 'Lucas',
    profil: 'eleve',
    login: 'lucas.bernard',
    motDePasse: 'eleve123'
  }
];

async function createUsers() {
  console.log('🔄 Création des utilisateurs de test...');
  
  for (const user of testUsers) {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, user);
      if (response.data.success) {
        console.log(`✅ Utilisateur créé: ${user.login} (${user.profil})`);
      } else {
        console.log(`⚠️  Utilisateur ${user.login} existe déjà ou erreur: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`⚠️  Utilisateur ${user.login} existe probablement déjà`);
      } else {
        console.error(`❌ Erreur pour ${user.login}:`, error.message);
      }
    }
  }
  
  console.log('✅ Initialisation des utilisateurs terminée!');
  console.log('\n📋 Comptes de test disponibles:');
  console.log('   Admin: admin / admin123');
  console.log('   Professeur: marie.dupont / prof123');
  console.log('   Professeur: pierre.martin / prof123');
  console.log('   Élève: sophie.durand / eleve123');
  console.log('   Élève: lucas.bernard / eleve123\n');
}

// Attendre que l'API soit prête
async function waitForAPI() {
  const maxRetries = 30;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await axios.get(`${API_BASE}/auth/test`, { timeout: 1000 });
      return true;
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('❌ API non accessible après 30 tentatives');
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function main() {
  console.log('⏳ Attente de l\'API...');
  const apiReady = await waitForAPI();
  if (apiReady) {
    await createUsers();
  }
}

if (require.main === module) {
  main().catch(console.error);
}