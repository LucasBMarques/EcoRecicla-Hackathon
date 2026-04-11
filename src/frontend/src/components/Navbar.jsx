import "../styles/home.css";

export default function Navbar({ currentPage, setPage }) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const fullName = userData?.name || "Usuário";
  const userName = fullName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const userPhoto = userData?.photo ? `data:image/jpeg;base64,${userData.photo}` : null;

  const menuItems = [
    { id: "home", label: "Início" },
    { id: "mapa", label: "Pontos de Coleta" },
    { id: "recycling-dashboard", label: "Registrar Reciclagem" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage("home")} style={{ cursor: 'pointer' }}>
        <span className="nav-logo-icon" aria-hidden="true">♻️</span>
        <h2>EcoRecicla</h2>
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
          whiteSpace: "nowrap" 
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
            flexShrink: 0 
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