// Panel /panel/: publica TODOS los cambios juntos en un solo commit (= un solo deploy).
// POST { baseSha, message, files: { ruta: "contenido nuevo" | null (borrar) } }
const { json, checkAuth, gh, headSha, parseBody, BRANCH } = require('../cms-shared');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido' });
  const denied = checkAuth(event);
  if (denied) return denied;
  const { baseSha, message, files } = parseBody(event);
  const entries = Object.entries(files || {});
  if (!entries.length) return json(400, { error: 'No hay cambios para publicar.' });
  if (entries.some(([p]) => typeof p !== 'string' || !p || p.includes('..') || p.startsWith('/'))) {
    return json(400, { error: 'Ruta de archivo inválida.' });
  }
  try {
    const head = await headSha();
    if (baseSha && head !== baseSha) {
      return json(409, { error: 'El repositorio cambió desde que abriste el panel (alguien subió algo a GitHub). Recargá el panel y volvé a hacer los cambios.' });
    }
    const commit = await gh('/git/commits/' + head);
    const tree = [];
    for (const [path, content] of entries) {
      if (content === null) {
        tree.push({ path, mode: '100644', type: 'blob', sha: null });
      } else {
        const blob = await gh('/git/blobs', { method: 'POST', body: { content: Buffer.from(String(content), 'utf8').toString('base64'), encoding: 'base64' } });
        tree.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
      }
    }
    const newTree = await gh('/git/trees', { method: 'POST', body: { base_tree: commit.tree.sha, tree } });
    const newCommit = await gh('/git/commits', { method: 'POST', body: {
      message: String(message || 'Cambios desde el panel').slice(0, 500),
      tree: newTree.sha,
      parents: [head],
    } });
    await gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: { sha: newCommit.sha, force: false } });
    return json(200, { sha: newCommit.sha, url: newCommit.html_url, count: entries.length });
  } catch (e) {
    return json(e.status === 422 ? 409 : 500, { error: e.message });
  }
};
