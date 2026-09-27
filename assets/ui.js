/* Componenti comuni di area clienti e dashboard */
(function () {
  var NF = window.NF, esc = NF.esc;

  var LOGO = '<svg class="cometa" viewBox="0 0 48 40" aria-hidden="true"><defs><linearGradient id="coda" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#157A7E" stop-opacity="0"/><stop offset=".55" stop-color="#6FC3C3"/><stop offset="1" stop-color="#F29AC6"/></linearGradient><radialGradient id="alone"><stop offset="0" stop-color="#FFF0F8"/><stop offset=".4" stop-color="#F29AC6" stop-opacity=".75"/><stop offset="1" stop-color="#D63384" stop-opacity="0"/></radialGradient></defs><path class="c1" d="M3 35 C 14 31, 24 23, 35 11" fill="none" stroke="url(#coda)" stroke-width="2.6" stroke-linecap="round" pathLength="100"/><path class="c2" d="M9 38 C 19 33, 27 26, 35 13" fill="none" stroke="url(#coda)" stroke-width="1.2" stroke-linecap="round" pathLength="100"/><circle class="alone" cx="36" cy="10" r="10" fill="url(#alone)"/><path class="stella" d="M36 2.5 l1.7 5.8 5.8 1.7 -5.8 1.7 -1.7 5.8 -1.7 -5.8 -5.8 -1.7 5.8 -1.7z" fill="#FFF0F8"/></svg>';

  function toast(msg, errore) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.toggle('errore', !!errore); t.classList.add('visibile');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('visibile'); }, errore ? 5000 : 2600);
  }

  function demoBar(testo) {
    if (NF.live) return '';
    return '<div class="demo-bar"><b>Modalità demo</b> · ' + testo + ' I dati sono di esempio e non vengono salvati.</div>';
  }

  function avatar(p, grande) {
    var cls = 'avatar' + (grande ? ' grande' : '');
    if (p && p.avatar_url) return '<span class="' + cls + '"><img src="' + esc(p.avatar_url) + '" alt="" referrerpolicy="no-referrer"></span>';
    return '<span class="' + cls + '" aria-hidden="true">' + esc(NF.iniziali(p && (p.nome || p.email))) + '</span>';
  }

  var riduci = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- animazioni ----------
  // numeri che contano fino al valore
  function conta(root) {
    (root || document).querySelectorAll('[data-conta]').forEach(function (el) {
      var fine = +el.getAttribute('data-conta'); if (riduci || !fine) { el.textContent = fine; return; }
      var t0 = null, dur = 800 + Math.min(600, fine * 40);
      (function passo(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(fine * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(passo); })(performance.now());
    });
  }
  // elementi nuovi (arrivati dopo il primo disegno) si illuminano
  function segnaNuovi(box, sel) {
    var ids = [].slice.call(box.querySelectorAll(sel)).map(function (el) { return el.getAttribute('data-id'); });
    if (box._visti) box.querySelectorAll(sel).forEach(function (el) { if (!box._visti[el.getAttribute('data-id')]) el.classList.add('nuovo'); });
    box._visti = {}; ids.forEach(function (i) { box._visti[i] = 1; });
  }
  // cambio di vista con View Transitions, se il browser le supporta
  function transizione(fn) {
    if (document.startViewTransition && !riduci) { var t = document.startViewTransition(fn); return t.updateCallbackDone; }
    return Promise.resolve(fn());
  }
  // "sta scrivendo…" in fondo alla conversazione
  function scrive(box, nome) {
    if (!box) return;
    var el = box.querySelector('.digitando');
    if (!el) { el = document.createElement('div'); el.className = 'msg digitando'; el.innerHTML = '<div class="bolla" aria-hidden="true"><i></i><i></i><i></i></div><div class="info"></div>'; box.appendChild(el); }
    el.querySelector('.info').textContent = nome + ' sta scrivendo…';
    box.scrollTo({ top: box.scrollHeight, behavior: riduci ? 'instant' : 'smooth' });
    clearTimeout(el._h); el._h = setTimeout(function () { el.remove(); }, 4500);
  }
  function saluto() { var h = new Date().getHours(); return h < 5 ? 'Buonasera' : h < 13 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera'; }

  // ---------- elenco documenti ----------
  function estensione(n) { var m = /\.([a-z0-9]{2,5})$/i.exec(n || ''); return m ? m[1].toUpperCase() : 'FILE'; }
  function righeDocumenti(docs, opz) {
    if (!docs.length) return '<div class="vuoto">' + esc(opz.vuoto) + '</div>';
    return '<ul class="doc-lista">' + docs.map(function (d) {
      var puoEliminare = opz.eliminaTutti || !d.da_naomi;
      return '<li class="doc' + (d.da_naomi ? ' da-naomi' : '') + '" data-id="' + esc(d.id) + '">' +
        '<span class="icona">' + esc(estensione(d.nome)) + '</span>' +
        '<div style="min-width:0"><div class="nome">' + esc(d.nome) + '</div><div class="meta">' +
        (d.da_naomi ? '<span class="pill naomi">Da Naomi</span>' : '<span>' + esc(NF.CATEGORIE[d.categoria] || 'Documento') + '</span>') +
        '<span>' + esc(NF.quando(d.creato_il)) + '</span><span>' + esc(NF.peso(d.dimensione)) + '</span></div></div>' +
        '<div class="azioni"><button class="icon-btn" data-az="scarica" type="button" aria-label="Scarica ' + esc(d.nome) + '">Scarica</button>' +
        '<button class="icon-btn" data-az="commenta" type="button" aria-label="Commenta ' + esc(d.nome) + '">Commenta</button>' +
        (puoEliminare ? '<button class="icon-btn pericolo" data-az="elimina" type="button" aria-label="Elimina ' + esc(d.nome) + '">Elimina</button>' : '') +
        '</div></li>';
    }).join('') + '</ul>';
  }
  function collegaDocumenti(box, docs, azioni) {
    box.querySelectorAll('.doc').forEach(function (li) {
      var d = docs.find(function (x) { return x.id === li.getAttribute('data-id'); });
      li.querySelectorAll('[data-az]').forEach(function (b) {
        b.addEventListener('click', async function () {
          var az = b.getAttribute('data-az');
          if (az === 'scarica') {
            var url = await NF.linkDownload(d);
            if (!url) return toast(NF.live ? 'Download non riuscito, riprova.' : 'In modalità demo si possono scaricare solo i file caricati in questa sessione.', true);
            var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.download = d.nome; document.body.appendChild(a); a.click(); a.remove();
          }
          if (az === 'commenta') azioni.commenta(d);
          if (az === 'elimina') {
            if (b.dataset.conferma !== '1') { b.dataset.conferma = '1'; b.textContent = 'Confermi?'; setTimeout(function () { b.dataset.conferma = ''; b.textContent = 'Elimina'; }, 3500); return; }
            var r = await NF.eliminaDocumento(d); if (r.errore) toast(r.errore, true); else { toast('Documento eliminato'); azioni.aggiorna(); }
          }
        });
      });
    });
  }

  // ---------- caricamento ----------
  function dropzone(box, opz) {
    var cats = Object.keys(NF.CATEGORIE).filter(function (k) { return opz.naomi ? true : k !== 'consegna'; });
    box.innerHTML = '<div class="dropzone"><b>' + esc(opz.titolo) + '</b><small>Trascina qui i file oppure sceglili · PDF, Word, immagini · max ' + (window.NF_CONFIG.MAX_FILE_MB || 20) + ' MB</small>' +
      '<span class="riga"><select aria-label="Tipo di documento" id="' + opz.id + '-cat">' + cats.map(function (k) { return '<option value="' + k + '"' + (k === (opz.naomi ? 'consegna' : 'cv') ? ' selected' : '') + '>' + esc(NF.CATEGORIE[k]) + '</option>'; }).join('') + '</select>' +
      '<label class="btn btn-scuro" for="' + opz.id + '" style="min-height:44px">Scegli file</label></span>' +
      '<input id="' + opz.id + '" type="file" multiple accept=".pdf,.doc,.docx,.odt,.txt,.jpg,.jpeg,.png,.webp" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none">' +
      '<span class="progresso" hidden><i></i></span></div>';
    var z = box.querySelector('.dropzone'), inp = box.querySelector('input[type=file]'), sel = box.querySelector('select'), bar = box.querySelector('.progresso');
    z.style.position = 'relative';
    ['dragenter', 'dragover'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.add('sopra'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.remove('sopra'); }); });
    z.addEventListener('drop', function (e) { invia(e.dataTransfer.files); });
    inp.addEventListener('change', function () { invia(inp.files); inp.value = ''; });
    async function invia(files) {
      files = Array.prototype.slice.call(files || []); if (!files.length) return;
      bar.hidden = false; var fatti = 0, errori = [];
      for (var i = 0; i < files.length; i++) {
        bar.firstChild.style.width = Math.round((i / files.length) * 100) + '%';
        var r = await NF.carica(opz.clienteId(), files[i], sel.value, opz.naomi);
        if (r.errore) errori.push(r.errore); else fatti++;
      }
      bar.firstChild.style.width = '100%'; setTimeout(function () { bar.hidden = true; bar.firstChild.style.width = '0'; }, 600);
      if (errori.length) toast(errori[0], true); else { toast(fatti === 1 ? 'Documento caricato' : fatti + ' documenti caricati'); z.classList.remove('fatto'); z.offsetWidth; z.classList.add('fatto'); setTimeout(function () { z.classList.remove('fatto'); }, 1400); }
      opz.dopo();
    }
  }

  // ---------- conversazione ----------
  function chat(box, messaggi, docs, opz) {
    if (!messaggi.length) { box.innerHTML = '<div class="vuoto">' + esc(opz.vuoto) + '</div>'; return; }
    var ultimoGiorno = '', out = '';
    messaggi.forEach(function (m) {
      var g = new Date(m.creato_il).toDateString();
      if (g !== ultimoGiorno) { ultimoGiorno = g; out += '<div class="giorno-sep">' + esc(NF.fmtData.format(new Date(m.creato_il))) + '</div>'; }
      var mio = opz.naomi ? m.da_naomi : !m.da_naomi;
      var doc = m.documento_id ? docs.find(function (d) { return d.id === m.documento_id; }) : null;
      out += '<div class="msg' + (mio ? ' mio' : '') + '" data-id="' + esc(m.id) + '">' +
        (doc ? '<span class="rif">📎 ' + esc(doc.nome) + '</span>' : '') +
        '<div class="bolla">' + esc(m.testo) + '</div>' +
        '<div class="info">' + esc(m.da_naomi ? 'Naomi' : (opz.nomeCliente || 'Cliente')) + ' · ' + esc(NF.quando(m.creato_il)) + (mio && m.letto ? ' · letto' : '') + '</div></div>';
    });
    var scriveva = box.querySelector('.digitando');
    box.innerHTML = out;
    segnaNuovi(box, '.msg[data-id]');
    if (scriveva && !box.querySelector('.msg.nuovo:not(.mio)')) box.appendChild(scriveva);
    requestAnimationFrame(function () { box.scrollTo({ top: box.scrollHeight, behavior: 'instant' }); });
  }
  function composer(box, opz) {
    box.innerHTML = '<form class="scrivi"><div class="riferimento" hidden><span></span><button type="button" class="icon-btn" aria-label="Rimuovi riferimento al documento">×</button></div>' +
      '<div class="riga"><label for="' + opz.id + '" class="sr" style="position:absolute;left:-9999px">Messaggio</label><textarea id="' + opz.id + '" rows="2" placeholder="' + esc(opz.placeholder) + '"></textarea>' +
      '<button class="btn btn-lume" type="submit">Invia</button></div><small class="sotto">Invio con Ctrl+Invio o ⌘+Invio</small></form>';
    var f = box.querySelector('form'), ta = f.querySelector('textarea'), rif = f.querySelector('.riferimento'), docId = null;
    rif.querySelector('button').addEventListener('click', function () { docId = null; rif.hidden = true; });
    ta.addEventListener('input', function () { if (opz.suScrittura && ta.value.trim()) opz.suScrittura(); });
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); f.requestSubmit(); } });
    f.addEventListener('submit', async function (e) {
      e.preventDefault(); var b = f.querySelector('button[type=submit]'); b.disabled = true;
      var r = await NF.scrivi(opz.clienteId(), ta.value, docId, opz.naomi); b.disabled = false;
      if (r.errore) return toast(r.errore, true);
      ta.value = ''; docId = null; rif.hidden = true; opz.dopo();
    });
    return {
      riferisci: function (d) { docId = d.id; rif.hidden = false; rif.querySelector('span').textContent = '📎 Sul documento: ' + d.nome; ta.focus(); box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    };
  }

  window.UI = { LOGO: LOGO, toast: toast, demoBar: demoBar, avatar: avatar, righeDocumenti: righeDocumenti, collegaDocumenti: collegaDocumenti, dropzone: dropzone, chat: chat, composer: composer,
    conta: conta, segnaNuovi: segnaNuovi, transizione: transizione, scrive: scrive, saluto: saluto, riduci: riduci };
})();
