# Memory — March 1st, 2026

## Major Cleanup and Optimization
- **Backend Refactor**: Removed local `now()` helper, consolidated notification logic, and improved `db.js` for atomic saves.
- **Frontend Refactor**: Consolidated `AUTHOR_COLORS` and `USER_COLORS` into a unified `APP_COLORS` palette (10 distinct shades).
- **Utility Improvements**: Centralized `stripHTML` logic and improved `formatTime`.
- **Bug Fixes**: Resolved critical "Failed to set name" error by fixing missing `now()` references.
- **Git Migration**: Added `memory/` folder to version control to track project notes and session logs.

## Current State
- **Branch**: `main`
- **Environment**: Linux (Tavlala)
- **Deployment**: Railway
