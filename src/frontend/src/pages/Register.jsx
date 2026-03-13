import { useState } from "react";
import "../styles/auth.css";

export default function Register({ setPage }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        setPage("login");
      } else {
        alert("Erro ao cadastrar");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <div className="left">
          <div className="logo-section">
            <div className="logo-icon">♻️</div>
            <h1>EcoRecicla</h1>
          </div>

          <h2>Criar Conta</h2>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nome Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary">Cadastrar</button>
          </form>

          <p className="toggle-text">
            Já tem uma conta? 
            <span onClick={() => setPage("login")} className="link">
              Faça login
            </span>
          </p>
        </div>

        <div className="right">
          <div className="right-content">
            <h2>Junte-se a nós!</h2>

            <p>
              Comece sua jornada rumo a um consumo mais responsável. Juntos, podemos fazer a diferença no planeta.
            </p>

            <div className="features">
              <div className="feature-item">
                <span>🌱</span>
                <span>Cresça com a comunidade sustentável</span>
              </div>
              <div className="feature-item">
                <span>🌍</span>
                <span>Impacte o meio ambiente positivamente</span>
              </div>
              <div className="feature-item">
                <span>⭐</span>
                <span>Ganhe pontos e reconhecimento</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}