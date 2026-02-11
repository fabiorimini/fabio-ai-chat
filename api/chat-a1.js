export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      info: "API online. Use POST with { message: \"...\" }"
    });
  }

  try {
    const body = req.body || {};
    const userMessage = body.message || "";

    if (!userMessage) {
      return res.status(400).json({
        error: "Missing 'message' in request body"
      });
    }

    const prompt = `
You are an English teacher for beginners (A1 level).
Use very simple words and short sentences.
Correct mistakes gently.
Student message: ${userMessage}
`;

    const hfKey = process.env.HF_API_KEY;

    if (!hfKey) {
      return res.status(500).json({ error: "HF_API_KEY non trovata" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.4
          }
        })
      }
    );

    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      return res.status(500).json({
        error: "Unexpected model response",
        raw: data
      });
    }

    res.status(200).json({
      reply: data[0].generated_text
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
