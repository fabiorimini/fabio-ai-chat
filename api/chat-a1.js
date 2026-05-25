export default async function handler(req, res) {
  // ✅ Header CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Gestione preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Metodo non consentito" });
    }

    const body = req.body;

    if (!body || !body.prompt) {
      return res.status(400).json({ error: "Prompt mancante" });
    }

    const prompt = body.prompt;
    const model = body.model || "openrouter/free";   // fallback sicuro
    const max_tokens = body.max_tokens || 800;
    const temperature = body.temperature || 0.5;

    // ✅ Chiamata a OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens,
        temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "Errore OpenRouter",
        details: errorText
      });
    }

    const data = await response.json();

    // ✅ Estrarre la risposta in modo sicuro
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "Risposta non valida dal modello",
        raw: data
      });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      error: "Errore interno del server",
      details: err.toString()
    });
  }
}
