const express = require("express");
const router  = require("express").Router();
const db      = require("../config/db");

function toKg(quantity, unit) {
  const map = {
    kg:      1,
    g:       0.001,
    unidade: 0.3,
    garrafa: 0.4,
    lata:    0.015,
    caixa:   0.5,
  };
  return parseFloat(quantity) * (map[unit] ?? 1);
}

router.post("/recycling/calculate", (req, res) => {
  const { material_id, quantity, unit = "kg" } = req.body;

  if (!material_id || !quantity)
    return res.status(400).json({ error: "material_id e quantity são obrigatórios." });

  db.query("SELECT * FROM materials WHERE id = ?", [material_id], (err, rows) => {
    if (err || rows.length === 0)
      return res.status(404).json({ error: "Material não encontrado." });

    const material      = rows[0];
    const qty_kg        = toKg(quantity, unit);
    const co2_avoided   = +(qty_kg * material.co2_factor).toFixed(4);
    const water_saved   = +(qty_kg * material.water_factor).toFixed(4);
    const points_earned = Math.round(qty_kg * material.points_per_kg);

    return res.json({
      material_name: material.name,
      quantity_kg:   +qty_kg.toFixed(3),
      co2_avoided,
      water_saved,
      points_earned,
      co2_factor:    material.co2_factor,
      water_factor:  material.water_factor,
    });
  });
});

router.post("/recycling/log", (req, res) => {
  const { user_id, material_id, quantity, unit = "kg", notes, photo_url, collection_point_id } = req.body;

  if (!user_id || !material_id || !quantity)
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });

  db.query("SELECT * FROM materials WHERE id = ?", [material_id], (err, rows) => {
    if (err || rows.length === 0)
      return res.status(404).json({ error: "Material não encontrado." });

    const material      = rows[0];
    const qty_kg        = toKg(quantity, unit);
    const co2_avoided   = +(qty_kg * material.co2_factor).toFixed(4);
    const water_saved   = +(qty_kg * material.water_factor).toFixed(4);
    const points_earned = Math.round(qty_kg * material.points_per_kg);

    const insertLog = `
      INSERT INTO recycling_logs
        (user_id, material_id, quantity, unit, quantity_kg,
         co2_avoided, water_saved, points_earned, photo_url, notes, collection_point_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertLog,
      [user_id, material_id, quantity, unit, qty_kg,
       co2_avoided, water_saved, points_earned,
       photo_url ?? null, notes ?? null, collection_point_id ?? null],
      (err2, result) => {
        if (err2) return res.status(500).json({ error: "Erro ao salvar log.", detail: err2 });

        const updateUser = `
          UPDATE users
          SET eco_points  = eco_points  + ?,
              total_kg    = total_kg    + ?,
              co2_avoided = co2_avoided + ?,
              water_saved = water_saved + ?,
              level = CASE
                WHEN (eco_points + ?) >= 5000 THEN 'Guardião'
                WHEN (eco_points + ?) >= 2000 THEN 'Floresta'
                WHEN (eco_points + ?) >= 800  THEN 'Árvore'
                WHEN (eco_points + ?) >= 200  THEN 'Broto'
                ELSE 'Semente'
              END
          WHERE id = ?
        `;

        db.query(updateUser,
          [points_earned, qty_kg, co2_avoided, water_saved,
           points_earned, points_earned, points_earned, points_earned, user_id],
          () => {
            checkAndGrantBadges(user_id, () => {
              res.json({
                message:      "Registro salvo com sucesso!",
                log_id:       result.insertId,
                quantity_kg:  +qty_kg.toFixed(3),
                co2_avoided,
                water_saved,
                points_earned,
              });
            });
          }
        );
      }
    );
  });
});

function checkAndGrantBadges(user_id, callback) {
  const userSql = `
    SELECT u.eco_points, u.total_kg,
           (SELECT COUNT(*) FROM recycling_logs WHERE user_id = u.id) AS logs_count
    FROM users u WHERE u.id = ?
  `;

  db.query(userSql, [user_id], (err, rows) => {
    if (err || rows.length === 0) return callback();

    const { eco_points, total_kg, logs_count } = rows[0];

    db.query("SELECT * FROM badges WHERE condition_material_id IS NULL", (err2, badges) => {
      if (err2 || badges.length === 0) return callback();

      const toGrant = badges.filter(b => {
        if (b.condition_type === "total_kg")     return total_kg   >= b.condition_value;
        if (b.condition_type === "total_points") return eco_points >= b.condition_value;
        if (b.condition_type === "logs_count")   return logs_count >= b.condition_value;
        return false;
      });

      if (toGrant.length === 0) return callback();

      const inserts = toGrant.map(b =>
        new Promise(resolve => {
          db.query(
            "INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)",
            [user_id, b.id],
            () => resolve()
          );
        })
      );

      Promise.all(inserts).then(callback);
    });
  });
}

router.get("/recycling/history/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  const sql = `
    SELECT rl.*, m.name AS material_name, m.icon AS material_icon
    FROM recycling_logs rl
    JOIN materials m ON rl.material_id = m.id
    WHERE rl.user_id = ?
    ORDER BY rl.logged_at DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [user_id, Number(limit), Number(offset)], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar histórico." });
    res.json(rows);
  });
});

router.get("/recycling/stats/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.query(
    `SELECT
       COUNT(*) AS total_logs,
       COALESCE(SUM(quantity_kg), 0)   AS total_kg,
       COALESCE(SUM(co2_avoided), 0)   AS total_co2,
       COALESCE(SUM(water_saved), 0)   AS total_water,
       COALESCE(SUM(points_earned), 0) AS total_points
     FROM recycling_logs WHERE user_id = ?`,
    [user_id],
    (err, totals) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar estatísticas." });

      db.query(
        `SELECT
           DATE_FORMAT(logged_at, '%Y-%m') AS month,
           SUM(quantity_kg)                AS kg,
           SUM(points_earned)              AS points
         FROM recycling_logs
         WHERE user_id = ?
           AND logged_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
         GROUP BY month
         ORDER BY month`,
        [user_id],
        (err2, monthly) => {
          if (err2) return res.status(500).json({ error: "Erro ao buscar mensais." });

          db.query(
            `SELECT m.name, m.icon,
                    ROUND(SUM(rl.quantity_kg), 2) AS kg,
                    SUM(rl.points_earned) AS points
             FROM recycling_logs rl
             JOIN materials m ON rl.material_id = m.id
             WHERE rl.user_id = ?
             GROUP BY m.id
             ORDER BY kg DESC`,
            [user_id],
            (err3, byMaterial) => {
              if (err3) return res.status(500).json({ error: "Erro ao buscar por material." });
              res.json({ ...totals[0], monthly, by_material: byMaterial });
            }
          );
        }
      );
    }
  );
});

router.get("/recycling/badges/:user_id", (req, res) => {
  const sql = `
    SELECT b.*, ub.earned_at
    FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ?
    ORDER BY ub.earned_at DESC
  `;

  db.query(sql, [req.params.user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar badges." });
    res.json(rows);
  });
});

module.exports = router;
