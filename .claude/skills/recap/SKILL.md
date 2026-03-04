---
name: recap
description: Summarise what changed in the last commit or since a given point. Use when the user wants to review recent work.
allowed-tools: Bash(git *)
---

Summarise recent changes:

1. Run `git log --oneline -5` to show recent commits
2. Run `git diff HEAD~1 --stat` to show files changed in the last commit
3. Give a plain-English summary of what was changed and why, based on the commit message and diff
