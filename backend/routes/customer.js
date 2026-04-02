const express = require("express");
const router = express.Router();
const db = require("../db");

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* SEARCH PRODUCTS */
router.get("/search", (req, res) => {
  const { product, lat, lng, category, sort } = req.query;
  if (!product || !lat || !lng) return res.status(400).json({ message: "Missing parameters" });

  try {
    let sql = `
      SELECT
        products.id AS product_id,
        products.product_name,
        products.category,
        products.price,
        products.stock,
        products.image_url,
        shops.id AS shop_id,
        shops.name AS shop_name,
        shops.address,
        shops.phone,
        shops.rating,
        shops.lat,
        shops.lng
      FROM products
      JOIN shops ON products.shop_id = shops.id
      WHERE LOWER(products.product_name) LIKE LOWER(?)
        AND shops.lat IS NOT NULL AND shops.lng IS NOT NULL
    `;
    const params = [`%${product}%`];

    if (category && category !== "All") {
      sql += " AND LOWER(products.category) = LOWER(?)";
      params.push(category);
    }

    const rows = db.prepare(sql).all(...params);

    let data = rows.map(item => ({
      ...item,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lng),
      price: Number(item.price),
      rating: Number(item.rating || 0),
      distance: Number(getDistance(parseFloat(lat), parseFloat(lng), parseFloat(item.lat), parseFloat(item.lng)).toFixed(2))
    }));

    // Only return shops within 100km
    data = data.filter(item => item.distance <= 100);

    if (sort === "price") data.sort((a, b) => a.price - b.price);
    else if (sort === "rating") data.sort((a, b) => b.rating - a.rating);
    else data.sort((a, b) => a.distance - b.distance);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* SUGGEST — autocomplete product names */
router.get("/suggest", (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 1) return res.json([]);
  try {
    const rows = db.prepare(
      "SELECT DISTINCT product_name, category FROM products WHERE LOWER(product_name) LIKE LOWER(?) LIMIT 8"
    ).all(`%${q.trim()}%`);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* PRICE STATS — avg price per product name */
router.get("/price-stats", (req, res) => {
  try {
    const rows = db.prepare(
      "SELECT LOWER(product_name) AS name, AVG(price) AS avg_price, MIN(price) AS min_price FROM products GROUP BY LOWER(product_name)"
    ).all();
    const map = {};
    rows.forEach(r => { map[r.name] = { avg_price: r.avg_price, min_price: r.min_price }; });
    res.json(map);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* RECOMMENDATIONS — co-occurrence based on wishlist + category */
router.get("/recommendations", (req, res) => {
  const { product_name, category, user_id } = req.query;
  try {
    // Products in same category, excluding the searched product, ordered by stock popularity
    const recs = db.prepare(`
      SELECT p.product_name, p.category, p.price, p.image_url, p.id AS product_id,
             s.id AS shop_id, s.name AS shop_name, s.rating
      FROM products p
      JOIN shops s ON p.shop_id = s.id
      WHERE LOWER(p.category) = LOWER(?)
        AND LOWER(p.product_name) != LOWER(?)
      GROUP BY LOWER(p.product_name)
      ORDER BY s.rating DESC
      LIMIT 6
    `).all(category || "Grocery", product_name || "");

    // Also fetch products co-wishlisted with this product
    let coWishlist = [];
    if (user_id) {
      coWishlist = db.prepare(`
        SELECT DISTINCT p.product_name, p.category, p.price, p.image_url, p.id AS product_id,
               s.id AS shop_id, s.name AS shop_name, s.rating
        FROM wishlist w1
        JOIN wishlist w2 ON w1.user_id = w2.user_id AND w1.product_id != w2.product_id
        JOIN products p ON w2.product_id = p.id
        JOIN shops s ON p.shop_id = s.id
        WHERE w1.user_id = ? AND LOWER(p.product_name) != LOWER(?)
        LIMIT 4
      `).all(user_id, product_name || "");
    }

    // Merge, deduplicate by product_name
    const seen = new Set();
    const merged = [...coWishlist, ...recs].filter(r => {
      const key = r.product_name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).slice(0, 6);

    res.json(merged);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* GET ALL CATEGORIES */
router.get("/categories", (req, res) => {
  try {
    const rows = db.prepare("SELECT DISTINCT category FROM products WHERE category IS NOT NULL").all();
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
