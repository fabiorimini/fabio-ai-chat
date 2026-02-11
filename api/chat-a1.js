export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🔎 TEST: mostra se la variabile è definita
  const hfKey = process.env.HF_API_KEY;

  if (!hfKey) {
    return res.status(500).json({ error: "HF_API_KEY non trovata" });
  }

  return res.status(200).json({ message: "Chiave trovata!", keyPrefix: hfKey.slice(0,10) });
}
