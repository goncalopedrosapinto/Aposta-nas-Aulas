# Aposta nas Aulas

Página para aulas de literacia sobre apostas desportivas. Mostra as 10 apostas mais seguras do dia na Betclic e compara cada uma com a realidade estimada: a odd que a casa paga, a odd justa e a probabilidade real de perder.

## Como funciona

- **Dados:** a tabela `odds_aula` no Supabase (projeto GPP Dashboard) guarda as odds recolhidas na Betclic nos dias de aula, antes das 14h. A tabela é só de leitura para o público.
- **Página:** `index.html` lê o dia mais recente da tabela e faz as contas no browser.
- **Probabilidade real:** estimada com o método de Shin a partir das próprias odds. É uma estimativa, não uma certeza.
- **Seleção:** em cada jogo, a opção mais provável; ficam de fora odds abaixo de 1,20; mostram-se as 10 mais seguras.

## Ajuda

Linha 1414 (ICAD), gratuita, anónima e confidencial. Autoexclusão em srij.turismodeportugal.pt.
