const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");
const customerRoutes = require("./routes/customer");
const ratingsRoutes = require("./routes/ratings");
const messagesRoutes = require("./routes/messages");

const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/messages", messagesRoutes);

/* WISHLIST - ADD */
app.post("/api/wishlist/add", (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const existing = db.prepare("SELECT * FROM wishlist WHERE user_id=? AND product_id=?").get(user_id, product_id);
    if (existing) return res.json({ message: "Already in wishlist" });
    db.prepare("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)").run(user_id, product_id);
    res.json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* WISHLIST - GET */
app.get("/api/wishlist/:user_id", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT wishlist.id, products.id AS product_id, products.product_name,
             products.category, products.price, products.image_url,
             shops.id AS shop_id, shops.name AS shop_name
      FROM wishlist
      JOIN products ON wishlist.product_id = products.id
      JOIN shops ON products.shop_id = shops.id
      WHERE wishlist.user_id = ?
    `).all(req.params.user_id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* WISHLIST - REMOVE */
app.delete("/api/wishlist/remove/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM wishlist WHERE id=?").run(req.params.id);
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
