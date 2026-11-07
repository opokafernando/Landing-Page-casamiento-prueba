// Leads del panel /admin/ (noindex). Guarda cada lead en Netlify Blobs (store "leads"),
// así cambiar estado o contrato no requiere commit ni deploy.
// POST { action: "list" }                                  -> { leads: [...] }
// POST { action: "create", name, phone, email, eventDate, package, notes } -> { lead }
// POST { action: "update", id, status?, contractUrl?, notes? } -> { lead }
const crypto = require('crypto');
const { getStore } = require('@netlify/blobs');
const { json, checkAuth, parseBody } = require('../cms-shared');

const STATUSES = ['nuevo', 'contactado', 'reservado', 'confirmado', 'descartado'];
const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);

function validContractUrl(u) {
  if (u === '') return true;
  if (u.length > 500) return false;
  try { const x = new URL(u); return x.protocol === 'https:'; } catch (e) { return false; }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido' });
  const denied = checkAuth(event);
  if (denied) return denied;
  const body = parseBody(event);
  const store = getStore({ name: 'leads', consistency: 'strong' });

  try {
    if (body.action === 'list') {
      const { blobs } = await store.list();
      const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })));
      const leads = items.filter(Boolean).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
      return json(200, { leads, statuses: STATUSES });
    }

    if (body.action === 'create') {
      const name = clean(body.name, 120);
      if (!name) return json(400, { error: 'Falta el nombre.' });
      const now = new Date().toISOString();
      const lead = {
        id: crypto.randomUUID(),
        name,
        phone: clean(body.phone, 40),
        email: clean(body.email, 120),
        eventDate: clean(body.eventDate, 20),
        package: clean(body.package, 60),
        notes: clean(body.notes, 2000),
        status: 'nuevo',
        contractUrl: '',
        createdAt: now,
        updatedAt: now,
      };
      await store.setJSON(lead.id, lead);
      return json(200, { lead });
    }

    if (body.action === 'update') {
      const id = clean(body.id, 64);
      if (!/^[a-f0-9-]{36}$/.test(id)) return json(400, { error: 'ID no válido.' });
      const lead = await store.get(id, { type: 'json' });
      if (!lead) return json(404, { error: 'Lead no encontrado.' });

      if (body.status !== undefined) {
        if (!STATUSES.includes(body.status)) return json(400, { error: 'Estado no válido.' });
        lead.status = body.status;
      }
      if (body.contractUrl !== undefined) {
        const url = clean(body.contractUrl, 500);
        if (!validContractUrl(url)) return json(400, { error: 'El contrato tiene que ser un enlace https://.' });
        lead.contractUrl = url;
      }
      if (body.notes !== undefined) lead.notes = clean(body.notes, 2000);
      lead.updatedAt = new Date().toISOString();
      await store.setJSON(id, lead);
      return json(200, { lead });
    }

    return json(400, { error: 'Acción no válida.' });
  } catch (e) {
    return json(500, { error: 'Error al leer o guardar: ' + e.message });
  }
};
