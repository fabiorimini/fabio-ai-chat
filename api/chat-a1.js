import OpenAI from "openai";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, model, max_tokens, temperature } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt mancante" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: max_tokens || 200,
      temperature: temperature || 0.5
    });

    const reply = completion.choices?.[0]?.message?.content || "";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      error: "Errore interno",
      details: err.toString()
    });
  }
}

