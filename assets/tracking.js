/* ==========================================================================
   Fernando Opoka Fotografía — Tracking centralizado (Meta Pixel + CAPI + GA4)
   ==========================================================================
   Un solo archivo con TODOS los eventos de conversión del embudo, para que:
   - No se repita lógica de tracking en cada página (landing, blog, recursos).
   - Cada evento tenga un event_id único compartido entre Pixel (navegador) y
     CAPI (servidor), lo que evita que Meta cuente el mismo evento dos veces
     (deduplicación oficial de Meta: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events).
   - Cada evento también se manda a GA4 (gtag), no solo a Meta.
   - Se pueda auditar de un vistazo qué botón/página dispara qué evento.

   Requiere que el Pixel base (fbq init + PageView) y el Google Tag (gtag)
   ya se hayan cargado ANTES de este archivo (se mantienen en el <head> de
   cada página, como lo pide Meta).

   Mapa de eventos del embudo (definido junto con Fernando):
     PageView            -> automático, ya lo dispara el snippet base del Pixel.
     interesado_reunion   (custom) -> clic en "Agendar reunión" / "Quiero agendar una reunión",
                                      elegir un paquete de verdad, o tocar "Continuar con mi consulta".
                                      Es la señal de INTENCIÓN, no de conversión confirmada.
     Lead                (estándar) -> se dispara DOS veces a propósito, con el MISMO
                                       event_id en las dos: acá en el navegador, en el
                                       instante en que Cal.com confirma la reserva
                                       (Cal("on", "bookingSuccessful")), y en
                                       netlify/functions/cal-webhook.js del lado del
                                       servidor. El event_id viaja desde acá hacia
                                       Cal.com como metadata ANTES de que la reserva
                                       se confirme (ver prepareBookingMetadata más abajo),
                                       así que cuando el webhook lo reusa, Meta ve el
                                       mismo evento por dos caminos y lo cuenta UNA vez,
                                       quedándose con la señal más completa de las dos
                                       (mismo patrón que usa capi.js de Estudio Graphica).
     Schedule             (estándar) -> mismo mecanismo y mismo motivo que Lead, con su
                                       propio event_id compartido (son dos eventos reales
                                       distintos, no se deduplican entre sí).
     Contact              (estándar) -> clic en el botón de WhatsApp, o Thank You Page de la reunión.
     InitiateCheckout     (estándar) -> entra a la Thank You Page de pago ("Inicio compra").
     Purchase              (estándar) -> completa el pago en la Thank You Page de pago ("Compra").
     ViewContent           (estándar) -> abre un artículo del blog ("Ver blog").
     vio_portafolio       (custom) -> ve la sección de portafolio en la landing.
     inicio_en_blog        (custom) -> hace clic en un CTA que arrancó dentro del blog.

   Nota: se quitó cualquier evento tipo "SuscribedButton" — no aplican al
   embudo de Fernando y solo ensucian los datos del CAPI.
   ========================================================================== */

(function (window) {
  'use strict';

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback simple para navegadores viejos (no afecta la dedup real).
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Lee una cookie por nombre. Se usa para _fbp y _fbc, que el Pixel del
  // navegador crea solo apenas carga (no hay que generarlas a mano).
  // Sin esto, los eventos que llegan a Meta por CAPI viajan sin la cookie
  // que más ayuda a matchear la sesión del navegador con el evento de
  // servidor, y la calidad de coincidencia (EMQ) se resiente.
  function getCookie(name) {
    try {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    } catch (e) {
      return null;
    }
  }

  function getFbp() { return getCookie('_fbp'); }
  function getFbc() { return getCookie('_fbc'); }

  // Recuerda si el visitante llegó desde el blog, para poder mandar ese
  // origen como parámetro extra en los eventos de contacto de la landing.
  function getSource() {
    try {
      if (document.referrer && document.referrer.indexOf('/blog/') !== -1) {
        return 'blog';
      }
      var stored = sessionStorage.getItem('fo_source');
      if (stored) return stored;
    } catch (e) { /* sessionStorage puede fallar en modo privado; se ignora */ }
    return 'landing';
  }

  /**
   * Envía el evento al Pixel (fbq), a GA4 (gtag) y, en paralelo, a la
   * función serverless de CAPI (netlify/functions/track-event.js) con el
   * MISMO event_id para que Meta pueda deduplicar automáticamente.
   *
   * @param {string} type       'track' (evento estándar) o 'trackCustom' (evento personalizado).
   * @param {string} eventName  Nombre exacto del evento en Meta.
   * @param {object} [params]   Parámetros opcionales (content_name, value, currency, etc).
   * @param {string} [presetEventId] Si se pasa (ver prepareBookingMetadata), se usa
   *                                 este event_id en vez de generar uno nuevo, para que
   *                                 el evento coincida con el que ya viajó a Cal.com.
   */
  function fire(type, eventName, params, presetEventId) {
    params = params || {};
    var eventId = presetEventId || uuid();

    if (typeof window.fbq === 'function') {
      window.fbq(type, eventName, params, { eventID: eventId });
    }

    // GA4: antes este archivo solo mandaba a Meta, así que el Google Tag
    // instalado en el <head> únicamente medía lo automático (pageview,
    // scroll). Con esto, cada conversión real también llega a Analytics.
    if (typeof window.gtag === 'function') {
      var gtagParams = Object.assign({}, params, { event_id: eventId });
      window.gtag('event', eventName, gtagParams);
    }

    // Envío a CAPI (best-effort: si falla, no rompe la navegación del usuario).
    try {
      fetch('/.netlify/functions/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: eventName,
          event_id: eventId,
          event_source_url: window.location.href,
          source: getSource(),
          // fbp/fbc: las mismas cookies que ya usa el Pixel del navegador,
          // reenviadas para que el evento gemelo de CAPI tenga con qué
          // matchear la sesión (ver capi.js -> sendMetaEvent -> user_data).
          fbp: getFbp(),
          fbc: getFbc(),
          custom_data: params
        }),
        keepalive: true
      }).catch(function () { /* silencioso: el Pixel del navegador ya se disparó */ });
    } catch (e) { /* fetch no disponible / bloqueado: seguimos solo con el Pixel */ }

    return eventId;
  }

  var FO_Track = {
    /* ---------- Eventos estándar de Meta ---------- */
    lead: function (params, presetEventId) { return fire('track', 'Lead', params, presetEventId); },
    schedule: function (params, presetEventId) { return fire('track', 'Schedule', params, presetEventId); },
    contact: function (params) { return fire('track', 'Contact', params); },
    initiateCheckout: function (params) { return fire('track', 'InitiateCheckout', params); },
    purchase: function (params) { return fire('track', 'Purchase', params); },
    viewContent: function (params) { return fire('track', 'ViewContent', params); },

    /* ---------- Eventos personalizados del embudo de Fernando ----------
       En snake_case a propósito (interesado_reunion, no InteresadoReunion):
       es la misma convención que ya usa Estudio Graphica, para no mezclar
       estilos de nombre entre eventos custom del mismo negocio. */
    interesadoReunion: function (params) { return fire('trackCustom', 'interesado_reunion', params); },
    vioPortafolio: function (params) { return fire('trackCustom', 'vio_portafolio', params); },
    inicioEnBlog: function (params) { return fire('trackCustom', 'inicio_en_blog', params); },

    /* ---------- Dedup de Lead + Schedule con Cal.com (mismo patrón que capi.js de Estudio Graphica) ----------
       Se llama UNA vez, antes de inicializar el embed de Cal.com. Genera
       dos event_id (uno para Lead, otro para Schedule, son dos eventos
       reales distintos) y los guarda en sessionStorage. Devuelve el
       objeto que main.js debe meter en config.metadata del Cal("inline",
       ...), junto con fbp/fbc. Cal.com guarda cualquier metadata[*] que
       reciba y la reenvía tal cual en el payload del webhook de
       "Booking created", así que netlify/functions/cal-webhook.js puede
       leer metadata.eventIdLead / metadata.eventIdSchedule y usarlos al
       mandar el evento real por CAPI — mismo event_name + mismo event_id
       en Pixel (client-side, ver confirmBooking) y CAPI (server-side) =
       Meta deduplica en una sola conversión, no dos. */
    prepareBookingMetadata: function () {
      var leadId = uuid();
      var scheduleId = uuid();
      try {
        sessionStorage.setItem('fo_booking_lead_id', leadId);
        sessionStorage.setItem('fo_booking_schedule_id', scheduleId);
      } catch (e) { /* sessionStorage puede fallar en modo privado; se ignora */ }
      return {
        eventIdLead: leadId,
        eventIdSchedule: scheduleId,
        fbp: getFbp(),
        fbc: getFbc()
      };
    },

    /* Se llama desde Cal("on", {action:"bookingSuccessful", ...}) en main.js,
       en el instante exacto en que Cal.com confirma que la reserva quedó
       agendada de verdad. Dispara Lead + Schedule EN EL NAVEGADOR, cada uno
       con el mismo event_id que ya viajó a Cal.com como metadata (ver
       prepareBookingMetadata arriba) — así el webhook de servidor no es la
       única fuente, pero tampoco duplica nada, porque comparten event_id. */
    confirmBooking: function (params) {
      var leadId = null, scheduleId = null;
      try {
        leadId = sessionStorage.getItem('fo_booking_lead_id');
        scheduleId = sessionStorage.getItem('fo_booking_schedule_id');
      } catch (e) {}
      this.lead(params, leadId || undefined);
      this.schedule(params, scheduleId || undefined);
    },

    /* Marca que el visitante viene del blog, para que la landing lo recuerde
       aunque navegue un par de clics más allá del referrer original. */
    markBlogSource: function () {
      try { sessionStorage.setItem('fo_source', 'blog'); } catch (e) {}
    },

    getFbp: getFbp,
    getFbc: getFbc,
    _getSource: getSource
  };

  window.FO_Track = FO_Track;

  /* ---------- Auto-tracking de "vio portafolio" ----------
     No existe un botón "Ver portafolio" separado en el diseño actual (el
     carrusel está siempre a la vista al hacer scroll), así que el evento se
     dispara una sola vez cuando la sección de portafolio entra en pantalla. */
  document.addEventListener('DOMContentLoaded', function () {
    var section = document.querySelector('.portafolio');
    if (!section || !('IntersectionObserver' in window)) return;
    var fired = false;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !fired) {
          fired = true;
          FO_Track.vioPortafolio();
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(section);
  });
})(window);
