// Funciones compartidas del panel /panel/ (CMS). No es una función de Netlify:
// la usan cms-files.js, cms-commit.js y cms-cloudinary.js.
const crypto = require('crypto');

const REPO = process.env.CMS_REPO || 'opokafernando/Landing-Page-casamiento-prueba';
const BRANCH = process.env.CMS_BRANCH || 'main';

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
    body: JSON.stringify(body),
  };
}

// Contraseña única del panel (variable de entorno ADMIN_PASSWORD en Netlify).
function checkAuth(event) {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return json(500, { error: 'Falta la variable ADMIN_PASSWORD en Netlify.' });
  const given = String((event.headers && (event.headers['x-cms-password'] || event.headers['X-Cms-Password'])) || '');
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  if (!crypto.timingSafeEqual(a, b)) return json(401, { error: 'Contraseña incorrecta.' });
  return null;
}

async function gh(path, opts = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw Object.assign(new Error('Falta la variable GITHUB_TOKEN en Netlify.'), { status: 500 });
  const res = await fetch('https://api.github.com/repos/' + REPO + path, {
    method: opts.method || 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: opts.raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'twp-panel',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    const err = new Error('GitHub ' + res.status + ': ' + txt.slice(0, 300));
    err.status = res.status;
    throw err;
  }
  return opts.raw ? res.text() : res.json();
}

async function headSha() {
  const ref = await gh('/git/ref/heads/' + BRANCH);
  return ref.object.sha;
}

function parseBody(event) {
  try { return JSON.parse(event.body || '{}'); } catch (e) { return {}; }
}

module.exports = { json, checkAuth, gh, headSha, parseBody, BRANCH, REPO };
