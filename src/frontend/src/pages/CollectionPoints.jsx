import { useState, useEffect } from "react";
import { createCollectionPoint, getMaterials, deleteCollectionPoint, updateCollectionPoint } from "../services/api";
import Toast from "../components/Toast";
import PointModal from "../components/PointModal";
import { useToast } from "../hooks/useToast";
import "../styles/auth.css";
import "../styles/collectionPointsForm.css";

const defaultMaterials = [
  { id: 1, name: "Papel", icon: "📄" },
  { id: 2, name: "Metal", icon: "🔩" },
  { id: 3, name: "Lâmpadas", icon: "💡" },
  { id: 4, name: "Entulho", icon: "🏗️" },
  { id: 5, name: "Plástico", icon: "♻️" },
  { id: 6, name: "Vidro", icon: "🥃" },
  { id: 7, name: "Eletrônicos", icon: "📱" },
  { id: 8, name: "Madeira", icon: "🪵" },
];

function CollectionPoints({ setPage }) {
  const initialView = localStorage.getItem("_collectionPointsInitialView") || "form";
  if (localStorage.getItem("_collectionPointsInitialView")) {
    localStorage.removeItem("_collectionPointsInitialView");
  }
  const [view, setView] = useState(initialView); 
  const [form, setForm] = useState({
    name: "",
    cep: "",
    number: "",
    complement: "",
    address: "",
    phone: "",
    opening_hours: "",
  });

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [cepData, setCepData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", opening_hours: "" });
  const [editMaterials, setEditMaterials] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [searchMaterial, setSearchMaterial] = useState("");
  const [userID, setUserID] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    
    getMaterials()
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          addToast("Não foi possível obter materiais do servidor. Lista padrão carregada.", "warning");
          setAllMaterials(defaultMaterials);
        } else {
          setAllMaterials(data);
        }
      })
        .catch(() => {
        addToast("Erro ao carregar materiais. Lista padrão carregada.", "warning");
        setAllMaterials(defaultMaterials);
      });

    
    fetch("http://localhost:3001/api/collection-points")
      .then((res) => res.json())
      .then((data) => {
        setPoints(Array.isArray(data) ? data : []);
      })
      .catch(() => {});

    
    const user = JSON.parse(localStorage.getItem("user"));
    setUserID(user?.id);
  }, [addToast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMaterialChange = (materialId) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setCepLoading(true);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        addToast("CEP não encontrado", "error");
        setCepLoading(false);
        return;
      }

      setCepData(data);
      setForm((prev) => ({ ...prev, address: "" }));
      addToast("CEP encontrado com sucesso!", "success");
    } catch {
      addToast("Erro ao buscar CEP", "error");
    }

    setCepLoading(false);
  };

  const handleNumberBlur = async () => {
    if (!cepData || !form.number) return;

    const enderecoCompleto = `${cepData.logradouro}, ${form.number}${form.complement ? ", " + form.complement : ""}, ${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}`;
    setForm((prev) => ({ ...prev, address: enderecoCompleto }));
    setGeoLoading(true);

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(enderecoCompleto)}&format=json&limit=1&countrycodes=br`
      );
      const geoData = await geoRes.json();

      if (geoData.length > 0) {
        setLatitude(geoData[0].lat);
        setLongitude(geoData[0].lon);
        addToast("Localização encontrada!", "success");
      } else {
        addToast("Localização não encontrada", "warning");
      }
    } catch {
      addToast("Erro ao buscar localização", "error");
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!latitude || !longitude) {
      addToast("Aguarde a localização ser carregada", "error");
      setLoading(false);
      return;
    }

    if (selectedMaterials.length === 0) {
      addToast("Selecione pelo menos um material", "error");
      setLoading(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const materialsNames = selectedMaterials
      .map((id) => allMaterials.find((m) => m.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const data = {
      name: form.name,
      address: form.address,
      latitude,
      longitude,
      materials: materialsNames,
      phone: form.phone || null,
      opening_hours: form.opening_hours || null,
      user_id: user?.id,
    };

    try {
      const res = await createCollectionPoint(data);

      if (res.message) {
        addToast("Ponto de coleta cadastrado com sucesso!", "success");
        setForm({
          name: "",
          cep: "",
          number: "",
          complement: "",
          address: "",
          phone: "",
          opening_hours: "",
        });
        setSelectedMaterials([]);
        setLatitude("");
        setLongitude("");
        setCepData(null);
        
        
        fetch("http://localhost:3001/api/collection-points")
          .then((res) => res.json())
          .then((data) => {
            setPoints(Array.isArray(data) ? data : []);
          });
        
        setTimeout(() => setView("list"), 1500);
      } else {
        addToast(res.error || "Erro ao cadastrar ponto de coleta", "error");
      }
    } catch {
      addToast("Erro ao cadastrar ponto de coleta", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePointClick = (point) => {
    setSelectedPoint(point);
    setShowModal(true);
  };

  const handleEditPoint = (point) => {
    setEditingPoint(point);
    setEditForm({
      name: point.name,
      phone: point.phone || "",
      opening_hours: point.opening_hours || "",
    });
    const pointMaterials = point.materials
      ?.split(", ")
      .map((name) => allMaterials.find((m) => m.name === name)?.id)
      .filter(Boolean) || [];
    setEditMaterials(pointMaterials);
  };

  const handleEditMaterialChange = (materialId) => {
    setEditMaterials((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId]
    );
  };

  const handleSaveEdit = async () => {
    if (!editingPoint) return;
    if (!editForm.name.trim()) {
      addToast("O nome do ponto é obrigatório", "error");
      return;
    }
    if (editMaterials.length === 0) {
      addToast("Selecione pelo menos um material", "error");
      return;
    }
    setEditLoading(true);

    const materialsNames = editMaterials
      .map((id) => allMaterials.find((m) => m.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    try {
      const res = await updateCollectionPoint(editingPoint.id, {
        user_id: userID,
        name: editForm.name,
        phone: editForm.phone || null,
        opening_hours: editForm.opening_hours || null,
        materials: materialsNames,
      });

      if (res.message) {
        addToast("Ponto atualizado com sucesso!", "success");
        setPoints((prev) =>
          prev.map((p) =>
            p.id === editingPoint.id
              ? { ...p, name: editForm.name, phone: editForm.phone, opening_hours: editForm.opening_hours, materials: materialsNames }
              : p
          )
        );
        setEditingPoint(null);
      } else {
        addToast(res.error || "Erro ao atualizar ponto", "error");
      }
    } catch {
      addToast("Erro ao atualizar ponto", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePoint = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este ponto?")) return;

    try {
      const res = await deleteCollectionPoint(id, userID);
      if (res.message) {
        addToast("Ponto deletado com sucesso!", "success");
        setPoints(points.filter((p) => p.id !== id));
        setShowModal(false);
      } else {
        addToast(res.error || "Erro ao deletar ponto", "error");
      }
    } catch {
      addToast("Erro ao deletar ponto", "error");
    }
  };

  const filteredPoints = points.filter((point) => {
    if (!searchMaterial) return true;
    return point.materials
      ?.toLowerCase()
      .includes(searchMaterial.toLowerCase());
  });

  return (
    <>
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {showModal && selectedPoint && (
        <PointModal
          point={selectedPoint}
          onClose={() => setShowModal(false)}
          onDelete={handleDeletePoint}
          onEdit={handleEditPoint}
          isOwner={selectedPoint.user_id === userID}
        />
      )}

      {editingPoint && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
          <div style={{
            background: "white", borderRadius: 16, padding: 32,
            width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          }}>
            <h2 style={{ margin: "0 0 20px", color: "#1b5e3f", fontSize: 18 }}>✏️ Editar Ponto de Coleta</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Nome *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Telefone (opcional)</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Horário de Funcionamento (opcional)</label>
                <input
                  type="text"
                  value={editForm.opening_hours}
                  onChange={(e) => setEditForm((p) => ({ ...p, opening_hours: e.target.value }))}
                  placeholder="Ex: Seg-Sex: 8h-18h"
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 10 }}>Materiais Aceitos *</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
                  {allMaterials.map((material) => (
                    <label key={material.id} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                      border: `2px solid ${editMaterials.includes(material.id) ? "#1b9a3d" : "#ddd"}`,
                      borderRadius: 8, cursor: "pointer",
                      background: editMaterials.includes(material.id) ? "#f0f9f0" : "white",
                      fontSize: 13, fontWeight: 500,
                    }}>
                      <input
                        type="checkbox"
                        checked={editMaterials.includes(material.id)}
                        onChange={() => handleEditMaterialChange(material.id)}
                        style={{ accentColor: "#1b9a3d" }}
                      />
                      <span>{material.icon}</span>
                      <span>{material.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => setEditingPoint(null)}
                  style={{ flex: 1, padding: "13px", background: "white", color: "#555", border: "1.5px solid #ddd", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  style={{ flex: 2, padding: "13px", background: editLoading ? "#ccc" : "linear-gradient(135deg, #1b9a3d, #0f6e56)", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: editLoading ? "not-allowed" : "pointer" }}
                >
                  {editLoading ? "⏳ Salvando..." : "💾 Salvar alterações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "form" ? (
        <div className="container">
          <div className="auth-card collection-points-layout">
            <div className="left">
              <div className="logo-section">
                <div className="logo-icon">♻️</div>
                <h1>EcoRecicla</h1>
              </div>

              <h2>Cadastrar ponto de coleta</h2>
              <p className="collection-subtitle">
                Preencha os dados abaixo para adicionar um novo ponto e ajudar mais pessoas a reciclar.
              </p>

              <form onSubmit={handleSubmit} className="collection-form">
                <div className="collection-form-status">
                  <span className="status-pill">{selectedMaterials.length} materiais selecionados</span>
                  <span className={`status-pill ${latitude && longitude ? "ready" : "pending"}`}>
                    {latitude && longitude ? "Localização confirmada" : "Aguardando localização"}
                  </span>
                </div>

                <div className="form-section">
                  <h3>Informações Básicas</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome do ponto de coleta"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-section">
                  <h3>Localização</h3>
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
                  {cepLoading && <p className="help-text">⏳ Buscando endereço...</p>}
                  {cepData && (
                    <p className="help-text success">
                      ✓ {cepData.logradouro}, {cepData.bairro}, {cepData.localidade} - {cepData.uf}
                    </p>
                  )}

                  <div className="row">
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
                  </div>

                  {geoLoading && <p className="help-text">⏳ Obtendo coordenadas...</p>}
                  {latitude && longitude && (
                    <p className="help-text success">✓ Localização encontrada!</p>
                  )}
                </div>

                <div className="form-section">
                  <h3>Materiais Aceitos *</h3>
                  <div className="materials-grid">
                    {allMaterials.map((material) => (
                      <label key={material.id} className="material-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(material.id)}
                          onChange={() => handleMaterialChange(material.id)}
                        />
                        <div className="material-option-content">
                          <span className="material-icon">{material.icon}</span>
                          <span className="material-name">{material.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <h3>Informações Adicionais</h3>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Telefone (opcional)"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="opening_hours"
                    placeholder="Horário de funcionamento ex: (Seg-Sex: 8h-18h)"
                    value={form.opening_hours}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "⏳ Cadastrando..." : "✓ Cadastrar"}
                </button>

                <p className="toggle-text">
                  <span className="link" onClick={() => setPage("home")}>
                    Voltar para o início
                  </span>
                </p>
              </form>
            </div>

            <div className="right collection-right">
              <div className="right-content collection-right-content">
                <span className="collection-right-badge">Guia rapido</span>
                <h2>Pontos de coleta</h2>
                <p>Cadastre um novo ponto de coleta e ajude sua comunidade a reciclar mais!</p>
                <div className="features collection-features">
                  <div className="feature-item collection-feature-item">
                    <span>📍</span>
                    <span>Digite o CEP e o endereço é preenchido automaticamente</span>
                  </div>
                  <div className="feature-item collection-feature-item">
                    <span>♻️</span>
                    <span>Selecione os materiais que você aceita</span>
                  </div>
                  <div className="feature-item collection-feature-item">
                    <span>📞</span>
                    <span>Adicione telefone e horário de funcionamento</span>
                  </div>
                  <div className="feature-item collection-feature-item">
                    <span>🌱</span>
                    <span>Contribua com o meio ambiente</span>
                  </div>
                </div>

                <div className="collection-highlight">
                  <strong>Dica:</strong> informe o horário de funcionamento para facilitar o uso do ponto pela comunidade.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "30px", background: "#f4f7f4", minHeight: "100vh" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ color: "#1b5e3f", marginBottom: "20px" }}>
              Pontos de Coleta Cadastrados ({filteredPoints.length})
            </h2>

            <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Filtrar por material..."
                value={searchMaterial}
                onChange={(e) => setSearchMaterial(e.target.value)}
                style={{
                  padding: "10px 15px",
                  border: "2px solid #1b9a3d",
                  borderRadius: "8px",
                  flex: 1,
                  minWidth: "200px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={() => setView("form")}
                style={{
                  padding: "10px 20px",
                  background: "#1b9a3d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                + Novo Ponto
              </button>
              <button
                onClick={() => setPage("home")}
                style={{
                  padding: "10px 20px",
                  background: "white",
                  color: "#1b9a3d",
                  border: "2px solid #1b9a3d",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                Voltar
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {filteredPoints.map((point) => {
                const isOwner = point.user_id === userID;
                return (
                  <div
                    key={point.id}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "16px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transition: "all 0.2s",
                      borderLeft: `4px solid ${isOwner ? "#1565c0" : "#1b9a3d"}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      onClick={() => handlePointClick(point)}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => e.currentTarget.parentElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"}
                      onMouseLeave={(e) => e.currentTarget.parentElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <h3 style={{ margin: 0, color: "#1b5e3f", fontSize: "15px" }}>{point.name}</h3>
                        {isOwner && (
                          <span style={{ fontSize: "10px", background: "#e3f2fd", color: "#1565c0", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                            Meu ponto
                          </span>
                        )}
                      </div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>
                        📍 {point.address}
                      </p>
                      {point.phone && (
                        <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#666" }}>📞 {point.phone}</p>
                      )}
                      {point.opening_hours && (
                        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>🕐 {point.opening_hours}</p>
                      )}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {point.materials?.split(", ").map((material, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "11px",
                              background: "#f0f6f0",
                              color: "#1b9a3d",
                              padding: "4px 8px",
                              borderRadius: "12px",
                            }}
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isOwner && (
                      <div style={{ display: "flex", gap: "8px", paddingTop: "8px", borderTop: "1px solid #f0f0f0" }}>
                        <button
                          onClick={() => handleEditPoint(point)}
                          style={{
                            flex: 1, padding: "7px 10px", background: "#e3f2fd", color: "#1565c0",
                            border: "1px solid #1565c0", borderRadius: "8px",
                            fontSize: "12px", fontWeight: 700, cursor: "pointer",
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeletePoint(point.id)}
                          style={{
                            flex: 1, padding: "7px 10px", background: "#ffebee", color: "#c62828",
                            border: "1px solid #c62828", borderRadius: "8px",
                            fontSize: "12px", fontWeight: 700, cursor: "pointer",
                          }}
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CollectionPoints;