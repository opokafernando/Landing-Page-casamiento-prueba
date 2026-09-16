'use strict';

/**
 * Helper compartido para hablar con Meta (Conversions API + Custom Audiences).
 * Lo usa netlify/functions/cal-webhook.js, y se puede reutilizar para otros
 * webhooks (Stripe, bajas de agenda, etc.) que sigan el mismo patron.
 *
 * Nunca hardcodear tokens aca: todo sale de las variables de entorno de Netlify
 * (META_PIXEL_ID, META_AD_ACCOUNT_ID, META_ACCESS_TOKEN).
 */

const crypto = require('crypto');

const GRAPH_API_VERSION = 'v21.0';

/**
 * Normaliza y hashea un valor con SHA256, como pide Meta para email/telefono.
 * Devuelve null si el valor no existe o queda vacio tras limpiarlo.
 */
function sha256(value) {
    if (!value) return null;
    const clean = String(value).trim().toLowerCase();
    if (!clean) return null;
    return crypto.createHash('sha256').update(clean).digest('hex');
}

/**
 * Normaliza un telefono a solo digitos (con codigo de pais incluido).
 * Ej: "+55 47 98882-1970" -> "5547988821970"
 */
function normalizePhone(phone) {
    if (!phone) return null;
    const digits = String(phone).replace(/\D/g, '');
    return digits || null;
}

/**
 * Envia un evento a Meta Conversions API (CAPI) para el Pixel configurado.
 * `eventId` debe ser unico por evento real (ej. el uid de la reserva de Cal.com)
 * para que Meta deduplique si el mismo evento tambien llega por el pixel del navegador.
 */
async function sendMetaEvent({ eventName, eventId, email, phone, sourceUrl, actionSource = 'system_generated', eventTime }) {
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    if (!pixelId || !accessToken) {
          throw new Error('Faltan META_PIXEL_ID o META_ACCESS_TOKEN en las variables de entorno de Netlify.');
    }

  const userData = {};
    const hashedEmail = sha256(email);
    const hashedPhone = sha256(normalizePhone(phone));
    if (hashedEmail) userData.em = [hashedEmail];
    if (hashedPhone) userData.ph = [hashedPhone];

  const body = {
        data: [
          {
                    event_name: eventName,
                    event_time: eventTime || Math.floor(Date.now() / 1000),
                    event_id: eventId,
                    action_source: actionSource,
                    event_source_url: sourceUrl,
                    user_data: userData
          }
              ]
  };

  const res = await fetch(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
    }
      );

  const json = await res.json().catch(() => ({}));
    if (!res.ok) {
          throw new Error('Error de Meta CAPI: ' + JSON.stringify(json));
    }
    return json;
}

/**
 * Busca una audiencia personalizada por nombre exacto en la cuenta publicitaria.
 * Devuelve el id si existe, o null si no la encuentra.
 */
async function findAudienceByName(name) {
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/act_${adAccountId}/customaudiences?fields=id,name&limit=200&access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
          throw new Error('Error buscando audiencias: ' + JSON.stringify(json));
    }
    const match = (json.data || []).find((a) => a.name === name);
    return match ? match.id : null;
}

/**
 * Crea una audiencia personalizada nueva (agregado por hash de email/telefono) con ese nombre.
 */
async function createAudience(name) {
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/act_${adAccountId}/customaudiences?access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
                  name,
                  description: 'Creada automaticamente por el webhook de Cal.com',
                  customer_file_source: 'USER_PROVIDED_ONLY',
                  subtype: 'CUSTOM'
          })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
          throw new Error('Error creando audiencia: ' + JSON.stringify(json));
    }
    return json.id;
}

/**
 * Devuelve el id de la audiencia con ese nombre, creandola primero si todavia no existe.
 */
async function findOrCreateAudience(name) {
    const existing = await findAudienceByName(name);
    if (existing) return existing;
    return createAudience(name);
}

/**
 * Agrega una persona (email y/o telefono, todavia SIN hashear) a una audiencia personalizada.
 * El hasheo lo hace esta funcion, no quien la llama.
 */
async function addUserToAudience(audienceId, { email, phone }) {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const hashedEmail = sha256(email);
    const hashedPhone = sha256(normalizePhone(phone));
    const schema = [];
    const dataRow = [];
    if (hashedEmail) { schema.push('EMAIL'); dataRow.push(hashedEmail); }
    if (hashedPhone) { schema.push('PHONE'); dataRow.push(hashedPhone); }
    if (schema.length === 0) return null;

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${audienceId}/users?access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
                  payload: { schema, data: [dataRow] }
          })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
          throw new Error('Error agregando usuario a la audiencia: ' + JSON.stringify(json));
    }
    return json;
}

module.exports = {
    sha256,
    normalizePhone,
    sendMetaEvent,
    findOrCreateAudience,
    addUserToAudience
};
