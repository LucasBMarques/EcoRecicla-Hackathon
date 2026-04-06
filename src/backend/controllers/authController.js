const db = require("../config/db");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }

    res.json({ message: "Usuário cadastrado com sucesso" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro no login" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha inválidos" });
    }

    const token = `token_${result[0].id}_${Date.now()}`;
    
    // Converter foto de buffer para base64
    const user = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      nickname: result[0].nickname || "",
      country: result[0].country || "",
      city: result[0].city || "",
      photo: result[0].photo ? result[0].photo.toString('base64') : null
    };

    res.json({ message: "Login realizado com sucesso", user, token });
  });
};

exports.validateSession = (req, res) => {
  const { token } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(401).json({ valid: false, message: "Token inválido" });
  }

  const parts = token.split("_");
  if (parts.length < 3 || parts[0] !== "token") {
    return res.status(401).json({ valid: false, message: "Token inválido" });
  }

  const userId = Number(parts[1]);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(401).json({ valid: false, message: "Token inválido" });
  }

  const sql = "SELECT id, name, email, nickname, country, city, photo FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ valid: false, message: "Erro ao validar sessão" });
    }

    if (result.length === 0) {
      return res.status(401).json({ valid: false, message: "Usuário não encontrado" });
    }

    const user = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      nickname: result[0].nickname || "",
      country: result[0].country || "",
      city: result[0].city || "",
      photo: result[0].photo ? result[0].photo.toString("base64") : null,
    };

    return res.json({ valid: true, user });
  });
};

exports.updateProfile = (req, res) => {
  const { name, nickname, country, city, photo, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "ID do usuário não fornecido" });
  }

  const photoBuffer = photo ? Buffer.from(photo, 'base64') : null;
  
  const sql = "UPDATE users SET name = ?, nickname = ?, country = ?, city = ?, photo = ? WHERE id = ?";

  db.query(sql, [name, nickname, country, city, photoBuffer, userId], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar perfil:", err);
      return res.status(500).json({ error: "Erro ao atualizar perfil" });
    }

    res.json({ message: "Perfil atualizado com sucesso" });
  });
};

exports.getUserProfile = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "ID do usuário não fornecido" });
  }

  const sql = "SELECT id, name, email, photo FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar perfil:", err);
      return res.status(500).json({ error: "Erro ao buscar perfil" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      photo: result[0].photo ? result[0].photo.toString('base64') : null
    };

    res.json(user);
  });
};

exports.deleteAccount = (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "ID do usuário não fornecido" });
  }

  const checkUserSql = "SELECT id FROM users WHERE id = ?";
  db.query(checkUserSql, [userId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Erro ao validar usuário para exclusão:", checkErr);
      return res.status(500).json({ error: "Erro ao excluir conta" });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const deleteCollectionPointsSql = "DELETE FROM collection_points WHERE user_id = ?";
    db.query(deleteCollectionPointsSql, [userId], (pointsErr) => {
      if (pointsErr) {
        console.error("Erro ao remover pontos de coleta do usuário:", pointsErr);
        return res.status(500).json({ error: "Erro ao excluir conta" });
      }

      const deleteUserSql = "DELETE FROM users WHERE id = ?";
      db.query(deleteUserSql, [userId], (deleteErr) => {
        if (deleteErr) {
          console.error("Erro ao remover usuário:", deleteErr);
          return res.status(500).json({ error: "Erro ao excluir conta" });
        }

        return res.json({ message: "Conta excluída com sucesso" });
      });
    });
  });
};