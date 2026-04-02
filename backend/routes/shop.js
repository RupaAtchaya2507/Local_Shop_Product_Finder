const express = require("express");
const router = express.Router();
const db = require("../db");

/* ADD SHOP + PRODUCTS */
router.post("/add", (req, res) => {
  const { owner_id, shop_name, address, phone, latitude, longitude, products } = req.body;
  try {
    const shopResult = db.prepare(
      "INSERT INTO shops (owner_id, name, address, phone, lat, lng) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(owner_id, shop_name, address, phone || "", latitude, longitude);
    const shopId = shopResult.lastInsertRowid;

    if (products && products.length > 0) {
      const insertProduct = db.prepare(
        "INSERT INTO products (shop_id, product_name, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)"
      );
      products.forEach(p => insertProduct.run(shopId, p.name, p.category || "General", p.price, p.stock || 100, p.image_url || ""));
    }
    res.json({ message: "Shop & products saved successfully", shop_id: shopId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET SHOP OWNER'S SHOP — must be defined BEFORE /:id */
router.get("/my-shop", (req, res) => {
  const { owner_id } = req.query;
  try {
    const shop = db.prepare("SELECT * FROM shops WHERE owner_id = ?").get(owner_id);
    if (!shop) return res.json(null);
    const products = db.prepare("SELECT * FROM products WHERE shop_id = ?").all(shop.id);
    res.json({ ...shop, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET SHOP BY ID */
router.get("/:id", (req, res) => {
  try {
    const shop = db.prepare("SELECT * FROM shops WHERE id = ?").get(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    const products = db.prepare("SELECT * FROM products WHERE shop_id = ?").all(shop.id);
    const ratings = db.prepare(`
      SELECT ratings.*, users.name AS reviewer_name
      FROM ratings JOIN users ON ratings.user_id = users.id
      WHERE ratings.shop_id = ? ORDER BY ratings.created_at DESC
    `).all(shop.id);
    res.json({ ...shop, products, ratings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE STOCK */
router.put("/update-stock", (req, res) => {
  const { product_id, stock } = req.body;
  try {
    db.prepare("UPDATE products SET stock = ? WHERE id = ?").run(stock, product_id);
    res.json({ message: "Stock updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE PRODUCT */
router.put("/update-product", (req, res) => {
  const { product_id, product_name, category, price, stock, image_url } = req.body;
  try {
    db.prepare(
      "UPDATE products SET product_name=?, category=?, price=?, stock=?, image_url=? WHERE id=?"
    ).run(product_name, category, price, stock, image_url || "", product_id);
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ADD PRODUCT TO EXISTING SHOP */
router.post("/add-product", (req, res) => {
  const { shop_id, product_name, category, price, stock, image_url } = req.body;
  try {
    const result = db.prepare(
      "INSERT INTO products (shop_id, product_name, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(shop_id, product_name, category || "General", price, stock || 100, image_url || "");
    res.json({ message: "Product added", product_id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE PRODUCT */
router.delete("/delete-product/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
