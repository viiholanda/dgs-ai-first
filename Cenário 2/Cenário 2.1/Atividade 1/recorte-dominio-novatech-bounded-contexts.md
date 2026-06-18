# Recorte de Domínio — Bounded Contexts do Assistente NovaTech

**Versão:** 1.0  
**Data:** Junho/2026  
**Baseado em:** Spec v2.0, Jornada Operacional do Atendente, Anexo A (Documentação Simulada), Dados do Discovery  
**Escopo:** Tarefa 1 — Identificação de Bounded Contexts

---

## Premissas do Recorte

Antes de apresentar os contextos, registro as premissas que orientaram a decomposição:

O assistente NovaTech não é um sistema monolítico com uma única responsabilidade. Ele cruza pelo menos quatro preocupações distintas que mudam por razões diferentes, em cadências diferentes, sob responsabilidade de áreas diferentes. Essas são as costuras naturais do domínio — e são elas que definem as fronteiras dos bounded contexts abaixo.

O critério de separação usado foi: **dois conceitos pertencem a contextos diferentes quando uma mudança em um não deveria forçar uma mudança no outro**, e quando os termos do domínio assumem significados ou granularidades distintas em cada lado da fronteira.

---

## 1. Bounded Context: Conhecimento Operacional (*Operational Knowledge*)

### Objetivo

Ser a fonte de verdade sobre as políticas, procedimentos e regras de negócio da NovaTech. Este contexto responde à pergunta: *"O que a documentação oficial diz sobre este assunto?"*

### O que está dentro

- O corpus de documentos formais elegíveis para indexação (POL, PROC, SLA, comunicados formais).
- Os critérios de elegibilidade de documentos para a base (autoria formal, versão, vigência, aprovação — Seção 2.1 da Spec v2).
- A distinção entre documento formal e documento informal (FAQ não formalizado).
- As regras de transição entre versões de documentos (coexistência temporal com escopo explícito).
- O arquivo histórico e sua separação da base ativa.
- Os metadados de cada documento: código, versão, data de vigência, área proprietária, status (vigente / obsoleto / em transição).
- As contradições documentais como entidade de primeira classe — não como bug, mas como estado legítimo da base que precisa ser declarado.
- As lacunas confirmadas — temas sem cobertura documental.

### O que está fora

- A lógica de como documentos são recuperados (chunking, embedding, retrieval) — isso pertence ao pipeline técnico.
- A decisão sobre qual informação transmitir ao cliente — isso pertence ao atendente e ao contexto de Atendimento.
- O mecanismo de feedback e triagem de erros — isso pertence ao contexto de Qualidade e Feedback.
- As regras de formatação da resposta (estrutura obrigatória, ordem dos campos) — isso pertence ao contexto de Interação.

### Relação com outros contextos

- **Fornece dados para** o contexto de *Consulta e Resposta* (é a fonte que o pipeline consulta).
- **Recebe atualizações de** *Governança e Ciclo de Vida Documental* (novos documentos, revogações, correções).
- **Recebe sinalizações de** *Qualidade e Feedback* (contradições e lacunas identificadas em produção geram ações corretivas aqui).

### Justificativa da separação

O corpo de conhecimento muda por razões de negócio (nova política, revisão de SLA, atualização de multiplicadores) em cadência própria, sob responsabilidade das áreas proprietárias dos documentos. Nenhuma mudança na interface do atendente, no modelo de LLM ou na lógica de retrieval deveria alterar o que está ou não documentado. A separação protege a integridade da base contra acoplamento com decisões técnicas.

---

## 2. Bounded Context: Consulta e Resposta (*Query & Answer*)

### Objetivo

Processar a pergunta do atendente, recuperar a informação relevante da base de conhecimento e compor uma resposta estruturada que respeite todos os guardrails do produto. Este contexto responde à pergunta: *"Dado o que foi perguntado e o que a base contém, qual é a resposta correta — ou a declaração correta de que não há resposta?"*

### O que está dentro

- A recepção e interpretação da consulta do atendente.
- A lógica de recuperação de informação (retrieval): quais chunks são relevantes para a pergunta.
- A composição da resposta com todos os campos obrigatórios (resposta, nível de confiança, fontes, trechos literais, orientação de uso).
- A classificação do nível de confiança com base nos critérios objetivos (Seção 6.3 da Spec v2): Alto, Médio, Baixo.
- A detecção de contradição entre chunks recuperados e o comportamento de apresentação sem hierarquização.
- A detecção de lacuna (pergunta sem correspondência na base) e o comportamento de declaração explícita.
- A distinção entre lacuna real e caso limítrofe (Seção 4.2 da Spec v2).
- A solicitação de contexto faltante ao atendente (G6 — data do chamado, peso da carga, região).
- A detecção de entidades inexistentes (ex: tier Platinum).
- O registro interno dos chunks utilizados para cada resposta (requisito de rastreabilidade, Seção 7.2).
- Todos os guardrails (G1 a G6) como invariantes deste contexto — regras que não podem ser violadas por nenhuma instrução externa.

### O que está fora

- O conteúdo dos documentos em si — este contexto consome o que o contexto de *Conhecimento Operacional* disponibiliza, mas não define o que é elegível.
- A decisão final do atendente sobre usar ou escalar — isso pertence ao contexto de *Atendimento*.
- A triagem e resolução de contradições ou lacunas — este contexto as detecta e declara, mas a resolução é responsabilidade de *Qualidade e Feedback* e das áreas proprietárias.
- A infraestrutura de embedding, indexação e modelo de LLM — pertencem à camada técnica, fora do domínio de produto.

### Relação com outros contextos

- **Consome dados de** *Conhecimento Operacional* (os chunks indexados e seus metadados).
- **Entrega respostas para** *Interação com o Atendente* (a resposta estruturada que será exibida).
- **Gera insumos para** *Qualidade e Feedback* (registro de chunks usados, conflitos detectados automaticamente).
- **Aplica regras de** *Governança e Ciclo de Vida* indiretamente (só consulta documentos vigentes na base ativa; respeita marcações de transição).

### Justificativa da separação

A lógica de "como responder" é fundamentalmente diferente da lógica de "o que está documentado". O contexto de Consulta e Resposta pode evoluir (melhorar retrieval, ajustar critérios de confiança, refinar detecção de contradições) sem que nenhum documento mude. Inversamente, uma nova política pode entrar na base sem que a lógica de resposta precise ser alterada. Os guardrails vivem aqui porque são invariantes do comportamento de resposta, não propriedades dos documentos.

---

## 3. Bounded Context: Interação com o Atendente (*Agent Interaction*)

### Objetivo

Gerenciar a experiência do atendente na interface do assistente: como a consulta é submetida, como a resposta é apresentada, como o fluxo de fallback e escalada é conduzido, e como o feedback é registrado. Este contexto responde à pergunta: *"Como o atendente interage com o assistente durante o atendimento?"*

### O que está dentro

- A estrutura obrigatória de toda resposta exibida (os 5 campos na ordem definida: resposta, confiança, fontes, trechos, orientação de uso).
- A jornada operacional do atendente (Etapas 1.1 a 1.5 do fluxo principal).
- O fluxo de fallback (Seção 2 da jornada): reformulação da consulta, escalada para supervisor.
- A interface de registro de feedback (campos obrigatórios: tipo do problema, pergunta original, resposta recebida, resposta esperada, ID do chamado, documento de referência).
- O comportamento quando o atendente omite contexto relevante (Seção 7.3 da Spec v2): o assistente solicita a informação faltante antes de responder.
- As orientações de uso por nível de confiança (usar diretamente / validar / escalar).
- O conceito de "chamado" como unidade de rastreabilidade — cada interação está vinculada a um chamado.

### O que está fora

- A lógica de composição da resposta (pertence a *Consulta e Resposta*).
- O conteúdo dos documentos (pertence a *Conhecimento Operacional*).
- A triagem e priorização dos feedbacks registrados (pertence a *Qualidade e Feedback*).
- A retenção de logs e auditoria (pertence a *Governança*).

### Relação com outros contextos

- **Recebe respostas de** *Consulta e Resposta* e as apresenta ao atendente.
- **Envia consultas para** *Consulta e Resposta* com base na interação do atendente.
- **Gera feedbacks para** *Qualidade e Feedback* (o registro feito pelo atendente).
- **Segue a jornada definida em** *Governança e Ciclo de Vida* (fluxos e papéis).

### Justificativa da separação

A forma como o atendente interage com o assistente pode mudar (novo layout, novos campos na interface, nova sequência de passos) sem que a lógica de recuperação e resposta mude. Um redesign da interface não deveria exigir alteração nos critérios de confiança. Além disso, este contexto é o que mais depende de pesquisa com usuários reais — ele tem cadência de evolução própria, orientada por usabilidade, não por regras de negócio.

---

## 4. Bounded Context: Qualidade e Feedback (*Quality & Feedback Loop*)

### Objetivo

Capturar, triar e resolver problemas identificados nas respostas do assistente, alimentando um ciclo de melhoria contínua da base de conhecimento e do comportamento do sistema. Este contexto responde à pergunta: *"Quando algo está errado, como o erro é detectado, classificado e corrigido?"*

### O que está dentro

- Os tipos de problema reportáveis (incorreta, desatualizada, incompleta, contraditória — Seção 3 da Jornada).
- O registro estruturado de feedback com todos os campos obrigatórios.
- A triagem periódica de feedbacks pela Área de Qualidade.
- A priorização por frequência e criticidade.
- As ações corretivas (correção de conteúdo, expansão da base, depreciação, sinalização de conflito — Seção 5.5 da Spec v2).
- O SLA de triagem de conflitos (2 dias úteis, com escalada automática ao Gerente de Qualidade — Seção 3.3 da Spec v2).
- O vínculo de rastreabilidade: cada feedback ligado à resposta específica, ao documento-fonte e ao chunk que originou o problema (Seção 6.4).
- Os conflitos registrados automaticamente pelo assistente como itens de feedback prioritário.

### O que está fora

- A detecção automática de contradição no momento da resposta (pertence a *Consulta e Resposta* — este contexto recebe o registro, não faz a detecção).
- A execução técnica da reindexação ou retreino (pertence à camada técnica / *Governança*).
- O conteúdo corrigido em si (pertence a *Conhecimento Operacional* — este contexto aciona a correção, não a executa).
- A interação do atendente com a interface de feedback (pertence a *Interação com o Atendente* — este contexto recebe o dado já registrado).

### Relação com outros contextos

- **Recebe feedbacks de** *Interação com o Atendente* (registros do atendente).
- **Recebe conflitos detectados por** *Consulta e Resposta* (registro automático).
- **Aciona correções em** *Conhecimento Operacional* (atualizar, expandir, depreciar documentos).
- **Aciona reindexação via** *Governança e Ciclo de Vida Documental*.

### Justificativa da separação

O ciclo de feedback é um processo organizacional com papéis, prazos e escaladas próprias. Ele não depende da tecnologia do assistente — mesmo sem IA, a NovaTech precisaria de um processo de qualidade documental. Separar este contexto permite que ele evolua com governança corporativa (novos SLAs de triagem, novas categorias de problema) sem acoplar à lógica de retrieval ou à interface.

---

## 5. Bounded Context: Governança e Ciclo de Vida Documental (*Document Governance & Lifecycle*)

### Objetivo

Garantir que a base de conhecimento esteja íntegra, atualizada e em conformidade com as regras de gestão documental da NovaTech. Este contexto responde à pergunta: *"Quem decide o que entra, o que sai e quando a base é revisada?"*

### O que está dentro

- O processo obrigatório de pré-indexação (validação formal, verificação de conflito, marcação de escopo, arquivamento da versão anterior — Seção 5.2 da Spec v2).
- A definição de publicação oficial (Seção 5.3: registro como "vigente" no sistema de gestão documental com aprovação formal).
- Os prazos de indexação por tipo de atualização (24h, 48h, 4h, 2h conforme a natureza da mudança).
- O ciclo de revisão periódica da base a cada 90 dias.
- A notificação ao time de atendimento após atualizações (Seção 5.4).
- Os papéis e responsabilidades (Seção 10 da Spec v2): quem valida, quem indexa, quem triagem, quem resolve conflitos.
- A retenção de logs e auditoria (Seção 9): prazo de 5 anos, casos de uso dos logs, controles de acesso.
- As regras de acesso ao arquivo histórico (supervisores e Qualidade, não atendentes).

### O que está fora

- O conteúdo das políticas em si (pertence a *Conhecimento Operacional*).
- A lógica de como o assistente responde (pertence a *Consulta e Resposta*).
- A triagem de feedbacks (pertence a *Qualidade e Feedback* — este contexto define os papéis, mas a execução é do outro).
- A experiência do atendente (pertence a *Interação*).

### Relação com outros contextos

- **Governa** *Conhecimento Operacional* (define o que pode entrar e sair da base).
- **Recebe demandas de** *Qualidade e Feedback* (ações corretivas que exigem reindexação).
- **Define papéis para** todos os outros contextos (quem é responsável por cada processo).
- **Fornece regras para** *Consulta e Resposta* indiretamente (documentos com marcação de transição afetam o comportamento de resposta).

### Justificativa da separação

A governança documental é o contexto mais organizacional e menos técnico de todos. Ele envolve compliance, jurídico, gestão de riscos e processos de aprovação formal. Mudanças aqui (ex: prazo de retenção alterado por regulação, novo papel criado pela reestruturação) não deveriam impactar a lógica de recuperação ou a interface. Além disso, este é o contexto que um agente de IA tem menor autonomia — as decisões são humanas por natureza.

---

## Mapa de Relações entre Bounded Contexts

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   ┌─────────────────────┐        ┌──────────────────────────┐       │
│   │   GOVERNANÇA E      │        │   CONHECIMENTO           │       │
│   │   CICLO DE VIDA     │───────►│   OPERACIONAL            │       │
│   │   DOCUMENTAL        │ governa│   (base de documentos    │       │
│   │                     │        │    formais vigentes)     │       │
│   └────────┬────────────┘        └────────────┬─────────────┘       │
│            │ define papéis                     │                     │
│            │ e prazos para todos               │ fornece chunks      │
│            │                                   │ e metadados         │
│            │                                   ▼                     │
│   ┌────────┴────────────┐        ┌──────────────────────────┐       │
│   │   QUALIDADE E       │◄───────│   CONSULTA E             │       │
│   │   FEEDBACK          │conflitos│   RESPOSTA              │       │
│   │                     │ e logs │   (retrieval, guardrails, │       │
│   │                     │        │    composição da resposta)│       │
│   └────────┬────────────┘        └────────────┬─────────────┘       │
│            │                                   │                     │
│            │ aciona                             │ entrega             │
│            │ correções                          │ resposta            │
│            │                                   │ estruturada         │
│            ▼                                   ▼                     │
│   ┌─────────────────────┐        ┌──────────────────────────┐       │
│   │  (retorna a          │       │   INTERAÇÃO COM O        │       │
│   │   Conhecimento       │       │   ATENDENTE              │       │
│   │   Operacional)       │       │   (jornada, interface,   │       │
│   └─────────────────────┘        │    fallback, feedback)   │       │
│                                  └──────────────────────────┘       │
│                                           │                         │
│                                           │ registra feedback       │
│                                           ▼                         │
│                                  ┌──────────────────────────┐       │
│                                  │  (retorna a Qualidade    │       │
│                                  │   e Feedback)            │       │
│                                  └──────────────────────────┘       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Padrões de Relação (classificação DDD)

| Relação | Tipo | Direção |
|---------|------|---------|
| Governança → Conhecimento Operacional | **Customer-Supplier** | Governança define as regras; Conhecimento Operacional as cumpre |
| Conhecimento Operacional → Consulta e Resposta | **Upstream-Downstream** | Conhecimento Operacional publica; Consulta e Resposta consome |
| Consulta e Resposta → Interação com o Atendente | **Published Language** | A resposta tem estrutura obrigatória de 5 campos (contrato) |
| Interação com o Atendente → Qualidade e Feedback | **Conformist** | Interação envia feedback no formato que Qualidade define |
| Qualidade e Feedback → Conhecimento Operacional | **Customer-Supplier** | Qualidade demanda correções; as áreas proprietárias executam |
| Consulta e Resposta → Qualidade e Feedback | **Open Host Service** | Conflitos e logs são registrados automaticamente em formato padronizado |

---

## Observações Complementares

### Sobre os 15% de casos com cruzamento de categorias

O discovery identificou que 15% dos casos cruzam duas categorias (ex: prazo de entrega + regra de frete). Isso não cria um bounded context adicional — o cruzamento é resolvido dentro de *Consulta e Resposta*, que pode recuperar chunks de múltiplos documentos e compor respostas multi-fonte. O que esse dado reforça é a importância dos guardrails G2 (fonte obrigatória para cada parte da resposta) e G4 (conflito declarado quando fontes divergem).

### Sobre a camada técnica (fora do recorte de domínio)

Pipeline de RAG (chunking, embedding, modelo de LLM, Azure AI Search), infraestrutura, integrações com sistemas legados e métricas de desempenho do modelo estão explicitamente fora do escopo deste recorte de domínio. Eles são preocupações técnicas que implementam os contextos acima, mas não são bounded contexts de domínio. A Spec v2 (Seção 11) os lista como "fora do escopo" pelos mesmos motivos.

### Sobre o FAQ informal

O FAQ-Atendimento não pertence ao contexto de *Conhecimento Operacional* enquanto não for formalizado. Ele é, no máximo, um artefato de referência para o contexto de *Qualidade e Feedback* — um indicador de lacunas e de conhecimento tácito que precisa ser formalizado ou descartado. Essa distinção é crítica para agentes de IA: se o FAQ entrar no índice de busca sem marcação adequada, o guardrail G1 (sem invenção) será violado por design, porque o agente estará tratando informação informal como se fosse fonte formal.

---

*Este recorte deve ser revisado quando houver mudança significativa na estrutura organizacional da NovaTech, na arquitetura do assistente ou nos artefatos de domínio que o sustentam.*
