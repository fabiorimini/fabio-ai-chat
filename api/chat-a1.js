const response = await fetch(
  "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
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
