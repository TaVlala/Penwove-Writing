/**
 * Simple JSON file-based database.
 * All data is kept in memory and written to disk after every mutation.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const EMPTY_STORE = {
  users: [],
  rooms: [],
  contributions: [],
  comments: [],
  reactions: [],
  notifications: [],
  chat_messages: [],
  room_members: []
};

let store;

try {
  if (fs.existsSync(DATA_FILE)) {
    store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } else {
    store = { ...EMPTY_STORE };
  }
  
  // Migration: ensure all collections exist
  for (const key of Object.keys(EMPTY_STORE)) {
    if (!store[key]) {
      store[key] = [];
    }
  }
} catch (error) {
  console.warn('Database load failed, starting fresh:', error.message);
  store = { ...EMPTY_STORE };
}

/**
 * Persists the current in-memory store to the JSON file.
 */
function save() {
  const tmpFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(store));
  fs.renameSync(tmpFile, DATA_FILE);
}

module.exports = {
  store,
  save
};
