const express = require("express");
const router = express.Router();
const db = require("../db");

/* ===== DISTANCE FUNCTION ===== */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ===== SEARCH PRODUCT ===== */
router.get("/search", (req, res) => {
  const { product, lat, lng } = req.query;

  if (!product || !lat || !lng) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const sql = `
    SELECT 
      products.id AS product_id,
      products.product_name,
      products.price,
      shops.name,
      shops.lat,
      shops.lng
    FROM products
    JOIN shops ON products.shop_id = shops.id
    WHERE LOWER(products.product_name) LIKE LOWER(?)
  `;

  db.query(sql, [`%${product}%`], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json(err);
    }

    const data = result
      .map(item => {
        const distance = getDistance(
          parseFloat(lat),
          parseFloat(lng),
          parseFloat(item.lat),
          parseFloat(item.lng)
        );

        return {
          ...item,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng),
          price: Number(item.price),
          distance: Number(distance.toFixed(2))
        };
      })
      .sort((a, b) => a.distance - b.distance);

    console.log("FINAL DATA:", data);

    res.json(data);
  });
});

module.exports = router;