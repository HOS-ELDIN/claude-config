# Session Update Command

Add progress updates to the current active session.

## Usage
```
/project:session-update [optional-notes]
```

## Actions
1. Check for active session
2. Append timestamped update
3. Include git status and context

## Implementation

Check for active session:
```bash
if [ ! -f "sessions/.current-session" ] || [ ! -s "sessions/.current-session" ]; then
    echo "❌ No active session. Start one with: /project:session-start"
    exit 1
fi

SESSION_FILE=$(cat sessions/.current-session)
if [ ! -f "$SESSION_FILE" ]; then
    echo "❌ Session file not found: $SESSION_FILE"
    exit 1
fi
```

Append update to session:
```bash
cat >> "$SESSION_FILE" << 'EOF'

### $(date +"%H:%M") - Progress Update
${ARGUMENTS:-Continuing development}

**Git Status:**
$(git status --short || echo "No changes")

**Todo Status:**
$(if command -v todo-status >/dev/null 2>&1; then todo-status; else echo "Todo tracking not available"; fi)

**Changes Made:**
- ${ARGUMENTS:-Update in progress}

**Current Focus:**
- Working on current task

---
EOF
```

Confirm update:
```
✅ Session updated at $(date +"%H:%M")
📄 Session file: $SESSION_FILE
```