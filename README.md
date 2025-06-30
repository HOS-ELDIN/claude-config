# Claude Configuration

This repository contains configuration files for Claude AI assistant to maintain consistent behavior and knowledge across different devices and projects.

## Files

### CLAUDE.md
Global instructions and memory for Claude that should be placed in `~/.claude/CLAUDE.md` on any system where you use Claude.

### WSL-DEVELOPMENT-WORKFLOW.md
Comprehensive guide for optimized development workflow using WSL (Windows Subsystem for Linux) for better performance.

## Setup Instructions

### 1. Clone this repository
```bash
cd ~/projects
git clone <your-repo-url> claude-config
```

### 2. Create Claude configuration directory
```bash
mkdir -p ~/.claude
```

### 3. Copy or symlink the global configuration
```bash
# Option 1: Copy (recommended for stability)
cp ~/projects/claude-config/CLAUDE.md ~/.claude/CLAUDE.md

# Option 2: Symlink (automatically updates with git pulls)
ln -s ~/projects/claude-config/CLAUDE.md ~/.claude/CLAUDE.md
```

### 4. Keep synchronized
```bash
# Pull latest changes
cd ~/projects/claude-config
git pull

# If using copy method, update the file
cp CLAUDE.md ~/.claude/CLAUDE.md
```

## Why This Repository?

- **Consistency**: Same Claude behavior across all your devices
- **Portability**: Easy setup on new machines
- **Version Control**: Track changes to your Claude configuration
- **Backup**: Never lose your custom instructions
- **Sharing**: Can be shared with team members for consistent AI assistance

## Contributing

Feel free to customize these files based on your needs. The global CLAUDE.md file can include:
- Development preferences
- Common workflows
- Project-specific instructions
- Coding standards
- Tool preferences