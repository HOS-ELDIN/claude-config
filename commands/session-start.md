# Session Start Command

Start a new development session with an optional descriptive name.

## Usage
```
/project:session-start [optional-session-name]
```

## Actions
1. Create a new session file with timestamp
2. Initialize session structure
3. Record starting context

## Implementation

Create session directory if it doesn't exist:
```bash
mkdir -p sessions
```

Generate session filename:
```bash
TIMESTAMP=$(date +"%Y-%m-%d-%H%M")
SESSION_NAME="${ARGUMENTS:-session}"
SESSION_FILE="sessions/${TIMESTAMP}-${SESSION_NAME}.md"
```

Create session file with initial structure:
```bash
cat > "$SESSION_FILE" << 'EOF'
# Development Session: ${SESSION_NAME}
Started: $(date +"%Y-%m-%d %H:%M:%S")

## Session Overview
${ARGUMENTS:-New development session}

## Goals
- [ ] Define session objectives

## Progress

### $(date +"%H:%M") - Session Start
- Initialized new development session
- Current git status:
$(git status --short || echo "Not a git repository")

---

EOF
```

Update current session tracker:
```bash
echo "$SESSION_FILE" > sessions/.current-session
```

Confirm session creation:
```
✅ Started new session: ${SESSION_NAME}
📄 Session file: $SESSION_FILE
```