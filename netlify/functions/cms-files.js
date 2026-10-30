// Panel /panel/: lee archivos del repositorio (siempre de la última versión de main).
// POST { paths: ["index.html", ...] }  -> { sha, files: { ruta: contenido | null } }
// POST { tree: true }                   -> { sha, paths: [ ...todas las rutas... ] }
const { json, checkAuth, gh, headSha, parseBody } = require('../cms-shared');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido' });
  const denied = checkAuth(event);
  if (denied) return denied;
  const body = parseBody(event);
  try {
    const sha = await headSha();
    if (body.tree) {
      const commit = await gh('/git/commits/' + sha);
      const tree = await gh('/git/trees/' + commit.tree.sha + '?recursive=1');
      return json(200, { sha, paths: tree.tree.filter((t) => t.type === 'blob').map((t) => t.path) });
    }
    const paths = Array.isArray(body.paths) ? body.paths.slice(0, 60) : [];
    const files = {};
    await Promise.all(paths.map(async (p) => {
      if (typeof p !== 'string' || p.includes('..')) return;
      try {
        files[p] = await gh('/contents/' + p.split('/').map(encodeURIComponent).join('/') + '?ref=' + sha, { raw: true });
      } catch (e) {
        if (e.status === 404) files[p] = null; else throw e;
      }
    }));
    return json(200, { sha, files });
  } catch (e) {
    return json(e.status && e.status < 600 ? (e.status === 401 ? 502 : e.status) : 500, { error: e.message });
  }
};
