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