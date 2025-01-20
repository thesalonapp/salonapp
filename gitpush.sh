#!/bin/bash

# Set the correct home directory for salonapp user
NEW_HOME="/"
export HOME="$NEW_HOME"

echo "Setting HOME directory to: $HOME"

# Ensure .ssh directory exists in the correct location
SSH_DIR="$HOME/.ssh"
mkdir -p "$SSH_DIR"

# Move SSH keys from root to salonapp's home if needed
if [ -f "/root/.ssh/id_ed25519" ]; then
    echo "Moving SSH keys to $SSH_DIR..."
    cp /root/.ssh/id_ed25519 "$SSH_DIR/"
    cp /root/.ssh/id_ed25519.pub "$SSH_DIR/"
    chown -R salonapp:salonapp "$SSH_DIR"
    chmod 700 "$SSH_DIR"
    chmod 600 "$SSH_DIR/id_ed25519"
fi

# Start SSH agent and add the key
eval "$(ssh-agent -s)"
ssh-add "$SSH_DIR/id_ed25519"

# Test SSH Connection
echo "Testing SSH connection to GitHub..."
ssh -T git@github.com

# Configure Git to use this SSH key
git config --global core.sshCommand "ssh -i $SSH_DIR/id_ed25519"

# Set Git User Details (Modify accordingly)
git config --global user.name "salonapp2205"
git config --global user.email "salonapp2205@gmail.com"

# Verify Git Configuration
echo "Git configuration:"
git config --list

# Attempt to Pull Latest Changes
echo "Attempting to pull latest changes..."
git pull origin main || git pull origin master

echo "Git setup completed!"
