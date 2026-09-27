/* Comportamenti comuni delle pagine pubbliche */
(function () {
  var C = window.NF_CONFIG || {};

  // link WhatsApp coerenti con la configurazione
  function waLink(testo) {
    return 'https://wa.me/' + (C.WHATSAPP || '393887528320') + '?text=' + encodeURIComponent(testo || C.WHATSAPP_TESTO || '');
  }
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(a.getAttribute('data-wa') || C.WHATSAPP_TESTO);
  });

  // email: mostrata solo se configurata
  document.querySelectorAll('[data-email]').forEach(function (el) {
    if (C.EMAIL) { el.textContent = C.EMAIL; if (el.tagName === 'A') el.href = 'mailto:' + C.EMAIL; }
  });

  // copia negli appunti (email, numero)
  document.querySelectorAll('[data-copia]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copia');
      var fatto = function () { var o = b.textContent; b.textContent = 'Copiato'; setTimeout(function () { b.textContent = o; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(fatto, fatto); else fatto();
    });
  });

  // modulo contatti
  var f = document.getElementById('form-contatti');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var out = document.getElementById('esito');
    var d = Object.fromEntries(new FormData(f).entries());
    if (!d.nome || !/.+@.+\..+/.test(d.email || '') || !d.privacy) {
      out.hidden = false; out.className = 'esito ko';
      out.textContent = 'Inserisci nome, un indirizzo email valido e conferma di aver letto l\'informativa privacy.';
      return;
    }
    var testoWa = 'Ciao Naomi, sono ' + d.nome + ' (' + d.email + (d.telefono ? ', ' + d.telefono : '') + '). ' +
      (d.servizio ? 'Mi interessa: ' + d.servizio + '. ' : '') + (d.messaggio || '');
    if (C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase) {
      var sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
      var btn = f.querySelector('button[type=submit]'); btn.disabled = true;
      sb.from('richieste').insert({ nome: d.nome, email: d.email, telefono: d.telefono || null, servizio: d.servizio || null, messaggio: d.messaggio || null, origine: 'contatti' })
        .then(function (r) {
          btn.disabled = false; out.hidden = false;
          if (r.error) { out.className = 'esito ko'; out.textContent = 'Invio non riuscito. Puoi scrivermi su WhatsApp: rispondo lo stesso giorno.'; return; }
          out.className = 'esito ok'; out.textContent = 'Messaggio inviato. Ti rispondo entro 24 ore lavorative.'; f.reset();
        });
    } else {
      out.hidden = false; out.className = 'esito ok';
      out.innerHTML = 'Il modulo online sarà attivo a breve. Nel frattempo puoi inviare lo stesso messaggio su WhatsApp: ' +
        '<a class="btn btn-wa" style="margin-top:10px" target="_blank" rel="noopener" href="' + waLink(testoWa) + '">Invia su WhatsApp</a>';
    }
  });

  // prenota: servizio o percorso scelto da un'altra pagina (?servizio=… o ?percorso=…)
  var scelta = document.querySelector('[data-scelta]');
  if (scelta) {
    var q = new URLSearchParams(location.search), v = (q.get('percorso') || q.get('servizio') || '').slice(0, 60);
    if (v) {
      scelta.textContent = 'Hai scelto: ' + (q.get('percorso') ? 'percorso ' : '') + v + '. Ne parliamo nella call.';
      scelta.hidden = false;
      var wp = document.getElementById('wa-prenota');
      if (wp) wp.href = waLink('Ciao Naomi, vorrei prenotare la call conoscitiva gratuita (mi interessa: ' + v + '). Sono disponibile: ');
    }
  }

  // FAQ: ricerca e filtro per argomento
  var cerca = document.getElementById('cerca-faq');
  if (cerca) {
    var gruppi = [].slice.call(document.querySelectorAll('.faq-gruppo')), chips = [].slice.call(document.querySelectorAll('.chip')), nessuna = document.querySelector('.nessuna');
    var gruppo = '';
    gruppi.forEach(function (g) { g.querySelectorAll('details').forEach(function (d) { d._q = d.querySelector('summary').textContent; d._a = d.querySelector('p').textContent; }); });
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var escH = function (x) { return x.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
    var evid = function (testo, t) {
      var i = t ? norm(testo).indexOf(t) : -1;
      if (i < 0) return escH(testo);
      return escH(testo.slice(0, i)) + '<mark>' + escH(testo.slice(i, i + t.length)) + '</mark>' + escH(testo.slice(i + t.length));
    };
    var filtra = function () {
      var t = norm(cerca.value.trim()), visibili = 0;
      gruppi.forEach(function (g) {
        var n = 0, okGruppo = !gruppo || g.getAttribute('data-gruppo') === gruppo;
        g.querySelectorAll('details').forEach(function (d) {
          var ok = okGruppo && (!t || norm(d._q + ' ' + d._a).indexOf(t) >= 0);
          d.hidden = !ok; if (ok) n++;
          d.querySelector('summary').innerHTML = evid(d._q, t.length > 1 ? t : '');
          if (t.length > 2 && ok && norm(d._a).indexOf(t) >= 0) d.open = true;
        });
        g.hidden = !n; visibili += n;
      });
      nessuna.hidden = visibili > 0;
    };
    cerca.addEventListener('input', filtra);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        gruppo = c.getAttribute('data-gruppo');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        var agg = function () { filtra(); };
        if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(agg); else agg();
      });
    });
    var h = location.hash.slice(1);
    if (h) { var c0 = chips.find(function (c) { return c.getAttribute('data-gruppo') === h; }); if (c0) c0.click(); }
  }

  // calendario: caricato solo dopo il clic (il servizio esterno può usare cookie propri)
  var cal = document.getElementById('mostra-calendario');
  if (cal) {
    if (!C.CALENDARIO_URL) { cal.closest('[data-calendario]').hidden = true; var alt = document.querySelector('[data-senza-calendario]'); if (alt) alt.hidden = false; }
    else cal.addEventListener('click', function () {
      var box = document.getElementById('calendario'), url = new URL(C.CALENDARIO_URL), link = url.pathname.replace(/^\/+/, '');
      box.classList.add('cal-box');
      box.innerHTML = '<div class="cal-attesa" role="status"><span class="spin" aria-hidden="true"></span>Carico il calendario…</div><div id="cal-inline" style="width:100%;min-height:560px"></div>' +
        '<p class="cal-riserva">Il calendario non si apre? <a href="' + C.CALENDARIO_URL + '" target="_blank" rel="noopener">Aprilo in una nuova scheda</a></p>';
      cal.hidden = true;
      // embed ufficiale di Cal.com (inline)
      (function (W, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = W.document; W.Cal = W.Cal || function () { var c = W.Cal, ar = arguments; if (!c.loaded) { c.ns = {}; c.q = c.q || []; d.head.appendChild(d.createElement('script')).src = A; c.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }, ns = ar[1]; api.q = api.q || []; if (typeof ns === 'string') { c.ns[ns] = c.ns[ns] || api; p(c.ns[ns], ar); p(c, ['initNamespace', ns]); } else p(c, ar); return; } p(c, ar); }; })(window, url.origin.replace('://cal.com', '://app.cal.com') + '/embed/embed.js', 'init');
      Cal('init', 'call', { origin: url.origin });
      Cal.ns.call('inline', { elementOrSelector: '#cal-inline', calLink: link, config: { layout: 'month_view', theme: 'light' } });
      Cal.ns.call('ui', { theme: 'light', hideEventTypeDetails: false, layout: 'month_view', cssVarsPerTheme: { light: { 'cal-brand': '#B42A72' } } });
      Cal.ns.call('on', { action: 'linkReady', callback: function () { var a = box.querySelector('.cal-attesa'); if (a) a.remove(); } });
      setTimeout(function () { var a = box.querySelector('.cal-attesa'); if (a) a.remove(); }, 8000);
    });
  }
})();
