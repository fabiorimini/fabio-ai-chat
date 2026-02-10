export default async function handler(req, res) {
  try {
    const userMessage = req.body.message || "";

    const prompt = `
You are an English teacher for beginners (A1 level).
Use very simple words and short sentences.
Correct mistakes gently.
Student message: ${userMessage}
`;

    const hfKey = process.env.HF_API_KEY;

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
