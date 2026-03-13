import { useEffect, useState } from "react";
import Map from "../components/Map";

export default function Home({ setPage }) {

  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/points")
      .then(res => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then(data => {
        setPoints(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar pontos:", err);
        setError(err.message);
        setPoints([]);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>🌱 Mapa de Pontos de Reciclagem</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "#1b9a3d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {loading && <p>Carregando mapa...</p>}
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}
      
      <Map points={points} />
    </div>
  );
}