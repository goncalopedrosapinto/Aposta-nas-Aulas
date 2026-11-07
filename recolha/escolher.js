// Escolhe os jogos a abrir um a um (para ler todos os mercados): 15 no total, por desporto, alternando competições.
// Só jogos que ainda faltam pelo menos 10 minutos para começar.
((quotas, padrao) => {
  const db = JSON.parse(sessionStorage.getItem('__aulas_dados') || '{}');
  const porDesporto = {};
  Object.values(db).filter((g) => !g.completo && new Date(g.inicio) > new Date(Date.now() + 10 * 60000)).sort((a, b) => a.inicio.localeCompare(b.inicio)).forEach((g) => {
    ((porDesporto[g.sc] = porDesporto[g.sc] || {})[g.cid] = porDesporto[g.sc][g.cid] || []).push(g);
  });
  const urls = [];
  for (const [sc, comps] of Object.entries(porDesporto)) {
    const q = quotas[sc] ?? padrao, filas = Object.values(comps);
    for (let i = 0, got = 0; got < q && filas.some((f) => f.length); i = (i + 1) % filas.length) {
      const g = filas[i].shift();
      if (g) { urls.push(`/x-s${g.sc}/x-c${g.cid}/x-m${g.id}`); got++; }
    }
  }
  return JSON.stringify(urls);
})({ football: 7, tennis: 2, basketball: 2, handball: 1, ice_hockey: 1, volleyball: 1, american_football: 1 }, 0)
