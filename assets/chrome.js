/* Intestazione, menu e piccole animazioni comuni alle pagine pubbliche */
(function () {
  var riduci = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var top = document.querySelector('.top');

  // ---------- intestazione che si compatta scorrendo ----------
  if (top) {
    var compatto = false, attesa = false;
    var verifica = function () {
      attesa = false;
      var c = scrollY > 24;
      if (c !== compatto) { compatto = c; top.classList.toggle('compatto', c); }
    };
    addEventListener('scroll', function () { if (!attesa) { attesa = true; requestAnimationFrame(verifica); } }, { passive: true });
    verifica();
  }

  // ---------- pillola che segue il mouse sulle voci del menu ----------
  var nav = document.querySelector('.top .nav');
  if (nav && !riduci) {
    var pill = document.createElement('span'); pill.className = 'pillola'; pill.setAttribute('aria-hidden', 'true'); nav.appendChild(pill);
    var voci = nav.querySelectorAll(':scope > a, :scope > .voce > a');
    voci.forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        var r = a.getBoundingClientRect(), n = top.querySelector('.wrap').getBoundingClientRect();
        if (!pill.classList.contains('on')) { pill.style.transition = 'none'; pill.style.transform = 'translateX(' + (r.left - n.left) + 'px)'; pill.style.width = r.width + 'px'; pill.offsetWidth; pill.style.transition = ''; }
        pill.style.transform = 'translateX(' + (r.left - n.left) + 'px)'; pill.style.width = r.width + 'px'; pill.classList.add('on');
      });
    });
    nav.addEventListener('mouseleave', function () { pill.classList.remove('on'); });
  }

  // ---------- mega-menu: Esc lo chiude ----------
  document.querySelectorAll('.voce').forEach(function (v) {
    v.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { v.classList.add('chiusa'); var a = v.querySelector('a'); a && a.focus(); }
    });
    v.addEventListener('mouseleave', function () { v.classList.remove('chiusa'); });
    v.addEventListener('focusout', function (e) { if (!v.contains(e.relatedTarget)) v.classList.remove('chiusa'); });
  });

  // ---------- menu a schermo intero ----------
  var mb = document.querySelector('.menu-btn'), mm = document.getElementById('menu-mobile');
  if (mb && mm) {
    var testo = mb.querySelector('.menu-testo');
    var apri = function () {
      var r = mb.getBoundingClientRect();
      mm.style.setProperty('--mx', (r.left + r.width / 2) + 'px');
      mm.style.setProperty('--my', (r.top + r.height / 2) + 'px');
      mm.hidden = false; mm.offsetWidth;
      mm.classList.add('aperto'); document.documentElement.classList.add('menu-aperto');
      mb.setAttribute('aria-expanded', 'true'); mb.setAttribute('aria-label', 'Chiudi il menu'); if (testo) testo.textContent = 'Chiudi';
      var primo = mm.querySelector('a'); if (primo) setTimeout(function () { primo.focus({ preventScroll: true }); }, riduci ? 0 : 250);
    };
    var chiudi = function (rimettiFuoco) {
      mm.classList.remove('aperto'); document.documentElement.classList.remove('menu-aperto');
      mb.setAttribute('aria-expanded', 'false'); mb.setAttribute('aria-label', 'Apri il menu'); if (testo) testo.textContent = 'Menu';
      setTimeout(function () { if (!mm.classList.contains('aperto')) mm.hidden = true; }, riduci ? 0 : 600);
      if (rimettiFuoco) mb.focus();
    };
    mb.addEventListener('click', function () { mm.classList.contains('aperto') ? chiudi(true) : apri(); });
    document.addEventListener('keydown', function (e) {
      if (!mm.classList.contains('aperto')) return;
      if (e.key === 'Escape') chiudi(true);
      if (e.key === 'Tab') { // il fuoco resta tra il pulsante e il menu
        var el = [mb].concat(Array.prototype.slice.call(mm.querySelectorAll('a,button'))), i = el.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); el[el.length - 1].focus(); }
        else if (!e.shiftKey && i === el.length - 1) { e.preventDefault(); el[0].focus(); }
      }
    });
    mm.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a && a.getAttribute('href').charAt(0) === '#') chiudi(); });
    addEventListener('pageshow', function () { if (mm.classList.contains('aperto')) chiudi(); });
    matchMedia('(min-width: 1181px)').addEventListener('change', function (m) { if (m.matches && mm.classList.contains('aperto')) chiudi(); });
  }

  // ---------- luce che segue il puntatore ----------
  if (!riduci && matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.srv, .mega-lista a');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  // ---------- numeri che contano fino al valore ----------
  function avviaContatori() {
    var fmt = function (v, dec) { return v.toFixed(dec).replace('.', ','); };
    var conta = function (el) {
      var fine = parseFloat(el.getAttribute('data-conta').replace(',', '.')), dec = (el.getAttribute('data-conta').split(/[.,]/)[1] || '').length;
      if (riduci || isNaN(fine)) return;
      var t0 = null, dur = 1100;
      var passo = function (t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(fine * e, dec); if (p < 1) requestAnimationFrame(passo); };
      el.textContent = fmt(0, dec); requestAnimationFrame(passo);
    };
    var els = document.querySelectorAll('[data-conta]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) { io.unobserve(v.target); conta(v.target); } });
    }, { threshold: .6 });
    els.forEach(function (el) { io.observe(el); });
  }
  if (document.prerendering) document.addEventListener('prerenderingchange', avviaContatori, { once: true });
  else avviaContatori();

  // ---------- pulsante Accedi: se hai già una sessione diventa "La tua area" ----------
  try {
    var C = window.NF_CONFIG || {}, dentro = false;
    if (C.SUPABASE_URL && C.SUPABASE_ANON_KEY) {
      for (var i = 0; i < localStorage.length; i++) { if (/^sb-.*-auth-token$/.test(localStorage.key(i))) { dentro = true; break; } }
    } else dentro = !!sessionStorage.getItem('nf-demo-utente');
    if (dentro) document.querySelectorAll('.btn-accedi').forEach(function (b) {
      b.classList.add('dentro'); b.setAttribute('aria-label', 'Vai alla tua area riservata');
      var s = b.querySelector('span:not(.punto)'); if (s) s.textContent = 'La tua area';
      if (!b.querySelector('.punto')) { var p = document.createElement('span'); p.className = 'punto'; p.setAttribute('aria-hidden', 'true'); b.appendChild(p); }
    });
  } catch (e) { }
})();
