#!/bin/bash
# Exit on error
set -e

echo "=== Building Frontend ==="
cd frontend
# Force a clean sweep of any ghost dependencies or broken symlinks
rm -rf node_modules package-lock.json
npm install
npm run build
cd ..

echo "=== Installing Backend Dependencies ==="
cd backend
pip install -r requirements.txt
cd ..

echo "=== Build Complete ==="
