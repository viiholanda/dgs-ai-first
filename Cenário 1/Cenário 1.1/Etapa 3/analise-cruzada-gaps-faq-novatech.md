# Análise Cruzada — Inconsistências Processuais × Práticas Informais do FAQ

**Documentos base:** PROC-042 v1 · PROC-042 v2 · FAQ-Atendimento · SLA-2024 · POL-001
**Data da análise:** 03/06/2026
**Responsável:** —

---

## Síntese executiva

O FAQ-Atendimento não é apenas um sintoma dos gaps documentais da NovaTech — é um **amplificador de riscos**. Em todos os gaps identificados, o documento informal desempenha um papel ativo: ora institucionaliza workarounds (PROC-042 v1 vs v2), ora supre ausências normativas com critérios empíricos sem validação (seguro, sinistros, classificação de criticidade).

O padrão mais perigoso está nos **gaps críticos**: o FAQ resolve o problema operacional imediato do atendente bem o suficiente para reduzir a percepção de urgência de corrigi-lo formalmente — sem eliminar o risco financeiro e jurídico subjacente.

| Severidade | Qtd. de gaps | Natureza da interação com o FAQ |
|---|:---:|---|
| 🔴 Crítico | 2 | FAQ institucionaliza workaround ou substitui política formal |
| 🟠 Alto | 2 | FAQ preenche vazio normativo com critério empírico não validado |
| 🔵 Médio | 2 | FAQ está desatualizado ou referencia histórico sem respaldo documental |

---

## Gap 1 — FAQ valida workaround para versões conflitantes do PROC-042

**Severidade:** 🔴 Crítico
**Documentos envolvidos:** PROC-042 v1 · PROC-042 v2 · FAQ item 8

### Inconsistência processual

A v1 (mar/2023) e a v2 (nov/2023) coexistem sem revogação formal. Os fatores de peso e multiplicadores regionais divergem em até 12,5%, com impacto de até 7,8% no frete calculado para a mesma carga. A regra transitória da v2, válida para chamados abertos antes de 01/12/2023, expirou sem encerramento formal documentado.

### Prática informal no FAQ

> "Cuidado: existem duas versões da PROC-042. A mais recente tem multiplicadores mais altos. Na dúvida, use a mais recente (v2), mas se o cliente reclamar do valor, pode ser que o contrato dele ainda esteja na tabela antiga."
>
> — Item 8

### Riscos identificados

- O FAQ institucionaliza o workaround em vez de sinalizar o problema como bloqueante, reduzindo a percepção de urgência para resolver o gap.
- A lógica "se o cliente reclamar" inverte a responsabilidade: o controle de versão passa a depender da reação do cliente, não de um critério objetivo.
- Contratos antigos baseados na v1 podem receber cálculos com a v2 sem aditivo contratual, gerando risco jurídico.
- A regra transitória pode estar sendo invocada indevidamente após o prazo — o FAQ não alerta para isso.

### Ação recomendada

Revogar formalmente a v1 com errata datada. Auditar chamados processados entre 01/12/2023 e a data atual. Atualizar o FAQ para referenciar exclusivamente a v2 vigente, removendo a lógica de "reclamação do cliente" como critério de versão.

---

## Gap 2 — FAQ como única fonte normativa para seguro, sinistros e autonomia de desconto

**Severidade:** 🔴 Crítico
**Documentos envolvidos:** FAQ itens 22 · 38 · 45

### Inconsistência processual

Três temas operacionais críticos — taxas de seguro de carga (0,3% / 0,8%), processo de sinistro para cargas danificadas (prazo de 48h + canal de e-mail) e ausência de autonomia do atendente para descontos — existem apenas no FAQ, sem nenhuma política normativa validada por Compliance ou Operações.

### Práticas informais no FAQ

> Item 22: "O valor é 0,3% do valor declarado para cargas padrão e 0,8% para cargas perigosas. Isso vale para contratos a partir de 2023. Contratos mais antigos podem ter percentuais diferentes — confirme com o Comercial."
>
> Item 38: "O cliente precisa registrar a ocorrência em até 48h após o recebimento, com fotos e laudo se possível. [...] encaminhe para o e-mail sinistros@novatech.com.br."
>
> Item 45: "Atendente não tem autonomia para dar desconto. Para outros casos, encaminhe ao Comercial com justificativa."

### Riscos identificados

- Taxas de seguro informadas sem base contratual: se o FAQ estiver desatualizado, o cliente pode ter sido orientado com percentuais incorretos.
- O prazo de 48h para registro de sinistro é, de fato, um prazo decadencial — sem formalização, a NovaTech não tem defesa documental em litígios.
- O e-mail sinistros@novatech.com.br pode ter mudado ou estar sem responsável formal; o FAQ não tem mecanismo de controle para isso.
- Contratos anteriores a 2023 ficam em zona cinza: nem o FAQ define o que se aplica a eles.
- A regra de ausência de autonomia do atendente é operacionalmente correta, mas sem documento normativo não há respaldo para o atendente em contestações internas.

### Ação recomendada

Criar Política de Seguro de Carga e Procedimento de Sinistros formais, validados por Compliance e Jurídico. Definir e documentar os limites de autonomia do atendente em documento normativo. O FAQ deve referenciar esses documentos, não substituí-los.

---

## Gap 3 — FAQ classifica criticidade de chamados sem critério normativo

**Severidade:** 🟠 Alto
**Documentos envolvidos:** FAQ item 27 · SLA-2024 · POL-001 · PROC-042 v2

### Inconsistência processual

O SLA-2024 define prazos distintos para incidentes críticos e chamados gerais — com diferença expressiva (ex.: resolução Gold: 4h vs. 24h) — mas não fornece critérios para classificar chamados originados de erros de frete, devoluções ou cargas avariadas. O atendente precisa inferir a classificação caso a caso.

### Prática informal no FAQ

> "Abra um chamado de rastreamento e classifique como prioridade alta se for Gold ou se o valor da carga for acima de R$ 50.000."
>
> — Item 27

### Riscos identificados

- O critério de R$ 50.000 não tem base no SLA-2024 — é uma regra empírica do time, não validada por Operações.
- O FAQ considera o tier do cliente (Gold = prioridade alta), mas não menciona Silver ou Standard, deixando lacuna para esses casos.
- A classificação incorreta pode fazer o sistema de penalidades nunca ser acionado — descumprimento de SLA sem consequência ao fornecedor.
- Chamados de cargas avariadas de alto valor podem ser subclassificados como "rastreamento geral" em vez de incidente crítico.

### Ação recomendada

Incluir tabela de classificação de criticidade no SLA-2024 ou em anexo, incorporando os critérios já praticados pelo FAQ (tier do cliente, valor da carga) e adicionando o tipo de ocorrência (avaria, extravio, erro de frete). O critério de R$ 50.000 deve ser validado ou substituído por Operações.

---

## Gap 4 — FAQ fragmenta o fluxo de cargas perigosas sem consolidar os documentos

**Severidade:** 🟠 Alto
**Documentos envolvidos:** FAQ itens 3 · 32 · POL-001 · PROC-042 v1

### Inconsistência processual

POL-001 exclui cargas perigosas da devolução padrão e encaminha ao ramal 4500 (Gestão de Riscos). PROC-042 v1 remete ao PROC-043 (declarado em revisão pelo Compliance, sem prazo definido). O PROC-043 não consta na base documental disponível. A v2 do PROC-042 omite completamente o tema de cargas perigosas, criando um vazio no procedimento vigente.

### Práticas informais no FAQ

> Item 3: "Na prática, a gente orienta o cliente a ligar no ramal 4500... já tiveram casos em que o pessoal de Riscos autorizou exceção. Então não diga que é impossível — diga que precisa de tratamento especial."
>
> Item 32: "Sim [frete expresso para perigosas], mas precisa de autorização do Compliance e a documentação ANTT tem que estar atualizada. Na prática, demora uns 2 dias para conseguir a autorização, então o 'expresso' acaba não sendo tão expresso."

### Riscos identificados

- O item 3 instrui o atendente a não afirmar nem negar — criando expectativa ambígua no cliente e possível responsabilização por promessa implícita não cumprida.
- O frete expresso para cargas perigosas (item 32) não tem base normativa: qualquer incidente durante esse transporte pode gerar passivo regulatório frente à ANTT.
- A ausência do PROC-043 na base documental disponível impede avaliar se o fluxo real está sendo seguido — o documento pode estar desatualizado ou nunca ter sido concluído.
- A v2 do PROC-042 eliminou a referência ao PROC-043 sem substituí-la, criando um vazio normativo exatamente no procedimento vigente.

### Ação recomendada

Localizar e atualizar o PROC-043. Criar fluxo consolidado de cargas perigosas integrando devolução (POL-001), frete (PROC-042), sinistro e frete expresso. Substituir as orientações ambíguas do FAQ por referência ao fluxo oficial.

---

## Gap 5 — FAQ aplica critério de desconto por volume desatualizado (v1)

**Severidade:** 🔵 Médio
**Documentos envolvidos:** FAQ item 45 · PROC-042 v1 · PROC-042 v2

### Inconsistência processual

A v1 define desconto por volume para mais de 10 fretes/mês via aditivo contratual negociado individualmente. A v2 altera o gatilho para 8 fretes/mês com desconto automático de 5%, e 15 fretes/mês com desconto de 10%. As regras são incompatíveis e não podem ser aplicadas simultaneamente.

### Prática informal no FAQ

> "Para clientes com mais de 10 fretes especiais por mês, existe desconto automático na tabela (veja PROC-042)."
>
> — Item 45

### Riscos identificados

- O FAQ usa o gatilho da v1 (mais de 10 fretes) em vez da v2 (a partir de 8 fretes): clientes com 8 ou 9 fretes/mês podem estar deixando de receber o desconto a que têm direito pela versão vigente.
- O FAQ descreve o desconto como "automático na tabela" — correto na v2 — mas não menciona que clientes com aditivos contratuais pela v1 podem estar sob regime diferente.
- Não está definido quem aplica, valida e comunica o desconto automático da v2: o processo não tem dono.

### Ação recomendada

Atualizar o FAQ para refletir os gatilhos da v2 (8 e 15 fretes). Definir o processo de aplicação dos descontos automáticos — sistema responsável, periodicidade e comunicação ao cliente. Revisar contratos com aditivos da v1 antes da migração para as regras percentuais da v2.

---

## Gap 6 — FAQ referencia histórico de tier "Platinum" sem respaldo documental

**Severidade:** 🔵 Médio
**Documentos envolvidos:** FAQ item 15 · SLA-2024

### Inconsistência processual

O SLA-2024 define três tiers: Gold, Silver e Standard. Não existe tier Platinum. O FAQ menciona um "programa de fidelidade antigo descontinuado em 2022" — informação que não consta em nenhum documento normativo disponível na base analisada.

### Prática informal no FAQ

> "Não existe tier Platinum na NovaTech. Às vezes o cliente confunde com outra transportadora ou com o programa de fidelidade antigo que foi descontinuado em 2022. Oriente que nossos tiers são Gold, Silver e Standard e peça o número do contrato para verificar."
>
> — Item 15

### Riscos identificados

- A orientação é factualmente correta (Platinum não existe), mas a justificativa sobre o programa descontinuado não tem respaldo documental — pode ser imprecisa ou incompleta.
- Se existiram clientes no programa antigo, podem ainda ter expectativas de benefícios; o atendente não tem como verificar sem documentação de migração.
- Clientes que insistem no tier Platinum podem ter contratos antigos que o FAQ não consegue resolver adequadamente sem referência normativa.

### Ação recomendada

Confirmar com Comercial e Jurídico se existiram clientes no programa Platinum e como foram reclassificados. Documentar formalmente a descontinuação — data, critérios de migração e tier equivalente — e referenciar esse documento no FAQ.

---

## Resumo consolidado

| # | Severidade | Gap | Interação do FAQ | Risco principal | Ação prioritária |
|---|---|---|---|---|---|
| 1 | 🔴 Crítico | Duas versões do PROC-042 ativas | Institutionaliza workaround com critério de "reclamação do cliente" | Cálculos inconsistentes e risco contratual | Revogar formalmente a v1; auditar chamados |
| 2 | 🔴 Crítico | Seguro, sinistros e autonomia sem política formal | Única fonte de verdade para temas críticos | Risco jurídico e regulatório | Criar políticas normativas validadas por Compliance |
| 3 | 🟠 Alto | SLA sem critério de classificação de criticidade | Critério empírico (R$ 50k) sem base no SLA-2024 | Subclassificação sistemática e descumprimento de SLA | Tabela de criticidade por tipo de ocorrência no SLA-2024 |
| 4 | 🟠 Alto | Cargas perigosas fragmentadas entre documentos | Orientação ambígua e frete expresso sem base normativa | Risco regulatório (ANTT) e responsabilização | Localizar PROC-043 e criar fluxo consolidado |
| 5 | 🔵 Médio | Desconto por volume com critério da v1 | FAQ desatualizado em relação à v2 vigente | Clientes com 8–9 fretes sem desconto a que têm direito | Atualizar FAQ; definir processo de aplicação |
| 6 | 🔵 Médio | Tier Platinum sem respaldo documental | Justificativa histórica sem documento de referência | Inconsistência no atendimento de contratos antigos | Documentar descontinuação e critérios de migração |

---

*Análise elaborada com base nos documentos PROC-042 v1 (03/03/2023), PROC-042 v2 (10/11/2023), FAQ-Atendimento (versão não controlada), SLA-2024 e POL-001 v3.1. Nenhuma alteração foi feita nos documentos originais.*
