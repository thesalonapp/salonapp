#!/bin/bash

# Define the SSH key path
SSH_DIR="/home/salonapp/public_html/ssh"
SSH_KEY="$SSH_DIR/id_ed25519"

# Ensure the SSH directory exists
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"

# Check if the SSH key already exists, if not, generate a new one
if [ ! -f "$SSH_KEY" ]; then
    echo "Generating a new SSH key..."
    ssh-keygen -t ed25519 -C "your-email@example.com" -f "$SSH_KEY" -N ""
    chmod 600 "$SSH_KEY"
    chmod 644 "$SSH_KEY.pub"
    echo "New SSH key generated: $SSH_KEY"
else
    echo "SSH key already exists: $SSH_KEY"
fi

# Start the SSH agent
eval "$(ssh-agent -s)"
ssh-add "$SSH_KEY"

# Configure SSH to use this key
CONFIG_FILE="$HOME/.ssh/config"
echo "Configuring SSH..."
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

if ! grep -q "$SSH_KEY" "$CONFIG_FILE"; then
    echo -e "\nHost github.com\n    IdentityFile $SSH_KEY\n    User git\n    StrictHostKeyChecking no" >> "$CONFIG_FILE"
fi

# Test SSH connection
echo "Testing SSH connection to GitHub..."
ssh -T git@github.com

# Move to the repository directory
cd /home/salonapp/public_html/assets/img/homepage || { echo "Repository path not found!"; exit 1; }

# Add changes, commit, and push
echo "Adding and committing changes..."
git add .
git commit -m "Automated commit from gitpush.sh"
git push origin main

echo "Git push completed!"
