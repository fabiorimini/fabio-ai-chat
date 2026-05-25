export default async function handler(req, res) {
  // ✅ Header CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // ✅ Chiamata a OpenRouter con la tua API key da Environment Variables
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "Errore OpenRouter",
        details: errorText
      });
    }

    const data = await response.json();

    // ✅ Filtra solo i modelli free
    const freeModels = data.filter(m => m.id.includes(":free"));

    return res.status(200).json(freeModels);

  } catch (err) {
    return res.status(500).json({
      error: "Errore interno del server",
      details: err.toString()
    });
  }
}

