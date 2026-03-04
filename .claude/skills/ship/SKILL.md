---
name: ship
description: Stage all changes, commit with a generated message, and push to origin main. Use when the user says "ship", "commit and push", or "deploy".
allowed-tools: Bash(git *)
---

Stage, commit, and push all changes to origin main.

1. Run `git status` and `git diff` to see what changed
2. Run `git log --oneline -3` to match the commit message style
3. Stage changed source files (exclude db.json, .env, secrets)
4. Write a concise commit message summarising the "why"
5. Commit using a HEREDOC with Co-Authored-By trailer:
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
6. Run `git push origin main`
7. Confirm success
