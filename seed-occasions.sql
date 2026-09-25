-- =====================================================================
-- Catálogo de situações no banco.
-- IMPORTANTE: aqui fica só o ÍNDICE (id, título, categoria, nível).
-- O texto, o diálogo e o áudio ficam em conteudo/situacoes.js, dentro do app.
-- O id precisa ser idêntico ao id usado lá.
-- =====================================================================

insert into public.occasions (id, sotaque_id, titulo, categoria, nivel, ordem, ativo) values
  ('restaurante', 'todos', 'No restaurante',        'viagem',   'A2', 1,  true),
  ('aeroporto',   'todos', 'No aeroporto',          'viagem',   'A2', 2,  true),
  ('reuniao',     'todos', 'Reunião online',        'trabalho', 'B1', 3,  true),
  ('hotel',       'todos', 'No hotel',              'viagem',   'A2', 4,  false),
  ('transporte',  'todos', 'Transporte urbano',     'viagem',   'A2', 5,  false),
  ('compras',     'todos', 'Compras',               'viagem',   'A2', 6,  false),
  ('telefone',    'todos', 'Telefonema difícil',    'trabalho', 'B1', 7,  false),
  ('entrevista',  'todos', 'Entrevista de emprego', 'trabalho', 'B1', 8,  false),
  ('apresentar',  'todos', 'Apresentar um projeto', 'trabalho', 'B2', 9,  false),
  ('direcoes',    'todos', 'Pedir informação',      'diaadia',  'A1', 10, false),
  ('conversa',    'todos', 'Conversa curta',        'diaadia',  'A2', 11, false),
  ('farmacia',    'todos', 'Farmácia e saúde',      'diaadia',  'A2', 12, false),
  ('fundamentos', 'todos', 'Fundamentos do sotaque','sotaque',  'A1', 0,  true)
on conflict (id) do update
  set titulo = excluded.titulo, categoria = excluded.categoria,
      nivel = excluded.nivel, ordem = excluded.ordem, ativo = excluded.ativo;

-- sotaque_id = 'todos' porque a situação serve a todos os sotaques:
-- quem é específico de um lugar é a CAMADA, que vive no app.

-- ---------------------------------------------------------------------
-- Ajuste na função de gravação: o occasion_id agora tem três partes
--   sotaque : situação : etapa      ex.: 'uk-rp:restaurante:ouvir'
-- Rode este bloco também se você já tinha criado o schema antes.
-- ---------------------------------------------------------------------
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
          split_part(p_occasion_id, ':', 1),                                   -- sotaque
          (select categoria from public.occasions
            where id = split_part(p_occasion_id, ':', 2)))                     -- situação
  on conflict (user_id, occasion_id) do update
    set status      = excluded.status,
        pontos      = greatest(public.user_progress.pontos, excluded.pontos),
        updated_at  = excluded.updated_at,
        servidor_em = now()
    where excluded.updated_at > public.user_progress.updated_at
  returning * into linha;

  if linha is null then
    select * into linha from public.user_progress
     where user_id = auth.uid() and occasion_id = p_occasion_id;
  end if;

  return linha;
end $$;

-- Conferência: quantas etapas cada pessoa fez, por sotaque e por situação
-- select sotaque_id, split_part(occasion_id,':',2) as situacao, count(*)
--   from public.user_progress group by 1,2 order by 3 desc;
