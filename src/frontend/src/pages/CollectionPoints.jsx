import { useState } from "react";
import { createCollectionPoint } from "../services/api";
import "../styles/auth.css";

function CollectionPoints({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    cep: "",
    number: "",
    complement: "",
    address: "",
    materials: "",
  });

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepData, setCepData] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setCepLoading(true);
    setError("");
    setLatitude("");
    setLongitude("");

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        setError("CEP não encontrado.");
        setCepLoading(false);
        return;
      }

      setCepData(data);
      setForm((prev) => ({ ...prev, address: "" }));
    } catch (err) {
      setError("Erro ao buscar CEP. Verifique sua conexão.");
    }

    setCepLoading(false);
  };

  const handleNumberBlur = async () => {
    if (!cepData || !form.number) return;

    const enderecoCompleto = `${cepData.logradouro}, ${form.number}${form.complement ? ", " + form.complement : ""}, ${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}`;
    setForm((prev) => ({ ...prev, address: enderecoCompleto }));

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(enderecoCompleto)}&format=json&limit=1`
      );
      const geoData = await geoRes.json();

      if (geoData.length > 0) {
        setLatitude(geoData[0].lat);
        setLongitude(geoData[0].lon);
      } else {
        setError("Não foi possível obter a localização. Verifique o endereço.");
      }
    } catch (err) {
      setError("Erro ao buscar localização.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!latitude || !longitude) {
      setError("Aguarde a localização ser carregada ou verifique o endereço.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      name: form.name,
      address: form.address,
      latitude,
      longitude,
      materials: form.materials,
      user_id: user?.id,
    };

    const res = await createCollectionPoint(data);

    if (res.message) {
      setMessage(res.message);
      setForm({ name: "", cep: "", number: "", complement: "", address: "", materials: "" });
      setLatitude("");
      setLongitude("");
      setCepData(null);
    } else {
      setError(res.error || "Erro ao cadastrar ponto de coleta");
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

          <h2>Cadastrar ponto de coleta</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nome do ponto de coleta"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cep"
              placeholder="CEP (somente números)"
              value={form.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              maxLength={8}
              required
            />
            {cepLoading && (
              <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>Buscando endereço...</p>
            )}
            {cepData && (
              <p style={{ fontSize: "13px", color: "#1b9a3d", margin: 0 }}>
                📍 {cepData.logradouro}, {cepData.bairro}, {cepData.localidade} - {cepData.uf}
              </p>
            )}
            <input
              type="text"
              name="number"
              placeholder="Número"
              value={form.number}
              onChange={handleChange}
              onBlur={handleNumberBlur}
              required
            />
            <input
              type="text"
              name="complement"
              placeholder="Complemento (opcional)"
              value={form.complement}
              onChange={handleChange}
              onBlur={handleNumberBlur}
            />
            <input
              type="text"
              name="materials"
              placeholder="Materiais aceitos (ex: papel, plástico)"
              value={form.materials}
              onChange={handleChange}
            />

            {latitude && longitude && (
              <p style={{ fontSize: "13px", color: "#1b9a3d", margin: 0 }}>
                ✅ Localização encontrada!
              </p>
            )}

            {message && <p style={{ color: "#1b9a3d", fontWeight: 500, margin: 0 }}>{message}</p>}
            {error && <p style={{ color: "#E24B4A", fontWeight: 500, margin: 0 }}>{error}</p>}

            <button type="submit" className="btn-primary">Cadastrar</button>

            <p className="toggle-text">
              <span className="link" onClick={() => setPage("home")}>
                Voltar para o início
              </span>
            </p>
          </form>
        </div>

        <div className="right">
          <div className="right-content">
            <h2>Pontos de coleta</h2>
            <p>Cadastre um novo ponto de coleta e ajude sua comunidade a reciclar mais!</p>
            <div className="features">
              <div className="feature-item">
                <span>📍</span>
                <span>Digite o CEP e o endereço é preenchido automaticamente</span>
              </div>
              <div className="feature-item">
                <span>♻️</span>
                <span>Liste os materiais aceitos</span>
              </div>
              <div className="feature-item">
                <span>🌱</span>
                <span>Contribua com o meio ambiente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionPoints;