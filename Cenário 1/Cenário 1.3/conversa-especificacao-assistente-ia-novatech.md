# Registro de Conversa — Especificação do Assistente de IA NovaTech
**Data:** Junho/2026
**Participantes:** Usuário + Claude (Anthropic)
**Tema:** Elaboração, análise crítica e revisão da especificação de requisitos do produto para o assistente de IA de atendimento da NovaTech Logística

---

## Arquivos de entrada

- `anexo-a-documentacao-simulada-novatech.md` — Documentação operacional simulada da NovaTech
- `anexo-b-chunks-referencia-rag.md` — Chunks de referência do pipeline de RAG
- `jornada_atendente_ia.md` — Jornada operacional do atendente com assistente de IA

---

## Turno 1 — Usuário

Com base nos documentos em anexo, escreva uma especificação de requisitos do produto (não técnica, mas precisa) que cubra:

1. Quais fontes de dados devem ser indexadas (e quais não — ex: documentos obsoletos devem ser excluídos ou marcados?).
2. Como o assistente deve lidar com documentos contraditórios (ex: duas versões do mesmo procedimento).
3. Qual o comportamento esperado quando a pergunta do atendente não tem resposta na base (o assistente deve dizer "não encontrei" ou tentar responder com conhecimento geral?).
4. Requisitos de atualização: quando novos documentos são publicados, em quanto tempo devem estar disponíveis no assistente?
5. Requisitos de rastreabilidade: toda resposta deve citar a fonte? Deve mostrar o trecho relevante?

---

## Turno 1 — Assistente

Geração da **Especificação de Requisitos do Produto v1.0** (`especificacao-requisitos-assistente-ia-novatech.md`).

### Estrutura produzida

1. **Escopo e Propósito** — papel do assistente como consultor interno de políticas; subordinação ao julgamento humano; 15% de escalada esperada.
2. **Fontes de Dados** — critérios de elegibilidade (autoria formal, versão, vigência, aprovação); exclusões (FAQs informais, versões obsoletas, rascunhos, documentos expirados); regra de transição entre versões com coexistência controlada.
3. **Tratamento de Documentos Contraditórios** — definição de contradição; comportamento exigido (declarar, apresentar ambas as versões, orientar escalada, registrar feedback); nível de confiança Baixo automático.
4. **Comportamento sem resposta na base** — declarar lacuna explicitamente; proibição de uso de conhecimento geral ou inferência; exemplos de lacunas identificadas nos testes; tratamento de entidades inexistentes (ex: tier Platinum).
5. **Requisitos de Atualização** — tabela de prazos por tipo de atualização (24h, 48h, 4h, 2h); processo de validação pré-indexação; notificação ao time; ciclo de revisão periódica de 90 dias.
6. **Requisitos de Rastreabilidade** — citação obrigatória de fonte (código, versão, seção); exibição de trecho literal; indicador de confiança (Alto/Médio/Baixo); rastreabilidade de feedback até o chunk específico.
7. **Guardrails Obrigatórios** — G1 a G5: sem invenção, fonte obrigatória, indicador de confiança, conflito declarado, fallback acionado.
8. **Fora do Escopo** — arquitetura técnica, infraestrutura, integrações, permissões, métricas de retreino.

### Decisões de design destacadas

- FAQs informais excluídas da base ativa por risco de conflito com documentos formais.
- PROC-042 v1 e v2 usadas como exemplo concreto de coexistência problemática.
- Rastreabilidade vai além da citação de fonte: exige trecho literal e vínculo de feedback até o chunk.

---

## Turno 2 — Usuário

Com base na primeira versão gerada, identifique gaps ou ambiguidades na especificação. Apenas identifique.

---

## Turno 2 — Assistente

Identificação de **17 gaps e ambiguidades** na v1.0, agrupados por seção:

### Seção 2 — Fontes de dados

- **G1** — Critério de elegibilidade circular: quem valida se o processo de aprovação ocorreu?
- **G2** — FAQs multi-área: qual área aprova quando o FAQ cruza múltiplas políticas?
- **G3** — Arquivo histórico operacionalmente indefinido: separação técnica, acesso e responsável não especificados.
- **G4** — Transição sem data informada: o que o assistente faz quando o atendente não informa a data de abertura do chamado?

### Seção 3 — Documentos contraditórios

- **G5** — Definição de contradição parcial: não cobre contradição por exceção não formalizada (ex: FAQ-03 abre exceção não prevista em POL-001-B).
- **G6** — Registro automático de conflito sem SLA de triagem definido.

### Seção 4 — Resposta ausente na base

- **G7** — Limite entre lacuna e inferência razoável indefinido: e casos limítrofes (ex: carga de 499kg quando a regra começa em 500kg)?
- **G8** — Responsabilidade pelo fallback transferida implicitamente ao assistente sem deixar claro o que ele faz vs. o que orienta o atendente a fazer.

### Seção 5 — Atualização da base

- **G9** — Prazo de indexação: ponto de partida ("publicação oficial") indefinido.
- **G10** — Conflito pré-indexação sem resolução: o que acontece se o conflito não for resolvido dentro do prazo?
- **G11** — Responsável pelo processo de indexação não identificado em nenhuma etapa.

### Seção 6 — Rastreabilidade

- **G12** — Trechos literais em respostas multi-fonte: exibir todos os trechos pode tornar a interface inutilizável; tensão não resolvida.
- **G13** — Nível de confiança Médio com critério vago: "alguma ambiguidade" não é operacional.
- **G14** — Feedback vinculado ao chunk pressupõe registro interno não especificado como requisito.

### Ausências transversais

- **G15** — "Área responsável" mencionada repetidamente sem nunca ser definida por tipo de documento.
- **G16** — Comportamento quando o atendente omite contexto relevante (ex: não informa peso da carga, região, data do chamado).
- **G17** — Sem requisito de retenção de logs para auditoria regulatória ou disputas contratuais.

---

## Turno 3 — Usuário

Com base no feedback, revise o documento e proponha melhorias para torná-lo mais alinhado às necessidades do negócio, mais claro, completo e assertivo em relação aos requisitos definidos.

---

## Turno 3 — Assistente

Geração da **Especificação de Requisitos do Produto v2.0**, com as seguintes mudanças em relação à v1.0:

### Novas seções

- **Seção 7 — Comportamento da Interface com o Atendente** — estrutura obrigatória de toda resposta (5 campos em ordem); registro interno de chunks utilizados; comportamento quando o atendente omite contexto relevante.
- **Seção 9 — Retenção de Logs e Auditoria** — retenção mínima de 5 anos; casos de uso dos logs; controle de acesso por perfil.
- **Seção 10 — Papéis e Responsabilidades** — tabela unificada com responsável e escalada para cada processo da especificação.

### Alterações por gap resolvido

| Gap | Seção alterada | Mudança |
|---|---|---|
| G1 | 2.1 | Aprovação formal definida como registro no sistema de gestão documental; validação atribuída à Área de Qualidade |
| G2 | 2.2 | FAQs multi-área: cada área aprova seus itens; FAQ bloqueado enquanto houver pendência |
| G3 | 2.3 | Arquivo histórico definido como partição separada do índice; regras de acesso por perfil explicitadas |
| G4 | 2.4 | Transição sem data: assistente solicita a data ao atendente antes de responder; não assume nem escolhe |
| G5 | 3.1 | Definição expandida: três tipos de contradição (direta, por exceção não formalizada, por omissão relevante) |
| G6 | 3.3 | SLA de triagem de conflitos: 2 dias úteis, com escalada ao Gerente de Qualidade |
| G7 | 4.2 | Nova subseção: distinção entre lacuna real e caso limítrofe, com exemplo concreto (carga de 499kg) |
| G8 | 7.3 | Seção nova: o assistente solicita contexto faltante — não assume valores padrão nem gera resposta parcial |
| G9 | 5.3 | Definição de publicação oficial: registro no sistema de gestão documental com aprovação formal |
| G10 | 5.2 | Conflito pré-indexação sem resolução: documento bloqueado; escalada ao Gerente de Operações se prazo expirar |
| G11 | 10 | Seção nova de responsabilidades: equipe técnica de indexação identificada para execução técnica |
| G12 | 6.2 | Respostas multi-fonte: trechos associados a cada parte da resposta; regra de compressão com opção de expansão |
| G13 | 6.3 | Critérios objetivos e determinísticos: Alto exige 3 condições simultâneas; Médio e Baixo por qualquer condição |
| G14 | 7.2 | Registro interno de chunks especificado como requisito explícito de produto |
| G15 | 10 | Tabela de responsáveis resolve todas as menções a "área responsável" com nome de área e escalada |
| G16 | 7.3 | Seção nova: comportamento com contexto incompleto — solicitar antes de responder |
| G17 | 9 | Seção nova de retenção de logs: 5 anos mínimos, casos de uso, controle de acesso |

### Guardrail adicionado

- **G6 — Contexto completo exigido:** quando o contexto for insuficiente para determinar a resposta correta, o assistente solicita a informação faltante antes de responder.

---

## Turno 4 — Usuário

Gere o `.md` dessa conversa.

---

## Turno 4 — Assistente

Geração deste arquivo: `conversa-especificacao-assistente-ia-novatech.md`.

---

## Artefatos produzidos nesta conversa

| Arquivo | Versão | Descrição |
|---|---|---|
| `especificacao-requisitos-assistente-ia-novatech.md` | v2.0 (final) | Especificação de requisitos do produto — substitui v1.0 |
| `conversa-especificacao-assistente-ia-novatech.md` | — | Este arquivo — registro completo da conversa |
ENDDOC