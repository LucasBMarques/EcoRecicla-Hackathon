const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const db = require("../config/db");

router.get("/stats", homeController.getStats);

router.get("/ranking", (req, res) => {
  // Busca apenas quem optou por aparecer, mas com a posição real
  // calculada sobre TODOS os usuários
  const query = `
    SELECT 
      u.id, 
      u.name, 
      u.nickname, 
      u.eco_points, 
      u.level, 
      u.total_kg, 
      u.co2_avoided, 
      u.photo,
      (
        SELECT COUNT(*) + 1
        FROM users u2
        WHERE u2.eco_points > u.eco_points
      ) AS real_position
    FROM users u
    WHERE u.public_ranking = TRUE
    ORDER BY u.eco_points DESC 
    LIMIT 50
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const ranking = results.map((user) => ({
      position: user.real_position,
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      eco_points: user.eco_points,
      level: user.level,
      total_kg: user.total_kg,
      co2_avoided: user.co2_avoided,
      photo: user.photo ? Buffer.from(user.photo).toString("base64") : null
    }));

    res.json(ranking);
  });
});

router.get("/ranking/position/:userId", (req, res) => {
  const { userId } = req.params;

  // Busca a posição real do usuário considerando TODOS os usuários
  const query = `
    SELECT 
      id,
      eco_points,
      level,
      (
        SELECT COUNT(*) + 1
        FROM users u2
        WHERE u2.eco_points > u1.eco_points
      ) AS position,
      (SELECT COUNT(*) FROM users) AS total_users
    FROM users u1
    WHERE id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      position: results[0].position,
      eco_points: results[0].eco_points,
      level: results[0].level,
      total_users: results[0].total_users,
    });
  });
});

module.exports = router;