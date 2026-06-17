import { useEffect, useMemo, useState } from "react";
import Map from "../components/Map";
import { deleteCollectionPoint, getCollectionPoints } from "../services/api";

export default function Mapa({ setPage }) {
  const [points, setPoints] = useState([]);
  const [searchMaterial, setSearchMaterial] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id ?? null;

  useEffect(() => {
    let active = true;

    getCollectionPoints()
      .then((data) => {
        if (!active) return;
        setPoints(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Erro ao buscar pontos:", err);
        setError(err.message);
        setPoints([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este ponto de coleta?"))
      return;
    const res = await deleteCollectionPoint(id, currentUserId);
    if (res.message) {
      setPoints(points.filter((p) => p.id !== id));
    } else {
      alert(res.error || "Erro ao excluir ponto de coleta.");
    }
  };

  const filteredPoints = points.filter((point) => {
    const normalized = searchMaterial.trim().toLowerCase();
    const nameMatch = point.name?.toLowerCase().includes(normalized);
    const materialsMatch = point.materials?.toLowerCase().includes(normalized);

    const textMatch = !normalized || nameMatch || materialsMatch;
    const chipMatch =
      !selectedMaterial ||
      point.materials
        ?.toLowerCase()
        .includes(selectedMaterial.toLowerCase());

    return textMatch && chipMatch;
  });

  const availableMaterials = useMemo(() => {
    const set = new Set();

    points.forEach((point) => {
      if (!point.materials) return;
      point.materials
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((material) => set.add(material));
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [points]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não suportada neste navegador.");
      return;
    }

    setGeoLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
        setGeoLoading(false);
      },
      () => {
        setGeoError("Não foi possível obter sua localização.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <>
    <div
      style={{
        padding: "30px",
        fontFamily: "'Segoe UI', sans-serif",
        background: "#F1EFE8",
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
        <Map points={filteredPoints} center={userLocation || [-19.85, -43.96]} userLocation={userLocation} />
      </div>

      <div style={{ marginTop: "40px" }}>
        <div style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
            <button
              onClick={handleUseMyLocation}
              style={{
                padding: "8px 14px",
                background: "#1b9a3d",
                color: "white",
                border: "2px solid #1b9a3d",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              {geoLoading ? "Localizando..." : "📍 Usar minha localização"}
            </button>
            {(selectedMaterial || searchMaterial) && (
              <button
                onClick={() => {
                  setSelectedMaterial("");
                  setSearchMaterial("");
                }}
                style={{
                  padding: "8px 14px",
                  background: "white",
                  color: "#1b9a3d",
                  border: "2px solid #1b9a3d",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {geoError && (
            <p style={{ margin: "0 0 10px 0", color: "#c2410c", fontSize: "13px" }}>
              {geoError}
            </p>
          )}

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

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
            {availableMaterials.map((material) => (
              <button
                key={material}
                onClick={() =>
                  setSelectedMaterial((prev) => (prev === material ? "" : material))
                }
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: selectedMaterial === material ? "2px solid #166534" : "1px solid #cfe5d4",
                  background: selectedMaterial === material ? "#dcfce7" : "#f5fbf6",
                  color: "#1f6a3d",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {material}
              </button>
            ))}
          </div>
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
                  {point.user_id === currentUserId && (
                    <button
                      onClick={() => handleDelete(point.id)}
                      style={{ marginTop: "10px", color: "#c62828", background: "none", border: "1px solid #c62828", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                    >
                      🗑️ Excluir
                    </button>
                  )}
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