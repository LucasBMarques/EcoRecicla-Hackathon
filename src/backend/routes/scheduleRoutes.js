const express = require("express");
const router  = express.Router();
const db      = require("../config/db");

router.get("/schedules/:user_id", (req, res) => {
  const sql = `
    SELECT cs.*, cp.name AS point_name, m.name AS material_name, m.icon
    FROM collection_schedules cs
    LEFT JOIN collection_points cp ON cs.collection_point_id = cp.id
    LEFT JOIN materials m ON cs.material_id = m.id
    WHERE cs.user_id = ?
    ORDER BY cs.scheduled_date, cs.scheduled_time
  `;
  db.query(sql, [req.params.user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar agendamentos." });
    res.json(rows);
  });
});

router.post("/schedules", (req, res) => {
  const { user_id, collection_point_id, material_id, scheduled_date, scheduled_time, notes } = req.body;

  if (!user_id || !scheduled_date)
    return res.status(400).json({ error: "user_id e scheduled_date são obrigatórios." });

  const sql = `
    INSERT INTO collection_schedules
      (user_id, collection_point_id, material_id, scheduled_date, scheduled_time, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [user_id, collection_point_id ?? null, material_id ?? null,
     scheduled_date, scheduled_time ?? null, notes ?? null],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao criar agendamento." });
      res.json({ message: "Agendamento criado!", id: result.insertId });
    }
  );
});

router.patch("/schedules/:id/status", (req, res) => {
  const { status } = req.body;
  const allowed = ["pendente", "confirmado", "concluido", "cancelado"];

  if (!allowed.includes(status))
    return res.status(400).json({ error: "Status inválido." });

  db.query(
    "UPDATE collection_schedules SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar status." });
      res.json({ message: "Status atualizado!" });
    }
  );
});

router.delete("/schedules/:id", (req, res) => {
  db.query("DELETE FROM collection_schedules WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar agendamento." });
    res.json({ message: "Agendamento removido!" });
  });
});

router.put("/schedules/:id", (req, res) => {
  const { material_id, scheduled_date, scheduled_time, notes, status } = req.body;

  if (!scheduled_date)
    return res.status(400).json({ error: "scheduled_date é obrigatório." });

  const sql = `
    UPDATE collection_schedules
    SET material_id = ?, scheduled_date = ?, scheduled_time = ?, notes = ?, status = ?
    WHERE id = ?
  `;

  db.query(sql,
    [material_id ?? null, scheduled_date, scheduled_time ?? null, notes ?? null, status ?? "pendente", req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar agendamento." });
      res.json({ message: "Agendamento atualizado!" });
    }
  );
});

module.exports = router;