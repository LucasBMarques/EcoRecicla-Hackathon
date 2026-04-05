import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getStats } from "../services/api";
import "../styles/home.css";

export default function Home() {
  const [stats, setStats] = useState({ users: 0, points: 0, recycled: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error("erro ao buscar stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>

      {/* Wrapper para o fundo gradiente */}
<div className="hero-wrapper">
  <section className="hero">
    <h1>Transforme o mundo através da <span className="destaque">reciclagem</span></h1>
    <p>Encontre pontos de coleta, registre suas ações e faça parte de uma comunidade comprometida.</p>
    <div className="hero-btns">
      <button className="btn-primary" onClick={() => setPage("mapa")}>
        📍 Encontrar pontos de coleta
      </button>
      <button className="btn-secondary" onClick={() => setPage("recycling-dashboard")}>
        ♻️ Registrar reciclagem
      </button>
    </div>
  </section>

  <section className="stats-container">
    <div className="card-stat">
      <span className="stat-val">{stats.users}</span>
      <span className="stat-lab">Usuários Ativos</span>
    </div>
    <div className="card-stat">
      <span className="stat-val">{stats.points}</span>
      <span className="stat-lab">Pontos de Coleta</span>
    </div>
    <div className="card-stat">
      <span className="stat-val">{stats.recycled}kg</span>
      <span className="stat-lab">Materiais Reciclados</span>
    </div>
  </section>
</div>

<div className="features-wrapper">
  <section className="how-it-works">
  <h2>Como funciona</h2>
  <p className="subtitle">Reciclar nunca foi tão simples. Siga estes passos e faça a diferença para o planeta.</p>
  
  <div className="features-grid">
    <div className="feature-item">
      <h3>1. Encontre</h3>
      <p>Localize pontos de coleta próximos a você usando nosso mapa interativo.</p>
    </div>

    <div className="feature-item">
      <h3>2. Recicle</h3>
      <p>Leve seus materiais recicláveis aos pontos de coleta apropriados.</p>
    </div>

    <div className="feature-item">
      <h3>3. Registre</h3>
      <p>Registre sua ação e acompanhe seu impacto ambiental positivo.</p>
    </div>
  </div>
</section>
</div>

      <Footer />
    </>
  );
}