# Avaliação de Qualidade — Respostas do Assistente RAG (Pré Go-Live)

**Fonte de verdade:** Anexo A — Documentação Simulada NovaTech  
**Avaliador:** Product Specialist  
**Data:** 30/06/2026

---

## Resumo Executivo

| Classificação | Qtd |
|---|---|
| Correta | 1 |
| Parcialmente correta | 3 |
| Incorreta | 2 |

Das 6 respostas avaliadas, apenas a Resposta 5 demonstrou o comportamento esperado de um sistema RAG bem calibrado. As Respostas 4 e 6 representam risco operacional por tratarem informações de fonte informal como política oficial, com confiança Alta.

---

## Tabela de Avaliação

| Resposta | Classificação | Justificativa | Tipo de Erro | Sugestão de Melhoria |
|---|---|---|---|---|
| **R1** — "Qual o prazo de devolução para produtos standard?" | **Parcialmente correta** | O prazo de 7 dias úteis está correto (POL-001, seção 3.1), assim como a orientação sobre abrir chamado no portal e anexar fotos (seção 3.3). Porém, a fonte citada é a seção 3.2, que trata das *exceções* ao prazo (cargas perigosas, refrigeradas, lacre violado), e não do prazo geral. A citação da fonte está imprecisa. | Informação incompleta | **Pipeline RAG** — Melhorar o chunking para preservar a associação entre número de seção e conteúdo, permitindo citação granular correta. **Structured Outputs** — Exigir que a fonte inclua a seção exata extraída do chunk recuperado. |
| **R2** — "Meu cliente é Silver. Qual o prazo de resolução?" | **Parcialmente correta** | Conforme SLA-2024 (seção 2), o prazo de resolução Silver é até 48h úteis para chamados gerais, mas até 8h para incidentes críticos. A resposta omite a distinção entre chamados gerais e incidentes críticos e omite que são horas *úteis* (não corridas). O cliente pode ser induzido a erro em cenário de incidente crítico. | Informação incompleta | **Prompt** — Instruir o modelo a sempre distinguir chamados gerais de incidentes críticos ao informar SLAs, e a qualificar se o prazo é em horas úteis ou corridas. **Structured Outputs** — Exigir campos separados por tipo de chamado na resposta. |
| **R3** — "Posso devolver carga perigosa classe 3?" | **Parcialmente correta** | A informação sobre a não elegibilidade de cargas perigosas classes 1 a 6 está correta, e a fonte citada (POL-001, seção 3.2) é precisa. No entanto, a POL-001 orienta encaminhar ao setor de Gestão de Riscos (ramal 4500), não simplesmente "escalar para o supervisor". A orientação de escalação está imprecisa e pode gerar encaminhamento ao setor errado. | Alucinação | **Prompt** — Instruir o modelo a incluir o canal correto de escalação conforme documentação (setor + ramal). **Pipeline RAG** — Indexar metadados de escalação (setor, ramal, e-mail) como campos estruturados associados a cada exceção. |
| **R4** — "Qual a política para carga danificada durante transporte?" | **Incorreta** | Não existe documento formal (POL ou PROC) sobre carga danificada na documentação da NovaTech. A única referência é o FAQ-Atendimento (item 38), documento informal não validado por Compliance ou Operações. A resposta apresenta a informação como política oficial, sem citar fonte, com confiança Alta. Além disso, o FAQ menciona "responsabilidade nossa" (NovaTech), não "negligência da transportadora", e indica encaminhamento ao Jurídico (sinistros@novatech.com.br), informação omitida. | Alucinação / Fonte não confiável | **Pipeline RAG** — Classificar documentos por nível de confiabilidade (normativo vs. informal) e usar essa metadata para calibrar o score de confiança. **HITL** — Quando a única fonte for documento informal, exigir revisão humana antes de apresentar a resposta. **Prompt** — Instruir o modelo a declarar explicitamente quando não houver política formal documentada. |
| **R5** — "Qual o SLA do cliente Enterprise?" | **Correta** | Resposta precisa e bem calibrada. Conforme SLA-2024 (seção 1), existem apenas três tiers: Gold, Silver e Standard. A nota do documento reforça: "Não existem outros tiers além dos três listados acima." O modelo reconheceu o gap, informou confiança Baixa e sugeriu escalação. Comportamento ideal. | — | Nenhuma correção necessária. Este padrão (reconhecer gap + confiança baixa + sugerir escalação) deve ser reforçado no **Prompt** como comportamento padrão para dados não encontrados. Pode servir de exemplo positivo em few-shot prompting. |
| **R6** — "Posso enviar carga perigosa com frete expresso?" | **Incorreta** | A informação provém exclusivamente do FAQ-Atendimento (item 32), documento informal não validado. As meta-notas da documentação (Contradição #4) confirmam: "não existe documento formal (PROC ou POL) que defina esse processo". A resposta trata informação informal como política oficial, com confiança Alta, sem qualquer ressalva. Risco operacional e regulatório elevado por envolver carga perigosa e regulação ANTT. | Fonte não confiável | **Pipeline RAG** — Implementar classificação de documentos por nível de autoridade (normativo > operacional > informal). Quando a única fonte for informal, rebaixar confiança automaticamente e adicionar disclaimer. **Interface** — Exibir badge de alerta visual quando a fonte for documento não validado. **HITL** — Bloquear respostas de confiança Alta quando baseadas exclusivamente em documentos informais. |

---

## Padrões Recorrentes e Recomendações Transversais

### 1. Ausência de classificação de fontes por nível de autoridade

As Respostas 4 e 6 evidenciam que o sistema não diferencia documentos normativos (POL, PROC, SLA) de documentos informais (FAQ). Isso leva a tratar conhecimento prático não validado como política oficial.

**Ação recomendada:** Implementar no Pipeline RAG uma camada de metadata que classifique cada documento ingerido por nível de autoridade (normativo, operacional, informal). Usar essa classificação para calibrar o score de confiança da resposta e adicionar disclaimers automáticos.

### 2. Respostas incompletas por falta de instrução no prompt

As Respostas 1, 2 e 3 mostram omissões que seriam evitáveis com instruções mais específicas no prompt: citar seção exata, distinguir tipos de chamado, incluir canais de escalação com ramal.

**Ação recomendada:** Enriquecer o system prompt com regras explícitas sobre granularidade de citação, obrigatoriedade de distinguir cenários (geral vs. crítico) e inclusão de canais de escalação completos.

### 3. Calibração de confiança desalinhada

As Respostas 4 e 6 apresentam confiança Alta quando deveriam ser Baixa. A Resposta 5 é o único exemplo de calibração correta.

**Ação recomendada:** Usar Structured Outputs para forçar o modelo a justificar o nível de confiança com base no tipo de fonte recuperada. Quando não houver documento normativo corroborando a resposta, o sistema deve rebaixar automaticamente a confiança.
