-- =====================================================================
--  naomifilippi.it · database dell'area clienti e della dashboard
--  Da eseguire UNA volta in Supabase → SQL Editor → New query → Run.
--  Crea tabelle, regole di accesso (Row Level Security), archivio file
--  privato e aggiornamenti in tempo reale dei commenti.
--  Alla fine, sostituisci l'email nell'ultima istruzione con quella di Naomi.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Amministratori (chi può vedere tutti i clienti)
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  email text primary key check (email = lower(email))
);
alter table public.admins enable row level security;
-- nessuna policy: la tabella è leggibile solo tramite la funzione is_admin()

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Profili dei clienti (creati in automatico al primo accesso)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nome text,
  avatar_url text,
  telefono text,
  obiettivo text,
  fase text check (fase in ('neolaureato','crescita','cambio','senior')),
  servizio text,
  stato text not null default 'nuovo' check (stato in ('nuovo','attivo','in pausa','concluso')),
  passo smallint not null default 0 check (passo between 0 and 4),
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now(),
  ultimo_accesso timestamptz
);
alter table public.profiles enable row level security;

drop policy if exists "profilo: lettura" on public.profiles;
create policy "profilo: lettura" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "profilo: modifica" on public.profiles;
create policy "profilo: modifica" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- il cliente può cambiare solo i propri dati anagrafici, non stato e percorso
create or replace function public.profili_protezione()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.stato := old.stato;
    new.passo := old.passo;
    new.servizio := old.servizio;
    new.email := old.email;
  end if;
  new.id := old.id;
  new.aggiornato_il := now();
  return new;
end $$;
drop trigger if exists profili_protezione on public.profiles;
create trigger profili_protezione before update on public.profiles
  for each row execute function public.profili_protezione();

-- crea il profilo al primo accesso con Google, LinkedIn o email
create or replace function public.nuovo_utente()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, nome, avatar_url)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists nuovo_utente on auth.users;
create trigger nuovo_utente after insert on auth.users
  for each row execute function public.nuovo_utente();

-- ---------------------------------------------------------------------
-- 3. Documenti (i file veri stanno nell'archivio "documenti")
-- ---------------------------------------------------------------------
create table if not exists public.documenti (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  caricato_da uuid not null default auth.uid() references auth.users(id) on delete set null,
  da_naomi boolean not null default false,
  nome text not null check (char_length(nome) between 1 and 200),
  percorso text not null unique,
  dimensione bigint check (dimensione >= 0),
  tipo text,
  categoria text not null default 'altro' check (categoria in ('cv','lettera','linkedin','annuncio','offerta','consegna','altro')),
  creato_il timestamptz not null default now()
);
create index if not exists documenti_cliente on public.documenti (cliente_id, creato_il desc);
alter table public.documenti enable row level security;

drop policy if exists "documenti: lettura" on public.documenti;
create policy "documenti: lettura" on public.documenti
  for select to authenticated using (cliente_id = auth.uid() or public.is_admin());
drop policy if exists "documenti: caricamento" on public.documenti;
create policy "documenti: caricamento" on public.documenti
  for insert to authenticated with check (
    caricato_da = auth.uid()
    and (cliente_id = auth.uid() or public.is_admin())
    and split_part(percorso, '/', 1) = cliente_id::text
  );
drop policy if exists "documenti: eliminazione" on public.documenti;
create policy "documenti: eliminazione" on public.documenti
  for delete to authenticated using (
    public.is_admin() or (cliente_id = auth.uid() and caricato_da = auth.uid())
  );

create or replace function public.documenti_autore()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.caricato_da := auth.uid();
  new.da_naomi := public.is_admin();
  if new.da_naomi and new.categoria = 'altro' then new.categoria := 'consegna'; end if;
  return new;
end $$;
drop trigger if exists documenti_autore on public.documenti;
create trigger documenti_autore before insert on public.documenti
  for each row execute function public.documenti_autore();

-- ---------------------------------------------------------------------
-- 4. Commenti (conversazione tra cliente e Naomi, anche su un documento)
-- ---------------------------------------------------------------------
create table if not exists public.commenti (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  autore_id uuid not null default auth.uid() references auth.users(id) on delete set null,
  documento_id uuid references public.documenti(id) on delete cascade,
  da_naomi boolean not null default false,
  testo text not null check (char_length(testo) between 1 and 5000),
  letto boolean not null default false,
  creato_il timestamptz not null default now()
);
create index if not exists commenti_cliente on public.commenti (cliente_id, creato_il);
alter table public.commenti enable row level security;

drop policy if exists "commenti: lettura" on public.commenti;
create policy "commenti: lettura" on public.commenti
  for select to authenticated using (cliente_id = auth.uid() or public.is_admin());
drop policy if exists "commenti: scrittura" on public.commenti;
create policy "commenti: scrittura" on public.commenti
  for insert to authenticated with check (
    autore_id = auth.uid() and (cliente_id = auth.uid() or public.is_admin())
  );
drop policy if exists "commenti: segna come letto" on public.commenti;
create policy "commenti: segna come letto" on public.commenti
  for update to authenticated using (cliente_id = auth.uid() or public.is_admin())
  with check (cliente_id = auth.uid() or public.is_admin());
drop policy if exists "commenti: eliminazione" on public.commenti;
create policy "commenti: eliminazione" on public.commenti
  for delete to authenticated using (autore_id = auth.uid() or public.is_admin());

create or replace function public.commenti_autore()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.autore_id := auth.uid();
    new.da_naomi := public.is_admin();
    new.letto := false;
  else
    -- dopo l'invio si può cambiare solo lo stato "letto"
    new.testo := old.testo; new.autore_id := old.autore_id; new.cliente_id := old.cliente_id;
    new.documento_id := old.documento_id; new.da_naomi := old.da_naomi; new.creato_il := old.creato_il;
  end if;
  return new;
end $$;
drop trigger if exists commenti_autore on public.commenti;
create trigger commenti_autore before insert or update on public.commenti
  for each row execute function public.commenti_autore();

-- ---------------------------------------------------------------------
-- 5. Appuntamenti (li inserisce Naomi, il cliente li vede)
-- ---------------------------------------------------------------------
create table if not exists public.appuntamenti (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  inizio timestamptz not null,
  durata_min smallint not null default 60 check (durata_min between 10 and 240),
  titolo text not null check (char_length(titolo) between 1 and 200),
  link text,
  note text,
  creato_il timestamptz not null default now()
);
create index if not exists appuntamenti_cliente on public.appuntamenti (cliente_id, inizio);
alter table public.appuntamenti enable row level security;
drop policy if exists "appuntamenti: lettura" on public.appuntamenti;
create policy "appuntamenti: lettura" on public.appuntamenti
  for select to authenticated using (cliente_id = auth.uid() or public.is_admin());
drop policy if exists "appuntamenti: gestione naomi" on public.appuntamenti;
create policy "appuntamenti: gestione naomi" on public.appuntamenti
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 6. Note private di Naomi (il cliente non le vede mai)
-- ---------------------------------------------------------------------
create table if not exists public.note_private (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  testo text not null check (char_length(testo) between 1 and 10000),
  creato_il timestamptz not null default now()
);
alter table public.note_private enable row level security;
drop policy if exists "note: solo naomi" on public.note_private;
create policy "note: solo naomi" on public.note_private
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 7. Richieste dal sito (modulo contatti e audit gratuito)
-- ---------------------------------------------------------------------
create table if not exists public.richieste (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  telefono text check (char_length(telefono) <= 40),
  servizio text check (char_length(servizio) <= 120),
  messaggio text check (char_length(messaggio) <= 4000),
  linkedin text check (char_length(linkedin) <= 300),
  origine text not null default 'contatti' check (origine in ('contatti','audit','prenota')),
  gestita boolean not null default false,
  creato_il timestamptz not null default now()
);
alter table public.richieste enable row level security;
drop policy if exists "richieste: invio dal sito" on public.richieste;
create policy "richieste: invio dal sito" on public.richieste
  for insert to anon, authenticated with check (gestita = false);
drop policy if exists "richieste: gestione naomi" on public.richieste;
create policy "richieste: gestione naomi" on public.richieste
  for select to authenticated using (public.is_admin());
drop policy if exists "richieste: aggiornamento naomi" on public.richieste;
create policy "richieste: aggiornamento naomi" on public.richieste
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "richieste: eliminazione naomi" on public.richieste;
create policy "richieste: eliminazione naomi" on public.richieste
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- 8. Panoramica clienti per la dashboard di Naomi
-- ---------------------------------------------------------------------
create or replace function public.email_admin(e text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins a where a.email = lower(coalesce(e, ''))) $$;
revoke all on function public.email_admin(text) from public;
grant execute on function public.email_admin(text) to authenticated;

-- ---------------------------------------------------------------------
create or replace view public.clienti_panoramica
with (security_invoker = true) as
select
  p.*,
  (select count(*) from public.documenti d where d.cliente_id = p.id) as n_documenti,
  (select count(*) from public.commenti c where c.cliente_id = p.id and not c.da_naomi and not c.letto) as n_da_leggere,
  greatest(
    p.aggiornato_il,
    (select max(d.creato_il) from public.documenti d where d.cliente_id = p.id),
    (select max(c.creato_il) from public.commenti c where c.cliente_id = p.id)
  ) as ultima_attivita
from public.profiles p
where not public.email_admin(p.email);

-- ---------------------------------------------------------------------
-- 9. Permessi di base sulle tabelle (le regole sopra decidono le righe)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, delete on public.documenti to authenticated;
grant select, insert, update, delete on public.commenti to authenticated;
grant select, insert, update, delete on public.appuntamenti to authenticated;
grant select, insert, update, delete on public.note_private to authenticated;
grant insert on public.richieste to anon, authenticated;
grant select, update, delete on public.richieste to authenticated;
grant select on public.clienti_panoramica to authenticated;

-- ---------------------------------------------------------------------
-- 10. Archivio file privato: ogni cliente ha una cartella con il proprio id
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documenti', 'documenti', false, 20971520, array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'text/plain',
  'image/jpeg','image/png','image/webp'
])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "archivio: lettura" on storage.objects;
create policy "archivio: lettura" on storage.objects
  for select to authenticated using (
    bucket_id = 'documenti' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
drop policy if exists "archivio: caricamento" on storage.objects;
create policy "archivio: caricamento" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'documenti' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
drop policy if exists "archivio: eliminazione" on storage.objects;
create policy "archivio: eliminazione" on storage.objects
  for delete to authenticated using (
    bucket_id = 'documenti' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- ---------------------------------------------------------------------
-- 11. Aggiornamenti in tempo reale per commenti e documenti
-- ---------------------------------------------------------------------
do $$ begin
  begin alter publication supabase_realtime add table public.commenti; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.documenti; exception when duplicate_object then null; end;
end $$;

-- ---------------------------------------------------------------------
-- 12. ULTIMO PASSO: l'email con cui Naomi accede diventa amministratrice.
--     Sostituisci l'indirizzo qui sotto e riesegui solo questa riga.
-- ---------------------------------------------------------------------
insert into public.admins (email) values (lower('hello@naomifilippi.it'))
on conflict do nothing;
