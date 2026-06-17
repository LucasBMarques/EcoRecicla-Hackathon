const db = require("../config/db");

exports.create = (req, res) => {
  const { name, address, latitude, longitude, materials, user_id, phone, opening_hours } = req.body;

  if (!name || !address || !latitude || !longitude || !user_id) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  const sql = "INSERT INTO collection_points (name, address, latitude, longitude, materials, user_id, phone, opening_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [name, address, latitude, longitude, materials, user_id, phone ?? null, opening_hours ?? null], (err, result) => {
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

exports.update = (req, res) => {
  const { id } = req.params;
  const { user_id, name, phone, opening_hours, materials } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "ID do usuário não fornecido." });
  }

  db.query("SELECT user_id FROM collection_points WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao verificar ponto." });
    if (rows.length === 0) return res.status(404).json({ error: "Ponto não encontrado." });
    if (rows[0].user_id !== user_id) return res.status(403).json({ error: "Sem permissão para editar este ponto." });

    const sql = `UPDATE collection_points SET name = ?, phone = ?, opening_hours = ?, materials = ? WHERE id = ?`;
    db.query(sql, [name, phone ?? null, opening_hours ?? null, materials, id], (err2) => {
      if (err2) return res.status(500).json({ error: "Erro ao atualizar ponto." });
      res.json({ message: "Ponto atualizado com sucesso" });
    });
  });
};

exports.remove = (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "ID do usuário não fornecido." });
  }

  db.query("SELECT user_id FROM collection_points WHERE id = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao verificar ponto de coleta." });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ponto de coleta não encontrado." });
    }

    if (rows[0].user_id !== user_id) {
      return res.status(403).json({ error: "Você não tem permissão para excluir este ponto." });
    }

    db.query("DELETE FROM collection_points WHERE id = ?", [id], (err2) => {
      if (err2) {
        return res.status(500).json({ error: "Erro ao excluir ponto de coleta." });
      }
      res.json({ message: "Ponto de coleta excluído com sucesso" });
    });
  });
};