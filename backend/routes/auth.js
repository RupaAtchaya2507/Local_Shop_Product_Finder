const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = "secretkey";

/* SIGNUP */
router.post("/signup", async (req, res) => {
  const { name, email, password, user_type } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, hashedPassword, user_type], (err) => {
    if (err) return res.status(400).json({ message: "User already exists" });
    res.json({ message: "Signup successful" });
  });
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (result.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, user_type: user.user_type },
      JWT_SECRET
    );

    res.json({
      token,
      user_type: user.user_type,
      name: user.name
    });
  });
});

module.exports = router;
