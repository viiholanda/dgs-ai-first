# Histórico de Conversa — Elaboração da Seção "Product Rules & Guardrails" do AGENTS.md

**Projeto:** NovaTech Assistant  
**Data:** 18 de junho de 2026  
**Participantes:** Usuário (Product Specialist) · Claude (Assistente IA)

---

## Mensagem 1 — Usuário

### Contexto fornecido

O usuário enviou 5 arquivos de referência:

- `anexo-a-documentacao-simulada-novatech.md` — Documentação simulada da NovaTech (POL-001, PROC-042 v1, PROC-042-v2, SLA-2024, FAQ-Atendimento).
- `guardrails-novatech.md` — Guardrails formalizados do assistente (GRD-01 a GRD-10, GRP-01 a GRP-08, GRF-01 a GRF-06).
- `recorte-dominio-novatech-bounded-contexts__2_.md` — Bounded Contexts e Linguagem Ubíqua do domínio NovaTech.
- `anexo-c-estrutura-repositorio.md` — Estrutura do repositório `novatech-assistant` (2 cópias).

### Prompt principal

O usuário solicitou a elaboração da seção **"Product Rules & Guardrails"** do arquivo `AGENTS.md` do projeto NovaTech, assumindo o papel de Product Specialist sênior. A tarefa foi estruturada com os seguintes requisitos:

1. **Assistant Behavior Rules** — Transformar os guardrails em regras machine-readable com verbos modais MUST, MUST NOT e WHEN IN DOUBT.
2. **Domain Glossary** — Criar glossário de domínio a partir da linguagem ubíqua, com termo, definição e observações para agentes de IA.
3. **Code Generation Constraints** — Definir restrições objetivas e verificáveis para agentes de geração de código (campos obrigatórios em JSON, regras de validação, rastreabilidade, versionamento).
4. **Repository References** — Referenciar artefatos do repositório (requirements.md, ADRs, specs, documentação de domínio).

**Critérios de aceite:** machine-readable, regras prescritivas e objetivas, glossário útil para evitar ambiguidades, restrições concretas para influenciar output de agentes de desenvolvimento, seção pronta para inserção direta no AGENTS.md.

---

## Mensagem 1 — Claude

### Etapa 1: Leitura dos documentos de referência

Claude leu sequencialmente os 4 arquivos fornecidos para construir o contexto completo:

1. **`anexo-a-documentacao-simulada-novatech.md`** — Extraiu as regras de negócio dos 5 documentos da NovaTech:
   - POL-001 v3.1: Política de Devolução (prazo de 7 dias úteis, exceções para carga perigosa/refrigerada/lacre violado, procedimento de 5 etapas, custos por motivo).
   - PROC-042 v1.0: Frete Especial original (multiplicadores regionais, fatores de peso 1.0/1.2/1.5, prazo +2 dias).
   - PROC-042-v2 v2.0: Frete Especial revisado (multiplicadores atualizados, fatores 1.0/1.15/1.4, prazo +3 dias, disposições transitórias).
   - SLA-2024 v2024.1: Tabela de SLAs por tier (Gold, Silver, Standard), definição de incidente crítico, penalidades.
   - FAQ-Atendimento: Documento informal com 47 perguntas (não validado por Compliance).
   - Notas meta: contradições entre v1 e v2, gaps documentais identificados.

2. **`guardrails-novatech.md`** — Extraiu os 24 guardrails formalizados:
   - 10 DEVE (GRD-01 a GRD-10): citação de fonte, versionamento, português formal, SLA por tier, multiplicadores vigentes, tiers válidos, procedimento de devolução, incidentes críticos, custos de devolução, prioridade documental.
   - 8 NÃO DEVE (GRP-01 a GRP-08): bloqueio de carga perigosa, proibição de invenção de dados, bloqueio da v1, tiers inexistentes, informais como oficiais, fora do escopo, omissão de exceções, FAQ sem qualificação.
   - 6 QUANDO EM DÚVIDA (GRF-01 a GRF-06): fallback de threshold, encaminhamento de carga perigosa, conflito de versões, tier não identificado, cobertura apenas FAQ, prazo expirado.
   - Matriz de enforcement (determinístico vs. probabilístico), matriz de rastreabilidade com 3 incidentes e análise de risco.

3. **`recorte-dominio-novatech-bounded-contexts__2_.md`** — Extraiu:
   - 5 Bounded Contexts: Conhecimento Operacional, Consulta e Resposta, Interação com o Atendente, Qualidade e Feedback, Governança e Ciclo de Vida Documental.
   - Mapa de relações entre contextos (Customer-Supplier, Upstream-Downstream, Published Language, Conformist, Open Host Service).
   - Linguagem Ubíqua completa: termos de negócio (carga perigosa, frete especial, multiplicador regional, tier de cliente, etc.), termos de produto (documento formal, vigente, em transição, lacuna, contradição, nível de confiança, etc.) e termos de governança (SLA de triagem, ciclo de revisão, chamado, feedback estruturado, pré-indexação).

4. **`anexo-c-estrutura-repositorio.md`** — Extraiu a árvore de diretórios do repositório `novatech-assistant` com:
   - Estrutura de specs (5 módulos: pipeline-ingestao, query-endpoint, feedback-api, teams-bot, painel-web).
   - Estrutura de skills (foundation, domain, artifact).
   - Código-fonte (functions, services, pipeline, bot, web, shared).
   - Testes, infraestrutura, prompts, docs/adr, configuração MCP.
   - Estado atual do repositório (início da fase de estruturação).

### Etapa 2: Geração do artefato

Claude produziu o arquivo `product-rules-and-guardrails.md` contendo a seção completa "Product Rules & Guardrails" com as 4 subseções solicitadas:

#### Seção 1 — Assistant Behavior Rules (23 regras)

- **MUST (9 regras):** MUST-01 a MUST-09, cobrindo citação de fonte, versionamento, português formal, SLA por tier, tiers válidos, procedimento de devolução, incidentes críticos, custos de devolução e prioridade documental. Cada regra com referência ao guardrail (GRD-XX) e tipo de enforcement.
- **MUST NOT (7 regras):** MUST-NOT-01 a MUST-NOT-07, cobrindo blocklist de categorias inelegíveis, proibição de invenção de dados, bloqueio da v1, tiers inexistentes, informais como oficiais, fora do escopo e FAQ sem qualificação.
- **WHEN IN DOUBT (6 regras):** WHEN-IN-DOUBT-01 a WHEN-IN-DOUBT-06, cobrindo fallback de threshold, encaminhamento de carga perigosa, conflito de versões, tier não identificado, cobertura apenas FAQ e prazo expirado.

#### Seção 2 — Domain Glossary (23 termos)

- **Termos de Negócio (10):** Carga perigosa, Frete especial, Frete padrão, Multiplicador regional, Fator de peso, Tier de cliente, SLA de atendimento, Incidente crítico, Prazo de devolução, CT-e, Cadeia de frio.
- **Termos de Produto (11):** Documento formal, Documento vigente, Documento em transição, Documento obsoleto, Lacuna documental, Caso limítrofe, Contradição documental, Nível de confiança, Feedback estruturado, Pré-indexação.
- **Termos de Governança (3):** SLA de triagem, Ciclo de revisão, Chamado.

#### Seção 3 — Code Generation Constraints

- **Interface TypeScript `AssistantResponse`** com campos obrigatórios (answer, confidence_level, sources, source_excerpts, usage_guidance, source_document, traceability) e opcionais (low_confidence_warning, version_conflict, client_tier).
- **8 regras de validação** (VALIDATION-01 a VALIDATION-08) para o middleware de output.
- **5 regras de versionamento** (VERSION-01 a VERSION-05) para metadados de chunks no pipeline de RAG.
- **4 regras de RAG** (RAG-01 a RAG-04) para retriever e reranker.
- **4 regras de cálculo de frete** (FREIGHT-01 a FREIGHT-04) para a função determinística.

#### Seção 4 — Repository References

- Mapeamento de specs (5 módulos) aos guardrails que implementam.
- ADRs propostos (0001 a 0004) com relação aos guardrails.
- Arquivos de código-fonte (7 arquivos) com relação direta às validações e regras.
- Documentação de domínio (5 documentos) com status de vigência.
- Artefatos de avaliação de prompts (golden queries, eval results, system prompt, changelog).
- Skills relevantes (4 skills) com relação aos padrões de implementação.

### Entrega

O arquivo foi salvo em `/mnt/user-data/outputs/product-rules-and-guardrails.md` e apresentado ao usuário para download.

---

## Mensagem 2 — Usuário

> "gere o histórico dessa conversa em .md"

---

## Mensagem 2 — Claude

Claude gerou este documento de histórico da conversa em formato markdown.
