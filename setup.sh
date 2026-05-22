#!/bin/bash
# ================================================================
# Espringrocks Aggregates Trading - Setup Script
# ================================================================

set -e

echo "======================================"
echo " Espringrocks Aggregates Trading"
echo " Full-Stack Setup Script"
echo "======================================"

# --- Backend Setup ---
echo ""
echo "[1/4] Setting up Django backend..."
cd backend

pip install -r requirements.txt --quiet

python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py seed_data

echo "[✓] Backend ready."

# --- Frontend Setup ---
echo ""
echo "[2/4] Installing React frontend dependencies..."
cd ../frontend
npm install --silent

echo "[✓] Frontend ready."

echo ""
echo "======================================"
echo " Setup Complete!"
echo "======================================"
echo ""
echo " Start the backend:"
echo "   cd backend && python manage.py runserver"
echo ""
echo " Start the frontend (new terminal):"
echo "   cd frontend && npm start"
echo ""
echo " Login credentials:"
echo "   Admin:    admin / admin123"                                                  
echo "   Employee: EMP-1 / employee123"
echo "" 
echo " Backend API: http://localhost:8000/api/"
echo " Frontend:    http://localhost:3000"
echo "======================================"
