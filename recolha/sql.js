// Gera a instrução SQL que substitui os dados de hoje (tabelas odds_aula e odds_aula_resumo) pelo resultado da análise.
(() => {
  const o = JSON.parse((0, eval)(sessionStorage.getItem('__aulas_analisar')));
  if (o.rows.length < 5) return 'POUCOS DADOS: ' + o.rows.length + ' linhas. Não gravar.';
  const j = JSON.stringify(o).replace(/\$json\$/g, '');
  const hoje = "(now() at time zone 'Europe/Lisbon')::date";
  return `with d as (select $json$${j}$json$::jsonb as j),
apaga as (delete from public.odds_aula where dia = ${hoje}),
ins as (insert into public.odds_aula (dia, inicio, desporto, competicao, jogo, jogo_id, mercado, opcoes, odds)
  select ${hoje}, (r->>'inicio')::timestamptz, r->>'desporto', r->>'competicao', r->>'jogo', r->>'jogo_id', r->>'mercado',
    array(select x from jsonb_array_elements_text(r->'opcoes') with ordinality t(x, i) order by i),
    array(select x::numeric from jsonb_array_elements_text(r->'odds') with ordinality t(x, i) order by i)
  from d, jsonb_array_elements(d.j->'rows') r returning 1)
insert into public.odds_aula_resumo (dia, recolhido_em, jogos, jogos_completos, mercados, por_tipo, por_desporto)
select ${hoje}, now(), (j->'resumo'->>'jogos')::int, (j->'resumo'->>'jogos_completos')::int, (j->'resumo'->>'mercados')::int, j->'resumo'->'por_tipo', j->'resumo'->'por_desporto' from d
on conflict (dia) do update set recolhido_em = excluded.recolhido_em, jogos = excluded.jogos, jogos_completos = excluded.jogos_completos,
  mercados = excluded.mercados, por_tipo = excluded.por_tipo, por_desporto = excluded.por_desporto;`;
})()
