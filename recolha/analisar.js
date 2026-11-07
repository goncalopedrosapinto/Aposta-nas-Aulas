// No fim: para cada jogo, a opção com odd >= 1,20 com maior probabilidade real (Shin; dupla hipótese a partir do 1X2).
// Devolve as linhas a gravar (os 40 jogos mais seguros: mercado principal + mercado da melhor opção) e o resumo das margens.
(() => {
  const MIN = 1.2, TOP = 40;
  const db = JSON.parse(sessionStorage.getItem('__aulas_dados') || '{}');
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const shin = (odds) => {
    const q = odds.map((o) => 1 / o), S = sum(q);
    const at = (z) => q.map((qi) => (Math.sqrt(z * z + 4 * (1 - z) * qi * qi / S) - z) / (2 * (1 - z)));
    let lo = 0, hi = 0.99;
    for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (sum(at(mid)) > 1) lo = mid; else hi = mid; }
    return at((lo + hi) / 2);
  };
  const isMain3 = (m) => m[1].length === 3 && sum(m[2].map((o) => 1 / o)) <= 1.4 && /^Resultado( \(Tempo Regulamentar\))?$/i.test(m[0]);
  const tipo = (name, dupla) => dupla ? 'Dupla hipótese'
    : /handicap/i.test(name) ? 'Handicap'
    : /duas equipas marcam/i.test(name) ? 'Ambas marcam'
    : /set|per[ií]odo|parte|quarto|intervalo/i.test(name) ? 'Parte do jogo (set, parte, período)'
    : /acima|abaixo|total|mais\/menos/i.test(name) ? 'Acima/abaixo (golos, pontos, jogos)'
    : /^(resultado|vencedor)/i.test(name) ? 'Resultado final'
    : 'Outros';
  const acc = (o, k, v) => { const x = (o[k] = o[k] || { n: 0, soma: 0 }); x.n++; x.soma += v; };
  const tipos = {}, desportos = {}, cand = [];
  let nMercados = 0, completos = 0;
  const agora = new Date();
  for (const g of Object.values(db)) {
    if (new Date(g.inicio) <= agora) continue; // já começou
    if (g.completo) completos++;
    const r = g.mercados.find(isMain3), p1x2 = r ? shin(r[2]) : null;
    let best = null;
    g.mercados.forEach((m, mi) => {
      if (/anula|devolv|reembols|ou vence/i.test(m[0])) return;
      const S = sum(m[2].map((o) => 1 / o)), dupla = m[1].length === 3 && S > 1.8;
      if (dupla && (!p1x2 || /mpate/i.test(m[1][1]))) return;
      const p = dupla ? [p1x2[0] + p1x2[1], p1x2[0] + p1x2[2], p1x2[1] + p1x2[2]] : shin(m[2]);
      const margem = dupla ? 1 - 2 / S : 1 - 1 / S;
      nMercados++;
      if (g.completo) acc(tipos, tipo(m[0], dupla), margem);
      m[2].forEach((o, k) => {
        if (o >= MIN && (!best || p[k] > best.p + 1e-9 || (Math.abs(p[k] - best.p) <= 1e-9 && margem < best.margem))) best = { p: p[k], mi, margem };
      });
    });
    const main = g.mercados[0];
    acc(desportos, g.desporto, 1 - 1 / sum(main[2].map((o) => 1 / o)));
    if (best) cand.push({ g, best });
  }
  cand.sort((a, b) => b.best.p - a.best.p);
  const rows = [];
  for (const { g, best } of cand.slice(0, TOP)) {
    const keep = new Set([0, best.mi]);
    const r = g.mercados.findIndex(isMain3);
    if (r >= 0 && g.mercados[best.mi][1].length === 3 && sum(g.mercados[best.mi][2].map((o) => 1 / o)) > 1.8) keep.add(r);
    for (const mi of keep) {
      const m = g.mercados[mi];
      rows.push({ jogo_id: g.id, inicio: g.inicio, desporto: g.desporto, competicao: g.competicao, jogo: g.jogo, mercado: m[0], opcoes: m[1], odds: m[2] });
    }
  }
  const lista = (o) => Object.entries(o).map(([k, x]) => ({ nome: k, n: x.n, margem: +(x.soma / x.n).toFixed(4) })).sort((a, b) => b.n - a.n);
  const vistos = Object.values(db).filter((g) => new Date(g.inicio) > agora).length;
  return JSON.stringify({ rows, resumo: { jogos: vistos, jogos_completos: completos, mercados: nMercados, por_tipo: lista(tipos), por_desporto: lista(desportos) } });
})()
