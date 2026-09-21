/* Traducción de subpáginas (blog, recursos, galerías): usa el idioma que la
   persona ya eligió en la home (guardado en localStorage como "fo_lang"),
   sin volver a mostrar el modal de selección. Cada página define su propio
   diccionario en window.FO_LANG = {es:{...}, pt:{...}, en:{...}} antes de
   incluir este script, y llama FO_Subpage.init() al final. */
(function(){
  function getSavedLang(){
    try{ return localStorage.getItem('fo_lang') || 'es'; }catch(e){ return 'es'; }
  }
  function saveLang(lang){
    try{ localStorage.setItem('fo_lang', lang); }catch(e){}
  }

  var FO_Subpage = {
    currentLang: 'es',
    t: function(key){
      var dict = (window.FO_LANG && window.FO_LANG[this.currentLang]) || {};
      return dict[key] !== undefined ? dict[key] : key;
    },
    applyLang: function(lang){
      if(!window.FO_LANG || !window.FO_LANG[lang]) lang = 'es';
      this.currentLang = lang;
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : (lang === 'en' ? 'en-US' : 'es-AR');
      var dict = window.FO_LANG[lang];
      document.querySelectorAll('[data-i18n]').forEach(function(el){
        var key = el.getAttribute('data-i18n');
        if(dict[key] !== undefined){ el.textContent = dict[key]; }
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function(el){
        var key = el.getAttribute('data-i18n-html');
        if(dict[key] !== undefined){ el.innerHTML = dict[key]; }
      });
      document.querySelectorAll('[data-i18n-alt]').forEach(function(el){
        var key = el.getAttribute('data-i18n-alt');
        if(dict[key] !== undefined){ el.alt = dict[key]; }
      });
      document.querySelectorAll('[data-i18n-href]').forEach(function(el){
        var key = el.getAttribute('data-i18n-href');
        if(dict[key] !== undefined){ el.setAttribute('href', dict[key]); }
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function(el){
        var key = el.getAttribute('data-i18n-aria');
        if(dict[key] !== undefined){ el.setAttribute('aria-label', dict[key]); }
      });
      saveLang(lang);
    },
    init: function(){
      this.applyLang(getSavedLang());
      var switcher = document.getElementById('langSwitcher');
      var self = this;
      if(switcher){
        switcher.addEventListener('click', function(){
          var order = ['es', 'pt', 'en'];
          var idx = order.indexOf(self.currentLang);
          var next = order[(idx + 1) % order.length];
          self.applyLang(next);
        });
      }
    }
  };

  window.FO_Subpage = FO_Subpage;
})();
