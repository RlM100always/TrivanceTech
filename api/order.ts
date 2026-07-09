// api/order.ts
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyOsTHVz9_mG0W9mPAKMjhjP92ypAtyQfj6qXmF_VKZRN5QSYvmo60LdYvmOh-lrNOotw/exec"; // তোমার GAS URL
const SECRET_TOKEN = "Password"; // তোমার GAS secret token

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = { token: SECRET_TOKEN, ...req.body };

    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON from GAS:", text);
      return res.status(500).json({ status: "error", message: "Invalid response from server" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ status: "error", message: err.message || "Unknown server error" });
  }
}
