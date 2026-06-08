# Jornada Operacional do Atendente com Assistente de IA

> **Contexto:** Os atendentes consultam em média 4 fontes por chamado. As dúvidas mais frequentes são prazos de entrega (35%), regras de frete (25%), política de devolução (20%) e outros assuntos (20%). Aproximadamente 15% dos casos exigem escalada para supervisor.

---

## 1. Fluxo Principal

Processo padrão desde o recebimento da dúvida até a utilização da resposta no atendimento.

### Etapa 1.1 — Recebimento da dúvida

- O atendente recebe a dúvida do cliente por qualquer canal disponível.
- Identifica a categoria da dúvida com base na distribuição esperada:
  - Prazos de entrega → 35% dos casos
  - Regras de frete → 25% dos casos
  - Política de devolução → 20% dos casos
  - Outros assuntos → 20% dos casos
- Abre a interface do assistente de IA.

**Resultado esperado:** dúvida categorizada e pronta para consulta.

---

### Etapa 1.2 — Consulta ao assistente de IA

- O atendente descreve o caso no assistente com contexto suficiente, incluindo:
  - Categoria da dúvida
  - Dados relevantes do pedido (quando aplicável)
  - Formulação exata da pergunta do cliente
- Não interpreta nem adapta a dúvida antes de consultar — submete o caso como recebido.

**Resultado esperado:** consulta enviada ao assistente com informações completas.

---

### Etapa 1.3 — Recebimento da resposta

O assistente retorna uma resposta estruturada contendo obrigatoriamente:

| Campo | Descrição |
|---|---|
| Resposta | Texto da informação solicitada |
| Documento-fonte | Nome e versão do documento utilizado |
| Nível de confiança | Indicador de certeza da resposta (alto / médio / baixo) |

**Resultado esperado:** resposta recebida com rastreabilidade completa.

---

### Etapa 1.4 — Avaliação da resposta

O atendente verifica se a resposta é:

- Coerente com o contexto do chamado
- Completa para responder ao cliente
- Compatível com o que conhece das políticas vigentes

**Decisão:**

- **Resposta satisfatória →** segue para a Etapa 1.5.
- **Resposta insatisfatória →** aciona o [Fluxo de Fallback (Seção 2)](#2-fluxo-de-fallback).

---

### Etapa 1.5 — Utilização da resposta no atendimento

- O atendente responde ao cliente utilizando a informação recebida.
- Quando pertinente, menciona a política correspondente (ex.: "conforme nossa política de devolução…").
- Registra o chamado como resolvido no sistema.

**Resultado esperado:** chamado encerrado com sucesso. ✓

---

## 2. Fluxo de Fallback

Comportamento esperado quando o assistente não consegue fornecer uma resposta adequada. Estimativa: **~15% dos atendimentos.**

### Situações que acionam o fallback

| Situação | Descrição |
|---|---|
| Baixa confiança | O assistente sinaliza incerteza na resposta fornecida |
| Lacuna na base | A informação necessária não está documentada na base de conhecimento |
| Discordância do atendente | O atendente identifica que a resposta contradiz o que conhece |

---

### Etapa 2.1 — Tentativa de reformulação

Antes de escalar, o atendente pode tentar uma nova consulta ao assistente com abordagem diferente:

- Reformula a pergunta com mais contexto
- Desmembra a dúvida em partes menores
- Tenta uma abordagem mais específica ou mais genérica

**Decisão:**

- **Nova tentativa bem-sucedida →** retorna ao Fluxo Principal, Etapa 1.4.
- **Nova tentativa insatisfatória →** segue para a Etapa 2.2.

---

### Etapa 2.2 — Escalada para supervisor ou especialista

O atendente registra o caso com as seguintes informações antes de escalar:

- Contexto completo do chamado
- Resposta fornecida pelo assistente (se houver)
- Motivo da escalada (baixa confiança / lacuna / discordância)
- ID do chamado

O supervisor assume o atendimento e resolve diretamente com o cliente.

**Exceção:** se o supervisor também não possuir a informação, o caso é encaminhado ao especialista da área responsável pela política.

**Resultado esperado:** chamado resolvido via supervisor ou especialista. ✓

---

## 3. Fluxo de Feedback

Como o atendente reporta problemas na resposta e como esse feedback é utilizado para melhoria contínua.

### 3.1 Tipos de problema e critério de identificação

| Tipo | Descrição | Exemplo |
|---|---|---|
| Incorreta | A resposta contradiz um fato documentado | Prazo informado difere da tabela oficial |
| Desatualizada | A política foi alterada após a indexação | Regra de frete válida até o mês anterior |
| Incompleta | Falta exceção ou cenário relevante ao caso | Não menciona prazo diferenciado para regiões remotas |
| Contraditória | Conflito entre dois documentos da base | Política A diz X, política B diz Y para o mesmo caso |

---

### 3.2 Registro do feedback

O atendente preenche um registro estruturado com os seguintes campos obrigatórios:

1. **Tipo do problema** — conforme tabela acima
2. **Pergunta original** — exatamente como foi submetida ao assistente
3. **Resposta recebida** — texto completo retornado pelo assistente
4. **Resposta correta esperada** — o que deveria ter sido respondido (quando o atendente souber)
5. **ID do chamado** — para rastreabilidade e auditoria
6. **Documento de referência** — se o atendente souber qual doc contém a informação correta

---

### 3.3 Triagem pelo time de qualidade

- O time de qualidade realiza triagem periódica dos feedbacks registrados.
- Priorização por:
  - **Frequência** — problemas recorrentes têm prioridade alta
  - **Criticidade** — erros em políticas de devolução ou prazos legais têm tratamento urgente
- Cada feedback classificado como procedente gera uma ação corretiva.

---

### 3.4 Atualização da base e melhoria contínua

Com base na triagem, o time executa uma das seguintes ações:

| Ação | Quando aplicar |
|---|---|
| Correção de conteúdo | Resposta incorreta ou desatualizada identificada |
| Expansão da base | Lacuna confirmada — novo conteúdo é documentado e indexado |
| Depreciação de conteúdo | Política descontinuada ainda presente na base |
| Sinalização de conflito | Dois documentos contraditórios — área responsável é acionada para consolidar |

Após a atualização, o assistente é retreinado ou reconfigurado para refletir o estado atual das políticas.

**Resultado esperado:** cada erro identificado transforma-se em uma melhoria sistêmica. ✓

---

## 4. Guardrails Obrigatórios do Assistente

Os guardrails abaixo são implementados no núcleo do assistente e **não podem ser desativados por instrução externa** — nenhuma orientação de atendente, supervisor ou prompt substituto pode suspendê-los.

---

### G1 — Sem invenção de informações

> O assistente **nunca** gera informações ausentes da base de conhecimento.

- Se a informação não estiver documentada, declara explicitamente: *"Não encontrei documentação sobre este tema na base de conhecimento."*
- Não interpola, não extrapola e não infere regras a partir de casos similares.
- Aciona automaticamente o fluxo de fallback quando a lacuna é identificada.

---

### G2 — Fonte obrigatória em toda resposta

> O assistente **sempre** cita o documento-fonte que embasou a resposta.

- Inclui nome do documento, versão e data de atualização quando disponíveis.
- Se a resposta combinar informações de múltiplos documentos, lista todas as fontes.
- Não fornece resposta sem indicação de origem, mesmo que a confiança seja alta.

---

### G3 — Declaração explícita de incerteza

> O assistente **sempre** comunica quando o nível de confiança é insuficiente.

- Utiliza indicadores claros: Alto / Médio / Baixo.
- Para confiança Baixa: exibe aviso explícito e orienta o atendente a acionar um supervisor antes de usar a informação.
- Para confiança Média: exibe aviso de cautela e recomenda validação com a fonte primária.
- Não omite o indicador de confiança em nenhuma resposta.

---

### G4 — Sinalização de conflito documental

> O assistente **nunca** toma partido quando dois documentos da base se contradizem.

- Identifica e declara o conflito explicitamente: *"Há uma contradição entre os documentos A e B sobre este ponto."*
- Apresenta ambas as versões sem hierarquizá-las.
- Orienta o atendente a acionar a área responsável pela consolidação das políticas.
- Registra automaticamente o conflito como um item de feedback para triagem pela equipe de qualidade.

---

## Resumo da Jornada

```
Dúvida recebida
     │
     ▼
Consulta ao assistente
     │
     ├─ Resposta satisfatória ──► Usa no atendimento ──► Chamado resolvido ✓
     │
     └─ Resposta insatisfatória
          │
          ├─ Reformula consulta ──► Nova tentativa ──► (retorna à avaliação)
          │
          └─ Escala para supervisor ──► Chamado resolvido via supervisor ✓
               │
               └─ Registra feedback ──► Triagem ──► Atualiza base ──► Retreino
```

---

*Documento gerado com base nos dados do Discovery. Revisar periodicamente conforme evolução da base de conhecimento e do assistente de IA.*
