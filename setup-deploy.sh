#!/bin/bash

# Quick deployment setup script
echo "🚀 Preparing for deployment..."
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit - ready for deployment"
  echo "✅ Git initialized"
else
  echo "✅ Git already initialized"
fi

echo ""
echo "📋 Next steps:"
echo ""
echo "1. Create a new repository on GitHub: https://github.com/new"
echo ""
echo "2. Run these commands (replace YOUR_USERNAME and YOUR_REPO):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Then follow the instructions in DEPLOYMENT.md"
echo ""
echo "Your DATABASE_URL for Render:"
echo "postgresql://postgres:Subho%409832080964@db.glaohiknckchopbofxzl.supabase.co:5432/postgres?sslmode=no-verify"
echo ""
echo "✨ Ready to deploy!"
