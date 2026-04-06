import { useState, useEffect } from "react";
import { deleteAccount } from "../services/api";
import "../styles/userSettings.css";

// Página de configurações do usuário
export default function UserSettings({ setPage }) {
  const [activeTab, setActiveTab] = useState("profile");
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
    ranking: 0,
  });

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

    // Calcular estatísticas (mock data - futuramente virá do backend)
    calculateStats();
  }, []);

  const calculateStats = () => {
    // TODO: Fazer fetch do backend para obter dados reais
    setStats({
      totalRecycled: "45kg",
      totalRecords: 12,
      mostRecycledMaterial: "Plástico",
      score: 450,
      level: "🌿 Sustentável",
      ranking: 5,
    });
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
      {/* HEADER */}
      <header className="settings-header">
        <div className="header-content">
          <h1>Welcome, <strong>{user?.name || "Usuário"}</strong></h1>
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
        {/* PROFILE CARD */}
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
            Edit
          </button>
        </div>

        {/* TABS NAVIGATION */}
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

        {/* TAB CONTENT */}
        <div className="tabs-content">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="tab-panel">
              <h2>Informações Pessoais</h2>
              
              <form onSubmit={handleSavePersonal} className="settings-form">
                {/* PHOTO SECTION */}
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

                {/* PERSONAL INFO */}
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

          {/* STATISTICS TAB */}
          {activeTab === "stats" && (
            <div className="tab-panel">
              <h2>Estatísticas de Reciclagem</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">♻️</div>
                  <div className="stat-content">
                    <h3>Total Reciclado</h3>
                    <p className="stat-value">{stats.totalRecycled}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-content">
                    <h3>Total de Registros</h3>
                    <p className="stat-value">{stats.totalRecords}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🗂️</div>
                  <div className="stat-content">
                    <h3>Material Mais Reciclado</h3>
                    <p className="stat-value">{stats.mostRecycledMaterial}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h3>Pontuação Total</h3>
                    <p className="stat-value">{stats.score}</p>
                  </div>
                </div>
              </div>

              {/* LEVEL PROGRESS */}
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
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div className="tab-panel">
              <h2>Histórico de Reciclagem</h2>
              
              <div className="table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Material</th>
                      <th>Quantidade</th>
                      <th>Local</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>27/03/2026</td>
                      <td>🔵 Plástico</td>
                      <td>5 itens</td>
                      <td>Eco Ponto Centro</td>
                    </tr>
                    <tr>
                      <td>26/03/2026</td>
                      <td>🟢 Vidro</td>
                      <td>3 itens</td>
                      <td>Coleta Rua A</td>
                    </tr>
                    <tr>
                      <td>25/03/2026</td>
                      <td>⚫ Metal</td>
                      <td>2 itens</td>
                      <td>Eco Ponto Centro</td>
                    </tr>
                    <tr>
                      <td>24/03/2026</td>
                      <td>🟤 Papel</td>
                      <td>10 itens</td>
                      <td>Coleta Rua B</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="filter-section">
                <label>Filtrar por material:</label>
                <select className="filter-select">
                  <option value="">Todos</option>
                  <option value="plastic">Plástico</option>
                  <option value="glass">Vidro</option>
                  <option value="metal">Metal</option>
                  <option value="paper">Papel</option>
                </select>
              </div>
            </div>
          )}

          {/* RANKING TAB */}
          {activeTab === "ranking" && (
            <div className="tab-panel">
              <h2>Ranking e Progresso</h2>
              
              <div className="ranking-card">
                <div className="ranking-position">
                  <div className="position-badge">#{stats.ranking}</div>
                  <h3>Sua Posição</h3>
                  <p>Você está entre os top recicladores!</p>
                </div>
              </div>

              <div className="level-progression">
                <h3>Progressão de Níveis</h3>
                <div className="levels-timeline">
                  <div className="level-milestone completed">
                    <div className="level-circle">✓</div>
                    <p>🌱 Iniciante</p>
                    <small>0 pts</small>
                  </div>
                  <div className="level-milestone completed">
                    <div className="level-circle">✓</div>
                    <p>🌿 Sustentável</p>
                    <small>250 pts</small>
                  </div>
                  <div className="level-milestone">
                    <div className="level-circle">🔒</div>
                    <p>🌳 Eco Master</p>
                    <small>500 pts</small>
                  </div>
                </div>
              </div>

              <div className="top-recyclers">
                <h3>Top 5 Recicladores</h3>
                <div className="leaderboard">
                  <div className="leaderboard-item">
                    <span className="rank">🥇 1º</span>
                    <span className="name">João Silva</span>
                    <span className="score">850 pts</span>
                  </div>
                  <div className="leaderboard-item">
                    <span className="rank">🥈 2º</span>
                    <span className="name">Maria Santos</span>
                    <span className="score">720 pts</span>
                  </div>
                  <div className="leaderboard-item">
                    <span className="rank">🥉 3º</span>
                    <span className="name">Carlos Oliveira</span>
                    <span className="score">680 pts</span>
                  </div>
                  <div className="leaderboard-item">
                    <span className="rank">4º</span>
                    <span className="name">Ana Costa</span>
                    <span className="score">550 pts</span>
                  </div>
                  <div className="leaderboard-item">
                    <span className="rank">5º</span>
                    <span className="name">Você</span>
                    <span className="score">450 pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="tab-panel">
              <h2>Configurações da Conta</h2>

              {/* CHANGE PASSWORD */}
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

              {/* PREFERENCES */}
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

              {/* DANGER ZONE */}
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
