// Portada de Argentina en dos escenas, como globaltni.com/es: el carro en la
// 9 de Julio corre una vez completo, el mundo de Truly girando entra encima con un fundido de 0,8 s, corre 10 s y se
// desvanece dejando el carro desde el inicio. No se detiene con «reducir movimiento» (decisión del dueño). Los dos videos se crean acá, después de preview.js, para que preview.js no los pause ni los ponga en bucle.
(function () {
  var film = document.querySelector('#inicio .film');
  if (!film) return;
  var FUNDIDO = 0.8, MUNDO = 10, CARRO_FIN = 10;

  function video(src, z) {
    var v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.setAttribute('aria-hidden', 'true');
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity ' + FUNDIDO + 's linear;z-index:' + z;
    if (src) { v.preload = 'auto'; v.src = src; } else { v.preload = 'none'; }
    film.appendChild(v); return v;
  }
  // 4K para las pantallas que lo pueden mostrar; HD para pantallas chicas.
  var grande = (window.innerWidth || 0) * (window.devicePixelRatio || 1) > 1920;
  // Celular: hasta que exista un video vertical queda la foto fija (un video horizontal cortaría el carro).
  if ((window.innerWidth || 0) <= 760) return;
  var carro = video(grande ? '/truly-nolen-argentina/oficinas/argentina/assets/argentina-carro-4k.mp4' : '/truly-nolen-argentina/oficinas/argentina/assets/argentina-carro-hd.mp4', 1);
  var mundo = video('', 2);
  var enMundo = false, cambiando = false;
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function cargar() { if (!mundo.getAttribute('src')) { mundo.src = '/truly-nolen-argentina/oficinas/assets/mundo-desktop.mp4'; mundo.load(); } }
  function aMundo() {
    if (enMundo || cambiando) return; cambiando = true; cargar();
    mundo.currentTime = 0; play(mundo); mundo.style.opacity = '1';
    setTimeout(function () { carro.pause(); enMundo = true; cambiando = false; }, FUNDIDO * 1000);
  }
  function aCarro() {
    if (!enMundo || cambiando) return; cambiando = true;
    carro.currentTime = 0; play(carro); mundo.style.opacity = '0';
    setTimeout(function () { mundo.pause(); enMundo = false; cambiando = false; }, FUNDIDO * 1000);
  }
  carro.addEventListener('playing', function () { carro.style.opacity = '1'; }, { once: true });
  carro.addEventListener('timeupdate', function () {
    var fin = Math.min(CARRO_FIN, carro.duration || CARRO_FIN);
    if (!enMundo && carro.currentTime >= fin - FUNDIDO) aMundo();
  });
  carro.addEventListener('ended', aMundo);
  mundo.addEventListener('timeupdate', function () {
    var fin = Math.min(MUNDO, mundo.duration || MUNDO);
    if (enMundo && mundo.currentTime >= fin - FUNDIDO) aCarro();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { carro.pause(); mundo.pause(); } else { play(enMundo ? mundo : carro); }
  });
  play(carro);
  setTimeout(cargar, 4000);
})();
