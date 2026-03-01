# Project Memory — March 1st, 2026 (Consolidated)

## Project Overview
- **Path**: `~/GIt/Collab_Synergy/Synergy-Writing-Repo`
- **Repo**: https://github.com/TaVlala/Synergy-Writing.git (branch: main)
- **Stack**: React 18 + Vite (Frontend), Node.js + Express + Socket.io (Backend)
- **DB**: JSON file-based database (`server/data/db.json`)

## Architecture & Logic
- **State Management**: React Context (`App.jsx`) for users, Socket.io for real-time room state.
- **Rich Editor**: Tiptap with extensions for alignment, highlighting, and inline comments.
- **Authentication**: `collab_user` in localStorage; Personal Access Token required for Git pushes.
- **Export Formats**: PDF (jsPDF), Word (.docx), EPUB (server-side), and Plain Text.

## Database Schema (JSON)
- `users`: `{ id, name, color, created_at }`
- `rooms`: `{ id, title, creator_id, is_locked, is_entry_locked, created_at }`
- `room_members`: `{ id, room_id, user_id, user_name, user_color, joined_at, last_seen, removed_at }`
- `contributions`: `{ id, room_id, user_id, user_name, user_color, content, status, sort_order, pinned, created_at, edited_at }`
- `comments`: `{ id, contribution_id, author_id, author_name, content, parent_id, inline_id, created_at }`

## Major Cleanup & Optimization (March 2026)
- **Unified Palette**: Combined `AUTHOR_COLORS` and `USER_COLORS` into `APP_COLORS` (10 distinct shades).
- **Backend Refactor**: Replaced local `now()` helper with `Date.now()`, improved `db.js` atomic saves.
- **Logic Consolidation**: Centralized `stripHTML` and `createNotification` logic.
- **Bug Fixes**: Resolved critical startup crash and refined user naming flow.

## Guidelines & Gotchas
- **Git Push**: Use `unset GIT_ASKPASS` if the terminal hangs, and always use a PAT as the password.
- **Editor**: Inline comments use a custom Tiptap mark (`commentId`, `userName`).
- **Presence**: Green dot indicates online status; purple ring for current user.
