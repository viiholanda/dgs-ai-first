# Análise de Inconsistências — PROC-042 v1 vs v2

**Documentos analisados:** PROC-042-frete-especial-v1.md · PROC-042-v2-frete-especial-revisado.md
**Data da análise:** 03/06/2026
**Responsável pela análise:** —

---

## Problema estrutural central

> **Ausência de controle de versão formal.** Nenhum dos documentos declara explicitamente que substitui o outro. Ambos coexistem no SharePoint sem hierarquia clara, criando risco real de uso simultâneo de multiplicadores e fatores incompatíveis por equipes diferentes.

> **Período de transição mal delimitado.** A v2 define regra transitória (chamados abertos antes de 01/12/2023), mas não há mecanismo de controle para garantir que essa regra foi ou está sendo aplicada corretamente. O prazo já expirou sem confirmação formal de encerramento.

---

## Diferenças de conteúdo com impacto financeiro direto

### Fatores de peso

| Faixa de peso | v1 (mar/2023) | v2 (nov/2023) | Variação |
|---|---|---|---|
| 500 kg a 1.000 kg | 1,00 | 1,00 | — |
| 1.001 kg a 3.000 kg | **1,20** | **1,15** | −4,2% |
| Acima de 3.000 kg | **1,50** | **1,40** | −6,7% |

### Multiplicadores regionais

| Região | v1 (mar/2023) | v2 (nov/2023) | Variação |
|---|---|---|---|
| Sul | 1,2 | **1,3** | +8,3% |
| Sudeste | 1,0 | **1,1** | +10,0% |
| Centro-Oeste | 1,3 | **1,4** | +7,7% |
| Nordeste | 1,4 | **1,5** | +7,1% |
| Norte | 1,6 | **1,8** | +12,5% |

### Prazo de entrega

| | v1 | v2 |
|---|---|---|
| Prazo adicional para carga pesada | +2 dias úteis | **+3 dias úteis** |

### Desconto de volume

| Critério | v1 | v2 |
|---|---|---|
| Gatilho | > 10 fretes/mês | ≥ 8 fretes/mês |
| Percentual de desconto | Negociado individualmente (aditivo contratual) | **−5% sobre multiplicador regional** |
| Segundo gatilho | — | ≥ 15 fretes/mês → **−10%** |
| Descontos maiores | Negociação pelo Comercial | Aprovação da Diretoria Comercial |

---

## Análise de impacto por cenário

**Exemplo: carga de 2.000 kg com destino à Região Norte**

| Versão aplicada | Cálculo | Fator composto |
|---|---|---|
| v1 | Base × 1,6 × 1,20 | **1,92 × Base** |
| v2 | Base × 1,8 × 1,15 | **2,07 × Base** |
| **Diferença** | | **+7,8%** |

Para contratos de alto volume, essa diferença representa impacto financeiro relevante — tanto por risco de subfaturamento (se a v2 deveria estar sendo usada e não está) quanto por risco de sobrecobrar clientes (no caso inverso).

---

## Lacunas e ambiguidades não resolvidas

1. **Regra de desconto de volume da v1 não foi formalmente revogada.** O texto da v1 ainda menciona "aditivo contratual" como mecanismo. Clientes com contratos antigos baseados na v1 podem estar sob regime diferente da v2, gerando inconsistência contratual.

2. **A v2 não define o que acontece após 01/12/2023 com chamados transitórios ainda em aberto.** O prazo da disposição transitória expirou, mas não há confirmação formal de encerramento — a regra transitória pode estar sendo invocada indevidamente.

3. **A PROC-043 está em revisão pelo Compliance (declarado na v2), sem prazo definido.** Isso cria incerteza operacional para o processamento de cargas perigosas acima de 500 kg, que dependem dessa tabela específica.

4. **Ausência de rastro de aprovação.** Nenhuma das versões registra quem aprovou as mudanças, criando dificuldade de rastreabilidade em caso de contestação.

---

## Recomendações prioritárias

### Urgente

1. **Deprecar formalmente a v1** e inserir aviso de obsolescência no SharePoint, com link para a v2 como documento vigente e data de início de vigência claramente indicada.

2. **Auditar chamados processados entre 01/12/2023 e a data atual** para identificar fretes calculados com a tabela incorreta e avaliar necessidade de ajustes retroativos.

### Importante

3. **Revisar contratos de clientes com descontos de volume negociados sob a v1** antes de aplicar as novas regras percentuais da v2, evitando conflito com aditivos contratuais vigentes.

4. **Acompanhar a revisão da PROC-043** e atualizar as referências cruzadas assim que o Compliance concluir a revisão.

### Melhoria de processo

5. **Implementar controle de versão formal** em todos os procedimentos da Diretoria Comercial, incluindo: número de versão, data de vigência, campo "substitui o documento X", e registro de aprovação com nome e cargo do responsável.

---

*Análise elaborada com base nos documentos PROC-042 v1 (03/03/2023) e PROC-042 v2 (10/11/2023). Nenhuma alteração foi feita nos documentos originais.*
