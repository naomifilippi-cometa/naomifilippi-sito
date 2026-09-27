/* Pagina di passaggio dopo Google, LinkedIn, il link via email, la conferma della registrazione o il recupero password:
   Supabase completa l'accesso (codice PKCE nell'indirizzo), poi si va all'area giusta per il ruolo. */
(async function () {
  var NF = window.NF, riduci = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.slice(1));
  function errore(m) { location.replace(NF.pagina('accedi', 'errore=' + encodeURIComponent(m))); }
  // link "password dimenticata": dopo l'accesso si sceglie la nuova password
  var recupero = false;
  NF.alCambioAccesso(function (ev) { if (ev === 'PASSWORD_RECOVERY') recupero = true; });
  try { var t = +localStorage.getItem('nf-recupero'); if (t && Date.now() - t < 3600e3 && q.get('code')) recupero = true; } catch (e) { }
  var err = q.get('error_description') || h.get('error_description');
  if (err) return errore('Accesso non completato: ' + err);
  var s = null;
  for (var k = 0; k < 24 && !s; k++) {
    s = await NF.sessione();
    if (!s) await new Promise(function (r) { setTimeout(r, 250); });
  }
  if (!s) return errore(recupero ? 'Il link per reimpostare la password è scaduto o è già stato usato. Richiedine un altro con "Password dimenticata?".' : 'Il link è scaduto o è già stato usato. Richiedine uno nuovo.');
  await new Promise(function (r) { setTimeout(r, 60); }); // l'evento di recupero arriva subito dopo la sessione
  if (recupero) { try { localStorage.removeItem('nf-recupero'); } catch (e) { } return location.replace(NF.pagina('accedi', 'nuova=1')); }
  var admin = await NF.eAdmin();
  var testo = document.getElementById('passaggio-testo');
  if (testo) testo.textContent = admin ? 'Apro la tua dashboard…' : 'Apro la tua area riservata…';
  setTimeout(function () {
    location.replace(NF.pagina(admin ? 'admin' : 'area', NF.live ? '' : 'demo=' + (admin ? 'admin' : 'cliente')));
  }, riduci ? 0 : 600);
})();
