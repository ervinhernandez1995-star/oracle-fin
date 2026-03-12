import { useState, useEffect } from "react";
import Head from "next/head";

const MARKETS = [
  { id: "crypto", label: "₿ Crypto" },
  { id: "stocks", label: "📈 Acciones" },
  { id: "forex", label: "💱 Forex" },
  { id: "commodities", label: "🥇 Materias Primas" },
  { id: "etf", label: "📊 ETFs" },
  { id: "realestate", label: "🏠 Bienes Raíces" },
  { id: "bonds", label: "🏦 Bonos" },
  { id: "startups", label: "🚀 Startups" },
];
const MODELS = [
  { id: "conservative", label: "🛡️ Conservador", desc: "bajo riesgo" },
  { id: "balanced", label: "⚖️ Balanceado", desc: "recomendado" },
  { id: "aggressive", label: "🚀 Agresivo", desc: "alto riesgo" },
  { id: "speculative", label: "💎 Especulativo", desc: "máx. retorno" },
];
const TICKER = [
  {sym:"BTC",price:"$97,420",chg:"+2.3%",up:true},{sym:"ETH",price:"$3,812",chg:"+1.8%",up:true},
  {sym:"NVDA",price:"$875.40",chg:"+3.1%",up:true},{sym:"AAPL",price:"$228.60",chg:"-0.4%",up:false},
  {sym:"SPY",price:"$548.20",chg:"+0.7%",up:true},{sym:"GLD",price:"$224.80",chg:"+0.9%",up:true},
  {sym:"EUR/USD",price:"1.0842",chg:"-0.2%",up:false},{sym:"TSLA",price:"$312.50",chg:"+4.2%",up:true},
  {sym:"SOL",price:"$185.30",chg:"+5.1%",up:true},{sym:"USD/MXN",price:"20.45",chg:"+0.3%",up:true},
  {sym:"AMZN",price:"$196.40",chg:"+1.2%",up:true},{sym:"QQQ",price:"$465.10",chg:"+0.9%",up:true},
];

export default function OracleFin() {
  const [query, setQuery] = useState("");
  const [capital, setCapital] = useState("");
  const [activeMarkets, setActiveMarkets] = useState(new Set(["crypto","stocks","forex","commodities","etf","realestate"]));
  const [selectedModel, setSelectedModel] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [clock, setClock] = useState("");
  const [tickerPos, setTickerPos] = useState(0);
  const [activeTab, setActiveTab] = useState("analisis");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString("es-MX",{hour12:false})+" UTC-6"),1000);
    return ()=>clearInterval(t);
  },[]);
  useEffect(() => {
    const t = setInterval(()=>setTickerPos(p=>p+1),30);
    return ()=>clearInterval(t);
  },[]);

  const toggleMarket = id => {
    setActiveMarkets(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  };

  const analyze = async () => {
    if(!query.trim()||loading) return;
    setLoading(true); setError(""); setResult(null); setActiveTab("analisis");
    try {
      const res = await fetch("/api/analyze",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({query, capital, markets:[...activeMarkets].join(", "), model:MODELS.find(m=>m.id===selectedModel)?.label})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||"Error desconocido");
      setResult(data);
      setHistory(prev=>[{query,capital,time:new Date().toLocaleTimeString("es-MX",{hour12:false})},...prev.slice(0,3)]);
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const fmt = n => n ? new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n) : "—";
  const tickerItems=[...TICKER,...TICKER,...TICKER];
  const itemW=170; const totalW=TICKER.length*itemW; const pos=tickerPos%totalW;
  const tabs=[{id:"analisis",label:"📊 Análisis"},{id:"calculadora",label:"💰 Calculadora"},{id:"oportunidades",label:"🎯 Oportunidades"},{id:"rubros",label:"🏦 Rubros"},{id:"portafolio",label:"💼 Portafolio"},{id:"prediccion",label:"🔮 Predicción"}];

  return (
    <>
      <Head>
        <title>ORACLE FIN — Especulación Financiera IA</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap" rel="stylesheet"/>
      </Head>
      <div style={{background:"#020b14",minHeight:"100vh",color:"#c8dff0",fontFamily:"'Space Mono',monospace"}}>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0;}body{background:#020b14;}
          ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#0e2a45;border-radius:2px}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
          @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,245,195,0.4)}50%{box-shadow:0 0 0 10px rgba(0,245,195,0)}}
          @keyframes shimmer{0%{opacity:0.3}50%{opacity:0.9}100%{opacity:0.3}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
          @keyframes gridFlow{from{background-position:0 0}to{background-position:40px 40px}}
          .bg-grid{position:fixed;inset:0;pointer-events:none;z-index:0;
            background-image:linear-gradient(rgba(0,245,195,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,195,0.025) 1px,transparent 1px);
            background-size:40px 40px;animation:gridFlow 20s linear infinite;}
          .card{background:#091625;border:1px solid #0e2a45;border-radius:14px;padding:20px;transition:border-color 0.3s;}
          .card:hover{border-color:rgba(0,245,195,0.2);}
          .skel{height:14px;background:linear-gradient(90deg,#0e2a45,#122d4a,#0e2a45);background-size:200%;border-radius:4px;animation:shimmer 1.5s infinite;margin-bottom:10px;}
          .chip{padding:7px 15px;border-radius:20px;border:1px solid #0e2a45;background:transparent;color:#4a7090;font-family:'Space Mono',monospace;font-size:11px;cursor:pointer;transition:all 0.2s;}
          .chip.on{border-color:#00f5c3;color:#00f5c3;background:rgba(0,245,195,0.08);}
          .chip:hover{border-color:rgba(0,245,195,0.5);}
          .model-opt{display:flex;align-items:center;gap:12px;padding:11px 14px;border:1px solid #0e2a45;border-radius:10px;cursor:pointer;transition:all 0.2s;margin-bottom:8px;}
          .model-opt.sel{border-color:#00f5c3;background:rgba(0,245,195,0.06);}
          .analyze-btn{padding:15px 28px;background:linear-gradient(135deg,#00f5c3,#00a884);border:none;border-radius:11px;color:#000;font-family:'Syne',sans-serif;font-weight:800;font-size:14px;letter-spacing:2px;cursor:pointer;transition:all 0.3s;}
          .analyze-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,245,195,0.3);}
          .analyze-btn:disabled{opacity:0.55;cursor:not-allowed;}
          .pred-item{border:1px solid #0e2a45;border-radius:10px;padding:16px;margin-bottom:10px;transition:all 0.25s;}
          .pred-item:hover{border-color:#00f5c3;background:rgba(0,245,195,0.03);transform:translateX(4px);}
          .tab-btn{padding:10px 16px;border:none;background:transparent;color:#4a7090;font-family:'Space Mono',monospace;font-size:11px;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;white-space:nowrap;}
          .tab-btn.active{color:#00f5c3;border-bottom-color:#00f5c3;}
          .tab-btn:hover{color:#c8dff0;}
          .rubro-card{border:1px solid #0e2a45;border-radius:12px;padding:16px;transition:all 0.25s;cursor:pointer;}
          .rubro-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.3);}
          .money-box{background:rgba(0,245,195,0.06);border:1px solid rgba(0,245,195,0.2);border-radius:12px;padding:16px;margin-bottom:12px;}
          .input-field{width:100%;background:rgba(255,255,255,0.03);border:1px solid #0e2a45;border-radius:10px;padding:13px 16px;color:#c8dff0;font-family:'Space Mono',monospace;font-size:13px;outline:none;transition:all 0.3s;}
          .input-field:focus{border-color:#00f5c3;box-shadow:0 0 0 3px rgba(0,245,195,0.1);}
          .input-field::placeholder{color:#4a7090;}
          @media(max-width:768px){.sidebar{display:none!important}.two-col{grid-template-columns:1fr!important}}
        `}</style>
        <div className="bg-grid"/>

        {/* HEADER */}
        <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(2,11,20,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid #0e2a45",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:40,height:40,background:"linear-gradient(135deg,#00f5c3,#a855f7)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,animation:"pulse 2s infinite"}}>⬡</div>
            <div>
              <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:20,letterSpacing:3,color:"#fff"}}>ORACLE FIN</div>
              <div style={{fontSize:9,color:"#4a7090",letterSpacing:3}}>GROQ AI · PREDICCIONES PRECISAS · TIEMPO REAL</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontSize:10,padding:"4px 12px",borderRadius:20,border:"1px solid rgba(0,245,195,0.3)",color:"#00f5c3",background:"rgba(0,245,195,0.06)"}}>⚡ GROQ LLaMA 3.3 70B</div>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#00f5c3",animation:"blink 1s infinite"}}/>
            <span style={{fontSize:11,color:"#00f5c3",letterSpacing:2}}>LIVE</span>
            <span style={{fontSize:11,color:"#4a7090"}}>{clock}</span>
          </div>
        </div>

        {/* TICKER */}
        <div style={{background:"#060f1a",borderBottom:"1px solid #0e2a45",overflow:"hidden",position:"relative",height:42}}>
          <div style={{position:"absolute",left:0,top:0,bottom:0,background:"linear-gradient(135deg,#00f5c3,#00a884)",color:"#000",fontSize:10,fontWeight:700,letterSpacing:2,display:"flex",alignItems:"center",padding:"0 14px",zIndex:2,fontFamily:"Syne,sans-serif"}}>LIVE</div>
          <div style={{marginLeft:76,overflow:"hidden",height:"100%"}}>
            <div style={{display:"flex",transform:`translateX(-${pos}px)`,transition:"none",height:"100%",alignItems:"center"}}>
              {tickerItems.map((t,i)=>(
                <div key={i} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"0 20px",height:42,borderRight:"1px solid #0e2a45",flexShrink:0,minWidth:itemW}}>
                  <span style={{color:"#fff",fontWeight:700,fontSize:12}}>{t.sym}</span>
                  <span style={{fontSize:12}}>{t.price}</span>
                  <span style={{fontSize:12,color:t.up?"#00f5c3":"#ff3b5c"}}>{t.chg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{position:"relative",zIndex:1,maxWidth:1400,margin:"0 auto",padding:"24px 20px"}}>

          {/* QUERY CARD */}
          <div className="card" style={{marginBottom:20,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#00f5c3,#a855f7,#ff6b35)"}}/>
            <div style={{fontSize:10,letterSpacing:4,color:"#4a7090",marginBottom:16}}>// CONSULTA DE ESPECULACIÓN FINANCIERA PRECISA</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 200px auto",gap:12,alignItems:"flex-end",marginBottom:14}} className="two-col">
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:"#4a7090",marginBottom:6}}>¿QUÉ QUIERES ANALIZAR?</div>
                <input className="input-field" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()}
                  placeholder="Ej: ¿Dónde invertir mis ahorros en 2026? ¿Cuándo comprar Bitcoin?"/>
              </div>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:"#4a7090",marginBottom:6}}>CAPITAL A INVERTIR</div>
                <input className="input-field" value={capital} onChange={e=>setCapital(e.target.value)}
                  placeholder="Ej: $2,000 MXN" style={{textAlign:"center"}}/>
              </div>
              <button className="analyze-btn" disabled={loading} onClick={analyze}>
                {loading ? <span style={{display:"flex",alignItems:"center",gap:8}}><span style={{display:"inline-block",width:14,height:14,border:"2px solid #000",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>ANALIZANDO</span> : "⬡ PREDECIR"}
              </button>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {MARKETS.map(m=>(
                <button key={m.id} className={`chip ${activeMarkets.has(m.id)?"on":""}`} onClick={()=>toggleMarket(m.id)}>{m.label}</button>
              ))}
            </div>
          </div>

          {/* HISTORY */}
          {history.length>0&&(
            <div style={{marginBottom:16,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:10,color:"#4a7090",letterSpacing:2}}>RECIENTES:</span>
              {history.map((h,i)=>(
                <button key={i} onClick={()=>{setQuery(h.query);setCapital(h.capital);}}
                  style={{padding:"5px 12px",borderRadius:8,border:"1px solid #0e2a45",fontSize:10,color:"#4a7090",cursor:"pointer",background:"transparent",fontFamily:"Space Mono,monospace",transition:"all 0.2s"}}
                  onMouseOver={e=>e.target.style.borderColor="#00f5c3"} onMouseOut={e=>e.target.style.borderColor="#0e2a45"}>
                  {h.time} — {h.query.slice(0,35)}…
                </button>
              ))}
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}} className="two-col">
            <div>
              {/* TABS */}
              <div className="card" style={{marginBottom:16}}>
                <div style={{display:"flex",borderBottom:"1px solid #0e2a45",marginBottom:20,overflowX:"auto",gap:0}}>
                  {tabs.map(t=>(
                    <button key={t.id} className={`tab-btn ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>{t.label}</button>
                  ))}
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",paddingRight:4,flexShrink:0}}>
                    <div style={{fontSize:10,padding:"3px 10px",borderRadius:20,border:`1px solid ${error?"#ff3b5c":result?"#00f5c3":"#a855f7"}`,color:error?"#ff3b5c":result?"#00f5c3":"#a855f7"}}>
                      {error?"ERROR":result?"✓ LISTO":loading?"⟳ ANALIZANDO":"EN ESPERA"}
                    </div>
                  </div>
                </div>

                {loading&&(
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"10px 14px",background:"rgba(0,245,195,0.06)",border:"1px solid rgba(0,245,195,0.2)",borderRadius:10}}>
                      <span style={{display:"inline-block",width:16,height:16,border:"2px solid #00f5c3",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                      <span style={{fontSize:11,color:"#00f5c3",letterSpacing:1}}>PROCESANDO CON GROQ AI — CALCULANDO PREDICCIONES PRECISAS...</span>
                    </div>
                    {[100,88,94,76,82,90].map((w,i)=><div key={i} className="skel" style={{width:`${w}%`}}/>)}
                  </div>
                )}
                {error&&<div style={{background:"rgba(255,59,92,0.08)",border:"1px solid rgba(255,59,92,0.3)",borderRadius:10,padding:16,color:"#ff3b5c",fontSize:12,lineHeight:1.8}}>⚠ {error}</div>}

                {/* ANÁLISIS TAB */}
                {!loading&&result&&activeTab==="analisis"&&(
                  <div style={{animation:"fadeIn 0.4s ease"}}>
                    <div style={{fontSize:13,lineHeight:1.95,marginBottom:20}}
                      dangerouslySetInnerHTML={{__html:(result.analisis||"")
                        .replace(/(\+[\d.]+%)/g,'<span style="color:#00f5c3;font-weight:700">$1</span>')
                        .replace(/([-][\d.]+%)/g,'<span style="color:#ff3b5c;font-weight:700">$1</span>')
                        .replace(/(\$[\d,]+\.?\d*)/g,'<span style="color:#f5c842">$1</span>')
                        .replace(/\n/g,'<br/>')}}/>
                    {result.macro&&(
                      <div style={{display:"flex",gap:10,flexWrap:"wrap",padding:"14px 0",borderTop:"1px solid #0e2a45"}}>
                        {[["FED RATE",result.macro.fed_rate,"#ff6b35"],["INFLACIÓN US",result.macro.inflacion_us,"#f5c842"],["DXY",result.macro.dxy,"#a855f7"],["VIX",result.macro.vix,"#00f5c3"],["USD/MXN",result.macro.usdmxn,"#ff3b5c"]].map(([l,v,c])=>(
                          <div key={l} style={{padding:"8px 16px",background:"rgba(255,255,255,0.02)",borderRadius:8,border:`1px solid ${c}33`,textAlign:"center",flex:1,minWidth:80}}>
                            <div style={{fontSize:14,fontWeight:700,color:c,fontFamily:"Syne,sans-serif"}}>{v||"—"}</div>
                            <div style={{fontSize:9,color:"#4a7090",letterSpacing:2,marginTop:2}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* CALCULADORA TAB */}
                {!loading&&result&&activeTab==="calculadora"&&result.capital_analisis&&(
                  <div style={{animation:"fadeIn 0.4s ease"}}>
                    <div className="money-box" style={{background:"rgba(0,245,195,0.06)",border:"1px solid rgba(0,245,195,0.25)",borderRadius:14,padding:24,marginBottom:16,textAlign:"center"}}>
                      <div style={{fontSize:11,color:"#4a7090",letterSpacing:3,marginBottom:8}}>SI INVIERTES HOY</div>
                      <div style={{fontSize:36,fontWeight:800,color:"#f5c842",fontFamily:"Syne,sans-serif"}}>{fmt(result.capital_analisis.capital_inicial)}</div>
                      <div style={{fontSize:13,color:"#4a7090",margin:"8px 0"}}>en {result.capital_analisis.plazo}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:16}}>
                        {[["#00f5c3",fmt(result.capital_analisis.capital_final),"CAPITAL FINAL"],["#a855f7","+"+fmt(result.capital_analisis.ganancia_proyectada),"GANANCIA NETA"],["#f5c842",result.capital_analisis.roi_porcentaje,"ROI"]].map(([c,v,l])=>(
                          <div key={l} style={{padding:"16px 8px",background:"rgba(255,255,255,0.03)",borderRadius:10,border:`1px solid ${c}33`}}>
                            <div style={{fontSize:20,fontWeight:800,color:c,fontFamily:"Syne,sans-serif"}}>{v}</div>
                            <div style={{fontSize:9,color:"#4a7090",letterSpacing:2,marginTop:4}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                      {[["🚀 Escenario Optimista",result.capital_analisis.escenario_optimista,"#00f5c3"],["⚠️ Escenario Pesimista",result.capital_analisis.escenario_pesimista,"#ff3b5c"]].map(([l,v,c])=>(
                        <div key={l} style={{padding:"16px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:`1px solid ${c}33`,textAlign:"center"}}>
                          <div style={{fontSize:11,color:"#4a7090",marginBottom:8}}>{l}</div>
                          <div style={{fontSize:22,fontWeight:800,color:c,fontFamily:"Syne,sans-serif"}}>{fmt(v)}</div>
                        </div>
                      ))}
                    </div>
                    {result.portafolio&&(
                      <div>
                        <div style={{fontSize:10,letterSpacing:3,color:"#4a7090",marginBottom:12}}>DISTRIBUCIÓN EXACTA DE TU CAPITAL:</div>
                        {result.portafolio.map((p,i)=>(
                          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:`1px solid ${p.color}33`,marginBottom:8}}>
                            <div style={{width:44,height:44,borderRadius:9,background:`${p.color}18`,border:`1px solid ${p.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:14,color:p.color,flexShrink:0}}>{p.pct}%</div>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:700,color:"#fff",fontSize:12}}>{p.activo} <span style={{color:"#4a7090",fontSize:10}}>({p.ticker})</span></div>
                              <div style={{fontSize:10,color:"#4a7090"}}>{p.razon}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{color:p.color,fontWeight:700,fontSize:13}}>{fmt(p.monto)}</div>
                              <div style={{fontSize:10,color:"#00f5c3"}}>+{fmt(p.ganancia_esperada)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* OPORTUNIDADES TAB */}
                {!loading&&result&&activeTab==="oportunidades"&&(
                  <div style={{animation:"fadeIn 0.4s ease"}}>
                    {result.oportunidades?.map((op,i)=>(
                      <div key={i} className="pred-item">
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                          <div>
                            <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:"#fff"}}>{op.nombre} <span style={{color:"#4a7090",fontSize:11}}>({op.ticker})</span></div>
                            <div style={{fontSize:11,color:"#4a7090",marginTop:2}}>
                              Entrada: <span style={{color:"#f5c842"}}>{op.precio_entrada}</span> → Objetivo: <span style={{color:"#00f5c3"}}>{op.precio_objetivo}</span> · Stop Loss: <span style={{color:"#ff3b5c"}}>{op.stop_loss}</span>
                            </div>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                            <div style={{fontSize:22,fontWeight:800,color:op.bull?"#00f5c3":"#ff3b5c",fontFamily:"Syne,sans-serif"}}>{op.retorno}</div>
                            <div style={{fontSize:10,color:op.bull?"#00f5c3":"#ff3b5c"}}>{op.bull?"▲ ALCISTA":"▼ BAJISTA"}</div>
                          </div>
                        </div>
                        {op.si_inviertes&&(
                          <div style={{background:"rgba(0,245,195,0.06)",border:"1px solid rgba(0,245,195,0.2)",borderRadius:8,padding:"10px 14px",marginBottom:10,fontSize:12,color:"#00f5c3"}}>
                            💰 {op.si_inviertes}
                          </div>
                        )}
                        <div style={{fontSize:12,color:"#7a9ab0",marginBottom:10,lineHeight:1.7}}>{op.razon}</div>
                        {op.catalizadores&&(
                          <div style={{marginBottom:8}}>
                            <div style={{fontSize:10,color:"#4a7090",letterSpacing:2,marginBottom:6}}>CATALIZADORES:</div>
                            {op.catalizadores.map((c,j)=><div key={j} style={{fontSize:11,color:"#c8dff0",padding:"3px 0"}}>⚡ {c}</div>)}
                          </div>
                        )}
                        <div style={{display:"flex",gap:12,fontSize:10,color:"#4a7090",marginBottom:8,flexWrap:"wrap"}}>
                          <span>📅 {op.horizonte}</span><span>📊 {op.tipo}</span><span>🎯 {op.confianza}% confianza</span><span>💼 {op.inversion_sugerida_pct}% del capital</span>
                        </div>
                        <div style={{height:4,background:"#0e2a45",borderRadius:2}}>
                          <div style={{height:"100%",width:`${op.confianza}%`,background:op.bull?"linear-gradient(90deg,#a855f7,#00f5c3)":"linear-gradient(90deg,#ff6b35,#ff3b5c)",borderRadius:2,transition:"width 1.2s"}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* RUBROS TAB */}
                {!loading&&result&&activeTab==="rubros"&&result.rubros&&(
                  <div style={{animation:"fadeIn 0.4s ease"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {result.rubros.map((r,i)=>(
                        <div key={i} className="rubro-card" style={{borderColor:`${r.color}44`,background:`${r.color}08`}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontSize:24}}>{r.icono}</span>
                              <div>
                                <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,color:"#fff",fontSize:13}}>{r.nombre}</div>
                                <div style={{fontSize:10,color:"#4a7090"}}>{r.horizonte}</div>
                              </div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:16,fontWeight:800,color:r.color,fontFamily:"Syne,sans-serif"}}>{r.potencial}</div>
                              <div style={{fontSize:10,color:"#4a7090"}}>{r.riesgo}</div>
                            </div>
                          </div>
                          <div style={{fontSize:11,color:"#7a9ab0",marginBottom:10,lineHeight:1.6}}>{r.descripcion}</div>
                          {r.si_inviertes&&(
                            <div style={{background:`${r.color}12`,border:`1px solid ${r.color}33`,borderRadius:8,padding:"8px 12px",fontSize:11,color:r.color,marginBottom:10}}>
                              💰 {r.si_inviertes}
                            </div>
                          )}
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {r.activos_top?.map((a,j)=>(
                              <span key={j} style={{padding:"3px 10px",borderRadius:12,border:`1px solid ${r.color}44`,fontSize:10,color:r.color,background:`${r.color}10`}}>{a}</span>
                            ))}
                          </div>
                          <div style={{marginTop:10,fontSize:10,color:"#4a7090"}}>Asignación sugerida: <span style={{color:r.color,fontWeight:700}}>{r.asignacion_sugerida}%</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PORTAFOLIO TAB */}
                {!loading&&result&&activeTab==="portafolio"&&result.portafolio&&(
                  <div style={{animation:"fadeIn 0.4s ease"}}>
                    <div style={{display:"flex",height:16,borderRadius:8,overflow:"hidden",marginBottom:20}}>
                      {result.portafolio.map((p,i)=><div key={i} style={{width:`${p.pct}%`,background:p.color}} title={`${p.activo}: ${p.pct}%`}/>)}
                    </div>
                    {result.portafolio.map((p,i)=>(
                      <div key={i} style={{display:"flex",gap:12,padding:"14px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:`1px solid ${p.color}33`,marginBottom:8,alignItems:"center"}}>
                        <div style={{width:44,height:44,borderRadius:9,background:`${p.color}18`,border:`1px solid ${p.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:14,color:p.color,flexShrink:0}}>{p.pct}%</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,color:"#fff",fontSize:13}}>{p.activo} <span style={{color:"#4a7090",fontSize:10}}>({p.ticker})</span></div>
                          <div style={{fontSize:11,color:"#4a7090",marginTop:2}}>{p.razon}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{color:p.color,fontWeight:700}}>{fmt(p.monto)}</div>
                          <div style={{fontSize:10,color:"#00f5c3",marginTop:2}}>+{fmt(p.ganancia_esperada)} est.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PREDICCIÓN TAB */}
                {!loading&&result&&activeTab==="prediccion"&&result.prediccion_30dias&&(()=>{
                  const p=result.prediccion_30dias;
                  return (
                    <div style={{animation:"fadeIn 0.4s ease"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
                        {[["🚀 ALCISTA",p.escenario_alcista,p.probabilidades?.alcista,"#00f5c3"],["📊 BASE",p.escenario_base,p.probabilidades?.base,"#f5c842"],["⚠️ BAJISTA",p.escenario_bajista,p.probabilidades?.bajista,"#ff3b5c"]].map(([l,desc,prob,c])=>(
                          <div key={l} style={{padding:"16px",background:`${c}08`,borderRadius:12,border:`1px solid ${c}33`}}>
                            <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,color:c,fontSize:12,marginBottom:6}}>{l}</div>
                            <div style={{fontSize:24,fontWeight:800,color:c,fontFamily:"Syne,sans-serif",marginBottom:8}}>{prob}</div>
                            <div style={{fontSize:11,color:"#7a9ab0",lineHeight:1.6}}>{desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {!loading&&!result&&!error&&(
                  <div style={{textAlign:"center",padding:"40px 20px"}}>
                    <div style={{fontSize:48,marginBottom:16}}>⬡</div>
                    <div style={{color:"#4a7090",fontSize:12,lineHeight:2}}>
                      Escribe tu pregunta, ingresa tu capital y presiona <span style={{color:"#00f5c3"}}>PREDECIR</span>.<br/>
                      Oracle Fin calculará predicciones precisas con tu dinero.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="sidebar">
              {/* SENTIMIENTO */}
              <div className="card" style={{marginBottom:16}}>
                <div style={{fontSize:10,letterSpacing:3,color:"#4a7090",marginBottom:14}}>// SENTIMIENTO</div>
                {result?.sentimiento?(()=>{
                  const s=result.sentimiento;
                  const idx=Math.max(0,Math.min(100,s.indice||50));
                  const color=idx>65?"#00f5c3":idx<35?"#ff3b5c":"#f5c842";
                  const r2=52,cx=70,cy=66,circ=Math.PI*r2,offset=circ-circ*(idx/100);
                  return (
                    <div style={{textAlign:"center",animation:"fadeIn 0.5s ease"}}>
                      <svg viewBox="0 0 140 80" style={{width:"100%",maxWidth:170,display:"block",margin:"0 auto"}}>
                        <path d={`M ${cx-r2} ${cy} A ${r2} ${r2} 0 0 1 ${cx+r2} ${cy}`} fill="none" stroke="#0e2a45" strokeWidth={14}/>
                        <path d={`M ${cx-r2} ${cy} A ${r2} ${r2} 0 0 1 ${cx+r2} ${cy}`} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{transition:"stroke-dashoffset 1.5s"}}/>
                        <text x={cx} y={cy-2} textAnchor="middle" fill={color} fontSize={22} fontFamily="Syne,sans-serif" fontWeight="800">{idx}</text>
                      </svg>
                      <div style={{fontSize:12,fontFamily:"Syne,sans-serif",fontWeight:700,color,letterSpacing:3,marginTop:4}}>{s.etiqueta}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:14}}>
                        {[["#00f5c3",s.alcista,"ALCISTA"],["#f5c842",s.neutral,"NEUTRAL"],["#ff3b5c",s.bajista,"BAJISTA"]].map(([c,v,l])=>(
                          <div key={l} style={{textAlign:"center",padding:"8px 4px",background:"rgba(255,255,255,0.02)",borderRadius:8}}>
                            <div style={{fontSize:14,fontWeight:700,color:c,fontFamily:"Syne,sans-serif"}}>{v}</div>
                            <div style={{fontSize:9,color:"#4a7090",letterSpacing:1,marginTop:2}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })():<div style={{textAlign:"center",padding:"20px 0",color:"#4a7090",fontSize:11}}>Disponible después del análisis</div>}
              </div>

              {/* MODELO */}
              <div className="card" style={{marginBottom:16}}>
                <div style={{fontSize:10,letterSpacing:3,color:"#4a7090",marginBottom:14}}>// PERFIL</div>
                {MODELS.map(m=>(
                  <div key={m.id} className={`model-opt ${selectedModel===m.id?"sel":""}`} onClick={()=>setSelectedModel(m.id)}>
                    <input type="radio" readOnly checked={selectedModel===m.id} style={{accentColor:"#00f5c3",flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:12,color:selectedModel===m.id?"#00f5c3":"#c8dff0"}}>{m.label}</div>
                      <div style={{fontSize:10,color:"#4a7090"}}>{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIESGO */}
              {result?.riesgo&&(()=>{
                const r=result.riesgo;
                const rc=r.score>70?"#ff3b5c":r.score>40?"#f5c842":"#00f5c3";
                return (
                  <div className="card" style={{animation:"fadeIn 0.6s ease"}}>
                    <div style={{fontSize:10,letterSpacing:3,color:"#4a7090",marginBottom:14}}>// RIESGO</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                      {[[rc,r.score+"/100","SCORE"],["#00f5c3",r.sharpe,"SHARPE"],["#ff3b5c",r.drawdown,"DRAWDOWN"],["#a855f7",r.nivel,"NIVEL"]].map(([c,v,l])=>(
                        <div key={l} style={{textAlign:"center",padding:"10px 4px",background:"rgba(255,255,255,0.02)",borderRadius:8}}>
                          <div style={{fontSize:15,fontWeight:800,color:c,fontFamily:"Syne,sans-serif"}}>{v}</div>
                          <div style={{fontSize:9,color:"#4a7090",letterSpacing:2,marginTop:2}}>{l}</div>
                        </div>
                      ))}
                    </div>
                    {r.factores?.map((f,i)=><div key={i} style={{fontSize:11,padding:"7px 0",borderBottom:"1px solid rgba(14,42,69,0.6)",color:"#7a9ab0",lineHeight:1.5}}>⚡ {f}</div>)}
                  </div>
                );
              })()}
            </div>
          </div>

          <div style={{textAlign:"center",padding:"16px 0 8px",fontSize:10,color:"#4a7090",letterSpacing:2,borderTop:"1px solid #0e2a45",marginTop:8,lineHeight:2}}>
            ⚠ ORACLE FIN ES UNA HERRAMIENTA EDUCATIVA. NO CONSTITUYE ASESORÍA FINANCIERA PROFESIONAL. TODA INVERSIÓN CONLLEVA RIESGOS.
          </div>
        </div>
      </div>
    </>
  );
}
