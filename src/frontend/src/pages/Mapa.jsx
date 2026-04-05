import { useEffect, useState } from "react";
import Map from "../components/Map";
import { deleteCollectionPoint, getCollectionPoints } from "../services/api";

// Página inicial com mapa e lista de pontos de coleta
export default function Mapa({ setPage }) {
  const [points, setPoints] = useState([]);
  const [searchMaterial, setSearchMaterial] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  const fetchPoints = async () => {
    try {
      const data = await getCollectionPoints();
      setPoints(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar pontos:", err);
      setError(err.message);
      setPoints([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
    
    // Recuperar dados do usuário
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      if (userData.photo) {
        setUserPhoto(`data:image/jpeg;base64,${userData.photo}`);
      }
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este ponto de coleta?"))
      return;
    const res = await deleteCollectionPoint(id);
    if (res.message) {
      setPoints(points.filter((p) => p.id !== id));
    } else {
      alert("Erro ao excluir ponto de coleta.");
    }
  };

  const filteredPoints = points.filter((point) => {
    if (!searchMaterial.trim()) return true;
    const normalized = searchMaterial.toLowerCase();
    const nameMatch = point.name?.toLowerCase().includes(normalized);
    const materialsMatch = point.materials?.toLowerCase().includes(normalized);
    return nameMatch || materialsMatch;
  });

  return (
    <>
    <div
      style={{
        padding: "30px",
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f4f7f4",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              padding: "8px 14px",
              background: "#1b9a3d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
            onClick={() => setPage("home")}
          >
            Home
          </button>
          <button
            style={{
              padding: "8px 14px",
              background: "white",
              color: "#1b9a3d",
              border: "2px solid #1b9a3d",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
            onClick={() => {
              localStorage.setItem("_collectionPointsInitialView", "list");
              setPage("collection-points");
            }}
          >
            Ver pontos cadastrados
          </button>
          <button
            style={{
              padding: "8px 14px",
              background: "white",
              color: "#1b9a3d",
              border: "2px solid #1b9a3d",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
            onClick={() => setPage("collection-points")}
          >
            + Cadastrar ponto de coleta
          </button>
          <button
            style={{
              padding: "8px 14px",
              background: "white",
              color: "#1b9a3d",
              border: "2px solid #1b9a3d",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
            onClick={() => setPage("recycling-dashboard")}
          >
            ♻️ Dashboard de Reciclagem
          </button>
        </div>

        {/* MANTIDO O TÍTULO E DESCRIÇÃO, REMOVIDO APENAS O BOTÃO */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>♻️</span>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                color: "#1b5e3f",
                fontWeight: 700,
              }}
            >
              Mapa de Pontos de Reciclagem
            </h1>
            <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>
              Veja os pontos cadastrados e filtre por material.
            </p>
          </div>
        </div>
      </div>

      {loading && <p>Carregando mapa...</p>}
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}
      
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Map points={filteredPoints} />
      </div>

      {/* ... restante do código (filtro e lista) permanece igual ... */}
      <div style={{ marginTop: "40px" }}>
        <div style={{ marginBottom: "18px" }}>
          <input
            type="text"
            value={searchMaterial}
            onChange={(e) => setSearchMaterial(e.target.value)}
            placeholder="Filtrar por nome ou material..."
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "10px 14px",
              border: "2px solid #1b9a3d",
              borderRadius: "10px",
              fontSize: "14px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#1b5e3f",
              fontWeight: 700,
            }}
          >
            Pontos cadastrados
          </h2>
          <span
            style={{
              background: "#1b9a3d",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              padding: "4px 14px",
              borderRadius: "20px",
            }}
          >
            {points.length} {points.length === 1 ? "ponto" : "pontos"}
          </span>
        </div>

        {points.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "40px",
              textAlign: "center",
              color: "#888",
            }}
          >
            <span style={{ fontSize: "40px" }}>📍</span>
            <p style={{ margin: "12px 0 0 0", fontSize: "15px" }}>
              Nenhum ponto cadastrado ainda.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {points.map((point) => (
              <div
                key={point.id}
                style={{
                  background: "white",
                  border: "1px solid #e8f0e8",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #1b9a3d 0%, #0f6e56 100%)",
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "22px" }}>♻️</span>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <h3 style={{ margin: "0 0 14px 0", fontSize: "16px", color: "#1b5e3f", fontWeight: 700 }}>
                    {point.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#666" }}>📍 {point.address}</p>
                  <button 
                    onClick={() => handleDelete(point.id)}
                    style={{ marginTop: "10px", color: "red", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}