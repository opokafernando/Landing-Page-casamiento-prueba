'use strict';

/**
 * Recibe el webhook "Booking created" de Cal.com (evento
 * https://cal.com/fernando-opoka/prueba) y avisa a Meta por dos vias:
 *  1) Un evento CAPI ("Lead" + "Schedule") en el Pixel, deduplicado por el uid de la reserva.
 *  2) Agrega a la persona a la audiencia personalizada "Agendaron llamada - Fernando Opoka Fotografia".
 *
 * Esta funcion es la UNICA fuente de los eventos Lead y Schedule del embudo.
 * El navegador (main.js) NO los dispara: solo dispara el evento de intencion
 * (InteresadoReunion) cuando alguien hace clic en "Agendar reunion". El
 * evento de conversion real se cuenta una sola vez, aca, cuando Cal.com
 * confirma que la reserva quedo agendada de verdad.
 *
 * Configurar en Cal.com: Settings -> Developer -> Webhooks -> nueva ->
 *   URL: https://[tu-sitio].netlify.app/.netlify/functions/cal-webhook
 *   Evento: "Booking created"
 *   Secret: el mismo valor que CALCOM_WEBHOOK_SECRET en Netlify.
 */

const crypto = require('crypto');
const { sendMetaEvent, findOrCreateAudience, addUserToAudience } = require('./capi');

// Slug(s) del tipo de evento de Cal.com que queremos rastrear.
// https://cal.com/fernando-opoka/prueba -> slug "prueba"
const TRACKED_EVENT_SLUGS = ['prueba'];

// Nombre de la audiencia personalizada donde se agregan las personas que agendan.
const AUDIENCE_NAME = 'Agendaron llamada - Fernando Opoka Fotografia';

function verifySignature(rawBody, signatureHeader, secret) {
    if (!signatureHeader || !secret) return false;
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    // Cal.com manda el header en hex plano (a veces con el prefijo "sha256=").
  const received = signatureHeader.replace(/^sha256=/, '');
    try {
          return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));
    } catch (e) {
          return false;
    }
}

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
          return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const rawBody = event.body || '';
    const signatureHeader =
          event.headers['x-cal-signature-256'] || event.headers['X-Cal-Signature-256'];
    const secret = process.env.CALCOM_WEBHOOK_SECRET;

    if (!verifySignature(rawBody, signatureHeader, secret)) {
          return { statusCode: 401, body: 'Firma invalida' };
    }

    let payload;
    try {
          payload = JSON.parse(rawBody);
    } catch (e) {
          return { statusCode: 400, body: 'JSON invalido' };
    }

    // Cualquier evento que no sea una reserva nueva se ignora rapido (200 para que
    // Cal.com no reintente), sin gastar una llamada a Meta.
    if (payload.triggerEvent !== 'BOOKING_CREATED') {
          return { statusCode: 200, body: 'Ignorado (trigger distinto: ' + payload.triggerEvent + ')' };
    }

    const bookingPayload = payload.payload || {};
    const eventSlug =
          (bookingPayload.eventType && bookingPayload.eventType.slug) ||
          bookingPayload.type ||
          '';

    // Filtro por slug: sin esto, cualquier otro tipo de evento de Cal.com
    // (si en el futuro agregas mas tipos de reunion) contaminaria la audiencia.
    if (!TRACKED_EVENT_SLUGS.includes(eventSlug)) {
          return { statusCode: 200, body: 'Ignorado (slug distinto: ' + eventSlug + ')' };
    }

    const attendee = (bookingPayload.attendees && bookingPayload.attendees[0]) || {};
    const email = attendee.email || bookingPayload.email;
    const phone =
          attendee.phoneNumber ||
          attendee.phone ||
          (bookingPayload.responses &&
                 bookingPayload.responses.attendeePhoneNumber &&
                 bookingPayload.responses.attendeePhoneNumber.value);
    const bookingUid = bookingPayload.uid || bookingPayload.bookingId || String(Date.now());

    try {
          // "Cliente potencial" (Lead) y "Programar" (Schedule) son dos eventos
          // distintos del embudo que Fernando pidio trackear por separado, aunque
          // los dos se disparen desde la misma reserva confirmada en Cal.com.
      // Event IDs distintos a proposito: son dos eventos reales distintos,
      // no se le debe pedir a Meta que los deduplique entre si.
      //
      // action_source: 'other' porque la reserva se confirma en el servidor
      // de Cal.com, no en una pagina del sitio. Declararla como "website"
      // genera advertencias de calidad de coincidencia en Events Manager.
      await sendMetaEvent({
                  eventName: 'Lead',
                  eventId: 'calcom-lead-' + bookingUid,
                  email,
                  phone,
                  sourceUrl: 'https://cal.com/fernando-opoka/prueba',
                  actionSource: 'other'
          });

      await sendMetaEvent({
                  eventName: 'Schedule',
                  eventId: 'calcom-schedule-' + bookingUid,
                  email,
                  phone,
                  sourceUrl: 'https://cal.com/fernando-opoka/prueba',
                  actionSource: 'other'
          });

      const audienceId = await findOrCreateAudience(AUDIENCE_NAME);
          if (audienceId) {
                  await addUserToAudience(audienceId, { email, phone });
          }
    } catch (err) {
          // No relanzamos el error: ya no tiene sentido que Cal.com reintente.
      // Queda registrado en los logs de Netlify Functions para revisar.
      console.error('Error procesando booking de Cal.com:', err);
    }

    return { statusCode: 200, body: 'OK' };
};
