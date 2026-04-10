import "../styles/home.css";

export default function Footer({ setPage }) {
  return (
    <footer className="footer-container">
      <div className="footer-top-accent" />

      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-brand-title">
            <span className="footer-brand-badge" aria-hidden="true">♻️</span>
            <h3>EcoRecicla</h3>
          </div>
          <p>
            Transformando o mundo atraves da reciclagem consciente e do consumo
            responsavel.
          </p>
        </div>

        <div className="footer-column">
          <h4>Plataforma</h4>
          <ul>
            <li>
              <button className="footer-link-btn" onClick={() => setPage("mapa")}>
                Pontos de Coleta
              </button>
            </li>
            <li>
              <button
                className="footer-link-btn"
                onClick={() => setPage("recycling-dashboard")}
              >
                Registrar Reciclagem
              </button>
            </li>
            <li>
              <span className="footer-link-disabled">Ranking</span>
            </li>
            <li>
              <button className="footer-link-btn" onClick={() => setPage("settings")}>
                Perfil
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Recursos</h4>
          <ul>
            <li>Como Funciona</li>
            <li>Guia de Reciclagem</li>
            <li>Impacto Ambiental</li>
            <li>Sobre</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contato</h4>
          <ul>
            <li>contato@ecorecicla.com</li>
            <li>(11) 9999-9999</li>
            <li>@ecorecicla</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 EcoRecicla. Todos os direitos reservados. | Contribuindo para o ODS 12 da ONU</p>
      </div>
    </footer>
  );
}