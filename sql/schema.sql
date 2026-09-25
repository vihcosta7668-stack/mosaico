-- =====================================================================
-- Mosaico — esquema do banco (Supabase / Postgres)
-- Rodar no SQL Editor do projeto, de uma vez.
-- =====================================================================

-- ---------------------------------------------------------------- perfis
-- auth.users é gerenciado pelo Supabase e não deve ser alterado.
-- Os dados do app ficam em "perfis", ligados por id.
create table if not exists public.perfis (
  id                 uuid primary key references auth.users(id) on delete cascade,
  email              text,
  sotaque_preferido  text default 'us-geral',
  nivel              text default 'A2',
  criado_em          timestamptz not null default now(),
  atualizado_em      timestamptz not null default now()
);

-- Cria o perfil automaticamente no cadastro, já com a preferência escolhida na tela.
create or replace function public.criar_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, email, sotaque_preferido)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'sotaque_preferido', 'us-geral'))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();

-- ------------------------------------------------------------- ocasiões
-- Catálogo público (leitura para todos). O conteúdo pesado — frases, áudios —
-- viaja no app; aqui fica só o índice, para relatórios e para novas ocasiões
-- aparecerem sem republicar o app.
create table if not exists public.occasions (
  id          text primary key,                  -- ex.: 'ie:restaurante'
  sotaque_id  text not null,                     -- ex.: 'ie'
  titulo      text not null,                     -- ex.: 'No restaurante'
  categoria   text not null,                     -- viagem | trabalho | social
  nivel       text default 'A2',
  ordem       int  default 0,
  ativo       boolean default true,
  criado_em   timestamptz not null default now()
);
create index if not exists idx_occasions_sotaque on public.occasions (sotaque_id, ordem);

-- ------------------------------------------------------- progresso do usuário
create table if not exists public.user_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  occasion_id  text not null,
  status       text not null default 'em_andamento'
               check (status in ('em_andamento','concluido')),
  pontos       int  not null default 0,
  sotaque_id   text,
  categoria    text,
  updated_at   timestamptz not null default now(),   -- carimbo do CLIENTE: resolve conflito
  servidor_em  timestamptz not null default now(),   -- carimbo do servidor: auditoria
  unique (user_id, occasion_id)                      -- a chave que torna o envio idempotente
);
create index if not exists idx_progress_user on public.user_progress (user_id, updated_at desc);

-- ============================ Row Level Security ============================
alter table public.perfis        enable row level security;
alter table public.user_progress enable row level security;
alter table public.occasions     enable row level security;

drop policy if exists "perfil proprio" on public.perfis;
create policy "perfil proprio" on public.perfis
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "progresso proprio" on public.user_progress;
create policy "progresso proprio" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ocasioes publicas" on public.occasions;
create policy "ocasioes publicas" on public.occasions
  for select using (ativo);

-- ===================== função de gravação com conflito ======================
-- É ela que o app chama pela fila. Três garantias:
--   1. idempotente: reenviar o mesmo item não cria linha duplicada;
--   2. último a escrever vence, comparando o updated_at do cliente;
--   3. pontuação nunca regride (mantém o maior valor).
create or replace function public.registrar_progresso(
  p_occasion_id text,
  p_status      text,
  p_pontos      int,
  p_updated_at  timestamptz
) returns public.user_progress
language plpgsql security invoker as $$
declare linha public.user_progress;
begin
  if auth.uid() is null then
    raise exception 'sem sessao' using errcode = '42501';
  end if;

  insert into public.user_progress (user_id, occasion_id, status, pontos, updated_at,
                                    sotaque_id, categoria)
  values (auth.uid(), p_occasion_id, p_status, coalesce(p_pontos,0), p_updated_at,
          split_part(p_occasion_id, ':', 1),
          (select categoria from public.occasions where id = p_occasion_id))
  on conflict (user_id, occasion_id) do update
    set status      = excluded.status,
        pontos      = greatest(public.user_progress.pontos, excluded.pontos),
        updated_at  = excluded.updated_at,
        servidor_em = now()
    where excluded.updated_at > public.user_progress.updated_at   -- só se for mais novo
  returning * into linha;

  -- Envio mais antigo que o registro atual: nada muda, mas devolve a linha
  -- para o cliente tirar o item da fila sem erro.
  if linha is null then
    select * into linha from public.user_progress
     where user_id = auth.uid() and occasion_id = p_occasion_id;
  end if;

  return linha;
end $$;

-- Pontuação acumulada, se você quiser um ranking depois.
create or replace function public.somar_pontos(p_delta int, p_origem text)
returns int language plpgsql security invoker as $$
declare total int;
begin
  update public.perfis
     set atualizado_em = now()
   where id = auth.uid();
  select coalesce(sum(pontos),0) into total
    from public.user_progress where user_id = auth.uid();
  return total;
end $$;

-- ================================ conferência ===============================
-- select * from public.perfis;
-- select * from public.user_progress order by updated_at desc limit 20;
