/*
  Configurazione del sito di Naomi Filippi.
  Finché SUPABASE_URL e SUPABASE_ANON_KEY sono vuoti, area clienti e dashboard
  funzionano in MODALITÀ DEMO con dati di esempio (niente viene salvato davvero).
  Per collegarle al database vero segui la GUIDA-SETUP.md e incolla qui i due valori
  che trovi in Supabase → Project Settings → API.
  La chiave "anon" è pubblica per progettazione: la sicurezza è garantita dalle regole
  (Row Level Security) create con supabase/setup.sql.
*/
window.NF_CONFIG = {
  SUPABASE_URL: "https://xyzypsievzmrxhpuorzz.supabase.co",          // es. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: "sb_publishable_2jT8hdyOR5l5wOYrHYjjtQ_Lu7gvrz7",     // es. "eyJhbGciOi..."
  SITE_URL: "https://naomifilippi.it",

  // Metodi di accesso attivi. Metti true solo dopo aver configurato Google e LinkedIn su Supabase
  // (GUIDA-SETUP, passi 4 e 5): finché sono false la pagina Accedi mostra solo il link via email.
  ACCESSO_GOOGLE: false,
  ACCESSO_LINKEDIN: false,

  // Contatti
  WHATSAPP: "393887528320",  // numero in formato internazionale, senza + e senza spazi
  WHATSAPP_TESTO: "Ciao Naomi, ti scrivo dal tuo sito: vorrei informazioni sulla consulenza di carriera.",
  EMAIL: "",                 // es. "info@naomifilippi.it"

  // Prenotazioni: incolla il link del tuo calendario Calendly o Cal.com (facoltativo)
  CALENDARIO_URL: "",        // es. "https://cal.com/naomifilippi/call-conoscitiva"

  // Dimensione massima dei file caricati dai clienti (MB)
  MAX_FILE_MB: 20
};
