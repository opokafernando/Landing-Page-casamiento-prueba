/* ==========================================================================
   Fernando Opoka Fotografía — Tracking centralizado (Meta Pixel + CAPI)
   ==========================================================================
   Un solo archivo con TODOS los eventos de conversión del embudo, para que:
   - No se repita lógica de tracking en cada página (landing, blog, recursos).
   - Cada evento tenga un event_id único compartido entre Pixel (navegador) y
     CAPI (servidor), lo que evita que Meta cuente el mismo evento dos veces
     (deduplicación oficial de Meta: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events).
   - Se pueda auditar de un vistazo qué botón/página dispara qué evento.

   Requiere que el Pixel base (fbq init + PageView) ya se haya cargado ANTES
   de este archivo (se mantiene en el <head> de cada página, como lo pide
   Meta).

   Mapa de eventos del embudo (definido junto con Fernando):
     PageView            -> automático, ya lo dispara el snippet base del Pixel.
     InteresadoReunion    (custom) -> clic en "Agendar reunión" / "Quiero agendar una reunión".
     Lead                (estándar) -> alguien agenda su reunión en Cal.com ("Cliente potencial").
     Schedule             (estándar) -> se confirma el turno en Cal.com ("Programar").
     Contact              (estándar) -> clic en el botón de WhatsApp, o Thank You Page de la reunión.
     InitiateCheckout     (estándar) -> entra a la Thank You Page de pago ("Inicio compra").
     Purchase              (estándar) -> completa el pago en la Thank You Page de pago ("Compra").
     ViewContent           (estándar) -> abre un artículo del blog ("Ver blog").
     VioPortafolio        (custom) -> ve la sección de portafolio en la landing.
     InicioEnBlog          (custom) -> hace clic en un CTA que arrancó dentro del blog.

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
   * Envía el evento al Pixel (fbq) y, en paralelo, a la función serverless
   * de CAPI (netlify/functions/capi.js) con el MISMO event_id para que Meta
   * pueda deduplicar automáticamente.
   *
   * @param {string} type       'track' (evento estándar) o 'trackCustom' (evento personalizado).
   * @param {string} eventName  Nombre exacto del evento en Meta.
   * @param {object} [params]   Parámetros opcionales (content_name, value, currency, etc).
   */
  function fire(type, eventName, params) {
    params = params || {};
    var eventId = uuid();

    if (typeof window.fbq === 'function') {
      window.fbq(type, eventName, params, { eventID: eventId });
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
          custom_data: params
        }),
        keepalive: true
      }).catch(function () { /* silencioso: el Pixel del navegador ya se disparó */ });
    } catch (e) { /* fetch no disponible / bloqueado: seguimos solo con el Pixel */ }

    return eventId;
  }

  var FO_Track = {
    /* ---------- Eventos estándar de Meta ---------- */
    lead: function (params) { return fire('track', 'Lead', params); },
    schedule: function (params) { return fire('track', 'Schedule', params); },
    contact: function (params) { return fire('track', 'Contact', params); },
    initiateCheckout: function (params) { return fire('track', 'InitiateCheckout', params); },
    purchase: function (params) { return fire('track', 'Purchase', params); },
    viewContent: function (params) { return fire('track', 'ViewContent', params); },

    /* ---------- Eventos personalizados del embudo de Fernando ---------- */
    interesadoReunion: function (params) { return fire('trackCustom', 'InteresadoReunion', params); },
    vioPortafolio: function (params) { return fire('trackCustom', 'VioPortafolio', params); },
    inicioEnBlog: function (params) { return fire('trackCustom', 'InicioEnBlog', params); },

    /* ---------- Dispara Lead + Schedule juntos (booking confirmado en Cal.com) ---------- */
    bookingConfirmado: function (params) {
      this.lead(params);
      this.schedule(params);
    },

    /* Marca que el visitante viene del blog, para que la landing lo recuerde
       aunque navegue un par de clics más allá del referrer original. */
    markBlogSource: function () {
      try { sessionStorage.setItem('fo_source', 'blog'); } catch (e) {}
    },

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
