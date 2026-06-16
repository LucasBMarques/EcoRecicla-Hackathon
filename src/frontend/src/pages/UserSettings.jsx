import { useState, useEffect } from "react";
import { deleteAccount, getRanking, getRecyclingStats, getRecyclingHistory } from "../services/api";
import "../styles/userSettings.css";

export default function UserSettings({ setPage }) {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("settingsTab");
    localStorage.removeItem("settingsTab");
    return savedTab || "profile";
  });
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    country: "",
    city: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRecycled: 0,
    totalRecords: 0,
    mostRecycledMaterial: "—",
    score: 0,
    level: "🌱 Iniciante",
    ranking: null, // null = ainda não carregou
  });
  const [rankingData, setRankingData] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      setFormData({
        name: userData.name || "",
        nickname: userData.nickname || "",
        email: userData.email || "",
        country: userData.country || "",
        city: userData.city || "",
      });
      if (userData.photo) {
        setPhotoPreview(`data:image/jpeg;base64,${userData.photo}`);
      }
    }

    calculateStats();
  }, []);

  useEffect(() => {
    if (activeTab === "ranking") {
      loadRanking();
    } else if (activeTab === "stats") {
      loadStats();
    } else if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab]);

  const calculateStats = () => {
    setStats({
      totalRecycled: "45kg",
      totalRecords: 12,
      mostRecycledMaterial: "Plástico",
      score: 450,
      level: "🌿 Sustentável",
      ranking: null,
    });
  };

  const loadRanking = async () => {
    setRankingLoading(true);
    try {
      const data = await getRanking();
      setRankingData(data);

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const userPosition = data.find(u => u.id === currentUser?.id);
      if (userPosition) {
        setStats(prev => ({
          ...prev,
          ranking: userPosition.position,
          score: userPosition.eco_points,
          level: getLevelEmoji(userPosition.level) + " " + userPosition.level,
        }));
      } else {
        // Usuário não está no ranking (sem pontos)
        setStats(prev => ({
          ...prev,
          ranking: data.length + 1,
          score: 0,
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar ranking:", err);
    } finally {
      setRankingLoading(false);
    }
  };

  const getLevelEmoji = (level) => {
    const emojis = {
      Semente: "🌱",
      Broto: "🌿",
      Árvore: "🌳",
      Floresta: "🌲",
      Guardião: "🛡️"
    };
    return emojis[level] || "🌱";
  };

  // Retorna mensagem e cor de fundo baseadas na posição real do usuário
  const getRankingMessage = (position, total) => {
    if (position === null) return { text: "Carregando...", color: "#e8f5e9" };
    if (position === 1) return { text: "🏆 Você é o campeão dos recicladores!", color: "#fff8e1" };
    if (position <= 3) return { text: "🥈 Você está no pódio! Incrível!", color: "#e8f5e9" };
    if (position <= 10) return { text: "⭐ Você está no Top 10! Continue assim!", color: "#e3f2fd" };
    if (position <= Math.ceil(total * 0.25)) return { text: "📈 Você está entre os 25% melhores!", color: "#f3e5f5" };
    return { text: "♻️ Continue reciclando para subir no ranking!", color: "#fafafa" };
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const data = await getRecyclingStats(user.id);

      const totalKg = Number(data.total_kg) || 0;
      const totalCo2 = Number(data.total_co2) || 0;
      const totalWater = Number(data.total_water) || 0;
      const totalPoints = Number(data.total_points) || 0;
      const totalLogs = Number(data.total_logs) || 0;

      setStatsData({
        ...data,
        total_kg: totalKg,
        total_co2: totalCo2,
        total_water: totalWater,
        total_points: totalPoints,
        total_logs: totalLogs,
      });

      setStats(prev => ({
        ...prev,
        totalRecycled: `${totalKg.toFixed(2)}kg`,
        totalRecords: totalLogs,
        score: user.eco_points || 0,
      }));
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getRecyclingHistory(user.id, 50);
      setHistoryData(data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const compressImage = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = 400;
        ctx.drawImage(img, 0, 0, 400, 400);
        const compressed = canvas.toDataURL("image/jpeg", 0.6);
        resolve(compressed.split(",")[1]);
      };
      img.src = dataUrl;
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande! Máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        setPhotoPreview(event.target.result);
        const compressed = await compressImage(event.target.result);
        setPhoto(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          nickname: formData.nickname,
          country: formData.country,
          city: formData.city,
          photo: photo,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const updatedUser = {
          ...user,
          name: formData.name,
          nickname: formData.nickname,
          country: formData.country,
          city: formData.city,
          email: user.email,
          photo: photo,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setPhoto(null);
        alert("Dados pessoais atualizados com sucesso!");
      } else {
        alert("Erro ao atualizar dados");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("As novas senhas não combinam!");
      return;
    }
    console.log("Alterando senha:", passwordData);
    alert("Senha alterada com sucesso!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswords({ current: false, new: false, confirm: false });
  };

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: "", color: "#ddd" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { level: 1, text: "Fraca", color: "#ff4444" },
      { level: 2, text: "Fraca", color: "#ff8844" },
      { level: 3, text: "Média", color: "#ffbb33" },
      { level: 4, text: "Forte", color: "#44bb44" },
      { level: 5, text: "Muito Forte", color: "#00cc00" },
    ];
    return levels[strength - 1] || { level: 0, text: "", color: "#ddd" };
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lastPage");
      setPage("login");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      alert("Usuário inválido para exclusão");
      return;
    }

    const confirmed = window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");
    if (!confirmed) {
      return;
    }

    try {
      const result = await deleteAccount(user.id);
      if (!result.ok) {
        alert(result.data?.error || "Erro ao excluir conta");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lastPage");
      alert("Conta excluída com sucesso");
      setPage("login");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert("Erro ao excluir conta");
    }
  };

  const levelProgress = (stats.score % 500) / 500 * 100;

  return (
    <div className="settings-wrapper">
      <header className="settings-header">
        <div className="header-content">
          <h1>Bem Vindo(a), <strong>{user?.name || "Usuário"}</strong></h1>
          <button
            className="back-home-btn"
            onClick={() => setPage("home")}
            title="Voltar para Home"
          >
            ← Voltar
          </button>
        </div>
      </header>

      <main className="settings-main">
        <div className="profile-card">
          <div className="profile-avatar-section">
            {photoPreview ? (
              <img src={photoPreview} alt="Perfil" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">👤</div>
            )}
          </div>

          <div className="profile-info">
            <h2>{user?.name || "Usuário"}</h2>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-badges">
              <span className="badge">{stats.level}</span>
            </div>
          </div>

          <button
            className="edit-profile-btn"
            onClick={() => setActiveTab("profile")}
          >
            Editar
          </button>
        </div>

        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Perfil
          </button>
          <button
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            ♻️ Estatísticas
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📊 Histórico
          </button>
          <button
            className={`tab-btn ${activeTab === "ranking" ? "active" : ""}`}
            onClick={() => setActiveTab("ranking")}
          >
            🏆 Ranking
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Configurações
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === "profile" && (
            <div className="tab-panel">
              <h2>Informações Pessoais</h2>

              <form onSubmit={handleSavePersonal} className="settings-form">
                <div className="form-section">
                  <h3>Foto de Perfil</h3>
                  <div className="photo-upload">
                    <div className="photo-preview-large">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" />
                      ) : (
                        <div className="photo-placeholder-large">📸</div>
                      )}
                    </div>
                    <div className="photo-controls">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        id="photo-input"
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="upload-btn"
                        onClick={() => document.getElementById("photo-input").click()}
                      >
                        Escolher Foto
                      </button>
                      {photoPreview && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => {
                            setPhotoPreview(null);
                            setPhoto(null);
                          }}
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <small>Máximo 5MB. Formatos: JPG, PNG, GIF</small>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Dados Básicos</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome Completo</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div className="form-group">
                      <label>Apelido (Nickname)</label>
                      <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        placeholder="Como deseja ser chamado"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      <small>O email não pode ser alterado</small>
                    </div>

                    <div className="form-group">
                      <label>País</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Ex: Brasil"
                      />
                    </div>

                    <div className="form-group">
                      <label>Cidade</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Sua cidade"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "⏳ Salvando..." : "💾 Salvar Alterações"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="tab-panel">
              <h2>Estatísticas de Reciclagem</h2>

              {statsLoading ? (
                <p style={{ textAlign: "center", color: "#888" }}>Carregando estatísticas...</p>
              ) : statsData ? (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">♻️</div>
                      <div className="stat-content">
                        <h3>Total Reciclado</h3>
                        <p className="stat-value">{typeof statsData.total_kg === 'number' ? statsData.total_kg.toFixed(2) : (Number(statsData.total_kg) || 0).toFixed(2)} kg</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">📝</div>
                      <div className="stat-content">
                        <h3>Total de Registros</h3>
                        <p className="stat-value">{Number(statsData.total_logs) || 0}</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">🌍</div>
                      <div className="stat-content">
                        <h3>CO₂ Evitado</h3>
                        <p className="stat-value">{typeof statsData.total_co2 === 'number' ? statsData.total_co2.toFixed(2) : (Number(statsData.total_co2) || 0).toFixed(2)} kg</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">💧</div>
                      <div className="stat-content">
                        <h3>Água Economizada</h3>
                        <p className="stat-value">{typeof statsData.total_water === 'number' ? statsData.total_water.toFixed(0) : (Number(statsData.total_water) || 0).toFixed(0)} L</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-content">
                        <h3>Pontos Ganhos</h3>
                        <p className="stat-value">{Number(statsData.total_points) || 0}</p>
                      </div>
                    </div>
                  </div>

                  {statsData.by_material && statsData.by_material.length > 0 && (
                    <div className="material-breakdown">
                      <h3>Materiais Reciclados</h3>
                      <div className="material-list">
                        {statsData.by_material.map((mat) => (
                          <div key={mat.name} className="material-item">
                            <span className="material-icon">{mat.icon || "♻️"}</span>
                            <div className="material-info">
                              <span className="material-name">{mat.name}</span>
                              <small>{(Number(mat.kg) || 0).toFixed(2)} kg • {Number(mat.points) || 0} pts</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="level-section">
                    <h3>Nível Sustentável</h3>
                    <div className="level-info">
                      <span className="current-level">{stats.level}</span>
                      <p>Continue reciclando para alcançar o próximo nível!</p>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${levelProgress}%` }}></div>
                    </div>
                    <div className="progress-text">
                      <small>{Math.round(levelProgress)}% para o próximo nível</small>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ textAlign: "center", color: "#888" }}>Nenhum dado disponível</p>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="tab-panel">
              <h2>Histórico de Reciclagem</h2>

              {historyLoading ? (
                <p style={{ textAlign: "center", color: "#888" }}>Carregando histórico...</p>
              ) : historyData && historyData.length > 0 ? (
                <div className="table-container">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Material</th>
                        <th>Quantidade</th>
                        <th>CO₂ Evitado</th>
                        <th>Pontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((item) => (
                        <tr key={item.id}>
                          <td>{new Date(item.logged_at).toLocaleDateString("pt-BR")}</td>
                          <td>{item.material_icon || "♻️"} {item.material_name}</td>
                          <td>{(Number(item.quantity_kg) || 0).toFixed(2)} kg</td>
                          <td>{(Number(item.co2_avoided) || 0).toFixed(2)} kg</td>
                          <td><strong>{Number(item.points_earned) || 0} pts</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>
                  Nenhum registro de reciclagem ainda. Comece a reciclar! 🌱
                </p>
              )}
            </div>
          )}

          {activeTab === "ranking" && (
            <div className="tab-panel">
              <h2>Ranking e Progresso</h2>

              {rankingLoading ? (
                <p style={{ textAlign: "center", color: "#888" }}>Carregando ranking...</p>
              ) : (
                <>
                  {/* Card da posição do usuário */}
                  {(() => {
                    const { text, color } = getRankingMessage(stats.ranking, rankingData.length);
                    return (
                      <div className="ranking-card" style={{ backgroundColor: color }}>
                        <div className="ranking-position">
                          <div className="position-badge">
                            {stats.ranking === null ? "—" : `#${stats.ranking}`}
                          </div>
                          <h3>Sua Posição</h3>
                          <p>{text}</p>
                          <p className="ranking-score">{stats.score} pontos eco</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Nível atual */}
                  <div className="level-progression">
                    <h3>Seu Nível</h3>
                    <div className="current-level-display">
                      <span className="level-badge">{stats.level}</span>
                    </div>
                  </div>

                  {/* Top 10 com todos os usuários do banco */}
                  <div className="top-recyclers">
                    <h3>🏆 Top 10 Recicladores</h3>
                    {rankingData.length === 0 ? (
                      <p style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                        Nenhum usuário no ranking ainda.
                      </p>
                    ) : (
                      <div className="leaderboard">
                        {rankingData.slice(0, 10).map((rankUser, index) => {
                          const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
                          const isCurrentUser = currentUserId === rankUser.id;
                          const medals = ["🥇", "🥈", "🥉"];
                          const medal = medals[index] || `${index + 1}º`;

                          return (
                            <div
                              key={rankUser.id}
                              className={`leaderboard-item ${isCurrentUser ? "current-user" : ""}`}
                              style={isCurrentUser ? {
                                border: "2px solid #2e7d32",
                                backgroundColor: "#e8f5e9",
                                borderRadius: "8px",
                              } : {}}
                            >
                              <span className="rank">{medal}</span>
                              <div className="user-info">
                                <span className="name">
                                  {rankUser.name}
                                  {isCurrentUser && (
                                    <span style={{
                                      marginLeft: "8px",
                                      fontSize: "11px",
                                      backgroundColor: "#2e7d32",
                                      color: "#fff",
                                      padding: "2px 6px",
                                      borderRadius: "10px",
                                    }}>
                                      Você
                                    </span>
                                  )}
                                </span>
                                <small className="level-text">
                                  {getLevelEmoji(rankUser.level)} {rankUser.level}
                                </small>
                              </div>
                              <span className="score">{rankUser.eco_points} pts</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Posições 11 em diante */}
                  {rankingData.length > 10 && (
                    <div className="more-ranking">
                      <h3>Mais Recicladores ({rankingData.length - 10} restantes)</h3>
                      <div className="leaderboard leaderboard-compact">
                        {rankingData.slice(10).map((rankUser) => {
                          const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
                          const isCurrentUser = currentUserId === rankUser.id;
                          return (
                            <div
                              key={rankUser.id}
                              className={`leaderboard-item compact ${isCurrentUser ? "current-user" : ""}`}
                              style={isCurrentUser ? {
                                border: "2px solid #2e7d32",
                                backgroundColor: "#e8f5e9",
                                borderRadius: "8px",
                              } : {}}
                            >
                              <span className="rank">#{rankUser.position}</span>
                              <span className="name">
                                {rankUser.name}
                                {isCurrentUser && (
                                  <span style={{
                                    marginLeft: "6px",
                                    fontSize: "10px",
                                    backgroundColor: "#2e7d32",
                                    color: "#fff",
                                    padding: "1px 5px",
                                    borderRadius: "10px",
                                  }}>
                                    Você
                                  </span>
                                )}
                              </span>
                              <span className="score">{rankUser.eco_points} pts</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Aviso caso o usuário não apareça no top 10 */}
                  {stats.ranking !== null && stats.ranking > 10 && (
                    <div style={{
                      marginTop: "16px",
                      padding: "12px 16px",
                      backgroundColor: "#fff3e0",
                      borderRadius: "8px",
                      border: "1px solid #ffe0b2",
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#e65100",
                    }}>
                      Você está na posição <strong>#{stats.ranking}</strong> — continue reciclando para entrar no Top 10! 💪
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="tab-panel">
              <h2>Configurações da Conta</h2>

              <div className="form-section password-section">
                <h3>🔐 Alterar Senha</h3>
                <form onSubmit={handleChangePassword} className="settings-form">
                  <div className="form-group">
                    <label>Senha Atual</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Digite sua senha atual"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      >
                        {showPasswords.current ? "👁️" : "🔒"}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-group-header">
                      <label>Nova Senha</label>
                      {passwordData.newPassword && (
                        <span className="strength-indicator">
                          Força:
                          <strong style={{ color: getPasswordStrength(passwordData.newPassword).color }}>
                            {getPasswordStrength(passwordData.newPassword).text}
                          </strong>
                        </span>
                      )}
                    </div>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Digite a nova senha"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      >
                        {showPasswords.new ? "👁️" : "🔒"}
                      </button>
                    </div>
                    {passwordData.newPassword && (
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{
                            width: `${(getPasswordStrength(passwordData.newPassword).level * 20)}%`,
                            backgroundColor: getPasswordStrength(passwordData.newPassword).color,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Confirmar Nova Senha</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirme a nova senha"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      >
                        {showPasswords.confirm ? "👁️" : "🔒"}
                      </button>
                    </div>
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <small className="error-text">❌ As senhas não correspondem</small>
                    )}
                    {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                      <small className="success-text">✓ As senhas correspondem</small>
                    )}
                  </div>

                  <button type="submit" className="save-btn password-save-btn">
                    🔐 Alterar Senha
                  </button>
                </form>
              </div>

              <div className="form-section">
                <h3>📍 Preferências</h3>
                <div className="preferences-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Receber notificações de novos pontos de coleta</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Receber boletim semanal de reciclagem</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Mostrar meu ranking publicamente</span>
                  </label>
                </div>
              </div>

              <div className="form-section danger-zone">
                <h3>⚠️ Zona de Perigo</h3>
                <div className="danger-actions">
                  <button className="danger-btn" onClick={handleDeleteAccount}>
                    🗑️ Excluir Conta
                  </button>
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Sair da Conta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}