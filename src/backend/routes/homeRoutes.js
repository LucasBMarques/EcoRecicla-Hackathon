const express = require("express");
const router = express.Router();
const db = require("../config/db");
const statsController = require("../controllers/homeController");

router.get("/stats", statsController.getStats);

router.get("/ranking", (req, res) => {
  const query = `
    SELECT 
      id, 
      name, 
      nickname, 
      eco_points, 
      level, 
      total_kg, 
      co2_avoided, 
      photo 
    FROM users 
    ORDER BY eco_points DESC 
    LIMIT 50
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const ranking = results.map((user, index) => ({
      position: index + 1,
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

module.exports = router;