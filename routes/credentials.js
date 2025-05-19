const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// Get all credentials
router.get("/", authenticateToken, (req, res) => {
    const userId = req.user.userId;
    db.query(
        "SELECT id, title, username, category FROM credentials WHERE user_id = ?",
        [userId],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        }
    );
});
router.get("/:id", authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const credId = req.params.id;
    db.query(
        "SELECT data_blob FROM credentials WHERE id = ? AND user_id = ?",
        [credId, userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: "Not found" });
            res.json({ data_blob: results[0].data_blob });
        }
    );
});
// Add a credential
router.post("/", authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const { title, username, data_blob, category } = req.body;
    db.query(
        "INSERT INTO credentials (user_id, title, username, data_blob, category) VALUES (?, ?, ?, ?, ?)",
        [userId, title, username, data_blob, category],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Saved successfully" });
        }
    );
});
router.delete("/:id", authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const credId = req.params.id;

    db.query(
        "DELETE FROM credentials WHERE id = ? AND user_id = ?",
        [credId, userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Credential not found" });
            }
            res.json({ message: "Credential deleted" });
        }
    );
});
module.exports = router;
