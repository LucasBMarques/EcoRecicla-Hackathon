import { useState } from "react";
import { loginUser } from "../services/api";
import "../styles/auth.css";
export default function Login({ setPage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("lastPage", "home");
        setPage("home");
      } else {
        alert("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login");
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

          <h2>Fazer Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>

            <button type="submit" className="btn-primary">Entrar</button>
          </form>

          <p className="toggle-text">
            Não tem uma conta? 
            <span onClick={() => setPage("register")} className="link">
              Cadastre-se
            </span>
          </p>
        </div>

        <div className="right">
          <div className="right-content">
            <h2>Bem-vindo!</h2>

            <p>
              Faça login para acessar sua conta do EcoRecicla e comece a contribuir com a reciclagem responsável.
            </p>

            <div className="features">
              <div className="feature-item">
                <span>✓</span>
                <span>Registre pontos de reciclagem</span>
              </div>
              <div className="feature-item">
                <span>✓</span>
                <span>Acompanhe seu impacto ambiental</span>
              </div>
              <div className="feature-item">
                <span>✓</span>
                <span>Encontre pontos de coleta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}