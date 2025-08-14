const API = window.location.origin.includes('localhost')
  ? 'http://localhost:3000'
  : window.location.origin;

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch { return iso; }
}

function renderTable(rows) {
  const tbody = document.querySelector('#events-table tbody');
  tbody.innerHTML = '';
  rows.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${formatDate(e.timestamp)}</td>
      <td>${e.type}</td>
      <td>${e.user}</td>
      <td>${e.description}</td>
      <td><code>${e.hash}</code></td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadEvents() {
  const params = new URLSearchParams();
  const t = document.getElementById('f-type').value.trim();
  const u = document.getElementById('f-user').value.trim();
  const f = document.getElementById('f-from').value;
  const to = document.getElementById('f-to').value;
  if (t) params.set('type', t);
  if (u) params.set('user', u);
  if (f) params.set('from', new Date(f).toISOString());
  if (to) params.set('to', new Date(to).toISOString());

  const data = await fetchJSON(`${API}/api/events?` + params.toString());
  renderTable(data);
}

async function verifyChain() {
  const msg = document.getElementById('verify-msg');
  msg.textContent = 'Verificando...';
  msg.className = 'msg';
  try {
    const result = await fetchJSON(`${API}/api/events/verify`);
    if (result.valid) {
      msg.textContent = 'Cadeia íntegra ✔️';
      msg.className = 'msg ok';
    } else {
      msg.textContent = `Problemas encontrados: ${result.issues.length}`;
      msg.className = 'msg err';
      console.warn(result.issues);
      alert('Foram encontrados problemas de integridade. Veja o console para detalhes.');
    }
  } catch (e) {
    msg.textContent = 'Erro ao verificar';
    msg.className = 'msg err';
  }
}

document.getElementById('event-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const type = document.getElementById('type').value.trim();
  const user = document.getElementById('user').value.trim();
  const description = document.getElementById('description').value.trim();
  const msg = document.getElementById('form-msg');
  msg.textContent = 'Enviando...';
  msg.className = 'msg';

  try {
    await fetchJSON(`${API}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, user, description })
    });
    msg.textContent = 'Evento registrado!';
    msg.className = 'msg ok';
    (document.getElementById('event-form')).reset();
    loadEvents();
  } catch (e) {
    msg.textContent = 'Erro ao registrar evento';
    msg.className = 'msg err';
  }
});

document.getElementById('filter-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  await loadEvents();
});
document.getElementById('btn-clear').addEventListener('click', async () => {
  document.getElementById('filter-form').reset();
  await loadEvents();
});
document.getElementById('btn-verify').addEventListener('click', verifyChain);

// inicializa
loadEvents();
