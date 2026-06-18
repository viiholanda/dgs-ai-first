# Registro de Interação — Geração do requirements.md do Query Endpoint

**Data:** 17 de Junho de 2026  
**Participantes:** Usuário (Product Specialist) · Claude (Assistente IA)  
**Objetivo:** Gerar o documento `requirements.md` do módulo Query Endpoint do Assistente NovaTech

---

## Contexto Fornecido

O usuário fez upload do arquivo `recorte-dominio-novatech-bounded-contexts__1_.md`, contendo o recorte de domínio completo do Assistente NovaTech com cinco bounded contexts mapeados:

1. Conhecimento Operacional (*Operational Knowledge*)
2. Consulta e Resposta (*Query & Answer*)
3. Interação com o Atendente (*Agent Interaction*)
4. Qualidade e Feedback (*Quality & Feedback Loop*)
5. Governança e Ciclo de Vida Documental (*Document Governance & Lifecycle*)

O documento incluía o mapa de relações entre contextos, padrões de relação DDD (Customer-Supplier, Upstream-Downstream, Published Language, Conformist, Open Host Service) e observações complementares sobre cruzamento de categorias, camada técnica e FAQ informal.

---

## Prompt do Usuário

O usuário solicitou a geração do `requirements.md` do módulo principal "Query Endpoint" do assistente NovaTech, definindo o seguinte papel e estrutura:

**Papel atribuído ao assistente:**

> Product Specialist sênior especialista em Spec Driven Development (SDD), Domain Driven Design (DDD) e produtos baseados em IA.

**Seções obrigatórias do documento:**

| Seção | Diretriz |
|---|---|
| **Outcomes** | Resultados esperados para usuários e negócio. Foco em valor, não em implementação. |
| **Scope Boundaries** | In Scope e Out of Scope derivados dos bounded contexts. |
| **Constraints** | Restrições obrigatórias de produto, negócio e compliance. |
| **Prior Decisions** | Referência explícita às ADRs 0001 a 0004. Sem criar novas decisões. |
| **Verification Criteria** | Critérios testáveis (VC-01, VC-02, VC-03…) executáveis por QA. |

**Restrições do prompt:**

- Não descrever implementação detalhada.
- Não criar requisitos técnicos desnecessários.
- Focar no comportamento esperado do produto.
- Garantir rastreabilidade entre bounded contexts, constraints e critérios de validação.
- Utilizar linguagem clara e adequada para documento oficial de produto.

---

## Processamento do Assistente

### Etapa 1 — Leitura do artefato de domínio

O assistente leu o arquivo completo `recorte-dominio-novatech-bounded-contexts__1_.md` em duas passagens (linhas 1–113 e 114–165) para capturar todos os cinco bounded contexts, suas relações, justificativas de separação e observações complementares.

### Etapa 2 — Verificação de skills disponíveis

O assistente verificou a existência de um skill de markdown (`/mnt/skills/public/md/SKILL.md`). O skill não estava disponível, então prosseguiu com a criação direta do arquivo.

### Etapa 3 — Composição do documento

O assistente gerou o `requirements.md` com as seguintes decisões de composição:

**Outcomes** — Organizados em três perspectivas:

- *Para o Atendente:* resposta estruturada, rastreável, com confiança explícita; clareza em lacunas; proibição de invenção.
- *Para o Negócio:* auditabilidade, neutralidade em contradições, visibilidade de lacunas.
- *Para a Operação:* redução de tempo de busca, diminuição de escaladas desnecessárias, insumos estruturados para o ciclo de feedback.

**Scope Boundaries** — Derivados diretamente do bounded context "Consulta e Resposta":

- *In Scope:* 10 itens cobrindo desde a recepção da consulta até o registro de trechos e aplicação dos guardrails G1–G6.
- *Out of Scope:* 5 itens, cada um referenciando explicitamente o bounded context responsável (Conhecimento Operacional, Interação com o Atendente, Qualidade e Feedback, Governança e Ciclo de Vida, camada técnica).

**Constraints** — 6 constraints (C1 a C6):

| Constraint | Tema |
|---|---|
| C1 | Guardrails G1–G6 como invariantes invioláveis |
| C2 | Estrutura obrigatória de 5 campos na resposta |
| C3 | Rastreabilidade completa com retenção de 5 anos |
| C4 | Consulta exclusiva a documentos vigentes ou em transição |
| C5 | Neutralidade diante de contradições |
| C6 | Conformidade com SLA de triagem de 2 dias úteis |

**Prior Decisions** — 4 ADRs referenciadas sem criação de novas decisões:

| ADR | Decisão |
|---|---|
| ADR-0001 | Arquitetura baseada em RAG |
| ADR-0002 | Fonte única de verdade: documentação formal |
| ADR-0003 | Níveis de confiança como classificação obrigatória |
| ADR-0004 | Contradições como estado legítimo, não como erro |

**Verification Criteria** — 10 critérios testáveis (VC-01 a VC-10):

| Critério | Cenário verificado | Rastreabilidade |
|---|---|---|
| VC-01 | Resposta estruturada completa (5 campos, ordem correta) | C2 |
| VC-02 | Proibição de informação não sustentada | C1 (G1, G2), ADR-0002 |
| VC-03 | Classificação de confiança coerente com cobertura | C1 (G3), ADR-0003 |
| VC-04 | Declaração de contradição sem hierarquização | C1 (G4), C5, ADR-0004 |
| VC-05 | Declaração explícita de lacuna | C1 (G5) |
| VC-06 | Solicitação de contexto faltante | C1 (G6) |
| VC-07 | Detecção de entidade inexistente | C1 (G1) |
| VC-08 | Rastreabilidade de trechos utilizados | C3 |
| VC-09 | Exclusão de documentos obsoletos | C4 |
| VC-10 | Registro de conflitos como feedback prioritário | C6 |

### Etapa 4 — Entrega e explicação

O assistente entregou o arquivo `requirements.md` e forneceu um resumo das decisões de composição, destacando a cobertura dos critérios de verificação em três categorias: caminho feliz, guardrails críticos e requisitos de auditoria/integração.

---

## Resposta do Assistente (Resumo Pós-Entrega)

> **Outcomes** cobrem três perspectivas: atendente, negócio e operação.
>
> **Scope Boundaries** derivam diretamente das fronteiras do bounded context "Consulta e Resposta", com cada item Out of Scope referenciando o contexto responsável.
>
> **Constraints** codificam os seis guardrails como invariantes (C1), mais cinco restrições extraídas da Spec v2.0.
>
> **Prior Decisions** referenciam as quatro ADRs sem criar decisões novas, conectando cada ADR ao impacto no módulo.
>
> **Verification Criteria** totalizam 10 critérios executáveis por QA, com rastreabilidade explícita para constraints, ADRs e bounded contexts.

---

## Artefato Gerado

| Arquivo | Caminho |
|---|---|
| `requirements.md` | `/mnt/user-data/outputs/requirements.md` |

---

*Registro gerado automaticamente a partir da interação em 17 de Junho de 2026.*
