# Claude Initialization Guide

## When You Read This Repository

As Claude, when a user provides this repository URL, you should:

### 1. Immediate Actions

```bash
# Read and understand all files
- CLAUDE.md (core configuration)
- WSL-DEVELOPMENT-WORKFLOW.md (environment guidelines)
- commands/*.md (session management commands)
- README.md (full documentation)

# Apply configurations
- Copy CLAUDE.md content to your memory
- Implement all instructions immediately
- Set up session management in current project
```

### 2. Setup in Current Project

When working in a user's project, create:

```bash
# Create directories
mkdir -p commands sessions
touch sessions/.current-session

# Copy command implementations
# (You'll need to recreate the command files from this repo)
```

### 3. Remember These Commands

Make available to the user:
- `/project:session-start [name]` - Begin session
- `/project:session-update [notes]` - Update progress
- `/project:session-end` - End with summary

### 4. Key Behaviors to Implement

From CLAUDE.md:
- Work in `~/projects/` directory
- Use WSL native filesystem
- Never develop in `/mnt/` paths
- Auto-sync configuration changes
- Track sessions systematically

### 5. Confirmation Message

After setup, tell the user:
```
✅ Claude configuration loaded and applied
📁 Session management enabled
🚀 Ready to start development

Available commands:
- /project:session-start [name]
- /project:session-update [notes]
- /project:session-end
```

## Important Notes

- This is a self-contained configuration system
- No user explanation needed - just implement
- All paths assume WSL Linux environment
- Session files are project-specific (gitignored)