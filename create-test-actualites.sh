#!/bin/bash

echo "📰 Création des actualités de test"
echo "================================="

# D'abord, se connecter pour obtenir l'ID de l'utilisateur admin
echo "🔑 Connexion en tant qu'admin..."
ADMIN_ID=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin",
    "motDePasse": "admin123"
  }' | jq -r '.user.id')

echo "Admin ID: $ADMIN_ID"

API_URL="http://localhost:5000/api/actualites"

# Date actuelle et dates futures
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
FUTURE_DATE=$(date -u -d "+30 days" +"%Y-%m-%dT%H:%M:%SZ")

echo "📝 Création de l'actualité 1: Rentrée scolaire..."
curl -X POST "$API_URL?userId=$ADMIN_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"titre\": \"Rentrée scolaire 2024-2025\",
    \"profilsDiffusion\": [\"eleve\", \"professeur\", \"direction\"],
    \"description\": \"La rentrée scolaire aura lieu le lundi 2 septembre 2024. Tous les élèves sont attendus à 8h00 dans la cour principale. Les professeurs sont priés de se présenter à 7h30 pour la réunion de pré-rentrée.\",
    \"datePublication\": \"$CURRENT_DATE\",
    \"dateExpiration\": \"$FUTURE_DATE\"
  }" \
  -w "\nStatut: %{http_code}\n\n"

echo "📝 Création de l'actualité 2: Réunion parents-professeurs..."
curl -X POST "$API_URL?userId=$ADMIN_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"titre\": \"Réunion parents-professeurs\",
    \"profilsDiffusion\": [\"professeur\"],
    \"description\": \"Réunion obligatoire pour tous les professeurs le vendredi 15 septembre à 17h00 en salle des professeurs. Ordre du jour : organisation des rencontres parents-professeurs du mois d'octobre.\",
    \"datePublication\": \"$CURRENT_DATE\",
    \"dateExpiration\": \"$FUTURE_DATE\"
  }" \
  -w "\nStatut: %{http_code}\n\n"

echo "📝 Création de l'actualité 3: Sortie scolaire..."
curl -X POST "$API_URL?userId=$ADMIN_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"titre\": \"Sortie scolaire au musée\",
    \"profilsDiffusion\": [\"eleve\"],
    \"description\": \"Sortie pédagogique au Musée des Sciences pour les classes de 3ème le jeudi 21 septembre. Départ à 9h00, retour prévu à 16h30. Autorisation parentale obligatoire.\",
    \"datePublication\": \"$CURRENT_DATE\",
    \"dateExpiration\": \"$FUTURE_DATE\"
  }" \
  -w "\nStatut: %{http_code}\n\n"

echo "📝 Création de l'actualité 4: Mise à jour du règlement..."
curl -X POST "$API_URL?userId=$ADMIN_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"titre\": \"Mise à jour du règlement intérieur\",
    \"profilsDiffusion\": [\"direction\", \"professeur\"],
    \"description\": \"Le règlement intérieur a été mis à jour. Les principales modifications concernent les règles d'utilisation des téléphones portables et les horaires de sortie. Document disponible sur l'intranet.\",
    \"datePublication\": \"$CURRENT_DATE\",
    \"dateExpiration\": \"$FUTURE_DATE\"
  }" \
  -w "\nStatut: %{http_code}\n\n"

echo "📝 Création de l'actualité 5: Concours de mathématiques..."
curl -X POST "$API_URL?userId=$ADMIN_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"titre\": \"Concours de mathématiques\",
    \"profilsDiffusion\": [\"eleve\", \"professeur\"],
    \"description\": \"Inscription ouverte pour le concours national de mathématiques. Les élèves intéressés doivent s'inscrire avant le 30 septembre auprès de leur professeur de mathématiques.\",
    \"datePublication\": \"$CURRENT_DATE\",
    \"dateExpiration\": \"$FUTURE_DATE\"
  }" \
  -w "\nStatut: %{http_code}\n\n"

echo "📝 Création de l'actualité 6: Formation continue..."
curl -X POST "$API_URL?userId=$ADMIN_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"titre\": \"Formation continue des enseignants\",
    \"profilsDiffusion\": [\"professeur\"],
    \"description\": \"Session de formation continue sur les nouvelles technologies éducatives. Inscription obligatoire avant le 10 octobre. Formation prévue les 15 et 16 novembre.\",
    \"datePublication\": \"$CURRENT_DATE\",
    \"dateExpiration\": \"$FUTURE_DATE\"
  }" \
  -w "\nStatut: %{http_code}\n\n"

echo "✅ Actualités créées avec succès !"
echo "================================="