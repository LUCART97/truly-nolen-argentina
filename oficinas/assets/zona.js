// Filtro de cobertura de una oficina: con la región elegida arma el primer mensaje y abre Truly AI con él escrito
// (chat.js lo pone en la caja; la persona lo envía). No manda nada solo ni guarda datos.
(function () {
  document.querySelectorAll('[data-zona]').forEach(function (f) {
    // En captura y cortando la propagación: así el aviso de «prueba» de la plantilla (preview.js) no aparece en este formulario.
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      var v = function (n) { var x = f.elements[n]; return x ? String(x.value || '').trim() : ''; };
      var partes = [f.dataset.n1 + ': ' + v('n1')];
      if (v('n2')) partes.push(f.dataset.n2 + ': ' + v('n2'));
      if (v('cp')) partes.push('Código postal: ' + v('cp'));
      var esp = f.querySelector('input[name="espacio"]:checked');
      if (esp) partes.push('Espacio: ' + esp.value);
      var b = f.querySelector('[data-zona-enviar]');
      b.dataset.chatPrompt = 'Quiero consultar la cobertura. ' + partes.join(' · ');
      b.click();
    }, true);
  });
})();
