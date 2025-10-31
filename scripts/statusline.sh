#!/bin/bash
# Custom statusline for Claude Code matching Oh My Posh theme
# Colors: Gray icon | Orange project | Green git | Blue model

# Read JSON input from stdin
input=$(cat)

# Extract values using grep/sed (no jq dependency)
cwd=$(echo "$input" | grep -o '"current_dir"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/')
if [ -z "$cwd" ]; then
    cwd=$(echo "$input" | grep -o '"cwd"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/')
fi

git_branch=$(echo "$input" | grep -o '"branch"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/')

# If git branch not found in JSON, try to get it directly
if [ -z "$git_branch" ] && [ -n "$cwd" ] && [ -d "$cwd/.git" ]; then
    git_branch=$(cd "$cwd" && git branch --show-current 2>/dev/null)
fi

model=$(echo "$input" | grep -o '"display_name"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)".*/\1/')

# Get project name (basename of cwd)
if [ -n "$cwd" ]; then
    project_name=$(basename "$cwd")
else
    project_name="~"
fi

# ANSI RGB colors matching Oh My Posh theme
WHITE=$'\e[38;2;255;255;255m'     # #FFFFFF
GRAY=$'\e[38;2;117;117;117m'      # #757575
ORANGE=$'\e[38;2;255;165;0m'      # #FFA500
ORANGE_DARK=$'\e[38;2;255;140;0m' # #FF8C00
GREEN=$'\e[38;2;0;200;83m'        # #00C853
BLUE=$'\e[38;2;33;150;243m'       # #2196F3
RESET=$'\e[0m'

# Nerd Font icons from Oh My Posh theme
COMPUTER_ICON=$'\ue73a'            # Computer/terminal icon
GIT_ICON=$'\ue0a0'                # Git branch icon
TIME_ICON=$'\uf017'               # Clock icon

# Detect WSL vs Windows for icon
if grep -qi microsoft /proc/version 2>/dev/null || [ -f /proc/sys/fs/binfmt_misc/WSLInterop ]; then
    # WSL - use computer icon
    icon="$COMPUTER_ICON"
else
    # Windows or other
    icon="$COMPUTER_ICON"
fi

# Get current time in HH:MM format
current_time=$(date +%H:%M)

# Build colorful output with separators
output="${WHITE}${icon}${RESET} ${GRAY}|${RESET} ${ORANGE}${project_name}${RESET}"

if [ -n "$git_branch" ]; then
    output="$output ${GRAY}|${RESET} ${GREEN}${GIT_ICON} ${git_branch}${RESET}"
fi

if [ -n "$model" ]; then
    output="$output ${GRAY}|${RESET} ${BLUE}${model}${RESET}"
fi

# Add time at the end
output="$output ${GRAY}|${RESET} ${WHITE}${TIME_ICON} ${current_time}${RESET}"

# Output directly (colors and icons will render in terminal)
echo "$output"
