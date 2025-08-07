#!/bin/bash

echo "👥 Création des utilisateurs de test via l'API"
echo "=============================================="

API_URL="http://localhost:5000/api/auth/register"

# Attendre que l'API soit prête
echo "⏳ Attente du démarrage de l'API..."
sleep 10

# Créer l'utilisateur admin (direction)
echo "🔑 Création de l'utilisateur admin..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Admin",
    "prenom": "Super",
    "profil": "direction",
    "login": "admin",
    "motDePasse": "admin123"
  }' \
  -w "\nStatut: %{http_code}\n\n"

# Créer un professeur
echo "👨‍🏫 Création du professeur 1..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Martin",
    "prenom": "Jean",
    "profil": "professeur",
    "login": "prof1",
    "motDePasse": "prof123"
  }' \
  -w "\nStatut: %{http_code}\n\n"

# Créer un élève
echo "🎓 Création de l'élève 1..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Marie",
    "profil": "eleve",
    "login": "eleve1",
    "motDePasse": "eleve123"
  }' \
  -w "\nStatut: %{http_code}\n\n"

# Créer un autre professeur
echo "👨‍🏫 Création du professeur 2..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Rousseau",
    "prenom": "Paul",
    "profil": "professeur",
    "login": "prof2",
    "motDePasse": "prof123"
  }' \
  -w "\nStatut: %{http_code}\n\n"

# Créer un autre élève
echo "🎓 Création de l'élève 2..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Moreau",
    "prenom": "Sophie",
    "profil": "eleve",
    "login": "eleve2",
    "motDePasse": "eleve123"
  }' \
  -w "\nStatut: %{http_code}\n\n"

echo "✅ Utilisateurs créés !"
echo "======================"
echo "🔑 Direction: login='admin', mot de passe='admin123'"
echo "👨‍🏫 Professeur 1: login='prof1', mot de passe='prof123'"
echo "👨‍🏫 Professeur 2: login='prof2', mot de passe='prof123'"
echo "🎓 Élève 1: login='eleve1', mot de passe='eleve123'"
echo "🎓 Élève 2: login='eleve2', mot de passe='eleve123'"