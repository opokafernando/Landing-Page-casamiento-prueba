'use strict';

/**
 * Recibe el webhook "Booking created" de Cal.com (evento
 * https://cal.com/fernando-opoka/prueba) y avisa a Meta por dos vias:
 *  1) Un evento CAPI ("Lead" + "Schedule"), deduplicado contra el evento
 *     gemelo que main.js ya disparo en el navegador (Cal("on",
 *     "bookingSuccessful")) usando el MISMO event_id, que viaja hasta
 *     aca en metadata.eventIdLead / metadata.eventIdSchedule (puesto por
 *     assets/tracking.js -> prepareBookingMetadata antes de abrir el
 *     embed). Mismo patron que netlify/functions/capi.js de Estudio
 *     Graphica.
 *  2) Agrega a la persona a la audiencia personalizada "Agendaron llamada - Fernando Opoka Fotografia".
 *
 * El navegador (main.js) TAMBIEN dispara el evento de intencion
 * (interesado_reunion) cuando alguien hace clic en "Agendar reunion" o
 * elige un paquete, y el evento de conversion real (Lead/Schedule) desde
 * los dos lados a la vez, ya explicado arriba.
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

// El event_id se genera client-side (ver assets/tracking.js -> prepareBookingMetadata)
// y se manda como "metadata[eventIdLead]" / "metadata[eventIdSchedule]" en
// el config del embed inline de Cal.com. Cal.com guarda cualquier
// metadata[*] que reciba en booking.metadata y lo reenvia tal cual en el
// webhook, aca como payload.payload.metadata. Con esto, Pixel (client-side)
// y CAPI (server-side, aca) mandan el MISMO event_id para Lead y para
// Schedule, y Meta deduplica cada uno por separado. Si por algun motivo la
// metadata no llega (por ejemplo sessionStorage bloqueado en el navegador
// del visitante), se cae al esquema anterior basado en el uid de la
// reserva, para no perder el evento aunque se pierda la deduplicacion.
function extraerEventIdLead(payload, bookingUid) {
  const metadata = payload?.payload?.metadata || {};
  return metadata.eventIdLead || ('calcom-lead-' + bookingUid);
}

function extraerEventIdSchedule(payload, bookingUid) {
  const metadata = payload?.payload?.metadata || {};
  return metadata.eventIdSchedule || ('calcom-schedule-' + bookingUid);
}

// fbp/fbc viajan igual que los eventId: metadata[fbp] / metadata[fbc],
// puestas client-side (ver tracking.js -> getFbp/getFbc) justo antes de
// inicializar el embed. Son las señales de coincidencia mas fuertes para
// el CAPI, mucho mejores que solo correo/telefono.
function extraerFbp(payload) {
  const metadata = payload?.payload?.metadata || {};
  return metadata.fbp || null;
}

function extraerFbc(payload) {
  const metadata = payload?.payload?.metadata || {};
  return metadata.fbc || null;
}

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

    const fbp = extraerFbp(payload);
    const fbc = extraerFbc(payload);

    try {
          // "Cliente potencial" (Lead) y "Programar" (Schedule) son dos eventos
          // distintos del embudo que Fernando pidio trackear por separado, aunque
          // los dos se disparen desde la misma reserva confirmada en Cal.com.
      // Cada uno con su propio event_id (leido de metadata, ver arriba):
      // son dos eventos reales distintos, no se deduplican entre si, pero
      // cada uno SI se deduplica con su gemelo del lado del navegador.
      //
      // action_source: 'other' porque la reserva se confirma en el servidor
      // de Cal.com, no en una pagina del sitio. Declararla como "website"
      // genera advertencias de calidad de coincidencia en Events Manager.
      await sendMetaEvent({
                  eventName: 'Lead',
                  eventId: extraerEventIdLead(payload, bookingUid),
                  email,
                  phone,
                  fbp,
                  fbc,
                  sourceUrl: 'https://cal.com/fernando-opoka/prueba',
                  actionSource: 'other'
          });

      await sendMetaEvent({
                  eventName: 'Schedule',
                  eventId: extraerEventIdSchedule(payload, bookingUid),
                  email,
                  phone,
                  fbp,
                  fbc,
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
