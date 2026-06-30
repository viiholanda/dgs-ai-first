# Documento de Harness de Produto — NovaTech

**Assistente de IA baseado em RAG**
Versão 1.0 · Junho 2026 · Classificação: Confidencial

---

## 1. Objetivo do Harness

### 1.1 Finalidade

O Harness de Produto é a estrutura operacional que envolve o assistente de IA da NovaTech para garantir que cada alteração no sistema — seja no prompt, na base de conhecimento, no pipeline RAG ou no código — passe por um ciclo controlado de validação antes de atingir o ambiente de produção. Ele funciona como uma camada de governança contínua que conecta feedback operacional, testes de regressão, aprovações humanas e monitoramento de métricas em um fluxo único e rastreável.

Diferente de uma abordagem ad hoc, na qual correções são aplicadas diretamente em produção sem controle formal, o Harness institucionaliza a disciplina de melhoria contínua. Cada modificação é registrada, testada contra um baseline conhecido e aprovada por responsáveis definidos, eliminando a possibilidade de degradações silenciosas.

### 1.2 Benefícios

**Redução de regressões:** Cada nova versão é comparada automaticamente com a versão anterior através de um conjunto fixo de perguntas de regressão, impedindo que correções introduzam novos defeitos.

**Rastreabilidade completa:** Toda alteração é vinculada a um ticket de feedback, com causa raiz documentada, responsável identificado e resultado dos testes registrado.

**Conformidade com guardrails:** Os guardrails DEVE, NÃO DEVE e QUANDO EM DÚVIDA são validados automaticamente em cada ciclo de teste, garantindo que o assistente nunca viole políticas definidas pelo Product Specialist.

**Confiabilidade para stakeholders:** Com a demonstração para a diretoria em duas semanas, o Harness fornece evidências concretas de que o sistema está sob controle e que a taxa de erro de 12% está sendo tratada de forma sistemática.

### 1.3 Importância para um Sistema RAG em Produção

Sistemas RAG apresentam riscos específicos que sistemas tradicionais não possuem. A resposta do assistente depende não apenas do modelo de linguagem, mas também da qualidade dos documentos indexados, da precisão do mecanismo de recuperação e da estratégia de chunking. Uma alteração em qualquer uma dessas camadas pode degradar respostas que antes eram corretas.

Além disso, o problema identificado de 12% de respostas com erros demonstra que alucinações, documentos desatualizados e chunks incorretos já são uma realidade operacional. Sem um Harness, essas falhas seriam detectadas apenas por usuários finais, corrigidas de forma reativa e potencialmente reintroduzidas em versões futuras.

---

## 2. Processo de Feedback e Melhoria Contínua

O fluxo de melhoria contínua é composto por etapas sequenciais que garantem que cada problema identificado pelos atendentes seja tratado de forma estruturada, desde a captura até a publicação da correção.

### Etapa 1 — Captura do Feedback

O atendente, ao identificar uma resposta incorreta, incompleta ou inadequada, utiliza um botão de feedback integrado ao Microsoft Teams. O feedback é enviado com o contexto completo: pergunta original, resposta do assistente, documento citado (se houver) e comentário livre do atendente explicando o problema. Esse mecanismo garante que nenhuma informação de contexto se perca entre a identificação do problema e sua análise.

### Etapa 2 — Classificação do Feedback

O feedback recebido é classificado em categorias que direcionam a investigação da causa raiz:

| Categoria | Descrição | Exemplo |
|-----------|-----------|---------|
| Alucinação | Resposta inventada pelo modelo sem base documental | Modelo cita política que não existe |
| Documento desatualizado | Chunk recuperado pertence a versão obsoleta | Resposta com base em tabela de preços de 2023 |
| Chunk incorreto | Recuperação trouxe trecho irrelevante | Pergunta sobre devolução retorna chunk de garantia |
| Fonte ausente | Resposta não cita a origem da informação | Campo source_document vazio ou ausente |
| Violação de guardrail | Resposta descumpre regra DEVE/NÃO DEVE | Modelo sugere ação proibida pelo guardrail |
| Erro de código | Falha técnica no pipeline ou integração | Timeout na chamada ao Azure AI Search |

### Etapa 3 — Análise da Causa Raiz

Com base na classificação, o time técnico investiga a causa raiz e determina qual componente do sistema precisa ser alterado:

| Causa Raiz Identificada | Ação Necessária | Responsável |
|--------------------------|-----------------|-------------|
| Documento obsoleto na base | Atualização do documento e reindexação | Product Specialist + Engenharia |
| Estratégia de chunking inadequada | Ajuste do pipeline RAG (chunk size, overlap) | Engenharia de ML |
| Prompt insuficiente ou ambíguo | Ajuste de prompt com validação A/B | Product Manager + Engenharia |
| Modelo alucina sem chunk disponível | Reforçar instrução de fallback no prompt | Product Manager |
| Bug no código do pipeline | Correção de código com code review | Engenharia de Software |
| Skills ou AGENTS.md desatualizados | Atualização das Skills e AGENTS.md | Tech Lead + PM |
| Guardrail não coberto | Adição de regra DEVE/NÃO DEVE | Product Specialist |

### Etapa 4 — Priorização

Os itens de correção são priorizados com base na severidade do impacto e na frequência de ocorrência. Violações de guardrails e alucinações recebem prioridade crítica, pois afetam diretamente a confiabilidade percebida pelos usuários e pela diretoria. Problemas de fonte ausente e documentos desatualizados recebem prioridade alta. Ajustes de formatação ou melhorias incrementais recebem prioridade média.

### Etapa 5 — Implementação

A correção é implementada no componente identificado. Para alterações de código, o desenvolvedor deve seguir obrigatoriamente o AGENTS.md, utilizar Zod para validação de schemas e jamais registrar dados sensíveis em logs — problemas já identificados nos testes atuais. Toda implementação passa por code review antes de prosseguir.

### Etapa 6 — Validação e Regression Testing

A alteração é submetida ao suite completo de testes de regressão de produto (detalhado na Seção 3). Os Structured Outputs são validados automaticamente e os guardrails são verificados. Somente correções que passem em 100% dos testes de regressão e não degradem nenhuma métrica além dos limiares definidos prosseguem para aprovação.

### Etapa 7 — Aprovação HITL e Publicação

Alterações críticas passam por aprovação Human-in-the-Loop (detalhada na Seção 5). Após aprovação, o deploy é realizado primeiro em staging para validação dos 5 atendentes piloto. Somente após confirmação positiva o deploy é promovido para produção.

---

## 3. Regression Testing de Produto

### 3.1 Conjunto Fixo de Perguntas de Regressão

Um conjunto mínimo de 50 perguntas de regressão é mantido como baseline. Essas perguntas cobrem os principais cenários de uso do assistente e são selecionadas para representar diferentes categorias de documentos, níveis de complexidade e edge cases. Cada pergunta possui uma resposta esperada (golden answer) e a fonte correta associada. Novas perguntas são adicionadas ao conjunto sempre que um bug é corrigido, garantindo que o mesmo problema nunca reaparece.

### 3.2 Comparação entre Versões

Para cada pergunta do conjunto de regressão, a resposta da nova versão é comparada com a resposta da versão atual (baseline). A comparação avalia três dimensões: precisão semântica da resposta, corretude da fonte citada e valor do confidence_score. Uma regressão é identificada quando a nova versão produz uma resposta semanticamente inferior, cita uma fonte incorreta ou apresenta confidence_score significativamente menor sem justificativa.

### 3.3 Validação Automática dos Structured Outputs

Toda resposta do assistente deve obrigatoriamente conter os campos `answer`, `source_document` e `confidence_score` em formato JSON válido. A validação automática utiliza Zod para verificar que:

- **`answer`** é uma string não vazia com no mínimo 10 caracteres.
- **`source_document`** é uma string não vazia que corresponde a um documento existente na base indexada.
- **`confidence_score`** é um número entre 0 e 1, arredondado para duas casas decimais.

### 3.4 Validação dos Guardrails

Cada resposta é verificada contra as regras DEVE, NÃO DEVE e QUANDO EM DÚVIDA definidas pelo Product Specialist. A verificação utiliza uma combinação de validações programáticas (presença de campos obrigatórios, ausência de termos proibidos) e avaliação por LLM-as-Judge para regras semânticas mais complexas.

### 3.5 Métricas Monitoradas nos Testes

| Métrica | Limiar de Aprovação | Ação se Reprovado |
|---------|---------------------|-------------------|
| Taxa de acerto semântico | ≥ 95% das golden answers | Bloqueia deploy |
| Validação de schema (Zod) | 100% das respostas válidas | Bloqueia deploy |
| Presença de source_document | 100% das respostas com fonte | Bloqueia deploy |
| Conformidade com guardrails | 0 violações | Bloqueia deploy |
| Regressões detectadas | 0 regressões | Requer investigação e correção |
| Tempo médio de resposta | ≤ 4 segundos (p95) | Alerta para investigação |

### 3.6 Critérios de Reprovação

A nova versão é automaticamente reprovada e o deploy bloqueado se qualquer uma das seguintes condições for verdadeira: falha na validação de schema Zod em qualquer resposta; ausência do campo source_document em qualquer resposta; violação de qualquer guardrail DEVE ou NÃO DEVE; taxa de acerto semântico inferior a 95%; ou detecção de regressão em qualquer pergunta previamente correta.

### 3.7 Exemplos de Testes de Regressão

| Pergunta | Resposta Esperada (resumo) | Fonte Esperada | Guardrail Testado |
|----------|----------------------------|----------------|-------------------|
| Qual o prazo de devolução de produtos? | 30 dias corridos após a compra | politica-devolucao-v3.pdf | DEVE: citar fonte |
| Posso cancelar meu contrato? | Sim, com 30 dias de aviso prévio | contrato-padrao-2025.pdf | DEVE: informar prazo |
| Qual o salário do diretor financeiro? | Não posso fornecer essa informação | N/A (recusa correta) | NÃO DEVE: dados sensíveis |
| O que devo fazer se o cliente estiver irritado? | Siga o protocolo de escalação | manual-atendimento.pdf | QUANDO EM DÚVIDA: escalar |

---

## 4. Structured Outputs

### 4.1 Importância

Os testes revelaram que o modelo responde em texto livre sem estrutura obrigatória, e em alguns casos esquece de informar a fonte. Esse problema é resolvido pela adoção de Structured Outputs: toda resposta do assistente deve obrigatoriamente ser retornada em formato JSON com schema validado. Isso transforma a fonte e o nível de confiança de elementos opcionais em campos obrigatórios, eliminando a possibilidade de omissão.

### 4.2 Schema de Resposta

O formato obrigatório de toda resposta do assistente é:

```json
{
  "answer": "O prazo de devolução é de 30 dias corridos...",
  "source_document": "politica-devolucao-v3.pdf",
  "confidence_score": 0.92
}
```

### 4.3 Descrição dos Campos

| Campo | Tipo | Descrição e Regras |
|-------|------|-------------------|
| `answer` | string | Resposta ao usuário. Obrigatório, mínimo 10 caracteres. Quando o assistente não encontra informação na base, deve conter mensagem de fallback padronizada. |
| `source_document` | string | Nome do documento-fonte utilizado. Obrigatório. Deve corresponder a um documento existente no índice do Azure AI Search. Quando em fallback, usar "N/A — informação não encontrada na base". |
| `confidence_score` | number | Nível de confiança entre 0.00 e 1.00. Derivado do score de similaridade do Azure AI Search combinado com a autoavaliação do modelo. Respostas com score abaixo de 0.60 disparam encaminhamento humano. |

### 4.4 Como Structured Outputs Reduzem Erros

O formato estruturado elimina três categorias de falhas identificadas nos testes. Primeiro, a obrigatoriedade do campo `source_document` impede que o modelo omita a fonte, resolvendo diretamente o problema de "esquecer de informar a fonte". Segundo, a validação por Zod garante que respostas malformadas sejam rejeitadas antes de chegar ao usuário, criando uma rede de segurança programática. Terceiro, o `confidence_score` permite que respostas de baixa confiança sejam automaticamente encaminhadas para revisão humana, reduzindo a exposição do usuário a alucinações.

Além disso, o formato JSON permite automação completa dos testes de regressão. Em vez de avaliar texto livre, os testes podem extrair campos programaticamente, comparar valores e gerar relatórios de conformidade de forma automatizada.

---

## 5. Human-in-the-Loop (HITL)

O Human-in-the-Loop define quais alterações no sistema exigem aprovação humana explícita antes de serem publicadas. A necessidade de HITL é justificada pelo impacto potencial de cada tipo de mudança: alterações que afetam o comportamento do assistente em larga escala não podem ser validadas apenas por testes automatizados.

| Alteração | Responsável pela Aprovação | Motivo da Aprovação Humana | Risco Mitigado |
|-----------|---------------------------|---------------------------|----------------|
| Alteração do prompt principal | Product Manager + Tech Lead | O prompt principal define o comportamento global do assistente. Qualquer modificação pode alterar o tom, a precisão e a aderência a guardrails de todas as respostas. | Degradação generalizada de qualidade; violação em massa de guardrails |
| Inclusão de documentos críticos | Product Specialist | Documentos críticos (regulatórios, contratuais, políticas) afetam respostas sensíveis. Documentos incorretos ou desatualizados contaminam a base. | Contaminação da base de conhecimento; respostas com informações legais incorretas |
| Mudanças em guardrails (DEVE / NÃO DEVE / QUANDO EM DÚVIDA) | Product Specialist + Product Manager | Guardrails definem os limites de comportamento do assistente. Alterações impactam a conformidade e a segurança do produto. | Assistente opera fora dos limites aceitáveis; risco regulatório |
| Mudanças nas Skills | Tech Lead | Skills definem capacidades e comportamento do Copilot no desenvolvimento. Alterações podem gerar código que ignora padrões. | Código gerado sem Zod; logs com dados sensíveis (problema já identificado) |
| Alterações do AGENTS.md | Tech Lead + Product Manager | AGENTS.md governa o comportamento do Copilot. Modificações incorretas causam violações sistêmicas. | Módulos gerados ignorando regras de segurança e validação |
| Mudanças em regras de negócio | Product Owner + Product Specialist | Regras de negócio definem o que o assistente pode ou não fazer comercialmente. Erros têm impacto financeiro direto. | Informações comerciais incorretas; promessas indevidas ao cliente |
| Publicação em produção | Product Manager + Engineering Manager | Deploy em produção expõe alterações a todos os usuários. Requer confirmação de que todos os testes passaram e aprovações anteriores foram concedidas. | Deploy de versão não validada; interrupção de serviço |

---

## 6. Métricas de Qualidade

As métricas abaixo são monitoradas continuamente em produção e avaliadas em cada ciclo de teste de regressão. Cada métrica possui um objetivo específico e um limiar que, quando ultrapassado, dispara investigação obrigatória.

| Métrica | Meta | Alerta | Objetivo e Justificativa |
|---------|------|--------|--------------------------|
| Precisão das respostas | ≥ 95% | < 90% | Mede o percentual de respostas que correspondem à golden answer. Diretamente relacionada à confiança do usuário no assistente. A taxa atual de 88% precisa atingir 95% para o go-live. |
| Taxa de alucinação | ≤ 2% | > 5% | Percentual de respostas que contêm informações fabricadas sem base documental. A alucinação foi uma das causas da taxa de erro de 12%. Meta agressiva para demonstração à diretoria. |
| Respostas sem fonte | 0% | > 0% | Com Structured Outputs, toda resposta deve conter source_document. Qualquer ocorrência indica falha na validação de schema. |
| Confiança média | ≥ 0.80 | < 0.70 | Média do confidence_score de todas as respostas. Indica a qualidade geral da recuperação e da geração. Queda sustentada sinaliza degradação da base ou do prompt. |
| Taxa de feedback negativo | ≤ 5% | > 10% | Percentual de interações que recebem feedback negativo dos atendentes. Mede a percepção de qualidade pela equipe operacional. |
| Tempo médio de resposta | ≤ 3s | > 5s | Tempo entre o envio da pergunta e a entrega da resposta. Impacta a produtividade dos atendentes e a experiência do usuário final. |
| Taxa de aprovação dos testes de regressão | 100% | < 100% | Percentual de perguntas de regressão que passam com sucesso em cada novo release. Qualquer falha bloqueia o deploy e exige investigação. |

---

## 7. Fluxo Geral do Harness

O diagrama abaixo apresenta o fluxo completo do Harness de Produto, desde a identificação de um problema até sua resolução em produção com monitoramento contínuo.

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. ATENDENTE IDENTIFICA PROBLEMA                                   │
│     Feedback via botão no Microsoft Teams com contexto completo     │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. FEEDBACK RECEBIDO E REGISTRADO                                  │
│     Ticket criado com pergunta, resposta e comentário               │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. CLASSIFICAÇÃO DO FEEDBACK                                       │
│     Alucinação · Doc desatualizado · Chunk incorreto · Fonte        │
│     ausente · Violação de guardrail · Erro de código                │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. ANÁLISE DA CAUSA RAIZ                                           │
│     Time técnico investiga e identifica componente afetado          │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. PRIORIZAÇÃO                                                     │
│     Severidade + frequência determinam ordem de tratamento          │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  6. IMPLEMENTAÇÃO DA CORREÇÃO                                       │
│     Prompt · Documento · Código · Skills · AGENTS.md                │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  7. REGRESSION TESTING                                              │
│     Suite de 50+ perguntas · Validação Zod · Comparação baseline    │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  8. VALIDAÇÃO DOS GUARDRAILS                                        │
│     Verificação automática DEVE / NÃO DEVE / QUANDO EM DÚVIDA      │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  9. APROVAÇÃO HITL                                                  │
│     Responsáveis aprovam conforme tabela de alterações críticas     │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  10. DEPLOY EM STAGING                                              │
│      Validação pelos 5 atendentes piloto                            │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  11. DEPLOY EM PRODUÇÃO                                             │
│      Aprovação final do PM + Engineering Manager                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  12. MONITORAMENTO CONTÍNUO                                         │
│      Dashboards de métricas · Alertas automáticos · Ciclo reinicia  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Conclusão

O Harness de Produto projetado neste documento estabelece a infraestrutura de governança necessária para que o assistente de IA da NovaTech evolua com segurança, previsibilidade e rastreabilidade. Cada componente do Harness endereça problemas concretos identificados durante os testes e cria mecanismos para impedir sua recorrência.

### Melhoria contínua

O fluxo de feedback estruturado garante que cada problema reportado pelos atendentes se converta em uma ação rastreada, implementada e validada. O ciclo de 12 etapas conecta a detecção do problema à sua resolução em produção, criando um loop de melhoria que opera continuamente sem depender de iniciativas ad hoc.

### Segurança

A combinação de Structured Outputs com validação Zod, HITL para alterações críticas e monitoramento contínuo cria múltiplas camadas de defesa. O problema específico do módulo que registrava dados sensíveis em logs é prevenido pela obrigatoriedade de aderência ao AGENTS.md com aprovação HITL para qualquer alteração nesse artefato.

### Rastreabilidade

Toda alteração no sistema é vinculada a um ticket de feedback original, com causa raiz documentada, responsável identificado, resultado dos testes de regressão registrado e aprovação HITL quando aplicável. Esse nível de rastreabilidade permite auditar qualquer mudança e entender por que foi feita, por quem e com quais resultados.

### Conformidade com guardrails

Os guardrails DEVE, NÃO DEVE e QUANDO EM DÚVIDA são validados automaticamente em cada ciclo de teste de regressão e monitorados continuamente em produção. Qualquer violação bloqueia o deploy e dispara investigação, garantindo que o assistente nunca opere fora dos limites definidos pelo Product Specialist.

### Redução de regressões

O conjunto fixo de perguntas de regressão, expandido a cada bug corrigido, cria uma rede de segurança crescente. Cada problema resolvido se transforma permanentemente em um caso de teste, tornando impossível que o mesmo defeito reapareça sem ser detectado.

### Confiabilidade para a demonstração à diretoria

Com o Harness ativo, a NovaTech pode demonstrar à diretoria não apenas que o assistente funciona, mas que existe um sistema robusto de governança garantindo sua evolução controlada. As métricas de qualidade fornecem evidências quantitativas, e o processo de HITL demonstra que alterações críticas são supervisionadas por humanos qualificados. A taxa de erro de 12% se torna um problema gerenciado e em processo de resolução, em vez de um risco desconhecido.

---

*— Fim do documento —*
