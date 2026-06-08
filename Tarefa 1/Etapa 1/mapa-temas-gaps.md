# Mapa de Temas e Gaps — Base Documental NovaTech

**Documentos analisados:** 5 | **Data da análise:** junho/2026 | **Elaborado por:** Product Specialist

---

## 1. Documentos analisados

| Código | Nome | Versão | Status |
|---|---|---|---|
| POL-001 | Política de Devolução de Mercadorias | 3.1 | ✅ Normativo — uso obrigatório |
| PROC-042 v1 | Procedimento de Cálculo de Frete Especial | 1.0 | ⚠️ Coexiste com v2 sem hierarquia formal |
| PROC-042 v2 | Procedimento de Cálculo de Frete Especial (Revisado) | 2.0 | ⚠️ Coexiste com v1 sem substituição formal |
| SLA-2024 | Tabela de SLA por Tipo de Cliente | 2024.1 | ✅ Contratual |
| FAQ-Atendimento | Perguntas Frequentes do Time de Suporte | Não controlada | ⚠️ Informal — não validado por Compliance |

---

## 2. Mapa de temas cobertos

| Tema | POL-001 | PROC-042 v1 | PROC-042 v2 | SLA-2024 | FAQ |
|---|:---:|:---:|:---:|:---:|:---:|
| Devolução de mercadorias | ✅ | — | — | — | ✅ |
| Cálculo de frete especial | — | ✅ | ✅ | — | ✅ |
| Tiers de cliente (Gold/Silver/Standard) | — | — | — | ✅ | ✅ |
| SLA e prazos de resposta/resolução | — | — | — | ✅ | ✅ |
| Cargas perigosas | ✅ | ✅ (remete PROC-043) | — | — | ✅ |
| Seguro de carga | — | — | — | — | ✅ (único) |
| Descontos por volume | — | — | ✅ | — | ✅ (parcial) |
| Penalidades e créditos ao cliente | — | — | — | ✅ | — |
| Autonomia do atendente para descontos | — | — | — | — | ✅ (único) |
| Cargas danificadas / sinistros | — | — | — | — | ✅ (único) |

**Legenda:** ✅ Cobre o tema | — Não cobre

---

## 3. Hipóteses de gaps

### 🔴 Crítico — PROC-042: duas versões ativas sem hierarquia formal

**Documentos envolvidos:** PROC-042 v1, PROC-042 v2, FAQ

As duas versões do PROC-042 coexistem com parâmetros divergentes:

| Parâmetro | v1 (mar/2023) | v2 (nov/2023) |
|---|---|---|
| Fator de peso 1.001–3.000 kg | 1,2 | 1,15 |
| Fator de peso acima de 3.000 kg | 1,5 | 1,4 |
| Multiplicador Sudeste | 1,0 | 1,1 |
| Multiplicador Sul | 1,2 | 1,3 |
| Multiplicador Centro-Oeste | 1,3 | 1,4 |
| Multiplicador Nordeste | 1,4 | 1,5 |
| Multiplicador Norte | 1,6 | 1,8 |
| Prazo de entrega adicional | +2 dias úteis | +3 dias úteis |

Sem revogação formal da v1, o atendente não tem critério claro — exceto o workaround do FAQ ("usar v2 para chamados novos"). Existe risco de cálculos inconsistentes para chamados em fronteira de data (pré e pós 01/12/2023) ainda em processamento.

**Ação sugerida:** Emitir errata formal revogando a v1 e consolidar uma única versão vigente com data de corte explícita.

---

### 🔴 Crítico — FAQ informal como única fonte de verdade em temas sem cobertura normativa

**Documentos envolvidos:** FAQ-Atendimento

Os seguintes temas operacionais críticos são cobertos exclusivamente pelo FAQ, que é informal, não controlado por versão e não validado por Compliance ou Operações:

- Seguro de carga: taxas (0,3% padrão / 0,8% perigosas) e escopo temporal ("contratos a partir de 2023")
- Cargas danificadas: prazo de registro (48h) e canal (sinistros@novatech.com.br)
- Autonomia para desconto: atendente não possui, encaminhar ao Comercial
- Frete expresso para cargas perigosas

O próprio documento avisa: *"Confirmar informações críticas na documentação normativa."* O problema é que, para esses temas, não existe documentação normativa.

**Ação sugerida:** Criar políticas ou procedimentos formais para cada um desses temas, validados por Compliance e Operações. O FAQ pode continuar existindo como guia prático, mas referenciando documentos normativos.

---

### 🟠 Alto — Ausência de classificação de criticidade para devoluções e fretes especiais no SLA

**Documentos envolvidos:** SLA-2024, POL-001, PROC-042 v2

O SLA-2024 define dois tipos de chamado: incidentes críticos e chamados gerais — com prazos muito distintos (ex: resolução Gold: 4h vs. 24h). No entanto, não há critérios para classificar chamados originados de:

- Erros de devolução (POL-001)
- Erros de cálculo de frete especial (PROC-042)
- Cargas avariadas ou extraviadas

O atendente precisa inferir a classificação, o que abre espaço para subclassificação sistemática e descumprimento de SLA sem que o sistema de penalidades seja acionado.

**Ação sugerida:** Incluir no SLA-2024 (ou em anexo) uma tabela de classificação de criticidade por tipo de ocorrência.

---

### 🟠 Alto — Cargas perigosas: tratamento fragmentado entre documentos

**Documentos envolvidos:** POL-001, PROC-042 v1, FAQ

O tema "cargas perigosas" aparece em três documentos com tratamentos distintos e sem integração:

- POL-001: exclui da devolução padrão, encaminha ao ramal 4500 (Gestão de Riscos)
- PROC-042 v1: remete ao PROC-043 para frete acima de 500 kg
- FAQ: menciona frete expresso para perigosas sem base normativa

O PROC-043 não faz parte da base documental fornecida — pode estar desatualizado, inexistente ou de acesso restrito. Não há documento único que consolide o fluxo completo para cargas perigosas.

**Ação sugerida:** Mapear e disponibilizar o PROC-043; criar ou referenciar um fluxo consolidado de atendimento para cargas perigosas que integre devolução, frete e sinistro.

---

### 🔵 Médio — Descontos por volume sem reflexo no SLA ou na autonomia do atendente

**Documentos envolvidos:** PROC-042 v2, SLA-2024, FAQ

O PROC-042 v2 introduz descontos automáticos por volume (5% a partir de 8 fretes/mês; 10% acima de 15 fretes/mês), mas:

- O SLA-2024 não contempla como o volume de fretes impacta ou revalida o tier do cliente
- O FAQ deixa explícito que o atendente não tem autonomia para conceder descontos
- Não está documentado quem valida, aplica e comunica esses descontos ao cliente

**Ação sugerida:** Definir o processo de aplicação dos descontos automáticos: sistema, responsável, periodicidade e comunicação ao cliente.

---

### 🔵 Médio — Seguro de carga: sem documento normativo e escopo temporal restrito

**Documentos envolvidos:** FAQ-Atendimento

O FAQ menciona taxas de seguro aplicáveis "para contratos a partir de 2023", sem especificar:

- Cobertura (o que é e não é coberto)
- Processo de acionamento
- Prazo de pagamento do seguro
- Responsável pela gestão de sinistros além do e-mail mencionado
- Tratamento para contratos anteriores a 2023

**Ação sugerida:** Criar uma Política de Seguro de Carga formal, cobrindo taxas, escopo, processo de sinistro e vigência por tipo de contrato.

---

## 4. Resumo executivo

| Prioridade | Gap | Documentos | Ação principal |
|---|---|---|---|
| 🔴 Crítico | Duas versões do PROC-042 ativas sem hierarquia | PROC-042 v1, v2, FAQ | Revogar formalmente a v1 |
| 🔴 Crítico | FAQ como única fonte em temas críticos | FAQ | Criar políticas normativas para seguro, sinistros e desconto |
| 🟠 Alto | SLA sem critérios de classificação de criticidade | SLA-2024, POL-001, PROC-042 v2 | Tabela de classificação por tipo de ocorrência |
| 🟠 Alto | Cargas perigosas fragmentadas entre docs | POL-001, PROC-042 v1, FAQ | Consolidar fluxo + verificar PROC-043 |
| 🔵 Médio | Descontos por volume sem processo definido | PROC-042 v2, SLA-2024, FAQ | Definir responsável e fluxo de aplicação |
| 🔵 Médio | Seguro de carga sem política formal | FAQ | Criar Política de Seguro de Carga |
