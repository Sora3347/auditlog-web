const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./database');
const audit = require('./audit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create Event
app.post('/api/events', (req, res) => {
  const { type, description, user } = req.body || {};
  if (!type || !description || !user) {
    return res.status(400).json({ error: 'Campos obrigatórios: type, description, user' });
  }
  const ts = new Date().toISOString();
  const last = db.getLast();
  const previousHash = last ? last.hash : 'GENESIS';

  const core = { type, description, user, timestamp: ts, previousHash };
  const hash = audit.computeHash(core, previousHash);

  const saved = db.addEvent({ ...core, hash });
  res.status(201).json(saved);
});

// List Events with filters
app.get('/api/events', (req, res) => {
  const { type, user, from, to } = req.query;
  let events = db.getAll();

  if (type) events = events.filter(e => e.type === type);
  if (user) events = events.filter(e => e.user === user);
  if (from) events = events.filter(e => e.timestamp >= new Date(from).toISOString());
  if (to) events = events.filter(e => e.timestamp <= new Date(to).toISOString());

  // newest first
  events = events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  res.json(events);
});

// Verify integrity
app.get('/api/events/verify', (req, res) => {
  const events = db.getAll();
  const report = audit.verifyChain(events);
  res.json(report);
});

// Serve frontend
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

app.listen(PORT, () => {
  console.log(`AuditLog Web API rodando em http://localhost:${PORT}`);
});
