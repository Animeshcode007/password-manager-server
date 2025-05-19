// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    db.query(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        [username, hash],
        (err, result) => {
            if (err) return res.status(400).json({ message: "User exists!" });
            res.json({ message: "User registered" });
        }
    );
});

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, results) => {
            if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

            const user = results[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) return res.status(401).json({ message: "Invalid credentials" });

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "2h" });
            res.json({ token });
        }
    );
});

module.exports = router;
