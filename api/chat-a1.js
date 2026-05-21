export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Metodo non consentito" });
    }

    const { prompt, model, max_tokens = 150, temperature = 0.5 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt mancante" });
    }

    // Modello OpenRouter FREE senza limiti
    const safeModel = model || "google/gemini-2.0-flash-lite-preview-02-05:free";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: safeModel,
        messages: [{ role: "user", content: prompt }],
        max_tokens,
        temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        error: "Errore OpenRouter",
        details: errorText
      });
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({
        error: "Risposta non valida dal modello",
        raw: data
      });
    }

    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      error: "Errore interno del server",
      details: err.toString()
    });
  }
}
