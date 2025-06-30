#!/bin/bash
# Claude Configuration Setup Script
# This script sets up the complete Claude configuration system

set -e

echo "🚀 Setting up Claude Configuration System..."

# Define directories
CONFIG_DIR="$HOME/.claude"
PROJECT_DIR="$(pwd)"
REPO_URL="https://github.com/[username]/claude-config"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$CONFIG_DIR"
mkdir -p "$PROJECT_DIR/commands"
mkdir -p "$PROJECT_DIR/sessions"

# Create session tracker
echo "📝 Initializing session tracker..."
touch "$PROJECT_DIR/sessions/.current-session"

# Copy CLAUDE.md to global config
echo "🔄 Syncing global configuration..."
if [ -f "$PROJECT_DIR/CLAUDE.md" ]; then
    cp "$PROJECT_DIR/CLAUDE.md" "$CONFIG_DIR/CLAUDE.md"
    echo "✅ Global configuration updated"
else
    echo "⚠️  CLAUDE.md not found in current directory"
fi

# Verify command files
echo "🔍 Verifying command files..."
for cmd in session-start session-update session-end; do
    if [ -f "$PROJECT_DIR/commands/$cmd.md" ]; then
        echo "✅ Command found: $cmd"
    else
        echo "⚠️  Command missing: $cmd"
    fi
done

# Add sessions to .gitignore if it exists
if [ -f "$PROJECT_DIR/.gitignore" ]; then
    if ! grep -q "sessions/" "$PROJECT_DIR/.gitignore"; then
        echo "📄 Adding sessions/ to .gitignore..."
        echo "sessions/" >> "$PROJECT_DIR/.gitignore"
    fi
else
    echo "📄 Creating .gitignore with sessions/..."
    echo "sessions/" > "$PROJECT_DIR/.gitignore"
fi

echo ""
echo "✨ Claude Configuration Setup Complete!"
echo ""
echo "📋 Available Commands:"
echo "  /project:session-start [name]  - Start a new session"
echo "  /project:session-update [note] - Update current session"
echo "  /project:session-end          - End current session"
echo ""
echo "📁 Directories created:"
echo "  - $CONFIG_DIR (global config)"
echo "  - $PROJECT_DIR/commands/"
echo "  - $PROJECT_DIR/sessions/"
echo ""
echo "🎯 Next steps:"
echo "  1. Start a session: /project:session-start"
echo "  2. Work on your project"
echo "  3. Update progress: /project:session-update"
echo "  4. End session: /project:session-end"