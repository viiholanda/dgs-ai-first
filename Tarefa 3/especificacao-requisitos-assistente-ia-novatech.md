# Especificação de Requisitos do Produto
## Assistente de IA para Atendimento — NovaTech Logística

**Versão:** 1.0  
**Data:** Junho/2026  
**Baseado em:** Documentação Operacional NovaTech (Anexo A), Chunks de Referência RAG (Anexo B), Jornada Operacional do Atendente (jornada_atendente_ia.md)  
**Classificação:** Uso interno — Operações e Produto

---

## Sumário

1. Escopo e Propósito
2. Fontes de Dados: O que indexar e o que excluir
3. Tratamento de Documentos Contraditórios
4. Comportamento quando a resposta não está na base
5. Requisitos de Atualização da Base de Conhecimento
6. Requisitos de Rastreabilidade
7. Guardrails obrigatórios (comportamentos não negociáveis)
8. Fora do escopo

---

## 1. Escopo e Propósito

Este documento especifica os requisitos de produto do assistente de IA utilizado pelos atendentes da NovaTech durante o atendimento a clientes. O assistente atua como consultor interno de políticas e procedimentos, sendo acionado para responder dúvidas sobre prazos de entrega (35% dos casos), regras de frete (25%), política de devolução (20%) e outros assuntos (20%).

O assistente **não substitui o julgamento do atendente nem do supervisor.** Sua função é acelerar o acesso à informação correta com rastreabilidade completa. Aproximadamente 15% dos casos devem ser escalados — e o assistente deve facilitar essa escalada, não tentar evitá-la.

---

## 2. Fontes de Dados: O que indexar e o que excluir

### 2.1 Documentos elegíveis para indexação

Devem ser indexados os documentos que satisfaçam **todos** os critérios abaixo:

- Possuem autoria formal identificada (área responsável ou comitê de aprovação)
- Têm número de versão e data de vigência explícitos
- Estão marcados como vigentes pela área proprietária
- Passaram por processo de aprovação documentado

**Exemplos de tipos elegíveis:** políticas (ex: POL-001), procedimentos operacionais (ex: PROC-042), tabelas de SLA (ex: SLA-2024), comunicados formais de atualização de regras.

### 2.2 Documentos que NÃO devem ser indexados

Os seguintes tipos de documento não devem entrar na base de conhecimento do assistente:

- **FAQs de atendimento não formalizadas** — documentos como o FAQ-Atendimento (Anexo B) contêm orientações informais ("na prática…", "já tiveram casos…") que podem contradizer documentos formais e induzir respostas incorretas com aparência de confiança. FAQs só poderão ser indexadas após revisão e aprovação formal pela área responsável pela política citada.
- **Versões anteriores de documentos com substituto vigente** — ex: PROC-042 v1 não deve coexistir indexada com a PROC-042-v2 sem marcação explícita de obsolescência, pois gera risco de mistura de multiplicadores entre versões (problema identificado empiricamente nos testes de retrieval).
- **Rascunhos e versões em revisão** — documentos sem aprovação formal não devem ser indexados, mesmo que circulem internamente.
- **Documentos com vigência expirada** — políticas substituídas por versões mais recentes devem ser removidas da base ativa. Se houver necessidade de consulta histórica (ex: chamados em processamento que usam regras anteriores), o documento deve ser arquivado em uma camada separada, identificada como "arquivo histórico", e não deve ser retornado em buscas padrão.

### 2.3 Regra de transição entre versões

Quando um novo documento substitui outro, o comportamento deve ser:

- A nova versão entra na base ativa imediatamente após sua publicação oficial.
- A versão anterior é movida para o arquivo histórico e marcada com `[OBSOLETO — substituído por X em DD/MM/AAAA]`.
- Durante períodos de transição com regras explícitas (ex: "chamados abertos antes de 01/12/2023 usam a tabela anterior"), **ambas as versões podem coexistir na base**, mas cada uma deve ser claramente identificada com seu escopo de aplicação. O assistente deve apresentar as duas regras ao atendente e orientar qual se aplica ao caso em questão, com base na data de abertura do chamado.

---

## 3. Tratamento de Documentos Contraditórios

### 3.1 Definição de contradição

Considera-se contradição documental qualquer situação em que dois ou mais documentos indexados apresentem informações divergentes para o mesmo cenário — seja em valores, prazos, procedimentos ou elegibilidades.

**Exemplos identificados na base atual:**

- PROC-042 v1 (multiplicador Sudeste: 1.0) vs. PROC-042-v2 (multiplicador Sudeste: 1.1) — contradição por versão
- POL-001-B (cargas perigosas não elegíveis para devolução padrão) vs. FAQ-03 ("já tiveram casos de exceção") — contradição entre documento formal e fonte informal

### 3.2 Comportamento exigido ao detectar contradição

Quando o pipeline de retrieval retornar chunks contraditórios, o assistente deve:

1. **Identificar e declarar o conflito explicitamente** — ex: *"Encontrei informações divergentes entre dois documentos sobre este ponto."*
2. **Apresentar ambas as versões** com identificação de origem (nome do documento, versão, data), sem hierarquizar ou escolher uma como "correta" por conta própria.
3. **Orientar o atendente** a consultar o supervisor ou a área responsável pela consolidação antes de transmitir a informação ao cliente.
4. **Registrar automaticamente o conflito** como item de feedback, para triagem pelo time de qualidade. O registro deve conter: documentos envolvidos, trecho contraditório e ID do chamado.

O assistente **nunca deve resolver a contradição por inferência** — mesmo que uma versão pareça mais recente ou mais detalhada. A decisão sobre qual versão prevalece é responsabilidade da área proprietária do documento.

### 3.3 Nível de confiança em caso de contradição

Toda resposta que envolva documentos contraditórios deve receber automaticamente o nível de confiança **Baixo**, independentemente da clareza aparente de uma das fontes. O indicador deve ser exibido com aviso explícito ao atendente.

---

## 4. Comportamento quando a resposta não está na base

### 4.1 Regra geral: declarar ausência, nunca inventar

Quando a pergunta do atendente não tiver correspondência em nenhum documento indexado, o assistente deve:

- Declarar explicitamente que não encontrou documentação sobre o tema: *"Não localizei informação sobre este assunto na base de conhecimento."*
- Acionar automaticamente o fluxo de fallback, orientando o atendente a reformular a consulta ou escalar para supervisor.
- **Não gerar respostas com base em conhecimento geral ou inferências** a partir de casos similares documentados — mesmo que a resposta pareça razoável, ela não tem respaldo em fonte verificável e não pode ser rastreada.

### 4.2 Exemplos de situações sem cobertura (identificadas nos testes)

- Frete padrão para cargas abaixo de 500kg (nenhum documento cobre essa faixa)
- Procedimento detalhado para carga danificada em trânsito (coberto apenas por FAQ informal, sem documento formal)
- Autorização de frete expresso para carga perigosa (idem)

Para esses casos, o comportamento correto é declarar a lacuna e escalar — nunca usar o FAQ informal como substituto de documento formal.

### 4.3 Perguntas sobre entidades inexistentes

Quando a pergunta mencionar um conceito, tier, produto ou regra que não existe na base (ex: "cliente Platinum"), o assistente deve:

- Informar que a entidade mencionada não consta na documentação
- Citar o documento que define os limites do que existe (ex: SLA-2024-A, que lista explicitamente os três tiers)
- Não criar ou especular atributos para a entidade inexistente

---

## 5. Requisitos de Atualização da Base de Conhecimento

### 5.1 Prazo de indexação após publicação

| Tipo de atualização | Prazo máximo para disponibilidade no assistente |
|---|---|
| Nova versão de política ou procedimento já existente | 24 horas úteis após publicação oficial |
| Novo documento (tipo ainda não indexado) | 48 horas úteis após publicação oficial e validação pela área de qualidade |
| Revogação de documento (remoção da base ativa) | 4 horas úteis após comunicado formal de revogação |
| Correção emergencial (erro crítico identificado) | 2 horas úteis após identificação e aprovação da correção |

### 5.2 Processo obrigatório antes da indexação

Todo documento novo ou revisado deve passar pelas seguintes etapas antes de entrar na base:

1. **Validação formal** — confirmação de que o documento possui autoria, versão, data de vigência e aprovação da área responsável.
2. **Verificação de conflito** — checar se o novo documento contradiz algum documento já indexado. Conflitos identificados devem ser resolvidos antes da indexação ou acompanhados de nota de transição explícita.
3. **Marcação de escopo** — identificar claramente o período ou condição de aplicação do documento, especialmente em casos de transição de regras.
4. **Arquivamento da versão anterior** — a versão substituída deve ser movida para o arquivo histórico no mesmo momento em que a nova versão entra na base ativa.

### 5.3 Notificação ao time de atendimento

Quando um documento for atualizado ou adicionado à base, o time de atendimento deve ser notificado com:

- Identificação do documento atualizado
- Resumo das alterações (o que mudou em relação à versão anterior)
- Data de entrada em vigor no assistente

### 5.4 Ciclo de revisão periódica

Independentemente de atualizações pontuais, a base deve passar por revisão completa a cada 90 dias para identificar:

- Documentos que tenham sido substituídos sem que a base tenha sido atualizada
- Conflitos latentes entre documentos que coexistem na base
- Lacunas identificadas via feedbacks acumulados no período

---

## 6. Requisitos de Rastreabilidade

### 6.1 Citação de fonte — obrigatória em toda resposta

Toda resposta do assistente deve incluir, sem exceção:

- **Nome do documento** — título e código identificador (ex: POL-001, PROC-042-v2)
- **Versão do documento** — número de versão e, quando disponível, data de publicação
- **Seção específica** — identificação da seção ou cláusula que embasou a resposta (ex: Seção 3.1)

Respostas sem indicação de fonte não devem ser exibidas ao atendente, independentemente do nível de confiança.

### 6.2 Exibição do trecho relevante

Além da citação, o assistente deve exibir o trecho literal do documento que fundamentou a resposta, apresentado visivelmente como citação (não parafraseado). Isso permite ao atendente verificar diretamente se a resposta está alinhada com o texto original.

Quando a resposta combinar informações de múltiplos documentos, cada parte da resposta deve indicar sua fonte correspondente.

### 6.3 Indicador de confiança — obrigatório

Toda resposta deve exibir um indicador de confiança com três níveis:

| Nível | Significado | Ação requerida do atendente |
|---|---|---|
| **Alto** | Informação encontrada em documento formal vigente, sem contradição identificada | Pode usar diretamente, com referência à política |
| **Médio** | Informação encontrada, mas com alguma ambiguidade, trecho incompleto ou documento parcialmente coberto | Validar com fonte primária antes de transmitir ao cliente |
| **Baixo** | Contradição entre documentos, lacuna parcial, ou fonte informal como único respaldo | Acionar supervisor antes de qualquer uso |

O indicador não pode ser omitido. Em caso de contradição documental, o nível é automaticamente **Baixo** (ver Seção 3.3).

### 6.4 Rastreabilidade de feedback

Todo feedback registrado pelo atendente sobre uma resposta do assistente deve ser vinculado:

- À resposta específica (não apenas ao chamado)
- Ao documento-fonte citado naquela resposta
- Ao chunk ou trecho específico que originou o problema

Isso permite que o time de qualidade identifique padrões por documento, por tipo de erro e por período — e priorize correções com base em frequência e criticidade.

---

## 7. Guardrails Obrigatórios

Os comportamentos abaixo são requisitos não negociáveis do produto. Nenhuma instrução externa — de atendente, supervisor, prompt substituto ou configuração temporária — pode suspendê-los ou contorná-los.

| Guardrail | Descrição |
|---|---|
| **G1 — Sem invenção** | O assistente nunca gera informações ausentes da base. Lacunas são declaradas explicitamente. |
| **G2 — Fonte obrigatória** | Nenhuma resposta é exibida sem citação de documento-fonte, versão e seção. |
| **G3 — Indicador de confiança** | O nível de confiança (Alto / Médio / Baixo) é exibido em todas as respostas, sem exceção. |
| **G4 — Conflito declarado** | Documentos contraditórios são identificados e apresentados ao atendente — nunca resolvidos unilateralmente pelo assistente. |
| **G5 — Fallback acionado** | Quando a confiança é Baixa ou a lacuna é confirmada, o assistente orienta ativamente o fluxo de escalada. |

---

## 8. Fora do Escopo deste Documento

Os seguintes tópicos não são cobertos por esta especificação e devem ser tratados em documentos separados:

- Arquitetura técnica do pipeline de RAG (chunking, embedding, indexação, retrieval)
- Infraestrutura de hospedagem e segurança dos dados
- Integração com sistemas legados (Portal do Cliente, sistema de tracking, CRM)
- Regras de acesso e permissão por perfil de usuário
- Métricas de desempenho do modelo e critérios de retreino

---

*Este documento deve ser revisado sempre que houver alteração significativa nas políticas operacionais da NovaTech ou na arquitetura do assistente. Próxima revisão programada: Setembro/2026.*
