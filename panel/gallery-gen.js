/* Generador de las páginas de galerías (/galerias/ y /galerias/<slug>/).
   Lo usa el panel para rehacer las páginas a partir de galerias/galerias.json.
   Produce exactamente el mismo HTML que el generador original. */
(function (root) {
  var CL = 'https://res.cloudinary.com/drfoww3ch/image/upload/';
  var SITE = 'https://fernando-opoka-bodas.netlify.app';
  var PIXEL = '2150861609138392';
  var GA = 'G-QR4VFD960W';

  function e(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  }
  function img(pid, t) { return CL + t + '/' + pid + '.jpg'; }
  function cimg(g, pid, t) { return img(pid, t.replace('g_auto', g.gravity || 'g_auto')); }

  function head(o) {
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '<title>' + o.title + '</title>\n' +
      '<meta name="description" content="' + o.desc + '">\n' +
      '<meta name="robots" content="noindex">\n' +
      '<link rel="canonical" href="' + o.canonical + '">\n' +
      '<meta property="og:title" content="' + o.title + '">\n' +
      '<meta property="og:description" content="' + o.desc + '">\n' +
      '<meta property="og:image" content="' + o.ogimg + '">\n' +
      '<meta property="og:type" content="website">\n' +
      '<link rel="icon" type="image/png" href="https://res.cloudinary.com/drfoww3ch/image/upload/w_64,h_64,c_pad,b_rgb:221D18,f_png/Firma_Blanca_gc6x1k.png">\n' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link rel="preconnect" href="https://res.cloudinary.com">\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&family=Petit+Formal+Script&family=Bodoni+Moda:ital,opsz,wght@1,6..96,600&display=swap" rel="stylesheet">\n' +
      '<link rel="stylesheet" href="/assets/galerias.css">\n\n' +
      '<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n' +
      'n.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';\n' +
      'n.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\n' +
      's.parentNode.insertBefore(t,s)}(window, document,\'script\',\n\'https://connect.facebook.net/en_US/fbevents.js\');\n' +
      "fbq('set', 'autoConfig', false, '" + PIXEL + "');\nfbq('init', '" + PIXEL + "');\nfbq('track', 'PageView');\n</script>\n" +
      '<noscript><img height="1" width="1" style="display:none"\nsrc="https://www.facebook.com/tr?id=' + PIXEL + '&ev=PageView&noscript=1"\n/></noscript>\n' +
      '<!-- End Meta Pixel Code -->\n\n<!-- Google Analytics 4 -->\n' +
      '<script async src="https://www.googletagmanager.com/gtag/js?id=' + GA + '"></script>\n<script>\n' +
      '  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n' +
      "  gtag('js', new Date());\n  gtag('config', '" + GA + "');\n</script>\n\n" +
      '<script src="/assets/tracking.js"></script>\n<script>' + o.track + '</script>\n</head>\n<body>\n';
  }

  function header(backHref, backKey, backText) {
    return '<header class="g-header">\n  <div class="wrap">\n    <a href="/" class="g-brand">The Wedding Project</a>\n    <nav class="g-nav">\n' +
      '      <a href="' + backHref + '" class="g-back" data-i18n="' + backKey + '">' + backText + '</a>\n' +
      '      <button type="button" class="lang-switcher" id="langSwitcher" data-i18n="lang.switcher">🌐 Idioma</button>\n' +
      '    </nav>\n  </div>\n</header>\n';
  }

  var WA = 'https://wa.me/5547988821970?text=';
  var WA_MSG = {
    es: 'Hola, vi las galerías en su web y quiero consultar por mi boda.',
    pt: 'Olá, vi as galerias no site de vocês e quero saber mais sobre o meu casamento.',
    en: "Hi, I saw the galleries on your website and I'd like to ask about my wedding."
  };
  // Igual que urllib.parse.quote de Python (deja "/" sin codificar).
  function quote(s) {
    return encodeURIComponent(s).replace(/%2F/g, '/').replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  var CTA = '<section class="g-cta">\n  <div class="wrap">\n    <span class="eyebrow" data-i18n="cta.eyebrow">¿Les gustó?</span>\n' +
    '    <h2 data-i18n="cta.h2">Contemos su historia también</h2>\n' +
    '    <p data-i18n="cta.p">Escribinos y vemos juntos la fecha y el paquete que mejor les queda.</p>\n' +
    '    <div class="g-cta-btns">\n      <a class="btn btn-whatsapp" id="ctaWhatsapp" href="' + WA + quote(WA_MSG.es) +
    '" data-i18n-href="cta.waHref" target="_blank" rel="noopener" data-i18n="cta.wa">Consultar por WhatsApp</a>\n' +
    '      <a class="btn btn-ghost" href="/#paquetes" data-i18n="cta.pkgs">Ver paquetes</a>\n    </div>\n  </div>\n</section>\n';
  var FOOTER = '<footer class="g-footer">© 2026 The Wedding Project · <a href="/privacidad.html" data-i18n="footer.privacy">Política de privacidad</a></footer>\n';

  var COMMON = {
    es: { 'lang.switcher': '🌐 Idioma', 'cta.eyebrow': '¿Les gustó?', 'cta.h2': 'Contemos su historia también', 'cta.p': 'Escribinos y vemos juntos la fecha y el paquete que mejor les queda.', 'cta.wa': 'Consultar por WhatsApp', 'cta.pkgs': 'Ver paquetes', 'footer.privacy': 'Política de privacidad', 'type.boda': 'Boda', 'type.prewedding': 'Pre wedding', 'photos': 'fotos' },
    pt: { 'lang.switcher': '🌐 Idioma', 'cta.eyebrow': 'Gostaram?', 'cta.h2': 'Vamos contar a história de vocês também', 'cta.p': 'Escrevam pra gente e vemos juntos a data e o pacote ideal.', 'cta.wa': 'Consultar pelo WhatsApp', 'cta.pkgs': 'Ver pacotes', 'footer.privacy': 'Política de privacidade', 'type.boda': 'Casamento', 'type.prewedding': 'Pré-wedding', 'photos': 'fotos' },
    en: { 'lang.switcher': '🌐 Language', 'cta.eyebrow': 'Like what you see?', 'cta.h2': 'Let us tell your story too', 'cta.p': "Message us and we'll find the date and package that fit you best.", 'cta.wa': 'Ask on WhatsApp', 'cta.pkgs': 'See packages', 'footer.privacy': 'Privacy Policy', 'type.boda': 'Wedding', 'type.prewedding': 'Pre-wedding', 'photos': 'photos' }
  };
  ['es', 'pt', 'en'].forEach(function (l) { COMMON[l]['cta.waHref'] = WA + quote(WA_MSG[l]); });

  function langScript(extra) {
    var d = {};
    ['es', 'pt', 'en'].forEach(function (l) {
      d[l] = {};
      Object.keys(COMMON[l]).forEach(function (k) { d[l][k] = COMMON[l][k]; });
      Object.keys(extra[l] || {}).forEach(function (k) { d[l][k] = extra[l][k]; });
    });
    return '<script>\nwindow.FO_LANG = ' + JSON.stringify(d, null, 1) + ';\n</script>\n' +
      '<script src="/assets/subpage-lang.js"></script>\n<script>FO_Subpage.init();</script>\n' +
      '<script>(function(){var w=document.getElementById("ctaWhatsapp"); if(w){w.addEventListener("click",function(){ if(window.FO_Track){FO_Track.contact({content_name:"galerias"});} });}})();</script>\n';
  }

  function metaLine(g, lang) {
    var parts = [];
    if (g.place) parts.push(e(g.place));
    var d = g['date_' + lang] || '';
    if (d) parts.push(e(d));
    return parts;
  }
  var TYPE_DEFAULT = { boda: 'Boda', prewedding: 'Pre wedding' };

  function dimsOf(g, pid) {
    for (var i = 0; i < g.photos.length; i++) if (g.photos[i][0] === pid) return [g.photos[i][1], g.photos[i][2]];
    return [3, 2];
  }

  function galleryPage(g) {
    var n = g.photos.length;
    var ch = g.cover_h, cv = g.cover_v || ch;
    var heroCls = '', heroStyle = '', hx;
    if (!g.hero_crop) {
      var d = dimsOf(g, ch);
      heroCls = ' is-ratio'; heroStyle = ' style="--hero-ar:' + d[0] + '/' + d[1] + '"';
      hx = function (w) { return 'f_auto,q_auto,c_limit,w_' + w; };
    } else {
      hx = function (w) { return { 1200: 'f_auto,q_auto,c_fill,g_auto,w_1200,h_750', 1600: 'f_auto,q_auto,c_fill,g_auto,w_1600,h_1000', 2400: 'f_auto,q_auto,c_fill,g_auto,w_2400,h_1300' }[w]; };
    }
    var title = g.names + ' | Galerías · The Wedding Project';
    var desc = 'Galería de ' + g.names + ', fotografiada por The Wedding Project (Fernando & Jackie).';
    var track = 'if(window.FO_Track){FO_Track.viewContent({content_name:' + JSON.stringify('Galería: ' + g.names) + '}); FO_Track.vioGaleria({content_name:' + JSON.stringify(g.slug) + '});}';
    var out = head({ title: e(title), desc: e(desc), canonical: SITE + '/galerias/' + g.slug + '/', ogimg: cimg(g, ch, 'c_fill,g_auto,w_1200,h_630,q_auto'), track: track });
    out += header('/galerias/', 'back.galleries', '← Galerías');
    var metaHtml = metaLine(g, 'es').concat([n + ' <span data-i18n="photos">fotos</span>']).join(' · ');
    out += '\n<section class="gal-hero' + heroCls + '"' + heroStyle + '>\n  <picture>\n    <source media="(orientation: portrait)"\n' +
      '            srcset="' + cimg(g, cv, 'f_auto,q_auto,c_fill,g_auto,w_800,h_1300') + ' 800w, ' + cimg(g, cv, 'f_auto,q_auto,c_fill,g_auto,w_1200,h_1950') + ' 1200w"\n' +
      '            sizes="100vw">\n' +
      '    <img src="' + cimg(g, ch, hx(1600)) + '"\n' +
      '         srcset="' + cimg(g, ch, hx(1200)) + ' 1200w, ' + cimg(g, ch, hx(1600)) + ' 1600w, ' + cimg(g, ch, hx(2400)) + ' 2400w"\n' +
      '         sizes="100vw" alt="' + e(g.names) + '" fetchpriority="high">\n  </picture>\n' +
      '  <div class="gal-hero-text">\n    <span class="gal-hero-type" data-i18n="type.' + g.type + '">' + TYPE_DEFAULT[g.type] + '</span>\n' +
      '    <h1>' + e(g.names) + '</h1>\n    <p class="gal-hero-meta">' + metaHtml + '</p>\n  </div>\n</section>\n\n<main class="gal-grid" aria-label="Fotos">\n';
    g.photos.forEach(function (p, i) {
      var pid = p[0], w = p[1], h = p[2];
      var t = function (W) { return img(pid, 'f_auto,q_auto,c_limit,w_' + W); };
      var lazy = i < 4 ? '' : ' loading="lazy"';
      out += '  <button type="button" class="gal-item" data-full="' + img(pid, 'f_auto,q_auto,c_limit,w_2000,h_2000') + '" aria-label="Ampliar foto ' + (i + 1) + '">' +
        '<img src="' + t(700) + '" srcset="' + t(400) + ' 400w, ' + t(700) + ' 700w, ' + t(1000) + ' 1000w" ' +
        'sizes="(min-width:1200px) 25vw, (min-width:768px) 33vw, 50vw" width="' + w + '" height="' + h + '" ' +
        'alt="' + e(g.names) + ' – foto ' + (i + 1) + '"' + lazy + ' decoding="async"></button>\n';
    });
    out += '</main>\n\n<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Foto ampliada">\n  <img id="lbImg" src="" alt="">\n' +
      '  <button type="button" class="lb-btn lb-close" id="lbClose" aria-label="Cerrar" data-i18n-aria="lb.close">✕</button>\n' +
      '  <button type="button" class="lb-btn lb-prev" id="lbPrev" aria-label="Anterior" data-i18n-aria="lb.prev">‹</button>\n' +
      '  <button type="button" class="lb-btn lb-next" id="lbNext" aria-label="Siguiente" data-i18n-aria="lb.next">›</button>\n' +
      '  <p class="lb-count" id="lbCount"></p>\n</div>\n\n';
    out += CTA;
    out += '<div class="g-more"><a href="/galerias/" data-i18n="more">Ver otras galerías</a></div>\n';
    out += FOOTER;
    out += langScript({
      es: { 'back.galleries': '← Galerías', more: 'Ver otras galerías', 'lb.close': 'Cerrar', 'lb.prev': 'Anterior', 'lb.next': 'Siguiente' },
      pt: { 'back.galleries': '← Galerias', more: 'Ver outras galerias', 'lb.close': 'Fechar', 'lb.prev': 'Anterior', 'lb.next': 'Próxima' },
      en: { 'back.galleries': '← Galleries', more: 'See other galleries', 'lb.close': 'Close', 'lb.prev': 'Previous', 'lb.next': 'Next' }
    });
    out += '<script src="/assets/galeria.js"></script>\n</body>\n</html>\n';
    return out;
  }

  function indexPage(galleries) {
    var track = "if(window.FO_Track){FO_Track.viewContent({content_name: 'Galerías completas'});}";
    var first = galleries[0];
    var out = head({ title: 'Galerías | The Wedding Project', desc: 'Galerías completas de bodas y pre weddings fotografiadas por The Wedding Project (Fernando & Jackie).', canonical: SITE + '/galerias/', ogimg: first ? img(first.cover_h, 'c_fill,g_auto,w_1200,h_630,q_auto') : '', track: track });
    out += header('/', 'back.home', '← Volver al inicio');
    var types = ['boda', 'prewedding'].filter(function (t) { return galleries.some(function (g) { return g.type === t; }); });
    var filtersHidden = types.length > 1 ? '' : ' hidden';
    out += '\n<section class="g-intro">\n  <div class="wrap">\n    <span class="eyebrow" data-i18n="intro.eyebrow">Galerías</span>\n' +
      '    <h1 data-i18n="intro.h1">Historias completas</h1>\n' +
      '    <p data-i18n="intro.p">Cada boda contada de principio a fin: los nervios de la previa, la ceremonia y la fiesta.</p>\n  </div>\n</section>\n\n' +
      '<main class="wrap">\n  <div class="g-filters" id="gFilters"' + filtersHidden + '>\n' +
      '    <button type="button" class="g-filter is-active" data-filter="all" data-i18n="filter.all">Todas</button>\n';
    var labels = { boda: ['filter.boda', 'Bodas'], prewedding: ['filter.prewedding', 'Pre wedding'] };
    types.forEach(function (t) { out += '    <button type="button" class="g-filter" data-filter="' + t + '" data-i18n="' + labels[t][0] + '">' + labels[t][1] + '</button>\n'; });
    out += '  </div>\n  <div class="g-cards">\n';
    galleries.forEach(function (g) {
      var meta = metaLine(g, 'es').concat([g.photos.length + ' <span data-i18n="photos">fotos</span>']);
      var c = g.cover_h;
      out += '    <a class="g-card" href="/galerias/' + g.slug + '/" data-type="' + g.type + '">\n' +
        '      <img src="' + cimg(g, c, 'f_auto,q_auto,c_fill,g_auto,w_900,h_675') + '" srcset="' + cimg(g, c, 'f_auto,q_auto,c_fill,g_auto,w_600,h_450') + ' 600w, ' + cimg(g, c, 'f_auto,q_auto,c_fill,g_auto,w_900,h_675') + ' 900w, ' + cimg(g, c, 'f_auto,q_auto,c_fill,g_auto,w_1200,h_900') + ' 1200w" sizes="(min-width:700px) 50vw, 100vw" width="900" height="675" alt="' + e(g.names) + '" loading="lazy" decoding="async">\n' +
        '      <span class="g-card-info">\n        <span class="g-card-type" data-i18n="type.' + g.type + '">' + TYPE_DEFAULT[g.type] + '</span>\n' +
        '        <span class="g-card-name">' + e(g.names) + '</span>\n        <span class="g-card-meta">' + meta.join(' · ') + '</span>\n' +
        '        <span class="g-card-cta" data-i18n="card.cta">Ver galería →</span>\n      </span>\n    </a>\n';
    });
    out += '  </div>\n</main>\n\n';
    out += CTA + FOOTER;
    out += langScript({
      es: { 'back.home': '← Volver al inicio', 'intro.eyebrow': 'Galerías', 'intro.h1': 'Historias completas', 'intro.p': 'Cada boda contada de principio a fin: los nervios de la previa, la ceremonia y la fiesta.', 'filter.all': 'Todas', 'filter.boda': 'Bodas', 'filter.prewedding': 'Pre wedding', 'card.cta': 'Ver galería →' },
      pt: { 'back.home': '← Voltar ao início', 'intro.eyebrow': 'Galerias', 'intro.h1': 'Histórias completas', 'intro.p': 'Cada casamento contado do começo ao fim: a ansiedade dos preparativos, a cerimônia e a festa.', 'filter.all': 'Todas', 'filter.boda': 'Casamentos', 'filter.prewedding': 'Pré-wedding', 'card.cta': 'Ver galeria →' },
      en: { 'back.home': '← Back to home', 'intro.eyebrow': 'Galleries', 'intro.h1': 'Full stories', 'intro.p': 'Each wedding told from start to finish: the nerves before, the ceremony and the party.', 'filter.all': 'All', 'filter.boda': 'Weddings', 'filter.prewedding': 'Pre-wedding', 'card.cta': 'View gallery →' }
    });
    out += "<script>\n(function(){\n  var btns = document.querySelectorAll('.g-filter');\n  var cards = document.querySelectorAll('.g-card');\n" +
      "  btns.forEach(function(b){\n    b.addEventListener('click', function(){\n      var f = b.getAttribute('data-filter');\n" +
      "      btns.forEach(function(x){ x.classList.toggle('is-active', x === b); });\n" +
      "      cards.forEach(function(c){ c.hidden = !(f === 'all' || c.getAttribute('data-type') === f); });\n    });\n  });\n})();\n</script>\n</body>\n</html>\n";
    return out;
  }

  // Devuelve {ruta: contenido} con todas las páginas de galerías.
  function buildAll(data) {
    var files = { 'galerias/index.html': indexPage(data.galleries) };
    data.galleries.forEach(function (g) { files['galerias/' + g.slug + '/index.html'] = galleryPage(g); });
    return files;
  }

  var api = { buildAll: buildAll, galleryPage: galleryPage, indexPage: indexPage, img: img };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GalleryGen = api;
})(this);
