# WSL Development Workflow

## Overview
This document outlines our optimized development workflow using WSL (Windows Subsystem for Linux) to achieve better performance and development experience.

## Why WSL Native Filesystem?
Working directly in the WSL filesystem provides:
- **10-20x faster file operations** compared to accessing Windows files through `/mnt/`
- **Faster git operations** (status, diff, commits)
- **Better performance** for Node.js, Bun, and other development tools
- **Native Linux permissions** handling
- **Reduced I/O overhead** for file watchers and hot reloading

## Directory Structure
```
/home/hossam/
└── projects/          # All development projects live here
    ├── proto/         # Example: Platform project
    ├── project2/      # Other projects
    └── ...
```

## Workflow Steps

### 1. Initial Project Setup (One-time)
```bash
# Navigate to projects directory
cd ~/projects

# Clone repository from GitHub
git clone <repository-url> <project-name>

# Example:
git clone https://github.com/Saleh-Alibrahim/Platform proto

# Enter project directory
cd <project-name>

# Install dependencies
bun install  # or npm install, yarn install

# Copy environment variables from Windows location (if needed)
cp /mnt/e/path-to-old-project/.env .

# Generate any necessary files (e.g., Prisma)
bun prisma generate
```

### 2. Daily Development Workflow

#### For Claude (AI Assistant):
- Always work directly in `/home/hossam/projects/` directory
- Use native WSL paths, not `/mnt/` paths
- All file operations, git commands, and development tasks happen here

#### For Developer (You):
1. **Connect IDE to WSL:**
   - In Cursor/VS Code: Use "Remote - WSL" extension
   - Open folder: `\\wsl$\Ubuntu\home\hossam\projects\<project-name>`
   - Or use command palette: "Remote-WSL: Open Folder in WSL"

2. **Development:**
   - Edit files through your IDE (connected to WSL)
   - Terminal operations run in WSL environment
   - Hot reloading and file watchers work at full speed

3. **Version Control:**
   ```bash
   # All git operations in WSL
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```

### 3. Viewing Changes in Windows (Optional)
If you need to access files from Windows:
```bash
# In Windows project directory
cd E:\saleh-work\proto
git pull origin main
```

**Note:** This is only for viewing. Never develop in the Windows directory.

## Important Considerations

1. **Primary Development Location**: Always use WSL (`~/projects/`)
2. **Windows Access**: Only for reference or backup
3. **Environment Variables**: Keep `.env` files in WSL directory
4. **Database Connections**: May need to update connection strings for WSL environment
5. **Port Forwarding**: WSL2 automatically forwards ports to Windows

## Performance Comparison
| Operation | Windows (/mnt/) | WSL Native | Improvement |
|-----------|----------------|------------|-------------|
| Git status | ~5-10s | <1s | 10x faster |
| npm install | ~5-10min | ~1-2min | 5x faster |
| Build process | ~2-5min | ~30-60s | 4x faster |
| File watchers | Delayed/Buggy | Instant | Reliable |

## Troubleshooting

### Can't access WSL files from Windows?
- Path: `\\wsl$\Ubuntu\home\hossam\projects\`
- Ensure WSL is running: `wsl` in PowerShell

### Permission issues?
```bash
# Fix ownership if needed
sudo chown -R $USER:$USER ~/projects/<project-name>
```

### IDE can't connect to WSL?
- Install "Remote - WSL" extension
- Restart IDE and WSL
- Check WSL is running: `wsl --list --running`

## Quick Reference Commands
```bash
# Go to projects
cd ~/projects

# List all projects
ls ~/projects

# Start development server (example)
cd ~/projects/proto && bun dev

# Check git status across all projects
for dir in ~/projects/*/; do echo "=== $dir ===" && git -C "$dir" status -s; done
```