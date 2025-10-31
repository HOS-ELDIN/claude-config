# Claude Code Statusline Configuration

A custom statusline that matches your Oh My Posh theme with colors and Nerd Font icons.

## What It Shows

```
 | project-name |  branch | Model |  16:15
```

- ⚪ **White WSL icon** - Computer/terminal indicator
- 🟠 **Orange project name** - Just the project folder name (not full path)
- 🟢 **Green git branch** - Current git branch with icon
- 🔵 **Blue model name** - Current AI model (Opus, Sonnet, Haiku)
- ⚪ **White time** - Current time (HH:MM)

## Colors

Matches your Oh My Posh theme palette:
- White: `#FFFFFF`
- Gray: `#757575` (separators)
- Orange: `#FFA500` (project name)
- Green: `#00C853` (git branch)
- Blue: `#2196F3` (model)

## Installation

### 1. Copy the Script

```bash
# Create scripts directory
mkdir -p ~/.claude/scripts

# Copy the statusline script
cp ~/projects/claude-config/scripts/statusline.sh ~/.claude/scripts/

# Make it executable
chmod +x ~/.claude/scripts/statusline.sh
```

### 2. Configure Claude Code

#### For WSL Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "/home/hossam/.claude/scripts/statusline.sh"
  }
}
```

#### For Windows Claude Code

Add to `C:\Users\Hossam eldin\.claude\settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "wsl bash /home/hossam/.claude/scripts/statusline.sh"
  }
}
```

**Note:** The Windows version calls the WSL script via `wsl bash` command, so the script only needs to exist in WSL once.

Or if the file already exists, just add the `statusLine` section.

### 3. Restart Claude Code

Exit and restart Claude Code to see the statusline at the bottom of your terminal.

## Features

✅ **No external dependencies** - Uses only grep/sed/git
✅ **WSL detection** - Shows appropriate icon
✅ **Git fallback** - Gets branch directly if not in JSON
✅ **Color matching** - Matches Oh My Posh theme perfectly
✅ **Nerd Font icons** - Terminal icon () and git icon ()
✅ **Live updates** - Time and git branch update automatically

## Troubleshooting

### Statusline not showing?

1. Check if the script exists and is executable:
   ```bash
   ls -la ~/.claude/scripts/statusline.sh
   ```

2. Verify settings file:
   ```bash
   cat ~/.claude/settings.json
   ```

3. Test the script manually:
   ```bash
   echo '{"workspace":{"current_dir":"'$(pwd)'"},"model":{"display_name":"Sonnet"}}' | ~/.claude/scripts/statusline.sh
   ```

### Git branch not showing?

The script has a fallback that directly checks git if the branch isn't provided in JSON. Make sure you're in a git repository.

### Icons not showing?

Make sure your terminal uses a Nerd Font. Common options:
- JetBrains Mono Nerd Font
- Fira Code Nerd Font
- Hack Nerd Font

Download from: https://www.nerdfonts.com/

## Customization

To change colors or icons, edit `~/.claude/scripts/statusline.sh`:

```bash
# Colors (RGB format)
WHITE=$'\e[38;2;255;255;255m'
ORANGE=$'\e[38;2;255;165;0m'
GREEN=$'\e[38;2;0;200;83m'
BLUE=$'\e[38;2;33;150;243m'

# Icons (Nerd Font codes)
COMPUTER_ICON=$'\ue73a'
GIT_ICON=$'\ue0a0'
TIME_ICON=$'\uf017'
```

After editing, the changes will apply to the next Claude Code session.
