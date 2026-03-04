---
name: switch-user
description: Switch the logged-in user in the preview browser to a different user from db.json. Use when the user says "switch to <name>" or "test as <name>".
allowed-tools: Read, mcp__Claude_Preview__preview_eval, mcp__Claude_Preview__preview_screenshot
---

Switch the active preview user to: $ARGUMENTS

1. Read `server/data/db.json` to find the user matching the name in $ARGUMENTS (match on `user_name`, case-insensitive)
2. Run this in the preview (use the frontend server — collab-frontend):
   ```js
   localStorage.setItem('collab_user', JSON.stringify({ id: '<user_id>', name: '<user_name>', color: '<user_color>' }));
   window.location.reload();
   ```
3. Take a screenshot to confirm the switch worked (look for the user's name/color in the header)

If no name is given in $ARGUMENTS, read db.json and list all available users to choose from.
