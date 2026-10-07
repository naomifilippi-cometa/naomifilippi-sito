-- =====================================================================
--  naomifilippi.it · gestionale di Naomi
--  Clienti fuori piattaforma (senza account) e stato di ogni servizio.
--  Da eseguire UNA volta, dopo setup.sql: Supabase → SQL Editor → New query
--  → incolla tutto → Run. Si può rieseguire senza danni.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Clienti senza account: un profilo può esistere anche senza login
-- ---------------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles alter column id set default gen_random_uuid();
alter table public.profiles add column if not exists esterno boolean not null default false;
alter table public.profiles add column if not exists fonte text;
do $$ begin
  alter table public.profiles add constraint profiles_fonte_lunghezza check (char_length(fonte) <= 60);
exception when duplicate_object then null; end $$;

-- prima ci pensava il vincolo: se un account viene eliminato, sparisce anche il suo profilo
create or replace function public.utente_eliminato()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from public.profiles where id = old.id and not esterno;
  return old;
end $$;
drop trigger if exists utente_eliminato on auth.users;
create trigger utente_eliminato after delete on auth.users
  for each row execute function public.utente_eliminato();

-- Naomi può creare ed eliminare solo i clienti fuori piattaforma
drop policy if exists "profilo: creazione naomi" on public.profiles;
create policy "profilo: creazione naomi" on public.profiles
  for insert to authenticated with check (public.is_admin() and esterno);
drop policy if exists "profilo: eliminazione naomi" on public.profiles;
create policy "profilo: eliminazione naomi" on public.profiles
  for delete to authenticated using (public.is_admin() and esterno);
grant insert, delete on public.profiles to authenticated;

-- il cliente può cambiare solo i propri dati anagrafici; il collegamento automatico (sotto) può tutto
create or replace function public.profili_protezione()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() and coalesce(current_setting('nf.collega', true), '') <> 'si' then
    new.stato := old.stato;
    new.passo := old.passo;
    new.servizio := old.servizio;
    new.email := old.email;
    new.esterno := old.esterno;
    new.fonte := old.fonte;
  end if;
  new.id := old.id;
  new.aggiornato_il := now();
  return new;
end $$;

-- i messaggi restano immutabili, tranne quando una scheda esterna si collega a un account
create or replace function public.commenti_autore()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.autore_id := auth.uid();
    new.da_naomi := public.is_admin();
    new.letto := false;
  elsif coalesce(current_setting('nf.collega', true), '') <> 'si' then
    new.testo := old.testo; new.autore_id := old.autore_id; new.cliente_id := old.cliente_id;
    new.documento_id := old.documento_id; new.da_naomi := old.da_naomi; new.creato_il := old.creato_il;
  end if;
  return new;
end $$;

-- ---------------------------------------------------------------------
-- 2. Servizi del cliente, ognuno con il suo stato
-- ---------------------------------------------------------------------
create table if not exists public.servizi_cliente (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  servizio text not null check (char_length(servizio) between 1 and 120),
  stato text not null default 'da iniziare' check (stato in ('da iniziare','in corso','in revisione','consegnato','chiuso')),
  scadenza date,
  prezzo numeric(10,2) check (prezzo >= 0),
  incassato numeric(10,2) not null default 0 check (incassato >= 0),
  aggiornamento text check (char_length(aggiornamento) <= 1000),
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now()
);
create index if not exists servizi_cliente_cliente on public.servizi_cliente (cliente_id);
alter table public.servizi_cliente enable row level security;
drop policy if exists "servizi: lettura" on public.servizi_cliente;
create policy "servizi: lettura" on public.servizi_cliente
  for select to authenticated using (cliente_id = auth.uid() or public.is_admin());
drop policy if exists "servizi: gestione naomi" on public.servizi_cliente;
create policy "servizi: gestione naomi" on public.servizi_cliente
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.servizi_cliente to authenticated;

create or replace function public.servizi_aggiornato()
returns trigger language plpgsql as $$
begin new.aggiornato_il := now(); return new; end $$;
drop trigger if exists servizi_aggiornato on public.servizi_cliente;
create trigger servizi_aggiornato before update on public.servizi_cliente
  for each row execute function public.servizi_aggiornato();

-- ---------------------------------------------------------------------
-- 3. Quando un cliente esterno si registra con la stessa email (verificata),
--    la sua scheda si collega da sola all'account: servizi, documenti,
--    appuntamenti, messaggi e note passano al nuovo profilo.
-- ---------------------------------------------------------------------
create or replace function public.collega_esterno(uid uuid, mail text)
returns void language plpgsql security definer set search_path = public as $$
declare v public.profiles;
begin
  if mail is null then return; end if;
  select * into v from public.profiles
   where esterno and email = lower(mail) and id <> uid
   order by creato_il limit 1;
  if v.id is null then return; end if;
  perform set_config('nf.collega', 'si', true);
  update public.profiles p set
    telefono = coalesce(p.telefono, v.telefono),
    obiettivo = coalesce(p.obiettivo, v.obiettivo),
    fase = coalesce(p.fase, v.fase),
    servizio = coalesce(v.servizio, p.servizio),
    stato = v.stato, passo = v.passo, fonte = v.fonte,
    creato_il = least(p.creato_il, v.creato_il)
  where p.id = uid;
  update public.servizi_cliente set cliente_id = uid where cliente_id = v.id;
  update public.documenti set cliente_id = uid where cliente_id = v.id;
  update public.commenti set cliente_id = uid where cliente_id = v.id;
  update public.appuntamenti set cliente_id = uid where cliente_id = v.id;
  update public.note_private set cliente_id = uid where cliente_id = v.id;
  delete from public.profiles where id = v.id;
  perform set_config('nf.collega', '', true);
end $$;
revoke all on function public.collega_esterno(uuid, text) from public, anon, authenticated;

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
  -- Google e LinkedIn arrivano con l'email già verificata
  if new.email_confirmed_at is not null then perform public.collega_esterno(new.id, new.email); end if;
  return new;
end $$;

-- con email e password il collegamento avviene quando l'email viene confermata
create or replace function public.email_confermata()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.collega_esterno(new.id, new.email);
  return new;
end $$;
drop trigger if exists email_confermata on auth.users;
create trigger email_confermata after update of email_confirmed_at on auth.users
  for each row when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.email_confermata();

-- i file caricati quando la scheda era esterna restano leggibili dal cliente collegato
drop policy if exists "archivio: lettura" on storage.objects;
create policy "archivio: lettura" on storage.objects
  for select to authenticated using (
    bucket_id = 'documenti' and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
      or exists (select 1 from public.documenti d where d.percorso = name and d.cliente_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------
-- 4. Panoramica per la dashboard, con servizi aperti e importi da incassare
-- ---------------------------------------------------------------------
drop view if exists public.clienti_panoramica;
create view public.clienti_panoramica
with (security_invoker = true) as
select
  p.*,
  (select count(*) from public.documenti d where d.cliente_id = p.id) as n_documenti,
  (select count(*) from public.commenti c where c.cliente_id = p.id and not c.da_naomi and not c.letto) as n_da_leggere,
  (select count(*) from public.servizi_cliente s where s.cliente_id = p.id and s.stato not in ('consegnato','chiuso')) as n_servizi_aperti,
  (select coalesce(sum(greatest(coalesce(s.prezzo, 0) - s.incassato, 0)), 0) from public.servizi_cliente s where s.cliente_id = p.id) as da_incassare,
  (select min(s.scadenza) from public.servizi_cliente s where s.cliente_id = p.id and s.stato not in ('consegnato','chiuso')) as prossima_scadenza,
  greatest(
    p.aggiornato_il,
    (select max(d.creato_il) from public.documenti d where d.cliente_id = p.id),
    (select max(c.creato_il) from public.commenti c where c.cliente_id = p.id),
    (select max(s.aggiornato_il) from public.servizi_cliente s where s.cliente_id = p.id)
  ) as ultima_attivita
from public.profiles p
where not public.email_admin(p.email);
grant select on public.clienti_panoramica to authenticated;

-- ---------------------------------------------------------------------
-- 5. Aggiornamenti in tempo reale anche per i servizi
-- ---------------------------------------------------------------------
do $$ begin
  begin alter publication supabase_realtime add table public.servizi_cliente; exception when duplicate_object then null; end;
end $$;
