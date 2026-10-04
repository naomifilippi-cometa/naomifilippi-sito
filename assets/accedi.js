/* Pagina di accesso: email e password (accesso e registrazione), Google, LinkedIn o link via email.
   Dopo il login si passa da auth-callback, che smista per ruolo. Il recupero password torna qui con ?nuova=1. */
(function () {
  var NF = window.NF, riduci = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var stati = { scegli: document.querySelector('.stato-scegli'), inviata: document.querySelector('.stato-inviata'), nuova: document.querySelector('.stato-nuova'), dentro: document.querySelector('.stato-dentro') };
  var esito = $('acc-esito'), campo = $('acc-email'), pw = $('acc-pw');
  var fAcc = $('f-accedi'), fReg = $('f-registrati');
  var EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function mostraStato(nome) {
    var cambia = function () {
      Object.keys(stati).forEach(function (k) { stati[k].hidden = k !== nome; });
      stati[nome].classList.remove('stato-entra'); stati[nome].offsetWidth; stati[nome].classList.add('stato-entra');
      var f = stati[nome].querySelector('h1,h2'); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
    };
    if (document.startViewTransition && !riduci) document.startViewTransition(cambia); else cambia();
  }
  function avviso(testo, errore, dove) {
    var e = dove || esito;
    e.hidden = !testo; e.className = 'esito ' + (errore ? 'ko' : 'ok'); e.textContent = testo || '';
  }
  function occupato(b, si) { if (si) b.setAttribute('aria-busy', 'true'); else b.removeAttribute('aria-busy'); b.disabled = !!si; }
  function sbagliato(input, testo, dove) {
    input.classList.remove('errore'); input.offsetWidth; input.classList.add('errore'); input.setAttribute('aria-invalid', 'true'); input.focus();
    avviso(testo, true, dove); return false;
  }
  document.querySelectorAll('.f-acc input').forEach(function (i) { i.addEventListener('input', function () { i.classList.remove('errore'); i.removeAttribute('aria-invalid'); }); });
  function avanti(ruoloDemo) {
    mostraStato('dentro');
    setTimeout(function () { location.replace(NF.pagina('auth-callback', ruoloDemo ? 'demo=' + ruoloDemo : '')); }, riduci ? 0 : 450);
  }
  function ruoloDemo(email) { return /(^|[.@])naomi/i.test(email) ? 'admin' : 'cliente'; } // conta solo in demo

  // ricorda com'è entrata la persona l'ultima volta
  var ULT = 'nf-ultimo-accesso';
  function ricorda(v) { try { localStorage.setItem(ULT, JSON.stringify(v)); localStorage.removeItem('nf-recupero'); } catch (e) { } }

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
  if (!NF.live) document.querySelector('.demo-nota').hidden = false;

  // ---------- schede Accedi / Registrati ----------
  var tabA = $('tab-accedi'), tabR = $('tab-registrati'), titolo = $('acc-titolo'), lead = $('acc-lead');
  var TESTI = {
    accedi: ['Accedi al tuo <em>spazio</em>', 'Documenti, messaggi con Naomi e tappe del tuo percorso, in un posto solo.'],
    registrati: ['Crea il tuo <em>spazio</em>', 'Un account per seguire il tuo percorso con Naomi: documenti, messaggi e appuntamenti.']
  };
  function scheda(nome, fuoco) {
    var reg = nome === 'registrati';
    var cambia = function () {
      tabA.setAttribute('aria-selected', String(!reg)); tabR.setAttribute('aria-selected', String(reg));
      tabA.tabIndex = reg ? -1 : 0; tabR.tabIndex = reg ? 0 : -1;
      fAcc.hidden = reg; fReg.hidden = !reg;
      document.querySelector('.schede').classList.toggle('su-reg', reg);
      titolo.innerHTML = TESTI[nome][0]; lead.textContent = TESTI[nome][1];
      avviso('');
      if (fuoco) (reg ? $('reg-nome') : campo).focus({ preventScroll: true });
    };
    if (document.startViewTransition && !riduci && fuoco !== undefined) document.startViewTransition(cambia); else cambia();
    try { history.replaceState(null, '', location.pathname + (reg ? '?registrati=1' : '')); } catch (e) { }
  }
  tabA.addEventListener('click', function () { scheda('accedi', false); });
  tabR.addEventListener('click', function () { scheda('registrati', false); });
  [tabA, tabR].forEach(function (t) {
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var altro = t === tabA ? tabR : tabA; altro.click(); altro.focus(); }
    });
  });

  // apertura: ?registrati apre la registrazione, altrimenti si riparte dall'ultimo metodo usato
  try {
    var u = JSON.parse(localStorage.getItem(ULT) || 'null');
    if (u && u.provider) {
      var bu = document.querySelector('[data-provider="' + u.provider + '"]');
      if (bu && !bu.hidden) {
        bu.classList.add('ultimo'); bu.parentNode.insertBefore(bu, bu.parentNode.firstChild);
        var tag = document.createElement('small'); tag.className = 'ultimo-tag'; tag.textContent = 'Usato l\'ultima volta'; bu.appendChild(tag);
      }
    } else if (u && u.email) campo.value = u.email;
  } catch (e) { }
  if (q.has('registrati')) scheda('registrati');

  // ---------- mostra / nascondi password ----------
  document.querySelectorAll('.occhio').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = b.parentNode.querySelector('input'), vedi = i.type === 'password';
      i.type = vedi ? 'text' : 'password';
      b.setAttribute('aria-pressed', String(vedi)); b.setAttribute('aria-label', vedi ? 'Nascondi la password' : 'Mostra la password');
      i.focus();
    });
  });

  // ---------- robustezza della password ----------
  function forza(v) {
    if (!v) return 0;
    var p = 0;
    if (v.length >= 8) p++;
    if (v.length >= 12) p++;
    if (/[a-z]/i.test(v) && /\d/.test(v)) p++;
    if (/[^a-z0-9]/i.test(v) || (/[a-z]/.test(v) && /[A-Z]/.test(v))) p++;
    return v.length < 8 ? 1 : Math.max(1, Math.min(4, p));
  }
  var FRASI = ['Almeno 8 caratteri. Meglio se con lettere, numeri e un simbolo.', 'Troppo corta: servono almeno 8 caratteri.', 'Accettabile, ma si può fare di meglio.', 'Buona password.', 'Ottima password.'];
  function misuratore(input) {
    var box = input.closest('.f-acc').querySelector('.forza'), t = input.closest('.f-acc').querySelector('.forza-t');
    input.addEventListener('input', function () { var l = forza(input.value); box.setAttribute('data-livello', l); t.textContent = FRASI[l]; });
  }
  misuratore($('reg-pw')); misuratore($('nuova-pw'));

  // ---------- Google / LinkedIn ----------
  document.querySelectorAll('[data-provider]').forEach(function (b) {
    b.addEventListener('click', async function () {
      avviso(''); occupato(b, true); ricorda({ provider: b.getAttribute('data-provider') });
      var r = await NF.accedi(b.getAttribute('data-provider'), 'cliente');
      if (r.errore) { occupato(b, false); return avviso('Accesso non riuscito: ' + r.errore, true); }
      if (r.demo) avanti(r.demo); // nella versione reale il browser va già su Google o LinkedIn
      else setTimeout(function () { occupato(b, false); }, 8000);
    });
  });

  // ---------- accesso con email e password ----------
  fAcc.addEventListener('submit', async function (e) {
    e.preventDefault(); avviso('');
    var email = campo.value.trim(), invio = fAcc.querySelector('button[type=submit]');
    if (!EMAIL_OK.test(email)) return sbagliato(campo, 'Controlla l\'indirizzo email: sembra incompleto.');
    if (!pw.value) return sbagliato(pw, 'Scrivi la password. Se non l\'hai mai impostata usa "Password dimenticata?" o il link via email.');
    occupato(invio, true);
    var r = await NF.accediPassword(email, pw.value, ruoloDemo(email));
    occupato(invio, false);
    if (r.errore) { if (/non corretti/.test(r.errore)) { pw.select(); } return avviso(r.errore, true); }
    ricorda({ email: email });
    avanti(r.demo);
  });

  // ---------- registrazione ----------
  fReg.addEventListener('submit', async function (e) {
    e.preventDefault(); avviso('');
    var nome = $('reg-nome'), em = $('reg-email'), p = $('reg-pw'), ok = $('reg-ok'), invio = fReg.querySelector('button[type=submit]');
    if (nome.value.trim().length < 2) return sbagliato(nome, 'Scrivi il tuo nome e cognome.');
    if (!EMAIL_OK.test(em.value.trim())) return sbagliato(em, 'Controlla l\'indirizzo email: sembra incompleto.');
    if (p.value.length < 8) return sbagliato(p, 'La password deve avere almeno 8 caratteri.');
    if (!ok.checked) { ok.focus(); ok.closest('.spunta').classList.remove('errore'); ok.closest('.spunta').offsetWidth; ok.closest('.spunta').classList.add('errore'); return avviso('Per creare l\'account serve accettare termini e informativa privacy.', true); }
    occupato(invio, true);
    var email = em.value.trim();
    var r = await NF.registrati(nome.value.trim(), email, p.value);
    occupato(invio, false);
    if (r.errore) {
      avviso(r.errore, true);
      if (r.esiste) { campo.value = email; setTimeout(function () { scheda('accedi', true); avviso('Hai già un account con questa email: inserisci la password per entrare.'); }, 1400); }
      return;
    }
    ricorda({ email: email });
    if (r.conferma) return inviata('conferma', email);
    avanti(r.demo);
  });

  // ---------- link via email e password dimenticata ----------
  function emailPerLink() {
    var email = campo.value.trim();
    if (!EMAIL_OK.test(email)) { sbagliato(campo, 'Scrivi qui sopra la tua email, poi riprova.'); return null; }
    return email;
  }
  $('link-magico').addEventListener('click', async function () {
    avviso(''); var email = emailPerLink(); if (!email) return;
    var b = this; occupato(b, true);
    var r = await NF.accediEmail(email, ruoloDemo(email));
    occupato(b, false);
    if (r.errore) return avviso('Invio non riuscito: ' + r.errore, true);
    ricorda({ email: email });
    if (r.demo) return avanti(r.demo);
    inviata('link', email);
  });
  $('dimenticata').addEventListener('click', async function () {
    avviso(''); var email = emailPerLink(); if (!email) return;
    var b = this; occupato(b, true);
    var r = await NF.recuperaPassword(email);
    occupato(b, false);
    if (r.errore) return avviso('Invio non riuscito: ' + r.errore, true);
    inviata('recupero', email);
  });

  // ---------- schermata "controlla la tua email" ----------
  var reinvia = $('reinvia'), timer = null, modo = 'link', emailInviata = '';
  var INVIATA = {
    link: ['Controlla la tua email', 'Ti ho mandato un link di accesso a <b></b>. Vale per poco tempo e una sola volta.'],
    conferma: ['Conferma la tua email', 'Ho creato il tuo account. Per attivarlo apri il link di conferma che ti ho mandato a <b></b>: entrerai direttamente nella tua area.'],
    recupero: ['Reimposta la password', 'Se esiste un account con <b></b>, riceverai un link per scegliere una nuova password.']
  };
  function inviata(m, email) {
    modo = m; emailInviata = email;
    $('inviata-titolo').textContent = INVIATA[m][0];
    var t = $('inviata-testo'); t.innerHTML = INVIATA[m][1]; t.querySelector('b').textContent = email;
    mostraStato('inviata'); contoRovescia();
  }
  function contoRovescia() {
    var n = 60; reinvia.disabled = true; clearInterval(timer);
    var scrivi = function () { reinvia.textContent = n > 0 ? 'Reinvia tra ' + n + ' s' : 'Reinvia l\'email'; };
    scrivi();
    timer = setInterval(function () { n--; scrivi(); if (n <= 0) { clearInterval(timer); reinvia.disabled = false; } }, 1000);
  }
  reinvia.addEventListener('click', async function () {
    var r = modo === 'conferma' ? await NF.reinviaConferma(emailInviata) : modo === 'recupero' ? await NF.recuperaPassword(emailInviata) : await NF.accediEmail(emailInviata);
    if (r.errore) { mostraStato('scegli'); return avviso('Invio non riuscito: ' + r.errore, true); }
    contoRovescia();
  });
  $('cambia').addEventListener('click', function () {
    clearInterval(timer);
    if (modo === 'conferma') { campo.value = emailInviata; scheda('accedi'); }
    mostraStato('scegli'); setTimeout(function () { (modo === 'conferma' ? pw : campo).focus(); }, 60);
  });

  // ---------- nuova password (arrivo dal link di recupero) ----------
  var fNuova = $('f-nuova'), esitoN = $('nuova-esito');
  fNuova.addEventListener('submit', async function (e) {
    e.preventDefault(); avviso('', false, esitoN);
    var p1 = $('nuova-pw'), p2 = $('nuova-pw2'), invio = fNuova.querySelector('button[type=submit]');
    if (p1.value.length < 8) return sbagliato(p1, 'La password deve avere almeno 8 caratteri.', esitoN);
    if (p1.value !== p2.value) return sbagliato(p2, 'Le due password non coincidono.', esitoN);
    occupato(invio, true);
    var r = await NF.nuovaPassword(p1.value);
    occupato(invio, false);
    if (r.errore) return avviso(r.errore, true, esitoN);
    avanti(NF.live ? '' : 'cliente');
  });

  // ---------- all'apertura ----------
  if (q.get('nuova')) {
    NF.sessione().then(function (s) {
      if (s) { mostraStato('nuova'); setTimeout(function () { $('nuova-pw').focus(); }, 80); }
      else avviso('Il link per reimpostare la password è scaduto o è già stato usato. Richiedine un altro con "Password dimenticata?".', true);
    });
  } else {
    // se la sessione c'è già, niente modulo: si entra
    NF.sessione().then(function (s) { if (s) avanti(NF.live ? '' : (s.user.admin ? 'admin' : 'cliente')); });
  }

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
    luci.forEach(function (l) { var a = riduci ? l.a : l.a * (.55 + .45 * Math.sin(t * 1.4 + l.f)); ctx.fillStyle = l.rosa ? 'rgba(215,198,216,' + a + ')' : 'rgba(230,224,230,' + a + ')'; ctx.beginPath(); ctx.arc(l.x, l.y, l.r, 0, 6.283); ctx.fill(); });
    var testa = riduci ? .7 : Math.min(1.1, (t % 10) / 7.5), N = 36;
    for (var j = 0; j < N; j++) {
      var t0 = testa - .28 * (j + 1) / N, t1 = testa - .28 * j / N; if (t1 <= 0 || t0 >= 1) continue;
      var a0 = punto(Math.max(0, t0)), b0 = punto(Math.min(1, t1)), k2 = 1 - j / N;
      ctx.strokeStyle = 'rgba(' + Math.round(111 + 131 * k2) + ',' + Math.round(195 - 41 * k2) + ',' + Math.round(195 + 3 * k2) + ',' + (k2 * k2 * .9) + ')';
      ctx.lineWidth = .8 + 3.6 * k2 * k2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(b0.x, b0.y); ctx.stroke();
    }
    if (testa <= 1) { var h = punto(testa), g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 40); g.addColorStop(0, 'rgba(252,239,244,.9)'); g.addColorStop(.3, 'rgba(215,198,216,.45)'); g.addColorStop(1, 'rgba(162,69,106,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h.x, h.y, 40, 0, 6.283); ctx.fill(); }
    if (!riduci) requestAnimationFrame(disegna);
  }
  misura(); addEventListener('resize', function () { misura(); if (riduci) disegna(0); });
  disegna(0); if (!riduci) requestAnimationFrame(disegna);
})();
