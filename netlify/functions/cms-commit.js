// Panel /panel/: publica TODOS los cambios juntos en un solo commit (= un solo deploy).
// POST { baseSha, message, files: { ruta: "contenido nuevo" | null (borrar) } }
const { json, checkAuth, gh, headSha, parseBody, BRANCH, REPO } = require('../cms-shared');

// "Preview": los cambios van a este branch + un pull request, y Netlify arma un
// Deploy Preview del PR. "Guardar" (sin action) los publica en main y cierra el PR.
const PREVIEW_BRANCH = process.env.CMS_PREVIEW_BRANCH || 'panel-preview';
const SITE_NAME = process.env.CMS_SITE_NAME || 'fernando-opoka-bodas';

async function openPreviewPrs() {
  const owner = REPO.split('/')[0];
  return gh('/pulls?state=open&base=' + BRANCH + '&head=' + owner + ':' + PREVIEW_BRANCH);
}

async function publishPreview(newCommit, count) {
  // El branch se recrea desde main en cada preview: el borrador del panel tiene TODOS los cambios pendientes.
  try {
    await gh('/git/refs/heads/' + PREVIEW_BRANCH, { method: 'PATCH', body: { sha: newCommit.sha, force: true } });
  } catch (e) {
    if (e.status !== 404 && e.status !== 422) throw e;
    await gh('/git/refs', { method: 'POST', body: { ref: 'refs/heads/' + PREVIEW_BRANCH, sha: newCommit.sha } });
  }
  const open = await openPreviewPrs();
  const pr = open.length ? open[0] : await gh('/pulls', { method: 'POST', body: {
    title: 'Preview desde el panel',
    head: PREVIEW_BRANCH,
    base: BRANCH,
    body: 'Vista previa creada por el panel. No se une a main: el botón Guardar del panel publica los cambios.',
  } });
  return {
    sha: newCommit.sha,
    branch: PREVIEW_BRANCH,
    pr: pr.number,
    prUrl: pr.html_url,
    previewUrl: 'https://deploy-preview-' + pr.number + '--' + SITE_NAME + '.netlify.app',
    count,
  };
}

async function closePreviewPr() {
  try {
    for (const pr of await openPreviewPrs()) await gh('/pulls/' + pr.number, { method: 'PATCH', body: { state: 'closed' } });
  } catch (e) { /* si no se puede cerrar, no importa: ya se guardó */ }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido' });
  const denied = checkAuth(event);
  if (denied) return denied;
  const { baseSha, message, files, action } = parseBody(event);
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
    if (action === 'preview') return json(200, await publishPreview(newCommit, entries.length));
    await gh('/git/refs/heads/' + BRANCH, { method: 'PATCH', body: { sha: newCommit.sha, force: false } });
    await closePreviewPr();
    return json(200, { sha: newCommit.sha, url: newCommit.html_url, count: entries.length });
  } catch (e) {
    return json(e.status === 422 ? 409 : 500, { error: e.message });
  }
};
