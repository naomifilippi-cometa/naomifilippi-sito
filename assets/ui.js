/* Componenti comuni di area clienti e dashboard */
(function () {
  var NF = window.NF, esc = NF.esc;

  var LOGO = '<svg class="nf-logo" viewBox="0 0 100 100" aria-hidden="true" overflow="visible"><defs><radialGradient id="nfa-alone"><stop offset="0" stop-color="#FFF0F8"/><stop offset=".35" stop-color="#F29AC6" stop-opacity=".85"/><stop offset="1" stop-color="#D63384" stop-opacity="0"/></radialGradient><clipPath id="nfa-dietro"><rect x="-10" y="-10" width="120" height="63"/></clipPath><clipPath id="nfa-davanti"><rect x="-10" y="53" width="120" height="70"/></clipPath></defs><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" fill="none" stroke="#F3EAF0" stroke-opacity="0.3" stroke-width="1.4" stroke-dasharray="2 3.5" transform="rotate(-14 50 53)"/><g transform="rotate(-14 50 53)"><g clip-path="url(#nfa-dietro)"><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#6FC3C3" stroke-opacity="0.12" stroke-width="0.77" stroke-linecap="butt" stroke-dasharray="38.00 62.00" stroke-dashoffset="38.00"><animate attributeName="stroke-dashoffset" from="38.00" to="-62.00" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#7DBEC3" stroke-opacity="0.138" stroke-width="0.92" stroke-linecap="butt" stroke-dasharray="35.31 64.69" stroke-dashoffset="35.31"><animate attributeName="stroke-dashoffset" from="35.31" to="-64.69" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#8CBAC4" stroke-opacity="0.17" stroke-width="1.15" stroke-linecap="butt" stroke-dasharray="32.62 67.38" stroke-dashoffset="32.62"><animate attributeName="stroke-dashoffset" from="32.62" to="-67.38" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#9AB5C4" stroke-opacity="0.212" stroke-width="1.42" stroke-linecap="butt" stroke-dasharray="29.92 70.08" stroke-dashoffset="29.92"><animate attributeName="stroke-dashoffset" from="29.92" to="-70.08" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#A9B1C4" stroke-opacity="0.262" stroke-width="1.72" stroke-linecap="butt" stroke-dasharray="27.23 72.77" stroke-dashoffset="27.23"><animate attributeName="stroke-dashoffset" from="27.23" to="-72.77" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#B7ACC5" stroke-opacity="0.318" stroke-width="2.04" stroke-linecap="butt" stroke-dasharray="24.54 75.46" stroke-dashoffset="24.54"><animate attributeName="stroke-dashoffset" from="24.54" to="-75.46" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#C5A8C5" stroke-opacity="0.38" stroke-width="2.38" stroke-linecap="butt" stroke-dasharray="21.85 78.15" stroke-dashoffset="21.85"><animate attributeName="stroke-dashoffset" from="21.85" to="-78.15" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#D4A3C5" stroke-opacity="0.448" stroke-width="2.74" stroke-linecap="butt" stroke-dasharray="19.15 80.85" stroke-dashoffset="19.15"><animate attributeName="stroke-dashoffset" from="19.15" to="-80.85" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#E29FC6" stroke-opacity="0.521" stroke-width="3.12" stroke-linecap="butt" stroke-dasharray="16.46 83.54" stroke-dashoffset="16.46"><animate attributeName="stroke-dashoffset" from="16.46" to="-83.54" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F19AC6" stroke-opacity="0.598" stroke-width="3.51" stroke-linecap="butt" stroke-dasharray="13.77 86.23" stroke-dashoffset="13.77"><animate attributeName="stroke-dashoffset" from="13.77" to="-86.23" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F5AED2" stroke-opacity="0.68" stroke-width="3.91" stroke-linecap="butt" stroke-dasharray="11.08 88.92" stroke-dashoffset="11.08"><animate attributeName="stroke-dashoffset" from="11.08" to="-88.92" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F8C4DE" stroke-opacity="0.766" stroke-width="4.32" stroke-linecap="butt" stroke-dasharray="8.38 91.62" stroke-dashoffset="8.38"><animate attributeName="stroke-dashoffset" from="8.38" to="-91.62" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FCDAEB" stroke-opacity="0.856" stroke-width="4.75" stroke-linecap="butt" stroke-dasharray="5.69 94.31" stroke-dashoffset="5.69"><animate attributeName="stroke-dashoffset" from="5.69" to="-94.31" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FFF0F8" stroke-opacity="0.95" stroke-width="5.19" stroke-linecap="round" stroke-dasharray="3.00 97.00" stroke-dashoffset="3.00"><animate attributeName="stroke-dashoffset" from="3.00" to="-97.00" dur="7s" repeatCount="indefinite"/></path><g><g transform="scale(1.7)"><circle r="9" fill="url(#nfa-alone)"/><path d="M0 -6 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" fill="#FFF0F8"/></g><animateMotion dur="7s" repeatCount="indefinite" path="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/></g></g></g><g class="nf-lettere" fill="#F3EAF0"><path transform="translate(6.47 73) scale(0.03067 -0.03067)" d="M300.2132568359375 1500V39H534.089599609375V0H54.2132568359375V39H259.2132568359375V1461H54.2132568359375V1500ZM1502.04541015625 1500V1461H1291.2813720703125V-20H1237.04541015625L271.44921875 1500H567.2825927734375L1251.04541015625 404.5645751953125V1461H1022.6409912109375V1500Z"/><path transform="translate(55.39 73) scale(0.03067 -0.03067)" d="M804.8662109375 517.123046875Q797.787353515625 584.123046875 768.8939819335938 630.84228515625Q740.0006103515625 677.5615234375 685.6185913085938 702.1627807617188Q631.236572265625 726.7640380859375 548.955810546875 726.7640380859375H418.1917724609375V765.2359619140625H548.955810546875Q631.236572265625 765.2359619140625 685.6185913085938 786.9552001953125Q740.0006103515625 808.6744384765625 768.8939819335938 852.7756958007812Q797.787353515625 896.876953125 804.8662109375 963.876953125H844.6302490234375V517.123046875ZM1135.1917724609375 1500V1090H1095.955810546875Q1088.876953125 1197 1051.741943359375 1281.0Q1014.60693359375 1365 941.9214477539062 1413.0Q869.2359619140625 1461 754.5955810546875 1461H481.8441162109375V39H681.080078125V0H54.2132568359375V39H234.44921875V1461H54.2132568359375V1500Z"/></g><g transform="rotate(-14 50 53)"><g clip-path="url(#nfa-davanti)"><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#6FC3C3" stroke-opacity="0.12" stroke-width="0.77" stroke-linecap="butt" stroke-dasharray="38.00 62.00" stroke-dashoffset="38.00"><animate attributeName="stroke-dashoffset" from="38.00" to="-62.00" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#7DBEC3" stroke-opacity="0.138" stroke-width="0.92" stroke-linecap="butt" stroke-dasharray="35.31 64.69" stroke-dashoffset="35.31"><animate attributeName="stroke-dashoffset" from="35.31" to="-64.69" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#8CBAC4" stroke-opacity="0.17" stroke-width="1.15" stroke-linecap="butt" stroke-dasharray="32.62 67.38" stroke-dashoffset="32.62"><animate attributeName="stroke-dashoffset" from="32.62" to="-67.38" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#9AB5C4" stroke-opacity="0.212" stroke-width="1.42" stroke-linecap="butt" stroke-dasharray="29.92 70.08" stroke-dashoffset="29.92"><animate attributeName="stroke-dashoffset" from="29.92" to="-70.08" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#A9B1C4" stroke-opacity="0.262" stroke-width="1.72" stroke-linecap="butt" stroke-dasharray="27.23 72.77" stroke-dashoffset="27.23"><animate attributeName="stroke-dashoffset" from="27.23" to="-72.77" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#B7ACC5" stroke-opacity="0.318" stroke-width="2.04" stroke-linecap="butt" stroke-dasharray="24.54 75.46" stroke-dashoffset="24.54"><animate attributeName="stroke-dashoffset" from="24.54" to="-75.46" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#C5A8C5" stroke-opacity="0.38" stroke-width="2.38" stroke-linecap="butt" stroke-dasharray="21.85 78.15" stroke-dashoffset="21.85"><animate attributeName="stroke-dashoffset" from="21.85" to="-78.15" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#D4A3C5" stroke-opacity="0.448" stroke-width="2.74" stroke-linecap="butt" stroke-dasharray="19.15 80.85" stroke-dashoffset="19.15"><animate attributeName="stroke-dashoffset" from="19.15" to="-80.85" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#E29FC6" stroke-opacity="0.521" stroke-width="3.12" stroke-linecap="butt" stroke-dasharray="16.46 83.54" stroke-dashoffset="16.46"><animate attributeName="stroke-dashoffset" from="16.46" to="-83.54" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F19AC6" stroke-opacity="0.598" stroke-width="3.51" stroke-linecap="butt" stroke-dasharray="13.77 86.23" stroke-dashoffset="13.77"><animate attributeName="stroke-dashoffset" from="13.77" to="-86.23" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F5AED2" stroke-opacity="0.68" stroke-width="3.91" stroke-linecap="butt" stroke-dasharray="11.08 88.92" stroke-dashoffset="11.08"><animate attributeName="stroke-dashoffset" from="11.08" to="-88.92" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#F8C4DE" stroke-opacity="0.766" stroke-width="4.32" stroke-linecap="butt" stroke-dasharray="8.38 91.62" stroke-dashoffset="8.38"><animate attributeName="stroke-dashoffset" from="8.38" to="-91.62" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FCDAEB" stroke-opacity="0.856" stroke-width="4.75" stroke-linecap="butt" stroke-dasharray="5.69 94.31" stroke-dashoffset="5.69"><animate attributeName="stroke-dashoffset" from="5.69" to="-94.31" dur="7s" repeatCount="indefinite"/></path><path d="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" pathLength="100" fill="none" stroke="#FFF0F8" stroke-opacity="0.95" stroke-width="5.19" stroke-linecap="round" stroke-dasharray="3.00 97.00" stroke-dashoffset="3.00"><animate attributeName="stroke-dashoffset" from="3.00" to="-97.00" dur="7s" repeatCount="indefinite"/></path><g><g transform="scale(1.7)"><circle r="9" fill="url(#nfa-alone)"/><path d="M0 -6 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" fill="#FFF0F8"/></g><animateMotion dur="7s" repeatCount="indefinite" path="M0 53 a50 16 0 1 0 100 0 a50 16 0 1 0 -100 0" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/></g></g></g></svg>';

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
