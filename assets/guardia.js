/* Nel <head> di area clienti e dashboard, dopo config.js:
   se non c'è una sessione, porta subito alla pagina di accesso, prima di disegnare qualsiasi cosa.
   Il controllo vero (sessione valida e ruolo) lo fa poi la pagina con Supabase. */
(function () {
  var C = window.NF_CONFIG || {}, ok = false, d = document.documentElement;
  try {
    if (C.SUPABASE_URL && C.SUPABASE_ANON_KEY) {
      for (var i = 0; i < localStorage.length; i++) { if (/^sb-.*-auth-token$/.test(localStorage.key(i))) { ok = true; break; } }
    } else {
      ok = !!sessionStorage.getItem('nf-demo-utente') || /[?&]demo=(cliente|admin)\b/.test(location.search);
    }
  } catch (e) { ok = !(C.SUPABASE_URL && C.SUPABASE_ANON_KEY); }
  if (!ok) {
    d.className += ' auth-redirect';
    location.replace('accedi' + (/\.html$/.test(location.pathname) ? '.html' : ''));
  } else d.className += ' auth-pending';
})();
