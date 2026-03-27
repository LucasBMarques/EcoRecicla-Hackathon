import { useEffect, useState } from "react";
import Map from "../components/Map";
import { deleteCollectionPoint } from "../services/api";

export default function Home({ setPage }) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPoints = () => {
    fetch("http://localhost:3001/api/collection-points")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPoints(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar pontos:", err);
        setError(err.message);
        setPoints([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPoints();
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  return (
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>♻️</span>
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
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setPage("collection-points")}
            style={{
              padding: "10px 20px",
              background: "white",
              color: "#1b9a3d",
              border: "2px solid #1b9a3d",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            + Cadastrar ponto de coleta
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "#1b9a3d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
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
        <Map points={points} />
      </div>

      <div style={{ marginTop: "40px" }}>
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.07)";
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #1b9a3d 0%, #0f6e56 100%)",
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "22px" }}>♻️</span>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    #{points.indexOf(point) + 1}
                  </span>
                </div>

                <div style={{ padding: "18px 20px" }}>
                  <h3
                    style={{
                      margin: "0 0 14px 0",
                      fontSize: "16px",
                      color: "#1b5e3f",
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    {point.name}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "14px", minWidth: "18px" }}>
                        📍
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          lineHeight: 1.4,
                        }}
                      >
                        {point.address}
                      </span>
                    </div>
                    {point.materials && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "14px", minWidth: "18px" }}>
                          🗂️
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#666",
                            lineHeight: 1.4,
                          }}
                        >
                          {point.materials}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "12px",
                      borderTop: "1px solid #f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#1b9a3d",
                        }}
                      ></span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#1b9a3d",
                          fontWeight: 500,
                        }}
                      >
                        Ponto ativo
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(point.id)}
                      style={{
                        background: "transparent",
                        border: "1.5px solid #E24B4A",
                        color: "#E24B4A",
                        borderRadius: "8px",
                        padding: "5px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.2s, color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#E24B4A";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#E24B4A";
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
