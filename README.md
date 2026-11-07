# Aposta nas Aulas

Página para aulas de literacia sobre apostas desportivas. Mostra as 10 apostas mais seguras do dia na Betclic, em qualquer desporto e em qualquer tipo de aposta, e compara cada uma com a realidade estimada: a odd que a casa paga, a odd justa e a probabilidade real de perder.

Página: https://goncalopedrosapinto.github.io/Aposta-nas-Aulas/

## Como funciona

- **Recolha diária (cerca das 12h30, hora de Lisboa):** uma tarefa agendada do Claude abre o browser da app Claude no Mac e lê as páginas públicas da Betclic: a página de cada desporto, as competições principais do futebol e, para cerca de 15 jogos, a página do próprio jogo com todos os mercados. Só jogos de hoje a partir das 14h. Precisa do Mac ligado, acordado e com a app Claude aberta.
- **Limite de páginas:** com cerca de 100 páginas em 10 minutos a Betclic responde "403" e bloqueia o acesso durante uns 15 minutos. A recolha fica pelas 40 páginas, com pausas.
- **Código da recolha:** `recolha/` — `acumular.js` (lê o estado embutido em cada página), `menu.js` (que páginas visitar), `escolher.js` (que jogos abrir), `analisar.js` (escolhe a opção mais segura de cada jogo e calcula as margens), `sql.js` (gera a gravação). `carregar.js` junta tudo e é o que a tarefa corre no browser.
- **Dados:** tabelas `odds_aula` (os 40 jogos mais seguros: mercado principal e mercado da opção mais segura) e `odds_aula_resumo` (quantos jogos e mercados foram vistos e a margem média por tipo de aposta e por desporto) no Supabase (projeto GPP Dashboard). Só de leitura para o público.
- **Página:** `index.html` lê o dia mais recente e faz as contas no browser.

## Contas

- **Probabilidade real:** método de Shin a partir das próprias odds de cada mercado. A dupla hipótese é avaliada a partir do resultado final do mesmo jogo. É uma estimativa, não uma certeza.
- **Mercados incluídos:** os que têm 2 ou 3 opções que se excluem e cobrem todos os resultados (resultado, dupla hipótese, acima/abaixo em linhas ,5, ambas marcam, handicaps, vencedor de set…). Ficam de fora marcadores, resultado exato, linhas que podem dar aposta devolvida, "empate anula aposta" e promoções do tipo "... ou vence".
- **Seleção:** em cada jogo, a opção com odd de 1,20 ou mais com maior probabilidade real; no máximo uma por jogo; as 10 mais seguras.
- **Odd:** o que se recebe por cada 1 € apostado se acertar, já com esse euro incluído. Odd 1,24 = receber 1,24 € e ganhar 0,24 €.

## Ajuda

Linha 1414 (ICAD), gratuita, anónima e confidencial. Autoexclusão em srij.turismodeportugal.pt.
