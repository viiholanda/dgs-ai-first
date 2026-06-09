# Entregável: Estratégia de Progressive Disclosure — NovaTech

**Atividade:** Análise documental com contexto progressivo
**Documentos base:** PROC-042 v1 · PROC-042 v2 · FAQ-Atendimento · SLA-2024 · POL-001
**Data:** 03/06/2026

---

## 1. Estratégia de Contexto: por que 3 etapas e o que cada uma faz

A abordagem de progressive disclosure parte de uma premissa simples: o modelo de linguagem tem um orçamento de atenção finito. Quanto mais contexto é entregue de uma vez, menos foco pode ser aplicado a cada parte — e o risco de **context rot** (degradação da qualidade analítica à medida que o contexto cresce) aumenta.

A estratégia foi construída em três etapas com lógica deliberada:

**Etapa 1 — Orientação de alto nível (sem documentos):** O modelo recebe apenas o cenário e a pergunta estratégica. O objetivo é obter um mapa mental da análise antes de qualquer dado concreto. Isso serve para calibrar o que o modelo já sabe sobre o tipo de problema (operações de logística, FAQ informal, risco documental) e identificar quais dimensões analíticas ele naturalmente prioriza — antes de ser influenciado pelo conteúdo específico.

**Etapa 2 — Documentos de maior risco em profundidade:** Em vez de entregar todos os 5 documentos, selecionam-se os 2 com maior potencial de inconsistência entre si (PROC-042 v1 vs. v2 e FAQ-Atendimento). A escolha é justificada: são os únicos documentos onde **a mesma realidade operacional é descrita de formas conflitantes** — e o FAQ atua como ponte informal entre os dois. Os outros documentos (SLA-2024 e POL-001) são mais estáveis e normativos; entram na etapa 3 como camada complementar.

**Etapa 3 — Cruzamento completo com os documentos normativos:** Com a análise dos conflitos centrais já feita, entra o SLA-2024 e o POL-001 para mapear os gaps de suporte normativo. A pergunta agora é mais específica: "qual é o risco jurídico/operacional de cada gap identificado na etapa 2?" Isso exige menos síntese criativa e mais confrontação pontual de dados — tarefa adequada para uma etapa final com contexto já estabelecido.

---

## 2. Os 3 Prompts, Outputs e Análise de Qualidade por Etapa

---

### ETAPA 1 — Prompt de Orientação

**Prompt enviado:**

> Você vai me ajudar a analisar a base documental de uma transportadora chamada NovaTech. Antes de ver qualquer documento, quero que você me diga: quais são os tipos de inconsistência mais comuns entre procedimentos operacionais formais e FAQs informais de atendimento em empresas de logística? Que dimensões analíticas você usaria para auditar esse tipo de base documental?

**Decisão de contexto:** Nenhum documento foi entregue. O objetivo é fazer o modelo revelar sua estrutura analítica espontânea — sem ser guiado pelo conteúdo. Isso também força a criação de um "framework de análise" antes que qualquer dado concreto contamine o raciocínio.

**Output obtido (síntese):** O modelo identificou espontaneamente as seguintes dimensões: (1) conflito entre versões de procedimento, (2) prazo e critério de escalada nos SLAs, (3) práticas informais que substituem políticas ausentes, (4) ausência de dono de processo, (5) linguagem ambígua em situações de exceção. Também mapeou como FAQs tendem a acumular "saber operacional tácito" que deveria estar nos procedimentos.

**Qualidade:** Alta para o propósito da etapa. O modelo produziu um mapa conceitual coerente, sem alucinações sobre os documentos (que ainda não havia visto). A ausência de dados reais forçou respostas genéricas — o que era exatamente o objetivo: criar um gabarito analítico antes da leitura.

**O que essa etapa comprou:** Um checklist implícito de riscos para usar como régua nas etapas 2 e 3.

---

### ETAPA 2 — Prompt de Análise Profunda (PROC-042 v1, v2 e FAQ)

**Prompt enviado:**

> Aqui estão três documentos da NovaTech: PROC-042 v1 (mar/2023), PROC-042 v2 (nov/2023) e o FAQ-Atendimento (versão não controlada). Sua tarefa é identificar todas as inconsistências entre esses documentos. Para cada inconsistência encontrada: descreva o conflito, avalie a severidade (crítico/alto/médio), e explique qual é o risco operacional ou jurídico resultante. Não se preocupe com SLA ou política corporativa agora — isso virá depois.
>
> [PROC-042 v1 completo]
> [PROC-042 v2 completo]
> [FAQ-Atendimento completo]

**Decisão de contexto:** Apenas os 3 documentos com maior potencial de conflito interno. O SLA e a POL-001 foram deliberadamente omitidos. Por quê? Porque SLA e POL-001 são documentos normativos que estabelecem o contexto de penalidade e política, mas não geram conflito direto entre si — eles são ancoras, não fontes de ambiguidade. Introduzi-los aqui diluiria a análise das inconsistências de versionamento, que são o núcleo do problema.

**Output obtido (síntese):** O modelo identificou: (a) os dois cálculos divergentes de frete (fatores de peso e multiplicadores regionais com diferença de até 12,5%), (b) a regra transitória expirada sem encerramento formal, (c) o FAQ validando o workaround de "use a versão mais recente mas se o cliente reclamar, use a antiga", (d) o critério de desconto por volume desatualizado (10 fretes/mês no FAQ vs. 8 fretes/mês na v2), e (e) três temas operacionais críticos (seguro, sinistros, autonomia de desconto) existindo apenas no FAQ sem respaldo normativo.

**Qualidade:** Muito alta. Com o contexto concentrado nos documentos mais densos em conflito, a análise foi granular e apontou inconsistências específicas com citações textuais. Sem o SLA e o POL-001 no contexto, o modelo não tentou "resolver" os gaps com as políticas — manteve o foco no mapeamento das inconsistências.

**O que essa etapa comprou:** Um inventário de gaps concreto, com severidade preliminar, pronto para ser cruzado com os documentos normativos na etapa seguinte.

---

### ETAPA 3 — Prompt de Cruzamento Normativo (SLA-2024 e POL-001)

**Prompt enviado:**

> Agora, com base nos gaps identificados anteriormente, aqui estão os dois documentos normativos da NovaTech: SLA-2024 e POL-001 v3.1. Para cada gap já mapeado, identifique: (1) qual é o respaldo ou ausência de respaldo nesses documentos normativos, (2) qual é o risco jurídico ou regulatório específico, e (3) qual ação é prioritária para o discovery humano.
>
> [SLA-2024 completo]
> [POL-001 v3.1 completo]

**Decisão de contexto:** Os documentos normativos entram aqui como camada de confrontação, não de descoberta. O modelo já tem o mapa de gaps — agora o trabalho é ancorá-los (ou não) nas políticas formais. Essa ordem evita que o SLA e o POL-001 "silencie" os gaps ao fornecer uma âncora normativa aparente antes do mapeamento de inconsistências.

**Output obtido (síntese):** O modelo identificou que: (a) o SLA-2024 não fornece critérios de classificação de criticidade para chamados originados de erros de frete, deixando o FAQ como única fonte do critério empírico de R$ 50.000; (b) o POL-001 exclui cargas perigosas da devolução padrão mas remete ao PROC-043 — que não consta na base disponível; (c) nenhum dos dois documentos normativos faz menção a taxas de seguro ou prazo de sinistro, confirmando o FAQ como única fonte para temas de risco jurídico alto. A análise cruzada resultou no documento `analise-cruzada-gaps-faq-novatech.md` com 6 gaps categorizados.

**Qualidade:** Alta, com precisão maior do que seria possível se os 5 documentos tivessem sido entregues juntos. O modelo conseguiu citar os gaps específicos da etapa 2 e confrontá-los pontualmente com os artigos do SLA e da POL-001, sem misturar as análises.

**O que essa etapa comprou:** O mapa de riscos completo e as ações prioritárias — resultado que não teria a mesma granularidade sem as etapas anteriores.

---

## 3. Mapa de Riscos: 2 Riscos Identificados e Proposta de Discovery Humano

---

### Risco 1 — FAQ como única fonte normativa para seguro de carga e sinistros (Severidade: 🔴 Crítico)

**Descrição do risco:**
O FAQ-Atendimento (itens 22, 38 e 45) é o único documento que define taxas de seguro de carga (0,3% / 0,8%), o prazo de 48h para registro de sinistros e a ausência de autonomia de desconto do atendente. Nenhuma dessas informações consta no SLA-2024, no POL-001 ou em qualquer procedimento formal validado por Compliance ou Jurídico.

O risco não é apenas de inconsistência — é estrutural: o prazo de 48h para sinistros funciona como prazo decadencial em litígios. Se o FAQ estiver desatualizado ou for alterado sem controle de versão, a NovaTech perde o respaldo documental em disputas judiciais por cargas avariadas.

**Como levar ao discovery humano:**

Apresentar como bloqueante para a equipe jurídica e de Compliance antes de qualquer outra ação. O discovery deve incluir:

1. Reunião com Jurídico para confirmar se o prazo de 48h tem base contratual ou é apenas prática operacional documentada no FAQ.
2. Levantamento de sinistros abertos nos últimos 12 meses: o prazo foi respeitado? Houve contestação de clientes sobre o prazo?
3. Auditoria da caixa sinistros@novatech.com.br: o e-mail existe, tem responsável formal, e há SLA de resposta?
4. Confirmação com Comercial: as taxas de seguro (0,3% e 0,8%) estão nos contratos assinados ou apenas no FAQ?

O resultado do discovery deve ser a criação de uma Política de Seguro de Carga e um Procedimento de Sinistros formais, validados e versionados — com o FAQ passando a referenciar esses documentos, não substituí-los.

---

### Risco 2 — Coexistência não resolvida das duas versões do PROC-042 (Severidade: 🔴 Crítico)

**Descrição do risco:**
A v1 (mar/2023) e a v2 (nov/2023) do PROC-042 coexistem sem revogação formal da v1. Os fatores de peso e multiplicadores regionais divergem em até 12,5%, com impacto de até 7,8% no valor do frete calculado para a mesma carga. A regra transitória da v2, válida para chamados abertos antes de 01/12/2023, expirou sem encerramento formal — e pode estar sendo invocada indevidamente.

O FAQ institucionalizou o workaround: "use a v2, mas se o cliente reclamar, verifique se o contrato é da tabela antiga." Essa lógica inverte o controle de versão: o critério de qual versão aplicar passa a depender da reação do cliente, não de um critério objetivo documentado.

**Como levar ao discovery humano:**

Apresentar como risco de passivo contratual para Comercial, Financeiro e Jurídico. O discovery deve incluir:

1. Auditoria de chamados entre 01/12/2023 e a data atual: quantos fretes foram calculados com a v2 para contratos baseados na v1? Houve aditivo contratual?
2. Levantamento de contratos ativos: quantos estão formalmente na v1, quantos na v2, e quantos estão em zona cinzenta?
3. Reunião com Operações para validar: a regra transitória está sendo usada após o prazo? Há ciência disso?
4. Revisão do processo de revogação formal de documentos: como a NovaTech garante que versões antigas sejam efetivamente descontinuadas e não apenas substituídas?

O resultado do discovery deve ser a revogação formal da v1 com errata datada, a auditoria dos chamados em conflito e a definição de um processo de gestão de versões de procedimentos — impedindo que essa situação se repita.

---

## 4. Reflexão: Tudo de Uma Vez vs. Progressive Disclosure

### O que teria acontecido com os 5 documentos no primeiro prompt

Se os cinco documentos tivessem sido entregues juntos no primeiro prompt, o resultado teria sido tecnicamente possível — mas analiticamente inferior em pelo menos três dimensões:

**Orçamento de atenção fragmentado.** Com 5 documentos no contexto inicial, o modelo tende a distribuir atenção de forma mais uniforme e superficial. Gaps sutis — como a regra transitória expirada do PROC-042 v2 ou o critério de R$ 50.000 sem base no SLA — têm alta probabilidade de não serem sinalizados como críticos porque o modelo não foi solicitado a se aprofundar neles especificamente. A análise tende a ser mais larga e menos profunda.

**Context rot.** À medida que o contexto cresce e as instruções ficam mais distantes no início da janela, o modelo perde precisão nas referências cruzadas. Com 5 documentos e uma instrução genérica de "identifique inconsistências", o output provavelmente teria identificado os gaps óbvios (duas versões do PROC-042) mas teria agrupado os temas de severidade diferente sem a distinção de criticidade que a abordagem progressiva produziu.

**Ausência de framework analítico prévio.** Sem a Etapa 1 (orientação sem documentos), o modelo não teria sido forçado a construir um checklist analítico independente do conteúdo. Com os 5 documentos na primeira mensagem, o modelo teria construído o raciocínio a partir dos próprios documentos — perdendo a capacidade de identificar o que está ausente (como a falta de política formal para seguro e sinistros, que só é visível quando você sabe o que deveria existir, não apenas o que existe).

**Comparação direta:**

| Dimensão | Tudo de uma vez | Progressive disclosure |
|---|---|---|
| Cobertura de gaps | Ampla, superficial | Seletiva, profunda |
| Identificação do que está ausente | Baixa | Alta |
| Precisão nas referências cruzadas | Moderada | Alta |
| Risco de context rot | Alto | Baixo |
| Qualidade do framework analítico | Emergente dos documentos | Construído antes dos documentos |
| Gaps críticos sinalizados | Provavelmente 2–3 | 6 documentados com severidade |

### O que a abordagem progressiva comprou

A principal vantagem não foi encontrar mais gaps — foi encontrar os gaps certos com a profundidade certa. A distinção entre Crítico, Alto e Médio no entregável final não é trivial: ela determina a ordem de prioridade do plano de ação e orienta quais issues devem ir para Jurídico/Compliance antes de qualquer outra iniciativa.

A Etapa 1 em particular — sem documentos — foi o movimento mais contraintuitivo e mais valioso. Ao forçar o modelo a revelar seu framework analítico antes de ver os dados, criamos uma régua independente para avaliar os outputs das etapas seguintes. Isso é o equivalente a fazer a hipótese antes do experimento — não depois.

---

*Entregável elaborado com base na análise cruzada dos documentos PROC-042 v1, PROC-042 v2, FAQ-Atendimento, SLA-2024 e POL-001 v3.1 da NovaTech.*
