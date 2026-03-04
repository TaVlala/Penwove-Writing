---
name: db
description: Read and display the current contents of the database. Use when the user wants to inspect data, debug state, or find a user/room/contribution.
allowed-tools: Read
---

Read `server/data/db.json` and display its contents.

If $ARGUMENTS is provided, filter and show only that collection (e.g. "users", "rooms", "contributions", "members").
Otherwise show a summary: count of records in each collection, and the full content of each.
