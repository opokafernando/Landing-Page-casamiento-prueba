/* Galería de un cliente: carga suave de fotos + visor a pantalla completa
   con flechas, teclado y deslizamiento en celular. */
(function(){
  var items = Array.prototype.slice.call(document.querySelectorAll('.gal-item'));
  if(!items.length) return;

  // Reparte las fotos en columnas siguiendo el orden de lectura: cada foto va a la
  // columna más corta, así la galería se lee de izquierda a derecha y no columna por columna.
  var grid = document.querySelector('.gal-grid');
  var currentCols = 0;
  function colCount(){ return window.innerWidth >= 1200 ? 4 : (window.innerWidth >= 768 ? 3 : 2); }
  function layout(){
    var n = colCount();
    if(n === currentCols) return;
    currentCols = n;
    var cols = [], heights = [];
    for(var c = 0; c < n; c++){
      var d = document.createElement('div'); d.className = 'gal-col';
      cols.push(d); heights.push(0);
    }
    items.forEach(function(it){
      var im = it.querySelector('img');
      var ratio = (+im.getAttribute('height') || 1) / (+im.getAttribute('width') || 1);
      var k = 0;
      for(var j = 1; j < n; j++){ if(heights[j] < heights[k] - 0.01){ k = j; } }
      cols[k].appendChild(it);
      heights[k] += ratio + 0.02;
    });
    grid.innerHTML = '';
    cols.forEach(function(d){ grid.appendChild(d); });
    grid.classList.add('is-rows');
  }
  layout();
  var rt;
  window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(layout, 150); });

  items.forEach(function(btn){
    var img = btn.querySelector('img');
    if(img.complete){ img.classList.add('is-loaded'); }
    else{ img.addEventListener('load', function(){ img.classList.add('is-loaded'); }); }
  });

  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCount = document.getElementById('lbCount');
  var index = 0;
  var lastFocus = null;

  function show(i){
    index = (i + items.length) % items.length;
    var it = items[index];
    lbImg.classList.add('is-fading');
    var src = it.getAttribute('data-full');
    var pre = new Image();
    pre.onload = function(){ lbImg.src = src; lbImg.alt = it.querySelector('img').alt; lbImg.classList.remove('is-fading'); };
    pre.src = src;
    lbCount.textContent = (index + 1) + ' / ' + items.length;
    // precarga la siguiente y la anterior
    [index + 1, index - 1].forEach(function(n){
      var nb = items[(n + items.length) % items.length];
      (new Image()).src = nb.getAttribute('data-full');
    });
  }
  function open(i){
    lastFocus = document.activeElement;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    show(i);
    document.getElementById('lbClose').focus();
  }
  function close(){
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    lbImg.src = '';
    if(lastFocus){ lastFocus.focus(); }
  }

  items.forEach(function(btn, i){ btn.addEventListener('click', function(){ open(i); }); });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function(){ show(index - 1); });
  document.getElementById('lbNext').addEventListener('click', function(){ show(index + 1); });
  lb.addEventListener('click', function(e){ if(e.target === lb){ close(); } });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('is-open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') show(index - 1);
    if(e.key === 'ArrowRight') show(index + 1);
  });

  var startX = null;
  lb.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', function(e){
    if(startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 50){ show(dx < 0 ? index + 1 : index - 1); }
    startX = null;
  });
})();
