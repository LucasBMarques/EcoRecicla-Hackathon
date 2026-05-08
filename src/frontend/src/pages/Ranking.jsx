import { useState, useEffect } from "react";
import { getRanking } from "../services/api";
import "../styles/ranking.css";

const levelEmojis = {
  Semente: "🌱",
  Broto: "🌿",
  Árvore: "🌳",
  Floresta: "🌲",
  Guardião: "🛡️"
};

function getAvatarLetter(name) {
  return name ? name.charAt(0).toUpperCase() : "U";
}

function getUserPhoto(photo) {
  return photo ? `data:image/jpeg;base64,${photo}` : null;
}

export default function Ranking({ setPage }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserId = userData?.id;

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRanking();
        setRanking(data);
      } catch (err) {
        setError("Erro ao carregar ranking");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return <div className="ranking-container"><p>Carregando ranking...</p></div>;
  }

  if (error) {
    return <div className="ranking-container"><p className="error">{error}</p></div>;
  }

  const topThree = ranking.slice(0, 3);
  const restUsers = ranking.slice(3);

  // Reordenar para exibir: 2º, 1º, 3º no pódio
  const podium = {
    second: topThree.length > 1 ? topThree[1] : null,
    first: topThree.length > 0 ? topThree[0] : null,
    third: topThree.length > 2 ? topThree[2] : null
  };

  return (
    <div className="ranking-page">
      <div className="ranking-header">
        <h1>🏆 Ranking EcoRecicla</h1>
        <p>Os maiores recicladores do planeta</p>
      </div>

      {/* PÓDIO */}
      <div className="podium">
        {/* 2º lugar - Esquerda */}
        {podium.second && (
          <div className="podium-position second">
            <div className="podium-rank-number">2º</div>
            <div className="podium-user">
              <div className="podium-avatar">
                {getUserPhoto(podium.second.photo) ? (
                  <img src={getUserPhoto(podium.second.photo)} alt={podium.second.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {getAvatarLetter(podium.second.name)}
                  </div>
                )}
              </div>
              <div className="podium-info">
                <h3>{podium.second.name}</h3>
                <p className="podium-level">{levelEmojis[podium.second.level]} {podium.second.level}</p>
                <p className="podium-points">{podium.second.eco_points} pts</p>
              </div>
            </div>
            <div className="podium-bar"></div>
          </div>
        )}

        {/* 1º lugar - Centro (Maior) */}
        {podium.first && (
          <div className="podium-position first">
            <div className="podium-rank-number">🥇</div>
            <div className="podium-user">
              <div className="podium-avatar">
                {getUserPhoto(podium.first.photo) ? (
                  <img src={getUserPhoto(podium.first.photo)} alt={podium.first.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {getAvatarLetter(podium.first.name)}
                  </div>
                )}
              </div>
              <div className="podium-info">
                <h3>{podium.first.name}</h3>
                <p className="podium-level">{levelEmojis[podium.first.level]} {podium.first.level}</p>
                <p className="podium-points">{podium.first.eco_points} pts</p>
              </div>
            </div>
            <div className="podium-bar"></div>
          </div>
        )}

        {/* 3º lugar - Direita */}
        {podium.third && (
          <div className="podium-position third">
            <div className="podium-rank-number">3º</div>
            <div className="podium-user">
              <div className="podium-avatar">
                {getUserPhoto(podium.third.photo) ? (
                  <img src={getUserPhoto(podium.third.photo)} alt={podium.third.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {getAvatarLetter(podium.third.name)}
                  </div>
                )}
              </div>
              <div className="podium-info">
                <h3>{podium.third.name}</h3>
                <p className="podium-level">{levelEmojis[podium.third.level]} {podium.third.level}</p>
                <p className="podium-points">{podium.third.eco_points} pts</p>
              </div>
            </div>
            <div className="podium-bar"></div>
          </div>
        )}
      </div>

      {/* LISTA DE USUÁRIOS (4º em diante) */}
      {restUsers.length > 0 && (
        <div className="ranking-list-section">
          <h2>Demais Participantes</h2>
          <div className="ranking-list">
            {restUsers.map((user) => (
              <div
                key={user.id}
                className={`ranking-card ${currentUserId === user.id ? "current-user" : ""}`}
              >
                <div className="ranking-position">{user.position}º</div>
                <div className="ranking-avatar">
                  {getUserPhoto(user.photo) ? (
                    <img src={getUserPhoto(user.photo)} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {getAvatarLetter(user.name)}
                    </div>
                  )}
                </div>
                <div className="ranking-user-info">
                  <h4 className={currentUserId === user.id ? "highlight-name" : ""}>
                    {user.name}
                  </h4>
                  <p className="ranking-level">
                    {levelEmojis[user.level]} {user.level}
                  </p>
                </div>
                <div className="ranking-stats">
                  <p className="ranking-points">{user.eco_points} pts</p>
                  <p className="ranking-kg">{Number(user.total_kg).toFixed(2)} kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTÃO VOLTAR */}
      <div className="ranking-footer">
        <button className="btn-voltar" onClick={() => setPage("home")}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}
