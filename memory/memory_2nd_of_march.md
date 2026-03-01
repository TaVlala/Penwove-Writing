# Project Memory — March 2nd, 2026 (Consolidated)

## Project Overview
- **Path**: `~/GIt/Collab_Synergy/Synergy-Writing-Repo`
- **Repo**: https://github.com/TaVlala/Synergy-Writing.git (branch: main)
- **Stack**: React 18 + Vite (Frontend), Node.js + Express + Socket.io (Backend)
- **DB**: JSON file-based database (`server/data/db.json`)

## Architecture & Logic
- **State Management**: React Context (`App.jsx`) for users, Socket.io for real-time room state.
- **Decomposed Room.jsx**: Monolithic view split into `RoomHeader`, `ExportMenu`, `JoinRoomForm`, and `SidebarComponent`.
- **Rich Editor**: Tiptap with extensions for alignment, highlighting, and inline comments.
- **Authentication**: `collab_user` in localStorage; Personal Access Token required for Git pushes.

## Performance & Optimization (March 2nd)
- **Bundle Size**: Reduced initial load by **50%** (1.47MB -> 727KB) via Code Splitting.
- **Rendering**: Memoized all major components (`ContributionItem`, `ChatView`, etc.) to stabilize FPS.
- **Dynamic Imports**: Export libraries (`jspdf`, `docx`) load only on demand.
- **Visuals**: Enhanced Oceanic theme with 16px backdrop blurs and optimized dark mode contrast.

## Major Cleanup & Logic (March 1st)
- **Unified Palette**: Combined `AUTHOR_COLORS` and `USER_COLORS` into `APP_COLORS`.
- **Backend Refactor**: Replaced local `now()` helper with `Date.now()`, improved atomic saves.
- **Bug Fixes**: Resolved startup crash and naming flow issues.

## Guidelines & Gotchas
- **Git Push**: Use `unset GIT_ASKPASS` if the terminal hangs, and always use a PAT as the password.
- **Editor**: Inline comments use a custom Tiptap mark (`commentId`, `userName`).
- **Presence**: Green dot indicates online status; purple ring for current user.
