const db = require("../config/db");

exports.getAll = (req, res) => {
  const sql = "SELECT * FROM material_types ORDER BY name";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar tipos de materiais" });
    }
    res.json(result);
  });
};
