# Avaliação Comparativa — Respostas do Assistente RAG (Exercício 3.1)

> **Programa:** Trilha de Certificação AI First — DGS / DB1 Global Software  
> **Exercício:** 3.1 — Revisão Crítica de Outputs de IA  
> **Data:** 30/06/2026  
> **Fonte de verdade:** Anexo A — Documentação Simulada NovaTech

---

## 1. Avaliação Independente do Claude (Segundo Avaliador)

### R1 — "Qual o prazo de devolução para produtos standard?"

**Classificação:** Parcialmente correta  
**Justificativa:** O prazo de 7 dias úteis e a orientação sobre chamado com fotos estão corretos conforme POL-001. Porém, a fonte citada é a seção 3.2 (exceções), quando o prazo geral consta na seção 3.1. A citação imprecisa da seção não invalida a informação, mas compromete a rastreabilidade — um atendente que fosse verificar na seção 3.2 encontraria conteúdo diferente do esperado.  
**Tipo de erro:** Informação incompleta (citação de fonte imprecisa).

### R2 — "Meu cliente é Silver. Qual o prazo de resolução?"

**Classificação:** Parcialmente correta  
**Justificativa:** O prazo de 48h existe no SLA-2024, mas a resposta omite duas distinções relevantes: (a) a diferença entre chamados gerais (48h) e incidentes críticos (8h), e (b) que as horas são úteis, não corridas. Um cliente com incidente crítico que receba "48h" como resposta será mal atendido.  
**Tipo de erro:** Informação incompleta.

### R3 — "Posso devolver carga perigosa classe 3?"

**Classificação:** Parcialmente correta  
**Justificativa:** A proibição de devolver cargas perigosas classes 1-6 está correta e a fonte (POL-001, seção 3.2) é precisa. No entanto, a orientação de "escalar para o supervisor" é imprecisa — a documentação indica encaminhamento ao setor de Gestão de Riscos (ramal 4500). Esse erro de escalação pode direcionar o atendente ao canal errado.  
**Tipo de erro:** Alucinação parcial (o canal de escalação foi inventado ou generalizado pelo modelo).

### R4 — "Qual a política para carga danificada durante transporte?"

**Classificação:** Incorreta  
**Justificativa:** Não existe documento normativo (POL, PROC ou SLA) sobre danos em transporte na base da NovaTech. A única referência é o FAQ-Atendimento (item 38), documento informal e não validado. A resposta apresenta informação inventada como política oficial, sem citar fonte, com confiança Alta. Além disso, o conteúdo diverge do próprio FAQ: o FAQ fala em "responsabilidade nossa" e encaminhamento ao Jurídico (sinistros@novatech.com.br), não em "negligência da transportadora".  
**Tipo de erro:** Alucinação combinada com fonte não confiável. Esta é a resposta de maior risco — fabrica política inexistente com confiança alta.

### R5 — "Qual o SLA do cliente Enterprise?"

**Classificação:** Correta  
**Justificativa:** O modelo reconheceu que o tier Enterprise não existe na documentação, informou confiança Baixa e sugeriu escalação. É o comportamento ideal de um sistema RAG bem calibrado: admitir o gap em vez de inventar. Deve servir de referência para o padrão desejado.  
**Tipo de erro:** Nenhum.

### R6 — "Posso enviar carga perigosa com frete expresso?"

**Classificação:** Incorreta  
**Justificativa:** A resposta se baseia exclusivamente no FAQ-Atendimento (item 32), documento informal não validado por Compliance. A documentação confirma que não existe documento formal (PROC ou POL) sobre esse processo. A resposta trata informação informal como política oficial, com confiança Alta e sem ressalva, envolvendo carga perigosa e regulação ANTT — risco operacional e regulatório elevado.  
**Tipo de erro:** Fonte não confiável.

---

## 2. Resumo Comparativo

| Resposta | Avaliação do Product Specialist | Avaliação do Claude | Classificação alinhada? | Tipo de erro alinhado? |
|---|---|---|---|---|
| R1 | Parcialmente correta | Parcialmente correta | Sim | Sim |
| R2 | Parcialmente correta | Parcialmente correta | Sim | Sim |
| R3 | Parcialmente correta | Parcialmente correta | Sim | Sim (com nuance) |
| R4 | Incorreta | Incorreta | Sim | Sim (com nuance) |
| R5 | Correta | Correta | Sim | Sim |
| R6 | Incorreta | Incorreta | Sim | Sim |

---

## 3. Concordâncias

As classificações das 6 respostas são idênticas entre os dois avaliadores: R1, R2 e R3 como parcialmente corretas, R4 e R6 como incorretas, R5 como correta. Os tipos de erro e as justificativas são essencialmente os mesmos — citação imprecisa na R1, omissão de cenários na R2, escalação errada na R3, alucinação na R4, comportamento exemplar na R5, e fonte não confiável na R6. Ambos os avaliadores identificaram as armadilhas obrigatórias (#4 como alucinação, #6 como fonte não confiável) e reconheceram a R5 como padrão de referência.

As sugestões de melhoria também convergem nos pontos centrais: classificação de fontes por nível de autoridade no pipeline RAG, enriquecimento do prompt com regras de granularidade e cenários, e uso de structured outputs para calibrar confiança.

---

## 4. Divergências

### R3 — Granularidade na classificação do erro

O Product Specialist classificou o erro da R3 como "alucinação". O Claude classificou como "alucinação parcial", argumentando que a informação principal (proibição de devolução) está correta e apenas o canal de escalação foi fabricado — diferente da R4, onde a resposta inteira é inventada.

**Impacto prático:** Nenhum. Em ambos os casos, o atendente seria direcionado ao canal errado. A divergência é de nomenclatura, não de gravidade.

### R4 — Classificação simples vs. dupla

O Product Specialist usou dupla classificação ("Alucinação / Fonte não confiável"), reconhecendo dois problemas sobrepostos: o modelo consultou uma fonte informal E distorceu o conteúdo dela. O Claude priorizou "alucinação" como tipo primário, tratando a fonte não confiável como agravante.

**Impacto prático:** A abordagem de dupla classificação do Product Specialist é mais completa e mais útil para definir ações corretivas, pois cada tipo de erro demanda uma correção diferente no pipeline.

### Sugestões de melhoria — Escopo

A avaliação do Product Specialist é mais detalhada em dois aspectos:

1. **Interface:** propôs badge de alerta visual para fontes não validadas (R6), o que o Claude não incluiu.
2. **HITL:** detalhou pontos específicos de intervenção humana (bloqueio de confiança Alta quando baseada exclusivamente em documentos informais), uma proposta mais concreta de governança.

O Claude focou em ajustes de prompt e pipeline, com menor cobertura de interface e governança.

---

## 5. Propostas de Ajuste Consolidadas

### R1 e R2 — Informação incompleta

**Prompt:** Incluir instruções explícitas para citar a seção exata do documento recuperado, distinguir cenários (chamado geral vs. incidente crítico) e qualificar unidades de tempo (horas úteis vs. corridas).

**Structured Outputs:** Exigir campos separados por tipo de chamado na resposta, forçando o modelo a não omitir variações.

### R3 — Escalação imprecisa

**Pipeline RAG:** Indexar metadados de escalação (setor, ramal, e-mail) como campos estruturados vinculados a cada exceção, para que o modelo não precise inferir o canal correto.

**Prompt:** Instruir o modelo a incluir o canal completo de escalação conforme documentação (setor + ramal + e-mail quando disponível).

### R4 — Alucinação

**Pipeline RAG:** Classificar documentos por nível de autoridade (normativo > operacional > informal). Quando a única fonte for informal, rebaixar confiança automaticamente.

**Prompt:** Instruir o modelo a declarar explicitamente quando não houver política formal documentada, em vez de apresentar informação informal como oficial.

**HITL:** Exigir revisão humana antes de apresentar respostas baseadas exclusivamente em documentos informais.

### R6 — Fonte não confiável

**Pipeline RAG:** Mesma classificação de autoridade da R4, com adição de disclaimer automático quando a fonte não for normativa.

**Interface:** Exibir badge de alerta visual quando a resposta for baseada em documento não validado por Compliance.

**HITL:** Bloquear respostas de confiança Alta quando baseadas exclusivamente em documentos informais. Para temas regulatórios (carga perigosa, ANTT), aprovação humana obrigatória.

### Ações Transversais

1. **Classificação de fontes por nível de autoridade** no pipeline RAG, aplicável a toda a base de documentos.
2. **Calibração de confiança via structured outputs**, forçando o modelo a justificar o nível de confiança com base no tipo de fonte recuperada.
3. **R5 como exemplo positivo** para few-shot prompting — o padrão "reconhecer gap + confiança baixa + sugerir escalação" deve ser reforçado como comportamento padrão para dados não encontrados.
