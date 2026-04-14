const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

/* SIGNUP */
router.post("/signup", async (req, res) => {
  const { name, email, password, user_type } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run(name, email, hashedPassword, user_type);
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ message: "User already exists" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id, user_type: user.user_type }, JWT_SECRET);
  res.json({ token, id: user.id, user_type: user.user_type, name: user.name });
});

module.exports = router;
