/* Lógica del panel: leer y reescribir textos, precios, preguntas frecuentes y posts
   directamente en el HTML del sitio. No depende del navegador (se prueba también en Node). */
(function (root) {
  var LANGS = ['es', 'pt', 'en'];

  /* ---------- Diccionario de traducciones (var LANG = {...} / window.FO_LANG = {...}) ---------- */
  function matchBrace(s, open) {
    var depth = 0, i = open, q = null;
    for (; i < s.length; i++) {
      var c = s[i];
      if (q) {
        if (c === '\\') { i++; continue; }
        if (c === q) q = null;
        continue;
      }
      if (c === "'" || c === '"' || c === '`') { q = c; continue; }
      if (c === '/' && s[i + 1] === '/') { i = s.indexOf('\n', i); if (i < 0) return -1; continue; }
      if (c === '/' && s[i + 1] === '*') { i = s.indexOf('*/', i) + 1; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) return i; }
    }
    return -1;
  }

  function findDict(content) {
    var m = /(var LANG\s*=\s*|window\.FO_LANG\s*=\s*)\{/.exec(content);
    if (!m) return null;
    var open = m.index + m[0].length - 1;
    var close = matchBrace(content, open);
    if (close < 0) return null;
    var text = content.slice(open, close + 1);
    /* eslint-disable-next-line no-new-func */
    var obj = new Function('"use strict"; return (' + text + ');')();
    var lineStart = content.lastIndexOf('\n', m.index) + 1;
    var indent = content.slice(lineStart, m.index).match(/^\s*/)[0];
    var langLine = /\n(\s*)(es|pt|en)\s*:/.exec(text);
    var inner = langLine ? langLine[1] : indent + '  ';
    return { start: open, end: close + 1, obj: obj, indent: indent, inner: inner };
  }

  function q(v) {
    return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n').replace(/<\/(script)/gi, '<\\/$1') + "'";
  }

  function serializeDict(obj, inner, indent) {
    var out = '{\n';
    var langs = Object.keys(obj);
    langs.forEach(function (l, li) {
      out += inner + l + ': {\n';
      var keys = Object.keys(obj[l]);
      keys.forEach(function (k, ki) {
        out += inner + '  ' + q(k) + ': ' + q(obj[l][k]) + (ki < keys.length - 1 ? ',' : '') + '\n';
      });
      out += inner + '}' + (li < langs.length - 1 ? ',' : '') + '\n';
    });
    return out + indent + '}';
  }

  function writeDict(content, d, obj) {
    return content.slice(0, d.start) + serializeDict(obj, d.inner, d.indent) + content.slice(d.end);
  }

  /* ---------- Texto por defecto en el HTML (lo que ven Google y quien no tiene JavaScript) ---------- */
  function escText(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // Reemplaza el contenido del elemento que abre en "openEnd" (cierre del mismo nombre, respetando anidados).
  function closeIndex(html, tag, from) {
    var re = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi');
    re.lastIndex = from;
    var depth = 1, m;
    while ((m = re.exec(html))) {
      if (m[1]) { depth--; if (depth === 0) return m.index; }
      else if (!/\/>$/.test(m[0])) depth++;
    }
    return -1;
  }

  function setHtmlDefault(html, key, value) {
    var limit = html.length;
    var k = reEsc(key);
    // contenido
    var re = new RegExp('<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*\\sdata-i18n(-html)?="' + k + '"[^>]*>', 'g');
    var m, out = html, shift = 0, found = [];
    while ((m = re.exec(html)) && m.index < limit) found.push({ m: m, openEnd: m.index + m[0].length });
    for (var i = found.length - 1; i >= 0; i--) {
      var f = found[i], tag = f.m[1], isHtml = !!f.m[2];
      var ci = closeIndex(out, tag, f.openEnd);
      if (ci < 0) continue;
      out = out.slice(0, f.openEnd) + (isHtml ? value : escText(value)) + out.slice(ci);
    }
    // atributos
    var attrMap = { alt: 'alt', aria: 'aria-label', href: 'href', placeholder: 'placeholder' };
    Object.keys(attrMap).forEach(function (kind) {
      var reA = new RegExp('<[a-zA-Z][^>]*\\sdata-i18n-' + kind + '="' + k + '"[^>]*>', 'g');
      out = out.replace(reA, function (tagText, idx) {
        if (idx > limit) return tagText;
        var attr = attrMap[kind];
        var reAttr = new RegExp('(\\s' + attr + '=)("[^"]*"|\'[^\']*\')');
        if (reAttr.test(tagText)) return tagText.replace(reAttr, '$1"' + escAttr(value) + '"');
        return tagText;
      });
    });
    return out;
  }

  // changes: { clave: { es: "...", pt: "...", en: "..." } }
  function applyTexts(content, changes) {
    var d = findDict(content);
    if (!d) throw new Error('No encontré las traducciones en este archivo.');
    var obj = d.obj;
    Object.keys(changes).forEach(function (key) {
      LANGS.forEach(function (l) {
        if (changes[key][l] !== undefined && obj[l]) obj[l][key] = changes[key][l];
      });
    });
    var out = writeDict(content, d, obj);
    Object.keys(changes).forEach(function (key) {
      if (changes[key].es !== undefined) out = setHtmlDefault(out, key, changes[key].es);
    });
    return out;
  }

  /* ---------- Precios ---------- */
  function fmt(n, lang) {
    var whole = Math.abs(n - Math.round(n)) < 0.005;
    var parts = (whole ? Math.round(n).toString() : n.toFixed(2)).split('.');
    var th = lang === 'en' ? ',' : '.', dec = lang === 'en' ? '.' : ',';
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, th);
    return parts.join(dec);
  }
  // Reemplaza en orden los montos "R$ 1.234" de un texto, respetando el espacio original.
  function setAmounts(text, amounts, lang) {
    var i = 0;
    return String(text).replace(/R\$(\s?)\d[\d.,]*/g, function (all, sp) {
      if (i >= amounts.length) return all;
      return 'R$' + sp + fmt(amounts[i++], lang);
    });
  }

  var PRODUCTS = [
    { id: 'mini', label: 'Mini Wedding', kind: 'pkg' },
    { id: 'plus', label: 'Wedding Plus', kind: 'pkg' },
    { id: 'full', label: 'Full Wedding', kind: 'pkg' },
    { id: '20', label: 'Álbum 25x25 · 20 páginas', kind: 'chip', extra: '20 páginas' },
    { id: '30', label: 'Álbum 25x25 · 30 páginas', kind: 'chip', extra: '30 páginas' },
    { id: '40', label: 'Álbum 25x25 · 40 páginas', kind: 'chip', extra: '40 páginas' },
    { id: 'analog', label: 'Fotos analógicas', kind: 'analog' }
  ];
  function productRe(p) {
    if (p.kind === 'pkg') return new RegExp('<div class="pkg-card[^"]*" data-package="' + p.id + '"[^>]*>');
    if (p.kind === 'chip') return new RegExp('<button type="button" class="extra-chip" id="chip' + p.id + '"[^>]*>');
    return /<button type="button" class="analog-btn" id="analogBtn"[^>]*>/;
  }
  function readPrices(content) {
    return PRODUCTS.map(function (p) {
      var m = productRe(p).exec(content);
      if (!m) return null;
      var pix = +(/data-price-pix="(\d+)"/.exec(m[0]) || [])[1];
      var card = +(/data-price-card="(\d+)"/.exec(m[0]) || [])[1];
      return { id: p.id, label: p.label, kind: p.kind, pix: pix, card: card };
    }).filter(Boolean);
  }
  function applyPrices(content, list) {
    var out = content;
    var changes = {};
    list.forEach(function (p) {
      var def = PRODUCTS.filter(function (x) { return x.id === p.id; })[0];
      var pix = Math.round(+p.pix), card = Math.round(+p.card);
      if (!(pix > 0 && card > 0)) throw new Error('Precio inválido en ' + def.label);
      var m = productRe(def).exec(out);
      if (!m) return;
      var tag = m[0].replace(/data-price-pix="\d+"/, 'data-price-pix="' + pix + '"').replace(/data-price-card="\d+"/, 'data-price-card="' + card + '"');
      out = out.slice(0, m.index) + tag + out.slice(m.index + m[0].length);
      var after = m.index + tag.length;
      if (def.kind === 'pkg') {
        out = replaceNear(out, after, /<p class="pkg-price">R\$ [\d.,]+<\/p>/, '<p class="pkg-price">R$ ' + fmt(card, 'es') + '</p>');
        changes['pkg.' + p.id + '.priceNote'] = [card / 6];
        changes['pkg.' + p.id + '.priceSave'] = [pix, card - pix];
      } else if (def.kind === 'chip') {
        out = replaceNear(out, after, new RegExp('<span class="extra-chip-price" id="chip' + p.id + 'Price">R\\$ [\\d.,]+</span>'), '<span class="extra-chip-price" id="chip' + p.id + 'Price">R$ ' + fmt(card, 'es') + '</span>');
        changes['extras.pixPrice' + p.id] = [pix];
        // constantes del script (precio base y con descuento de cada álbum)
        var reConst = new RegExp("('" + def.extra + "': \\{[^\\n]*?base: )(\\d+)(, off: )(\\d+)(, cardBase: )(\\d+)(, cardOff: )(\\d+)");
        out = out.replace(reConst, function (all, a, base, b, off, c, cb, d2, co) {
          var ratio = (+off) / (+base);
          return a + pix + b + Math.round(pix * ratio) + c + card + d2 + Math.round(card * ratio);
        });
      } else {
        var start = out.lastIndexOf('<span class="vx-price-big">', m.index);
        out = replaceNear(out, Math.max(0, start - 1), /<span class="vx-price-big">R\$ [\d.,]+<\/span>/, '<span class="vx-price-big">R$ ' + fmt(card, 'es') + '</span>');
        changes['analog.installmentValue'] = [card / 6];
        changes['analog.pixLine'] = [pix, card - pix];
      }
    });
    // textos traducidos que muestran montos
    var d = findDict(out);
    var texts = {};
    Object.keys(changes).forEach(function (key) {
      texts[key] = {};
      LANGS.forEach(function (l) { if (d.obj[l] && d.obj[l][key] !== undefined) texts[key][l] = setAmounts(d.obj[l][key], changes[key], l); });
    });
    return applyTexts(out, texts);
  }
  function replaceNear(s, from, re, repl) {
    var rest = s.slice(from);
    var m = re.exec(rest);
    if (!m) return s;
    return s.slice(0, from + m.index) + repl + s.slice(from + m.index + m[0].length);
  }

  /* ---------- Preguntas frecuentes (chat de WhatsApp) ---------- */
  function readFaq(content) {
    var d = findDict(content);
    var list = [];
    for (var i = 1; i < 100; i++) {
      if (!d.obj.es['faq.q' + i]) break;
      var item = { q: {}, a: {} };
      LANGS.forEach(function (l) { item.q[l] = (d.obj[l] || {})['faq.q' + i] || ''; item.a[l] = (d.obj[l] || {})['faq.a' + i] || ''; });
      list.push(item);
    }
    return list;
  }
  function escHtml(s) { return escText(s).replace(/"/g, '&quot;'); }
  function writeFaq(content, list) {
    var d = findDict(content);
    var obj = d.obj;
    LANGS.forEach(function (l) {
      if (!obj[l]) return;
      var src = obj[l], next = {}, placed = false;
      Object.keys(src).forEach(function (k) {
        if (/^faq\.[qa]\d+$/.test(k)) {
          if (!placed) {
            list.forEach(function (it, i) { next['faq.q' + (i + 1)] = it.q[l] || it.q.es; next['faq.a' + (i + 1)] = it.a[l] || it.a.es; });
            placed = true;
          }
          return;
        }
        next[k] = src[k];
      });
      if (!placed) list.forEach(function (it, i) { next['faq.q' + (i + 1)] = it.q[l] || it.q.es; next['faq.a' + (i + 1)] = it.a[l] || it.a.es; });
      obj[l] = next;
    });
    var out = writeDict(content, d, obj);
    var startTag = /<div class="faq-chat" id="faqChat"[^>]*>\n/.exec(out);
    var endIdx = out.indexOf('          <div class="typing" id="faqTyping"');
    if (!startTag || endIdx < 0) throw new Error('No encontré el chat de preguntas frecuentes en la página.');
    var html = '', min = 2;
    list.forEach(function (it, i) {
      var t1 = '10:' + String(min).padStart(2, '0'); min += 1;
      var t2 = '10:' + String(min).padStart(2, '0'); min += 2;
      html += '        <div class="bubble in is-pending"><span data-i18n="faq.q' + (i + 1) + '">' + escHtml(it.q.es) + '</span><time>' + t1 + '</time></div>\n' +
              '        <div class="bubble out is-pending"><span data-i18n="faq.a' + (i + 1) + '">' + escHtml(it.a.es) + '</span><time>' + t2 + '</time></div>\n';
    });
    var s = startTag.index + startTag[0].length;
    return out.slice(0, s) + html + out.slice(endIdx);
  }

  /* ---------- Blog ---------- */
  function readPosts(blogIndex) {
    var d = findDict(blogIndex);
    var posts = [];
    var re = /<article class="post-card">[\s\S]*?<\/article>/g, m;
    while ((m = re.exec(blogIndex))) {
      var n = (/data-i18n="post(\d+)\.date"/.exec(m[0]) || [])[1];
      var href = (/href='\/blog\/([^']+)'/.exec(m[0]) || /href="\/blog\/([^"]+)"/.exec(m[0]) || [])[1];
      if (!n || !href) continue;
      var p = { n: +n, slug: href.replace(/\.html$/, ''), title: {}, excerpt: {}, date: {} };
      LANGS.forEach(function (l) {
        var o = d.obj[l] || {};
        p.title[l] = o['post' + n + '.title'] || ''; p.excerpt[l] = o['post' + n + '.excerpt'] || ''; p.date[l] = o['post' + n + '.date'] || '';
      });
      posts.push(p);
    }
    return posts;
  }

  function slugify(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
  }

  var SITE = 'https://fernando-opoka-bodas.netlify.app';

  // post: { slug, isoDate, image (URL completa), date:{es,pt,en}, title:{}, excerpt:{}, crumb:{}, imgAlt:{},
  //         sections: [ { h2:{es,pt,en}, p:{es,pt,en} } ] }   (p admite varios párrafos separados por línea en blanco)
  function buildPost(template, post) {
    var t = template;
    var url = SITE + '/blog/' + post.slug + '.html';
    var ogImg = post.image.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_auto/');
    var bodyImg = post.image.replace('/upload/', '/upload/w_1000,q_auto,f_auto/');
    function attr(v) { return escAttr(v); }
    t = t.replace(/<title>[^<]*<\/title>/, '<title>' + escText(post.title.es) + ' | Fernando Opoka</title>');
    t = t.replace(/(<meta name="description" content=")[^"]*(")/, '$1' + attr(post.excerpt.es) + '$2');
    t = t.replace(/(<link rel="canonical" href=")[^"]*(")/, '$1' + url + '$2');
    t = t.replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + attr(post.title.es) + '$2');
    t = t.replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + attr(post.excerpt.es) + '$2');
    t = t.replace(/(<meta property="og:image" content=")[^"]*(")/, '$1' + ogImg + '$2');
    t = t.replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + url + '$2');
    t = t.replace(/("headline": )"[^"]*"/, '$1' + JSON.stringify(post.title.es));
    t = t.replace(/("image": )"[^"]*"/, '$1' + JSON.stringify(ogImg));
    t = t.replace(/("datePublished": )"[^"]*"/, '$1' + JSON.stringify(post.isoDate));
    t = t.replace(/(FO_Track\.viewContent\(\{content_name: )'[^']*'/, "$1" + q(post.title.es));
    // contenido principal
    var mainStart = t.indexOf('<main>'), mainEnd = t.indexOf('</main>');
    var main = t.slice(mainStart, mainEnd);
    var ctaStart = main.indexOf('<div class="post-cta">');
    var headEnd = main.indexOf('<p data-i18n="p.intro">');
    if (headEnd < 0) headEnd = main.search(/<(p|h2) data-i18n="(p|h2)\./);
    var body = '';
    var dict = { es: {}, pt: {}, en: {} };
    post.sections.forEach(function (s, i) {
      var n = i + 1;
      if (s.h2 && s.h2.es) {
        body += '    <h2 data-i18n="h2.s' + n + '">' + escText(s.h2.es) + '</h2>\n';
        LANGS.forEach(function (l) { dict[l]['h2.s' + n] = s.h2[l] || s.h2.es; });
      }
      var parasEs = String(s.p.es || '').split(/\n\s*\n/).filter(function (x) { return x.trim(); });
      parasEs.forEach(function (para, j) {
        var key = 'p.s' + n + '_' + (j + 1);
        body += '    <p data-i18n="' + key + '">' + escText(para.trim()) + '</p>\n';
        LANGS.forEach(function (l) {
          var parts = String(s.p[l] || '').split(/\n\s*\n/).filter(function (x) { return x.trim(); });
          dict[l][key] = (parts[j] || para).trim();
        });
      });
      body += '\n';
    });
    var newMain = main.slice(0, headEnd) + body.replace(/^ {4}/, '') + '    ' + main.slice(ctaStart);
    t = t.slice(0, mainStart) + newMain + t.slice(mainEnd);
    // imagen y textos de cabecera
    t = t.replace(/(<img src=")[^"]*("[^>]*data-i18n-alt="img\.alt")/, '$1' + bodyImg + '$2');
    // diccionario: conserva lo común (menú, CTA, pie) y reemplaza lo del artículo
    var d = findDict(t);
    var keep = /^(lang\.|nav\.|cta\.|back\.|footer\.|post\.author)/;
    LANGS.forEach(function (l) {
      var src = d.obj[l] || {}, next = {};
      Object.keys(src).forEach(function (k) {
        if (k === 'breadcrumb.this') next[k] = post.crumb[l] || post.crumb.es;
        else if (k === 'post.h1') next[k] = post.title[l] || post.title.es;
        else if (k === 'post.date') next[k] = post.date[l] || post.date.es;
        else if (k === 'img.alt') next[k] = post.imgAlt[l] || post.imgAlt.es;
        else if (k === 'post.author') { next[k] = src[k]; }
        else if (keep.test(k)) next[k] = src[k];
        if (k === 'img.alt') Object.keys(dict[l]).forEach(function (dk) { next[dk] = dict[l][dk]; });
      });
      d.obj[l] = next;
    });
    t = writeDict(t, d, d.obj);
    ['breadcrumb.this', 'post.h1', 'post.date', 'img.alt'].forEach(function (k) {
      t = setHtmlDefault(t, k, d.obj.es[k]);
    });
    return t;
  }

  function addPostCard(blogIndex, post) {
    var d = findDict(blogIndex);
    var nums = Object.keys(d.obj.es).map(function (k) { var m = /^post(\d+)\./.exec(k); return m ? +m[1] : 0; });
    var n = Math.max.apply(null, nums.concat([0])) + 1;
    LANGS.forEach(function (l) {
      var src = d.obj[l], next = {};
      // el post nuevo va primero en la lista de textos de tarjetas
      var inserted = false;
      Object.keys(src).forEach(function (k) {
        if (!inserted && /^post\d+\./.test(k)) {
          next['post' + n + '.date'] = post.date[l] || post.date.es;
          next['post' + n + '.title'] = post.title[l] || post.title.es;
          next['post' + n + '.excerpt'] = post.excerpt[l] || post.excerpt.es;
          inserted = true;
        }
        next[k] = src[k];
      });
      if (!inserted) {
        next['post' + n + '.date'] = post.date[l] || post.date.es;
        next['post' + n + '.title'] = post.title[l] || post.title.es;
        next['post' + n + '.excerpt'] = post.excerpt[l] || post.excerpt.es;
      }
      d.obj[l] = next;
    });
    var out = writeDict(blogIndex, d, d.obj);
    var card = '\n      <article class="post-card">\n' +
      '        <span class="card-date" data-i18n="post' + n + '.date">' + escText(post.date.es) + '</span>\n' +
      "        <h2><a href='/blog/" + post.slug + "' data-i18n=\"post" + n + '.title">' + escText(post.title.es) + '</a></h2>\n' +
      '        <p data-i18n="post' + n + '.excerpt">' + escText(post.excerpt.es) + '</p>\n' +
      "        <a class='read-more' href='/blog/" + post.slug + "' data-i18n=\"post.readMore\">" + escText((d.obj.es['post.readMore'] || 'Leer más →')) + '</a>\n' +
      '      </article>\n';
    var listOpen = out.indexOf('<div class="post-list">');
    var at = out.indexOf('\n', listOpen) + 1;
    return out.slice(0, at) + card + out.slice(at);
  }

  function removePostCard(blogIndex, slug) {
    var re = new RegExp('\\n?\\s*<article class="post-card">(?:(?!</article>)[\\s\\S])*?/blog/' + reEsc(slug) + '(?:\\.html)?[\'"][\\s\\S]*?</article>\\n?');
    var m = re.exec(blogIndex);
    if (!m) return blogIndex;
    var n = (/data-i18n="post(\d+)\.date"/.exec(m[0]) || [])[1];
    var out = blogIndex.slice(0, m.index) + '\n' + blogIndex.slice(m.index + m[0].length);
    if (n) {
      var d = findDict(out);
      LANGS.forEach(function (l) { ['date', 'title', 'excerpt'].forEach(function (f) { delete d.obj[l]['post' + n + '.' + f]; }); });
      out = writeDict(out, d, d.obj);
    }
    return out;
  }

  function sitemapAdd(xml, path, isoDate) {
    var loc = SITE + '/' + path;
    if (xml.indexOf('<loc>' + loc + '</loc>') >= 0) return xml;
    var entry = '  <url>\n    <loc>' + loc + '</loc>\n    <lastmod>' + isoDate + '</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>\n';
    return xml.replace('</urlset>', entry + '</urlset>');
  }
  function sitemapRemove(xml, path) {
    var loc = SITE + '/' + path;
    return xml.replace(new RegExp('\\s*<url>\\s*<loc>' + reEsc(loc) + '</loc>[\\s\\S]*?</url>'), '');
  }

  var api = {
    LANGS: LANGS, findDict: findDict, applyTexts: applyTexts, setHtmlDefault: setHtmlDefault,
    readPrices: readPrices, applyPrices: applyPrices, fmt: fmt,
    readFaq: readFaq, writeFaq: writeFaq,
    readPosts: readPosts, buildPost: buildPost, addPostCard: addPostCard, removePostCard: removePostCard,
    sitemapAdd: sitemapAdd, sitemapRemove: sitemapRemove, slugify: slugify
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CMS = api;
})(this);
