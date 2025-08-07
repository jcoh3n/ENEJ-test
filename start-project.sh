#!/bin/bash

echo "🚀 Démarrage du projet Actualités"
echo "=================================="

# Fonction pour vérifier si un port est occupé
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Le port $1 est déjà utilisé"
        return 1
    else
        echo "✅ Le port $1 est libre"
        return 0
    fi
}

# Vérifier les ports nécessaires
echo "🔍 Vérification des ports..."
check_port 27017 || echo "   MongoDB devrait être sur le port 27017"
check_port 5000 || echo "   Le backend .NET sera sur le port 5000"
check_port 4200 || echo "   Le frontend Angular sera sur le port 4200"

echo ""
echo "📦 Démarrage des services..."

# Démarrer MongoDB (si pas déjà démarré)
echo "🍃 Démarrage de MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "   Lancement de MongoDB..."
    mongod --dbpath ./data/db --logpath ./data/logs/mongodb.log --fork 2>/dev/null || {
        echo "   Tentative de démarrage avec les paramètres par défaut..."
        mongod --fork --logpath ./mongodb.log 2>/dev/null || {
            echo "   ⚠️  Impossible de démarrer MongoDB automatiquement."
            echo "   Veuillez démarrer MongoDB manuellement avec: mongod"
        }
    }
else
    echo "   ✅ MongoDB est déjà en cours d'exécution"
fi

echo ""
echo "🔧 Démarrage du backend .NET..."
cd ActualitesApi
/home/j/.dotnet/dotnet run --urls="http://localhost:5000" &
BACKEND_PID=$!
cd ..

echo "⏳ Attente du démarrage du backend (10 secondes)..."
sleep 10

echo ""
echo "🎨 Démarrage du frontend Angular..."
cd actualites-frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✨ Applications démarrées !"
echo "=================================="
echo "🍃 MongoDB:     http://localhost:27017"
echo "🔧 Backend API: http://localhost:5000"
echo "🎨 Frontend:    http://localhost:4200"
echo "=================================="
echo ""
echo "📋 Comptes de test disponibles:"
echo "   Direction: login='admin', mot de passe='admin123'"
echo "   Professeur: login='prof1', mot de passe='prof123'"
echo "   Élève: login='eleve1', mot de passe='eleve123'"
echo ""
echo "Pour arrêter les applications, appuyez sur Ctrl+C"

# Fonction pour nettoyer les processus à l'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt des applications..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Applications arrêtées"
    exit 0
}

# Capturer Ctrl+C
trap cleanup INT

# Attendre indéfiniment
wait