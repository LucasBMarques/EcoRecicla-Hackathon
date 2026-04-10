const db = require("../config/db");

exports.getAll = (req, res) => {
  const sql = "SELECT id, name, icon, co2_factor, water_factor, points_per_kg, units_accepted, description, preparation_tip FROM materials ORDER BY name";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar materiais" });
    }
    res.json(result);
  });
};
