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

## Session Management Commands
- **Purpose**: Track and document development sessions for better context preservation
- **Commands Directory**: `~/projects/claude-config/commands/` contains session management commands
- **Sessions Directory**: `~/projects/claude-config/sessions/` stores session documentation

### Available Commands
1. **Start Session**: `/project:session-start [optional-name]`
   - Creates a new timestamped session file
   - Initializes session tracking with goals and context
   - Records starting git status

2. **Update Session**: `/project:session-update [optional-notes]`
   - Adds timestamped progress updates to current session
   - Tracks git changes and todo status
   - Documents ongoing work and decisions

3. **End Session**: `/project:session-end`
   - Generates comprehensive session summary
   - Documents final git status and changes
   - Clears active session tracker

### Session Workflow
1. Start each development session with `/project:session-start`
2. Periodically update progress with `/project:session-update`
3. End sessions with `/project:session-end` to create summary
4. Session files provide context for future work

### Benefits
- Maintains context between Claude conversations
- Documents decision-making process
- Tracks progress systematically
- Enables knowledge transfer across sessions