import { useState } from "react";
import { createCollectionPoint } from "../services/api";

function CollectionPoints({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    materials: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      ...form,
      user_id: user?.id,
    };

    const res = await createCollectionPoint(data);

    if (res.message) {
      setMessage(res.message);
      setForm({ name: "", address: "", latitude: "", longitude: "", materials: "" });
    } else {
      setError(res.error || "Erro ao cadastrar ponto de coleta");
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #ecf0f1 0%, #d5e8e0 100%)",
    }}>

      {/* LADO ESQUERDO - FORMULÁRIO */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        background: "#fafafa",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
          <span style={{ fontSize: "36px" }}>♻️</span>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#1b5e3f", fontWeight: 700 }}>EcoRecicla</h1>
        </div>

        <h2 style={{ margin: "0 0 30px 0", fontSize: "22px", color: "#1d3d2d", fontWeight: 600 }}>
          Cadastrar ponto de coleta
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "480px" }}>
          <input
            type="text"
            name="name"
            placeholder="Nome do ponto de coleta"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="address"
            placeholder="Endereço"
            value={form.address}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="latitude"
            placeholder="Latitude (ex: -19.9191)"
            value={form.latitude}
            onChange={handleChange}
            step="any"
            required
            style={inputStyle}
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude (ex: -43.9386)"
            value={form.longitude}
            onChange={handleChange}
            step="any"
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="materials"
            placeholder="Materiais aceitos (ex: papel, plástico)"
            value={form.materials}
            onChange={handleChange}
            style={inputStyle}
          />

          {message && <p style={{ color: "#1b9a3d", fontWeight: 500, margin: 0 }}>{message}</p>}
          {error && <p style={{ color: "#E24B4A", fontWeight: 500, margin: 0 }}>{error}</p>}

          <button type="submit" style={btnStyle}>Cadastrar</button>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#666", margin: 0 }}>
            <span
              onClick={() => setPage("home")}
              style={{ color: "#1b9a3d", fontWeight: 600, cursor: "pointer" }}
            >
              Voltar para o início
            </span>
          </p>
        </form>
      </div>

      {/* LADO DIREITO - INFO */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #1b9a3d 0%, #1d7e8d 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>Pontos de coleta</h2>
          <p style={{ fontSize: "16px", lineHeight: 1.6, opacity: 0.95, marginBottom: "40px" }}>
            Cadastre um novo ponto de coleta e ajude sua comunidade a reciclar mais!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start" }}>
            {[
              { icon: "📍", text: "Informe a localização exata" },
              { icon: "♻️", text: "Liste os materiais aceitos" },
              { icon: "🌱", text: "Contribua com o meio ambiente" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px" }}>
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

const inputStyle = {
  padding: "14px 16px",
  border: "2px solid #e0e0e0",
  borderRadius: "10px",
  fontSize: "14px",
  fontFamily: "inherit",
  background: "white",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const btnStyle = {
  padding: "14px",
  border: "none",
  background: "linear-gradient(135deg, #1b9a3d 0%, #149235 100%)",
  color: "white",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
  marginTop: "8px",
};

export default CollectionPoints;