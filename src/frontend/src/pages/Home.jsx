import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getStats } from "../services/api";
import "../styles/home.css";
import imgCapa from "../assets/public/img/imagem-home.png";
import imgOds12 from "../assets/public/img/ODS-12.jpg";

export default function Home({setPage}) {
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
  <div className="hero-content">
    <h1>Transforme o mundo através da <span className="destaque">reciclagem</span></h1>
    <p>Encontre pontos de coleta, registre suas ações e faça parte de uma comunidade comprometida.</p>
    
    <div className="hero-btns">
      <button className="home-btn-primary" onClick={() => setPage("mapa")}>
        📍 Encontrar pontos de coleta
      </button>
      <button className="home-btn-secondary" onClick={() => setPage("recycling-dashboard")}>
        ♻️ Registrar reciclagem
      </button>
    </div>
  </div>
  
  <div className="hero-image">
    {/* Imagem capa */}
    <img src={imgCapa} alt="Pessoas separando materiais para reciclagem" />
  </div>

</section>

</div>

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


<div className="features-wrapper">
  <section className="how-it-works">
  <h2>Como funciona</h2>
  <p className="subtitle">Reciclar nunca foi tão simples. Siga estes passos e faça a diferença para o planeta.</p>
  
  <div className="features-grid">
    <div className="feature-item1">
      <h3>1. Encontre</h3>
      <p>Localize pontos de coleta próximos a você usando nosso mapa interativo.</p>
    </div>

    <div className="feature-item1">
      <h3>2. Recicle</h3>
      <p>Leve seus materiais recicláveis aos pontos de coleta apropriados.</p>
    </div>

    <div className="feature-item1">
      <h3>3. Registre</h3>
      <p>Registre sua ação e acompanhe seu impacto ambiental positivo.</p>
    </div>
  </div>
</section>
</div>

<section className="impact-wrapper">
  <div className="impact-content">
    <div className="impact-left">
      <div className="impact-tag">
        <span aria-hidden="true">🌿</span>
        <h2>ODS 12</h2>
      </div>

      <p className="impact-subtitle">Consumo e Produção Responsável</p>

      <h3>Alinhado aos Objetivos Globais</h3>
      <p className="impact-description">
        O EcoRecicla apoia diretamente o ODS 12, promovendo práticas de consumo consciente e descarte correto por meio de ações simples no dia a dia.
      </p>

      <ul className="impact-list">
        <li>Reduz a geração de resíduos com prevenção e reciclagem</li>
        <li>Incentiva práticas sustentáveis nas comunidades</li>
        <li>Aumenta a taxa de recicláveis destinados corretamente</li>
      </ul>
    </div>

    <div className="impact-right">
      <img src={imgOds12} alt="Ilustração relacionada ao ODS 12 e à reciclagem" />
    </div>
  </div>
</section>

      <Footer setPage={setPage} />
    </>
  );
}