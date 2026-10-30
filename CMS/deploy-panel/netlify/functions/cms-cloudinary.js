// Panel /panel/: lista carpetas y fotos de Cloudinary para armar galerías.
// POST { action: "folders", path: "Landing Page/08 Galerias" } -> { folders: [{name, path}] }
// POST { action: "photos", folder: "Landing Page/08 Galerias/..." } -> { photos: [[public_id, ancho, alto], ...] }
const { json, checkAuth, parseBody } = require('../cms-shared');
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME || 'drfoww3ch';

async function cld(path, opts = {}) {
  const key = process.env.CLOUDINARY_API_KEY, secret = process.env.CLOUDINARY_API_SECRET;
  if (!key || !secret) throw Object.assign(new Error('Faltan CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en Netlify.'), { status: 500 });
  const res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUD + path, {
    method: opts.method || 'GET',
    headers: { Authorization: 'Basic ' + Buffer.from(key + ':' + secret).toString('base64'), ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw Object.assign(new Error('Cloudinary ' + res.status + ': ' + (await res.text()).slice(0, 200)), { status: 502 });
  return res.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido' });
  const denied = checkAuth(event);
  if (denied) return denied;
  const body = parseBody(event);
  try {
    if (body.action === 'folders') {
      const base = String(body.path || 'Landing Page/08 Galerias');
      const r = await cld('/folders/' + base.split('/').map(encodeURIComponent).join('/') + '?max_results=500');
      return json(200, { folders: (r.folders || []).map((f) => ({ name: f.name, path: f.path })) });
    }
    if (body.action === 'photos') {
      const folder = String(body.folder || '');
      if (!folder) return json(400, { error: 'Falta la carpeta.' });
      const photos = [];
      let cursor;
      do {
        const r = await cld('/resources/search', { method: 'POST', body: {
          expression: 'asset_folder="' + folder.replace(/"/g, '\\"') + '" AND resource_type:image',
          max_results: 500, ...(cursor ? { next_cursor: cursor } : {}),
        } });
        (r.resources || []).forEach((x) => photos.push([x.public_id, x.width, x.height]));
        cursor = r.next_cursor;
      } while (cursor && photos.length < 3000);
      return json(200, { photos });
    }
    return json(400, { error: 'Acción desconocida.' });
  } catch (e) {
    return json(e.status || 500, { error: e.message });
  }
};
