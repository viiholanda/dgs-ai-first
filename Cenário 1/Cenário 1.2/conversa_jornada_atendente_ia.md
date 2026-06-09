# Conversa: Jornada Operacional do Atendente com Assistente de IA

> Registro completo da conversa entre usuário e Claude sobre a elaboração da jornada operacional do atendente com assistente de IA, com base em dados de Discovery.

---

## Mensagem 1 — Usuário

**Dados do Discovery fornecidos:**

- Os atendentes consultam, em média, **4 fontes diferentes** para resolver cada chamado.
- As dúvidas mais frequentes são:
  - Prazos de entrega: 35%
  - Regras de frete: 25%
  - Política de devolução: 20%
  - Outros assuntos: 20%
- Em aproximadamente **15% dos casos**, o atendente não encontra a resposta e precisa escalar para um supervisor.

**Solicitação:** Com base nessas informações, elabore a jornada completa do atendente em formato de texto estruturado, detalhando:

1. **Fluxo Principal** — processo padrão desde o recebimento da dúvida até a utilização da resposta no atendimento.
2. **Fluxo de Fallback** — comportamento esperado quando o assistente não possui confiança suficiente, a informação não está disponível, o atendente discorda da resposta, ou é necessário escalar.
3. **Fluxo de Feedback** — como o atendente reporta problemas (resposta incorreta, desatualizada, incompleta ou contraditória) e como esse feedback é registrado e utilizado para melhoria contínua.
4. **Guardrails do Assistente** — pelo menos 2 guardrails obrigatórios de comportamento.

---

## Resposta 1 — Claude

Claude gerou um **diagrama interativo** (SVG/HTML) com quatro seções visuais clicáveis, seguido de detalhamento textual de cada seção.

### 1. Fluxo Principal

**Etapa 1.1 — Recebimento da dúvida**
O atendente recebe a dúvida do cliente — que estatisticamente pertence a um dos quatro grupos (prazos 35%, frete 25%, devoluções 20%, outros 20%) — e abre a interface do assistente.

**Etapa 1.2 — Consulta ao assistente de IA**
Descreve o caso com contexto suficiente: categoria da dúvida, dados relevantes do pedido e o que o cliente perguntou exatamente.

**Etapa 1.3 — Recebimento da resposta**
Recebe do assistente uma resposta acompanhada do documento-fonte, da versão do documento e de um indicador de confiança.

**Etapa 1.4 — Avaliação e uso**
Avalia se a resposta é coerente e completa. Se sim, usa a informação para responder ao cliente, mencionando a política correspondente quando necessário. O chamado é encerrado.

---

### 2. Fluxo de Fallback

Três situações disparam o fallback: o assistente sinaliza baixa confiança, a informação não existe na base, ou o atendente discorda da resposta recebida.

**Etapa 2.1 — Reformulação**
Antes de escalar, o atendente pode tentar reformular a consulta com contexto diferente. Se uma segunda tentativa também falhar, o caso é escalado.

**Etapa 2.2 — Escalada**
Na escalada, o atendente registra: contexto do chamado, motivo da escalada, resposta que o assistente forneceu e o ID do chamado. O supervisor assume e resolve diretamente. Esse caminho representa aproximadamente 15% dos atendimentos.

---

### 3. Fluxo de Feedback

Sempre que o atendente identificar um problema na resposta — incorreta, desatualizada, incompleta ou contraditória — ele preenche um registro estruturado com: tipo do problema, pergunta original, resposta recebida, resposta correta esperada e ID do chamado.

O time de qualidade realiza triagem periódica, priorizando por frequência e criticidade. A base de conhecimento é atualizada — com correção, expansão ou depreciação de conteúdo — e o assistente é retreinado. Cada erro identificado torna-se uma melhoria sistêmica.

---

### 4. Guardrails

**G1 — Sem invenção:** o assistente nunca gera informação ausente da base. Em vez disso, declara que não possui resposta.

**G2 — Fonte obrigatória:** toda resposta cita o documento-fonte e, quando possível, a versão ou data de atualização.

**G3 — Declarar incerteza:** quando o nível de confiança for insuficiente, o assistente declara explicitamente e orienta o atendente a acionar um supervisor.

**G4 — Conflito documental:** quando dois documentos da base se contradizem, o assistente sinaliza o conflito sem tomar partido, apresentando as duas versões e sugerindo verificação com a área responsável.

---

## Mensagem 2 — Usuário

> "gere em .md"

---

## Resposta 2 — Claude

Claude gerou o arquivo `jornada_atendente_ia.md` com a jornada completa estruturada em Markdown, contendo:

- Tabelas para tipos de feedback, guardrails e ações corretivas
- Etapas numeradas com resultados esperados em cada uma
- Diagrama ASCII resumindo o fluxo completo:

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

## Mensagem 3 — Usuário

> "gere um arquivo md dessa conversa"

---

## Resposta 3 — Claude

Geração deste arquivo: registro completo da conversa em Markdown.

---

*Conversa realizada em Claude.ai · Modelo: Claude Sonnet 4.6 · Data: junho de 2026*
