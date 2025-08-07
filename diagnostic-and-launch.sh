#!/bin/bash

echo "🔍 DIAGNOSTIC COMPLET ET LANCEMENT DU PROJET"
echo "=============================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo "🔧 ÉTAPE 1: Arrêt de tous les services existants"
echo "================================================"

# Arrêter tous les processus existants
pkill -f "ng serve" 2>/dev/null && success "Processus Angular arrêtés" || warning "Aucun processus Angular à arrêter"
pkill -f "dotnet run" 2>/dev/null && success "Processus .NET arrêtés" || warning "Aucun processus .NET à arrêter"
docker-compose down 2>/dev/null && success "Docker containers arrêtés" || warning "Aucun container Docker à arrêter"

sleep 3

echo ""
echo "🔧 ÉTAPE 2: Vérification des prérequis"
echo "======================================"

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js installé: $NODE_VERSION"
else
    error "Node.js non installé!"
    exit 1
fi

# Vérifier .NET
if [ -f "/home/j/.dotnet/dotnet" ]; then
    DOTNET_VERSION=$(/home/j/.dotnet/dotnet --version)
    success ".NET installé: $DOTNET_VERSION"
else
    error ".NET non trouvé!"
    exit 1
fi

# Vérifier Docker
if command -v docker &> /dev/null; then
    success "Docker disponible"
else
    error "Docker non installé!"
    exit 1
fi

# Vérifier les fichiers du projet
if [ -f "actualites-frontend/package.json" ]; then
    success "Frontend package.json trouvé"
else
    error "Frontend package.json manquant!"
    exit 1
fi

if [ -f "ActualitesApi/ActualitesApi.csproj" ]; then
    success "Backend .csproj trouvé"
else
    error "Backend .csproj manquant!"
    exit 1
fi

echo ""
echo "🔧 ÉTAPE 3: Nettoyage complet des caches"
echo "========================================"

# Nettoyer les caches Angular
if [ -d "actualites-frontend/.angular" ]; then
    rm -rf actualites-frontend/.angular
    success "Cache Angular supprimé"
fi

if [ -d "actualites-frontend/dist" ]; then
    rm -rf actualites-frontend/dist
    success "Dossier dist supprimé"
fi

if [ -d "actualites-frontend/node_modules/.cache" ]; then
    rm -rf actualites-frontend/node_modules/.cache
    success "Cache node_modules supprimé"
fi

echo ""
echo "🔧 ÉTAPE 4: Installation/Vérification des dépendances"
echo "===================================================="

# Vérifier les dépendances Angular
cd actualites-frontend
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/ng" ]; then
    info "Installation des dépendances Angular..."
    npm install
    if [ $? -eq 0 ]; then
        success "Dépendances Angular installées"
    else
        error "Échec de l'installation des dépendances Angular"
        exit 1
    fi
else
    success "Dépendances Angular OK"
fi

# Vérifier que Angular CLI est disponible
if [ -f "node_modules/.bin/ng" ]; then
    success "Angular CLI disponible"
else
    error "Angular CLI non trouvé!"
    exit 1
fi

cd ..

echo ""
echo "🔧 ÉTAPE 5: Démarrage des services"
echo "=================================="

# Démarrer MongoDB
info "Démarrage de MongoDB..."
docker-compose up -d
if [ $? -eq 0 ]; then
    success "MongoDB démarré"
    sleep 5
else
    error "Échec du démarrage de MongoDB"
    exit 1
fi

# Démarrer le backend .NET
info "Démarrage du backend .NET..."
cd ActualitesApi
/home/j/.dotnet/dotnet run --urls="http://localhost:5000" &
BACKEND_PID=$!
cd ..
success "Backend .NET démarré (PID: $BACKEND_PID)"

# Attendre que le backend soit prêt
info "Attente du backend..."
for i in {1..30}; do
    if curl -s http://localhost:5000/swagger > /dev/null 2>&1; then
        success "Backend .NET opérationnel"
        break
    fi
    if [ $i -eq 30 ]; then
        error "Backend .NET ne répond pas"
        exit 1
    fi
    sleep 1
done

# Démarrer le frontend Angular
info "Démarrage du frontend Angular..."
cd actualites-frontend
npm start &
FRONTEND_PID=$!
cd ..
success "Frontend Angular démarré (PID: $FRONTEND_PID)"

# Attendre que le frontend soit prêt
info "Attente du frontend..."
for i in {1..60}; do
    if curl -s http://localhost:4200 > /dev/null 2>&1; then
        success "Frontend Angular opérationnel"
        break
    fi
    if [ $i -eq 60 ]; then
        error "Frontend Angular ne répond pas"
        exit 1
    fi
    sleep 1
done

echo ""
echo "🔧 ÉTAPE 6: Création des données de test"
echo "========================================"

# Créer les utilisateurs de test
info "Création des utilisateurs de test..."
if node scripts/create-users.js; then
    success "Utilisateurs de test créés"
else
    warning "Problème lors de la création des utilisateurs (peut-être qu'ils existent déjà)"
fi

sleep 2

# Créer les actualités de test
info "Création des actualités de test..."
if node scripts/create-news.js; then
    success "Actualités de test créées"
else
    warning "Problème lors de la création des actualités"
fi

echo ""
echo "🔧 ÉTAPE 7: Tests de connectivité"
echo "================================="

# Test MongoDB
if docker ps | grep -q actualites-mongodb; then
    success "MongoDB: Conteneur actif"
else
    error "MongoDB: Conteneur non actif"
fi

# Test Backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/swagger)
if [ "$BACKEND_STATUS" = "200" ] || [ "$BACKEND_STATUS" = "301" ]; then
    success "Backend .NET: Répond (HTTP $BACKEND_STATUS)"
else
    error "Backend .NET: Ne répond pas (HTTP $BACKEND_STATUS)"
fi

# Test Frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200)
if [ "$FRONTEND_STATUS" = "200" ]; then
    success "Frontend Angular: Répond (HTTP $FRONTEND_STATUS)"
else
    error "Frontend Angular: Ne répond pas (HTTP $FRONTEND_STATUS)"
fi

# Test API avec données
info "Test de l'API avec données..."
API_TEST=$(curl -s "http://localhost:5000/api/actualites/dashboard/6894fc95eb52a8533417bcfa" | head -c 50)
if [ ${#API_TEST} -gt 10 ]; then
    success "API: Retourne des données"
else
    warning "API: Données limitées ou absentes"
fi

echo ""
echo "🎉 DIAGNOSTIC TERMINÉ"
echo "===================="
echo ""
success "✅ MongoDB: http://localhost:27017"
success "✅ Backend .NET: http://localhost:5000"
success "✅ Swagger API: http://localhost:5000/swagger"
success "✅ Frontend Angular: http://localhost:4200"
echo ""
info "Comptes de test:"
echo "   👤 Admin: admin / admin123 (profil direction)"
echo "   👤 Professeur: marie.dupont / prof123"
echo "   👤 Élève: sophie.durand / eleve123"
echo ""
info "Navigation suggérée:"
echo "   1. Aller sur http://localhost:4200"
echo "   2. Se connecter avec admin/admin123"
echo "   3. Tester la navigation entre les pages"
echo ""
warning "Pour arrêter tous les services: npm run stop"
echo ""

# Garder le script en vie pour monitorer
echo "📊 Monitoring des services (Ctrl+C pour arrêter)..."
while true; do
    sleep 30
    
    # Vérifier que les services tournent toujours
    if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
        error "Backend .NET s'est arrêté!"
        break
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
        error "Frontend Angular s'est arrêté!"
        break
    fi
    
    info "Services actifs - $(date)"
done