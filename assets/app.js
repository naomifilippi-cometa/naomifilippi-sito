/*
  Strato dati dell'area clienti e della dashboard di Naomi.
  - Modalità LIVE: Supabase (login Google/LinkedIn/email, database, archivio file privato).
  - Modalità DEMO: dati di esempio in memoria, attiva finché config.js non ha le chiavi.
  Espone window.NF con le stesse funzioni nelle due modalità.
*/
(function () {
  var C = window.NF_CONFIG || {};
  var LIVE = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase);
  var sb = LIVE ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' } }) : null;

  // ---------- utilità ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function uid() { return 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function nomeSicuro(n) { return String(n).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').slice(-80) || 'file'; }
  function peso(b) { if (b == null) return ''; if (b < 1024) return b + ' B'; if (b < 1048576) return Math.round(b / 1024) + ' KB'; return (b / 1048576).toFixed(1).replace('.', ',') + ' MB'; }
  var fmtData = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
  var fmtDataOra = new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  var fmtOra = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' });
  function quando(iso) {
    var d = new Date(iso), ora = new Date(), diff = (ora - d) / 1000;
    if (diff < 60) return 'adesso';
    if (diff < 3600) return Math.floor(diff / 60) + ' min fa';
    if (d.toDateString() === ora.toDateString()) return 'oggi, ' + fmtOra.format(d);
    var ieri = new Date(ora); ieri.setDate(ora.getDate() - 1);
    if (d.toDateString() === ieri.toDateString()) return 'ieri, ' + fmtOra.format(d);
    return fmtData.format(d);
  }
  function iniziali(n) { return String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ''; }).join('').toUpperCase(); }
  function waLink(tel, testo) { var n = String(tel || '').replace(/[^0-9]/g, ''); if (n.length === 10 && n[0] === '3') n = '39' + n; return n ? 'https://wa.me/' + n + (testo ? '?text=' + encodeURIComponent(testo) : '') : ''; }
  var CATEGORIE = { cv: 'CV', lettera: 'Cover letter', linkedin: 'LinkedIn', annuncio: 'Annuncio', offerta: 'Offerta', consegna: 'Consegna di Naomi', altro: 'Altro' };
  var STATI = ['nuovo', 'attivo', 'in pausa', 'concluso'];
  var TAPPE = ['Ascolto', 'Posizionamento', 'Colloqui', 'Offerta e firma'];
  var FASI = { neolaureato: 'Neolaureato', crescita: 'In crescita', cambio: 'Cambio carriera', senior: 'Senior / Executive' };
  var SERVIZI = ['Primo Passo', 'Ascesa', 'Costellazione', 'Curriculum', 'Profilo LinkedIn', 'Cover letter', 'Orientamento', 'Simulazione colloquio', "Negoziazione dell'offerta"];
  var TIPI_OK = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text', 'text/plain', 'image/jpeg', 'image/png', 'image/webp'];
  function controllaFile(f) {
    var max = (C.MAX_FILE_MB || 20) * 1048576;
    if (f.size > max) return 'Il file "' + f.name + '" supera i ' + (C.MAX_FILE_MB || 20) + ' MB.';
    if (f.type && TIPI_OK.indexOf(f.type) < 0) return 'Il formato di "' + f.name + '" non è supportato. Usa PDF, Word, ODT, TXT o immagini.';
    return '';
  }

  // =====================================================================
  //  DEMO: dati di esempio
  // =====================================================================
  var ora = Date.now(), G = 86400000, H = 3600000;
  function t(ms) { return new Date(ora - ms).toISOString(); }
  function giorno(g, h, m) { var d = new Date(ora); d.setDate(d.getDate() + g); d.setHours(h, m || 0, 0, 0); return d.toISOString(); }
  var NAOMI = { id: 'naomi', email: 'naomi@naomifilippi.it', nome: 'Naomi Filippi', avatar_url: 'assets/naomi-mini.jpg' };
  var demo = {
    utente: null,
    profili: [
      { id: 'c1', email: 'anna.rossi@example.com', nome: 'Anna Rossi', telefono: '333 123 4567', obiettivo: 'Passare da HR generalist a Talent Acquisition Specialist in ambito tech', fase: 'crescita', servizio: 'Ascesa', stato: 'attivo', passo: 2, avatar_url: '', creato_il: t(21 * G), aggiornato_il: t(2 * G) },
      { id: 'c2', email: 'marco.bianchi@example.com', nome: 'Marco Bianchi', telefono: '347 555 0101', obiettivo: 'Ruolo da Operations Director in una multinazionale del Nord Italia', fase: 'senior', servizio: 'Costellazione', stato: 'attivo', passo: 1, avatar_url: '', creato_il: t(9 * G), aggiornato_il: t(5 * H) },
      { id: 'c3', email: 'giulia.neri@example.com', nome: 'Giulia Neri', telefono: '', obiettivo: 'Primo ruolo in marketing digitale dopo la laurea magistrale', fase: 'neolaureato', servizio: 'Primo Passo', stato: 'attivo', passo: 3, avatar_url: '', creato_il: t(34 * G), aggiornato_il: t(26 * H) },
      { id: 'c4', email: 'luca.ferri@example.com', nome: 'Luca Ferri', telefono: '340 777 8899', obiettivo: 'Negoziare l\'offerta ricevuta da una società di consulenza', fase: 'crescita', servizio: "Negoziazione dell'offerta", stato: 'concluso', passo: 4, avatar_url: '', creato_il: t(60 * G), aggiornato_il: t(40 * G) },
      { id: 'c5', email: 'sara.conti@example.com', nome: 'Sara Conti', telefono: '', obiettivo: '', fase: null, servizio: null, stato: 'nuovo', passo: 0, avatar_url: '', creato_il: t(3 * H), aggiornato_il: t(3 * H) }
    ],
    documenti: [
      { id: 'd1', cliente_id: 'c1', nome: 'CV_Anna_Rossi_2026.pdf', dimensione: 184320, tipo: 'application/pdf', categoria: 'cv', da_naomi: false, creato_il: t(20 * G) },
      { id: 'd2', cliente_id: 'c1', nome: 'Annuncio_TA_Specialist_Satispay.pdf', dimensione: 96256, tipo: 'application/pdf', categoria: 'annuncio', da_naomi: false, creato_il: t(19 * G) },
      { id: 'd3', cliente_id: 'c1', nome: 'CV_Anna_Rossi_nuovo_v2.docx', dimensione: 45056, tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', categoria: 'consegna', da_naomi: true, creato_il: t(12 * G) },
      { id: 'd4', cliente_id: 'c1', nome: 'Testi_profilo_LinkedIn.pdf', dimensione: 71680, tipo: 'application/pdf', categoria: 'consegna', da_naomi: true, creato_il: t(6 * G) },
      { id: 'd5', cliente_id: 'c2', nome: 'CV_Marco_Bianchi_EN.pdf', dimensione: 230400, tipo: 'application/pdf', categoria: 'cv', da_naomi: false, creato_il: t(5 * H) },
      { id: 'd6', cliente_id: 'c3', nome: 'Offerta_Junior_Marketing.pdf', dimensione: 112640, tipo: 'application/pdf', categoria: 'offerta', da_naomi: false, creato_il: t(26 * H) }
    ],
    commenti: [
      { id: 'm1', cliente_id: 'c1', da_naomi: false, testo: 'Ciao Naomi! Ho caricato il mio CV attuale e l\'annuncio che mi interessa di più.', letto: true, creato_il: t(20 * G) },
      { id: 'm2', cliente_id: 'c1', da_naomi: true, testo: 'Ciao Anna, grazie! Ci vediamo giovedì per l\'intervista: tieni a portata di mano i numeri delle selezioni che hai gestito.', letto: true, creato_il: t(19 * G) },
      { id: 'm3', cliente_id: 'c1', da_naomi: true, documento_id: 'd3', testo: 'Ecco la seconda versione del CV. Ho spostato in alto i risultati sul time-to-hire.', letto: true, creato_il: t(12 * G) },
      { id: 'm4', cliente_id: 'c1', da_naomi: false, documento_id: 'd3', testo: 'Perfetto, mi piace molto. Posso aggiungere la certificazione LinkedIn Recruiter?', letto: true, creato_il: t(11 * G) },
      { id: 'm5', cliente_id: 'c1', da_naomi: true, testo: 'Certo, l\'ho inserita. Ora ti ho caricato anche i testi per il profilo LinkedIn.', letto: false, creato_il: t(6 * G) },
      { id: 'm6', cliente_id: 'c2', da_naomi: false, testo: 'Buongiorno Naomi, allego il CV in inglese. Tra due settimane ho il primo colloquio con un head hunter.', letto: false, creato_il: t(5 * H) },
      { id: 'm7', cliente_id: 'c3', da_naomi: false, documento_id: 'd6', testo: 'Mi è arrivata l\'offerta! 28.000 € di RAL, secondo te posso chiedere di più?', letto: false, creato_il: t(26 * H) },
      { id: 'm8', cliente_id: 'c3', da_naomi: false, testo: 'Hanno detto che vogliono una risposta entro venerdì.', letto: false, creato_il: t(25 * H) }
    ],
    appuntamenti: [
      { id: 'a1', cliente_id: 'c1', inizio: giorno(2, 15, 0), durata_min: 60, titolo: 'Simulazione colloquio · Satispay', link: 'https://meet.google.com/', note: 'Porta le domande che vuoi fare all\'azienda.' },
      { id: 'a2', cliente_id: 'c2', inizio: giorno(4, 10, 30), durata_min: 45, titolo: 'Intervista per il CV executive', link: null, note: '' },
      { id: 'a3', cliente_id: 'c3', inizio: giorno(1, 18, 0), durata_min: 60, titolo: 'Sessione strategica sull\'offerta', link: 'https://meet.google.com/', note: '' }
    ],
    note: [
      { id: 'n1', cliente_id: 'c1', testo: 'Molto motivata. Punta a scale-up fintech a Milano. Chiedere referenze entro fine mese.', creato_il: t(19 * G) },
      { id: 'n2', cliente_id: 'c3', testo: 'Offerta sotto mercato per il ruolo (benchmark 30-32k a Milano). Proporre 31k + formazione.', creato_il: t(20 * H) }
    ],
    richieste: [
      { id: 'r1', nome: 'Paola Galli', email: 'paola.galli@example.com', telefono: '339 222 3344', servizio: 'Simulazione colloquio', messaggio: 'Ho un colloquio in inglese la prossima settimana per un ruolo in pharma.', origine: 'contatti', gestita: false, creato_il: t(2 * H) },
      { id: 'r2', nome: 'Davide Moretti', email: 'davide.moretti@example.com', telefono: '', servizio: '', linkedin: 'linkedin.com/in/davidemoretti', messaggio: 'Obiettivo: cambiare carriera', origine: 'audit', gestita: false, creato_il: t(30 * H) },
      { id: 'r3', nome: 'Elena Riva', email: 'elena.riva@example.com', telefono: '348 111 2233', servizio: 'Curriculum', messaggio: 'Vorrei rifare il CV per candidarmi all\'estero.', origine: 'contatti', gestita: true, creato_il: t(4 * G) }
    ],
    blob: {},
    ascoltatori: []
  };
  // in demo la "sessione" vive nella scheda del browser (sessionStorage), o nel parametro ?demo= se lo storage non è disponibile
  var UTENTI_DEMO = { cliente: { id: 'c1', email: 'anna.rossi@example.com' }, admin: { id: 'naomi', email: NAOMI.email, admin: true } };
  function leggiDemo() {
    var r = null;
    try { r = sessionStorage.getItem('nf-demo-utente'); } catch (e) { }
    if (!r) { var q = new URLSearchParams(location.search).get('demo'); if (q && UTENTI_DEMO[q]) { r = q; try { sessionStorage.setItem('nf-demo-utente', q); } catch (e) { } } }
    return r && UTENTI_DEMO[r] ? UTENTI_DEMO[r] : null;
  }
  function salvaDemo(ruolo) { try { if (ruolo) sessionStorage.setItem('nf-demo-utente', ruolo); else sessionStorage.removeItem('nf-demo-utente'); } catch (e) { } }
  if (!LIVE) demo.utente = leggiDemo();
  // indirizzi: con Vercel (cleanUrls) le pagine non hanno .html
  function pagina(nome, query) {
    var ext = /\.html$/.test(location.pathname) ? '.html' : '';
    return nome + ext + (query ? '?' + query : '');
  }
  function urlAssoluto(nome) { return new URL(pagina(nome), location.href).href; }
  demo.scrittura = [];

  function demoAvvisa() { demo.ascoltatori.forEach(function (f) { try { f(); } catch (e) { } }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // =====================================================================
  //  API comune
  // =====================================================================
  // messaggi di Supabase Auth in italiano
  function erroreIt(e) {
    var m = (e && (e.message || e)) + '', c = e && e.code;
    if (c === 'invalid_credentials' || /invalid login credentials/i.test(m)) return 'Email o password non corretti.';
    if (c === 'email_not_confirmed' || /email not confirmed/i.test(m)) return 'Prima conferma la tua email: apri il link che ti ho mandato (guarda anche nello spam).';
    if (c === 'user_already_exists' || /already registered|already exists/i.test(m)) return 'Esiste già un account con questa email. Accedi, oppure usa "Password dimenticata?".';
    if (c === 'weak_password' || /password should|weak password/i.test(m)) return 'La password è troppo debole: usa almeno 8 caratteri con lettere e numeri.';
    if (c === 'same_password' || /different from the old/i.test(m)) return 'La nuova password deve essere diversa da quella di prima.';
    if (c === 'over_email_send_rate_limit' || /rate limit|too many/i.test(m)) return 'Troppe richieste in poco tempo: riprova tra qualche minuto.';
    if (/security purposes.*after (\d+) seconds/i.test(m)) return 'Per sicurezza aspetta ' + m.match(/after (\d+) seconds/i)[1] + ' secondi e riprova.';
    if (c === 'signup_disabled' || /signups not allowed/i.test(m)) return 'Le nuove registrazioni sono chiuse al momento.';
    if (c === 'email_address_invalid' || /invalid.*email|email.*invalid/i.test(m)) return 'Questo indirizzo email non è valido.';
    if (/fetch|network/i.test(m)) return 'Connessione assente o instabile: riprova.';
    return m;
  }
  var NF = {
    live: LIVE, pagina: pagina, esc: esc, peso: peso, quando: quando, iniziali: iniziali, waLink: waLink, controllaFile: controllaFile,
    fmtData: fmtData, fmtDataOra: fmtDataOra, CATEGORIE: CATEGORIE, STATI: STATI, TAPPE: TAPPE, FASI: FASI, SERVIZI: SERVIZI, NAOMI: NAOMI,

    // ----- accesso -----
    sessione: async function () {
      if (!LIVE) return demo.utente ? { user: demo.utente } : null;
      var r = await sb.auth.getSession(); return r.data.session;
    },
    // dopo il login Google/LinkedIn/email si torna sempre alla pagina auth-callback, che smista per ruolo
    accedi: async function (provider, ruoloDemo) {
      if (!LIVE) { var ruolo = ruoloDemo === 'admin' ? 'admin' : 'cliente'; demo.utente = UTENTI_DEMO[ruolo]; salvaDemo(ruolo); return { ok: true, demo: ruolo }; }
      var r = await sb.auth.signInWithOAuth({ provider: provider, options: { redirectTo: urlAssoluto('auth-callback') } });
      return r.error ? { errore: erroreIt(r.error) } : { ok: true };
    },
    accediEmail: async function (email, ruoloDemo) {
      if (!LIVE) return NF.accedi('email', ruoloDemo);
      var r = await sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: urlAssoluto('auth-callback') } });
      return r.error ? { errore: erroreIt(r.error) } : { inviata: true };
    },
    // email e password
    accediPassword: async function (email, password, ruoloDemo) {
      if (!LIVE) return NF.accedi('email', ruoloDemo);
      var r = await sb.auth.signInWithPassword({ email: email, password: password });
      return r.error ? { errore: erroreIt(r.error) } : { ok: true };
    },
    registrati: async function (nome, email, password) {
      if (!LIVE) return NF.accedi('email', 'cliente');
      var r = await sb.auth.signUp({ email: email, password: password, options: { data: { full_name: nome, name: nome }, emailRedirectTo: urlAssoluto('auth-callback') } });
      if (r.error) return { errore: erroreIt(r.error) };
      if (r.data.session) return { ok: true };
      // con la conferma email attiva, un indirizzo già registrato torna senza identità
      if (r.data.user && r.data.user.identities && r.data.user.identities.length === 0) return { errore: 'Esiste già un account con questa email. Accedi, oppure usa "Password dimenticata?".', esiste: true };
      return { conferma: true };
    },
    reinviaConferma: async function (email) {
      if (!LIVE) return { inviata: true };
      var r = await sb.auth.resend({ type: 'signup', email: email, options: { emailRedirectTo: urlAssoluto('auth-callback') } });
      return r.error ? { errore: erroreIt(r.error) } : { inviata: true };
    },
    recuperaPassword: async function (email) {
      if (!LIVE) return { inviata: true };
      try { localStorage.setItem('nf-recupero', String(Date.now())); } catch (e) { }
      var r = await sb.auth.resetPasswordForEmail(email, { redirectTo: urlAssoluto('auth-callback') });
      return r.error ? { errore: erroreIt(r.error) } : { inviata: true };
    },
    nuovaPassword: async function (password) {
      if (!LIVE) return { ok: true };
      var r = await sb.auth.updateUser({ password: password });
      try { localStorage.removeItem('nf-recupero'); } catch (e) { }
      return r.error ? { errore: erroreIt(r.error) } : { ok: true };
    },
    erroreIt: function (e) { return erroreIt(e); },
    esci: async function () { if (!LIVE) { demo.utente = null; salvaDemo(null); return; } await sb.auth.signOut(); },
    vaiAdAccedi: function (query) { location.replace(pagina('accedi', query)); },
    alCambioAccesso: function (cb) { if (LIVE) sb.auth.onAuthStateChange(function (ev) { cb(ev); }); },
    eAdmin: async function () {
      if (!LIVE) return !!(demo.utente && demo.utente.admin);
      var r = await sb.rpc('is_admin'); return !!r.data;
    },

    // ----- profilo -----
    mioProfilo: async function () {
      if (!LIVE) { if (!demo.utente) return null; if (demo.utente.admin) return clone(NAOMI); return clone(demo.profili.find(function (p) { return p.id === demo.utente.id; })); }
      var s = await NF.sessione(); if (!s) return null;
      var r = await sb.from('profiles').select('*').eq('id', s.user.id).maybeSingle();
      if (r.data) sb.from('profiles').update({ ultimo_accesso: new Date().toISOString() }).eq('id', s.user.id).then(function () { });
      return r.data;
    },
    aggiornaProfilo: async function (id, campi) {
      if (!LIVE) { var p = demo.profili.find(function (x) { return x.id === id; }); Object.assign(p, campi, { aggiornato_il: new Date().toISOString() }); demoAvvisa(); return { ok: true }; }
      var r = await sb.from('profiles').update(campi).eq('id', id); return r.error ? { errore: r.error.message } : { ok: true };
    },

    // ----- documenti -----
    documenti: async function (clienteId) {
      if (!LIVE) return clone(demo.documenti.filter(function (d) { return d.cliente_id === clienteId; })).sort(function (a, b) { return b.creato_il.localeCompare(a.creato_il); });
      var r = await sb.from('documenti').select('*').eq('cliente_id', clienteId).order('creato_il', { ascending: false });
      return r.data || [];
    },
    carica: async function (clienteId, file, categoria, comeNaomi) {
      var errore = controllaFile(file); if (errore) return { errore: errore };
      if (!LIVE) {
        var id = uid(); demo.blob[id] = URL.createObjectURL(file);
        demo.documenti.push({ id: id, cliente_id: clienteId, nome: file.name, dimensione: file.size, tipo: file.type, categoria: comeNaomi && categoria === 'altro' ? 'consegna' : categoria, da_naomi: !!comeNaomi, creato_il: new Date().toISOString() });
        demoAvvisa(); return { ok: true, id: id };
      }
      var percorso = clienteId + '/' + Date.now() + '-' + nomeSicuro(file.name);
      var up = await sb.storage.from('documenti').upload(percorso, file, { contentType: file.type || 'application/octet-stream', upsert: false });
      if (up.error) return { errore: 'Caricamento non riuscito: ' + up.error.message };
      var r = await sb.from('documenti').insert({ cliente_id: clienteId, nome: file.name, percorso: percorso, dimensione: file.size, tipo: file.type, categoria: categoria }).select().single();
      if (r.error) { await sb.storage.from('documenti').remove([percorso]); return { errore: r.error.message }; }
      return { ok: true, id: r.data.id };
    },
    linkDownload: async function (doc) {
      if (!LIVE) return demo.blob[doc.id] || null;
      var r = await sb.storage.from('documenti').createSignedUrl(doc.percorso, 120, { download: doc.nome });
      return r.data ? r.data.signedUrl : null;
    },
    eliminaDocumento: async function (doc) {
      if (!LIVE) { demo.documenti = demo.documenti.filter(function (d) { return d.id !== doc.id; }); demo.commenti.forEach(function (c) { if (c.documento_id === doc.id) c.documento_id = null; }); demoAvvisa(); return { ok: true }; }
      var r = await sb.from('documenti').delete().eq('id', doc.id); if (r.error) return { errore: r.error.message };
      await sb.storage.from('documenti').remove([doc.percorso]); return { ok: true };
    },

    // ----- commenti -----
    commenti: async function (clienteId) {
      if (!LIVE) return clone(demo.commenti.filter(function (c) { return c.cliente_id === clienteId; })).sort(function (a, b) { return a.creato_il.localeCompare(b.creato_il); });
      var r = await sb.from('commenti').select('*').eq('cliente_id', clienteId).order('creato_il', { ascending: true });
      return r.data || [];
    },
    scrivi: async function (clienteId, testo, documentoId, comeNaomi) {
      testo = String(testo || '').trim(); if (!testo) return { errore: 'Scrivi un messaggio.' };
      if (!LIVE) { demo.commenti.push({ id: uid(), cliente_id: clienteId, da_naomi: !!comeNaomi, documento_id: documentoId || null, testo: testo, letto: false, creato_il: new Date().toISOString() }); demoAvvisa(); return { ok: true }; }
      var r = await sb.from('commenti').insert({ cliente_id: clienteId, testo: testo, documento_id: documentoId || null });
      return r.error ? { errore: r.error.message } : { ok: true };
    },
    segnaLetti: async function (clienteId, messaggiDiNaomi) {
      if (!LIVE) { demo.commenti.forEach(function (c) { if (c.cliente_id === clienteId && c.da_naomi === messaggiDiNaomi) c.letto = true; }); return; }
      await sb.from('commenti').update({ letto: true }).eq('cliente_id', clienteId).eq('da_naomi', messaggiDiNaomi).eq('letto', false);
    },

    // ----- appuntamenti -----
    appuntamenti: async function (clienteId) {
      if (!LIVE) return clone(demo.appuntamenti.filter(function (a) { return a.cliente_id === clienteId; })).sort(function (a, b) { return a.inizio.localeCompare(b.inizio); });
      var r = await sb.from('appuntamenti').select('*').eq('cliente_id', clienteId).order('inizio'); return r.data || [];
    },
    aggiungiAppuntamento: async function (a) {
      if (!LIVE) { a.id = uid(); demo.appuntamenti.push(a); demoAvvisa(); return { ok: true }; }
      var r = await sb.from('appuntamenti').insert(a); return r.error ? { errore: r.error.message } : { ok: true };
    },
    eliminaAppuntamento: async function (id) {
      if (!LIVE) { demo.appuntamenti = demo.appuntamenti.filter(function (a) { return a.id !== id; }); demoAvvisa(); return { ok: true }; }
      var r = await sb.from('appuntamenti').delete().eq('id', id); return r.error ? { errore: r.error.message } : { ok: true };
    },

    // ----- solo Naomi -----
    clienti: async function () {
      if (!LIVE) {
        return demo.profili.map(function (p) {
          var docs = demo.documenti.filter(function (d) { return d.cliente_id === p.id; });
          var com = demo.commenti.filter(function (c) { return c.cliente_id === p.id; });
          var date = [p.aggiornato_il].concat(docs.map(function (d) { return d.creato_il; }), com.map(function (c) { return c.creato_il; })).sort();
          return Object.assign(clone(p), { n_documenti: docs.length, n_da_leggere: com.filter(function (c) { return !c.da_naomi && !c.letto; }).length, ultima_attivita: date[date.length - 1] });
        });
      }
      var r = await sb.from('clienti_panoramica').select('*').order('ultima_attivita', { ascending: false }); return r.data || [];
    },
    cliente: async function (id) {
      if (!LIVE) return clone(demo.profili.find(function (p) { return p.id === id; }));
      var r = await sb.from('profiles').select('*').eq('id', id).maybeSingle(); return r.data;
    },
    note: async function (clienteId) {
      if (!LIVE) return clone(demo.note.filter(function (n) { return n.cliente_id === clienteId; })).reverse();
      var r = await sb.from('note_private').select('*').eq('cliente_id', clienteId).order('creato_il', { ascending: false }); return r.data || [];
    },
    aggiungiNota: async function (clienteId, testo) {
      testo = String(testo || '').trim(); if (!testo) return { errore: 'Scrivi la nota.' };
      if (!LIVE) { demo.note.push({ id: uid(), cliente_id: clienteId, testo: testo, creato_il: new Date().toISOString() }); demoAvvisa(); return { ok: true }; }
      var r = await sb.from('note_private').insert({ cliente_id: clienteId, testo: testo }); return r.error ? { errore: r.error.message } : { ok: true };
    },
    eliminaNota: async function (id) {
      if (!LIVE) { demo.note = demo.note.filter(function (n) { return n.id !== id; }); demoAvvisa(); return { ok: true }; }
      var r = await sb.from('note_private').delete().eq('id', id); return r.error ? { errore: r.error.message } : { ok: true };
    },
    richieste: async function () {
      if (!LIVE) return clone(demo.richieste).sort(function (a, b) { return b.creato_il.localeCompare(a.creato_il); });
      var r = await sb.from('richieste').select('*').order('creato_il', { ascending: false }).limit(200); return r.data || [];
    },
    segnaRichiesta: async function (id, gestita) {
      if (!LIVE) { demo.richieste.find(function (r) { return r.id === id; }).gestita = gestita; demoAvvisa(); return { ok: true }; }
      var r = await sb.from('richieste').update({ gestita: gestita }).eq('id', id); return r.error ? { errore: r.error.message } : { ok: true };
    },

    // ----- aggiornamenti in tempo reale -----
    ascolta: function (clienteId, cb) {
      if (!LIVE) { demo.ascoltatori.push(cb); return function () { demo.ascoltatori = demo.ascoltatori.filter(function (f) { return f !== cb; }); }; }
      var filtro = clienteId ? 'cliente_id=eq.' + clienteId : undefined;
      var ch = sb.channel('nf-' + (clienteId || 'tutti') + '-' + Math.random().toString(36).slice(2))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'commenti', filter: filtro }, function () { cb(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'documenti', filter: filtro }, function () { cb(); })
        .subscribe();
      return function () { sb.removeChannel(ch); };
    },
    // "sta scrivendo…": un segnale effimero (Realtime broadcast), senza testo e senza salvataggi
    canaleScrittura: function (clienteId, suScrittura) {
      if (!clienteId) return { segnala: function () { }, chiudi: function () { } };
      if (!LIVE) {
        var f = function (e) { if (e.clienteId === clienteId) suScrittura(e.daNaomi); };
        demo.scrittura.push(f);
        return { segnala: function () { }, chiudi: function () { demo.scrittura = demo.scrittura.filter(function (x) { return x !== f; }); } };
      }
      var ch = sb.channel('scrive-' + clienteId, { config: { broadcast: { self: false } } })
        .on('broadcast', { event: 'scrive' }, function (m) { suScrittura(!!(m.payload && m.payload.daNaomi)); }).subscribe();
      var ultimo = 0;
      return {
        segnala: function (daNaomi) { var t = Date.now(); if (t - ultimo < 2000) return; ultimo = t; ch.send({ type: 'broadcast', event: 'scrive', payload: { daNaomi: !!daNaomi } }); },
        chiudi: function () { sb.removeChannel(ch); }
      };
    },
    // in demo: simula una risposta dell'altra parte, per mostrare il tempo reale
    simulaRisposta: function (clienteId, daNaomi, testo, dopoMs) {
      if (LIVE) return;
      var chi = { clienteId: clienteId, daNaomi: daNaomi };
      setTimeout(function () { demo.scrittura.forEach(function (f) { f(chi); }); }, Math.max(300, (dopoMs || 2500) - 1800));
      setTimeout(function () { demo.commenti.push({ id: uid(), cliente_id: clienteId, da_naomi: daNaomi, testo: testo, letto: false, creato_il: new Date().toISOString() }); demoAvvisa(); }, dopoMs || 2500);
    }
  };
  window.NF = NF;
})();
