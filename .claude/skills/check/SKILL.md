---
name: check
description: Verify the current state of the preview — check for errors and take a screenshot. Use after making code changes to confirm they work.
allowed-tools: mcp__Claude_Preview__preview_console_logs, mcp__Claude_Preview__preview_logs, mcp__Claude_Preview__preview_screenshot
---

Verify the preview looks correct after recent changes:

1. Check frontend console for errors: `preview_console_logs` with level=error on collab-frontend
2. Check backend logs for errors: `preview_logs` with level=error on collab-backend
3. Take a screenshot of the current preview state
4. Report any errors found, or confirm everything looks clean
