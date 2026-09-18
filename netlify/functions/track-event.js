'use strict';

/**
 * Endpoint HTTP que recibe los eventos de conversion disparados desde el
 * navegador (assets/tracking.js) y los reenvia a Meta via CAPI, reusando el
 * mismo helper que ya usa cal-webhook.js (netlify/functions/capi.js).
 *
 * Esto es lo que le falta al Pixel del navegador: Meta recomienda mandar
 * SIEMPRE el mismo evento por Pixel (rapido, pero lo puede bloquear un
 * adblocker) y por CAPI (server-to-server, no lo bloquea nada), usando el
 * mismo event_id para que los dedupe automaticamente.
 *
 * No requiere token propio: usa las mismas variables de entorno que ya
 * estan configuradas en Netlify para cal-webhook.js (META_PIXEL_ID,
 * META_ACCESS_TOKEN). Nunca se hardcodea ningun token aca.
 */

const { sendMetaEvent } = require('./capi');

// Lista blanca de eventos que este endpoint acepta. Cualquier otro nombre
// se rechaza: asi un script inyectado o un bot que le pegue al endpoint
// directo no puede mandar eventos arbitrarios a la cuenta de Meta.
const ALLOWED_EVENTS = new Set([
  'Lead',
  'Schedule',
  'Contact',
  'InitiateCheckout',
  'Purchase',
  'ViewContent',
  'InteresadoReunion',
  'VioPortafolio',
  'InicioEnBlog'
]);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'JSON invalido' };
  }

  const { event_name: eventName, event_id: eventId, event_source_url: sourceUrl } = payload;

  if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
    return { statusCode: 400, body: 'event_name invalido o no permitido' };
  }
  if (!eventId) {
    return { statusCode: 400, body: 'Falta event_id (necesario para deduplicar con el Pixel)' };
  }

  try {
    await sendMetaEvent({
      eventName,
      eventId,
      sourceUrl,
      actionSource: 'website'
    });
  } catch (err) {
    // No hacemos fallar la navegacion del visitante por un problema con Meta:
    // el Pixel del navegador ya disparo el evento igual. Queda en los logs
    // de Netlify Functions para revisar si empieza a fallar seguido.
    console.error('Error mandando evento a Meta CAPI (track-event):', eventName, err);
    return { statusCode: 200, body: 'Registrado solo por Pixel (CAPI fallo)' };
  }

  return { statusCode: 200, body: 'OK' };
};
