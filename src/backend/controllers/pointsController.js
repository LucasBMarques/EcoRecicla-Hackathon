const db = require("../config/db");

exports.getPoints = (req, res) => {

  const sql = "SELECT * FROM collection_points";

  db.query(sql, (err, result) => {

    if (err) {
      console.error("Erro ao buscar pontos:", err);
      return res.status(500).json({ error: "Erro ao buscar pontos de coleta" });
    }

    res.json(result || []);

  });

};

exports.addPoint = (req, res) => {
  const { name, latitude, longitude, material } = req.body;

  const sql = "INSERT INTO collection_points (name, latitude, longitude, material) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, latitude, longitude, material], (err, result) => {
    if (err) {
      console.error("Erro ao adicionar ponto:", err);
      return res.status(500).json({ error: "Erro ao adicionar ponto" });
    }

    res.json({ message: "Ponto adicionado com sucesso", id: result.insertId });
  });
};