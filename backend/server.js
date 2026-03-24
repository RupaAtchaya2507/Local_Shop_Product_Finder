const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");
const customerRoutes = require("./routes/customer");

const db = require("./db"); // database connection

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/customer", customerRoutes);

/* ADD TO WISHLIST */
app.post("/api/wishlist/add", (req, res) => {

  const { user_id, product_id } = req.body;

  const checkSql =
    "SELECT * FROM wishlist WHERE user_id=? AND product_id=?";

  db.query(checkSql, [user_id, product_id], (err, rows) => {

    if (err) return res.status(500).send(err);

    if (rows.length > 0) {
      return res.json({ message: "Already in wishlist" });
    }

    const sql =
      "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";

    db.query(sql, [user_id, product_id], (err, result) => {

      if (err) return res.status(500).send(err);

      res.json({ message: "Added to wishlist" });

    });

  });

});

/* GET WISHLIST */
app.get("/api/wishlist/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
  SELECT 
    wishlist.id,
    products.product_name,
    products.price,
    shops.name AS shop_name
  FROM wishlist
  JOIN products ON wishlist.product_id = products.id
  JOIN shops ON products.shop_id = shops.id
  WHERE wishlist.user_id = ?
`;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.json(result);
  });
});

/* REMOVE FROM WISHLIST */
app.delete("/api/wishlist/remove/:id", (req, res) => {

  const id = req.params.id;

  const sql = "DELETE FROM wishlist WHERE id=?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.json({ message: "Removed from wishlist" });

  });

});


/* SERVER */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});