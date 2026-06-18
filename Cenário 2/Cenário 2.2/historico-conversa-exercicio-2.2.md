# Histórico de Conversa — Exercício 2.2 NovaTech

**Data:** 18/06/2026
**Projeto:** Guardrails do Assistente NovaTech
**Participantes:** Usuário (Product Specialist) + Claude (Assistente IA)

---

## Mensagem 1 — Usuário

**Arquivo anexado:** `anexo-a-documentacao-simulada-novatech.md`

> Você é um Product Specialist sênior especialista em IA Generativa, RAG, Product Governance e AI Safety.
> Preciso que execute integralmente o Exercício 2.2 do projeto NovaTech.
>
> **CONTEXTO**
> O Assistente NovaTech é um assistente corporativo baseado em RAG utilizado para responder perguntas sobre:
> - Prazos de entrega
> - Regras de frete
> - Políticas de devolução
> - SLAs
>
> A base de conhecimento é composta por documentos corporativos indexados.
> Toda resposta deve possuir rastreabilidade documental.
>
> **GUARDRAILS IDENTIFICADOS NA FASE ANTERIOR**
> - Sempre citar fonte.
> - Nunca inventar prazos ou valores.
> - Quando não encontrar resposta, dizer explicitamente.
> - Responder em português formal.
>
> **INCIDENTES IDENTIFICADOS DURANTE TESTES**
>
> *Incidente 1:*
> "O assistente respondeu que o prazo de devolução para carga perigosa é 7 dias, quando na verdade cargas perigosas NÃO podem ser devolvidas."
>
> *Incidente 2:*
> "O assistente citou PROC-042 seção 2, porém utilizou multiplicadores da versão 1 do documento, mesmo existindo uma versão 2 vigente."
>
> *Incidente 3:*
> "O assistente respondeu 'Não encontrei informação sobre SLA Gold', apesar de existir um documento indexado contendo a resposta."
>
> **TAREFA**
> Crie um documento completo de guardrails para o Assistente NovaTech.
>
> **ESTRUTURA OBRIGATÓRIA**
>
> Guardrails do Assistente NovaTech
>
> - **DEVE** — Liste todos os comportamentos obrigatórios. Para cada item: Guardrail, Justificativa, Tipo de enforcement (Prompt/Código), Motivo da classificação.
> - **NÃO DEVE** — Liste todos os comportamentos proibidos. Para cada item: Guardrail, Justificativa, Tipo de enforcement, Motivo da classificação.
> - **QUANDO EM DÚVIDA** — Liste todos os comportamentos de fallback. Para cada item: Guardrail, Justificativa, Tipo de enforcement, Motivo da classificação.
> - **MATRIZ DE ENFORCEMENT** — Tabela: Guardrail | Categoria | Enforcement | Justificativa
> - **MATRIZ DE RASTREABILIDADE** — Tabela: Incidente | Guardrails Relacionados | Como o Guardrail Evita o Problema
> - **ANÁLISE FINAL** — Quais guardrails devem obrigatoriamente ser implementados em código; quais podem ser tratados apenas por prompt; quais possuem maior risco operacional; quais possuem impacto direto em compliance.
>
> **IMPORTANTE**
> - Os guardrails devem ser específicos para o domínio da NovaTech.
> - Não gerar guardrails genéricos.
> - Considere documentos vigentes, SLAs, frete, devoluções, carga perigosa, tiers de clientes e rastreabilidade documental.
> - Demonstre claramente a diferença entre enforcement probabilístico (prompt) e determinístico (código).
> - Todos os guardrails devem ser rastreáveis a riscos ou incidentes reais.

---

## Resposta 1 — Claude

**Ações executadas:**

1. Leitura do arquivo anexado `anexo-a-documentacao-simulada-novatech.md` (264 linhas), incluindo os 5 documentos simulados da NovaTech:
   - Documento 1: POL-001 — Política de Devolução de Mercadorias (v3.1)
   - Documento 2: PROC-042 — Procedimento de Cálculo de Frete Especial (v1.0)
   - Documento 3: PROC-042-v2 — Procedimento de Cálculo de Frete Especial Revisado (v2.0)
   - Documento 4: SLA-2024 — Tabela de SLA por Tipo de Cliente (v2024.1)
   - Documento 5: FAQ-Atendimento — Perguntas Frequentes do Time de Suporte

2. Leitura das linhas truncadas (127-138) para capturar os multiplicadores regionais e fatores de peso da PROC-042-v2.

3. Leitura do SKILL.md para criação de documentos .docx.

4. Geração do documento `guardrails-novatech.docx` via script Node.js com a biblioteca `docx-js`, contendo:
   - Capa com título, versão, data e classificação
   - Seção de Contexto e Objetivo
   - Seção 1 — DEVE: 10 guardrails obrigatórios (GRD-01 a GRD-10)
   - Seção 2 — NÃO DEVE: 8 guardrails proibidos (GRP-01 a GRP-08)
   - Seção 3 — QUANDO EM DÚVIDA: 6 guardrails de fallback (GRF-01 a GRF-06)
   - Seção 4 — Matriz de Enforcement (24 linhas)
   - Seção 5 — Matriz de Rastreabilidade (3 incidentes)
   - Seção 6 — Análise Final (4 eixos)

5. Validação e entrega do arquivo .docx ao usuário.

**Resumo entregue:**

> O documento está pronto. Aqui vai um resumo do que foi entregue:
>
> **Seção 1 — DEVE:** 10 guardrails obrigatórios (GRD-01 a GRD-10), cobrindo citação de fontes, versionamento de documentos, português formal, SLAs por tier, multiplicadores vigentes, tiers válidos, procedimento de devolução, incidentes críticos, custos de devolução e prioridade documental.
>
> **Seção 2 — NÃO DEVE:** 8 guardrails proibitivos (GRP-01 a GRP-08), cobrindo bloqueio de devolução de carga perigosa, proibição de inventar dados, bloqueio da PROC-042 v1, tiers inexistentes, informações sem documento normativo, escopo da base, categorias inelegíveis e qualificação do FAQ.
>
> **Seção 3 — QUANDO EM DÚVIDA:** 6 guardrails de fallback (GRF-01 a GRF-06), cobrindo threshold de retrieval, encaminhamento para Gestão de Riscos, conflito de versões, tier não identificado, cobertura apenas pelo FAQ e prazo expirado.
>
> **Seção 4 — Matriz de Enforcement:** Consolida os 24 guardrails, com 16 classificados como código (determinístico) e 8 como prompt (probabilístico).
>
> **Seção 5 — Matriz de Rastreabilidade:** Vincula cada um dos 3 incidentes aos guardrails que o previnem, com explicação causal de como cada guardrail atua.
>
> **Seção 6 — Análise Final:** Desdobra os 4 eixos solicitados — obrigatoriedade em código, tratamento por prompt, risco operacional e impacto em compliance — com referências específicas aos documentos e incidentes da NovaTech.

**Arquivo entregue:** `guardrails-novatech.docx`

---

## Mensagem 2 — Usuário

> em .md por favor

---

## Resposta 2 — Claude

**Ação executada:** Geração do arquivo `guardrails-novatech.md` com o conteúdo completo e idêntico ao .docx, formatado em Markdown puro com:

- Cabeçalho com metadados (versão, data, classificação, escopo, documentos de referência)
- Seção de Contexto e Objetivo
- Seção 1 — DEVE: 10 guardrails (GRD-01 a GRD-10), cada um com guardrail, justificativa, tipo de enforcement e motivo da classificação
- Seção 2 — NÃO DEVE: 8 guardrails (GRP-01 a GRP-08)
- Seção 3 — QUANDO EM DÚVIDA: 6 guardrails (GRF-01 a GRF-06)
- Seção 4 — Matriz de Enforcement: tabela com 24 linhas
- Seção 5 — Matriz de Rastreabilidade: tabela com 3 incidentes mapeados
- Seção 6 — Análise Final: 4 subseções (código obrigatório, prompt suficiente, risco operacional, compliance)

**Arquivo entregue:** `guardrails-novatech.md`

**Resumo entregue:**

> Pronto — o documento em Markdown contém a mesma estrutura completa: 10 guardrails DEVE, 8 NÃO DEVE, 6 QUANDO EM DÚVIDA, a Matriz de Enforcement (24 linhas), a Matriz de Rastreabilidade (3 incidentes mapeados) e a Análise Final com os 4 eixos solicitados. Todos os guardrails estão rastreados a documentos específicos da NovaTech e aos incidentes reais.

---

## Mensagem 3 — Usuário

> gere o historico da conversa em .md

---

## Resposta 3 — Claude

Geração deste arquivo: `historico-conversa-exercicio-2.2.md`

---

## Resumo dos Artefatos Gerados

| # | Arquivo | Formato | Descrição |
|---|---------|---------|-----------|
| 1 | `guardrails-novatech.docx` | Word (.docx) | Documento completo de guardrails — versão formatada profissional |
| 2 | `guardrails-novatech.md` | Markdown (.md) | Documento completo de guardrails — versão Markdown |
| 3 | `historico-conversa-exercicio-2.2.md` | Markdown (.md) | Histórico completo desta conversa |

## Resumo Quantitativo dos Guardrails

| Categoria | Quantidade | Código (Determinístico) | Prompt (Probabilístico) |
|-----------|-----------|------------------------|------------------------|
| DEVE | 10 | 7 | 3 |
| NÃO DEVE | 8 | 5 | 3 |
| QUANDO EM DÚVIDA | 6 | 4 | 2 |
| **Total** | **24** | **16** | **8** |

## Cobertura de Incidentes

| Incidente | Guardrails que o cobrem |
|-----------|------------------------|
| Incidente 1 (carga perigosa + devolução) | GRP-01, GRF-02, GRD-10 |
| Incidente 2 (versão errada PROC-042) | GRD-02, GRD-05, GRP-03, GRF-03 |
| Incidente 3 (falso negativo SLA Gold) | GRF-01, GRD-04 |
