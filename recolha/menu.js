// Lista de páginas a visitar (cerca de 25): a página de cada desporto (próximos jogos) e as competições principais do futebol.
// Poucas páginas de propósito: com ~100 páginas em 10 minutos a Betclic responde 403 e bloqueia o acesso durante um tempo.
(() => {
  const st = JSON.parse(document.querySelector('script#ng-state').textContent);
  const k = Object.keys(st).find((k) => k.startsWith('grpc:') && st[k] && st[k].response && st[k].response.payload && st[k].response.payload.sports);
  const sports = st[k].response.payload.sports;
  const comps = (s) => [...(s.competitions || []), ...(s.countries || []).flatMap((c) => c.competitions || []), ...(s.categories || []).flatMap((c) => (c.competitions || []).map((x) => ({ ...x, cat: c.name })))];
  const FUT = ['3', '5', '32', '7', '6', '939', '8', '3453', '28946'];
  const urls = [];
  for (const s of sports) {
    if (/formula_1|golf/.test(s.sportCode)) continue;
    if (s.sportCode !== 'football') { urls.push(`/x-s${s.sportCode}`); continue; }
    for (const c of comps(s)) if (FUT.includes(String(c.competitionId))) urls.push(`/x-s${s.sportCode}/x-c${c.competitionId}`);
  }
  return JSON.stringify([...new Set(urls)]);
})()
