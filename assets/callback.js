/* Pagina di passaggio dopo Google, LinkedIn o il link via email:
   Supabase completa l'accesso (codice PKCE nell'indirizzo), poi si va all'area giusta per il ruolo. */
(async function () {
  var NF = window.NF, riduci = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.slice(1));
  function errore(m) { location.replace(NF.pagina('accedi', 'errore=' + encodeURIComponent(m))); }
  var err = q.get('error_description') || h.get('error_description');
  if (err) return errore('Accesso non completato: ' + err);
  var s = null;
  for (var k = 0; k < 24 && !s; k++) {
    s = await NF.sessione();
    if (!s) await new Promise(function (r) { setTimeout(r, 250); });
  }
  if (!s) return errore('Il link di accesso è scaduto o è già stato usato. Richiedine uno nuovo.');
  var admin = await NF.eAdmin();
  var testo = document.getElementById('passaggio-testo');
  if (testo) testo.textContent = admin ? 'Apro la tua dashboard…' : 'Apro la tua area riservata…';
  setTimeout(function () {
    location.replace(NF.pagina(admin ? 'admin' : 'area', NF.live ? '' : 'demo=' + (admin ? 'admin' : 'cliente')));
  }, riduci ? 0 : 600);
})();
