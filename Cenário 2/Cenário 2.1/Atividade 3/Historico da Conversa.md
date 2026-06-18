# Histórico da Conversa — Assistente NovaTech (Interface de Resposta no Microsoft Teams)

**Projeto:** NovaTech Assistant Response Interface
**Data:** 17/06/2026
**Arquivo principal:** `Assistente NovaTech.dc.html`

---

## 1. Solicitação inicial

O usuário pediu um **mockup de alta fidelidade da interface de resposta do Assistente NovaTech dentro do Microsoft Teams**.

**Contexto do produto:** assistente corporativo baseado em RAG usado por atendentes de logística para consultar prazos de entrega, regras de frete, políticas de devolução e SLAs.

**Objetivo da tela:** permitir que o atendente faça perguntas e obtenha respostas confiáveis em menos de 30 segundos, sempre com rastreabilidade documental.

### Requisitos obrigatórios da interface
- Campo da pergunta do usuário
- Resposta gerada pelo assistente
- Fonte documental utilizada
- Identificador do documento
- Seção do documento utilizada
- Indicador de confiança da resposta
- Aviso visual quando existirem documentos contraditórios
- Informação sobre qual documento é a versão vigente
- Sugestão de escalação ao supervisor quando a confiança for baixa
- Timestamp da consulta

### Estados a representar
1. Resposta normal com alta confiança
2. Resposta com documentos contraditórios
3. Resposta com baixa confiança
4. Nenhuma informação encontrada

### Entregáveis solicitados
- Mockup principal da tela
- Wireframe anotado
- Explicação dos componentes
- Fluxo de interação do usuário
- Justificativa das decisões de UX
- Mapeamento de cada elemento aos requisitos do `requirements.md`

### Guardrails do produto (refletidos na tela)
- Toda resposta possui fonte
- Nunca ocultar nível de confiança
- Nunca ocultar conflitos documentais
- Sempre indicar documento vigente quando houver múltiplas versões

---

## 2. Análise dos requisitos

Foram lidos os arquivos `uploads/requirements.md` e `uploads/requirements-a3adfdc3.md` (idênticos) — documento "Requirements — Query Endpoint (Consulta e Resposta)".

Pontos-chave extraídos:
- **Estrutura obrigatória da resposta (C2):** 5 campos em ordem fixa — resposta → nível de confiança → fontes → trechos literais → orientação de uso.
- **Guardrails G1–G6:** proibição de invenção, fonte obrigatória, confiança declarada, conflito declarado, lacuna declarada, contexto solicitado.
- **C4 — somente documentos vigentes** ("vigente" ou "em transição").
- **C5 — neutralidade diante de contradições** (o sistema não escolhe um lado).
- **C3 — rastreabilidade completa** (registro de trechos, vínculo ao chamado).
- **Critérios de verificação VC-01 a VC-10**, usados para ancorar os 4 estados e o mapeamento final.

Como o briefing era detalhado e completo, optou-se por **não abrir rodada de perguntas** e seguir direto para a construção.

---

## 3. O que foi construído

Uma única **Design Component** (`Assistente NovaTech.dc.html`) — página de documentação rolável contendo um mockup interativo + os entregáveis.

### Sistema visual
- Chrome corporativo estilo Teams (roxo `#5b5fc7`), com marca própria do assistente em teal `#0e7c86`.
- Tipografia: stack Segoe UI / system-ui.
- Semáforo de confiança: verde (alta), âmbar (média), vermelho (baixa), cinza (não aplicável).

### Mockup principal (interativo)
Janela estilo Teams com rail de apps, lista de conversas e thread de chat. O **card de resposta estruturado** segue a ordem fixa de 5 campos da Spec v2.0:
1. **Resposta gerada** — rotulada com ícone ✦ e cor da marca (distinção do conteúdo gerado).
2. **Nível de confiança** — chip semáforo + medidor de 3 segmentos (nunca ocultado).
3. **Fontes** — chip de código do documento, versão, seção utilizada e selo de vigência.
4. **Trechos literais** — citação com borda lateral teal (distinção do conteúdo documentado).
5. **Orientação de uso**.

Mais: banner de contradição, selo "Versão vigente / Em transição", faixa de escalação ao supervisor, timestamp + rodapé de auditoria.

### 4 estados navegáveis (botões no topo)
| Estado | Cenário | Confiança |
|---|---|---|
| Alta confiança | Prazo de entrega Sudeste / frete padrão — fonte única `POL-LOG-014 v3.1` | Alta |
| Documentos contraditórios | Prazo de devolução — `POL-DEV-007 v2.0` (7 dias) × `PROC-DEV-012 v1.4` (30 dias), ambos vigentes | Média |
| Baixa confiança | Frete itens frágeis em Manaus — cobertura parcial `SLA-FRT-003` | Baixa |
| Nenhuma informação | Tier "Platinum" inexistente (base só tem Bronze/Prata/Ouro) | Não aplicável |

### Entregáveis adicionais na página
- **Wireframe anotado** — esquema com 10 callouts numerados, cada um mapeado a requisito + guardrail.
- **Componentes da interface** — explicação de cada componente.
- **Fluxo de interação do atendente** — 5 passos (pergunta → recuperação RAG → leitura por escaneamento → verificação da fonte → aplicar ou escalar).
- **Justificativa de UX** — 6 decisões (confiança sempre visível, gerado vs. documentado, conflito destacado, vigência explícita, legibilidade operacional, aderência ao Teams).
- **Tabela de mapeamento** requisito ↔ elemento na interface ↔ guardrail/VC.

---

## 4. Verificação

- Renderização confirmada (cabeçalho, seletor de estados, card).
- Alternância entre os 4 estados validada (IDs de chamado mudam: #48213 → #48217 → #48224 → #48231).
- Sem erros de console; sem overflow horizontal real.

---

## 5. Exportações geradas

### PPTX editável
- Como o arquivo é uma página única (não um deck), foi exportado como **uma única slide editável** contendo todo o layout.
- Dimensões: 1228 × 4166 px. Fontes substituídas por equivalentes web-safe (Arial / Courier New).
- Arquivo: `Assistente-NovaTech-Teams.pptx`.
- Observação: captura o estado exibido no momento (alta confiança). Alternativa sugerida: deck com uma slide por estado/seção.

### HTML standalone (offline)
- Adicionado o `<template id="__bundler_thumbnail">` exigido pelo bundler (splash com glifo "N" sobre fundo roxo Teams).
- Única dependência externa: `support.js` (runtime do Design Component) — inlined pelo bundler.
- Sem imagens/fontes externas.
- Arquivo: `Assistente NovaTech (standalone).html` (~77 KB), com os 4 estados interativos funcionando offline.

---

## 6. Arquivos do projeto

| Arquivo | Descrição |
|---|---|
| `Assistente NovaTech.dc.html` | Design Component principal (fonte) |
| `Assistente NovaTech (standalone).html` | Versão única offline |
| `Assistente-NovaTech-Teams.pptx` | Exportação PPTX editável |
| `uploads/requirements.md` | Requisitos do Query Endpoint |
| `Historico da Conversa.md` | Este documento |

---

## 7. Próximos passos sugeridos
- Adicionar 5º estado: **solicitação de contexto faltante** (guardrail G6).
- Variação em **tema escuro** do Teams.
- Versão deck (uma slide por estado + uma por seção de documentação) para apresentação.
