const express = require("express");
const router = express.Router();
const db = require("../db");

/* SEND MESSAGE */
router.post("/send", (req, res) => {
  const { user_id, shop_id, sender, message } = req.body;
  try {
    db.prepare("INSERT INTO messages (user_id, shop_id, sender, message) VALUES (?, ?, ?, ?)").run(user_id, shop_id, sender, message);
    res.json({ message: "Message sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET MESSAGES FOR A SHOP+USER CONVERSATION */
router.get("/conversation", (req, res) => {
  const { user_id, shop_id } = req.query;
  try {
    const rows = db.prepare(
      "SELECT * FROM messages WHERE user_id=? AND shop_id=? ORDER BY timestamp ASC"
    ).all(user_id, shop_id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL CONVERSATIONS FOR A SHOP (shop owner view) */
router.get("/shop/:shop_id", (req, res) => {
  try {
    const conversations = db.prepare(`
      SELECT DISTINCT messages.user_id, users.name AS customer_name
      FROM messages JOIN users ON messages.user_id = users.id
      WHERE messages.shop_id = ?
    `).all(req.params.shop_id);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
