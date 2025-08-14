const crypto = require('crypto');

function computeHash(event, previousHash) {
  const payload = JSON.stringify({
    type: event.type,
    description: event.description,
    user: event.user,
    timestamp: event.timestamp,
    previousHash
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function verifyChain(events) {
  const issues = [];
  let lastHash = 'GENESIS';

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const expectedHash = computeHash(e, lastHash);

    if (e.previousHash !== lastHash) {
      issues.push({ index: i, id: e.id, error: 'previousHash inválido', expected: lastHash, got: e.previousHash });
    }
    if (e.hash !== expectedHash) {
      issues.push({ index: i, id: e.id, error: 'hash inválido', expected: expectedHash, got: e.hash });
    }
    lastHash = e.hash;
  }

  return { valid: issues.length === 0, issues };
}

module.exports = { computeHash, verifyChain };
