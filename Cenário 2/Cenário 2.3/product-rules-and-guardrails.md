## Product Rules & Guardrails

> **Responsável:** Product Specialist  
> **Última atualização:** Junho/2026  
> **Documentos-fonte:** POL-001 v3.1, PROC-042 v1.0, PROC-042-v2 v2.0, SLA-2024 v2024.1, FAQ-Atendimento, Spec v2.0, Bounded Contexts v1.0  
> **Escopo:** Regras de produto que governam o comportamento do assistente NovaTech e devem ser respeitadas por humanos e agentes de IA (Copilot, Claude Code, Claude, etc.).

---

### 1. Assistant Behavior Rules

As regras abaixo utilizam os verbos modais **MUST**, **MUST NOT** e **WHEN IN DOUBT** como diretivas machine-readable. Cada regra referencia o guardrail formalizado correspondente (GRD/GRP/GRF) e o tipo de enforcement esperado.

#### 1.1 MUST (Obrigatório)

```
RULE MUST-01 [GRD-01] [enforcement: code]
  O assistente MUST citar fonte documental em toda resposta.
  Formato obrigatório: [DOC-XXX vN, seção Y].
  Se a resposta contiver mais de uma afirmação factual, cada uma MUST ter sua própria citação.
  O campo `source_document` no JSON de retorno MUST estar presente mesmo quando o nível de confiança for "Baixo" ou "Não aplicável".
```

```
RULE MUST-02 [GRD-02, GRD-05] [enforcement: code]
  O assistente MUST utilizar exclusivamente a versão vigente de cada documento.
  Para PROC-042, a versão vigente é a v2 (emissão 10/11/2023) para todos os chamados abertos a partir de 01/12/2023.
  Multiplicadores regionais vigentes: Sul=1.3, Sudeste=1.1, Centro-Oeste=1.4, Nordeste=1.5, Norte=1.8.
  Fatores de peso vigentes: 500–1000kg=1.0, 1001–3000kg=1.15, acima de 3000kg=1.4.
  Prazo adicional vigente: +3 dias úteis sobre prazo padrão da rota.
  Esses valores MUST ser mantidos em tabela estruturada, nunca embutidos no corpo do prompt.
```

```
RULE MUST-03 [GRD-03] [enforcement: prompt]
  O assistente MUST responder exclusivamente em português formal (norma culta).
  Sem gírias, abreviações informais ou anglicismos desnecessários.
```

```
RULE MUST-04 [GRD-04] [enforcement: code]
  Ao informar SLAs, o assistente MUST incluir o tier do cliente (Gold, Silver ou Standard) e a métrica exata conforme SLA-2024.
  Se o tier não puder ser identificado, o assistente MUST solicitar o número do contrato antes de informar qualquer SLA (ver WHEN-IN-DOUBT-04).
```

```
RULE MUST-05 [GRD-06] [enforcement: code]
  O assistente MUST reconhecer exclusivamente três tiers de clientes: Gold, Silver e Standard.
  Allowlist validada na camada de output: ['Gold', 'Silver', 'Standard'].
  Nenhum outro tier existe na NovaTech.
```

```
RULE MUST-06 [GRD-07] [enforcement: prompt]
  Ao responder sobre devoluções, o assistente MUST seguir o procedimento completo da POL-001 seção 3.3:
    1. Abertura de chamado no Portal do Cliente.
    2. Documentação: número do CT-e, mínimo 3 fotos (embalagem, etiqueta, conteúdo), motivo.
    3. Triagem pelo atendimento em até 4 horas úteis.
    4. Coleta reversa em até 2 dias úteis após aprovação.
    5. Reembolso/crédito em até 5 dias úteis após recebimento no CD.
  A seleção dos passos aplicáveis depende do contexto da pergunta.
```

```
RULE MUST-07 [GRD-08] [enforcement: code]
  O assistente MUST classificar incidentes como "críticos" quando pelo menos um critério da SLA-2024 seção 3 for atendido:
    - Carga com valor declarado > R$ 100.000 com status desconhecido por > 6 horas.
    - Carga perigosa com qualquer irregularidade documental ou de rastreamento.
    - Mais de 5 chamados do mesmo cliente em 24 horas sobre o mesmo problema.
    - Qualquer situação envolvendo risco à segurança de pessoas.
```

```
RULE MUST-08 [GRD-09] [enforcement: prompt]
  Ao responder sobre custos de devolução, o assistente MUST diferenciar conforme POL-001 seção 3.5:
    - Erro da NovaTech (carga errada, avaria em trânsito) → sem custo para o cliente.
    - Desistência do cliente (carga correta, sem defeito) → custo do frete reverso é do cliente.
    - Prazo expirado (>7 dias úteis) → não elegível para devolução padrão; encaminhar ao Comercial.
  O assistente MUST perguntar o motivo antes de informar custos quando o motivo não estiver claro.
```

```
RULE MUST-09 [GRD-10] [enforcement: code]
  O assistente MUST priorizar documentos normativos (POL, PROC, SLA) sobre o FAQ de atendimento.
  No pipeline de RAG, documentos normativos recebem boost de relevância; FAQ recebe penalização.
  Em caso de divergência entre FAQ e documentação formal, a documentação formal prevalece.
```

#### 1.2 MUST NOT (Proibido)

```
RULE MUST-NOT-01 [GRP-01, GRP-07] [enforcement: code]
  O assistente MUST NOT afirmar que cargas perigosas (classes 1–6 ANTT), cargas refrigeradas com cadeia de frio rompida ou cargas com lacre de segurança violado (sem documentação no ato de entrega) são elegíveis para devolução pelo processo padrão.
  Blocklist de categorias inelegíveis verificada por código antes de compor qualquer resposta sobre devolução.
  Referência: POL-001 seção 3.2.
```

```
RULE MUST-NOT-02 [GRP-02] [enforcement: code]
  O assistente MUST NOT gerar, estimar, interpolar ou inventar valores numéricos (prazos em dias, multiplicadores, fatores de peso, percentuais de SLA, valores em reais) que não estejam explicitamente presentes nos documentos indexados.
  Toda informação numérica na resposta MUST ter correspondência exata com pelo menos um chunk recuperado.
```

```
RULE MUST-NOT-03 [GRP-03] [enforcement: code]
  O assistente MUST NOT utilizar multiplicadores, fatores de peso ou prazos da PROC-042 v1 para chamados abertos a partir de 01/12/2023.
  Chunks provenientes de PROC-042 v1 MUST ser excluídos pelo filtro temporal de metadados no pipeline de RAG quando a data do chamado for posterior a 01/12/2023.
```

```
RULE MUST-NOT-04 [GRP-04] [enforcement: code]
  O assistente MUST NOT confirmar a existência de tiers de clientes que não sejam Gold, Silver ou Standard.
  Termos como "Platinum", "Premium", "Diamond", "Bronze" ou quaisquer outros MUST acionar correção na camada de output: informar que os tiers válidos são Gold, Silver e Standard e solicitar número do contrato.
```

```
RULE MUST-NOT-05 [GRP-05] [enforcement: prompt]
  O assistente MUST NOT apresentar informações sobre seguro de carga, frete de carga perigosa (PROC-043) ou tratamento de carga danificada como políticas oficiais.
  Esses temas não possuem documentação normativa indexada. Se mencionados, qualificar como "informação informal do time de atendimento — consulte o setor responsável para confirmação oficial".
```

```
RULE MUST-NOT-06 [GRP-06] [enforcement: prompt]
  O assistente MUST NOT responder sobre procedimentos fora do escopo da base de conhecimento indexada.
  Escopo atual coberto: devoluções (POL-001), frete especial (PROC-042), SLAs por tier (SLA-2024), FAQ (como fonte informal qualificada).
  Temas fora do escopo incluem: interceptação de carga em trânsito (PROC-088), seguro de carga detalhado, frete padrão abaixo de 500kg, frete expresso para cargas perigosas.
```

```
RULE MUST-NOT-07 [GRP-08] [enforcement: prompt]
  O assistente MUST NOT apresentar informações extraídas do FAQ-Atendimento sem qualificá-las como fonte informal e não validada por Compliance.
  Toda citação do FAQ MUST incluir a ressalva: "Fonte: FAQ de Atendimento (documento informal, não validado por Compliance)".
```

#### 1.3 WHEN IN DOUBT (Fallback)

```
RULE WHEN-IN-DOUBT-01 [GRF-01] [enforcement: code]
  Quando nenhum chunk recuperado atingir o threshold de relevância, o assistente MUST:
    1. Prefixar a resposta com aviso de baixa confiança.
    2. Responder: "Não localizei essa informação na documentação vigente da NovaTech. Recomendo entrar em contato com [setor responsável] para orientação."
    3. Definir nível de confiança como "Não aplicável".
  O threshold é parâmetro calibrável no pipeline — não pode ser delegado ao modelo.
```

```
RULE WHEN-IN-DOUBT-02 [GRF-02] [enforcement: code]
  Quando a pergunta envolver carga perigosa em qualquer contexto (devolução, frete, prazo, armazenamento), o assistente MUST:
    1. NÃO fornecer orientação processual padrão.
    2. Encaminhar ao setor de Gestão de Riscos (ramal 4500).
    3. Informar: "Cargas perigosas (classes 1 a 6 ANTT) possuem tratamento específico fora do processo padrão. Por favor, entre em contato com o setor de Gestão de Riscos pelo ramal 4500."
```

```
RULE WHEN-IN-DOUBT-03 [GRF-03] [enforcement: code]
  Quando houver conflito entre versões de um mesmo documento nos chunks recuperados, o assistente MUST:
    1. Utilizar a versão com data de emissão mais recente.
    2. Informar ao usuário que existe versão anterior com valores distintos.
    3. Citar ambas as versões na resposta com indicação clara de qual está vigente.
```

```
RULE WHEN-IN-DOUBT-04 [GRF-04] [enforcement: code]
  Quando o tier do cliente não puder ser identificado (não informado, ausente no CRM), o assistente MUST:
    1. NÃO informar SLAs genéricos.
    2. Solicitar o número do contrato antes de prosseguir.
    3. Bloquear emissão de métricas de SLA até identificação do tier.
```

```
RULE WHEN-IN-DOUBT-05 [GRF-05] [enforcement: prompt]
  Quando a pergunta envolver tema coberto exclusivamente pelo FAQ (seguro de carga, carga danificada, frete expresso para perigosa), o assistente MUST:
    1. Qualificar a informação como informal e não validada.
    2. Recomendar confirmação com o setor responsável.
    3. Definir nível de confiança como "Baixo".
```

```
RULE WHEN-IN-DOUBT-06 [GRF-06] [enforcement: prompt]
  Quando o cliente mencionar devolução com prazo expirado (>7 dias úteis após recebimento), o assistente MUST:
    1. NÃO negar sumariamente.
    2. Informar que o prazo padrão expirou conforme POL-001 seção 3.1.
    3. Orientar que o caso pode ser encaminhado ao setor Comercial para negociação individual conforme POL-001 seção 3.5.
```

---

### 2. Domain Glossary

Os termos abaixo compõem a linguagem ubíqua do projeto NovaTech. Devem ser usados de forma consistente em specs, código, prompts e comunicação do time. A coluna "Observações para agentes de IA" explicita riscos de interpretação incorreta por LLMs.

#### 2.1 Termos de Negócio — Logística e Atendimento

| Termo | Definição | Observações para agentes de IA |
|-------|-----------|-------------------------------|
| **Carga perigosa** | Mercadoria classificada nas classes 1 a 6 conforme regulamentação ANTT (Resolução nº 5.947/2021). Inclui: explosivos (classe 1), gases (classe 2), líquidos inflamáveis (classe 3), sólidos inflamáveis (classe 4), oxidantes e peróxidos (classe 5), substâncias tóxicas e infectantes (classe 6). | NÃO confundir com "carga frágil", "carga pesada" ou "carga de risco genérico". O termo é regulatório e binário — ou a carga está classificada em uma das 6 classes ou não é carga perigosa. Aciona blocklist de devolução e encaminhamento obrigatório à Gestão de Riscos (ramal 4500). |
| **Frete especial** | Frete aplicável a cargas com peso acima de 500 kg. Sujeito a multiplicadores regionais e fatores de peso conforme PROC-042-v2. | NÃO interpretar como "frete expresso", "frete prioritário" ou "frete premium". O critério é exclusivamente peso (>500 kg). |
| **Frete padrão** | Frete para cargas até 500 kg dentro das dimensões regulares, sem exigência de procedimento especial. | Termo de contraste com "frete especial". Não possui documento normativo próprio na base indexada atual. Perguntas sobre frete padrão acionam MUST-NOT-06 (fora do escopo). |
| **Multiplicador regional** | Fator numérico aplicado ao valor base do frete conforme a região de destino. Valores vigentes (PROC-042-v2): Sul=1.3, Sudeste=1.1, Centro-Oeste=1.4, Nordeste=1.5, Norte=1.8. | Valores diferem entre PROC-042 v1 e v2. Agente MUST usar exclusivamente valores da v2 para chamados pós-01/12/2023. Nunca gerar multiplicadores por interpolação ou estimativa. |
| **Fator de peso** | Fator aplicado ao cálculo de frete especial conforme faixa de peso. Valores vigentes (PROC-042-v2): 500–1000 kg=1.0, 1001–3000 kg=1.15, acima de 3000 kg=1.4. | Valores diferem entre v1 (1.0/1.2/1.5) e v2 (1.0/1.15/1.4). Mesma regra de versionamento do multiplicador regional. |
| **Tier de cliente** | Classificação do cliente por nível de serviço. Existem exatamente três tiers: **Gold**, **Silver** e **Standard**. Definidos em SLA-2024 seção 1. | "Platinum", "Premium", "Diamond", "Bronze" NÃO existem. Se o usuário mencionar tier inexistente, corrigir e solicitar número do contrato. O tier "Gold" se refere ao nível de serviço contratual, não ao metal. |
| **SLA de atendimento** | Prazo máximo de resposta e resolução ao cliente conforme tier e tipo de demanda, medido em horas úteis. Definido em SLA-2024 seção 2. | NÃO confundir com "SLA de triagem" (prazo interno de 2 dias úteis para a Área de Qualidade triar conflitos — Spec v2.0 §3.3). São métricas distintas com donos distintos. |
| **Incidente crítico** | Incidente que atende ao menos 1 dos 4 critérios da SLA-2024 seção 3: valor declarado >R$100k sem status por >6h; carga perigosa com irregularidade; >5 chamados em 24h sobre o mesmo problema; risco à segurança de pessoas. | Prazos de SLA para incidentes críticos são significativamente menores que chamados gerais. Para clientes Gold, o relógio de SLA não pausa fora do horário comercial. |
| **Prazo de devolução** | 7 dias úteis após data de recebimento confirmada no sistema de tracking. A contagem exclui sábados, domingos e feriados nacionais. Definido em POL-001 seção 3.1. | Agente deve calcular em dias ÚTEIS, não corridos. Após expiração, encaminhar ao Comercial (não negar sumariamente). |
| **CT-e** | Conhecimento de Transporte Eletrônico. Documento fiscal obrigatório que identifica a operação de transporte. Requerido para abertura de chamado de devolução. | O número do CT-e é o identificador primário da operação de transporte para fins de devolução. |
| **Cadeia de frio** | Manutenção contínua da temperatura dentro da faixa especificada na nota fiscal durante todo o transporte. Ruptura = temperatura fora da faixa por >30 minutos contínuos conforme sensor IoT. | Carga refrigerada com cadeia de frio rompida é INELEGÍVEL para devolução padrão (POL-001 seção 3.2). |

#### 2.2 Termos de Produto — Comportamento do Assistente

| Termo | Definição | Observações para agentes de IA |
|-------|-----------|-------------------------------|
| **Documento formal** | Documento com código, versão, data de vigência, área proprietária e aprovação registrada. Tipos válidos: POL, PROC, SLA, comunicado formal. | Distingue de FAQ informal, e-mails ou conhecimento tácito. Apenas documentos formais são fontes válidas para respostas com confiança Alta. |
| **Documento vigente** | Documento formal com status "vigente" no sistema de gestão documental, com aprovação ativa. | Agente MUST NOT tratar rascunho, documento obsoleto ou documento em fase de aprovação como fonte válida. |
| **Documento em transição** | Documento sendo substituído por nova versão, mas ainda válido com escopo temporal ou funcional explícito. As duas versões coexistem. Exemplo: PROC-042 v1 válida para chamados pré-01/12/2023, v2 para pós-01/12/2023. | Agente MUST declarar a condição de transição. Não tratar como obsoleto (ignorar) nem como plenamente vigente (sem ressalva). |
| **Documento obsoleto** | Documento revogado ou substituído, movido para arquivo histórico. Não elegível para recuperação pelo assistente. | O pipeline MUST marcar com `superseded=true` no índice. Agente MUST NOT citar documento obsoleto como fonte. |
| **Lacuna documental** | Tema sobre o qual não existe cobertura na base de documentos formais vigentes. | Diferente de "caso limítrofe" (cobertura parcial). Agente MUST declarar a lacuna explicitamente e acionar fallback — NUNCA improvisar ou inferir. |
| **Caso limítrofe** | Consulta parcialmente coberta pela base, onde a informação disponível não é suficiente para resposta completa com alta confiança. | Agente deve fornecer a informação parcial disponível com nível de confiança "Médio" ou "Baixo" e indicar o que está faltando. |
| **Contradição documental** | Dois ou mais documentos vigentes divergem sobre o mesmo tema. É um estado legítimo da base, não um bug. | Agente MUST apresentar ambas as versões sem hierarquizar. A resolução pertence ao contexto de Qualidade e Feedback, não ao assistente. |
| **Nível de confiança** | Classificação obrigatória: **Alto** (cobertura completa, fonte única e clara), **Médio** (múltiplas fontes parciais ou condição de transição), **Baixo** (cobertura mínima ou ambígua), **Não aplicável** (lacuna total ou entidade inexistente). | Escala fixa de 4 valores. Agente MUST NOT usar termos alternativos ou escalas numéricas. |
| **Feedback estruturado** | Registro de problema com campos obrigatórios: tipo do problema, pergunta original, resposta recebida, resposta esperada, ID do chamado, documento de referência. | Se o formato for livre, a triagem não funciona. Agente MUST respeitar os campos obrigatórios ao registrar feedback. |
| **Pré-indexação** | Processo obrigatório de 4 etapas antes de incluir documento na base: validação formal, verificação de conflito, marcação de escopo, arquivamento da versão anterior. | Agente não executa pré-indexação, mas MUST saber que ela existe para não tratar documentos recém-adicionados sem validação como fontes confiáveis. |

#### 2.3 Termos de Governança

| Termo | Definição | Observações para agentes de IA |
|-------|-----------|-------------------------------|
| **SLA de triagem** | Prazo de 2 dias úteis para a Área de Qualidade triar conflitos detectados pelo assistente. Escalada automática ao Gerente de Qualidade se excedido. | Distinto do SLA de atendimento ao cliente. Confusão entre os dois gera expectativas incorretas. |
| **Ciclo de revisão** | Revisão periódica da base de conhecimento a cada 90 dias. | Agente não executa, mas deve saber que a base tem cadência de atualização definida — informação pode ter até 90 dias de defasagem. |
| **Chamado** | Unidade de rastreabilidade do atendimento. Toda consulta ao assistente está vinculada a um chamado com ID único. | Sem vínculo ao chamado, a rastreabilidade e o registro de trechos utilizados não funcionam. |

---

### 3. Code Generation Constraints

As restrições abaixo MUST ser aplicadas por qualquer agente de geração de código (Copilot, Claude Code, Claude, etc.) ao produzir código para o projeto NovaTech Assistant.

#### 3.1 Estrutura obrigatória da resposta JSON

Todo endpoint de resposta do assistente MUST retornar um objeto JSON com a seguinte estrutura mínima. Campos marcados como `required` nunca podem ser omitidos, mesmo quando vazios ou com confiança baixa.

```typescript
interface AssistantResponse {
  // REQUIRED — Texto da resposta ao atendente
  answer: string;

  // REQUIRED — Nível de confiança: "high" | "medium" | "low" | "not_applicable"
  confidence_level: "high" | "medium" | "low" | "not_applicable";

  // REQUIRED — Fontes documentais citadas (ao menos 1 para confidence != "not_applicable")
  sources: Array<{
    document_id: string;    // Ex: "POL-001", "PROC-042-v2", "SLA-2024"
    version: string;        // Ex: "3.1", "2.0", "2024.1"
    section: string;        // Ex: "3.2", "2.1"
    document_type: "POL" | "PROC" | "SLA" | "FAQ" | "OTHER";
    is_informal: boolean;   // true para FAQ e fontes não validadas
  }>;

  // REQUIRED — Trechos literais dos chunks utilizados
  source_excerpts: string[];

  // REQUIRED — Orientação de uso baseada no nível de confiança
  usage_guidance: string;

  // REQUIRED — Identificador do documento-fonte principal
  source_document: string;

  // OPTIONAL — Aviso de baixa confiança (obrigatório quando confidence_level != "high")
  low_confidence_warning?: string;

  // OPTIONAL — Informação sobre conflito entre versões
  version_conflict?: {
    current_version: string;
    previous_version: string;
    difference_summary: string;
  };

  // OPTIONAL — Tier do cliente (obrigatório quando a resposta envolve SLAs)
  client_tier?: "Gold" | "Silver" | "Standard";

  // REQUIRED — Metadados de rastreabilidade
  traceability: {
    ticket_id: string;       // ID do chamado vinculado
    chunks_used: string[];   // IDs dos chunks recuperados
    retrieval_score: number; // Score máximo de relevância
    timestamp: string;       // ISO 8601
  };
}
```

#### 3.2 Regras de validação obrigatórias

Agentes de código MUST implementar as seguintes validações na camada de output (middleware `response-validator.ts`):

```
VALIDATION-01: sources.length >= 1 WHEN confidence_level != "not_applicable"
  Toda resposta com confiança diferente de "não aplicável" deve citar ao menos uma fonte.

VALIDATION-02: source_document IS NOT EMPTY
  O campo source_document nunca pode ser vazio ou nulo.

VALIDATION-03: client_tier IN ['Gold', 'Silver', 'Standard'] WHEN response mentions SLA
  Se a resposta contiver métricas de SLA, o tier do cliente deve estar presente e ser válido.

VALIDATION-04: confidence_level IN ['high', 'medium', 'low', 'not_applicable']
  Escala fixa de 4 valores. Rejeitar qualquer outro valor.

VALIDATION-05: EVERY numeric_value IN answer HAS match IN source_excerpts
  Todo valor numérico (prazos, multiplicadores, percentuais, valores monetários) presente no campo answer deve ter correspondência em pelo menos um trecho de source_excerpts.

VALIDATION-06: NOT (answer CONTAINS return_eligibility AND cargo_category IN blocklist)
  Blocklist: ['carga perigosa classes 1-6', 'carga refrigerada cadeia de frio rompida', 'carga com lacre violado sem documentação'].
  Resposta MUST NOT afirmar elegibilidade de devolução para categorias bloqueadas.

VALIDATION-07: WHEN source.document_type == "FAQ" THEN source.is_informal == true
  Fontes do tipo FAQ devem sempre ser marcadas como informais.

VALIDATION-08: low_confidence_warning IS NOT EMPTY WHEN confidence_level IN ['medium', 'low', 'not_applicable']
  Respostas com confiança inferior a "high" devem conter aviso explícito.
```

#### 3.3 Regras de versionamento de documentos no pipeline de RAG

```
VERSION-01: Cada chunk indexado MUST conter metadados:
  { document_id, version, emission_date, status: "active" | "superseded" | "in_transition", transition_cutoff_date? }

VERSION-02: O retriever MUST aplicar filtro de metadados:
  WHEN ticket_date >= transition_cutoff_date THEN EXCLUDE chunks WHERE status == "superseded"
  WHEN ticket_date < transition_cutoff_date THEN INCLUDE chunks WHERE status == "in_transition"

VERSION-03: Documentos sem indicação formal de vigência MUST receber flag requires_review: true.

VERSION-04: PROC-042 v1.0 MUST ter status "superseded" com transition_cutoff_date = "2023-12-01".

VERSION-05: FAQ-Atendimento MUST ter metadado source_reliability: "informal" em todos os chunks.
```

#### 3.4 Regras para o pipeline de RAG (retriever + reranker)

```
RAG-01: Documentos normativos (POL, PROC, SLA) recebem boost de relevância sobre FAQ.
  Implementar via configuração do retriever, não via prompt.

RAG-02: O threshold de relevância mínima MUST ser calibrável via configuração (não hardcoded).
  Valor padrão deve ser definido via avaliação quantitativa com golden queries (ver /prompts/eval/golden-queries.json).

RAG-03: Quando chunks de versões diferentes do mesmo documento forem recuperados, o sistema MUST:
  a) Aplicar precedência temporal (versão mais recente prevalece).
  b) Emitir campo version_conflict na resposta.
  c) Registrar o conflito para triagem pela Área de Qualidade.

RAG-04: Detecção de entidade "carga perigosa" no input MUST acionar classificação no pré-processamento,
  antes do retrieval, forçando encaminhamento à Gestão de Riscos.
```

#### 3.5 Regras de cálculo de frete especial

```
FREIGHT-01: A função de cálculo de frete especial MUST ser determinística e receber como parâmetros:
  região: "Sul" | "Sudeste" | "Centro-Oeste" | "Nordeste" | "Norte"
  peso_kg: number (>500)
  versao_proc: "v1" | "v2"

FREIGHT-02: Os multiplicadores e fatores MUST ser lidos de tabela estruturada (config ou banco),
  nunca embutidos no prompt ou hardcoded na função.

FREIGHT-03: Para chamados com data >= 2023-12-01, versao_proc MUST ser "v2".
  A função MUST rejeitar versao_proc="v1" para chamados nessa faixa.

FREIGHT-04: Cargas > 5000 kg MUST retornar flag requires_manager_approval: true.
```

---

### 4. Repository References

As referências abaixo conectam esta seção de guardrails aos artefatos do repositório onde as regras são implementadas, detalhadas ou verificadas.

#### 4.1 Specs (Requirements, Plans, Tasks)

| Módulo | Caminho | Relação com guardrails |
|--------|---------|----------------------|
| Pipeline de Ingestão | `specs/pipeline-ingestao/requirements.md` | Implementa VERSION-01 a VERSION-05, RAG-01 a RAG-04. Define como documentos são indexados com metadados de versão e status. |
| Query Endpoint | `specs/query-endpoint/requirements.md` | Implementa a estrutura obrigatória de resposta JSON (seção 3.1), validações VALIDATION-01 a VALIDATION-08 e cálculos FREIGHT-01 a FREIGHT-04. |
| Feedback API | `specs/feedback-api/requirements.md` | Implementa registro de feedback estruturado, conflitos detectados e rastreabilidade (campo `traceability` da resposta). |
| Teams Bot | `specs/teams-bot/requirements.md` | Aplica MUST-03 (português formal), MUST-06 (procedimento completo) e MUST-NOT-05/07 (qualificação de fontes informais) na camada de apresentação. |
| Painel Web | `specs/painel-web/requirements.md` | Apresenta nível de confiança, fontes e orientação de uso ao atendente conforme estrutura obrigatória de resposta. |

#### 4.2 Architecture Decision Records

| ADR | Caminho | Relação com guardrails |
|-----|---------|----------------------|
| Template ADR | `docs/adr/template.md` | Base para novos ADRs. Formato: Contexto, Decisão, Consequências, Alternativas. |
| ADR-0001 (a criar) | `docs/adr/0001-escolha-azure-openai.md` | Decisão sobre modelo de LLM — impacta viabilidade de enforcement por prompt (GRD-03, GRD-07, GRD-09). |
| ADR-0002 (a criar) | `docs/adr/0002-estrategia-versionamento-documentos.md` | Decisão sobre como implementar VERSION-01 a VERSION-05 e o filtro temporal de metadados. |
| ADR-0003 (a criar) | `docs/adr/0003-escala-confianca-resposta.md` | Decisão sobre a escala fixa de 4 níveis de confiança (Alto, Médio, Baixo, Não aplicável). |
| ADR-0004 (a criar) | `docs/adr/0004-tratamento-contradicoes-documentais.md` | Decisão sobre apresentação neutra de contradições sem hierarquização pelo assistente. |

#### 4.3 Código-fonte

| Arquivo | Caminho | Relação com guardrails |
|---------|---------|----------------------|
| Response Validator | `src/services/response-validator.ts` | Implementa VALIDATION-01 a VALIDATION-08 como middleware de validação de output (harness determinístico). |
| Prompt Builder | `src/services/prompt-builder.ts` | Injeta guardrails probabilísticos (MUST-03, MUST-06, MUST-08, MUST-NOT-05/06/07) no system prompt. |
| Search Service | `src/services/search.ts` | Implementa RAG-01 a RAG-04 (boost, threshold, filtro de versão, detecção de conflito). |
| Chunker | `src/pipeline/chunker.ts` | Garante que cada chunk carrega metadados de versão (VERSION-01). |
| Indexer | `src/pipeline/indexer.ts` | Aplica VERSION-04 (flag superseded para PROC-042 v1) e VERSION-05 (flag informal para FAQ). |
| Types | `src/shared/types.ts` | Define `AssistantResponse`, `ConfidenceLevel`, `ClientTier`, `DocumentType` como types TypeScript. |
| Config | `src/shared/config.ts` | Armazena multiplicadores, fatores de peso e thresholds como configuração estruturada (FREIGHT-02, RAG-02). |

#### 4.4 Documentação de domínio

| Documento | Caminho no repositório | Status |
|-----------|----------------------|--------|
| POL-001 — Política de Devolução | `docs/novatech/POL-001-politica-devolucao.md` | Vigente (v3.1, 15/01/2024) |
| PROC-042 v1 — Frete Especial | `docs/novatech/PROC-042-frete-especial-v1.md` | Superseded (v1.0, 03/03/2023) — válido apenas para chamados pré-01/12/2023 |
| PROC-042-v2 — Frete Especial Revisado | `docs/novatech/PROC-042-v2-frete-especial-revisado.md` | Vigente (v2.0, 10/11/2023) |
| SLA-2024 — Tabela de SLA | `docs/novatech/SLA-2024-tabela-sla-clientes.md` | Vigente (v2024.1, 02/01/2024) |
| FAQ-Atendimento | `docs/novatech/FAQ-atendimento.md` | Informal — sem controle de versão, sem validação por Compliance |

#### 4.5 Avaliação de prompts e golden queries

| Artefato | Caminho | Propósito |
|----------|---------|-----------|
| Golden Queries | `prompts/eval/golden-queries.json` | Perguntas de referência + respostas esperadas para calibrar threshold de retrieval (RAG-02) e validar guardrails. |
| Eval Results | `prompts/eval/eval-results/` | Resultados das rodadas de avaliação — métricas de conformidade com guardrails. |
| System Prompt | `prompts/system-prompt.md` | Prompt principal com guardrails probabilísticos embutidos. |
| Prompt Changelog | `prompts/prompt-changelog.md` | Registro de toda mudança no prompt: data, autor, motivo, resultado esperado. |

#### 4.6 Skills relevantes

| Skill | Caminho | Relação |
|-------|---------|---------|
| Azure AI Search Integration | `skills/domain/azure-ai-search-integration.md` | Padrões para implementar RAG-01 a RAG-04. |
| Testing Patterns | `skills/domain/testing-patterns.md` | Padrões para testes de validação de guardrails (VALIDATION-01 a VALIDATION-08). |
| Error Handling | `skills/foundation/error-handling.md` | Padrões de tratamento de erro para fallbacks (WHEN-IN-DOUBT-01 a WHEN-IN-DOUBT-06). |
| Create RAG Endpoint | `skills/artifact/create-rag-endpoint.md` | Template para criação de endpoints que respeitem a estrutura obrigatória de resposta. |
