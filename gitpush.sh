#!/bin/bash


PROJECT_PATH="/home/salonapp/public_html/assets/img/homepage"

# Change directory to the project path
cd "$PROJECT_PATH" || { echo "Failed to change directory"; exit 1; }

git add .
git branch -M main
git commit -m "home page image upload"
git push -u origin main
git sparse-checkout reapply
