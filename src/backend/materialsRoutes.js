const express = require("express");
const router  = express.Router();
const db      = require("../config/db");

router.get("/materials", (_, res) => {
  db.query("SELECT * FROM materials ORDER BY name", (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar materiais." });
    res.json(rows);
  });
});

router.get("/materials/:id", (req, res) => {
  db.query("SELECT * FROM materials WHERE id = ?", [req.params.id], (err, rows) => {
    if (err || rows.length === 0)
      return res.status(404).json({ error: "Material não encontrado." });
    res.json(rows[0]);
  });
});

module.exports = router;
