# GUARDRAILS DO ASSISTENTE NOVATECH

**Documento de Governança de IA — Exercício 2.2**

---

**Versão:** 1.0 | **Data:** 18/06/2026
**Classificação:** Documento normativo — Product Governance & AI Safety
**Escopo:** Assistente corporativo baseado em RAG
**Documentos de referência:** POL-001 v3.1 | PROC-042 v1.0 e v2.0 | SLA-2024 v2024.1 | FAQ Atendimento

---

## Contexto e Objetivo

Este documento define os guardrails obrigatórios para o Assistente NovaTech, um assistente corporativo baseado em Retrieval-Augmented Generation (RAG) utilizado para responder perguntas sobre prazos de entrega, regras de frete, políticas de devolução e SLAs de clientes.

Os guardrails foram elaborados a partir de três fontes: (a) os requisitos de governança identificados na fase anterior do projeto; (b) a análise de três incidentes reais ocorridos durante testes; e (c) a documentação normativa e informal da NovaTech (POL-001, PROC-042 v1 e v2, SLA-2024, FAQ de Atendimento).

Cada guardrail é classificado como enforcement determinístico (código) ou probabilístico (prompt), com justificativa explícita para a escolha. A implementação combinada de ambas as camadas é essencial: guardrails em código garantem conformidade em regras binárias e verificáveis, enquanto guardrails em prompt tratam aspectos semânticos e contextuais que exigem interpretação.

---

## Seção 1 — DEVE (Comportamentos Obrigatórios)

Os guardrails desta seção definem comportamentos que o assistente deve exibir em toda interação. O descumprimento de qualquer item desta lista constitui falha operacional a ser tratada como incidente.

---

### GRD-01 — Citar fonte documental em toda resposta

- **Guardrail:** Citar fonte documental em toda resposta (código do documento, versão e seção).
- **Justificativa:** Garante rastreabilidade e permite ao usuário verificar a informação. Mitiga risco de respostas sem lastro documental.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O sistema deve validar, via parsing estruturado, se a resposta contém ao menos uma referência documental no formato `[DOC-XXX vN, seção Y]` antes de liberar a saída ao usuário. Não pode depender apenas de instrução de prompt, pois o modelo pode omitir a citação em edge cases.

---

### GRD-02 — Utilizar exclusivamente a versão vigente de cada documento

- **Guardrail:** Utilizar exclusivamente a versão vigente de cada documento. Para PROC-042, a versão vigente é a v2 (emissão 10/11/2023) para todos os chamados abertos a partir de 01/12/2023.
- **Justificativa:** Evita o uso de multiplicadores, fatores de peso e prazos desatualizados — exatamente o que ocorreu no Incidente 2.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O pipeline de RAG deve implementar filtro de metadados que priorize a versão mais recente com base no campo "data de emissão" e nas disposições transitórias. Documentos obsoletos devem receber flag `superseded=true` no índice. Enforcement por prompt é insuficiente porque o retriever pode retornar chunks de ambas as versões sem distinção.

---

### GRD-03 — Responder em português formal

- **Guardrail:** Responder exclusivamente em português formal (norma culta), sem gírias, abreviações informais ou anglicismos desnecessários.
- **Justificativa:** Padroniza a comunicação corporativa da NovaTech e mantém o tom adequado ao atendimento B2B de transportes e logística.
- **Tipo de enforcement:** Prompt (Probabilístico)
- **Motivo da classificação:** O tom e registro linguístico são características emergentes do modelo de linguagem, adequadamente controláveis via system prompt. Não há atributo estrutural a ser validado por código — a avaliação de formalidade é semântica.

---

### GRD-04 — Incluir tier do cliente ao informar SLAs

- **Guardrail:** Ao informar SLAs, incluir obrigatoriamente o tier do cliente (Gold, Silver ou Standard) e a métrica exata conforme SLA-2024.
- **Justificativa:** Impede que o assistente forneça SLAs genéricos ou do tier errado, o que geraria expectativa incorreta e potencial descumprimento contratual.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O sistema deve cruzar o tier do cliente (obtido via integração com CRM/contrato) com a tabela SLA-2024 antes de compor a resposta. Se o tier não puder ser identificado, a resposta deve solicitar o número do contrato. Esse cruzamento é uma regra de negócio fixa, não interpretativa.

---

### GRD-05 — Utilizar multiplicadores, fatores e prazos exclusivamente da PROC-042-v2 vigente

- **Guardrail:** Ao calcular frete especial, utilizar os multiplicadores regionais, fatores de peso e prazos adicionais exclusivamente da PROC-042-v2 vigente.
- **Justificativa:** Evita divergência de valores cobrados ao cliente. Diretamente ligado ao Incidente 2, onde multiplicadores da v1 foram aplicados indevidamente.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** Os multiplicadores e fatores devem ser armazenados em tabela estruturada (banco de dados ou configuração), não no corpo do prompt. O cálculo deve ser executado por função determinística que recebe região, peso e versão vigente como parâmetros.

---

### GRD-06 — Reconhecer exclusivamente os três tiers de clientes NovaTech

- **Guardrail:** Reconhecer e informar corretamente os três tiers de clientes NovaTech: Gold, Silver e Standard. Nenhum outro tier existe.
- **Justificativa:** Impede que o assistente confirme tiers inexistentes (ex.: Platinum) mencionados por clientes confusos, conforme FAQ Item 15.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** Uma allowlist `['Gold', 'Silver', 'Standard']` deve ser validada por código. Qualquer menção a tier fora dessa lista na resposta deve ser bloqueada ou corrigida automaticamente.

---

### GRD-07 — Informar procedimento completo de devolução conforme POL-001

- **Guardrail:** Informar o procedimento completo de devolução conforme POL-001 seção 3.3, incluindo: abertura de chamado, documentação necessária (CT-e, fotos), triagem em 4h úteis, coleta em 2 dias úteis e reembolso em 5 dias úteis.
- **Justificativa:** Garante que o cliente receba orientação completa e precisa sobre o fluxo de devolução, evitando retrabalho e chamados repetidos.
- **Tipo de enforcement:** Prompt (Probabilístico)
- **Motivo da classificação:** A completude da resposta depende do contexto da pergunta do usuário — nem sempre todos os passos são relevantes. O prompt deve instruir o modelo a incluir os passos aplicáveis, mas a seleção contextual é uma tarefa semântica adequada ao LLM.

---

### GRD-08 — Classificar incidentes críticos segundo SLA-2024

- **Guardrail:** Classificar corretamente incidentes críticos segundo os 4 critérios da SLA-2024 seção 3 (valor >R$100k sem status por 6h, carga perigosa com irregularidade, >5 chamados em 24h, risco à segurança).
- **Justificativa:** A classificação incorreta de incidentes impacta diretamente o tempo de resposta e resolução, podendo gerar penalidades contratuais.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** Os critérios de incidente crítico são regras binárias verificáveis por código (valor da carga, tipo de carga, contagem de chamados). O sistema deve aplicar essa lógica antes de definir prioridade, sem depender do julgamento do modelo.

---

### GRD-09 — Diferenciar custos de devolução conforme motivo

- **Guardrail:** Diferenciar custos de devolução conforme POL-001 seção 3.5: sem custo se erro da NovaTech; custo do cliente se desistência; não elegível se prazo expirado.
- **Justificativa:** Informar o custo errado gera impacto financeiro direto e quebra de confiança contratual.
- **Tipo de enforcement:** Prompt (Probabilístico)
- **Motivo da classificação:** A identificação do motivo da devolução (erro NovaTech vs. desistência vs. prazo expirado) depende de interpretação do contexto da conversa. O prompt deve instruir o modelo a perguntar o motivo antes de informar custos, mas a classificação é semântica.

---

### GRD-10 — Priorizar documentos normativos sobre o FAQ

- **Guardrail:** Priorizar documentos normativos (POL, PROC, SLA) sobre o FAQ de atendimento em caso de divergência.
- **Justificativa:** O FAQ é informal, não validado por Compliance, e pode conter informações desatualizadas. Diretamente ligado ao Incidente 1, onde a ambiguidade do FAQ pode ter influenciado a resposta incorreta.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O pipeline de RAG deve implementar ranking de confiabilidade por tipo de documento: POL/PROC/SLA recebem boost de relevância; FAQ recebe penalização. Essa priorização deve ser configurada no retriever, não apenas instruída por prompt.

---

## Seção 2 — NÃO DEVE (Comportamentos Proibidos)

Os guardrails desta seção definem comportamentos que o assistente nunca deve exibir. Cada item representa um risco identificado cuja materialização gera impacto financeiro, contratual ou regulatório.

---

### GRP-01 — NUNCA afirmar que cargas perigosas são elegíveis para devolução padrão

- **Guardrail:** NUNCA afirmar que cargas perigosas (classes 1-6 ANTT) são elegíveis para devolução pelo processo padrão.
- **Justificativa:** Cargas perigosas são explicitamente excluídas do processo de devolução conforme POL-001 seção 3.2. O Incidente 1 registrou exatamente essa falha: o assistente informou prazo de 7 dias para devolução de carga perigosa.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O sistema deve manter uma blocklist de categorias não elegíveis para devolução padrão (cargas perigosas classes 1-6, cargas refrigeradas com cadeia de frio rompida, cargas com lacre violado). Antes de compor qualquer resposta sobre devolução, o código deve verificar a categoria da carga e bloquear a emissão de prazo/procedimento padrão para categorias excluídas.

---

### GRP-02 — NUNCA inventar prazos, valores, multiplicadores ou SLAs

- **Guardrail:** NUNCA inventar, estimar ou interpolar prazos, valores, multiplicadores ou SLAs que não estejam explicitamente nos documentos da base de conhecimento.
- **Justificativa:** Informações fabricadas sobre prazos e valores têm impacto contratual e financeiro direto. O assistente deve funcionar como consultor documental, não como estimador.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O sistema deve validar que toda informação numérica (prazos em dias, multiplicadores, percentuais de SLA, valores) presente na resposta final possui correspondência exata com ao menos um chunk recuperado do índice. Números na resposta sem match no contexto recuperado devem acionar bloqueio.

---

### GRP-03 — NUNCA utilizar dados da PROC-042 v1 para chamados pós-01/12/2023

- **Guardrail:** NUNCA utilizar multiplicadores, fatores de peso ou prazos da PROC-042 v1 para chamados abertos a partir de 01/12/2023.
- **Justificativa:** Os valores da v1 estão desatualizados e sua aplicação gera cobrança incorreta de frete. Raiz direta do Incidente 2.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O filtro de versão no pipeline de RAG deve excluir chunks provenientes de PROC-042 v1 quando a data do chamado for posterior a 01/12/2023. Esse é um filtro temporal determinístico aplicável nos metadados do documento.

---

### GRP-04 — NUNCA confirmar existência de tiers inexistentes

- **Guardrail:** NUNCA confirmar a existência de tiers de clientes que não sejam Gold, Silver ou Standard.
- **Justificativa:** Confirmar tier inexistente (Platinum, Premium etc.) cria expectativa contratual falsa e pode configurar vício de informação. Referência: FAQ Item 15 e SLA-2024 seção 1.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** Validação por allowlist na camada de output: qualquer menção a tier de cliente na resposta é cruzada contra `['Gold', 'Silver', 'Standard']`. Termos como "Platinum", "Premium", "Diamond" acionam reescrita ou bloqueio.

---

### GRP-05 — NUNCA apresentar informações informais como políticas oficiais

- **Guardrail:** NUNCA fornecer informações sobre seguro de carga, frete de carga perigosa (PROC-043) ou carga danificada como se fossem políticas oficiais, pois não existem documentos normativos indexados sobre esses temas.
- **Justificativa:** O FAQ menciona informações sobre esses temas, mas são dados informais não validados. Apresentá-los como políticas oficiais configura desinformação.
- **Tipo de enforcement:** Prompt (Probabilístico)
- **Motivo da classificação:** A distinção entre "informação oficial documentada" e "prática informal mencionada no FAQ" requer avaliação semântica do tipo de fonte. O prompt deve instruir o modelo a qualificar informações do FAQ como "informação informal do time de atendimento — consulte o setor responsável para confirmação".

---

### GRP-06 — NUNCA responder sobre procedimentos fora do escopo da base

- **Guardrail:** NUNCA responder sobre procedimentos que estejam fora do escopo coberto pela base de conhecimento (ex.: interceptação de carga em trânsito — PROC-088, seguro de carga detalhado, frete padrão abaixo de 500kg).
- **Justificativa:** Responder sem base documental gera alucinação. A documentação indexada cobre apenas: devoluções (POL-001), frete especial (PROC-042), SLAs (SLA-2024) e FAQ.
- **Tipo de enforcement:** Prompt (Probabilístico)
- **Motivo da classificação:** A detecção de que uma pergunta está fora do escopo da base é uma tarefa de compreensão semântica. O prompt deve instruir o modelo a verificar se os chunks recuperados respondem à pergunta; caso contrário, acionar o fallback.

---

### GRP-07 — NUNCA omitir exceções de inelegibilidade para devolução

- **Guardrail:** NUNCA omitir que cargas refrigeradas com cadeia de frio rompida ou cargas com lacre violado (sem documentação) são inelegíveis para devolução padrão.
- **Justificativa:** São exceções explícitas da POL-001 seção 3.2. Omiti-las leva o cliente a iniciar um processo de devolução que será negado, gerando frustração e retrabalho.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** Mesma lógica do GRP-01: blocklist de categorias inelegíveis verificada por código antes de emitir resposta sobre devolução.

---

### GRP-08 — NUNCA apresentar FAQ sem qualificação de fonte informal

- **Guardrail:** NUNCA apresentar informações do FAQ de Atendimento sem qualificá-las como fonte informal e não validada por Compliance.
- **Justificativa:** O FAQ (Documento 5) não possui responsável formal, não é controlado por versionamento e não foi validado contra documentos normativos. Apresentá-lo como fonte oficial é enganoso.
- **Tipo de enforcement:** Prompt (Probabilístico)
- **Motivo da classificação:** A decisão de quando e como qualificar a fonte é contextual e semântica. O prompt deve instruir o modelo a sempre adicionar ressalva quando citar o FAQ.

---

## Seção 3 — QUANDO EM DÚVIDA (Comportamentos de Fallback)

Os guardrails desta seção definem como o assistente deve se comportar em situações de incerteza, ambiguidade ou ausência de informação. São a última linha de defesa contra respostas incorretas.

---

### GRF-01 — Fallback quando nenhum chunk atinge o threshold de relevância

- **Guardrail:** Se nenhum chunk recuperado possuir relevância suficiente (score abaixo do threshold definido), responder: "Não localizei essa informação na documentação vigente da NovaTech. Recomendo entrar em contato com [setor responsável] para orientação."
- **Justificativa:** Impede alucinação quando o retriever não encontra informação relevante. Porém, o threshold deve ser calibrado — se estiver alto demais, gera o problema do Incidente 3 (falso negativo).
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O threshold de relevância é um parâmetro numérico no pipeline de retrieval. Sua avaliação e a ativação do fallback devem ser feitos por código, não pelo modelo, pois o LLM não tem acesso ao score de similaridade dos chunks.

---

### GRF-02 — Encaminhar para Gestão de Riscos quando envolver carga perigosa

- **Guardrail:** Se a pergunta envolver carga perigosa em qualquer contexto (devolução, frete, prazo), encaminhar ao setor de Gestão de Riscos (ramal 4500) e NÃO fornecer orientação processual padrão.
- **Justificativa:** Cargas perigosas possuem tratamento especial que foge ao escopo dos processos padrão documentados. Cada caso requer avaliação individual pela Gestão de Riscos.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** A detecção de "carga perigosa" pode ser feita por classificação de entidades no input do usuário. Quando detectada, o sistema deve forçar o encaminhamento independente do que o modelo geraria como resposta.

---

### GRF-03 — Resolver conflitos entre versões de documentos por precedência temporal

- **Guardrail:** Se houver conflito entre duas versões do mesmo documento, utilizar a versão com data de emissão mais recente e informar ao usuário que existe versão anterior com valores distintos.
- **Justificativa:** Transparência sobre a coexistência de versões permite ao cliente contestar se necessário. Mitiga risco de uso da versão errada (Incidente 2).
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** O pipeline de RAG deve detectar quando chunks de versões diferentes do mesmo documento são recuperados e aplicar regra de precedência temporal via metadados, emitindo aviso estruturado na resposta.

---

### GRF-04 — Solicitar número do contrato se o tier não puder ser identificado

- **Guardrail:** Se o tier do cliente não puder ser identificado (não informado ou não encontrado no CRM), solicitar o número do contrato antes de informar SLAs.
- **Justificativa:** SLAs variam significativamente entre tiers (ex.: Gold tem resolução em 24h, Standard em 72h). Informar o SLA errado pode gerar penalidade contratual.
- **Tipo de enforcement:** Código (Determinístico)
- **Motivo da classificação:** A verificação de existência do tier no contexto da sessão é feita por código. Se a variável "tier" estiver nula, o sistema deve bloquear a emissão de SLAs e injetar pergunta de identificação.

---

### GRF-05 — Qualificar informações cobertas apenas pelo FAQ

- **Guardrail:** Se a pergunta envolver tema coberto apenas pelo FAQ (seguro, carga danificada, frete expresso para perigosa), qualificar como informação informal e recomendar confirmação com o setor responsável.
- **Justificativa:** Evita que o usuário tome decisões baseadas em informação não validada, ao mesmo tempo em que não ignora completamente conhecimento prático útil.
- **Tipo de enforcement:** Prompt (Probabilístico)
- **Motivo da classificação:** A identificação de que o tema só possui cobertura no FAQ é semântica — depende de avaliar quais documentos os chunks vieram. O prompt instrui o modelo a verificar a classificação da fonte e ajustar o tom da resposta.

---

### GRF-06 — Orientar via comercial quando prazo de devolução estiver expirado

- **Guardrail:** Se o cliente mencionar processo de devolução para carga com prazo expirado (>7 dias úteis), não negar sumariamente; orientar que o caso pode ser encaminhado ao Comercial para negociação individual conforme POL-001 seção 3.5.
- **Justificativa:** A POL-001 prevê a possibilidade de negociação caso a caso pelo Comercial para prazos expirados. Negar sumariamente pode levar à perda de cliente.
- **Tipo de enforcement:** Prompt (Probabilístico)
- **Motivo da classificação:** A detecção de que o prazo expirou depende de interpretação contextual (data de recebimento vs. data atual). O prompt orienta o modelo a verificar a elegibilidade e, quando expirada, sugerir a via comercial em vez de negar.

---

## Seção 4 — Matriz de Enforcement

| Guardrail | Categoria | Enforcement | Justificativa Resumida |
|-----------|-----------|-------------|------------------------|
| GRD-01 | DEVE | Código (Determinístico) | Garante rastreabilidade e permite ao usuário verificar a informação. |
| GRD-02 | DEVE | Código (Determinístico) | Evita o uso de multiplicadores, fatores de peso e prazos desatualizados. |
| GRD-03 | DEVE | Prompt (Probabilístico) | Padroniza a comunicação corporativa da NovaTech. |
| GRD-04 | DEVE | Código (Determinístico) | Impede que o assistente forneça SLAs genéricos ou do tier errado. |
| GRD-05 | DEVE | Código (Determinístico) | Evita divergência de valores cobrados ao cliente. |
| GRD-06 | DEVE | Código (Determinístico) | Impede que o assistente confirme tiers inexistentes. |
| GRD-07 | DEVE | Prompt (Probabilístico) | Garante que o cliente receba orientação completa e precisa sobre o fluxo de devolução. |
| GRD-08 | DEVE | Código (Determinístico) | A classificação incorreta de incidentes impacta diretamente o tempo de resposta e resolução. |
| GRD-09 | DEVE | Prompt (Probabilístico) | Informar o custo errado gera impacto financeiro direto. |
| GRD-10 | DEVE | Código (Determinístico) | O FAQ é informal, não validado por Compliance. |
| GRP-01 | NÃO DEVE | Código (Determinístico) | Cargas perigosas são explicitamente excluídas do processo de devolução. |
| GRP-02 | NÃO DEVE | Código (Determinístico) | Informações fabricadas sobre prazos e valores têm impacto contratual e financeiro direto. |
| GRP-03 | NÃO DEVE | Código (Determinístico) | Os valores da v1 estão desatualizados e sua aplicação gera cobrança incorreta de frete. |
| GRP-04 | NÃO DEVE | Código (Determinístico) | Confirmar tier inexistente cria expectativa contratual falsa. |
| GRP-05 | NÃO DEVE | Prompt (Probabilístico) | O FAQ menciona informações sobre esses temas, mas são dados informais não validados. |
| GRP-06 | NÃO DEVE | Prompt (Probabilístico) | Responder sem base documental gera alucinação. |
| GRP-07 | NÃO DEVE | Código (Determinístico) | São exceções explícitas da POL-001 seção 3.2. |
| GRP-08 | NÃO DEVE | Prompt (Probabilístico) | O FAQ não possui responsável formal, não é controlado por versionamento. |
| GRF-01 | QUANDO EM DÚVIDA | Código (Determinístico) | Impede alucinação quando o retriever não encontra informação relevante. |
| GRF-02 | QUANDO EM DÚVIDA | Código (Determinístico) | Cargas perigosas possuem tratamento especial fora do escopo dos processos padrão. |
| GRF-03 | QUANDO EM DÚVIDA | Código (Determinístico) | Transparência sobre a coexistência de versões permite ao cliente contestar. |
| GRF-04 | QUANDO EM DÚVIDA | Código (Determinístico) | SLAs variam significativamente entre tiers. |
| GRF-05 | QUANDO EM DÚVIDA | Prompt (Probabilístico) | Evita que o usuário tome decisões baseadas em informação não validada. |
| GRF-06 | QUANDO EM DÚVIDA | Prompt (Probabilístico) | A POL-001 prevê negociação caso a caso pelo Comercial para prazos expirados. |

---

## Seção 5 — Matriz de Rastreabilidade

| Incidente | Guardrails Relacionados | Como o Guardrail Evita o Problema |
|-----------|------------------------|-----------------------------------|
| **Incidente 1:** O assistente respondeu que o prazo de devolução para carga perigosa é 7 dias, quando na verdade cargas perigosas NÃO podem ser devolvidas. | GRP-01, GRF-02, GRD-10 | **GRP-01** bloqueia por código qualquer resposta que associe carga perigosa ao processo padrão de devolução (blocklist de categorias inelegíveis). **GRF-02** força o encaminhamento ao setor de Gestão de Riscos (ramal 4500) sempre que "carga perigosa" for detectada no contexto. **GRD-10** prioriza a POL-001 (que exclui cargas perigosas) sobre o FAQ (que sugere ambiguidade sobre "exceções"). |
| **Incidente 2:** O assistente citou PROC-042 seção 2, porém utilizou multiplicadores da versão 1 do documento, mesmo existindo uma versão 2 vigente. | GRD-02, GRD-05, GRP-03, GRF-03 | **GRD-02** e **GRP-03** implementam filtro de metadados no pipeline de RAG que exclui chunks da PROC-042 v1 para chamados pós-01/12/2023. **GRD-05** armazena os multiplicadores vigentes em tabela estruturada (não no prompt). **GRF-03** detecta conflito entre versões e aplica precedência temporal, alertando o usuário. |
| **Incidente 3:** O assistente respondeu "Não encontrei informação sobre SLA Gold", apesar de existir um documento indexado contendo a resposta. | GRF-01, GRD-04 | **GRF-01** indica que o threshold de relevância do retriever provavelmente estava alto demais, gerando falso negativo. A solução é calibrar o threshold via testes e implementar retrieval com reranking. **GRD-04** obriga o cruzamento direto com a tabela SLA-2024, garantindo que SLAs por tier sejam sempre acessíveis independente do retriever genérico. |

---

## Seção 6 — Análise Final

### 1. Guardrails que devem obrigatoriamente ser implementados em código

Os guardrails de enforcement determinístico são aqueles cujo descumprimento gera impacto financeiro, contratual ou regulatório direto e cuja verificação é possível por regras estruturadas. São eles:

- **GRD-01** (citação de fonte): validação estrutural do formato de referência na saída.
- **GRD-02 e GRD-05** (versionamento e multiplicadores vigentes): filtro de metadados no pipeline de RAG com flag de versão vigente/obsoleta e tabela estruturada de parâmetros.
- **GRD-04** (SLA por tier): integração CRM + cruzamento com tabela SLA-2024.
- **GRD-06** (tiers válidos): allowlist hardcoded validada na camada de output.
- **GRD-08** (incidentes críticos): regras binárias de classificação aplicadas por lógica de negócio.
- **GRD-10** (prioridade documental): boost de relevância configurado no retriever.
- **GRP-01 e GRP-07** (categorias inelegíveis para devolução): blocklist verificada antes de emitir resposta.
- **GRP-02** (proibição de invenção de dados): validação de que todo valor numérico na resposta tem match em chunk recuperado.
- **GRP-03** (bloqueio da v1): filtro temporal de metadados no índice.
- **GRP-04** (tiers inexistentes): allowlist na camada de output.
- **GRF-01** (threshold de retrieval): parâmetro numérico no pipeline, calibrável via avaliação quantitativa.
- **GRF-02** (encaminhamento de carga perigosa): classificação de entidades no input + redirecionamento forçado.
- **GRF-03** (conflito de versões): detecção multi-versão no retriever com regra de precedência temporal.
- **GRF-04** (tier não identificado): verificação de variável de sessão.

Esses guardrails devem ser implementados como middleware de validação, filtros no pipeline de RAG e regras de negócio na camada de aplicação — nunca delegados exclusivamente ao prompt.

### 2. Guardrails que podem ser tratados apenas por prompt

Os guardrails probabilísticos tratam aspectos semânticos, contextuais ou estilísticos que não podem ser reduzidos a regras binárias:

- **GRD-03** (português formal): controle de tom/registro via system prompt.
- **GRD-07** (procedimento completo de devolução): seleção contextual de etapas relevantes.
- **GRD-09** (custos de devolução por motivo): interpretação do motivo informado pelo cliente.
- **GRP-05** (qualificação de fontes informais): avaliação semântica do tipo de fonte.
- **GRP-06** (escopo da base): detecção de perguntas fora do escopo por compreensão semântica.
- **GRP-08** (ressalva sobre FAQ): adição contextual de qualificação de fonte.
- **GRF-05** (cobertura apenas pelo FAQ): detecção de que o tema só tem fonte informal.
- **GRF-06** (prazo expirado — via comercial): interpretação contextual de datas e encaminhamento.

Esses guardrails devem ser monitorados via avaliação periódica de respostas (sampling + revisão humana) para detectar degradação ao longo do tempo.

### 3. Guardrails com maior risco operacional

- **GRD-02 / GRD-05 / GRP-03** (versionamento de documentos): A coexistência de duas versões da PROC-042 sem marcação clara de obsolescência no SharePoint é uma falha de governança documental que amplifica o risco de erro do assistente. Enquanto essa falha não for corrigida na origem, o pipeline de RAG assume risco residual significativo.

- **GRF-01** (threshold de retrieval): Um threshold mal calibrado pode causar tanto falsos negativos (Incidente 3 — informação existe mas não é recuperada) quanto falsos positivos (informação irrelevante é utilizada). Requer calibração contínua com conjuntos de teste representativos.

- **GRP-02** (proibição de invenção de dados): A validação de que todo número na resposta tem correspondência no contexto recuperado é tecnicamente complexa e pode gerar falsos positivos (ex.: o modelo reformula um valor percentual de forma diferente do original). Requer matching com tolerância semântica.

- **GRF-02** (encaminhamento de carga perigosa): Depende de classificação correta da intenção do usuário. Perguntas ambíguas podem não acionar o detector de "carga perigosa", permitindo que o modelo responda com o processo padrão.

### 4. Guardrails com impacto direto em compliance

- **GRP-01 e GRP-07** (categorias inelegíveis para devolução): Informar incorretamente que carga perigosa pode ser devolvida pelo processo padrão pode violar a Resolução ANTT nº 5.947/2021 e expor a NovaTech a riscos regulatórios e de segurança.

- **GRD-04 e GRF-04** (SLAs por tier): SLAs são compromissos contratuais formais. Informar SLA incorreto pode configurar propaganda enganosa ou gerar direito a penalidades contratuais pelo cliente.

- **GRD-02 e GRP-03** (versionamento): Aplicar multiplicadores desatualizados impacta diretamente o faturamento e pode configurar prática comercial incorreta.

- **GRD-01** (rastreabilidade documental): A ausência de citação de fonte impede a auditoria das respostas do assistente, dificultando processos de compliance interno e resposta a reclamações formais.

- **GRP-04 e GRD-06** (tiers válidos): Confirmar a existência de tier inexistente pode criar obrigação contratual implícita por expectativa legítima do cliente.
