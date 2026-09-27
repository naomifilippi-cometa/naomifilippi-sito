/* Pagina di accesso: Google, LinkedIn o link via email. Dopo il login si passa da auth-callback, che smista per ruolo. */
(function () {
  var NF = window.NF, riduci = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var card = document.querySelector('.acc-card');
  var stati = { scegli: document.querySelector('.stato-scegli'), inviata: document.querySelector('.stato-inviata'), dentro: document.querySelector('.stato-dentro') };
  var esito = document.getElementById('acc-esito'), campo = document.getElementById('acc-email');

  function mostraStato(nome) {
    var cambia = function () {
      Object.keys(stati).forEach(function (k) { stati[k].hidden = k !== nome; });
      stati[nome].classList.remove('stato-entra'); stati[nome].offsetWidth; stati[nome].classList.add('stato-entra');
      var f = stati[nome].querySelector('h1,h2'); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
    };
    if (document.startViewTransition && !riduci) document.startViewTransition(cambia); else cambia();
  }
  function avviso(testo, errore) {
    esito.hidden = !testo; esito.className = 'esito ' + (errore ? 'ko' : 'ok'); esito.textContent = testo || '';
  }
  function occupato(b, si) { if (si) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy'); b.disabled = !!si; }
  function avanti(ruoloDemo) {
    mostraStato('dentro');
    setTimeout(function () { location.replace(NF.pagina('auth-callback', ruoloDemo ? 'demo=' + ruoloDemo : '')); }, riduci ? 0 : 450);
  }

  // messaggi arrivati da altre pagine
  var q = new URLSearchParams(location.search);
  if (q.get('uscito')) avviso('Sei uscito dal tuo account. A presto!');
  if (q.get('errore')) avviso(q.get('errore').slice(0, 200), true);

  // nascondi i pulsanti dei provider non ancora configurati su Supabase
  var CFG = window.NF_CONFIG || {};
  if (NF.live) {
    var spenti = { google: CFG.ACCESSO_GOOGLE === false, linkedin_oidc: CFG.ACCESSO_LINKEDIN === false }, rimasti = 0;
    document.querySelectorAll('[data-provider]').forEach(function (b) { if (spenti[b.getAttribute('data-provider')]) b.hidden = true; else rimasti++; });
    if (!rimasti) { var pl = document.querySelector('.provider-lista'), op = document.querySelector('.oppure'); if (pl) pl.hidden = true; if (op) op.hidden = true; }
  }
  // modalità demo: nessun collegamento reale a Google o LinkedIn
  if (!NF.live) document.querySelector('.demo-nota').hidden = false;

  // se la sessione c'è già, niente modulo: si entra
  NF.sessione().then(function (s) { if (s) avanti(NF.live ? '' : (s.user.admin ? 'admin' : 'cliente')); });

  document.querySelectorAll('[data-provider]').forEach(function (b) {
    b.addEventListener('click', async function () {
      avviso(''); occupato(b, true);
      var r = await NF.accedi(b.getAttribute('data-provider'), 'cliente');
      if (r.errore) { occupato(b, false); return avviso('Accesso non riuscito: ' + r.errore, true); }
      if (r.demo) avanti(r.demo); // nella versione reale il browser va già su Google o LinkedIn
      else setTimeout(function () { occupato(b, false); }, 8000);
    });
  });

  var form = document.getElementById('f-email'), invio = form.querySelector('button[type=submit]'), timer = null;
  campo.addEventListener('input', function () { campo.classList.remove('errore'); campo.removeAttribute('aria-invalid'); });
  form.addEventListener('submit', async function (e) {
    e.preventDefault(); avviso('');
    var email = campo.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      campo.classList.remove('errore'); campo.offsetWidth; campo.classList.add('errore'); campo.setAttribute('aria-invalid', 'true'); campo.focus();
      return avviso('Controlla l\'indirizzo email: sembra incompleto.', true);
    }
    occupato(invio, true);
    var ruolo = /(^|[.@])naomi/i.test(email) ? 'admin' : 'cliente'; // conta solo in demo
    var r = await NF.accediEmail(email, ruolo);
    occupato(invio, false);
    if (r.errore) return avviso('Invio non riuscito: ' + r.errore, true);
    if (r.demo) return avanti(r.demo);
    document.getElementById('email-inviata').textContent = email;
    mostraStato('inviata'); contoRovescia();
  });

  var reinvia = document.getElementById('reinvia');
  function contoRovescia() {
    var n = 60; reinvia.disabled = true; clearInterval(timer);
    var scrivi = function () { reinvia.textContent = n > 0 ? 'Reinvia tra ' + n + ' s' : 'Reinvia il link'; };
    scrivi();
    timer = setInterval(function () { n--; scrivi(); if (n <= 0) { clearInterval(timer); reinvia.disabled = false; } }, 1000);
  }
  reinvia.addEventListener('click', async function () {
    var r = await NF.accediEmail(campo.value.trim());
    if (r.errore) { mostraStato('scegli'); return avviso('Invio non riuscito: ' + r.errore, true); }
    contoRovescia();
  });
  document.getElementById('cambia').addEventListener('click', function () { clearInterval(timer); mostraStato('scegli'); setTimeout(function () { campo.select(); }, 60); });

  // ---------- recensioni che si alternano ----------
  var voci = [].slice.call(document.querySelectorAll('.acc-voci figure')), punti = [].slice.call(document.querySelectorAll('.acc-punti button')), i = 0, giro = null;
  function vai(n) {
    i = (n + voci.length) % voci.length;
    voci.forEach(function (v, k) { v.classList.toggle('on', k === i); v.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    punti.forEach(function (p, k) { p.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
  }
  function parti() { clearInterval(giro); if (!riduci && voci.length > 1) giro = setInterval(function () { vai(i + 1); }, 6500); }
  punti.forEach(function (p, k) { p.addEventListener('click', function () { vai(k); parti(); }); });
  var box = document.querySelector('.acc-voci');
  if (box) { box.addEventListener('mouseenter', function () { clearInterval(giro); }); box.addEventListener('mouseleave', parti); }
  if (voci.length) { vai(0); parti(); }

  // ---------- cielo con la cometa ----------
  var cv = document.getElementById('cielo-acc');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), W, H, luci = [];
  function misura() {
    var dpr = Math.min(2, devicePixelRatio || 1); W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    luci = []; for (var k = 0; k < Math.round(W * H / 7000); k++) luci.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .3, a: Math.random() * .6 + .15, f: Math.random() * 6, rosa: Math.random() < .2 });
  }
  function punto(t) { var u = 1 - t, x0 = -.1 * W, y0 = H * .9, x1 = W * .35, y1 = H * .85, x2 = W * .7, y2 = H * .3, x3 = W * 1.1, y3 = H * .05; return { x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, y: u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3 }; }
  function disegna(ms) {
    var t = (ms || 0) / 1000; ctx.clearRect(0, 0, W, H);
    luci.forEach(function (l) { var a = riduci ? l.a : l.a * (.55 + .45 * Math.sin(t * 1.4 + l.f)); ctx.fillStyle = l.rosa ? 'rgba(242,154,198,' + a + ')' : 'rgba(214,240,238,' + a + ')'; ctx.beginPath(); ctx.arc(l.x, l.y, l.r, 0, 6.283); ctx.fill(); });
    var testa = riduci ? .7 : Math.min(1.1, (t % 10) / 7.5), N = 36;
    for (var j = 0; j < N; j++) {
      var t0 = testa - .28 * (j + 1) / N, t1 = testa - .28 * j / N; if (t1 <= 0 || t0 >= 1) continue;
      var a0 = punto(Math.max(0, t0)), b0 = punto(Math.min(1, t1)), k2 = 1 - j / N;
      ctx.strokeStyle = 'rgba(' + Math.round(111 + 131 * k2) + ',' + Math.round(195 - 41 * k2) + ',' + Math.round(195 + 3 * k2) + ',' + (k2 * k2 * .9) + ')';
      ctx.lineWidth = .8 + 3.6 * k2 * k2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(b0.x, b0.y); ctx.stroke();
    }
    if (testa <= 1) { var h = punto(testa), g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 40); g.addColorStop(0, 'rgba(255,236,246,.9)'); g.addColorStop(.3, 'rgba(242,154,198,.45)'); g.addColorStop(1, 'rgba(214,51,132,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h.x, h.y, 40, 0, 6.283); ctx.fill(); }
    if (!riduci) requestAnimationFrame(disegna);
  }
  misura(); addEventListener('resize', function () { misura(); if (riduci) disegna(0); });
  disegna(0); if (!riduci) requestAnimationFrame(disegna);
})();
