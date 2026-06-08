# Especificação de Requisitos do Produto
## Assistente de IA para Atendimento — NovaTech Logística

**Versão:** 2.0
**Data:** Junho/2026
**Substitui:** Versão 1.0 (Junho/2026)
**Baseado em:** Documentação Operacional NovaTech (Anexo A), Chunks de Referência RAG (Anexo B), Jornada Operacional do Atendente (jornada_atendente_ia.md)
**Classificação:** Uso interno — Operações e Produto
**Proprietário do documento:** Gerência de Operações de Atendimento
**Aprovação requerida:** Gerência de Operações, Jurídico, Time de Qualidade

> **Nota de revisão (v2.0):** Esta versão corrige gaps e ambiguidades identificados na v1.0. As principais alterações estão nas Seções 2 (critérios de elegibilidade e arquivo histórico), 3 (definição expandida de contradição e SLA de triagem), 4 (distinção entre lacuna e caso limítrofe), 5 (definição de publicação oficial e responsáveis), 6 (exibição de trechos em respostas multi-fonte e critérios objetivos de confiança) e na nova Seção 9 (retenção de logs para fins regulatórios).

---

## Sumário

1. Escopo e Propósito
2. Fontes de Dados: O que indexar e o que excluir
3. Tratamento de Documentos Contraditórios
4. Comportamento quando a resposta não está na base
5. Requisitos de Atualização da Base de Conhecimento
6. Requisitos de Rastreabilidade
7. Comportamento da Interface com o Atendente
8. Guardrails Obrigatórios
9. Retenção de Logs e Auditoria
10. Papéis e Responsabilidades
11. Fora do Escopo

---

## 1. Escopo e Propósito

Este documento especifica os requisitos de produto do assistente de IA utilizado pelos atendentes da NovaTech durante o atendimento a clientes. O assistente atua como consultor interno de políticas e procedimentos, sendo acionado para responder dúvidas sobre prazos de entrega (35% dos casos), regras de frete (25%), política de devolução (20%) e outros assuntos (20%).

O assistente **não substitui o julgamento do atendente nem do supervisor.** Sua função é acelerar o acesso à informação correta com rastreabilidade completa. Aproximadamente 15% dos casos devem ser escalados — e o assistente deve facilitar essa escalada, não tentar evitá-la.

Os requisitos aqui definidos são de produto (comportamento esperado, regras de negócio, limites funcionais). Requisitos técnicos de implementação — arquitetura do pipeline de RAG, infraestrutura, integração com sistemas — são tratados em documentos separados listados na Seção 11.

---

## 2. Fontes de Dados: O que indexar e o que excluir

### 2.1 Documentos elegíveis para indexação

Para ser indexado na base de conhecimento do assistente, um documento deve satisfazer **todos** os critérios abaixo:

- Possui autoria formal identificada: nome da área responsável ou comitê de aprovação consta no cabeçalho ou rodapé do documento.
- Tem número de versão e data de vigência explícitos no próprio documento.
- Está formalmente registrado no sistema de gestão documental da NovaTech como "vigente" (ver definição de publicação oficial na Seção 5.3).
- Passou por aprovação formal da área proprietária, evidenciada por assinatura eletrônica ou registro de aprovação no sistema de gestão documental.

A validação desses critérios é de responsabilidade da **Área de Qualidade**, antes de qualquer indexação (ver Seção 10).

**Exemplos de tipos elegíveis:** políticas (ex: POL-001), procedimentos operacionais (ex: PROC-042), tabelas de SLA (ex: SLA-2024), comunicados formais de atualização de regras emitidos pela área proprietária.

### 2.2 Documentos que NÃO devem ser indexados

Os seguintes tipos de documento não devem entrar na base de conhecimento do assistente:

- **FAQs de atendimento não formalizadas** — documentos como o FAQ-Atendimento (Anexo B) contêm orientações informais ("na prática…", "já tiveram casos…") que podem contradizer documentos formais e induzir respostas incorretas com aparência de confiança. FAQs poderão ser indexadas somente após revisão e aprovação formal conforme os critérios da Seção 2.1. Quando um FAQ abrange temas de múltiplas áreas, cada área proprietária deve aprovar formalmente os itens dentro de seu escopo; o FAQ não poderá ser indexado enquanto qualquer item pendente de aprovação permanecer sem resposta.
- **Versões anteriores de documentos com substituto vigente** — versões obsoletas não devem coexistir na base ativa com a versão corrente, pois geram risco de mistura de informações entre versões (problema documentado nos testes de retrieval com PROC-042 v1 e v2).
- **Rascunhos e versões em revisão** — documentos que não tenham concluído o processo de aprovação formal não devem ser indexados, mesmo que circulem internamente.
- **Documentos com vigência expirada** — políticas substituídas por versões mais recentes devem ser removidas da base ativa no mesmo ato de entrada da nova versão.

### 2.3 Arquivo histórico: definição e acesso

Documentos removidos da base ativa são movidos para o **arquivo histórico**, que é uma partição separada do índice de busca — não acessível nas consultas padrão do assistente.

Regras do arquivo histórico:

- Todo documento arquivado recebe a marcação `[OBSOLETO — substituído por {código e versão do substituto} em {DD/MM/AAAA}]`.
- O arquivo histórico pode ser consultado manualmente pela Área de Qualidade e por supervisores, mediante acesso específico não disponível na interface padrão do atendente.
- O atendente não tem acesso ao arquivo histórico pela interface do assistente. Caso precise consultar regras de uma versão anterior (ex: para resolver um chamado antigo), deve acionar o supervisor.
- Exceção de coexistência na base ativa: durante períodos de transição com regras explícitas (ex: "chamados abertos antes de 01/12/2023 usam a tabela anterior"), ambas as versões podem permanecer na base ativa, desde que cada uma esteja marcada com seu escopo de aplicação (ver Seção 2.4).

### 2.4 Regra de transição entre versões

Quando um novo documento substitui outro e existe uma regra de transição explícita:

- Ambas as versões permanecem na base ativa, cada uma identificada com o período ou condição de aplicação.
- O assistente deve, ao responder, verificar se o contexto do chamado (especificamente a data de abertura do chamado) é suficiente para determinar qual versão se aplica.
- **Se a data de abertura do chamado não for informada pelo atendente:** o assistente não deve assumir nem escolher uma versão. Deve informar que existem duas versões aplicáveis, descrever a condição que distingue cada uma, e solicitar ao atendente que informe a data de abertura do chamado antes de prosseguir.
- Após o encerramento do período de transição, a versão anterior é movida para o arquivo histórico.

---

## 3. Tratamento de Documentos Contraditórios

### 3.1 Definição de contradição

Considera-se contradição documental qualquer situação em que dois ou mais documentos indexados apresentem informações incompatíveis para o mesmo cenário. Isso inclui:

- **Contradição direta:** Documento A afirma X e Documento B afirma Y para o mesmo caso (ex: multiplicadores regionais diferentes entre PROC-042 v1 e v2).
- **Contradição por exceção não formalizada:** Documento A proíbe ou restringe algo explicitamente, e Documento B (ou FAQ) abre uma exceção sem amparo formal (ex: POL-001-B proíbe devolução de carga perigosa pelo processo padrão; FAQ-03 menciona exceções não documentadas em política formal).
- **Contradição por omissão relevante:** Documento A cobre um cenário e Documento B cobre o mesmo cenário mas com escopo diferente, de modo que a aplicação simultânea produza resultados diferentes dependendo de qual documento o atendente consultar primeiro.

### 3.2 Comportamento exigido ao detectar contradição

Quando o pipeline de retrieval retornar chunks contraditórios, o assistente deve:

1. **Identificar e declarar o conflito explicitamente**, com linguagem clara: *"Encontrei informações divergentes entre os seguintes documentos sobre este ponto: [lista dos documentos]."*
2. **Apresentar ambas as versões** com identificação de origem (nome do documento, versão, data), sem hierarquizar ou escolher uma como "correta" por conta própria — mesmo quando uma versão for visivelmente mais recente ou mais detalhada.
3. **Orientar o atendente** a consultar o supervisor ou a área responsável antes de transmitir qualquer informação ao cliente.
4. **Registrar automaticamente o conflito** como item de feedback prioritário para triagem pelo time de qualidade. O registro deve conter: identificadores dos documentos envolvidos, trecho contraditório de cada um, e ID do chamado.

O assistente **nunca deve resolver a contradição por inferência.** A decisão sobre qual versão prevalece é responsabilidade exclusiva da área proprietária do documento.

### 3.3 SLA de triagem de conflitos registrados

Conflitos registrados automaticamente pelo assistente (conforme Seção 3.2, item 4) devem ser triados pela Área de Qualidade em até **2 dias úteis** após o registro. A triagem deve resultar em uma das ações previstas na Seção 5.5. Conflitos não triados dentro do prazo são escalados automaticamente para o Gerente de Qualidade.

### 3.4 Nível de confiança em caso de contradição

Toda resposta que envolva documentos contraditórios recebe automaticamente o nível de confiança **Baixo**, independentemente da clareza aparente de uma das fontes (ver Seção 6.3).

---

## 4. Comportamento quando a resposta não está na base

### 4.1 Regra geral: declarar ausência, nunca inventar

Quando a pergunta do atendente não tiver correspondência em nenhum documento indexado, o assistente deve:

- Declarar explicitamente que não encontrou documentação: *"Não localizei informação sobre este assunto na base de conhecimento."*
- Não gerar respostas com base em conhecimento geral, analogias com casos similares ou inferências — mesmo que a resposta pareça razoável, ela não tem respaldo em fonte verificável e não pode ser rastreada.
- Orientar o atendente a reformular a consulta ou acionar o fluxo de escalada conforme a jornada operacional vigente.

### 4.2 Distinção entre lacuna e caso limítrofe

A proibição de inferência (Seção 4.1) aplica-se a lacunas reais — situações em que nenhum documento cobre o tema. Ela **não** se confunde com casos limítrofes, definidos como situações em que um documento cobre um tema mas o caso específico está fora do escopo explícito da regra.

Em casos limítrofes, o assistente deve:

- Apresentar a regra documentada que mais se aproxima do caso, com sua fonte.
- Declarar explicitamente que o caso apresentado está fora do escopo coberto pela regra: *"A regra {X} cobre cargas acima de 500kg. O caso apresentado (499kg) está fora desse escopo — não há documentação sobre o tratamento desta faixa."*
- Não extrapolar a regra para cobrir o caso limítrofe.
- Orientar o atendente a acionar o supervisor.

**Exemplo:** A PROC-042-v2 cobre fretes especiais acima de 500kg. Uma carga de 499kg não está coberta — mas o assistente não deve nem aplicar a tabela de frete especial nem inventar uma regra alternativa. Deve declarar que a faixa não está documentada e escalar.

### 4.3 Exemplos de situações sem cobertura (identificadas nos testes)

- Frete padrão para cargas abaixo de 500kg — nenhum documento cobre essa faixa.
- Procedimento detalhado para carga danificada em trânsito — coberto apenas por FAQ informal (FAQ-38), sem documento formal. O FAQ não deve ser usado como fonte.
- Autorização de frete expresso para carga perigosa — coberto apenas por FAQ informal (FAQ-32), sem documento formal.

Para esses casos, o comportamento correto é declarar a lacuna e escalar. O uso de FAQ informal como substituto de documento formal não é permitido (ver Seção 2.2).

### 4.4 Perguntas sobre entidades inexistentes

Quando a pergunta mencionar um conceito, tier, produto ou regra que não consta na base (ex: "cliente Platinum"), o assistente deve:

- Informar que a entidade mencionada não consta na documentação indexada.
- Citar o documento que define os limites do que existe (ex: SLA-2024-A, que lista explicitamente os três tiers vigentes: Gold, Silver e Standard).
- Não criar, especular ou atribuir características à entidade inexistente.

---

## 5. Requisitos de Atualização da Base de Conhecimento

### 5.1 Prazos de indexação após publicação oficial

| Tipo de atualização | Prazo máximo para disponibilidade no assistente |
|---|---|
| Nova versão de política ou procedimento já existente | 24 horas úteis após publicação oficial |
| Novo documento (tipo ainda não indexado na base) | 48 horas úteis após publicação oficial e validação pela Área de Qualidade |
| Revogação de documento (remoção da base ativa) | 4 horas úteis após comunicado formal de revogação |
| Correção emergencial (erro crítico identificado em produção) | 2 horas úteis após identificação e aprovação da correção |

Os prazos acima são medidos em horas úteis a partir da publicação oficial (ver Seção 5.3). O cumprimento dos prazos é de responsabilidade da Área de Qualidade, que aciona a equipe técnica responsável pela indexação (ver Seção 10).

### 5.2 Processo obrigatório antes da indexação

Todo documento novo ou revisado deve passar pelas seguintes etapas antes de entrar na base, nesta ordem:

1. **Validação formal** — confirmação de que o documento atende todos os critérios da Seção 2.1. Responsável: Área de Qualidade.
2. **Verificação de conflito** — verificação se o novo documento contradiz algum documento já indexado. Responsável: Área de Qualidade, com apoio da área proprietária quando necessário.
   - Se conflito for identificado: o documento não entra na base até que o conflito seja resolvido pela área proprietária, ou até que uma nota de transição explícita seja aprovada e anexada ao documento.
   - Se o conflito não for resolvido dentro do prazo de indexação: a Área de Qualidade escalará para o Gerente de Operações, que decidirá se o documento entra com nota de conflito ou aguarda resolução.
3. **Marcação de escopo** — identificação clara do período ou condição de aplicação, especialmente em casos de transição de regras. Responsável: área proprietária do documento.
4. **Arquivamento da versão anterior** — a versão substituída é movida para o arquivo histórico simultaneamente à entrada da nova versão na base ativa. Responsável: equipe técnica de indexação.

### 5.3 Definição de publicação oficial

Para os fins desta especificação, considera-se **publicação oficial** o momento em que o documento é registrado como "vigente" no sistema de gestão documental da NovaTech com aprovação formal da área proprietária. Comunicações informais (e-mail, mensagem em canal de equipe, versão compartilhada sem registro no sistema) não constituem publicação oficial e não iniciam a contagem dos prazos da Seção 5.1.

### 5.4 Notificação ao time de atendimento

Quando um documento for atualizado, adicionado ou revogado da base, o time de atendimento deve ser notificado pelo canal oficial de comunicação interna, com:

- Identificação do documento (código, título, versão anterior e nova versão, quando aplicável).
- Resumo objetivo das alterações — o que mudou em relação à versão anterior, com destaque para regras que afetam o atendimento diário.
- Data e hora de entrada em vigor no assistente.

A notificação é de responsabilidade da Área de Qualidade e deve ser enviada antes ou simultaneamente à disponibilização do documento no assistente.

### 5.5 Ações corretivas decorrentes de triagem de feedback e conflitos

Com base na triagem de feedbacks e conflitos registrados, a Área de Qualidade executa uma das seguintes ações:

| Ação | Quando aplicar |
|---|---|
| Correção de conteúdo | Resposta incorreta ou desatualizada confirmada |
| Expansão da base | Lacuna confirmada — novo conteúdo é documentado, aprovado e indexado |
| Depreciação de conteúdo | Política descontinuada ainda presente na base ativa |
| Sinalização e resolução de conflito | Dois documentos contraditórios — área proprietária é acionada para consolidar e emitir versão definitiva |

### 5.6 Ciclo de revisão periódica

Independentemente de atualizações pontuais, a base deve passar por revisão completa a cada **90 dias corridos**, conduzida pela Área de Qualidade, para identificar:

- Documentos substituídos sem que a base tenha sido atualizada.
- Conflitos latentes entre documentos que coexistem na base.
- Lacunas recorrentes identificadas via feedbacks acumulados no período.
- Documentos cujo prazo de vigência tenha expirado sem comunicado formal de renovação ou revogação.

---

## 6. Requisitos de Rastreabilidade

### 6.1 Citação de fonte — obrigatória em toda resposta

Toda resposta do assistente deve incluir, sem exceção:

- **Código e título do documento** (ex: POL-001 — Política de Devolução).
- **Versão do documento** e data de publicação, quando disponíveis.
- **Seção ou cláusula específica** que embasou a resposta (ex: Seção 3.1).

Respostas sem indicação de fonte não devem ser exibidas ao atendente, independentemente do nível de confiança atribuído.

### 6.2 Exibição do trecho relevante

Além da citação, o assistente deve exibir o trecho literal do documento que fundamentou a resposta, apresentado visivelmente como citação — não parafraseado. Isso permite ao atendente verificar diretamente a aderência entre a resposta e o texto original.

**Quando a resposta combinar informações de múltiplos documentos**, o trecho literal de cada fonte deve ser exibido de forma associada à parte da resposta que ele embasa — não em bloco único ao final. A apresentação deve tornar claro, para cada afirmação da resposta, qual documento a sustenta. Quando o número de fontes tornar a exibição simultânea de todos os trechos impraticável na interface, o assistente deve exibir os trechos das duas fontes mais centrais e indicar as demais por citação (código, versão e seção), com opção de expansão pelo atendente.

### 6.3 Indicador de confiança — obrigatório e com critérios objetivos

Toda resposta deve exibir um indicador de confiança com três níveis. Os critérios abaixo são objetivos e determinísticos — não dependem de julgamento do assistente:

| Nível | Critérios de atribuição | Ação requerida do atendente |
|---|---|---|
| **Alto** | (a) Informação encontrada em documento formal vigente; (b) nenhuma contradição identificada entre os chunks recuperados; (c) o caso apresentado está dentro do escopo explícito do documento. Todos os três critérios devem ser satisfeitos. | Pode usar diretamente, com referência à política correspondente. |
| **Médio** | Qualquer uma das condições: (a) o documento cobre o tema, mas o trecho recuperado é parcial e pode haver complemento relevante não recuperado; (b) o caso apresentado está próximo do limite do escopo do documento (caso limítrofe conforme Seção 4.2); (c) a informação está em documento formal, mas sem versão ou data explícita. | Validar o trecho original no documento-fonte antes de transmitir ao cliente. |
| **Baixo** | Qualquer uma das condições: (a) contradição entre dois ou mais documentos recuperados (atribuição automática, conforme Seção 3.4); (b) único respaldo disponível é fonte informal (ex: FAQ não formalizado); (c) lacuna confirmada — nenhum documento cobre o tema. | Acionar supervisor antes de qualquer uso da informação. |

O indicador não pode ser omitido em nenhuma resposta.

### 6.4 Rastreabilidade de feedback

Todo feedback registrado pelo atendente sobre uma resposta do assistente deve ser vinculado:

- À resposta específica e ao chamado correspondente (ID do chamado).
- Ao documento-fonte citado naquela resposta (código, versão).
- Ao chunk ou trecho específico que originou o problema — o que pressupõe que o assistente registre internamente, para cada resposta, quais chunks foram utilizados (ver requisito de interface na Seção 7.2).

Esse vínculo permite à Área de Qualidade identificar padrões por documento, por tipo de erro e por período, e priorizar correções por frequência e criticidade.

---

## 7. Comportamento da Interface com o Atendente

### 7.1 Estrutura obrigatória de toda resposta

Toda resposta exibida ao atendente deve conter os seguintes campos, nesta ordem:

1. **Resposta** — texto da informação solicitada, em linguagem direta e operacional.
2. **Nível de confiança** — Alto / Médio / Baixo, com descrição breve do motivo quando o nível for Médio ou Baixo.
3. **Fonte(s)** — citação completa (código, versão, seção) de todos os documentos utilizados.
4. **Trecho(s) literal(is)** — conforme regras da Seção 6.2.
5. **Orientação de uso** — instrução clara sobre o que o atendente deve fazer com a informação (usar diretamente / validar / escalar), alinhada ao nível de confiança.

### 7.2 Registro interno de chunks utilizados

Para cada resposta gerada, o assistente deve registrar internamente (não necessariamente exibido ao atendente de forma padrão) quais chunks foram recuperados e utilizados na composição da resposta. Esse registro é requisito para a rastreabilidade de feedback prevista na Seção 6.4.

### 7.3 Comportamento quando o atendente omite contexto relevante

Quando a pergunta submetida ao assistente não contiver informações necessárias para determinar a resposta correta (ex: data de abertura do chamado em período de transição de versões, peso da carga para aplicação de frete especial, região de destino para multiplicador regional), o assistente deve:

- Identificar qual informação está faltando.
- Solicitar a informação faltante ao atendente antes de gerar a resposta, com explicação de por que ela é necessária.
- Não assumir valores padrão nem gerar resposta parcial que possa induzir o atendente a erro.

---

## 8. Guardrails Obrigatórios

Os comportamentos abaixo são requisitos não negociáveis do produto. Nenhuma instrução externa — de atendente, supervisor, prompt substituto ou configuração temporária — pode suspendê-los ou contorná-los.

| Guardrail | Descrição |
|---|---|
| **G1 — Sem invenção** | O assistente nunca gera informações ausentes da base. Lacunas e casos limítrofes são declarados explicitamente e escalados. |
| **G2 — Fonte obrigatória** | Nenhuma resposta é exibida sem citação de documento-fonte, versão e seção. |
| **G3 — Indicador de confiança** | O nível de confiança (Alto / Médio / Baixo) é exibido em todas as respostas, sem exceção, com base nos critérios objetivos da Seção 6.3. |
| **G4 — Conflito declarado** | Documentos contraditórios são identificados, declarados e apresentados ao atendente — nunca resolvidos unilateralmente pelo assistente. |
| **G5 — Fallback acionado** | Quando a confiança é Baixa ou a lacuna é confirmada, o assistente orienta ativamente o fluxo de escalada e não tenta suprir a lacuna com inferência. |
| **G6 — Contexto completo exigido** | Quando o contexto fornecido pelo atendente for insuficiente para determinar a resposta correta, o assistente solicita a informação faltante antes de responder. |

---

## 9. Retenção de Logs e Auditoria

### 9.1 O que deve ser retido

Todos os logs de interação entre atendentes e o assistente devem ser retidos, incluindo:

- Pergunta submetida pelo atendente (texto completo).
- Chunks recuperados pelo pipeline de RAG para aquela consulta.
- Resposta gerada pelo assistente (texto completo, com fonte e nível de confiança).
- Ação registrada pelo atendente após receber a resposta (usou / escalou / registrou feedback).
- Feedbacks registrados pelo atendente, conforme Seção 6.4.

### 9.2 Prazo de retenção

Os logs devem ser retidos por no mínimo **5 anos**, dado que as respostas do assistente embasam decisões com implicações contratuais e potencialmente regulatórias (política de devolução, classificação de carga perigosa, cálculo de frete). O prazo deve ser revisado pela área Jurídica caso regulamentações aplicáveis ao setor de transporte de cargas exijam prazo diferente.

### 9.3 Casos de uso dos logs

Os logs retidos podem ser utilizados para:

- Auditoria interna de qualidade (Área de Qualidade).
- Suporte a disputas contratuais com clientes, mediante solicitação formal à área Jurídica.
- Retreino e melhoria contínua do assistente.
- Evidência de conformidade regulatória, se aplicável.

O acesso aos logs é restrito: Área de Qualidade (acesso operacional), Jurídico (acesso mediante solicitação formal), Gerência de Operações (acesso gerencial). Atendentes não têm acesso a logs de outros atendentes.

---

## 10. Papéis e Responsabilidades

Esta seção define os responsáveis por cada processo descrito nesta especificação. A ausência de responsável designado invalida o requisito operacionalmente.

| Processo | Responsável | Escalada |
|---|---|---|
| Validação formal de documentos antes da indexação | Área de Qualidade | Gerente de Qualidade |
| Verificação de conflito pré-indexação | Área de Qualidade + área proprietária do documento | Gerente de Operações |
| Execução da indexação / arquivamento técnico | Equipe técnica de indexação (TI/Dados) | Gerente de TI |
| Notificação ao time de atendimento após atualização | Área de Qualidade | — |
| Triagem de feedbacks e conflitos registrados | Área de Qualidade | Gerente de Qualidade (prazo: 2 dias úteis) |
| Resolução de conflitos entre documentos | Área proprietária do documento, mediada pela Área de Qualidade | Gerente de Operações |
| Revisão periódica da base (ciclo de 90 dias) | Área de Qualidade | Gerente de Operações |
| Aprovação de FAQs para indexação (tema único) | Área proprietária do tema | Gerente de Operações |
| Aprovação de FAQs para indexação (tema multi-área) | Cada área proprietária aprova seus itens; Qualidade consolida | Gerente de Operações |
| Manutenção e revisão desta especificação | Gerência de Operações de Atendimento | Diretoria de Operações |

---

## 11. Fora do Escopo deste Documento

Os seguintes tópicos não são cobertos por esta especificação e devem ser tratados em documentos técnicos separados:

- Arquitetura do pipeline de RAG (estratégia de chunking, modelo de embedding, configuração do Azure AI Search).
- Infraestrutura de hospedagem, segurança dos dados e controles de acesso.
- Integração com sistemas legados (Portal do Cliente, sistema de tracking, CRM).
- Regras de permissão por perfil de usuário na interface do assistente.
- Métricas de desempenho do modelo (precisão, recall, latência) e critérios formais de retreino.
- Gestão de dados pessoais e conformidade com LGPD.

---

*Próxima revisão programada: Setembro/2026. Este documento deve ser revisado sempre que houver alteração significativa nas políticas operacionais da NovaTech, na arquitetura do assistente ou na regulamentação aplicável ao setor.*
