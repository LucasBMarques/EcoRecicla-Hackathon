const db = require("../config/db");

exports.create = (req, res) => {
  const { name, address, latitude, longitude, materials, user_id } = req.body;

  const sql = "INSERT INTO collection_points (name, address, latitude, longitude, materials, user_id) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [name, address, latitude, longitude, materials, user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao cadastrar ponto de coleta" });
    }
    res.json({ message: "Ponto de coleta cadastrado com sucesso", id: result.insertId });
  });
};

exports.getAll = (req, res) => {
  const sql = "SELECT * FROM collection_points";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar pontos de coleta" });
    }
    res.json(result);
  });
};