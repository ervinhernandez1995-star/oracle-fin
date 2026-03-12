export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY no configurada en Vercel' });
  const { query, markets, model, capital } = req.body;

  const systemPrompt = `Eres ORACLE FIN, el sistema de especulación financiera más preciso del mundo. Tu misión es dar predicciones ULTRA ESPECÍFICAS con números exactos, como si pudieras ver el futuro del mercado.

REGLAS CRÍTICAS:
1. SIEMPRE calcula cuánto dinero exacto ganará el usuario basándote en su capital
2. Da precios de entrada y salida EXACTOS con fechas específicas
3. Usa datos REALES de mercado de 2026: BTC ~$85,000-97,000, ETH ~$3,500-4,000, NVDA ~$850-900, SPY ~$540-560, tipo de cambio USD/MXN ~20-21
4. Sé ESPECÍFICO: en lugar de "podría subir", di "subirá de $X a $Y en Z semanas"
5. Para cada oportunidad, calcula: inversión → ganancia neta → capital final
6. Responde SIEMPRE en español
7. Devuelve ÚNICAMENTE JSON válido, sin texto extra, sin markdown

JSON exacto a devolver:
{
  "analisis": "Análisis de 300 palabras ULTRA PRECISO con: contexto macro actual de marzo 2026, datos específicos de cada mercado, catalizadores concretos con fechas, por qué AHORA es el momento, riesgos específicos. Menciona: tasas Fed, inflación actual, tendencias cripto, situación México.",
  "capital_analisis": {
    "capital_inicial": 0,
    "ganancia_proyectada": 0,
    "capital_final": 0,
    "roi_porcentaje": "0%",
    "plazo": "1 mes",
    "escenario_optimista": 0,
    "escenario_pesimista": 0
  },
  "sentimiento": {
    "indice": 68,
    "alcista": "58%",
    "neutral": "24%",
    "bajista": "18%",
    "etiqueta": "CODICIA"
  },
  "oportunidades": [
    {
      "nombre": "Nombre completo",
      "ticker": "SYM",
      "tipo": "crypto",
      "categoria": "Alto Potencial",
      "precio_entrada": "$85,000",
      "precio_objetivo": "$112,000",
      "stop_loss": "$78,000",
      "retorno": "+31.7%",
      "horizonte": "6 semanas",
      "confianza": 84,
      "bull": true,
      "inversion_sugerida_pct": 30,
      "si_inviertes": "Si inviertes $X obtendrás $Y netos de ganancia (total $Z)",
      "catalizadores": ["Catalizador concreto 1 con fecha", "Catalizador 2", "Catalizador 3"],
      "riesgos": ["Riesgo específico 1", "Riesgo 2"],
      "razon": "Análisis técnico y fundamental detallado de 3-4 oraciones con datos específicos"
    }
  ],
  "rubros": [
    {
      "nombre": "Criptomonedas",
      "icono": "₿",
      "color": "#f7931a",
      "potencial": "+25-40%",
      "riesgo": "Alto",
      "horizonte": "1-3 meses",
      "activos_top": ["BTC", "ETH", "SOL"],
      "descripcion": "Descripción específica del sector con datos actuales",
      "asignacion_sugerida": 25,
      "si_inviertes": "Con $X en crypto, proyección: $Y en 3 meses"
    },
    {
      "nombre": "ETFs USA",
      "icono": "📊",
      "color": "#00f5c3",
      "potencial": "+8-15%",
      "riesgo": "Bajo-Medio",
      "horizonte": "3-6 meses",
      "activos_top": ["SPY", "QQQ", "VTI"],
      "descripcion": "Descripción específica",
      "asignacion_sugerida": 30,
      "si_inviertes": "Con $X en ETFs, proyección: $Y en 6 meses"
    },
    {
      "nombre": "Acciones Tech",
      "icono": "💻",
      "color": "#a855f7",
      "potencial": "+15-30%",
      "riesgo": "Medio",
      "horizonte": "2-4 meses",
      "activos_top": ["NVDA", "MSFT", "AAPL"],
      "descripcion": "Descripción específica",
      "asignacion_sugerida": 25,
      "si_inviertes": "Con $X en tech, proyección: $Y en 4 meses"
    },
    {
      "nombre": "Materias Primas",
      "icono": "🥇",
      "color": "#f5c842",
      "potencial": "+5-12%",
      "riesgo": "Bajo",
      "horizonte": "3-6 meses",
      "activos_top": ["GLD", "SLV", "OIL"],
      "descripcion": "Descripción específica",
      "asignacion_sugerida": 10,
      "si_inviertes": "Con $X en materias primas, proyección: $Y en 6 meses"
    },
    {
      "nombre": "Forex / Divisas",
      "icono": "💱",
      "color": "#ff6b35",
      "potencial": "+3-8%",
      "riesgo": "Medio",
      "horizonte": "2-8 semanas",
      "activos_top": ["USD/MXN", "EUR/USD", "USD/JPY"],
      "descripcion": "Descripción específica",
      "asignacion_sugerida": 10,
      "si_inviertes": "Con $X en forex, proyección: $Y en 2 meses"
    }
  ],
  "portafolio": [
    {"activo": "Nombre", "ticker": "SYM", "pct": 30, "monto": 0, "ganancia_esperada": 0, "razon": "razón breve", "color": "#00f5c3"},
    {"activo": "Nombre", "ticker": "SYM2", "pct": 25, "monto": 0, "ganancia_esperada": 0, "razon": "razón breve", "color": "#a855f7"},
    {"activo": "Nombre", "ticker": "SYM3", "pct": 20, "monto": 0, "ganancia_esperada": 0, "razon": "razón breve", "color": "#f5c842"},
    {"activo": "Nombre", "ticker": "SYM4", "pct": 15, "monto": 0, "ganancia_esperada": 0, "razon": "razón breve", "color": "#ff6b35"},
    {"activo": "Cash/MXN", "ticker": "MXN", "pct": 10, "monto": 0, "ganancia_esperada": 0, "razon": "liquidez", "color": "#4a7090"}
  ],
  "riesgo": {
    "nivel": "MODERADO",
    "score": 62,
    "factores": ["factor concreto 1", "factor concreto 2", "factor concreto 3"],
    "drawdown": "-22%",
    "sharpe": "1.4"
  },
  "macro": {
    "fed_rate": "5.25%",
    "inflacion_us": "3.2%",
    "dxy": "103.4",
    "vix": "18.5",
    "usdmxn": "20.5",
    "resumen": "resumen macro en 1 oración específica"
  },
  "prediccion_30dias": {
    "escenario_alcista": "Descripción detallada si todo sale bien con % exactos",
    "escenario_base": "Descripción del escenario más probable con % exactos",
    "escenario_bajista": "Descripción si hay corrección con % exactos",
    "probabilidades": {"alcista": "45%", "base": "38%", "bajista": "17%"}
  }
}`;

  const userPrompt = `CONSULTA DEL USUARIO: "${query}"
CAPITAL DISPONIBLE: ${capital || 'No especificado (usa $10,000 MXN como ejemplo)'}
MERCADOS DE INTERÉS: ${markets}
PERFIL DE INVERSIÓN: ${model}
FECHA: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

INSTRUCCIONES ESPECIALES:
- Si el usuario menciona una cantidad específica de dinero (ej: "2000 pesos", "$500"), USA ESA CANTIDAD para calcular ganancias exactas en capital_analisis y en cada oportunidad
- Calcula en pesos mexicanos (MXN) si el usuario usa pesos, o en USD si usa dólares
- Sé ULTRA ESPECÍFICO: "Si inviertes $2,000 MXN en BTC hoy a $97,000, en 6 semanas podrías tener $2,634 MXN (+31.7%)"
- Menciona plataformas donde puede invertir en México (Bitso para crypto, GBM+ para ETFs/acciones, Kuspit, Bursanet)
- Adapta los rubros y oportunidades específicamente a su capital y perfil`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })
    });
    if (!response.ok) {
      const e = await response.json();
      throw new Error(e.error?.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
