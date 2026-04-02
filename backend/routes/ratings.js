const express = require("express");
const router = express.Router();
const db = require("../db");

/* SUBMIT RATING */
router.post("/shop/:shop_id", (req, res) => {
  const { user_id, rating, review } = req.body;
  const { shop_id } = req.params;
  if (!user_id || isNaN(Number(user_id))) return res.status(400).json({ message: "Invalid user" });
  const userExists = db.prepare("SELECT id FROM users WHERE id=?").get(user_id);
  if (!userExists) return res.status(400).json({ message: "User not found. Please log out and log in again." });
  try {
    const existing = db.prepare("SELECT * FROM ratings WHERE user_id=? AND shop_id=?").get(user_id, shop_id);
    if (existing) {
      db.prepare("UPDATE ratings SET rating=?, review=? WHERE user_id=? AND shop_id=?").run(rating, review, user_id, shop_id);
    } else {
      db.prepare("INSERT INTO ratings (user_id, shop_id, rating, review) VALUES (?, ?, ?, ?)").run(user_id, shop_id, rating, review);
    }
    const avg = db.prepare("SELECT AVG(rating) as avg FROM ratings WHERE shop_id=?").get(shop_id);
    db.prepare("UPDATE shops SET rating=? WHERE id=?").run(Number(avg.avg).toFixed(1), shop_id);
    res.json({ message: "Rating submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET RATINGS FOR SHOP */
router.get("/shop/:shop_id", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT ratings.*, users.name AS reviewer_name
      FROM ratings JOIN users ON ratings.user_id = users.id
      WHERE ratings.shop_id = ? ORDER BY ratings.created_at DESC
    `).all(req.params.shop_id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
