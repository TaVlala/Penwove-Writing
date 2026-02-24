# SynergY — Full Project Notes

## Project
- **Path**: `D:/Claude/collab-writing`
- **Repo**: https://github.com/TaVlala/Synergy-Writing.git (branch: main)
- **Start servers**:
  - Frontend: `npm run dev` in `client/` (port 5173)
  - Backend: `node index.js` in `server/` (port 3001)
  - Preview server name (launch.json): `collab-frontend` (frontend), `collab-backend` (backend)

## Stack
- **Client**: React 18 + Vite, port 5173
- **Server**: Node.js + Express + Socket.io, port 3001
- **DB**: JSON file (`server/data/db.json`) via `server/db.js` (atomic save, EMPTY schema)
- **Rich editor**: Tiptap (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-text-align`, `@tiptap/extension-highlight`, `@tiptap/extension-bubble-menu`)
- **Deploy**: Railway — build cmd: `cd server && npm install && cd ../client && npm install && npm run build`

## Architecture
- **client/src/App.jsx** — UserContext provider, `collab_user` localStorage key, `login()` / `logout()`
- **client/src/pages/Home.jsx** — create/join room, color picker
- **client/src/pages/Room.jsx** — main room page (heavy: all state, socket listeners, API calls)
- **client/src/components/**
  - `RichEditor.jsx` — Tiptap WYSIWYG editor (forwardRef), toolbar: B I H1 H2 • List 1.List ❝ ≡L ≡C ≡R ≡J
  - `ChatView.jsx` — collab feed view; renders pinned contribution at top
  - `ChatSidebar.jsx` — collapsible live chat (isOpen/onToggle props)
  - `ContributorsPanel.jsx` — modal overlay; active + removed members; Remove button for admin
  - `ReviewView.jsx` — pending/approve/reject/reorder contributions; renders HTML content
  - `ContributionItem.jsx` — single contribution card with reactions, comments, edit/delete, pin button
  - `DocumentView.jsx` — clean read-only document from approved contributions; renders HTML content
- **client/src/extensions/**
  - `Comment.js` — custom Tiptap mark for inline comments (stores `commentId`, `userName`)
- **server/index.js** — all Express routes + Socket.io events + presence map
- **server/db.js** — JSON file store with atomic `save()`, collections in EMPTY schema
- **server/data/db.json** — runtime data (NOT committed)

## DB Collections (EMPTY schema)
`users, rooms, contributions, comments, reactions, notifications, chat_messages, room_members`

## Room Schema
```js
{ id, title, creator_id, is_locked, is_entry_locked, created_at }
```

## Room Member Schema
```js
{ id, room_id, user_id, user_name, user_color, joined_at, removed_at (null if active) }
```

## Contribution Schema
```js
{
  id, room_id, user_id, user_name, user_color,
  content,           // HTML string (from Tiptap) or legacy plain text
  status,            // 'approved' | 'pending' | 'rejected'
  sort_order,        // null until approved+reordered
  pinned,            // bool — only one per room can be true
  created_at, updated_at, edited_at
}
```

## Comment Schema
```js
{
  id, contribution_id, author_id, author_name, content,
  parent_id,         // null for root comments
  inline_id,         // optional — links to a specific highlight/mark in text
  created_at
}
```

## API Endpoints (key ones)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/users` | upsert user by id |
| POST | `/api/rooms` | create room |
| GET | `/api/rooms/:id` | get room |
| PATCH | `/api/rooms/:id` | update `is_locked`, `is_entry_locked`, `title` |
| POST | `/api/rooms/:id/join` | register/update membership; enforces entry lock + removal |
| GET | `/api/rooms/:id/members` | list all members with contribution_count |
| DELETE | `/api/rooms/:id/members/:userId` | admin-only remove; emits `member_removed` |
| POST | `/api/rooms/:id/contributions` | add contribution; checks post lock + removed status |
| PATCH | `/api/rooms/:id/contributions/:cid` | edit content or change status (approve/reject); re-approval logic |
| DELETE | `/api/rooms/:id/contributions/:cid` | delete own contribution |
| POST | `/api/rooms/:id/contributions/reorder` | admin reorder; body: `{ order: [id, id, ...] }` |
| PATCH | `/api/rooms/:id/contributions/:cid/pin` | admin pin/unpin; unpins all others first; body: `{ user_id, pinned }` |
| GET/POST | `/api/rooms/:id/chat` | get/send chat messages |

## Socket Events
| Event | Direction | Payload |
|-------|-----------|---------|
| `join_room` | client→server | `roomId` |
| `join_user` | client→server | `userId` |
| `user_online` | client→server | `{ roomId, userId, userName, userColor }` |
| `presence_update` | server→client | `[{ userId, userName, userColor }, ...]` (all online in room) |
| `new_contribution` | server→client | contribution object |
| `contribution_updated` | server→client | full contribution object (spread entirely, keep client-side `comments`) |
| `contribution_deleted` | server→client | `{ id }` |
| `contribution_status_changed` | server→client | contribution object |
| `contributions_reordered` | server→client | `{ order: [...] }` |
| `new_chat_message` | server→client | message object |
| `member_joined` | server→client | `{ user_id, user_name, user_color }` |
| `member_removed` | server→client | `{ user_id }` |

## Features Implemented (as of Feb 2026)
1. **Create/join rooms** with optional title
2. **Collab view** — real-time contribution feed with reactions + comments
3. **Document view** — clean read-only document from approved contributions
4. **Review Mode** — admin approves/rejects/reorders pending contributions
5. **Collapsible live chat sidebar** — » / « toggle, collapses to 40px
6. **User color selection** — 8 color swatches on home page
7. **Edit own contributions** — inline edit with RichEditor (WYSIWYG)
8. **Dual locks** (admin only):
   - 🚪 **Entry lock** (`is_entry_locked`) — blocks new members from joining
   - ✏️ **Post lock** (`is_locked`) — blocks new contributions
9. **Contributors panel** (`👥 N` button):
   - Active members: avatar, name, contribution count, YOU/ADMIN badges, Remove button (admin)
   - Removed members section (admin only): shows removed_at time + REMOVED badge
10. **Export** — download document as text
11. **Share** — copy room link
12. **Notifications bell**
13. **Dark/light theme toggle**
14. **WYSIWYG Rich Text Editor** — Tiptap replaces plain textarea; toolbar: B I H1 H2 • List 1.List ❝ ≡L ≡C ≡R ≡J; Ctrl+Enter to submit; spellcheck enabled; HTML stored in `content`
15. **Re-approval flow** — editing an approved contribution resets `status: 'pending'` and `sort_order: null`; amber warning shown to author before saving
16. **Presence avatars** — stacked colored bubbles in header show who's online; green dot; purple ring for self; +N overflow; tooltips
17. **Pinned contributions** — admin can pin any contribution (📌 button); pinned one floats to top of collab feed with amber banner; only one pin per room
18. **Text alignment** — left / center / right / justify via `@tiptap/extension-text-align`

## Key Patterns & Gotchas
- **localStorage key**: `collab_user` (NOT `synergy_user`)
- **userRef pattern**: use `useRef` + sync effect to avoid stale closures in socket callbacks
  ```js
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);
  // then inside socket.on('connect', ...) use userRef.current
  ```
- **Switch user in preview**: `localStorage.setItem('collab_user', JSON.stringify({id, name, ...}))` then `window.location.reload()`
- **HTML vs plain text backwards compat**: `/<[a-z][\s\S]*>/i.test(content)` — if true render via `dangerouslySetInnerHTML`, else `<p style={{whiteSpace:'pre-wrap'}}>`
- **`contribution_updated` handler**: always spread full server object: `{ ...updated, comments: c.comments }` to preserve client-side comments AND pick up all server fields (pinned, status, etc.)
- **Presence**: server keeps a `presence` map keyed by `socketId`; `user_online` emitted in BOTH `socket.on('connect')` callback AND in `useEffect([user])` to handle late-login
- **One pin per room**: server unpins all others before setting new pin
- **Backwards compat**: contributions without `status` treated as `'approved'`; `sort_order` falls back to `created_at`
- **Entry lock**: allows existing members through even when locked (only blocks brand-new members)
- **BubbleMenu import**: in `@tiptap/react` 3.20.0, `BubbleMenu` React component must be imported from `@tiptap/react/menus` (the main entry point only exports core logic and EditorContent).
- **db.json**: NOT committed to git (runtime data)

## CSS Sections in App.css
- `RICH EDITOR` — toolbar, ProseMirror, placeholder (`::before` on `.ProseMirror.is-editor-empty`), `.rich-content`
- `RE-APPROVAL WARNING` — `.edit-reapproval-warning` (amber)
- `PRESENCE AVATARS` — `.presence-avatars`, `.presence-avatar`, green dot `::after`, `.presence-avatar--self` (purple ring), `.presence-overflow`
- `PINNED CONTRIBUTIONS` — `.pinned-banner`, `.pinned-banner-label`, `.contribution--pinned`, `.pin-btn`, `.pin-btn--active`
- `BUBBLE MENU` — `.bubble-menu`, `.bubble-menu-btn` (dark themed floating menu)
- `INLINE COMMENTS` — `.inline-comment` (dashed underline)

