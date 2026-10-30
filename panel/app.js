/* Panel de la web (CMS) — The Wedding Project
   Todo cambio queda como borrador en el navegador. "Publicar" sube TODOS los cambios
   en un solo commit a GitHub = un solo deploy en Netlify. */
(function () {
  'use strict';
  var C = window.CMS, G = window.GalleryGen, L = C.LANGS;
  var LANG_NAME = { es: 'Español', pt: 'Português', en: 'English' };
  var CL = 'https://res.cloudinary.com/drfoww3ch/image/upload/';
  var GAL_JSON = 'galerias/galerias.json';
  var STORE = 'twp-panel-draft-v1';

  var state = { pw: '', sha: '', base: {}, draft: {}, paths: [], view: 'textos', previewPath: 'index.html' };

  /* ---------- utilidades ---------- */
  function $(sel, el) { return (el || document).querySelector(sel); }
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c != null) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function autoGrow(ta) {
    var fit = function () { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 2) + 'px'; };
    ta.addEventListener('input', fit);
    requestAnimationFrame(fit);
    return ta;
  }
  function toast(msg, ms) {
    var t = h('div', { class: 'toast', role: 'status', text: msg });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 3200);
  }
  function busy(btn, on, label) {
    if (on) { btn.dataset.label = btn.textContent; btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>' + (label ? ' ' + label : ''); }
    else { btn.disabled = false; btn.textContent = btn.dataset.label || label || ''; }
  }
  function sheet(title, bodyNodes, actions) {
    var scrim = h('div', { class: 'scrim', onclick: function (e) { if (e.target === scrim) close(); } });
    function close() { scrim.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    var acts = h('div', { class: 'row', style: 'justify-content:flex-end; margin-top:18px' });
    (actions || []).forEach(function (a) {
      acts.appendChild(h('button', { class: 'btn ' + (a.kind || ''), text: a.label, onclick: function (e) { a.run(close, e.currentTarget); } }));
    });
    scrim.appendChild(h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true' }, [h('h3', { text: title })].concat(bodyNodes).concat([acts])));
    document.body.appendChild(scrim);
    var f = scrim.querySelector('input, textarea, button'); if (f) f.focus();
    return close;
  }

  /* ---------- API (funciones de Netlify) ---------- */
  function api(fn, body) {
    return fetch('/.netlify/functions/' + fn, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Cms-Password': state.pw }, body: JSON.stringify(body || {})
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var err = new Error(j.error || ('Error ' + r.status)); err.status = r.status; throw err; }
        return j;
      });
    });
  }
  function load(paths) {
    var need = paths.filter(function (p) { return !(p in state.base); });
    if (!need.length) return Promise.resolve();
    return api('cms-files', { paths: need }).then(function (r) {
      if (state.sha && r.sha !== state.sha) {
        toast('Ojo: alguien cambió la web en GitHub mientras trabajabas. Recargá el panel antes de publicar.', 6000);
      }
      Object.keys(r.files).forEach(function (p) { state.base[p] = r.files[p]; });
    });
  }
  function get(p) { return (p in state.draft) ? state.draft[p] : state.base[p]; }
  function set(p, content) {
    if (content === state.base[p]) delete state.draft[p]; else state.draft[p] = content;
    saveLocal(); refreshBar();
  }
  function saveLocal() {
    try { localStorage.setItem(STORE, JSON.stringify({ sha: state.sha, draft: state.draft })); } catch (e) {}
  }

  /* ---------- barra superior ---------- */
  function refreshBar() {
    var n = Object.keys(state.draft).length;
    $('#pending').classList.toggle('has', n > 0);
    $('#pendingText').textContent = n ? n + (n === 1 ? ' archivo con cambios' : ' archivos con cambios') : 'Sin cambios';
    $('#publishBtn').disabled = !n;
    $('#discardBtn').hidden = !n;
    $('#previewBtn').hidden = !(state.previewPath && (state.previewPath in state.draft));
  }
  $('#discardBtn').addEventListener('click', function () {
    sheet('¿Descartar todos los cambios?', [h('p', { class: 'muted', text: 'Se borran los cambios que todavía no publicaste. Lo que ya está en la web no se toca.' })], [
      { label: 'Cancelar', kind: 'secondary', run: function (c) { c(); } },
      { label: 'Descartar', kind: 'danger', run: function (c) { state.draft = {}; saveLocal(); refreshBar(); c(); render(); } }
    ]);
  });
  $('#previewBtn').addEventListener('click', function () {
    var html = get(state.previewPath);
    if (!html) return;
    var w = window.open('', '_blank');
    if (!w) { toast('El navegador bloqueó la ventana. Permití las ventanas emergentes.'); return; }
    w.document.open();
    w.document.write(html.replace(/<head>/i, '<head><base href="' + location.origin + '/' + state.previewPath.replace(/[^/]*$/, '') + '">'));
    w.document.close();
  });
  $('#publishBtn').addEventListener('click', function () {
    var paths = Object.keys(state.draft);
    var list = h('ul', {}, paths.map(function (p) { return h('li', { text: (state.draft[p] === null ? 'Borrar: ' : '') + p }); }));
    var msg = h('input', { class: 'field', value: 'Cambios desde el panel', 'aria-label': 'Descripción del cambio' });
    sheet('Publicar cambios', [
      h('p', { class: 'muted', text: 'Se suben todos juntos en un solo deploy. Netlify tarda 1 o 2 minutos en mostrarlos.' }), list,
      h('label', { class: 'lbl', text: 'Descripción (opcional)' }), msg
    ], [
      { label: 'Cancelar', kind: 'secondary', run: function (c) { c(); } },
      { label: 'Publicar', run: function (close, btn) {
        busy(btn, true, 'Publicando');
        api('cms-commit', { baseSha: state.sha, message: msg.value || 'Cambios desde el panel', files: state.draft }).then(function (r) {
          Object.keys(state.draft).forEach(function (p) { if (state.draft[p] === null) delete state.base[p]; else state.base[p] = state.draft[p]; });
          state.draft = {}; state.sha = r.sha; saveLocal(); refreshBar(); close();
          toast('Publicado. En 1 o 2 minutos se ve en la web.', 5000);
          render();
        }).catch(function (e) { busy(btn, false, 'Publicar'); toast(e.message, 7000); });
      } }
    ]);
  });

  /* ---------- navegación ---------- */
  var TITLES = { textos: 'Textos', precios: 'Precios', faq: 'Preguntas frecuentes', galerias: 'Galerías', blog: 'Blog' };
  document.querySelectorAll('.nav-item').forEach(function (b) {
    b.addEventListener('click', function () { go(b.getAttribute('data-view')); });
  });
  function go(view, opts) {
    state.view = view; state.opts = opts || {};
    document.querySelectorAll('.nav-item').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-view') === view); });
    $('#viewTitle').textContent = TITLES[view];
    render();
  }
  function render() {
    var v = $('#view');
    v.innerHTML = '';
    v.appendChild(h('div', { class: 'loading', text: 'Cargando…' }));
    var fn = { textos: viewTextos, precios: viewPrecios, faq: viewFaq, galerias: viewGalerias, blog: viewBlog }[state.view];
    Promise.resolve().then(function () { return fn(v); }).catch(function (e) {
      v.innerHTML = ''; v.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'No se pudo cargar' }), h('p', { class: 'muted', text: e.message })]));
    });
    refreshBar();
  }

  /* ---------- 1. Textos ---------- */
  var GROUP_NAMES = {
    hero: 'Portada', vsl: 'Video', problema: 'El problema', proceso: 'Cómo trabajamos', promesa: 'Lo que está en juego',
    portafolio: 'Portafolio', sobre: 'Sobre nosotros', paquetes: 'Paquetes', pkg: 'Paquetes (detalle)', extras: 'Álbumes',
    analog: 'Fotos analógicas', payment: 'Métodos de pago', budget: 'Presupuesto', faq: 'Preguntas frecuentes',
    cta: 'Contacto', form: 'Formulario', footer: 'Pie de página', more: 'Botones Ver más', wa: 'Mensaje de WhatsApp',
    custom: 'Paquete personalizado', lang: 'Idioma', nav: 'Menú', post: 'Artículo', h2: 'Subtítulos', p: 'Párrafos', li: 'Listas'
  };
  function pageLabel(p) {
    var names = { 'index.html': 'Página principal', 'blog/index.html': 'Blog (listado)', 'recursos/index.html': 'Recursos', 'privacidad.html': 'Política de privacidad', '404.html': 'Página no encontrada' };
    if (names[p]) return names[p];
    if (/^blog\//.test(p)) return 'Blog: ' + p.replace('blog/', '').replace('.html', '').replace(/-/g, ' ');
    if (/^gracias\//.test(p)) return 'Gracias: ' + p.split('/')[1];
    return p;
  }
  function textPages() {
    return state.paths.filter(function (p) {
      return /\.html$/.test(p) && !/^(panel|galerias|netlify|assets)\//.test(p) && !/^gracias-/.test(p);
    }).sort(function (a, b) { return a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b); });
  }
  function viewTextos(v) {
    var page = state.opts.page || state.textPage || 'index.html';
    state.textPage = page; state.previewPath = page;
    return load([page]).then(function () {
      v.innerHTML = '';
      var content = get(page);
      var d = content && C.findDict(content);
      var sel = h('select', { class: 'field', style: 'max-width:340px', 'aria-label': 'Página', onchange: function () { state.opts = { page: sel.value }; render(); } },
        textPages().map(function (p) { var o = h('option', { value: p, text: pageLabel(p) }); if (p === page) o.selected = true; return o; }));
      var search = h('input', { class: 'field grow', placeholder: 'Buscar texto o clave…', type: 'search', oninput: filter });
      v.appendChild(h('div', { class: 'card' }, [
        h('div', { class: 'row' }, [sel, search]),
        h('p', { class: 'tiny', style: 'margin-top:8px', text: 'Cambiá el texto en los tres idiomas. Los cambios quedan en borrador hasta que toques Publicar.' })
      ]));
      if (!d) { v.appendChild(h('div', { class: 'card' }, [h('p', { class: 'muted', text: 'Esta página no tiene textos editables por idioma.' })])); return; }
      var base = state.base[page] && C.findDict(state.base[page]);
      var keys = Object.keys(d.obj.es);
      var groups = {};
      keys.forEach(function (k) { var g = k.split('.')[0]; (groups[g] = groups[g] || []).push(k); });
      var wrap = h('div', { class: 'card' });
      var timers = {};
      Object.keys(groups).forEach(function (g) {
        wrap.appendChild(h('div', { class: 'group-title', 'data-group': g, text: (page === 'index.html' || GROUP_NAMES[g] ? (GROUP_NAMES[g] || g) : g) }));
        groups[g].forEach(function (k) {
          var block = h('div', { class: 'key-block', 'data-key': k });
          var changed = base && L.some(function (l) { return (base.obj[l] || {})[k] !== (d.obj[l] || {})[k]; });
          if (changed) block.classList.add('is-changed');
          block.appendChild(h('div', { class: 'key-name', text: k }));
          var row = h('div', { class: 'grid3' });
          L.forEach(function (l) {
            var val = (d.obj[l] || {})[k] || '';
            var ta = h('textarea', { class: 'field', rows: Math.min(6, Math.max(1, Math.ceil(val.length / 48))), 'aria-label': k + ' ' + LANG_NAME[l] });
            ta.value = val;
            autoGrow(ta);
            ta.addEventListener('input', function () {
              clearTimeout(timers[k + l]);
              timers[k + l] = setTimeout(function () {
                var ch = {}; ch[k] = {}; ch[k][l] = ta.value;
                set(page, C.applyTexts(get(page), ch));
                block.classList.add('is-changed');
              }, 350);
            });
            row.appendChild(h('div', {}, [h('span', { class: 'lang-tag', text: l.toUpperCase() }), ta]));
          });
          block.appendChild(row);
          wrap.appendChild(block);
        });
      });
      v.appendChild(wrap);
      function filter() {
        var qv = search.value.toLowerCase().trim();
        wrap.querySelectorAll('.key-block').forEach(function (b) {
          var k = b.getAttribute('data-key');
          var hit = !qv || k.toLowerCase().indexOf(qv) >= 0 || Array.prototype.some.call(b.querySelectorAll('textarea'), function (t) { return t.value.toLowerCase().indexOf(qv) >= 0; });
          b.hidden = !hit;
        });
        wrap.querySelectorAll('.group-title').forEach(function (t) {
          var g = t.getAttribute('data-group');
          t.hidden = !Array.prototype.some.call(wrap.querySelectorAll('.key-block'), function (b) { return !b.hidden && b.getAttribute('data-key').split('.')[0] === g; });
        });
      }
    });
  }

  /* ---------- 2. Precios ---------- */
  function viewPrecios(v) {
    state.previewPath = 'index.html';
    return load(['index.html']).then(function () {
      v.innerHTML = '';
      var list = C.readPrices(get('index.html'));
      var card = h('div', { class: 'card' }, [
        h('h3', { text: 'Precios' }),
        h('p', { class: 'muted', style: 'margin-bottom:10px', text: 'Poné el precio con Pix y con tarjeta. Las cuotas (6x), lo que se ahorra con Pix y los descuentos de los álbumes se recalculan solos en los tres idiomas.' })
      ]);
      var rows = h('div');
      list.forEach(function (p) {
        var calc = h('div', { class: 'p-calc tiny' });
        var pix = h('input', { class: 'field', type: 'number', min: '1', step: '1', value: p.pix, 'aria-label': p.label + ' Pix' });
        var cardIn = h('input', { class: 'field', type: 'number', min: '1', step: '1', value: p.card, 'aria-label': p.label + ' tarjeta' });
        function upd() {
          var a = +pix.value, b = +cardIn.value;
          calc.textContent = (b > 0 ? '6x de R$ ' + C.fmt(b / 6, 'es') : '') + (a > 0 && b > 0 ? ' · con Pix ahorra R$ ' + C.fmt(b - a, 'es') : '');
          p.pix = a; p.card = b;
        }
        pix.addEventListener('input', upd); cardIn.addEventListener('input', upd); upd();
        rows.appendChild(h('div', { class: 'price-row' }, [
          h('div', { class: 'p-name' }, [h('b', { text: p.label })]),
          h('div', {}, [h('label', { class: 'lbl', text: 'Pix' }), h('div', { class: 'money' }, [h('span', { text: 'R$' }), pix])]),
          h('div', {}, [h('label', { class: 'lbl', text: 'Tarjeta' }), h('div', { class: 'money' }, [h('span', { text: 'R$' }), cardIn])]),
          calc
        ]));
      });
      card.appendChild(rows);
      var apply = h('button', { class: 'btn', text: 'Guardar en borrador', onclick: function () {
        try { set('index.html', C.applyPrices(get('index.html'), list)); toast('Precios guardados en borrador. Tocá Publicar cuando termines.'); }
        catch (e) { toast(e.message, 5000); }
      } });
      card.appendChild(h('div', { class: 'row', style: 'margin-top:14px' }, [apply, h('span', { class: 'tiny', text: 'Lo que incluye cada paquete se cambia en Textos → Paquetes (detalle).' })]));
      v.appendChild(card);
    });
  }

  /* ---------- 3. Preguntas frecuentes ---------- */
  function viewFaq(v) {
    state.previewPath = 'index.html';
    return load(['index.html']).then(function () {
      v.innerHTML = '';
      var list = C.readFaq(get('index.html'));
      var intro = h('div', { class: 'card' }, [
        h('h3', { text: 'Chat de preguntas frecuentes' }),
        h('p', { class: 'muted', text: 'Cada pregunta llega como un mensaje de WhatsApp y abajo aparece tu respuesta. El orden de la lista es el orden del chat.' })
      ]);
      v.appendChild(intro);
      var box = h('div');
      v.appendChild(box);
      function draw() {
        box.innerHTML = '';
        list.forEach(function (it, i) {
          var item = h('div', { class: 'item' });
          item.appendChild(h('div', { class: 'item-head' }, [
            h('b', { text: 'Pregunta ' + (i + 1) }),
            h('button', { class: 'icon-btn', 'aria-label': 'Subir', disabled: i === 0, text: '↑', onclick: function () { list.splice(i - 1, 0, list.splice(i, 1)[0]); draw(); } }),
            h('button', { class: 'icon-btn', 'aria-label': 'Bajar', disabled: i === list.length - 1, text: '↓', onclick: function () { list.splice(i + 1, 0, list.splice(i, 1)[0]); draw(); } }),
            h('button', { class: 'icon-btn', 'aria-label': 'Borrar', text: '✕', onclick: function () { list.splice(i, 1); draw(); } })
          ]));
          ['q', 'a'].forEach(function (f) {
            item.appendChild(h('label', { class: 'lbl', text: f === 'q' ? 'Pregunta (lo que escribe la pareja)' : 'Respuesta (lo que contestan ustedes)' }));
            var row = h('div', { class: 'grid3', style: 'margin-bottom:10px' });
            L.forEach(function (l) {
              var ta = h('textarea', { class: 'field', rows: f === 'q' ? 2 : 4, 'aria-label': (f === 'q' ? 'Pregunta ' : 'Respuesta ') + LANG_NAME[l] });
              ta.value = it[f][l] || '';
              ta.addEventListener('input', function () { it[f][l] = ta.value; });
              row.appendChild(h('div', {}, [h('span', { class: 'lang-tag', text: l.toUpperCase() }), ta]));
            });
            item.appendChild(row);
          });
          box.appendChild(item);
        });
      }
      draw();
      v.appendChild(h('div', { class: 'row' }, [
        h('button', { class: 'btn secondary', text: '+ Agregar pregunta', onclick: function () { list.push({ q: { es: '', pt: '', en: '' }, a: { es: '', pt: '', en: '' } }); draw(); } }),
        h('button', { class: 'btn', text: 'Guardar en borrador', onclick: function () {
          var bad = list.some(function (it) { return !it.q.es.trim() || !it.a.es.trim(); });
          if (bad) { toast('Cada pregunta necesita al menos la pregunta y la respuesta en español.', 5000); return; }
          try { set('index.html', C.writeFaq(get('index.html'), list)); toast('Preguntas guardadas en borrador. Tocá Publicar cuando termines.'); }
          catch (e) { toast(e.message, 5000); }
        } })
      ]));
    });
  }

  /* ---------- 4. Galerías ---------- */
  function galData() { return JSON.parse(get(GAL_JSON)); }
  function saveGalleries(data, removedSlug) {
    var json = JSON.stringify(data, null, 1);
    set(GAL_JSON, json);
    var files = G.buildAll(data);
    Object.keys(files).forEach(function (p) { set(p, files[p]); });
    if (removedSlug) set('galerias/' + removedSlug + '/index.html', null);
    state.previewPath = 'galerias/index.html';
    refreshBar();
  }
  function loadGalleryFiles() {
    return load([GAL_JSON]).then(function () {
      var data = galData();
      return load(['galerias/index.html'].concat(data.galleries.map(function (g) { return 'galerias/' + g.slug + '/index.html'; })));
    });
  }
  function thumb(pid, w) { return CL + 'f_auto,q_auto,c_fill,g_auto,w_' + (w || 240) + ',h_' + (w || 240) + '/' + pid + '.jpg'; }
  function numOf(pid) { var m = /(\d+)(?=[^0-9]*_[a-z0-9]{6}$)/i.exec(pid) || /(\d+)/.exec(pid); return m ? +m[1] : 0; }
  function sortByName(photos) {
    return photos.slice().sort(function (a, b) { return numOf(a[0]) - numOf(b[0]) || a[0].localeCompare(b[0]); });
  }

  function viewGalerias(v) {
    state.previewPath = 'galerias/index.html';
    return loadGalleryFiles().then(function () {
      if (state.opts.slug) return editGallery(v, state.opts.slug);
      v.innerHTML = '';
      var data = galData();
      v.appendChild(h('div', { class: 'card' }, [h('h3', { text: 'Galerías' }), h('p', { class: 'muted', text: 'Tocá una galería para cambiar portadas, orden de fotos o datos. El orden de esta lista es el orden en la web.' })]));
      var list = h('div', { class: 'gal-list' });
      data.galleries.forEach(function (g, i) {
        var c = h('div', {});
        var cardBtn = h('button', { class: 'gal-card', onclick: function () { go('galerias', { slug: g.slug }); } }, [
          h('img', { src: thumb(g.cover_h, 480).replace('h_480', 'h_360'), alt: '' }),
          h('div', {}, [h('b', { text: g.names }), h('span', { class: 'tiny', text: (g.type === 'boda' ? 'Boda' : 'Pre wedding') + ' · ' + g.photos.length + ' fotos' })])
        ]);
        c.appendChild(cardBtn);
        c.appendChild(h('div', { class: 'row', style: 'justify-content:center; margin-top:6px' }, [
          h('button', { class: 'icon-btn', 'aria-label': 'Mover antes', disabled: i === 0, text: '←', onclick: function () { data.galleries.splice(i - 1, 0, data.galleries.splice(i, 1)[0]); saveGalleries(data); render(); } }),
          h('button', { class: 'icon-btn', 'aria-label': 'Mover después', disabled: i === data.galleries.length - 1, text: '→', onclick: function () { data.galleries.splice(i + 1, 0, data.galleries.splice(i, 1)[0]); saveGalleries(data); render(); } })
        ]));
        list.appendChild(c);
      });
      list.appendChild(h('button', { class: 'gal-card gal-new', onclick: newGallery }, [h('span', { style: 'font-size:1.8rem', text: '+' }), 'Nueva galería']));
      v.appendChild(list);
    });
  }

  function newGallery() {
    var body = h('div', {}, [h('p', { class: 'muted', text: 'Buscando carpetas en Cloudinary…' })]);
    var close = sheet('Nueva galería', [body], [{ label: 'Cancelar', kind: 'secondary', run: function (c) { c(); } }]);
    api('cms-cloudinary', { action: 'folders', path: 'Landing Page/08 Galerias' }).then(function (r) {
      var used = galData().galleries.map(function (g) { return g.folder; });
      body.innerHTML = '';
      body.appendChild(h('p', { class: 'muted', style: 'margin-bottom:10px', text: 'Elegí la carpeta de Cloudinary (dentro de Landing Page / 08 Galerias) con las fotos de la pareja.' }));
      r.folders.forEach(function (f) {
        var isUsed = used.indexOf(f.path) >= 0;
        body.appendChild(h('button', { class: 'btn secondary', style: 'display:flex; width:100%; justify-content:space-between; margin-bottom:8px', disabled: isUsed, onclick: function (e) {
          busy(e.currentTarget, true, 'Cargando fotos');
          api('cms-cloudinary', { action: 'photos', folder: f.path }).then(function (pr) {
            if (!pr.photos.length) { toast('Esa carpeta no tiene fotos.'); busy(e.currentTarget, false, f.name); return; }
            var name = f.name.replace(/^(casamento( na praia| no campo)?|pre[ -]?wedding|pr[eé]-wedding|boda|ensaio)\s+/i, '').replace(/\s+(e|y|and)\s+/i, ' & ');
            var type = /pre[ -]?wedding|pr[eé]-wedding|ensaio/i.test(f.name) ? 'prewedding' : 'boda';
            var data = galData();
            var slug = C.slugify(name) + (type === 'prewedding' ? '-pre-wedding' : '');
            while (data.galleries.some(function (g) { return g.slug === slug; })) slug += '-2';
            var photos = sortByName(pr.photos);
            var land = photos.filter(function (p) { return p[1] > p[2]; });
            var port = photos.filter(function (p) { return p[2] >= p[1]; });
            var g = { slug: slug, names: name, type: type, place: '', date_es: '', date_pt: '', date_en: '', folder: f.path,
              cover_h: (land[Math.floor(land.length / 2)] || photos[0])[0], cover_v: (port[Math.floor(port.length / 2)] || photos[0])[0],
              gravity: 'g_auto', hero_crop: false, order: 'name', photos: photos };
            data.galleries.unshift(g);
            saveGalleries(data);
            close();
            toast('Galería creada en borrador. Elegí las portadas y revisá los datos.');
            go('galerias', { slug: slug });
          }).catch(function (err) { toast(err.message, 6000); busy(e.currentTarget, false, f.name); });
        } }, [h('span', { text: f.name }), h('span', { class: 'tiny', text: isUsed ? 'ya es galería' : '' })]));
      });
    }).catch(function (e) { body.innerHTML = ''; body.appendChild(h('p', { class: 'error', text: e.message })); });
  }

  function editGallery(v, slug) {
    var data = galData();
    var g = data.galleries.filter(function (x) { return x.slug === slug; })[0];
    v.innerHTML = '';
    if (!g) { go('galerias'); return; }
    state.previewPath = 'galerias/' + g.slug + '/index.html';
    refreshBar();
    function commit() { saveGalleries(data); state.previewPath = 'galerias/' + g.slug + '/index.html'; refreshBar(); }

    v.appendChild(h('div', { class: 'row', style: 'margin-bottom:12px' }, [
      h('button', { class: 'btn ghost', text: '← Todas las galerías', onclick: function () { go('galerias'); } }),
      h('span', { class: 'grow' }),
      h('a', { class: 'btn secondary small', href: '/galerias/' + g.slug + '/', target: '_blank', rel: 'noopener', text: 'Ver publicada ↗' })
    ]));

    // Datos
    function input(label, key, ph) {
      var i = h('input', { class: 'field', value: g[key] || '', placeholder: ph || '' });
      i.addEventListener('change', function () { g[key] = i.value.trim(); commit(); });
      return h('div', {}, [h('label', { class: 'lbl', text: label }), i]);
    }
    var typeSel = h('select', { class: 'field', onchange: function () { g.type = typeSel.value; commit(); } }, [
      h('option', { value: 'boda', text: 'Boda' }), h('option', { value: 'prewedding', text: 'Pre wedding' })]);
    typeSel.value = g.type;
    v.appendChild(h('div', { class: 'card' }, [
      h('h3', { text: 'Datos' }),
      h('div', { class: 'grid2', style: 'margin-top:10px' }, [input('Nombres de la pareja', 'names', 'Ana & Lucas'), h('div', {}, [h('label', { class: 'lbl', text: 'Tipo' }), typeSel])]),
      h('div', { class: 'grid2', style: 'margin-top:10px' }, [input('Lugar (opcional)', 'place', 'Balneário Camboriú'), input('Fecha en español (opcional)', 'date_es', 'Marzo 2026')]),
      h('div', { class: 'grid2', style: 'margin-top:10px' }, [input('Fecha en portugués', 'date_pt', 'Março de 2026'), input('Fecha en inglés', 'date_en', 'March 2026')]),
      h('p', { class: 'tiny', style: 'margin-top:8px', text: 'Dirección: /galerias/' + g.slug + '/' })
    ]));

    // Portadas
    var prev = h('div', { class: 'cover-prev' });
    function drawPrev() {
      prev.innerHTML = '';
      var grav = g.gravity || 'g_auto';
      prev.appendChild(h('figure', {}, [h('img', { src: CL + 'f_auto,q_auto,c_fill,' + grav + ',w_640,h_480/' + g.cover_h + '.jpg', alt: '', style: 'aspect-ratio:4/3' }), h('figcaption', { text: 'Horizontal (computadora y listado de galerías)' })]));
      prev.appendChild(h('figure', {}, [h('img', { src: CL + 'f_auto,q_auto,c_fill,' + grav + ',w_320,h_520/' + g.cover_v + '.jpg', alt: '', style: 'aspect-ratio:8/13' }), h('figcaption', { text: 'Vertical (celular)' })]));
    }
    drawPrev();
    var gravSel = h('select', { class: 'field', onchange: function () { g.gravity = gravSel.value; commit(); drawPrev(); } }, [
      h('option', { value: 'g_auto', text: 'Automático' }), h('option', { value: 'g_center', text: 'Centrado' }), h('option', { value: 'g_faces', text: 'Seguir las caras' })]);
    gravSel.value = g.gravity || 'g_auto';
    var cropSel = h('select', { class: 'field', onchange: function () { g.hero_crop = cropSel.value === '1'; commit(); } }, [
      h('option', { value: '0', text: 'Mostrar la foto completa' }), h('option', { value: '1', text: 'Recortar a lo ancho' })]);
    cropSel.value = g.hero_crop ? '1' : '0';
    v.appendChild(h('div', { class: 'card' }, [
      h('h3', { text: 'Portadas' }),
      h('p', { class: 'muted', text: 'Para cambiarlas, tocá una foto de la lista de abajo y elegí "Portada horizontal" o "Portada vertical".' }),
      prev,
      h('div', { class: 'grid2', style: 'margin-top:12px' }, [
        h('div', {}, [h('label', { class: 'lbl', text: 'Encuadre de la portada' }), gravSel]),
        h('div', {}, [h('label', { class: 'lbl', text: 'Portada horizontal dentro de la galería' }), cropSel])
      ])
    ]));

    // Fotos
    var grid = h('div', { class: 'thumbs' });
    var orderSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Orden' });
    ['name', 'custom'].forEach(function (o) {
      orderSeg.appendChild(h('button', { class: g.order === o ? 'is-on' : '', text: o === 'name' ? 'Por nombre' : 'Manual (arrastrar)', onclick: function () {
        g.order = o;
        if (o === 'name') g.photos = sortByName(g.photos);
        commit(); editGallery(v, slug);
      } }));
    });
    var reload = h('button', { class: 'btn secondary small', text: 'Actualizar desde Cloudinary', onclick: function (e) {
      if (!g.folder) { toast('Esta galería no tiene carpeta de Cloudinary asociada.'); return; }
      var btn = e.currentTarget; busy(btn, true);
      api('cms-cloudinary', { action: 'photos', folder: g.folder }).then(function (r) {
        var before = g.photos.length;
        var have = {}; r.photos.forEach(function (p) { have[p[0]] = p; });
        var kept = g.photos.filter(function (p) { return have[p[0]]; }).map(function (p) { return have[p[0]]; });
        var keptIds = kept.map(function (p) { return p[0]; });
        var added = r.photos.filter(function (p) { return keptIds.indexOf(p[0]) < 0; });
        g.photos = g.order === 'name' ? sortByName(kept.concat(added)) : kept.concat(sortByName(added));
        if (!have[g.cover_h]) g.cover_h = g.photos[0][0];
        if (!have[g.cover_v]) g.cover_v = g.photos[0][0];
        var removed = before - kept.length;
        commit(); toast('Listo: ' + added.length + ' fotos nuevas y ' + removed + ' quitadas.');
        editGallery(v, slug);
      }).catch(function (err) { busy(btn, false, 'Actualizar desde Cloudinary'); toast(err.message, 6000); });
    } });
    v.appendChild(h('div', { class: 'card' }, [
      h('div', { class: 'row' }, [h('h3', { class: 'grow', text: 'Fotos (' + g.photos.length + ')' }), orderSeg, reload]),
      h('p', { class: 'tiny', style: 'margin-top:6px', text: g.order === 'custom' ? 'Arrastrá las fotos para cambiar el orden. Tocá una foto para elegirla como portada o quitarla.' : 'Ordenadas por número de archivo, de menor a mayor. Tocá una foto para elegirla como portada o quitarla.' }),
      grid
    ]));
    var dragFrom = -1;
    g.photos.forEach(function (p, i) {
      var badges = h('span', { class: 'badges' });
      if (p[0] === g.cover_h) badges.appendChild(h('i', { text: 'H' }));
      if (p[0] === g.cover_v) badges.appendChild(h('i', { text: 'V' }));
      var t = h('button', { class: 'thumb', draggable: g.order === 'custom' ? 'true' : 'false', 'aria-label': 'Foto ' + (i + 1) }, [h('img', { src: thumb(p[0], 200), loading: 'lazy', alt: '' }), badges, h('span', { class: 'num', text: String(i + 1) })]);
      t.addEventListener('click', function (e) { photoMenu(e, p, i); });
      if (g.order === 'custom') {
        t.addEventListener('dragstart', function (e) { dragFrom = i; t.classList.add('is-drag'); e.dataTransfer.effectAllowed = 'move'; });
        t.addEventListener('dragend', function () { t.classList.remove('is-drag'); });
        t.addEventListener('dragover', function (e) { e.preventDefault(); t.classList.add('is-over'); });
        t.addEventListener('dragleave', function () { t.classList.remove('is-over'); });
        t.addEventListener('drop', function (e) {
          e.preventDefault(); t.classList.remove('is-over');
          if (dragFrom < 0 || dragFrom === i) return;
          g.photos.splice(i, 0, g.photos.splice(dragFrom, 1)[0]);
          dragFrom = -1; commit(); editGallery(v, slug);
        });
      }
      grid.appendChild(t);
    });
    function photoMenu(e, p, i) {
      document.querySelectorAll('.thumb-menu').forEach(function (m) { m.remove(); });
      var r = e.currentTarget.getBoundingClientRect();
      var menu = h('div', { class: 'thumb-menu', role: 'menu' }, [
        h('button', { role: 'menuitem', text: 'Portada horizontal', onclick: function () { g.cover_h = p[0]; done(); } }),
        h('button', { role: 'menuitem', text: 'Portada vertical (celular)', onclick: function () { g.cover_v = p[0]; done(); } }),
        h('button', { role: 'menuitem', text: 'Ver en grande ↗', onclick: function () { window.open(CL + 'f_auto,q_auto,c_limit,w_1600/' + p[0] + '.jpg', '_blank'); menu.remove(); } }),
        h('button', { role: 'menuitem', class: 'del', text: 'Quitar de la galería', onclick: function () {
          if (g.photos.length <= 1) { toast('La galería necesita al menos una foto.'); return; }
          g.photos.splice(i, 1);
          if (g.cover_h === p[0]) g.cover_h = g.photos[0][0];
          if (g.cover_v === p[0]) g.cover_v = g.photos[0][0];
          done();
        } })
      ]);
      function done() { menu.remove(); commit(); editGallery(v, slug); }
      menu.style.left = Math.min(r.left, window.innerWidth - 230) + 'px';
      menu.style.top = Math.min(r.bottom + 6, window.innerHeight - 200) + 'px';
      document.body.appendChild(menu);
      setTimeout(function () {
        document.addEventListener('click', function off(ev) { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', off); } });
      }, 0);
    }

    v.appendChild(h('div', { class: 'card' }, [
      h('h3', { text: 'Borrar galería' }),
      h('p', { class: 'muted', style: 'margin-bottom:10px', text: 'Se saca de la web al publicar. Las fotos siguen en Cloudinary.' }),
      h('button', { class: 'btn danger', text: 'Borrar esta galería', onclick: function () {
        sheet('¿Borrar la galería de ' + g.names + '?', [h('p', { class: 'muted', text: 'Deja de verse en la web cuando publiques. Las fotos no se borran de Cloudinary.' })], [
          { label: 'Cancelar', kind: 'secondary', run: function (c) { c(); } },
          { label: 'Borrar', kind: 'danger', run: function (c) {
            data.galleries = data.galleries.filter(function (x) { return x.slug !== g.slug; });
            saveGalleries(data, g.slug); c(); go('galerias');
          } }
        ]);
      } })
    ]));
  }

  /* ---------- 5. Blog ---------- */
  function viewBlog(v) {
    state.previewPath = 'blog/index.html';
    return load(['blog/index.html', 'sitemap.xml']).then(function () {
      if (state.opts.newPost) return newPostForm(v);
      v.innerHTML = '';
      var posts = C.readPosts(get('blog/index.html'));
      v.appendChild(h('div', { class: 'card' }, [
        h('div', { class: 'row' }, [h('h3', { class: 'grow', text: 'Artículos (' + posts.length + ')' }), h('button', { class: 'btn', text: '+ Nuevo artículo', onclick: function () { go('blog', { newPost: true }); } })]),
        h('p', { class: 'muted', text: 'Para corregir el texto de un artículo, tocá "Editar textos".' })
      ]));
      posts.forEach(function (p) {
        var path = 'blog/' + p.slug + '.html';
        v.appendChild(h('div', { class: 'card' }, [
          h('span', { class: 'tiny', text: p.date.es }),
          h('h3', { text: p.title.es }),
          h('p', { class: 'muted', style: 'margin-bottom:12px', text: p.excerpt.es }),
          h('div', { class: 'row' }, [
            h('button', { class: 'btn secondary small', text: 'Editar textos', onclick: function () { go('textos', { page: path }); } }),
            h('a', { class: 'btn ghost small', href: '/blog/' + p.slug, target: '_blank', rel: 'noopener', text: 'Ver ↗' }),
            h('span', { class: 'grow' }),
            h('button', { class: 'btn danger small', text: 'Borrar', onclick: function () {
              sheet('¿Borrar "' + p.title.es + '"?', [h('p', { class: 'muted', text: 'Se saca del blog y del mapa del sitio al publicar.' })], [
                { label: 'Cancelar', kind: 'secondary', run: function (c) { c(); } },
                { label: 'Borrar', kind: 'danger', run: function (c) {
                  set('blog/index.html', C.removePostCard(get('blog/index.html'), p.slug));
                  set('sitemap.xml', C.sitemapRemove(get('sitemap.xml'), path));
                  set(path, null); c(); render();
                } }
              ]);
            } })
          ])
        ]));
      });
    });
  }

  function newPostForm(v) {
    var tplPath = state.paths.filter(function (p) { return /^blog\/.+\.html$/.test(p) && p !== 'blog/index.html' && get(p) !== null; })[0];
    return load([tplPath]).then(function () {
      v.innerHTML = '';
      var lang = 'es';
      var post = { slug: '', image: '', date: {}, title: {}, excerpt: {}, crumb: {}, imgAlt: {}, sections: [{ h2: { es: '', pt: '', en: '' }, p: { es: '', pt: '', en: '' } }] };
      var now = new Date();
      var MONTHS = { es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
      L.forEach(function (l) { post.date[l] = MONTHS[l][now.getMonth()] + (l === 'pt' ? ' de ' : ' ') + now.getFullYear(); });

      v.appendChild(h('button', { class: 'btn ghost', style: 'margin-bottom:10px', text: '← Volver al blog', onclick: function () { go('blog'); } }));
      var seg = h('div', { class: 'seg' });
      var form = h('div');
      L.forEach(function (l) { seg.appendChild(h('button', { class: l === lang ? 'is-on' : '', text: LANG_NAME[l], onclick: function () { lang = l; seg.querySelectorAll('button').forEach(function (b, i) { b.classList.toggle('is-on', L[i] === l); }); draw(); } })); });
      var img = h('input', { class: 'field', placeholder: 'https://res.cloudinary.com/drfoww3ch/image/upload/…/foto.jpg' });
      v.appendChild(h('div', { class: 'card' }, [
        h('h3', { text: 'Nuevo artículo' }),
        h('p', { class: 'muted', style: 'margin-bottom:12px', text: 'Escribilo en español y después completá portugués e inglés con las pestañas. Si dejás un idioma vacío, se usa el español.' }),
        h('label', { class: 'lbl', text: 'Foto principal (enlace de Cloudinary)' }), img,
        h('div', { style: 'margin-top:14px' }, [seg])
      ]));
      v.appendChild(form);
      function fld(label, obj, key, rows, ph) {
        var el = rows ? h('textarea', { class: 'field', rows: rows, placeholder: ph || '' }) : h('input', { class: 'field', placeholder: ph || '' });
        el.value = obj[key] || '';
        el.addEventListener('input', function () { obj[key] = el.value; });
        return h('div', { style: 'margin-bottom:10px' }, [h('label', { class: 'lbl', text: label }), el]);
      }
      function draw() {
        form.innerHTML = '';
        var c = h('div', { class: 'card' }, [
          fld('Título', post.title, lang, 0, '¿Cuánto cuesta…?'),
          fld('Resumen (aparece en el listado y en Google)', post.excerpt, lang, 2),
          h('div', { class: 'grid2' }, [fld('Fecha que se muestra', post.date, lang), fld('Nombre corto (miga de pan)', post.crumb, lang, 0, 'Cuánto cuesta un fotógrafo')]),
          fld('Descripción de la foto (para accesibilidad)', post.imgAlt, lang, 0)
        ]);
        form.appendChild(c);
        post.sections.forEach(function (s, i) {
          var item = h('div', { class: 'card' }, [
            h('div', { class: 'item-head' }, [h('b', { text: i === 0 ? 'Introducción y secciones' : 'Sección ' + (i + 1) }),
              h('button', { class: 'icon-btn', 'aria-label': 'Borrar sección', disabled: post.sections.length === 1, text: '✕', onclick: function () { post.sections.splice(i, 1); draw(); } })]),
            fld('Subtítulo (opcional en la primera)', s.h2, lang),
            fld('Texto (dejá una línea en blanco entre párrafos)', s.p, lang, 7)
          ]);
          form.appendChild(item);
        });
        form.appendChild(h('div', { class: 'row' }, [
          h('button', { class: 'btn secondary', text: '+ Agregar sección', onclick: function () { post.sections.push({ h2: { es: '', pt: '', en: '' }, p: { es: '', pt: '', en: '' } }); draw(); } }),
          h('button', { class: 'btn', text: 'Crear artículo en borrador', onclick: create })
        ]));
      }
      function create() {
        if (!post.title.es || !post.excerpt.es || !post.sections[0].p.es) { toast('Completá al menos el título, el resumen y el primer texto en español.', 5000); return; }
        var url = img.value.trim();
        if (!/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url)) { toast('Pegá el enlace de la foto principal de Cloudinary (empieza con https://res.cloudinary.com/…).', 6000); return; }
        L.forEach(function (l) {
          ['title', 'excerpt', 'date', 'crumb', 'imgAlt'].forEach(function (f) { if (!post[f][l]) post[f][l] = post[f].es || (f === 'crumb' ? post.title[l] || post.title.es : f === 'imgAlt' ? post.title[l] || post.title.es : ''); });
        });
        var slug = C.slugify(post.title.es);
        if (state.paths.indexOf('blog/' + slug + '.html') >= 0 || get('blog/' + slug + '.html')) slug += '-2';
        var full = { slug: slug, isoDate: new Date().toISOString().slice(0, 10), image: url, date: post.date, title: post.title, excerpt: post.excerpt, crumb: post.crumb, imgAlt: post.imgAlt, sections: post.sections };
        try {
          var html = C.buildPost(get(tplPath), full);
          set('blog/' + slug + '.html', html);
          set('blog/index.html', C.addPostCard(get('blog/index.html'), full));
          set('sitemap.xml', C.sitemapAdd(get('sitemap.xml'), 'blog/' + slug + '.html', full.isoDate));
          if (state.paths.indexOf('blog/' + slug + '.html') < 0) state.paths.push('blog/' + slug + '.html');
          state.previewPath = 'blog/' + slug + '.html'; refreshBar();
          toast('Artículo creado en borrador. Revisalo con Vista previa y después Publicar.', 5000);
          go('blog');
        } catch (e) { toast(e.message, 6000); }
      }
      draw();
    });
  }

  /* ---------- ingreso ---------- */
  function start(pw, btn) {
    state.pw = pw;
    if (btn) busy(btn, true, 'Entrando');
    return api('cms-files', { tree: true }).then(function (r) {
      state.sha = r.sha; state.paths = r.paths;
      try { sessionStorage.setItem('twp-panel-pw', pw); } catch (e) {}
      try {
        var saved = JSON.parse(localStorage.getItem(STORE) || 'null');
        if (saved && saved.draft && Object.keys(saved.draft).length) {
          if (saved.sha === r.sha) { state.draft = saved.draft; toast('Recuperé los cambios que tenías sin publicar.'); }
          else toast('Había cambios sin publicar de una versión anterior de la web; los descarté para no pisar nada.', 6000);
        }
      } catch (e) {}
      $('#login').hidden = true; $('#app').hidden = false;
      go('textos');
    }).catch(function (e) {
      if (btn) busy(btn, false, 'Entrar');
      $('#loginErr').textContent = e.status === 401 ? 'Contraseña incorrecta.' : e.message;
      try { sessionStorage.removeItem('twp-panel-pw'); } catch (x) {}
    });
  }
  $('#loginForm').addEventListener('submit', function (e) { e.preventDefault(); start($('#pw').value, $('#loginBtn')); });
  window.addEventListener('beforeunload', function (e) { if (Object.keys(state.draft).length) { e.preventDefault(); e.returnValue = ''; } });
  try { var saved = sessionStorage.getItem('twp-panel-pw'); if (saved) start(saved); } catch (e) {}
})();
