# Aposta nas Aulas

Página para aulas de literacia sobre apostas desportivas. Mostra as 10 apostas mais seguras do dia na Betclic e compara cada uma com a realidade estimada: a odd que a casa paga, a odd justa e a probabilidade real de perder.

Página: https://goncalopedrosapinto.github.io/Aposta-nas-Aulas/

## Como funciona

- **Recolha:** todos os dias, por volta das 12h30 (hora de Lisboa), uma tarefa agendada do Claude lê as odds pré-jogo das páginas públicas da Betclic, para jogos que começam às 14h ou depois, e grava-as na tabela `odds_aula` no Supabase (projeto GPP Dashboard). Precisa do Mac ligado, acordado e com a app Claude aberta a essa hora. Se a recolha falhar, a página mostra o último dia recolhido com um aviso.
- **Dados:** a tabela `odds_aula` é só de leitura para o público. Cada linha é um jogo: dia, hora de início, desporto, competição, opções e odds.
- **Página:** `index.html` lê o dia mais recente da tabela e faz as contas no browser.
- **Probabilidade real:** estimada com o método de Shin a partir das próprias odds. É uma estimativa, não uma certeza.
- **Seleção:** em cada jogo, a opção mais provável; ficam de fora odds abaixo de 1,20; mostram-se as 10 mais seguras.
- **Odd:** o que se recebe por cada 1 € apostado se acertar, já com esse euro incluído. Odd 1,24 = receber 1,24 € e ganhar 0,24 €.

## Ajuda

Linha 1414 (ICAD), gratuita, anónima e confidencial. Autoexclusão em srij.turismodeportugal.pt.
