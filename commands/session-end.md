# Session End Command

End the current session and generate a comprehensive summary.

## Usage
```
/project:session-end
```

## Actions
1. Verify active session exists
2. Generate session summary
3. Clear current session tracker

## Implementation

Check for active session:
```bash
if [ ! -f "sessions/.current-session" ] || [ ! -s "sessions/.current-session" ]; then
    echo "❌ No active session to end"
    exit 1
fi

SESSION_FILE=$(cat sessions/.current-session)
if [ ! -f "$SESSION_FILE" ]; then
    echo "❌ Session file not found: $SESSION_FILE"
    exit 1
fi
```

Append session summary:
```bash
cat >> "$SESSION_FILE" << 'EOF'

### $(date +"%H:%M") - Session End

## Session Summary
**Duration:** From session start to $(date +"%Y-%m-%d %H:%M:%S")

### Final Git Status
$(git status --short || echo "No git repository")

### Git Changes This Session
$(git diff --stat || echo "No changes tracked")

### Accomplishments
- Review session file for detailed progress
- ${ARGUMENTS:-Session completed}

### Todo Completion Status
$(if command -v todo-status >/dev/null 2>&1; then todo-status; else echo "Todo tracking not available"; fi)

### Key Decisions & Solutions
- Documented throughout session updates

### Dependencies Added/Updated
- Check session updates for details

### Next Steps
- Review session file for follow-up items
- Plan next session based on remaining tasks

---
Session ended at $(date +"%Y-%m-%d %H:%M:%S")
EOF
```

Clear current session:
```bash
> sessions/.current-session
```

Display summary:
```
✅ Session ended successfully
📄 Session summary saved to: $SESSION_FILE

Summary:
- Duration: Check file for full timeline
- Changes: $(git diff --stat --summary 2>/dev/null | wc -l) files modified
- Session file: $SESSION_FILE
```