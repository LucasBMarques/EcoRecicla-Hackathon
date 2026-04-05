import { useEffect, useState } from "react";
import "../styles/home.css";
import logoImg from "../assets/public/img/logo.png";

export default function Navbar({ currentPage, setPage }) {
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState(""); 

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      // 1. Pegamos o nome completo
      const fullName = userData.name || "Usuário";
      
      // 2. Função para colocar a primeira letra de cada nome em maiúscula
      const capitalized = fullName
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      setUserName(capitalized);
      
      if (userData.photo) {
        setUserPhoto(`data:image/jpeg;base64,${userData.photo}`);
      }
    }
  }, []);

  const menuItems = [
    { id: "home", label: "Início" },
    { id: "mapa", label: "Pontos de Coleta" },
    { id: "recycling-dashboard", label: "Registrar Reciclagem" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage("home")} style={{ cursor: 'pointer' }}>
        <img src={logoImg} alt="logo ecorecicla" className="nav-logo" />
        <h2>ecorecicla</h2>
      </div>
      
      <ul>
        {menuItems.map((item) => (
          <li 
            key={item.id}
            className={currentPage === item.id ? "active" : ""}
            onClick={() => setPage(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>

      {/* Container do Perfil: Configurações de conta */}
      <div 
        onClick={() => setPage("settings")} 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px", 
          cursor: "pointer",
          marginLeft: "20px" 
        }}
      >
        <span style={{ 
          color: "black", 
          fontSize: "14px", 
          fontWeight: "600",
          whiteSpace: "nowrap" // Garante que o nome não quebre linha
        }}>
          {userName}
        </span>

        <button
          className="nav-button"
          style={{
            padding: "0",
            background: userPhoto ? "transparent" : "#f0f6f0",
            border: userPhoto ? "2px solid #e8f0e8" : "none",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0 // Impede que o botão amasse se o nome for longo
          }}
        >
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="perfil"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            "👤"
          )}
        </button>
      </div>
    </nav>
  );
}