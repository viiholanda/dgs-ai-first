import { useState } from "react";

// ── Color tokens ──
const T = {
  teal: "#0e7c86",
  tealLight: "#e6f3f4",
  tealBorder: "#bfe0e3",
  tealDark: "#1b3a3d",
  tealMid: "#5c7c80",
  purple: "#5b5fc7",
  purpleLight: "#ebebfa",
  purpleBorder: "#e0dffa",
  green: "#1a7f43",
  greenDark: "#136138",
  greenBg: "#e3f4ea",
  greenBorder: "#b6e0c6",
  amber: "#9a6700",
  amberDark: "#7a5200",
  amberBg: "#fdf3d8",
  amberBorder: "#ecd591",
  red: "#b42318",
  redDark: "#912018",
  redBg: "#fdecea",
  redBorder: "#f3c0bb",
  orange: "#c05621",
  orangeDark: "#9a3d0f",
  orangeBg: "#fdf0e3",
  orangeBorder: "#f3d9bb",
  orangeText: "#8a4a20",
  blue: "#3a55b8",
  blueDark: "#2f4bb0",
  blueBg: "#eef3ff",
  blueBorder: "#cdd9f7",
  blueText: "#2f3f86",
  gray1: "#242424",
  gray2: "#3b3a39",
  gray3: "#525252",
  gray4: "#616161",
  gray5: "#8a8886",
  gray6: "#a19f9d",
  gray7: "#c7c7c7",
  gray8: "#d6d5d4",
  gray9: "#e0dfde",
  gray10: "#e8e8e8",
  gray11: "#ededed",
  gray12: "#f0f0f0",
  gray13: "#f5f5f5",
  gray14: "#fafafa",
  gray15: "#fbfbfb",
  white: "#fff",
  bg: "#e7e6e6",
};

// ── Scenarios ──
const SCENARIOS = {
  alto: {
    label: "Alta confiança",
    desc: "Resposta direta, fonte única vigente",
    question: "Qual é o prazo de entrega para a região Sudeste no frete padrão?",
    ticket: "Chamado #48213",
    time: "17/06/2026 14:32",
    type: "answer", // answer | conflict | gap | entity | context
    answer: "O prazo de entrega para a região Sudeste na modalidade de frete padrão é de 3 a 5 dias úteis, contados a partir da confirmação do pedido.",
    confidence: "alto",
    sources: [
      {
        code: "POL-LOG-014",
        title: "Política de Prazos de Entrega",
        version: "v3.1",
        section: "Seção 4.2 — Prazos por Região",
        excerpt: '"Região Sudeste — Frete Padrão: 3 a 5 dias úteis contados a partir da confirmação do pedido."',
        status: "vigente",
      },
    ],
    guidance: "Aplicável a pedidos já confirmados. Para cargas acima de 30 kg, consulte a tabela de frete pesado (POL-LOG-014, Seção 6).",
    escalate: false,
    escalateText: "",
    conflictId: null,
    conflictNote: "",
  },
  conflito: {
    label: "Contradição documental",
    desc: "Duas fontes vigentes divergem (G4)",
    question: "Qual é o prazo para devolução de produto com defeito de fabricação?",
    ticket: "Chamado #48217",
    time: "17/06/2026 14:39",
    type: "conflict",
    answer: "",
    confidence: "medio",
    sources: [
      {
        letter: "A",
        code: "POL-DEV-007",
        title: "Política de Devoluções",
        version: "v2.0",
        section: "Seção 3.1 — Produtos com Defeito",
        claim: "O prazo para solicitação de devolução é de 7 dias corridos a partir do recebimento.",
        excerpt: '"O prazo para solicitação de devolução de produto com defeito é de 7 dias corridos a partir do recebimento."',
        status: "vigente",
      },
      {
        letter: "B",
        code: "PROC-DEV-012",
        title: "Procedimento de Logística Reversa",
        version: "v1.4",
        section: "Seção 2.3 — Janela de Coleta",
        claim: "A devolução de itens com defeito deve ser registrada em até 30 dias corridos após a entrega.",
        excerpt: '"A devolução de itens com defeito deve ser registrada em até 30 dias corridos após a entrega."',
        status: "vigente",
      },
    ],
    guidance: "Não comunique um prazo único ao cliente enquanto o conflito não for resolvido pela área responsável. Escale ao supervisor.",
    escalate: true,
    escalateText: "Conflito entre documentos vigentes — escale ao supervisor antes de responder ao cliente.",
    conflictId: "CF-2026-0412",
    conflictNote: "Dois documentos vigentes apresentam prazos divergentes para o mesmo tema. O assistente não escolhe entre eles.",
  },
  baixo: {
    label: "Baixa confiança",
    desc: "Cobertura parcial / tangencial",
    question: "Há custo adicional de frete para itens frágeis enviados a Manaus?",
    ticket: "Chamado #48224",
    time: "17/06/2026 14:51",
    type: "answer",
    answer: "A documentação menciona possíveis acréscimos para regiões remotas, mas não há regra específica para itens frágeis em Manaus. A cobertura encontrada é parcial e não sustenta uma resposta definitiva.",
    confidence: "baixo",
    sources: [
      {
        code: "SLA-FRT-003",
        title: "SLA de Frete e Regiões de Atendimento",
        version: "v1.2",
        section: "Seção 5 — Regiões Remotas",
        excerpt: '"Envios para regiões remotas podem estar sujeitos a acréscimo tarifário, conforme tabela regional vigente."',
        status: "transicao",
        transicaoNota: "Substituído por SLA-FRT-004 a partir de 01/08/2026",
      },
    ],
    guidance: "Não confirme valores ao cliente com base nesta resposta. Valide com o supervisor ou consulte a tabela regional aplicável antes de prosseguir.",
    escalate: true,
    escalateText: "Confiança baixa — recomenda-se validar com o supervisor antes de responder ao cliente.",
    conflictId: null,
    conflictNote: "",
  },
  lacuna: {
    label: "Lacuna documental",
    desc: "Tema sem cobertura na base (G5)",
    question: "Qual é a política de reembolso para pedidos perdidos em trânsito internacional?",
    ticket: "Chamado #48231",
    time: "17/06/2026 15:03",
    type: "gap",
    answer: "",
    confidence: "nenhum",
    sources: [],
    guidance: "Não há informação na base para compor resposta. Escale ao supervisor para tratamento manual e sinalize a lacuna para revisão documental.",
    escalate: true,
    escalateText: "Sem cobertura na base — escale ao supervisor e/ou solicite revisão documental.",
    conflictId: null,
    conflictNote: "",
    gapText: "Nenhum documento vigente ou em transição trata de reembolso para pedidos perdidos em trânsito internacional. O assistente não compõe resposta a partir de temas adjacentes nem infere regras inexistentes.",
  },
  entidade: {
    label: "Entidade inexistente",
    desc: 'Menção a entidade não reconhecida (VC-07)',
    question: 'Qual é a política de frete para clientes do tier "Platinum"?',
    ticket: "Chamado #48235",
    time: "17/06/2026 15:10",
    type: "entity",
    answer: "",
    confidence: "nenhum",
    sources: [],
    guidance: 'Confirme o tier real do cliente no sistema. Caso "Platinum" seja uma categoria nova ainda não formalizada, escale para validação documental antes de qualquer comunicação.',
    escalate: true,
    escalateText: "Entidade não reconhecida — confirme os dados do cliente antes de prosseguir.",
    conflictId: null,
    conflictNote: "",
    entityInfo: {
      mentioned: "Platinum",
      field: "tier de cliente",
      validValues: ["Bronze", "Prata", "Ouro"],
      sourceDoc: "POL-CLI-002 v2.1",
    },
  },
  contexto: {
    label: "Contexto insuficiente",
    desc: "Solicitação de dados faltantes (G6)",
    question: "Qual o prazo de entrega para o pedido do cliente?",
    ticket: "Chamado #48240",
    time: "17/06/2026 15:18",
    type: "context",
    answer: "",
    confidence: null,
    sources: [],
    guidance: "",
    escalate: false,
    escalateText: "",
    conflictId: null,
    conflictNote: "",
    missingFields: [
      { field: "Região de destino", hint: "Ex.: Sudeste, Norte, Nordeste" },
      { field: "Modalidade de frete", hint: "Padrão, expresso ou econômico" },
      { field: "Peso da carga", hint: "Necessário se acima de 30 kg (frete pesado)" },
    ],
    contextNote: "A consulta não contém informações suficientes para identificar a regra de prazo aplicável. Informe os dados abaixo para que o assistente possa compor uma resposta com base documental.",
  },
};

// ── Confidence chip ──
function ConfidenceChip({ level }) {
  const configs = {
    alto: {
      label: "Alta",
      color: T.green,
      darkColor: T.greenDark,
      bg: T.greenBg,
      border: T.greenBorder,
      bars: [true, true, true],
      desc: "Fonte única, vigente e diretamente aplicável.",
    },
    medio: {
      label: "Média",
      color: T.amber,
      darkColor: T.amberDark,
      bg: T.amberBg,
      border: T.amberBorder,
      bars: [true, true, false],
      desc: "Múltiplas fontes vigentes em conflito.",
    },
    baixo: {
      label: "Baixa",
      color: T.red,
      darkColor: T.redDark,
      bg: T.redBg,
      border: T.redBorder,
      bars: [true, false, false],
      desc: "Cobertura parcial / tangencial.",
    },
    nenhum: {
      label: "Não aplicável",
      color: T.gray5,
      darkColor: "#5c5c5c",
      bg: T.gray13,
      border: "#dcdcdc",
      bars: [false, false, false],
      desc: "Sem cobertura documental — lacuna ou entidade inexistente.",
    },
  };
  const c = configs[level];
  if (!c) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: "6px 13px" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: c.color }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: c.darkColor }}>{c.label}</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {c.bars.map((on, i) => (
          <span key={i} style={{ width: 34, height: 6, borderRadius: 3, background: on ? c.color : (level === "nenhum" ? "#e0e0e0" : `${c.color}30`) }} />
        ))}
      </div>
      <span style={{ fontSize: 12.5, color: T.gray4 }}>{c.desc}</span>
    </div>
  );
}

// ── Status badge ──
function StatusBadge({ status, transicaoNota }) {
  if (status === "vigente") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, background: T.greenBg, color: T.greenDark, border: `1px solid ${T.greenBorder}`, borderRadius: 5, padding: "2px 8px" }}>
        ✓ Versão vigente
      </span>
    );
  }
  return (
    <span title={transicaoNota || ""} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, background: T.amberBg, color: T.amberDark, border: `1px solid ${T.amberBorder}`, borderRadius: 5, padding: "2px 8px", cursor: transicaoNota ? "help" : "default" }}>
      ↻ Em transição{transicaoNota ? " ⓘ" : ""}
    </span>
  );
}

// ── Section divider ──
const Divider = () => <div style={{ borderTop: `1px solid ${T.gray12}`, margin: "0" }} />;

// ── Main component ──
export default function NovaTechMockup() {
  const [activeKey, setActiveKey] = useState("alto");
  const sc = SCENARIOS[activeKey];

  const isAnswer = sc.type === "answer";
  const isConflict = sc.type === "conflict";
  const isGap = sc.type === "gap";
  const isEntity = sc.type === "entity";
  const isContext = sc.type === "context";
  const hasSources = sc.sources.length > 0;
  const showFiveFields = !isContext; // G6: fields suppressed until context is provided

  return (
    <div style={{ minHeight: "100vh", background: T.bg, padding: "40px 24px 80px", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: T.gray1, WebkitFontSmoothing: "antialiased" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>

        {/* ── Page header ── */}
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: T.teal, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>N</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.teal, letterSpacing: ".04em", textTransform: "uppercase" }}>Assistente NovaTech · Query Endpoint</div>
          </div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: "-0.6px", color: "#1b1b1b" }}>Interface de resposta no Microsoft Teams</h1>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.55, color: T.gray3, maxWidth: 760 }}>
            Mockup de alta fidelidade do assistente corporativo de RAG usado por atendentes de logística. Toda resposta carrega fonte, nível de confiança, documento vigente e rastreabilidade — os guardrails G1–G6 são visíveis na própria tela.
          </p>
        </header>

        {/* ── State tabs ── */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: T.gray5, marginBottom: 10 }}>Estados representados</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(SCENARIOS).map(([key, s]) => {
              const active = key === activeKey;
              return (
                <button key={key} onClick={() => setActiveKey(key)} style={{
                  flex: 1, minWidth: 170, textAlign: "left", cursor: "pointer",
                  border: active ? `1.5px solid ${T.teal}` : `1.5px solid ${T.gray9}`,
                  background: active ? T.teal : T.white,
                  color: active ? T.white : T.gray2,
                  borderRadius: 10, padding: "12px 14px",
                  boxShadow: active ? `0 4px 14px rgba(14,124,134,.28)` : "none",
                  transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</div>
                  <div style={{ fontSize: 11, marginTop: 3, opacity: active ? 0.85 : 0.7, lineHeight: 1.35 }}>{s.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Teams window ── */}
        <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,.20)", border: `1px solid ${T.gray8}`, background: T.white }}>
          {/* title bar */}
          <div style={{ height: 48, background: T.purple, display: "flex", alignItems: "center", padding: "0 16px", gap: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffffff55" }} />)}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ background: "#ffffff22", borderRadius: 6, height: 30, width: 420, display: "flex", alignItems: "center", padding: "0 12px", color: "#ffffffcc", fontSize: 13 }}>Pesquisar (Ctrl+E)</div>
            </div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e8a33d", color: "#3b2a00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>RM</div>
          </div>

          <div style={{ display: "flex", height: 700 }}>
            {/* app rail */}
            <div style={{ width: 68, background: T.purpleLight, borderRight: `1px solid ${T.purpleBorder}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0", gap: 18 }}>
              {[["Atividade", false], ["Chat", false], ["NovaTech", true], ["Calendário", false]].map(([name, active]) => (
                <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: T.purple, opacity: active ? 1 : 0.6, position: "relative" }}>
                  {active ? (
                    <span style={{ width: 24, height: 24, borderRadius: 7, background: T.teal, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>N</span>
                  ) : (
                    <span style={{ width: 22, height: 22, borderRadius: name === "Calendário" ? "50%" : 6, border: "2px solid currentColor" }} />
                  )}
                  <span style={{ fontSize: 9, fontWeight: active ? 700 : 400 }}>{name}</span>
                  {active && <span style={{ position: "absolute", left: -14, top: 2, width: 3, height: 24, borderRadius: 2, background: T.purple }} />}
                </div>
              ))}
            </div>

            {/* conversation list */}
            <div style={{ width: 248, background: "#f5f5fb", borderRight: "1px solid #e6e6ef", padding: "14px 0", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "0 16px 12px", fontSize: 17, fontWeight: 700, color: T.gray1 }}>Assistente NovaTech</div>
              <div style={{ padding: "0 12px 10px" }}>
                <div style={{ background: T.white, border: `1px solid ${T.gray9}`, borderRadius: 6, height: 32, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 12.5, color: T.gray5 }}>Buscar em chamados</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: T.gray5, padding: "6px 16px 4px" }}>Recentes</div>
              <div style={{ background: "#e8e8f8", borderLeft: `3px solid ${T.purple}`, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: T.teal, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flex: "none" }}>N</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Assistente NovaTech</div>
                  <div style={{ fontSize: 11.5, color: T.gray4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sc.question}</div>
                </div>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", gap: 10, alignItems: "center", opacity: 0.7 }}>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#c7c7d9", color: T.gray2, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flex: "none" }}>SL</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Supervisão · Logística</div>
                  <div style={{ fontSize: 11.5, color: T.gray4 }}>Canal de escalação</div>
                </div>
              </div>
            </div>

            {/* chat thread */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.white, minWidth: 0 }}>
              {/* chat header */}
              <div style={{ height: 60, borderBottom: `1px solid ${T.gray11}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 12, flex: "none" }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: T.teal, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>N</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    Assistente NovaTech
                    <span style={{ fontSize: 10, fontWeight: 700, background: T.blueBg, color: T.blue, border: `1px solid ${T.blueBorder}`, borderRadius: 4, padding: "1px 6px", letterSpacing: ".03em" }}>BOT · RAG</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.gray4 }}>Consulta base de conhecimento operacional · documentos vigentes</div>
                </div>
                <div style={{ fontSize: 12, color: T.gray5, border: `1px solid ${T.gray9}`, borderRadius: 6, padding: "5px 10px" }}>{sc.ticket}</div>
              </div>

              {/* messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px", display: "flex", flexDirection: "column", gap: 18 }}>

                {/* user question */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ maxWidth: "74%" }}>
                    <div style={{ background: T.purple, color: T.white, borderRadius: "8px 8px 2px 8px", padding: "11px 14px", fontSize: 14, lineHeight: 1.5 }}>{sc.question}</div>
                    <div style={{ textAlign: "right", fontSize: 11, color: T.gray5, marginTop: 4 }}>Você · {sc.time}</div>
                  </div>
                </div>

                {/* assistant response */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: T.teal, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flex: "none", marginTop: 2 }}>N</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.gray1 }}>Assistente NovaTech</span>
                      <span style={{ fontSize: 11, color: T.gray5 }}>{sc.time} · {sc.ticket}</span>
                    </div>

                    <div style={{ border: `1px solid ${T.gray10}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.04)" }}>

                      {/* ── CONFLICT BANNER ── */}
                      {isConflict && (
                        <div style={{ background: T.orangeBg, borderBottom: `1px solid ${T.orangeBorder}`, padding: "13px 16px", display: "flex", gap: 11, alignItems: "flex-start" }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: T.orange, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flex: "none" }}>!</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 13.5, fontWeight: 700, color: T.orangeDark }}>Documentos contraditórios detectados</span>
                              <span style={{ fontFamily: "'SFMono-Regular',Consolas,monospace", fontSize: 11, fontWeight: 700, background: "#f8e4d0", color: T.orange, border: `1px solid ${T.orangeBorder}`, borderRadius: 5, padding: "1px 7px" }}>{sc.conflictId}</span>
                            </div>
                            <div style={{ fontSize: 12.5, color: T.orangeText, lineHeight: 1.5, marginTop: 2 }}>
                              {sc.conflictNote} Um registro de conflito foi gerado para triagem prioritária (SLA de 2 dias úteis).
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── ENTITY NOT FOUND BANNER ── */}
                      {isEntity && (
                        <div style={{ background: "#fef3f2", borderBottom: `1px solid ${T.redBorder}`, padding: "13px 16px", display: "flex", gap: 11, alignItems: "flex-start" }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: T.red, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flex: "none" }}>✕</span>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.redDark }}>Entidade não reconhecida na base documental</div>
                            <div style={{ fontSize: 12.5, color: "#7a3530", lineHeight: 1.5, marginTop: 2 }}>
                              O tier <strong>"{sc.entityInfo.mentioned}"</strong> não consta na documentação formal vigente.
                              Os valores definidos para {sc.entityInfo.field} são: <strong>{sc.entityInfo.validValues.join(", ")}</strong> ({sc.entityInfo.sourceDoc}).
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── CONTEXT REQUEST BANNER ── */}
                      {isContext && (
                        <div style={{ background: "#f0f4ff", borderBottom: `1px solid ${T.blueBorder}`, padding: "13px 16px", display: "flex", gap: 11, alignItems: "flex-start" }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: T.blue, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flex: "none" }}>?</span>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.blueDark }}>Contexto insuficiente para compor resposta</div>
                            <div style={{ fontSize: 12.5, color: T.blueText, lineHeight: 1.5, marginTop: 2 }}>
                              {sc.contextNote}
                            </div>
                          </div>
                        </div>
                      )}

                      <div style={{ padding: "18px 18px 4px" }}>

                        {/* ── CONTEXT: missing fields (G6) ── */}
                        {isContext && (
                          <div style={{ marginBottom: 18 }}>
                            <SectionLabel icon="?" color={T.blue} label="Informações necessárias" sublabel="G6 · preencha antes de reenviar" />
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                              {sc.missingFields.map((f, i) => (
                                <div key={i} style={{ border: `1.5px dashed ${T.blueBorder}`, background: "#f8faff", borderRadius: 9, padding: "11px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                                  <span style={{ width: 24, height: 24, borderRadius: 6, background: T.blueBg, color: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flex: "none" }}>{i + 1}</span>
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: T.gray1 }}>{f.field}</div>
                                    <div style={{ fontSize: 12.5, color: T.gray4 }}>{f.hint}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: 12.5, color: T.gray5, marginTop: 10, fontStyle: "italic" }}>
                              A resposta estruturada será composta após o envio das informações acima. Os cinco campos obrigatórios estão suspensos enquanto o contexto é insuficiente (C2 + G6).
                            </div>
                          </div>
                        )}

                        {/* ── ① RESPOSTA ── */}
                        {showFiveFields && (
                          <div style={{ marginBottom: 18 }}>
                            <SectionLabel icon="✦" color={T.teal} label="Resposta" sublabel={isConflict ? "declaração de conflito (G4)" : isGap ? "declaração de lacuna (G5)" : isEntity ? "declaração de entidade inexistente (G1)" : "gerada pelo assistente"} />

                            {isAnswer && (
                              <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: "#1b1b1b" }}>{sc.answer}</p>
                            )}

                            {isConflict && (
                              <>
                                <p style={{ margin: "8px 0 12px", fontSize: 14, lineHeight: 1.6, color: "#1b1b1b" }}>
                                  Há <strong>duas versões vigentes divergentes</strong> sobre este tema. O assistente não escolhe entre elas — as duas são apresentadas abaixo para decisão humana.
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                  {sc.sources.map((src, i) => (
                                    <div key={i} style={{ border: `1px solid ${T.orangeBorder}`, background: "#fffaf4", borderRadius: 9, padding: "12px 13px" }}>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: T.orange, marginBottom: 4 }}>VERSÃO {src.letter} · {src.code}</div>
                                      <div style={{ fontSize: 14, lineHeight: 1.5, color: "#1b1b1b" }}>{src.claim}</div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}

                            {isGap && (
                              <div style={{ border: "1px dashed #c7c7c7", background: T.gray14, borderRadius: 9, padding: "14px 15px", marginTop: 8 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#5c5c5c", marginBottom: 4 }}>Lacuna documental declarada</div>
                                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: T.gray2 }}>{sc.gapText}</p>
                              </div>
                            )}

                            {isEntity && (
                              <div style={{ border: `1px solid ${T.redBorder}`, background: "#fef8f7", borderRadius: 9, padding: "14px 15px", marginTop: 8 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: T.redDark, marginBottom: 6 }}>Entidade mencionada não existe na política vigente</div>
                                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: T.gray2 }}>
                                  O tier <strong>"{sc.entityInfo.mentioned}"</strong> não está definido na documentação formal. A política vigente ({sc.entityInfo.sourceDoc}) define os seguintes tiers: <strong>{sc.entityInfo.validValues.join(", ")}</strong>. O assistente não infere regras para entidades inexistentes (G1).
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── ② NÍVEL DE CONFIANÇA ── */}
                        {showFiveFields && (
                          <div style={{ marginBottom: 18, borderTop: `1px solid ${T.gray12}`, paddingTop: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: T.gray5, marginBottom: 9 }}>Nível de confiança</div>
                            <ConfidenceChip level={sc.confidence} />
                          </div>
                        )}

                        {/* ── ③ FONTES ── */}
                        {showFiveFields && (
                          <div style={{ marginBottom: 18, borderTop: `1px solid ${T.gray12}`, paddingTop: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: T.gray5, marginBottom: 9 }}>Fontes documentais</div>
                            {hasSources ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {sc.sources.map((src, i) => (
                                  <div key={i} style={{ border: `1px solid ${T.gray10}`, borderRadius: 9, padding: "11px 13px", background: T.gray15 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                                      <span style={{ fontFamily: "'SFMono-Regular',Consolas,monospace", fontSize: 12, fontWeight: 700, background: T.blueBg, color: T.blueDark, border: `1px solid ${T.blueBorder}`, borderRadius: 5, padding: "2px 8px" }}>{src.code}</span>
                                      <span style={{ fontSize: 13.5, fontWeight: 600, color: T.gray1 }}>{src.title}</span>
                                      <span style={{ fontFamily: "'SFMono-Regular',Consolas,monospace", fontSize: 11.5, color: T.gray5 }}>{src.version}</span>
                                      <StatusBadge status={src.status} transicaoNota={src.transicaoNota} />
                                    </div>
                                    <div style={{ fontSize: 12.5, color: T.gray3, marginTop: 6 }}>
                                      <strong style={{ color: T.gray2 }}>Seção utilizada:</strong> {src.section}
                                    </div>
                                    {src.transicaoNota && (
                                      <div style={{ fontSize: 11.5, color: T.amberDark, marginTop: 4, fontStyle: "italic" }}>
                                        ↻ {src.transicaoNota}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (isGap || isEntity) ? (
                              <div style={{ fontSize: 13, color: T.gray5, fontStyle: "italic" }}>
                                {isEntity
                                  ? `A entidade "${sc.entityInfo.mentioned}" não existe na base. Documento de referência consultado: ${sc.entityInfo.sourceDoc}.`
                                  : "Nenhuma fonte vigente corresponde a esta consulta. Nada foi citado para evitar resposta sem lastro documental (G2)."}
                              </div>
                            ) : null}
                          </div>
                        )}

                        {/* ── ④ TRECHOS LITERAIS ── */}
                        {showFiveFields && hasSources && (
                          <div style={{ marginBottom: 18, borderTop: `1px solid ${T.gray12}`, paddingTop: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: T.gray5 }}>Trechos literais do documento</span>
                              <span style={{ fontSize: 10, fontWeight: 600, background: T.gray12, color: T.gray4, borderRadius: 4, padding: "1px 7px" }}>conteúdo documentado · não gerado</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              {sc.sources.map((src, i) => (
                                <div key={i} style={{ borderLeft: `3px solid ${T.teal}`, background: "#f4f9fa", borderRadius: "0 8px 8px 0", padding: "11px 14px" }}>
                                  <div style={{ fontSize: 14, lineHeight: 1.6, color: T.tealDark, fontStyle: "italic" }}>{src.excerpt}</div>
                                  <div style={{ fontSize: 11, color: T.tealMid, marginTop: 6, fontFamily: "'SFMono-Regular',Consolas,monospace" }}>— {src.code} {src.version}, {src.section}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ── ⑤ ORIENTAÇÃO DE USO ── */}
                        {showFiveFields && sc.guidance && (
                          <div style={{ marginBottom: 16, borderTop: `1px solid ${T.gray12}`, paddingTop: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: T.gray5, marginBottom: 8 }}>Orientação de uso</div>
                            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: T.gray2 }}>{sc.guidance}</p>
                          </div>
                        )}

                        {/* ── Escalation ── */}
                        {sc.escalate && (
                          <div style={{ background: T.blueBg, border: `1px solid ${T.blueBorder}`, borderRadius: 10, padding: "13px 14px", marginBottom: 16, display: "flex", gap: 11, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                              <span style={{ width: 24, height: 24, borderRadius: 6, background: T.blue, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flex: "none" }}>↑</span>
                              <div style={{ fontSize: 13, color: T.blueText, lineHeight: 1.45 }}>{sc.escalateText}</div>
                            </div>
                            <button style={{ cursor: "pointer", border: "none", background: T.blue, color: T.white, fontSize: 12.5, fontWeight: 700, borderRadius: 6, padding: "8px 14px", flex: "none" }}>Escalar ao supervisor</button>
                          </div>
                        )}

                        {/* ── Feedback (more visible in critical states) ── */}
                        {(isConflict || isGap || isEntity) && (
                          <div style={{ background: "#f9f9f9", border: `1px solid ${T.gray10}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontSize: 12.5, color: T.gray3 }}>
                              {isConflict ? "Este conflito precisa ser resolvido pela área responsável." : isEntity ? "Se esta entidade é nova, a base precisa ser atualizada." : "Esta lacuna pode indicar necessidade de novo documento."}
                            </div>
                            <button style={{ cursor: "pointer", border: `1px solid ${T.teal}`, background: T.tealLight, color: T.teal, fontSize: 12, fontWeight: 700, borderRadius: 6, padding: "6px 12px", flex: "none" }}>Reportar feedback</button>
                          </div>
                        )}
                      </div>

                      {/* card footer */}
                      <div style={{ background: T.gray14, borderTop: `1px solid ${T.gray12}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 11.5, color: T.gray5, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gray5 }} />
                          Consulta registrada em {sc.time} · {sc.ticket}
                        </div>
                        <div style={{ display: "flex", gap: 14 }}>
                          {showFiveFields && <span style={{ fontSize: 11.5, color: T.gray5, cursor: "pointer" }}>Trechos rastreados ↗</span>}
                          <span style={{ fontSize: 11.5, color: T.gray5, cursor: "pointer" }}>Reportar feedback</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* composer */}
              <div style={{ borderTop: `1px solid ${T.gray11}`, padding: "14px 22px", flex: "none" }}>
                <div style={{ border: `1px solid ${T.gray8}`, borderRadius: 9, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, fontSize: 13.5, color: T.gray5 }}>Ex.: "Prazo de frete padrão para região Sudeste, carga até 15 kg"</div>
                  <button style={{ border: "none", background: T.purple, color: T.white, width: 32, height: 32, borderRadius: 7, cursor: "pointer", fontSize: 14 }}>➤</button>
                </div>
                <div style={{ fontSize: 11, color: T.gray6, marginTop: 7 }}>Inclua região, modalidade e peso na pergunta para evitar etapas adicionais. Respostas compostas a partir de documentos formais vigentes.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ DOCUMENTATION ══════════ */}

        {/* ── Wireframe anotado ── */}
        <Section n="02" title="Wireframe anotado" subtitle="Estrutura esquemática do card de resposta. Cada elemento mapeia para um requisito obrigatório e a um guardrail.">
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 340, background: T.white, border: `1px solid ${T.gray9}`, borderRadius: 12, padding: 20 }}>
              <div style={{ border: "1.5px dashed #c7c7c7", borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { n: 1, bg: "#ececf6", h: 34, align: "flex-end", color: T.teal },
                  { n: 7, bg: T.orangeBg, h: 30, border: T.orangeBorder, color: T.orange },
                  { n: 11, bg: "#f0f4ff", h: 30, border: T.blueBorder, color: T.blue },
                  { n: 2, bg: T.tealLight, h: 48, border: T.tealBorder, color: T.teal },
                  { n: 8, bg: "#fef3f2", h: 30, border: T.redBorder, color: T.red },
                  { n: 6, bg: "#eef0f0", h: 30, color: T.teal },
                  { n: 3, bg: "#eef0f0", h: 44, color: T.teal, extra: { n: 9, color: T.greenDark } },
                  { n: 4, bg: "#f4f9fa", h: 40, color: T.teal, borderLeft: T.teal },
                  { n: 5, bg: "#eef0f0", h: 30, color: T.teal },
                  { n: 10, bg: "#e9eefb", h: 32, border: T.blueBorder, color: T.blue },
                  { n: 12, bg: "#f7f7f7", h: 24, color: T.gray5 },
                ].map((row) => (
                  <div key={row.n} style={{
                    display: "flex", justifyContent: row.align || "flex-start",
                    ...(row.align === "flex-end" ? {} : {}),
                  }}>
                    <div style={{
                      background: row.bg,
                      border: row.border ? `1px solid ${row.border}` : undefined,
                      borderLeft: row.borderLeft ? `3px solid ${row.borderLeft}` : undefined,
                      borderRadius: row.borderLeft ? "0 6px 6px 0" : 6,
                      height: row.h,
                      width: row.align === "flex-end" ? "60%" : "100%",
                      position: "relative",
                    }}>
                      <WireNum n={row.n} color={row.color} left />
                      {row.extra && <WireNum n={row.extra.n} color={row.extra.color} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 8 }}>
              {WIRE_LEGEND.map((w) => (
                <div key={w.n} style={{ display: "flex", gap: 11, alignItems: "flex-start", background: T.white, border: `1px solid ${T.gray10}`, borderRadius: 9, padding: "10px 12px" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#1b1b1b", color: T.white, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{w.n}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: T.gray1 }}>{w.title}</div>
                    <div style={{ fontSize: 12, color: T.gray4, lineHeight: 1.45, marginTop: 1 }}>{w.desc}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 10.5, fontWeight: 700, color: T.teal, background: T.tealLight, borderRadius: 5, padding: "2px 7px", flex: "none", whiteSpace: "nowrap" }}>{w.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Components ── */}
        <Section n="03" title="Componentes da interface">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: 14 }}>
            {COMPONENTS.map((c, i) => (
              <div key={i} style={{ background: T.white, border: `1px solid ${T.gray10}`, borderRadius: 11, padding: "16px 17px" }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: T.gray1, marginBottom: 5 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: T.gray3, lineHeight: 1.55 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Flow ── */}
        <Section n="04" title="Fluxo de interação do atendente">
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", alignItems: "stretch" }}>
            {FLOW.map((f) => (
              <div key={f.n} style={{ flex: 1, minWidth: 175, background: T.white, border: `1px solid ${T.gray10}`, borderRadius: 11, padding: "15px 16px", margin: "0 8px 12px 0" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.teal, marginBottom: 6 }}>PASSO {f.n}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.gray1, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12.5, color: T.gray4, lineHeight: 1.5 }}>{f.body}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: T.gray3, background: T.white, border: `1px solid ${T.gray10}`, borderRadius: 11, padding: "14px 16px", marginTop: 4, lineHeight: 1.55 }}>
            <strong>Meta operacional:</strong> resposta confiável e rastreável em menos de 30 segundos. A estrutura fixa de 5 campos permite leitura por escaneamento — o atendente vê confiança e fonte sem abrir documentos.
          </div>
        </Section>

        {/* ── UX Rationale ── */}
        <Section n="05" title="Justificativa das decisões de UX">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {RATIONALE.map((r, i) => (
              <div key={i} style={{ background: T.white, border: `1px solid ${T.gray10}`, borderRadius: 11, padding: "15px 17px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.teal, background: T.tealLight, borderRadius: 6, padding: "4px 9px", flex: "none", whiteSpace: "nowrap", marginTop: 1 }}>{r.tag}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.gray1, marginBottom: 3 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: T.gray3, lineHeight: 1.55 }}>{r.body}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Mapping table ── */}
        <Section n="06" title="Como a interface atende aos requisitos"
          subtitle={<>Cada requisito obrigatório do <code style={{ background: "#ececec", padding: "1px 5px", borderRadius: 4, fontSize: 12.5 }}>requirements.md</code> ↔ elemento visível na tela ↔ guardrail correspondente.</>}>
          <div style={{ background: T.white, border: `1px solid ${T.gray10}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.6fr 0.8fr", background: T.gray13, borderBottom: `1px solid ${T.gray10}`, fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: T.gray5 }}>
              <div style={{ padding: "11px 15px" }}>Requisito</div>
              <div style={{ padding: "11px 15px" }}>Elemento na interface</div>
              <div style={{ padding: "11px 15px" }}>Guardrail / VC</div>
            </div>
            {MAPPING.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.6fr 0.8fr", borderBottom: `1px solid #f2f2f2`, fontSize: 13 }}>
                <div style={{ padding: "12px 15px", fontWeight: 600, color: T.gray1 }}>{m.req}</div>
                <div style={{ padding: "12px 15px", color: T.gray3, lineHeight: 1.5 }}>{m.ui}</div>
                <div style={{ padding: "12px 15px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.blueDark, background: T.blueBg, border: `1px solid ${T.blueBorder}`, borderRadius: 5, padding: "2px 8px" }}>{m.gr}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ marginTop: 40, textAlign: "center", fontSize: 12, color: T.gray6 }}>
          Assistente NovaTech · Query Endpoint v1.1 · Mockup corrigido conforme análise Tech Lead
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ──
function SectionLabel({ icon, color, label, sublabel }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ width: 14, height: 14, borderRadius: 4, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 800 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color }}>{label}</span>
      {sublabel && <span style={{ fontSize: 10, fontWeight: 600, background: "#f0f0f0", color: "#616161", borderRadius: 4, padding: "1px 7px" }}>{sublabel}</span>}
    </div>
  );
}

function WireNum({ n, color, left }) {
  return (
    <span style={{
      position: "absolute",
      ...(left ? { left: -12 } : { right: 8 }),
      top: "50%", transform: "translateY(-50%)",
      width: 22, height: 22, borderRadius: "50%", background: color, color: "#fff",
      fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
    }}>{n}</span>
  );
}

function Section({ n, title, subtitle, children }) {
  return (
    <section style={{ marginTop: 46 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: T.teal, marginBottom: 6 }}>Entregável {n}</div>
      <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, letterSpacing: "-0.4px" }}>{title}</h2>
      {subtitle && <p style={{ margin: "0 0 18px", fontSize: 14, color: "#616161", maxWidth: 720 }}>{subtitle}</p>}
      {!subtitle && <div style={{ marginBottom: 18 }} />}
      {children}
    </section>
  );
}

// ── Data: wireframe legend (updated with G6, entity, conflict ID) ──
const WIRE_LEGEND = [
  { n: 1, title: "Pergunta do usuário", desc: "Bolha alinhada à direita, replicada no cabeçalho do card.", tag: "Req · Pergunta" },
  { n: 2, title: "Resposta / declaração de estado", desc: "Marcada como gerada. Em conflito/lacuna/entidade, declara o estado em vez de responder (C2 formalizado).", tag: "G1 · C2" },
  { n: 3, title: "Fonte + ID + seção", desc: "Código do documento, versão e seção utilizada, em chip monoespaçado.", tag: "G2 · VC-08" },
  { n: 4, title: "Trecho literal", desc: 'Citação com borda lateral e fundo — visivelmente "documentado".', tag: "G2 · Trecho" },
  { n: 5, title: "Orientação de uso", desc: "Como aplicar a resposta com segurança no atendimento.", tag: "C2 · Campo 5" },
  { n: 6, title: "Nível de confiança", desc: 'Chip colorido + medidor de 3 segmentos. 4 estados: Alto, Médio, Baixo, Não aplicável.', tag: "G3 · VC-03" },
  { n: 7, title: "Aviso de contradição", desc: "Banner laranja com ID do conflito rastreável (ex.: CF-2026-0412).", tag: "G4 · VC-10" },
  { n: 8, title: "Alerta de entidade inexistente", desc: "Banner vermelho que lista os valores válidos da entidade (VC-07 separado de lacuna).", tag: "G1 · VC-07" },
  { n: 9, title: "Selo de vigência / transição", desc: 'Selo "Versão vigente" ou "Em transição" com nota de validade.', tag: "C4 · VC-09" },
  { n: 10, title: "Escalação ao supervisor", desc: "Sugestão + botão quando confiança baixa, conflito, lacuna ou entidade inexistente.", tag: "Req · Escalar" },
  { n: 11, title: "Solicitação de contexto (G6)", desc: "Card azul que lista campos faltantes como itens acionáveis. Os 5 campos ficam suspensos.", tag: "G6 · VC-06" },
  { n: 12, title: "Timestamp + auditoria + feedback", desc: "Horário da consulta, link de trechos rastreados e botão de feedback (mais visível em estados críticos).", tag: "C3 · VC-08" },
];

// ── Data: components (updated) ──
const COMPONENTS = [
  { title: "Janela e rail do Teams", body: "Chrome, barra de pesquisa, rail de apps e lista de conversas seguem padrões corporativos do Teams — o assistente é um app fixado." },
  { title: "Bolha de pergunta", body: "A consulta do atendente aparece como mensagem enviada (à direita) e é repetida no cabeçalho do card." },
  { title: "Card de resposta estruturada", body: "Container único com os 5 campos obrigatórios na ordem fixa da Spec v2.0. Em estado G6, os 5 campos são suspensos e substituídos pela lista de campos faltantes." },
  { title: 'Bloco "Resposta / declaração de estado"', body: "Rotulado com ícone ✦. Em cenários de conflito, lacuna ou entidade inexistente, o campo contém uma declaração de estado (formalizado como variante válida de C2)." },
  { title: 'Bloco "Trecho literal"', body: 'Citação com borda lateral teal, itálico e referência monoespaçada. Sinaliza "conteúdo documentado, não gerado".' },
  { title: "Indicador de confiança", body: 'Chip semáforo (verde/âmbar/vermelho/cinza) + medidor de 3 segmentos. 4 estados formais: Alto, Médio, Baixo, Não aplicável.' },
  { title: "Selo de vigência + nota de transição", body: 'Cada fonte exibe "✓ Versão vigente" ou "↻ Em transição" com nota de validade/substituição quando aplicável.' },
  { title: "Banner de contradição + ID rastreável", body: "Alerta laranja de alta saliência no topo do card, com ID de conflito (ex.: CF-2026-0412) vinculado ao registro de triagem." },
  { title: "Alerta de entidade inexistente", body: "Banner vermelho que informa a entidade mencionada, os valores válidos na política vigente e o documento de referência. Distinto da lacuna genérica." },
  { title: "Card de contexto insuficiente (G6)", body: "Lista de campos faltantes com hints. Os 5 campos obrigatórios ficam suspensos até que o atendente forneça as informações." },
  { title: "Faixa de escalação", body: 'Callout azul com botão "Escalar ao supervisor", exibido em baixa confiança, conflito, lacuna ou entidade inexistente.' },
  { title: "Feedback promovido em estados críticos", body: "Em conflito, lacuna e entidade inexistente, o link de feedback é promovido a botão visível com contexto da ação esperada." },
];

// ── Data: flow (updated) ──
const FLOW = [
  { n: 1, title: "Pergunta no chamado", body: "O atendente digita a dúvida. O composer orienta a incluir região, modalidade e peso." },
  { n: 2, title: "Validação de contexto", body: "O assistente verifica se a consulta tem informações suficientes. Se não, solicita dados faltantes (G6) antes de prosseguir." },
  { n: 3, title: "Recuperação RAG", body: "Busca trechos apenas em documentos vigentes/em transição e compõe a resposta estruturada." },
  { n: 4, title: "Leitura por escaneamento", body: "O atendente checa primeiro o nível de confiança e o selo de vigência." },
  { n: 5, title: "Verificação da fonte", body: "Confere ID do documento, seção e trecho literal. Pode abrir os trechos rastreados." },
  { n: 6, title: "Aplicar ou escalar", body: "Alta confiança: usa direto. Conflito / baixa / lacuna / entidade: aciona escalação." },
];

// ── Data: rationale (updated) ──
const RATIONALE = [
  { tag: "Confiança", title: "Confiança sempre visível — 4 estados formais", body: 'O chip de confiança ocupa posição fixa logo após a resposta. O nível "Não aplicável" foi formalizado como quarto estado, vinculado a lacunas e entidades inexistentes — nunca some, atendendo G3.' },
  { tag: "Separação", title: "Gerado vs. documentado fica inconfundível", body: 'Cores, ícones e rótulos distintos separam a "Resposta gerada" dos "Trechos literais". O atendente nunca confunde a paráfrase do assistente com o texto oficial.' },
  { tag: "Conflito", title: "Contradição é destacada, rastreada e não resolvida", body: "As duas versões vigentes são exibidas lado a lado com banner de alerta e um ID rastreável (CF-xxxx) vinculado ao sistema de triagem. O sistema permanece neutro (C5)." },
  { tag: "Entidade", title: "Entidade inexistente é distinta de lacuna", body: 'O alerta vermelho informa positivamente quais valores existem na política vigente — informação útil que a lacuna genérica não transmite. VC-07 ganha representação própria.' },
  { tag: "Contexto", title: "G6 tem estado dedicado com campos acionáveis", body: "Em vez de responder com suposições, os 5 campos são suspensos e o atendente vê exatamente quais informações precisa fornecer, com hints e exemplos." },
  { tag: "Vigência", title: "Vigência explícita com nota de transição", body: 'Selos de "vigente" / "em transição" com nota de substituição (quando aplicável) deixam claro o ciclo de vida do documento (C4).' },
  { tag: "Feedback", title: "Feedback promovido em cenários críticos", body: "Em conflito, lacuna e entidade inexistente, o link de feedback é promovido a botão visível, alimentando o ciclo de melhoria contínua." },
  { tag: "Prevenção", title: "Composer orienta contexto para reduzir G6", body: "O placeholder e o hint do composer orientam o atendente a incluir região, modalidade e peso, prevenindo consultas insuficientes." },
  { tag: "Padrão", title: "Aderência ao ambiente Teams", body: "Reaproveita layout, tipografia e cromática corporativa do Teams. Curva de aprendizado mínima." },
];

// ── Data: mapping table (updated) ──
const MAPPING = [
  { req: "Campo da pergunta", ui: "Bolha enviada + repetição no cabeçalho do card", gr: "Pergunta" },
  { req: "Resposta / declaração de estado", ui: 'Bloco "Resposta gerada" (✦) — aceita declaração de conflito/lacuna/entidade como variante válida de C2', gr: "G1 · C2" },
  { req: "Fonte documental", ui: "Card de fonte com título do documento", gr: "G2" },
  { req: "Identificador + versão", ui: "Chip de código (ex.: POL-LOG-014 v3.1)", gr: "G2 · VC-08" },
  { req: "Seção utilizada", ui: 'Linha "Seção utilizada" em cada fonte', gr: "G2 · VC-08" },
  { req: "Indicador de confiança", ui: "Chip semáforo + medidor de 3 segmentos (4 estados: Alto, Médio, Baixo, N/A)", gr: "G3 · VC-03" },
  { req: "Aviso de contradição", ui: "Banner laranja + versões lado a lado + ID rastreável", gr: "G4 · VC-04 · VC-10" },
  { req: "Entidade inexistente", ui: "Banner vermelho com valores válidos + doc de referência", gr: "G1 · VC-07" },
  { req: "Documento vigente", ui: 'Selo "Versão vigente" / "Em transição" + nota de substituição', gr: "C4 · VC-09" },
  { req: "Solicitação de contexto (G6)", ui: "Card azul com lista de campos faltantes, hints e suspensão dos 5 campos obrigatórios", gr: "G6 · VC-06" },
  { req: "Lacuna documental", ui: 'Bloco tracejado "Lacuna documental declarada"', gr: "G5 · VC-05" },
  { req: "Escalação ao supervisor", ui: 'Faixa azul + botão "Escalar"', gr: "VC-04/05/07" },
  { req: "Timestamp da consulta", ui: 'Rodapé "Consulta registrada em…"', gr: "C3 · VC-08" },
  { req: "Feedback estruturado", ui: "Botão promovido em estados críticos + link no rodapé", gr: "C6 · Outcomes" },
];
