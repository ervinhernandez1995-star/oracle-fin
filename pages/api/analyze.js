export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'API Key no configurada. Ve a Vercel → Settings → Environment Variables → agrega GEMINI_API_KEY con tu clave de aistudio.google.com'
    });
  }

  const { query, markets, model } = req.body;

  const prompt = `Eres ORACLE FIN, sistema experto de especulación financiera con acceso a datos en tiempo real de internet. Usa Google Search para obtener precios actuales, noticias y tendencias REALES de HOY.

Analiza: "${query}"
Mercados activos: ${markets}
Modelo de inversión: ${model}
Fecha actual: ${new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}

INSTRUCCIONES:
- Busca datos REALES y ACTUALES en internet sobre los activos relevantes
- Incluye precios actuales, variaciones recientes, noticias del día
- Sé específico con números, porcentajes y fechas reales
- Responde SIEMPRE en español

Devuelve ÚNICAMENTE este JSON sin markdown, sin texto extra, sin bloques de código:
{
  "analisis": "Análisis detallado de 250-300 palabras con datos reales actuales, precios del día, tendencias, catalizadores y contexto macroeconómico específico",
  "fuentes_usadas": ["fuente1", "fuente2", "fuente3"],
  "sentimiento": {
    "indice": 65,
    "alcista": "54%",
    "neutral": "28%",
    "bajista": "18%",
    "etiqueta": "CODICIA"
  },
  "oportunidades": [
    {
      "nombre": "Nombre completo del activo",
      "ticker": "SYM",
      "tipo": "crypto",
      "precio_actual": "$97,420",
      "retorno": "+35%",
      "precio_objetivo": "$131,000",
      "horizonte": "3 meses",
      "confianza": 78,
      "bull": true,
      "razon": "Razón específica con datos reales y catalizadores concretos de hoy"
    },
    {
      "nombre": "Nombre",
      "ticker": "SYM2",
      "tipo": "accion",
      "precio_actual": "$228",
      "retorno": "+18%",
      "precio_objetivo": "$269",
      "horizonte": "6 meses",
      "confianza": 85,
      "bull": true,
      "razon": "Razón con datos actuales"
    },
    {
      "nombre": "Nombre",
      "ticker": "SYM3",
      "tipo": "etf",
      "precio_actual": "$224",
      "retorno": "-8%",
      "precio_objetivo": "$206",
      "horizonte": "1 mes",
      "confianza": 71,
      "bull": false,
      "razon": "Riesgo específico con datos reales"
    }
  ],
  "portafolio": [
    {"activo": "Nombre", "ticker": "SYM", "pct": 30, "razon": "razón breve", "color": "#00f5c3"},
    {"activo": "Nombre", "ticker": "SYM2", "pct": 25, "razon": "razón breve", "color": "#a855f7"},
    {"activo": "Nombre", "ticker": "SYM3", "pct": 20, "razon": "razón breve", "color": "#f5c842"},
    {"activo": "Nombre", "ticker": "SYM4", "pct": 15, "razon": "razón breve", "color": "#ff6b35"},
    {"activo": "Cash/USD", "ticker": "USD", "pct": 10, "razon": "Liquidez para oportunidades", "color": "#4a7090"}
  ],
  "riesgo": {
    "nivel": "MODERADO",
    "score": 62,
    "factores": ["factor concreto con dato real 1", "factor concreto 2", "factor concreto 3"],
    "drawdown": "-22%",
    "sharpe": "1.4"
  },
  "macro": {
    "fed_rate": "5.25%",
    "inflacion_us": "3.2%",
    "dxy": "103.4",
    "vix": "18.5",
    "resumen": "Resumen macro de 1 oración con datos actuales"
  }
}`;

  try {
    // Gemini 1.5 Flash with Google Search grounding for real-time data
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
            responseMimeType: 'text/plain',
          }
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `Gemini API Error HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';

    // Extract JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('La IA no devolvió JSON válido. Intenta de nuevo.');

    const parsed = JSON.parse(jsonMatch[0]);

    // Add grounding sources if available
    const groundingChunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    if (groundingChunks.length > 0) {
      parsed.web_sources = groundingChunks
        .filter(c => c.web)
        .map(c => ({ title: c.web.title, uri: c.web.uri }))
        .slice(0, 6);
    }

    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
