const db = require("../config/db");
const { createWelcomeNotifications } = require("./notificationsController");

exports.register = (req, res) => {

  const { name, email, password } = req.body;

  const sql = `
    INSERT INTO users (
      name,
      email,
      password
    )
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, password],
    (err, result) => {

      if (err) {
        console.error("Erro ao cadastrar usuário:", err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            error: "Este e-mail já está cadastrado"
          });
        }

        if (err.code === "ER_NO_SUCH_TABLE") {
          return res.status(500).json({
            error: "Banco de dados não inicializado (tabela users não encontrada)"
          });
        }

        return res.status(500).json({
          error: "Erro ao cadastrar usuário"
        });
      }

      createWelcomeNotifications(result.insertId);
      res.json({
        message: "Usuário cadastrado com sucesso"
      });
    }
  );
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
    
    const user = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      nickname: result[0].nickname || "",
      country: result[0].country || "",
      city: result[0].city || "",
      photo: result[0].photo ? result[0].photo.toString('base64') : null,
      eco_points: result[0].eco_points || 0,
      level: result[0].level || "Semente",
      total_kg: result[0].total_kg || 0,
      co2_avoided: result[0].co2_avoided || 0,
      water_saved: result[0].water_saved || 0,
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

  const sql = "SELECT id, name, email, nickname, country, city, photo, eco_points, level, total_kg, co2_avoided, water_saved FROM users WHERE id = ?";
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
      eco_points: result[0].eco_points || 0,
      level: result[0].level || "Semente",
      total_kg: result[0].total_kg || 0,
      co2_avoided: result[0].co2_avoided || 0,
      water_saved: result[0].water_saved || 0,
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

  const sql = "SELECT id, name, email, nickname, country, city, photo, eco_points, level, total_kg, co2_avoided, water_saved FROM users WHERE id = ?";

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
      nickname: result[0].nickname || "",
      country: result[0].country || "",
      city: result[0].city || "",
      photo: result[0].photo ? result[0].photo.toString('base64') : null,
      eco_points: result[0].eco_points || 0,
      level: result[0].level || "Semente",
      total_kg: result[0].total_kg || 0,
      co2_avoided: result[0].co2_avoided || 0,
      water_saved: result[0].water_saved || 0
    };

    res.json(user);
  });
};

exports.updatePassword = (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({
      error: "Todos os campos são obrigatórios"
    });
  }

  // NOVA VALIDAÇÃO
  if (currentPassword === newPassword) {
    return res.status(400).json({
      error: "A nova senha deve ser diferente da senha atual"
    });
  }

  // Verifica senha atual
  const checkSql = "SELECT * FROM users WHERE id = ? AND password = ?";

  db.query(checkSql, [userId, currentPassword], (checkErr, result) => {
    if (checkErr) {
      console.error("Erro ao verificar senha:", checkErr);
      return res.status(500).json({
        error: "Erro interno do servidor"
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        error: "Senha atual incorreta"
      });
    }

    // Atualiza senha
    const updateSql = "UPDATE users SET password = ? WHERE id = ?";

    db.query(updateSql, [newPassword, userId], (updateErr) => {
      if (updateErr) {
        console.error("Erro ao atualizar senha:", updateErr);
        return res.status(500).json({
          error: "Erro ao atualizar senha"
        });
      }

      return res.json({
        message: "Senha atualizada com sucesso"
      });
    });
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
exports.updatePreferences = (req, res) => {
  const { userId, notifications_enabled, weekly_report_enabled, public_ranking_enabled } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "ID do usuário não fornecido" });
  }

  const sql = `
    UPDATE users
    SET
      receive_notifications = ?,
      receive_newsletter = ?,
      public_ranking = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      notifications_enabled ? 1 : 0,
      weekly_report_enabled ? 1 : 0,
      public_ranking_enabled ? 1 : 0,
      userId,
    ],
    (err) => {
      if (err) {
        console.error("Erro ao atualizar preferências:", err);
        return res.status(500).json({ error: "Erro ao atualizar preferências" });
      }
      res.json({ message: "Preferências atualizadas com sucesso" });
    }
  );
};

exports.getPreferences = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "ID do usuário não fornecido" });
  }

  const sql = "SELECT receive_notifications, receive_newsletter, public_ranking FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar preferências:", err);
      return res.status(500).json({ error: "Erro ao buscar preferências" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      notifications_enabled: result[0].receive_notifications === 1,
      weekly_report_enabled: result[0].receive_newsletter === 1,
      public_ranking_enabled: result[0].public_ranking === 1,
    });
  });
};