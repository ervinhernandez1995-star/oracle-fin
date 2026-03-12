export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY no configurada en Vercel' });
  const { query, markets, model } = req.body;
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
          {
            role: 'system',
            content: 'Eres ORACLE FIN, experto en especulacion financiera. Responde SIEMPRE en español. Devuelve UNICAMENTE JSON valido sin texto extra ni markdown con esta estructura exacta: {"analisis":"texto de 250 palabras con datos reales de mercado","sentimiento":{"indice":65,"alcista":"54%","neutral":"28%","bajista":"18%","etiqueta":"CODICIA"},"oportunidades":[{"nombre":"Bitcoin","ticker":"BTC","tipo":"crypto","precio_actual":"$97000","retorno":"+35%","precio_objetivo":"$131000","horizonte":"3 meses","confianza":78,"bull":true,"razon":"razon especifica"},{"nombre":"Nvidia","ticker":"NVDA","tipo":"accion","precio_actual":"$875","retorno":"+18%","precio_objetivo":"$1032","horizonte":"6 meses","confianza":85,"bull":true,"razon":"razon especifica"},{"nombre":"Gold ETF","ticker":"GLD","tipo":"etf","precio_actual":"$224","retorno":"-5%","precio_objetivo":"$213","horizonte":"1 mes","confianza":71,"bull":false,"razon":"razon de riesgo"}],"portafolio":[{"activo":"Bitcoin","ticker":"BTC","pct":30,"razon":"mayor potencial","color":"#00f5c3"},{"activo":"Nvidia","ticker":"NVDA","pct":25,"razon":"lider en IA","color":"#a855f7"},{"activo":"SP500 ETF","ticker":"SPY","pct":20,"razon":"diversificacion","color":"#f5c842"},{"activo":"Gold","ticker":"GLD","pct":15,"razon":"refugio seguro","color":"#ff6b35"},{"activo":"Cash","ticker":"MXN","pct":10,"razon":"liquidez","color":"#4a7090"}],"riesgo":{"nivel":"MODERADO","score":62,"factores":["Volatilidad cripto alta","Incertidumbre Fed tasas","Tension geopolitica"],"drawdown":"-22%","sharpe":"1.4"},"macro":{"fed_rate":"5.25%","inflacion_us":"3.2%","dxy":"103.4","vix":"18.5","resumen":"Mercado en modo espera ante decision de la Fed"}}'
          },
          {
            role: 'user',
            content: `Consulta: "${query}". Mercados: ${markets}. Modelo de inversion: ${model}. Fecha: ${new Date().toLocaleDateString('es-MX')}. Genera analisis especifico para Mexico con pesos mexicanos si aplica.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
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
