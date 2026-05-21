export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // --- Preflight request ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // --- Only POST allowed ---
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, model: "openai/gpt-3.5-turbo:free", max_tokens = 120, temperature = 0.3 } = req.body;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens,
        temperature
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Errore OpenRouter:", data);
      return res.status(500).json({ error: data.error || "Errore API" });
    }

    const reply = data.choices?.[0]?.message?.content || "Nessuna risposta dal modello.";
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Errore server:", error);
    return res.status(500).json({ error: error.message });
  }
}
