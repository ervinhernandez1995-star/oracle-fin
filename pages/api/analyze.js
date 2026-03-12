export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'API Key no configurada. Ve a Vercel → Settings → Environment Variables → agrega GROQ_API_KEY con tu clave de console.groq.com'
    });
  }

  const { query, markets, model } = req.body;

  const systemPrompt = `Eres ORACLE FIN, sistema experto de especulación financiera con conocimiento profundo de mercados globales. 
Tienes acceso a datos actualizados hasta marzo 2026. Responde SIEMPRE en español.
Sé muy específico con precios, porcentajes y datos reales. Simula que tienes acceso a Bloomberg, Reuters, CoinGecko, TradingView y datos macroeconómicos actuales.

Devuelve ÚNICAMENTE este JSON sin markdown, sin bloques de código, sin texto extra:
{
  "analisis": "Análisis detallado de 250-300 palabras con datos reales, precios actuales estimados, tendencias del mercado, catalizadores y contexto macroeconómico específico para la consulta",
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
