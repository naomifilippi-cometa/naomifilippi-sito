/* Interazioni delle sezioni: fase, listino, calcolatore, metodo, audit, cielo della home. Ogni blocco si attiva solo se la sezione è nella pagina. */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* stagger hero words */
  document.querySelectorAll('#titolo .w').forEach(function(w,i){ w.style.animationDelay = (0.08*i)+'s'; });

  /* ---------- fase selector ---------- */
  var FASI = {
    neo:{t:"Il primo ruolo giusto, non il primo che capita.",
         p:"Trasformo stage, tesi ed esperienze brevi in un profilo che un recruiter prende sul serio: CV, cover letter e LinkedIn, pronti per candidarti.",
         b:"Pacchetto Base · 299 €",
         l:["CV riscritto e ottimizzato per gli ATS","Cover letter personalizzabile","LinkedIn che si fa trovare dai recruiter","Risparmi 189 € rispetto ai servizi singoli"]},
    crescita:{t:"Il salto di ruolo che aspetti da un po'.",
         p:"Metto in evidenza i risultati che hai ottenuto, ti preparo ai colloqui per il livello successivo e ti accompagno all'offerta con i numeri giusti.",
         b:"Ascesa · 690 €",
         l:["CV, cover letter e LinkedIn","2 sessioni di coaching sulla strategia","Colloquio simulato sul ruolo target","Sessione strategica sull'offerta"]},
    cambio:{t:"Cambiare settore senza ripartire da zero.",
         p:"Si parte dall'orientamento: competenze trasferibili, ruoli compatibili, un piano a 90 giorni. Poi riscrivo la tua storia per il nuovo mercato.",
         b:"Percorso di orientamento + pacchetto Base",
         l:["Percorso di orientamento in 4 sessioni","Mappa delle competenze trasferibili","CV, cover letter e LinkedIn riposizionati","Preparazione ai colloqui nel nuovo settore"]},
    senior:{t:"Posizionamento executive e trattativa fino alla firma.",
         p:"Documenti in italiano e in inglese, strategia di ricerca riservata e un affiancamento sulla negoziazione di pacchetto, benefit e clausole.",
         b:"Costellazione · 1.390 €",
         l:["Executive CV e LinkedIn in italiano e inglese","Percorso strategico in 4 sessioni","2 simulazioni di colloquio","Offer Sprint e affiancamento per 3 mesi"]}
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
  }
  tabs.forEach(function(t){ t.addEventListener('click', function(){ setFase(t.dataset.fase, true); }); });
  if (tabs.length) setFase('neo');

  var eur = new Intl.NumberFormat('it-IT');
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

  /* ---------- metodo: la linea si disegna una volta quando la sezione entra nello schermo ---------- */
  var tappe = document.getElementById('tappe');
  if (tappe) {
    var items = tappe.querySelectorAll('.tappa');
    var accendi = function(){
      if (tappe.classList.contains('vai')) return;
      tappe.classList.add('vai');
      tappe.style.setProperty('--p', 1);
      items.forEach(function(it,i){ setTimeout(function(){ it.classList.add('on'); }, reduce ? 0 : 60 + i*525); });
    };
    if (reduce || !('IntersectionObserver' in window)) accendi();
    else {
      var oss = new IntersectionObserver(function(v){ if (v[0].isIntersecting){ oss.disconnect(); accendi(); } }, {threshold:.45});
      var parti2 = function(){ oss.observe(tappe); };
      if (document.prerendering) document.addEventListener('prerenderingchange', parti2, {once:true}); else parti2();
    }
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

  /* ---------- pain point e "perché me": comparsa delicata quando entrano nello schermo ---------- */
  var daMostrare = document.querySelectorAll('.chat-coppia, .perche-griglia');
  if (daMostrare.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var vis = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); vis.unobserve(e.target); } }); }, { threshold: .45, rootMargin: '0px 0px -8% 0px' });
      daMostrare.forEach(function (el) { vis.observe(el); });
    } else daMostrare.forEach(function (el) { el.classList.add('on'); });
  }

  /* ---------- hero: cielo e cometa ----------
     Una cometa attraversa l'apertura lungo un arco ampio, con coda affusolata,
     polvere luminosa che si stacca e resta qualche secondo, e un cielo leggero
     che segue appena il puntatore. Si ferma quando l'apertura non è visibile. */
  var cv = document.getElementById('cielo');
  if (!cv) return;
  var sopra = document.createElement('canvas'); sopra.className = 'cometa-sopra'; sopra.setAttribute('aria-hidden','true'); cv.parentNode.appendChild(sopra);
  var cielo = cv.getContext('2d'), cx2 = sopra.getContext('2d'), ctx = cielo, W = 0, H = 0, dpr = 1, stelle = [], scintille = [], polvere = [], CP = [];
  var mx = 0, my = 0, px = 0, py = 0, attiva = true, rafId = 0, inizio = 0;
  var GIRO = 11, VOLO = 4.6, RITARDO = .6;        /* secondi: ciclo, durata del passaggio, attesa iniziale */
  var BORD = '110,18,50', MALVA = '162,69,106', LILLA = '186,152,186', CHIARO = '252,243,248';

  function ease(t){ return t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
  function percorso(){ /* sale nello spazio libero accanto alla foto, ne sfiora la parte alta ed esce in alto a destra */
    var f = document.querySelector('.hero-foto'), r0 = cv.getBoundingClientRect(), r = f ? f.getBoundingClientRect() : null;
    if (!r){ CP = [[-.1*W,H*.86],[W*.28,H*1.02],[W*.5,H*.18],[W*1.1,H*.04]]; return; }
    var L = r.left - r0.left, T = r.top - r0.top, w = r.width, h = r.height, largo = W >= 900;
    CP = largo ? [[L-46, T+h*.98],[L-30, T+h*.45],[L+w*.04, T+h*.10],[L+w*.36, T-h*.30]]
               : [[-30, T+h*.10],[W*.30, T-h*.02],[W*.62, T-h*.10],[W+60, T-h*.24]];
  }
  function pt(t){
    var u = 1-t, a = CP[0], b = CP[1], c = CP[2], d = CP[3];
    return {x:u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0], y:u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]};
  }
  function size(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.offsetWidth; H = cv.offsetHeight;
    [cv, sopra].forEach(function(c){ c.width = Math.round(W*dpr); c.height = Math.round(H*dpr); c.getContext('2d').setTransform(dpr,0,0,dpr,0,0); });
    percorso();
    stelle = []; scintille = [];
    var n = Math.round(W*H/16000);
    for (var i=0;i<n;i++) stelle.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.3+.35, a:Math.random()*.35+.12, f:Math.random()*6.28, v:Math.random()*.8+.4, z:Math.random()*.8+.2, c:Math.random()<.5 ? MALVA : LILLA});
    var m = W < 700 ? 3 : 6;
    for (var j=0;j<m;j++) scintille.push({x:Math.random()*W, y:Math.random()*H*.85, r:Math.random()*5+5, f:Math.random()*6.28, z:Math.random()*.6+.4});
  }
  function sparkle(x, y, r, a, rot){ /* stellina a quattro punte */
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot||0); ctx.globalAlpha = a;
    var g = ctx.createRadialGradient(0,0,0,0,0,r);
    g.addColorStop(0,'rgba('+CHIARO+',1)'); g.addColorStop(.35,'rgba('+LILLA+',.8)'); g.addColorStop(1,'rgba('+LILLA+',0)');
    ctx.fillStyle = g; ctx.beginPath();
    for (var k=0;k<4;k++){ var an=k*Math.PI/2; ctx.lineTo(Math.cos(an)*r, Math.sin(an)*r); ctx.lineTo(Math.cos(an+Math.PI/4)*r*.18, Math.sin(an+Math.PI/4)*r*.18); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function nastro(t, lung, larg, colori){ /* coda affusolata disegnata come un nastro lungo il percorso */
    var N = 46, sx = [], dx = [], testa = pt(t), fine = pt(Math.max(0, t-lung));
    for (var i=0;i<=N;i++){
      var u = i/N, tt = t - lung*u; if (tt < 0) tt = 0;
      var a = pt(tt), b = pt(Math.max(0, tt-.002)), nx = a.y-b.y, ny = b.x-a.x, l = Math.hypot(nx,ny) || 1;
      var w = larg*Math.pow(1-u,1.6) + .2;
      sx.push([a.x+nx/l*w, a.y+ny/l*w]); dx.push([a.x-nx/l*w, a.y-ny/l*w]);
    }
    var g = ctx.createLinearGradient(testa.x, testa.y, fine.x, fine.y);
    colori.forEach(function(c){ g.addColorStop(c[0], c[1]); });
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx[0][0], sx[0][1]);
    for (var k=1;k<sx.length;k++) ctx.lineTo(sx[k][0], sx[k][1]);
    for (var h=dx.length-1;h>=0;h--) ctx.lineTo(dx[h][0], dx[h][1]);
    ctx.closePath(); ctx.fill();
  }
  function frame(ms){
    if (!inizio) inizio = ms || 1;
    var time = ((ms||0) - inizio)/1000, dt = 1/60;
    px += (mx-px)*.04; py += (my-py)*.04;
    cielo.clearRect(0,0,W,H); cx2.clearRect(0,0,W,H); ctx = cielo;
    /* cielo */
    for (var i=0;i<stelle.length;i++){
      var s = stelle[i], a = reduce ? s.a : s.a*(.55+.45*Math.sin(time*s.v + s.f));
      ctx.fillStyle = 'rgba('+s.c+','+a+')';
      ctx.beginPath(); ctx.arc(s.x + px*12*s.z, s.y + py*8*s.z, s.r, 0, 6.283); ctx.fill();
    }
    for (var j=0;j<scintille.length;j++){
      var c = scintille[j], pulse = reduce ? .6 : .35 + .65*Math.pow(.5+.5*Math.sin(time*.7 + c.f), 3);
      sparkle(c.x + px*18*c.z, c.y + py*12*c.z, c.r*(.7+.3*pulse), .55*pulse, time*.15 + c.f);
    }
    /* cometa, sopra i contenuti */
    ctx = cx2;
    var ciclo = reduce ? VOLO*.62 : (time - RITARDO) % GIRO, t = ciclo/VOLO;
    if (ciclo >= 0 && t <= 1.05){
      var tt = ease(Math.min(1, Math.max(0, t))), testa = pt(tt);
      var entra = Math.min(1, t*6), esce = Math.min(1, (1.05-t)*8), f = Math.max(0, Math.min(entra, esce));
      var lung = .26*Math.min(1, tt*3 + .15);
      nastro(tt, lung, 20, [[0,'rgba('+LILLA+','+(.32*f)+')'],[.5,'rgba('+LILLA+','+(.10*f)+')'],[1,'rgba('+LILLA+',0)']]);
      nastro(tt, lung*.92, 5.4, [[0,'rgba('+CHIARO+','+(.95*f)+')'],[.12,'rgba('+MALVA+','+(.75*f)+')'],[.5,'rgba('+BORD+','+(.35*f)+')'],[1,'rgba('+BORD+',0)']]);
      var g = ctx.createRadialGradient(testa.x,testa.y,0,testa.x,testa.y,70);
      g.addColorStop(0,'rgba('+MALVA+','+(.30*f)+')'); g.addColorStop(.4,'rgba('+LILLA+','+(.16*f)+')'); g.addColorStop(1,'rgba('+LILLA+',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(testa.x,testa.y,70,0,6.283); ctx.fill();
      sparkle(testa.x, testa.y, 28 + (reduce ? 0 : 4*Math.sin(time*9)), f, time*.8);
      ctx.fillStyle = 'rgba(255,255,255,'+f+')'; ctx.beginPath(); ctx.arc(testa.x,testa.y,3.6,0,6.283); ctx.fill();
      if (!reduce && t < 1){ /* polvere che si stacca dalla testa */
        var dietro = pt(Math.max(0, tt-.01)), vx = testa.x-dietro.x, vy = testa.y-dietro.y, vl = Math.hypot(vx,vy) || 1;
        for (var q=0;q<3;q++) polvere.push({x:testa.x, y:testa.y, vx:-vx/vl*(Math.random()*22+8) + (Math.random()-.5)*10, vy:-vy/vl*(Math.random()*22+8) + (Math.random()-.5)*10,
          r:Math.random()*1.5+.4, vita:0, max:Math.random()*1.2+.9, c:Math.random()<.35 ? CHIARO : (Math.random()<.5 ? MALVA : LILLA)});
      }
    }
    for (var d=polvere.length-1;d>=0;d--){
      var p = polvere[d]; p.vita += dt; if (p.vita > p.max){ polvere.splice(d,1); continue; }
      p.x += p.vx*dt; p.y += p.vy*dt; p.vx *= .985; p.vy *= .985;
      var al = Math.sin(Math.PI * p.vita/p.max) * .85;
      ctx.fillStyle = 'rgba('+p.c+','+al+')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    if (!reduce && attiva) rafId = requestAnimationFrame(frame);
  }
  function avvia(){ if (!reduce && !rafId) rafId = requestAnimationFrame(frame); }
  function ferma(){ if (rafId) cancelAnimationFrame(rafId); rafId = 0; }
  function parti(){
    size();
    var t; addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(function(){ size(); if (reduce) frame(0); }, 150); });
    if (!reduce){
      cv.parentNode.addEventListener('pointermove', function(e){ var r = cv.getBoundingClientRect(); mx = (e.clientX - r.left)/r.width - .5; my = (e.clientY - r.top)/r.height - .5; });
      if ('IntersectionObserver' in window) new IntersectionObserver(function(v){ attiva = v[0].isIntersecting && !document.hidden; attiva ? avvia() : ferma(); }).observe(cv);
      document.addEventListener('visibilitychange', function(){ attiva = !document.hidden; attiva ? avvia() : ferma(); });
      avvia();
    } else frame(0);
  }
  if (document.prerendering) document.addEventListener('prerenderingchange', parti, {once:true}); else parti();
})();
