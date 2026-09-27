/* Interazioni delle sezioni: fase, listino, calcolatore, metodo, audit, cielo della home. Ogni blocco si attiva solo se la sezione è nella pagina. */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* stagger hero words */
  document.querySelectorAll('#titolo .w').forEach(function(w,i){ w.style.animationDelay = (0.08*i)+'s'; });

  /* ---------- fase selector ---------- */
  var FASI = {
    neo:{t:"Il primo ruolo giusto, non il primo che capita.",
         p:"Trasformiamo stage, tesi ed esperienze brevi in un profilo che un recruiter prende sul serio, e ti alleniamo al primo colloquio vero.",
         b:"Primo Passo · 299 €", liv:0,
         l:["CV da neolaureato ottimizzato per ATS","LinkedIn che si fa trovare dai recruiter","Cover letter modulare","Simulazione del primo colloquio"]},
    crescita:{t:"Il salto di ruolo che aspetti da un po'.",
         p:"Raccontiamo i risultati che hai ottenuto, ti prepariamo ai colloqui per il livello successivo e arriviamo all'offerta con i numeri giusti.",
         b:"Ascesa · 690 €", liv:1,
         l:["CV centrato sui risultati misurabili","2 sessioni di coaching sulla strategia","Colloquio simulato sul ruolo target","Sessione strategica sull'offerta"]},
    cambio:{t:"Cambiare settore senza ripartire da zero.",
         p:"Partiamo dall'orientamento: competenze trasferibili, ruoli compatibili, un piano a 90 giorni. Poi riscriviamo la tua storia per il nuovo mercato.",
         b:"Ascesa con percorso di orientamento", liv:1,
         l:["Percorso di orientamento in 4 sessioni","Mappa delle competenze trasferibili","CV e LinkedIn riposizionati","Preparazione ai colloqui nel nuovo settore"]},
    senior:{t:"Posizionamento executive e trattativa fino alla firma.",
         p:"Documenti bilingue, strategia di ricerca riservata e un affiancamento sulla negoziazione di pacchetto, benefit e clausole.",
         b:"Costellazione · 1.390 €", liv:2,
         l:["Executive CV e LinkedIn in italiano e inglese","Percorso strategico in 4 sessioni","2 simulazioni con panel","Offer Sprint e affiancamento per 3 mesi"]}
  };
  var tabs = document.querySelectorAll('.tab[data-fase]'), pannello = document.querySelector('.fase-panel');
  function setFase(k, anima){
    var f = FASI[k];
    if (!document.getElementById('f-titolo')) return;
    if (anima && !reduce && pannello && pannello.animate) pannello.animate([{opacity:.25, transform:'translateY(10px)'},{opacity:1, transform:'none'}], {duration:420, easing:'cubic-bezier(.22,1,.36,1)'});
    tabs.forEach(function(t){ t.setAttribute('aria-selected', t.dataset.fase===k ? 'true':'false'); });
    document.getElementById('f-titolo').textContent = f.t;
    document.getElementById('f-testo').textContent = f.p;
    document.getElementById('f-bundle').textContent = f.b;
    document.getElementById('f-lista').innerHTML = f.l.map(function(x){return '<li>'+x+'</li>';}).join('');
    setLiv(f.liv);
  }
  tabs.forEach(function(t){ t.addEventListener('click', function(){ setFase(t.dataset.fase, true); }); });

  /* ---------- listino ---------- */
  var LISTINO = [
    ["Revisione CV con feedback commentato","Correzioni e suggerimenti sul tuo CV attuale",[79,99,129]],
    ["Riscrittura CV completa","Intervista + 2 revisioni",[149,229,390]],
    ["Ottimizzazione profilo LinkedIn","Headline, Informazioni, esperienze, parole chiave",[129,190,290]],
    ["Cover letter","39 € se inclusa in un percorso",[59,69,89]],
    ["Sessione di orientamento","60 minuti + riepilogo scritto",[110,110,150]],
    ["Percorso di orientamento","4 sessioni + piano d'azione a 90 giorni",[390,390,540]],
    ["Simulazione colloquio","60 minuti, registrazione e report",[119,139,179]],
    ["Sessione strategica sull'offerta","60 minuti + benchmark retributivo",[149,149,199],true],
    ["Offer Sprint","2 videochiamate, script e supporto email per 14 giorni",[null,349,590],true]
  ];
  var eur = new Intl.NumberFormat('it-IT');
  var seg = document.querySelectorAll('.seg button');
  function setLiv(i){
    if (!document.getElementById('listino')) return;
    seg.forEach(function(b){ b.setAttribute('aria-pressed', +b.dataset.liv===i ? 'true':'false'); });
    document.getElementById('listino').innerHTML = LISTINO.map(function(r){
      var v = r[2][i];
      return '<tr'+(r[3]?' class="hl"':'')+'><td>'+r[0]+'<small>'+r[1]+'</small></td><td class="p">'+(v==null?'n.d.':eur.format(v)+' €')+'</td></tr>';
    }).join('');
  }
  seg.forEach(function(b){ b.addEventListener('click', function(){ setLiv(+b.dataset.liv); }); });
  if (tabs.length) setFase('neo');
  setLiv(1);

  /* ---------- calcolatore ---------- */
  var ral = document.getElementById('ral'), pct = document.getElementById('pct');
  if (ral && pct) {
  function calc(){
    var base = Math.max(0, +ral.value || 0), p = (+pct.value)/100, tot = 0;
    for (var k=0;k<5;k++) tot += base*p*Math.pow(1.03,k);
    document.getElementById('pct-out').textContent = '+'+pct.value+'%';
    document.getElementById('anno1').textContent = '+'+eur.format(Math.round(base*p))+' €';
    document.getElementById('cinque').textContent = '+'+eur.format(Math.round(tot/10)*10)+' €';
  }
  ral.addEventListener('input', calc); pct.addEventListener('input', calc); calc();
  }

  /* ---------- metodo: progresso allo scroll ---------- */
  var tappe = document.getElementById('tappe');
  if (tappe) {
  var items = tappe.querySelectorAll('.tappa');
  function prog(){
    var r = tappe.getBoundingClientRect(), vh = innerHeight;
    var p = Math.min(1, Math.max(0, (vh*0.8 - r.top) / (r.height + vh*0.35)));
    if (reduce) p = 1;
    tappe.style.setProperty('--p', p.toFixed(3));
    items.forEach(function(it,i){ it.classList.toggle('on', p >= (i/items.length) + 0.02 || p===1); });
  }
  addEventListener('scroll', prog, {passive:true}); addEventListener('resize', prog); prog();
  }

  /* ---------- form ---------- */
  var fa = document.getElementById('form-audit');
  if (fa) fa.addEventListener('submit', function(e){
    e.preventDefault();
    var f = e.target, ok = document.getElementById('ok'), C = window.NF_CONFIG || {};
    if (!f.nome.value.trim() || !/.+@.+\..+/.test(f.email.value)) { f.reportValidity && f.reportValidity(); return; }
    var d = { nome: f.nome.value.trim(), email: f.email.value.trim(), linkedin: f.li.value.trim() || null, messaggio: 'Obiettivo: ' + f.obiettivo.value, origine: 'audit' };
    var testoWa = 'Ciao Naomi, sono ' + d.nome + ' (' + d.email + '). Vorrei l\'audit gratuito del mio profilo' + (d.linkedin ? ': ' + d.linkedin : '') + '. ' + d.messaggio;
    if (C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase) {
      window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY).from('richieste').insert(d).then(function(r){
        ok.hidden = false;
        ok.textContent = r.error ? 'Invio non riuscito: scrivimi su WhatsApp, rispondo lo stesso giorno.' : 'Richiesta inviata. Ricevi il report entro 48 ore.';
        if (!r.error) f.reset();
      });
    } else {
      ok.hidden = false;
      ok.innerHTML = 'Il modulo online sarà attivo a breve. Intanto puoi inviare la richiesta su WhatsApp: <a style="color:#fff;font-weight:600" target="_blank" rel="noopener" href="https://wa.me/' + (C.WHATSAPP || '393887528320') + '?text=' + encodeURIComponent(testoWa) + '">apri WhatsApp</a>.';
    }
  });

  /* ---------- hero: cielo stellato e cometa ---------- */
  var cv = document.getElementById('cielo');
  if (!cv) return;
  var ctx = cv.getContext('2d'), W, H, dpr, luci = [];
  function size(){
    dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    luci = []; var n = Math.round(W*H/9000);
    for (var i=0;i<n;i++) luci.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*2.2+.4, a:Math.random()*.55+.15, v:Math.random()*10+4, f:Math.random()*6.28, rosa:Math.random()<.35, bokeh:Math.random()<.08});
  }
  function pt(t){ /* il percorso: dal basso a sinistra all'alto a destra */
    var x0=-.05*W, y0=H*1.02, x1=W*.42, y1=H*.95, x2=W*.72, y2=H*.35, x3=W*1.05, y3=H*.02, u=1-t;
    return {x:u*u*u*x0+3*u*u*t*x1+3*u*t*t*x2+t*t*t*x3, y:u*u*u*y0+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3};
  }
  function glow(x,y,r,a){
    var g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba(255,236,246,'+a+')'); g.addColorStop(.3,'rgba(242,154,198,'+(a*.55)+')'); g.addColorStop(1,'rgba(214,51,132,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,6.283); ctx.fill();
  }
  function frame(ms){
    var time = (ms||0)/1000;
    ctx.clearRect(0,0,W,H);
    luci.forEach(function(l){
      var y = reduce ? l.y : ((l.y - time*l.v) % H + H) % H;
      var x = l.x + (reduce ? 0 : Math.sin(time*.6 + l.f)*8);
      var a = reduce ? l.a : l.a*(.55+.45*Math.sin(time*1.3 + l.f));
      if (l.bokeh){
        var g = ctx.createRadialGradient(x,y,0,x,y,l.r*9);
        g.addColorStop(0, l.rosa ? 'rgba(242,154,198,'+(a*.35)+')' : 'rgba(111,195,195,'+(a*.35)+')'); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,l.r*9,0,6.283); ctx.fill();
      } else {
        ctx.fillStyle = l.rosa ? 'rgba(242,154,198,'+a+')' : 'rgba(214,240,238,'+a+')';
        ctx.beginPath(); ctx.arc(x,y,l.r,0,6.283); ctx.fill();
      }
    });
    ctx.setLineDash([2,7]); ctx.strokeStyle='rgba(111,195,195,.22)'; ctx.lineWidth=1;
    ctx.beginPath(); for (var i=0;i<=60;i++){ var q=pt(i/60); i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);} ctx.stroke(); ctx.setLineDash([]);
    /* la cometa: coda che sfuma dal teal al rosa, scintille dietro la testa */
    var head = reduce ? .72 : Math.min(1.08, (time % 12) / 9);
    var fade = reduce ? 1 : Math.min(1, Math.max(0, (12 - (time % 12)) / 1.5));
    var L = .3, N = 40;
    for (var j=0;j<N;j++){
      var t0 = head - L*(j+1)/N, t1 = head - L*j/N;
      if (t1 <= 0 || t0 >= 1) continue;
      var a0 = pt(Math.max(0,t0)), b0 = pt(Math.min(1,t1)), k = 1 - j/N;
      ctx.strokeStyle = 'rgba('+Math.round(111+131*k)+','+Math.round(195-41*k)+','+Math.round(195+3*k)+','+(k*k*.95*fade)+')';
      ctx.lineWidth = .8 + 4.2*k*k; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a0.x,a0.y); ctx.lineTo(b0.x,b0.y); ctx.stroke();
    }
    for (var q2=0;q2<16;q2++){
      var tt = head - .012*(q2+1) - .004*Math.sin(q2*7.3);
      if (tt <= 0 || tt >= 1) continue;
      var sp = pt(tt), off = Math.sin(time*4 + q2*1.7)*(4 + q2*.9), sa = (1 - q2/16)*.8*fade;
      ctx.fillStyle = 'rgba(255,236,246,'+sa+')';
      ctx.beginPath(); ctx.arc(sp.x + off*.6, sp.y + off, 1.1 + (q2%3)*.4, 0, 6.283); ctx.fill();
    }
    if (head <= 1){
      var h = pt(head), pulse = reduce ? 1 : (.9 + .1*Math.sin(time*3));
      glow(h.x, h.y, 60*pulse, .4*fade);
      glow(h.x, h.y, 14, 1*fade);
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  function parti(){ size(); addEventListener('resize', function(){ size(); if (reduce) frame(0); }); frame(0); if (!reduce) requestAnimationFrame(frame); }
  if (document.prerendering) document.addEventListener('prerenderingchange', parti, {once:true}); else parti();
})();
