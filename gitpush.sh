#!/bin/bash

# Define the correct SSH key path inside salonapp's home directory
SSH_DIR="/home/salonapp/public_html/ssh"
SSH_KEY="$SSH_DIR/id_ed25519"
CONFIG_FILE="$SSH_DIR/config"

echo "Configuring SSH key and repository..."

# Ensure the SSH directory exists
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"

# Check if the SSH key already exists, if not, generate a new one
if [ ! -f "$SSH_KEY" ]; then
    echo "Generating a new SSH key..."
    ssh-keygen -t ed25519 -C "salonapp2205@gmail.com" -f "$SSH_KEY" -N ""
    chmod 600 "$SSH_KEY"
    chmod 644 "$SSH_KEY.pub"
    echo "New SSH key generated: $SSH_KEY"
else
    echo "SSH key already exists: $SSH_KEY"
fi

# Start the SSH agent and add the key
eval "$(ssh-agent -s)"
ssh-add "$SSH_KEY"

# Configure SSH to use this key
echo "Configuring SSH settings..."
cat > "$CONFIG_FILE" <<EOL
Host github.com
    IdentityFile $SSH_KEY
    User git
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
EOL

chmod 600 "$CONFIG_FILE"

# Test SSH connection
echo "Testing SSH connection to GitHub..."
ssh -T git@github.com

# Move to the repository directory
REPO_PATH="/home/salonapp/public_html/assets/img/homepage"
if [ ! -d "$REPO_PATH/.git" ]; then
    echo "Error: Git repository not found at $REPO_PATH"
    exit 1
fi

cd "$REPO_PATH" || { echo "Failed to access repository directory!"; exit 1; }

# Set Git user details
echo "Setting Git user details..."
git config --global user.name "salonapp2205"
git config --global user.email "salonapp2205@gmail.com"

# Add changes, commit, and push
echo "Adding and committing changes..."
git add .
git branch -M main
git commit -m "Automated commit from gitpush.sh" || echo "No changes to commit."
git push -u origin main
git sparse-checkout reapply
echo "Git push completed successfully!"
