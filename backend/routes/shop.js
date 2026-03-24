const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/add", (req, res) => {

  const { shop_name, address, latitude, longitude, products } = req.body;

  // 1️⃣ Insert shop
  const shopSql = `
    INSERT INTO shops (name, address, lat, lng)
    VALUES (?, ?, ?, ?)
  `;

  db.query(shopSql, [shop_name, address, latitude, longitude], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    const shopId = result.insertId;

    // 2️⃣ Insert products
    if (products && products.length > 0) {

      const productSql = `
        INSERT INTO products (shop_id, product_name, price, stock)
        VALUES ?
      `;

      const productValues = products.map(p => [
        shopId,
        p.name,
        p.price,
        100
      ]);

      db.query(productSql, [productValues], (err2) => {

        if (err2) {
          console.log(err2);
          return res.status(500).send(err2);
        }

        res.json({ message: "Shop & products saved successfully" });
      });

    } else {
      res.json({ message: "Shop saved (no products)" });
    }

  });

});

module.exports = router;