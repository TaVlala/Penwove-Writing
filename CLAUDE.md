# Penwove — Collaborative Writing Platform

## Servers
- Frontend: `collab-frontend` (Vite, port 5173)
- Backend: `collab-backend` (Express + Socket.io, port 3001)
- Deploy: Railway (auto-deploys on `git push origin main`)

## Stack
- React 18 + Vite · Node.js + Express + Socket.io · JSON file DB
- Tiptap rich editor · epub-gen-memory (server-side only)

## Key Files
- `client/src/pages/Room.jsx` — all state, socket listeners, API calls, game panels
- `client/src/components/RoomHeader.jsx` — header, 🎮 game dropdown
- `client/src/components/WordleGame.jsx` / `HangmanGame.jsx` / `WordLadder.jsx` — mini-games
- `server/index.js` — all routes, Socket.io events, EPUB endpoint
- `server/data/db.json` — runtime DB (not committed)

## Critical Details
- localStorage key: `collab_user` (NOT synergy_user)
- Member fields: `user_name`, `user_color`, `user_id` (NOT `name`/`color`)
- `express.json({ limit: '10mb' })` required for EPUB on Railway
- `userRef` pattern for stale socket closures
- `contribution_updated`: always `{ ...updated, comments: c.comments }`

## Game 1v1
- Socket events: `game:challenge` → `game:challenge:received` → `game:challenge:respond` → `game:challenge:accepted/declined`
- `vsSession.role`: `'setter'` (Hangman challenger) · `'guesser'` (Hangman opponent) · `'player'` (others)
- Hangman: setter picks custom word (`customWord`), guesser plays it
