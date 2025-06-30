## Environment Awareness
- Remember globally that you are working on WSL (Windows Subsystem for Linux)

## Development Workflow on WSL
- **Primary Development Location**: Always work in `/home/hossam/projects/` directory for all projects
- **Performance**: WSL native filesystem provides 10-20x faster file operations than Windows mounts
- **Git Operations**: All git commands should be executed in WSL for optimal performance
- **IDE Connection**: Developer connects Cursor/VS Code to WSL using Remote-WSL extension
- **Workflow**:
  1. Clone all projects to `~/projects/` directory
  2. Perform all development operations in WSL filesystem
  3. Push changes to remote repository from WSL
  4. Windows copies are only for reference (pull from remote if needed)
- **Never** develop in `/mnt/` paths - always use native WSL paths
- **Project Structure**: `/home/hossam/projects/<project-name>/`

## Claude Configuration Sync
- **Configuration Repository**: `~/projects/claude-config` contains my global memory and workflow docs
- **Auto-sync Rule**: Whenever my global memory (this file) is updated, I must:
  1. Copy the updated file to `~/projects/claude-config/CLAUDE.md`
  2. Commit the changes with a descriptive message
  3. Push to the remote repository
  4. This ensures configuration consistency across all devices