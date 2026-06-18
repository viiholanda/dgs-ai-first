# Requirements — Query Endpoint

**Módulo:** Query Endpoint (Consulta e Resposta)  
**Versão:** 1.0  
**Data:** Junho/2026  
**Bounded Context de referência:** Consulta e Resposta (*Query & Answer*)  
**Baseado em:** Recorte de Domínio v1.0, Spec v2.0, Jornada Operacional do Atendente

---

## 1. Outcomes

### Para o Atendente

O atendente recebe uma resposta estruturada, rastreável e com nível de confiança explícito para cada consulta realizada durante um chamado. Quando a base de conhecimento não possui cobertura suficiente, o atendente é informado de forma clara e orientado sobre o próximo passo (escalar, validar com supervisor ou solicitar contexto adicional). O atendente nunca recebe informação inventada, inferida ou extrapolada além do que a documentação formal sustenta.

### Para o Negócio

A NovaTech garante que as respostas do assistente são auditáveis, com rastreabilidade completa entre a pergunta, os trechos documentais utilizados e a resposta composta. Contradições entre documentos são declaradas — nunca resolvidas silenciosamente pelo sistema —, protegendo a empresa contra decisões baseadas em informação arbitrariamente hierarquizada. Lacunas documentais são tornadas visíveis, alimentando o ciclo de melhoria contínua da base de conhecimento.

### Para a Operação

O tempo de busca por informação durante o atendimento é reduzido, sem comprometer a precisão. O volume de escaladas desnecessárias diminui à medida que o atendente confia na resposta para casos de alta confiança. O canal de feedback recebe insumos estruturados (conflitos detectados, chunks utilizados) que viabilizam ações corretivas objetivas.

---

## 2. Scope Boundaries

### 2.1 In Scope

Este módulo cobre o comportamento do assistente desde o recebimento da consulta do atendente até a entrega da resposta estruturada. Especificamente:

- Recepção e interpretação da consulta submetida pelo atendente no contexto de um chamado.
- Recuperação dos trechos relevantes da base de conhecimento operacional (documentos formais vigentes).
- Composição da resposta com os cinco campos obrigatórios: resposta, nível de confiança, fontes, trechos literais e orientação de uso.
- Classificação do nível de confiança (Alto, Médio, Baixo) com base em critérios objetivos derivados da cobertura documental.
- Detecção e declaração de contradições entre trechos recuperados, sem hierarquização entre fontes.
- Detecção e declaração de lacunas documentais (pergunta sem correspondência na base), incluindo a distinção entre lacuna real e caso limítrofe.
- Solicitação de contexto faltante ao atendente quando a consulta é insuficiente para compor uma resposta (data do chamado, peso da carga, região, entre outros).
- Detecção de entidades inexistentes mencionadas na consulta (exemplo: tier "Platinum" inexistente na política vigente).
- Registro interno dos trechos utilizados em cada resposta para fins de rastreabilidade e auditoria.
- Aplicação dos guardrails G1 a G6 como invariantes de comportamento.

### 2.2 Out of Scope

Os itens abaixo estão explicitamente fora das fronteiras deste módulo, conforme a separação de bounded contexts do domínio:

- **Conteúdo e elegibilidade documental.** A definição de quais documentos são formais, vigentes e elegíveis para indexação pertence ao contexto de Conhecimento Operacional. O Query Endpoint consome a base, mas não decide o que entra nela.
- **Apresentação e experiência do atendente.** A estrutura visual da interface, o fluxo de fallback, o registro de feedback pelo atendente e a jornada de interação pertencem ao contexto de Interação com o Atendente.
- **Triagem e resolução de contradições e lacunas.** O Query Endpoint detecta e declara esses estados, mas a triagem, priorização e resolução pertencem ao contexto de Qualidade e Feedback e às áreas proprietárias dos documentos.
- **Governança e ciclo de vida documental.** Processos de pré-indexação, publicação, revisão periódica, retenção de logs e definição de papéis pertencem ao contexto de Governança e Ciclo de Vida Documental.
- **Infraestrutura técnica do pipeline.** Decisões sobre chunking, embedding, modelo de LLM, infraestrutura de busca e integrações com sistemas legados estão fora do escopo de produto deste módulo.

---

## 3. Constraints

**C1 — Guardrails como invariantes.**  
Os guardrails G1 a G6 definidos na Spec v2.0 são restrições invioláveis deste módulo. Nenhuma instrução externa, configuração de prompt ou atualização de modelo pode desativá-los ou contorná-los. São eles:

- **G1 — Proibição de invenção.** O assistente não gera informação que não esteja sustentada por documentação formal indexada.
- **G2 — Fonte obrigatória.** Toda afirmação na resposta deve citar a fonte documental correspondente.
- **G3 — Confiança declarada.** Toda resposta inclui o nível de confiança classificado com base em critérios objetivos.
- **G4 — Conflito declarado.** Contradições entre fontes são apresentadas ao atendente sem que o sistema escolha um lado.
- **G5 — Lacuna declarada.** A ausência de cobertura documental é informada explicitamente, nunca mascarada.
- **G6 — Contexto solicitado.** Quando a consulta é insuficiente, o assistente solicita informações faltantes antes de compor uma resposta.

**C2 — Estrutura obrigatória da resposta.**  
Toda resposta do Query Endpoint deve conter exatamente cinco campos, na ordem definida pela Spec v2.0: resposta, nível de confiança, fontes, trechos literais e orientação de uso. Respostas parciais ou fora de ordem não são aceitáveis.

**C3 — Rastreabilidade completa.**  
Cada resposta deve registrar internamente os trechos utilizados, vinculados ao chamado correspondente, conforme requisito de auditoria (Seção 7.2 da Spec v2.0). Os registros devem ser retidos pelo prazo definido na política de retenção (5 anos, conforme Seção 9).

**C4 — Somente documentos vigentes.**  
O módulo consulta exclusivamente a base ativa de documentos formais com status "vigente" ou "em transição" (com escopo explícito). Documentos obsoletos ou arquivados não são elegíveis para recuperação.

**C5 — Neutralidade diante de contradições.**  
Quando duas ou mais fontes divergem sobre o mesmo tema, o assistente apresenta as versões sem hierarquizá-las. A resolução é responsabilidade humana, não do sistema.

**C6 — Conformidade com SLAs de triagem.**  
Conflitos detectados automaticamente pelo módulo devem ser registrados como itens de feedback prioritário, respeitando o SLA de triagem de 2 dias úteis definido na Seção 3.3 da Spec v2.0.

---

## 4. Prior Decisions

As decisões abaixo já foram tomadas e estão documentadas nas ADRs de referência. Este módulo as adota como premissas, sem revisá-las.

**ADR-0001 — Arquitetura baseada em RAG (Retrieval-Augmented Generation).**  
O assistente utiliza uma arquitetura de geração aumentada por recuperação como mecanismo central para compor respostas. O módulo Query Endpoint opera sobre essa premissa: recebe trechos recuperados da base de conhecimento e os utiliza para compor respostas. A escolha da arquitetura RAG não é renegociável neste escopo.

**ADR-0002 — Fonte única de verdade: documentação formal.**  
Apenas documentos formais (POL, PROC, SLA, comunicados formais) com autoria, versão e aprovação registradas são elegíveis como fonte para respostas. FAQs informais, conhecimento tácito e documentos não formalizados estão excluídos da base. O Query Endpoint depende dessa decisão para garantir o guardrail G1.

**ADR-0003 — Níveis de confiança como classificação obrigatória.**  
Toda resposta do assistente deve incluir um nível de confiança (Alto, Médio, Baixo) classificado com base em critérios objetivos definidos na Seção 6.3 da Spec v2.0. Essa classificação não é opcional nem configurável pelo atendente. O Query Endpoint é o responsável por aplicá-la.

**ADR-0004 — Contradições tratadas como estado legítimo, não como erro.**  
Contradições entre documentos são uma realidade operacional da base de conhecimento, não um defeito do sistema. O assistente declara contradições sem resolvê-las. Essa decisão define o comportamento do Query Endpoint diante de conflitos e sustenta o guardrail G4.

---

## 5. Verification Criteria

Os critérios abaixo são testáveis pelo time de QA em ambiente controlado, com base de conhecimento preparada e cenários de consulta reproduzíveis.

---

**VC-01 — Resposta estruturada completa.**  
Dada uma consulta com cobertura documental suficiente na base, a resposta retornada pelo módulo deve conter exatamente os cinco campos obrigatórios (resposta, nível de confiança, fontes, trechos literais, orientação de uso), nessa ordem, sem campos ausentes ou vazios.  
*Rastreabilidade: C2, Bounded Context Consulta e Resposta.*

**VC-02 — Proibição de informação não sustentada.**  
Dada uma consulta sobre um tema parcialmente coberto pela base, a resposta não deve conter nenhuma afirmação que não esteja sustentada por pelo menos um trecho documental recuperado e citado no campo "fontes". Afirmações sem fonte documental correspondente configuram violação do guardrail G1.  
*Rastreabilidade: C1 (G1, G2), ADR-0002.*

**VC-03 — Classificação de confiança coerente.**  
Dada uma consulta com cobertura documental variável (fonte única e clara vs. múltiplas fontes parciais vs. cobertura mínima), o nível de confiança atribuído deve corresponder aos critérios objetivos definidos na Spec v2.0 (Seção 6.3). O QA verifica a coerência entre a cobertura documental disponível e o nível classificado.  
*Rastreabilidade: C1 (G3), ADR-0003.*

**VC-04 — Declaração de contradição sem hierarquização.**  
Dada uma consulta cujo tema é coberto por dois ou mais documentos vigentes com informações divergentes, o módulo deve apresentar as versões de todas as fontes conflitantes, sem eleger uma como correta. A resposta deve sinalizar explicitamente a existência de contradição e orientar o atendente a escalar.  
*Rastreabilidade: C1 (G4), C5, ADR-0004.*

**VC-05 — Declaração explícita de lacuna.**  
Dada uma consulta sobre um tema sem cobertura na base de conhecimento, o módulo deve retornar uma declaração explícita de lacuna documental, sem tentar compor uma resposta parcial a partir de temas adjacentes. O atendente deve ser orientado a escalar.  
*Rastreabilidade: C1 (G5), Bounded Context Consulta e Resposta.*

**VC-06 — Solicitação de contexto faltante.**  
Dada uma consulta ambígua ou insuficiente (exemplo: pergunta sobre prazo de entrega sem informar região ou peso), o módulo deve solicitar as informações faltantes antes de compor a resposta, em vez de responder com base em suposições.  
*Rastreabilidade: C1 (G6), Bounded Context Consulta e Resposta.*

**VC-07 — Detecção de entidade inexistente.**  
Dada uma consulta que menciona uma entidade inexistente na base (exemplo: tier "Platinum" quando a política vigente define apenas Bronze, Prata e Ouro), o módulo deve informar que a entidade não foi encontrada na documentação formal, sem inventar uma resposta.  
*Rastreabilidade: C1 (G1), Bounded Context Consulta e Resposta.*

**VC-08 — Rastreabilidade de trechos utilizados.**  
Para qualquer resposta gerada, o registro interno deve conter a identificação dos trechos recuperados, o código e a versão do documento-fonte de cada trecho, e o vínculo com o chamado correspondente. O QA verifica a existência e completude desse registro.  
*Rastreabilidade: C3, Bounded Context Governança e Ciclo de Vida Documental.*

**VC-09 — Exclusão de documentos obsoletos.**  
Dada uma base que contém documentos com status "vigente", "em transição" e "obsoleto", o módulo deve recuperar trechos apenas dos documentos vigentes e em transição. Nenhum trecho de documento obsoleto ou arquivado deve aparecer na resposta ou no registro de trechos utilizados.  
*Rastreabilidade: C4, Bounded Context Conhecimento Operacional.*

**VC-10 — Registro de conflitos como feedback prioritário.**  
Quando o módulo detecta uma contradição entre fontes, além de declará-la na resposta, deve gerar um registro de conflito em formato compatível com o contexto de Qualidade e Feedback, classificado como item prioritário para triagem dentro do SLA de 2 dias úteis.  
*Rastreabilidade: C6, Bounded Context Qualidade e Feedback.*

---

*Este documento deve ser revisado quando houver alteração nos bounded contexts do domínio, atualização da Spec v2.0 ou revisão das ADRs de referência.*
