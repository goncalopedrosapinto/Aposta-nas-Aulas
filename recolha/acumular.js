// Corre em cada página da Betclic (desporto, competição ou jogo). Lê só as entradas "grpc:" do estado embutido
// (script#ng-state) com match/matches; nunca as outras, porque algumas trazem dados da conta.
// Junta os jogos de hoje (Lisboa), a partir das 14:00 e ainda por começar, em sessionStorage['__aulas_dados'].
(() => {
  const el = document.querySelector('script#ng-state');
  if (!el) return 'sem ng-state ' + location.pathname;
  const st = JSON.parse(el.textContent);
  const lis = (d) => Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d).map((p) => [p.type, p.value]));
  const agora = new Date(), h = lis(agora), HOJE = `${h.year}-${h.month}-${h.day}`;
  const pick = (x) => (x && x.selectionOneof ? x.selectionOneof.selection : x);
  const lineNums = (n) => {
    const s = String(n), out = [];
    for (const mm of s.matchAll(/(?:acima|abaixo|mais|menos)\s+de\s+(\d+(?:[.,]\d+)?)/gi)) out.push(mm[1]);
    for (const mm of s.matchAll(/\(\s*([+-]?\d+(?:[.,]\d+)?)\s*\)/g)) out.push(mm[1]);
    for (const mm of s.matchAll(/(?:^|\s)([+-]\d+(?:[.,]\d+)?)(?=\s|$)/g)) out.push(mm[1]);
    return out;
  };
  const lineOk = (names) => names.every((n) => lineNums(n).every((x) => /[.,]5$/.test(x)));
  const db = JSON.parse(sessionStorage.getItem('__aulas_dados') || '{}');
  let n = 0, novos = 0;
  for (const [k, v] of Object.entries(st)) {
    if (!k.startsWith('grpc:')) continue;
    const p = v && v.response && v.response.payload;
    if (!p) continue;
    const list = Array.isArray(p.matches) ? p.matches : (p.match && p.match.matchId ? [p.match] : []);
    for (const m of list) {
      const d = new Date(m.matchDateUtc), t = lis(d);
      if (m.isLive || `${t.year}-${t.month}-${t.day}` !== HOJE || `${t.hour}:${t.minute}` < '14:00' || d <= agora) continue;
      const mks = [];
      if (m.market) mks.push(m.market);
      (m.subCategories || []).forEach((sc) => (sc.markets || []).forEach((x) => mks.push(x)));
      const mercados = [], vistos = new Set();
      for (const mk of mks) {
        // Fora: "empate anula aposta" (há reembolso) e promoções do tipo "... ou vence" (as opções não se excluem).
        if (/anula|devolv|reembols|ou vence/i.test(mk.name)) continue;
        const sels = [];
        (mk.mainSelections || []).forEach((x) => sels.push(pick(x)));
        (mk.selectionMatrix || []).forEach((r) => (r.selections || []).forEach((x) => sels.push(pick(x))));
        const groups = new Map();
        sels.filter(Boolean).forEach((x) => { const g = x.betslipMarketId || mk.id; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(x); });
        for (const g of groups.values()) {
          if (g.length < 2 || g.length > 3 || g.some((x) => !(x.odds > 1) || x.status !== 1)) continue;
          const S = g.reduce((a, x) => a + 1 / x.odds, 0);
          const dupla = g.length === 3 && S > 1.8 && S < 2.6;
          if (!dupla && !(S > 1 && S <= 1.4)) continue;
          const names = g.map((x) => x.name);
          if (g.length === 2 && !lineOk(names)) continue;
          const key = names.join('|') + g.map((x) => x.odds).join('|');
          if (vistos.has(key)) continue;
          vistos.add(key);
          mercados.push([mk.name, names, g.map((x) => x.odds)]);
        }
      }
      if (!mercados.length) continue;
      n++;
      const old = db[m.matchId];
      if (!old) novos++;
      if (!old || mercados.length > old.mercados.length) {
        db[m.matchId] = { id: m.matchId, inicio: m.matchDateUtc.replace(/\.0+Z$/, 'Z'), desporto: m.competition.sport.name, sc: m.competition.sport.code,
          cid: m.competition.id, competicao: m.competition.name, jogo: m.name.replace(/ - /g, ' – '), completo: !!(m.subCategories && m.subCategories.length), mercados };
      }
    }
  }
  sessionStorage.setItem('__aulas_dados', JSON.stringify(db));
  return `${location.pathname}: ${n} jogos (+${novos}) · total ${Object.keys(db).length}`;
})()
