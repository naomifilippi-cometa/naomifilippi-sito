/* Caricato nel <head> di ogni pagina pubblica, prima del primo disegno.
   - segna che JavaScript è attivo
   - ricorda se il logo ha già fatto l'animazione di apertura in questa visita
   - sceglie la direzione della transizione tra pagine (avanti / indietro nel menu) */
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    if (sessionStorage.getItem('nf-visto')) d.classList.add('gia-visto');
    else sessionStorage.setItem('nf-visto', '1');
  } catch (e) { }

  var ORDINE = {
    '': 0, 'index': 0, 'servizi': 1, 'servizio-cv': 1.1, 'servizio-linkedin': 1.2, 'servizio-cover-letter': 1.3,
    'servizio-orientamento': 1.4, 'servizio-colloquio': 1.5, 'servizio-negoziazione': 1.6,
    'metodo': 2, 'prezzi': 3, 'recensioni': 4, 'chi-sono': 5, 'faq': 5.5, 'contatti': 6, 'prenota': 7, 'accedi': 8,
    'privacy': 9, 'cookie-policy': 9.1, 'termini': 9.2
  };
  function posto(url) {
    try {
      var k = new URL(url).pathname.split('/').pop().replace(/\.html$/, '');
      return Object.prototype.hasOwnProperty.call(ORDINE, k) ? ORDINE[k] : null;
    } catch (e) { return null; }
  }
  addEventListener('pagereveal', function (e) {
    if (!e.viewTransition || !window.navigation || !navigation.activation) return;
    var a = navigation.activation;
    if (!a.from || !a.entry) return;
    var da = posto(a.from.url), verso = posto(a.entry.url);
    if (da == null || verso == null || da === verso) return;
    try { e.viewTransition.types.add(verso > da ? 'avanti' : 'indietro'); } catch (err) { }
  });
})();
