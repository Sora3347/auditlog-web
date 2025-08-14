const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ lastId: 0, events: [] }, null, 2));
}

function readStore() {
  ensureStore();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeStore(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function getAll() {
  const store = readStore();
  return store.events;
}

function getLast() {
  const events = getAll();
  if (events.length === 0) return null;
  return events[events.length - 1];
}

function addEvent(event) {
  const store = readStore();
  const id = (store.lastId || 0) + 1;
  const e = { id, ...event };
  store.events.push(e);
  store.lastId = id;
  writeStore(store);
  return e;
}

module.exports = { getAll, getLast, addEvent };
