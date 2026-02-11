export default function handler(req, res) {
  return res.status(200).json({
    keyFound: !!process.env.OPENROUTER_API_KEY,
    keyValue: process.env.OPENROUTER_API_KEY ? "OK" : "MISSING"
  });
}
