# naomifilippi.it · Guida di attivazione

Questa guida serve a collegare l'area clienti e la dashboard al database vero e a mettere il sito online.
Finché non la completi, l'accesso (`accedi.html`), l'area clienti (`area.html`) e la dashboard (`admin.html`) funzionano in **modalità demo** con dati di esempio.

Tempo stimato: 60–90 minuti, da fare con calma una volta sola.

---

## Cosa c'è nella cartella

| File / cartella | A cosa serve |
|---|---|
| `index.html` | Home del sito |
| `servizi.html`, `metodo.html`, `prezzi.html`, `recensioni.html`, `chi-sono.html`, `faq.html` | Le pagine del menu |
| `servizio-*.html` | Le 6 pagine dei servizi |
| `contatti.html`, `prenota.html`, `404.html` | Contatti, prenotazione, pagina di errore |
| `accedi.html` | Pagina di accesso (Google, LinkedIn, link via email) |
| `auth-callback.html` | Pagina di passaggio dopo il login: porta Naomi alla dashboard e i clienti alla loro area |
| `area.html` | Area riservata ai clienti (senza accesso rimanda ad `accedi`) |
| `admin.html` | Dashboard di Naomi (senza accesso rimanda ad `accedi`; un cliente viene portato alla sua area) |
| `vercel.json`, `sitemap.xml`, `robots.txt` | Impostazioni di pubblicazione e indicizzazione |
| `privacy.html`, `cookie-policy.html`, `termini.html` | Note legali (da completare con P.IVA, indirizzo, email) |
| `assets/config.js` | **L'unico file da modificare**: chiavi del database, WhatsApp, email, calendario |
| `supabase/setup.sql` | Script che crea database, regole di accesso e archivio file |
| `fonts/`, `assets/` | Caratteri, stili, immagini e librerie (non toccare) |

---

## Passo 1 · Crea il database su Supabase (10 minuti)

1. Vai su **supabase.com** e registrati con la tua email (Naomi deve essere la proprietaria: è lei la titolare dei dati dei clienti).
2. Clicca **New project**:
   - Nome: `naomifilippi`
   - Password del database: generala e salvala in un posto sicuro
   - Regione: **Central EU (Frankfurt)** — i dati restano nell'Unione europea
   - Piano: Free va benissimo per iniziare
3. Aspetta un paio di minuti che il progetto sia pronto.

> **Nota sul piano gratuito**: Supabase mette in pausa i progetti gratuiti dopo 7 giorni senza alcuna attività. Con clienti attivi non succede; se capita, basta riattivarlo dal pannello. Quando i clienti crescono conviene il piano Pro (25 $/mese).

---

## Passo 2 · Crea tabelle e regole (5 minuti)

1. In Supabase apri **SQL Editor → New query**.
2. Apri il file `supabase/setup.sql`, copia tutto e incollalo.
3. **Controlla l'ultima riga**: deve contenere l'email con cui Naomi accederà alla dashboard (ora c'è `hello@naomifilippi.it`). Se usa un altro indirizzo, cambialo.
4. Clicca **Run**. Deve comparire "Success".

Lo script crea:
- i profili dei clienti (creati da soli al primo accesso);
- documenti, messaggi, appuntamenti, note private di Naomi, richieste dal sito;
- l'archivio file privato `documenti` (max 20 MB a file, solo PDF, Word, ODT, TXT e immagini);
- le regole per cui **ogni cliente vede solo le proprie cose e Naomi vede tutto**.

Lo script si può rieseguire senza problemi.

---

## Passo 3 · Indirizzi del sito (2 minuti)

In Supabase: **Authentication → URL Configuration**
- **Site URL**: `https://naomifilippi.it`
- **Redirect URLs**, aggiungi (dopo il login tutti tornano qui, poi il sito smista per ruolo):
  - `https://naomifilippi.it/auth-callback`
  - `https://www.naomifilippi.it/auth-callback`
  - se vuoi provare le anteprime di Vercel: `https://*.vercel.app/auth-callback`

Annota anche l'indirizzo di ritorno di Supabase, ti serve per Google e LinkedIn:
`https://<ID-PROGETTO>.supabase.co/auth/v1/callback`
(lo trovi in **Authentication → Sign In / Providers → Google**, campo "Callback URL").

---

## Passo 4 · Accesso con Google (15 minuti)

1. Vai su **console.cloud.google.com** con l'account Google di Naomi e crea un progetto `naomifilippi`.
2. **APIs & Services → OAuth consent screen** (o "Google Auth Platform → Branding"):
   - Tipo utente: **External**
   - Nome app: `Naomi Filippi`, email di supporto, logo facoltativo
   - Dominio autorizzato: `naomifilippi.it`
   - Link a privacy: `https://naomifilippi.it/privacy.html` · termini: `https://naomifilippi.it/termini.html`
   - Ambiti (scopes): lascia solo `email`, `profile`, `openid`
   - Pubblica l'app ("Publish app") per renderla disponibile a tutti.
3. **Credentials → Create credentials → OAuth client ID**:
   - Tipo: **Web application**
   - Authorized JavaScript origins: `https://naomifilippi.it`
   - Authorized redirect URIs: `https://<ID-PROGETTO>.supabase.co/auth/v1/callback`
4. Copia **Client ID** e **Client secret**.
5. In Supabase: **Authentication → Sign In / Providers → Google** → attiva, incolla i due valori, salva.

---

## Passo 5 · Accesso con LinkedIn (15 minuti)

1. Vai su **linkedin.com/developers** → **Create app**.
   - LinkedIn chiede di collegare l'app a una **Pagina LinkedIn aziendale**: se Naomi non ne ha una, può crearne una semplice ("Naomi Filippi · Consulenza di carriera") in pochi minuti.
   - Nome app: `Naomi Filippi`, logo, link alla privacy.
2. Scheda **Products** → richiedi **Sign In with LinkedIn using OpenID Connect** (approvazione immediata).
3. Scheda **Auth**:
   - Authorized redirect URLs: `https://<ID-PROGETTO>.supabase.co/auth/v1/callback`
   - Copia **Client ID** e **Primary Client Secret**.
4. In Supabase: **Authentication → Sign In / Providers → LinkedIn (OIDC)** → attiva, incolla, salva.

---

## Passo 6 · Email di accesso (10 minuti, consigliato)

Chi non vuole usare Google o LinkedIn riceve un link di accesso via email.
Supabase invia poche email all'ora con il suo servizio di prova: per l'uso reale configura un invio tuo.

1. Crea un account gratuito su **Brevo** (o usa l'SMTP della tua casella professionale).
2. In Supabase: **Authentication → Emails → SMTP Settings** → inserisci host, porta, utente e password SMTP; mittente `Naomi Filippi <info@naomifilippi.it>`.
3. In **Emails → Templates → Magic Link** traduci il testo in italiano, per esempio:
   > Oggetto: Il tuo accesso all'area clienti
   > Ciao, clicca qui per entrare nella tua area riservata: {{ .ConfirmationURL }} — Il link vale 1 ora.

---

## Passo 7 · Collega il sito al database (2 minuti)

1. In Supabase: **Project Settings → API** (o "API Keys").
2. Copia **Project URL** e la chiave pubblica (**anon** oppure **publishable**, quella che inizia con `eyJ…` o `sb_publishable_…`). **Non usare mai la chiave "service_role" o "secret".**
3. Apri `assets/config.js` e incolla:

```js
SUPABASE_URL: "https://<ID-PROGETTO>.supabase.co",
SUPABASE_ANON_KEY: "…la chiave pubblica…",
EMAIL: "info@naomifilippi.it",
```

4. Facoltativo: in `CALENDARIO_URL` incolla il link del calendario Calendly o Cal.com per la call conoscitiva. Senza, la pagina Prenota propone WhatsApp.
   Nel calendario imposta come luogo della call conoscitiva **Telefono** ("chiamo io il cliente", con il numero obbligatorio): la videochiamata serve solo per le sessioni di orientamento, coaching, simulazione del colloquio e negoziazione.

Nella dashboard, quando aggiungi un appuntamento: con il link è una videochiamata, senza link è una telefonata e il cliente vede "Ti chiamo io" con il suo numero.

Da questo momento la scritta "Modalità demo" sparisce, il modulo contatti e l'audit gratuito salvano le richieste nella dashboard.

---

## Passo 8 · Metti il sito online su Vercel (10 minuti)

1. Registra il dominio **naomifilippi.it** (e se vuoi `.com`) da un registrar, per esempio Aruba, Register.it o direttamente su Vercel.
2. Vai su **vercel.com** → **Add New → Project** → trascina la cartella del sito (o collegala da GitHub).
3. **Settings → Domains** → aggiungi `naomifilippi.it` e `www.naomifilippi.it` e segui le istruzioni DNS.
4. La pagina `404.html` viene usata automaticamente per gli indirizzi inesistenti.
5. Il file `vercel.json` è già pronto: toglie `.html` dagli indirizzi (`naomifilippi.it/prezzi`), aggiunge le intestazioni di sicurezza e impedisce l'indicizzazione di accesso, area e dashboard.

---

## Passo 9 · Prova tutto (10 minuti)

1. Apri `https://naomifilippi.it/accedi` (o il pulsante **Accedi** in alto) e accedi con l'account di Naomi → arrivi da sola sulla dashboard (vuota).
2. Da un altro browser (o in incognito) apri `https://naomifilippi.it/accedi` e accedi con un **secondo** account Google → arrivi nell'area clienti: carica un PDF e scrivi un messaggio.
3. Torna sulla dashboard: il cliente compare nell'elenco con il messaggio da leggere. Rispondi e carica un documento: il cliente lo vede subito, con l'etichetta "Da Naomi".
4. Invia un messaggio dal modulo `contatti.html` → compare in **Richieste dal sito**.

---

## Sicurezza, in breve

- Attiva la **verifica in due passaggi** sull'account Google di Naomi e sull'account Supabase.
- Per dare accesso alla dashboard a un'altra persona, aggiungi la sua email alla tabella `admins` (SQL Editor): `insert into public.admins (email) values ('email@esempio.it');`
- Per la manutenzione tecnica, Naomi può invitare Sofiane nel progetto Supabase (**Organization → Team**) senza cedere la proprietà.
- Prima di pubblicare, completa nelle pagine legali: Partita IVA, indirizzo, email, regime fiscale, fornitori effettivi (le parti evidenziate in rosa) e falle rileggere a un professionista.
