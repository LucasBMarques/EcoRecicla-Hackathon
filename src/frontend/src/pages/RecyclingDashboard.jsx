import { useState, useEffect, useCallback } from "react";

import { API_URL, updateRecyclingLog, deleteRecyclingLog } from "../services/api";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const UNIT_LABELS = {
  kg: "Quilogramas (kg)",
  g: "Gramas (g)",
  unidade: "Unidades",
  garrafa: "Garrafas",
  lata: "Latas",
  caixa: "Caixas",
};

const LEVEL_CONFIG = {
  Semente:  { color: "#8B9467", bar: "#8B9467", next: 200,  icon: "🌱" },
  Broto:    { color: "#5a9e45", bar: "#5a9e45", next: 800,  icon: "🌿" },
  Árvore:   { color: "#1b9a3d", bar: "#1b9a3d", next: 2000, icon: "🌳" },
  Floresta: { color: "#0f6e56", bar: "#0f6e56", next: 5000, icon: "🌲" },
  Guardião: { color: "#0a4a3a", bar: "#0a4a3a", next: null, icon: "🛡️" },
};

const MONTH_NAMES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function getUnits(material) {
  try {
    const raw = material?.units_accepted;
    if (raw) return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (e) {
    void e;
  }
  return ["kg", "g", "unidade"];
}

function fmtNum(n, dec = 1) {
  const v = Number(n ?? 0);
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(dec);
}

function monthLabel(ym) {
  const [, m] = ym.split("-");
  return MONTH_NAMES[parseInt(m, 10) - 1];
}

function BarChart({ data, valueKey, labelKey, color = "#1b9a3d", height = 140 }) {
  if (!data || data.length === 0)
    return <p style={{ color: "#aaa", fontSize: 13 }}>Sem dados ainda.</p>;

  const max = Math.max(...data.map(d => Number(d[valueKey]) || 0)) || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
      {data.map((d, i) => {
        const pct = ((Number(d[valueKey]) || 0) / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10, color: "#888" }}>{fmtNum(d[valueKey], 0)}</span>
            <div style={{
              width: "100%",
              height: `${Math.max(pct * (height - 30) / 100, 4)}px`,
              background: color,
              borderRadius: "4px 4px 0 0",
              transition: "height 0.6s ease",
            }} />
            <span style={{ fontSize: 10, color: "#666", whiteSpace: "nowrap" }}>{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ icon, label, value, unit, color = "#1b9a3d" }) {
  return (
    <div style={{
      background: "#F1EFE8", borderRadius: 16, padding: "20px 24px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderLeft: `4px solid ${color}`,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: 13, fontWeight: 400, color: "#888", marginLeft: 4 }}>{unit}</span>
      </span>
      <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
    </div>
  );
}

function BadgeCard({ badge }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #f0f9f0, #e8f5e9)",
      border: "1.5px solid #c8e6c9", borderRadius: 12,
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
    }}>
      <span style={{ fontSize: 28 }}>{badge.icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1b5e3f" }}>{badge.name}</div>
        <div style={{ fontSize: 11, color: "#666" }}>{badge.description}</div>
      </div>
    </div>
  );
}

function CelebrationToast({ result, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: "white", borderRadius: 16, padding: "24px 28px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)", borderLeft: "5px solid #1b9a3d",
      maxWidth: 360, animation: "slideInRight 0.4s ease",
    }}>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
      <div style={{ fontSize: 32, textAlign: "center", marginBottom: 8 }}>🎉</div>
      <div style={{ fontWeight: 700, color: "#1b5e3f", fontSize: 16, marginBottom: 4 }}>
        Registro salvo com sucesso!
      </div>
      <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>
        <span style={{ color: "#1b9a3d", fontWeight: 600 }}>+{result.points_earned} eco-pontos</span>
        {" · "}
        <span>{fmtNum(result.co2_avoided, 2)} kg CO₂ evitado</span>
        {" · "}
        <span>{fmtNum(result.water_saved, 1)} L água economizada</span>
      </div>
      <button onClick={onClose} style={{
        marginTop: 12, background: "#1b9a3d", color: "white",
        border: "none", borderRadius: 8, padding: "8px 20px",
        cursor: "pointer", fontWeight: 600, fontSize: 13, width: "100%",
      }}>
        Continuar ♻️
      </button>
    </div>
  );
}

function EducationWidget({ material }) {
  if (!material) return null;
  return (
    <div style={{
      background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
      border: "1.5px solid #a5d6a7", borderRadius: 12,
      padding: "16px 20px", marginTop: 16,
    }}>
      <div style={{ fontWeight: 700, color: "#2e7d32", marginBottom: 6, fontSize: 14 }}>
        {material.icon} Como preparar: {material.name}
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#444", lineHeight: 1.6 }}>
        {material.preparation_tip || material.description || "Mantenha o material limpo e seco antes de descartar."}
      </p>
    </div>
  );
}

export default function RecyclingDashboard({ setPage }) {
  const [tab, setTab] = useState("register");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [preview, setPreview] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedNotes, setSchedNotes] = useState("");
  const [schedLoading, setSchedLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedView, setSchedView] = useState("list");
  const [editingSchedule, setEditingSchedule] = useState(null);
  const { toasts, addToast, removeToast } = useToast();
  const [editingLog, setEditingLog] = useState(null);
  const [editLogMaterial, setEditLogMaterial] = useState(null);
  const [editLogQuantity, setEditLogQuantity] = useState("");
  const [editLogUnit, setEditLogUnit] = useState("kg");
  const [editLogNotes, setEditLogNotes] = useState("");
  const [editLogLoading, setEditLogLoading] = useState(false);
  const [editLogError, setEditLogError] = useState("");

  const loadStats = useCallback((uid) =>
    fetch(`${API_URL}/recycling/stats/${uid}`).then(r => r.json()).then(setStats).catch(e => void e), []);

  const loadBadges = useCallback((uid) =>
    fetch(`${API_URL}/recycling/badges/${uid}`).then(r => r.json()).then(setBadges).catch(e => void e), []);

  const loadHistory = useCallback((uid) =>
    fetch(`${API_URL}/recycling/history/${uid}?limit=50`).then(r => r.json()).then(setHistory).catch(e => void e), []);

  const loadSchedules = useCallback((uid) => {
    setSchedulesLoading(true);
    fetch(`${API_URL}/schedules/${uid}`)
      .then(r => r.json())
      .then(data => setSchedules(Array.isArray(data) ? data : []))
      .catch(() => setSchedules([]))
      .finally(() => setSchedulesLoading(false));
  }, []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    fetch(`${API_URL}/materials`).then(r => r.json()).then(setMaterials).catch(e => void e);
    if (u?.id) {
      loadStats(u.id);
      loadBadges(u.id);
      loadHistory(u.id);
      loadSchedules(u.id);
    }
  }, [loadStats, loadBadges, loadHistory, loadSchedules]);

  const handleCalculate = useCallback(async () => {
    if (!selectedMaterial || !quantity) return;
    setCalculating(true);
    setError("");
    try {
      const r = await fetch(`${API_URL}/recycling/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material_id: selectedMaterial.id, quantity, unit }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setPreview(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCalculating(false);
    }
  }, [selectedMaterial, quantity, unit]);

  useEffect(() => {
    if (selectedMaterial && quantity > 0) {
      const t = setTimeout(handleCalculate, 600);
      return () => clearTimeout(t);
    } else {
      setPreview(null);
    }
  }, [selectedMaterial, quantity, unit, handleCalculate]);

  const handleSubmit = async () => {
    if (!selectedMaterial || !quantity) {
      setError("Selecione um material e insira a quantidade.");
      return;
    }
    setSubmitting(true);
    setError("");

    let photo_url = null;
    if (photoFile) {
      try {
        const fd = new FormData();
        fd.append("photo", photoFile);
        const r = await fetch(`${API_URL}/upload/photo`, { method: "POST", body: fd });
        const d = await r.json();
        photo_url = d.url;
      } catch (e) {
        void e;
      }
    }

    try {
      const r = await fetch(`${API_URL}/recycling/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          material_id: selectedMaterial.id,
          quantity, unit, notes, photo_url,
        }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);

      setQuantity("");
      setNotes("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setPreview(null);
      setSelectedMaterial(null);
      setUnit("kg");
      setCelebration(data);

      if (user?.id) {
        // Buscar perfil atualizado do backend
        try {
          const updatedUserProfile = await fetch(`${API_URL}/auth/profile/${user.id}`).then(r => r.json());
          localStorage.setItem("user", JSON.stringify(updatedUserProfile));
          setUser(updatedUserProfile);
        } catch (err) {
          console.error("Erro ao atualizar perfil:", err);
          // Fallback: atualizar apenas eco_points
          const fallbackUser = { ...user, eco_points: (user.eco_points || 0) + data.points_earned };
          localStorage.setItem("user", JSON.stringify(fallbackUser));
          setUser(fallbackUser);
        }
        
        loadStats(user.id);
        loadBadges(user.id);
        loadHistory(user.id);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditLog = (log) => {
    setEditingLog(log);
    const mat = materials.find((m) => m.id === log.material_id) || null;
    setEditLogMaterial(mat);
    setEditLogQuantity(String(log.quantity));
    setEditLogUnit(log.unit || "kg");
    setEditLogNotes(log.notes || "");
  };

  const handleSaveLogEdit = async () => {
    if (!editingLog || !editLogMaterial || !editLogQuantity) return;
    setEditLogLoading(true);
    setEditLogError("");
    try {
      const data = await updateRecyclingLog(editingLog.id, {
        user_id: user?.id,
        material_id: editLogMaterial.id,
        quantity: editLogQuantity,
        unit: editLogUnit,
        notes: editLogNotes || null,
      });
      if (data.error) throw new Error(data.error);
      setEditingLog(null);
      addToast("Registro de reciclagem alterado com sucesso!", "success");
      if (user?.id) {
        loadHistory(user.id);
        loadStats(user.id);
        const updatedUser = await fetch(`${API_URL}/auth/profile/${user.id}`).then(r => r.json());
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (e) {
      setEditLogError(e.message);
    } finally {
      setEditLogLoading(false);
    }
  };

  const handleDeleteLog = async (log) => {
    if (!window.confirm("Deseja excluir este registro de reciclagem?\nOs pontos e estatísticas serão revertidos.")) return;
    try {
      const data = await deleteRecyclingLog(log.id, user?.id);
      if (data.error) throw new Error(data.error);
      addToast("Registro excluído com sucesso!", "success");
      if (user?.id) {
        loadHistory(user.id);
        loadStats(user.id);
        const updatedUser = await fetch(`${API_URL}/auth/profile/${user.id}`).then(r => r.json());
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (e) {
      addToast("Erro ao excluir: " + e.message, "error");
    }
  };

  const handleSchedule = async () => {
    if (!schedDate) { setError("Selecione uma data."); return; }
    setSchedLoading(true);
    setError("");
    try {
      const r = await fetch(`${API_URL}/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          material_id: selectedMaterial?.id ?? null,
          scheduled_date: schedDate,
          scheduled_time: schedTime || null,
          notes: schedNotes || null,
        }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      alert("✅ Agendamento criado com sucesso!");
      setSchedDate("");
      setSchedTime("");
      setSchedNotes("");
      setSchedView("list");
      if (user?.id) loadSchedules(user.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setSchedLoading(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Deseja excluir este agendamento?")) return;
    try {
      const r = await fetch(`${API_URL}/schedules/${id}`, { method: "DELETE" });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      alert("Erro ao excluir: " + e.message);
    }
  };

  const handleCancelSchedule = async (id) => {
    if (!window.confirm("Deseja cancelar este agendamento?")) return;
    try {
      const r = await fetch(`${API_URL}/schedules/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelado" }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      if (user?.id) loadSchedules(user.id);
    } catch (e) {
      alert("Erro ao cancelar: " + e.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSchedule?.scheduled_date) { alert("Selecione uma data."); return; }
    try {
      const r = await fetch(`${API_URL}/schedules/${editingSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material_id: editingSchedule.material_id ?? null,
          scheduled_date: editingSchedule.scheduled_date,
          scheduled_time: editingSchedule.scheduled_time || null,
          notes: editingSchedule.notes || null,
          status: editingSchedule.status ?? "pendente",
        }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setEditingSchedule(null);
      if (user?.id) loadSchedules(user.id);
    } catch (e) {
      alert("Erro ao salvar: " + e.message);
    }
  };

  const levelCfg = LEVEL_CONFIG[user?.level ?? "Semente"] ?? LEVEL_CONFIG.Semente;
  const pts = Number(user?.eco_points ?? 0);
  const pct = levelCfg.next ? Math.min((pts / levelCfg.next) * 100, 100) : 100;

  const chartData = (stats?.monthly ?? []).map(m => ({
    label: monthLabel(m.month),
    kg: Number(m.kg ?? 0),
    points: Number(m.points ?? 0),
  }));

  const byMat = (stats?.by_material ?? []).slice(0, 6).map(m => ({
    label: m.icon + " " + m.name,
    kg: Number(m.kg ?? 0),
  }));

  const tabBtn = (id) => ({
    padding: "10px 20px",
    background: tab === id ? "#1b9a3d" : "white",
    color: tab === id ? "white" : "#1b9a3d",
    border: "2px solid #1b9a3d",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.2s",
  });

  const card = {
    background: "white",
    borderRadius: 16,
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    marginBottom: 20,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7f4", fontFamily: "'Segoe UI', sans-serif", padding: "24px 28px" }}>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
      `}</style>

      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {celebration && <CelebrationToast result={celebration} onClose={() => setCelebration(null)} />}

      {editingLog && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
          <div style={{ background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ margin: "0 0 20px", color: "#1b5e3f", fontSize: 18 }}>✏️ Editar Registro de Reciclagem</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>Material *</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 6 }}>
                  {materials.map(m => (
                    <button key={m.id} onClick={() => { setEditLogMaterial(m); setEditLogUnit("kg"); }} style={{
                      padding: "8px 6px",
                      background: editLogMaterial?.id === m.id ? "linear-gradient(135deg, #1b9a3d, #0f6e56)" : "#f0f6f0",
                      color: editLogMaterial?.id === m.id ? "white" : "#333",
                      border: editLogMaterial?.id === m.id ? "2px solid #1b9a3d" : "2px solid transparent",
                      borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 11,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    }}>
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                      <span>{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Quantidade *</label>
                  <input type="number" min="0.001" step="0.01" value={editLogQuantity} onChange={e => setEditLogQuantity(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, fontWeight: 600, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Unidade *</label>
                  <select value={editLogUnit} onChange={e => setEditLogUnit(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, background: "white", boxSizing: "border-box" }}>
                    {getUnits(editLogMaterial).map(u => (
                      <option key={u} value={u}>{UNIT_LABELS[u] ?? u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Observações</label>
                <textarea value={editLogNotes} onChange={e => setEditLogNotes(e.target.value)} rows={2}
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>

              {editLogError && (
                <div style={{ padding: "12px 16px", background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: 10, color: "#c62828", fontSize: 13 }}>
                  ⚠️ {editLogError}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => { setEditingLog(null); setEditLogError(""); }} style={{
                  flex: 1, padding: "13px", background: "white", color: "#555",
                  border: "1.5px solid #ddd", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>
                  Cancelar
                </button>
                <button onClick={handleSaveLogEdit} disabled={editLogLoading || !editLogMaterial || !editLogQuantity} style={{
                  flex: 2, padding: "13px",
                  background: editLogLoading || !editLogMaterial || !editLogQuantity ? "#ccc" : "linear-gradient(135deg, #1b9a3d, #0f6e56)",
                  color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
                  cursor: editLogLoading || !editLogMaterial || !editLogQuantity ? "not-allowed" : "pointer",
                }}>
                  {editLogLoading ? "⏳ Salvando..." : "💾 Salvar alterações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 32 }}>♻️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, color: "#1b5e3f", fontWeight: 700 }}>Registrar Reciclagem</h1>
            <p style={{ margin: 0, fontSize: 13, color: "#888" }}>Registre, acompanhe e ganhe pontos pelo seu impacto</p>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: "12px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: levelCfg.color }}>{levelCfg.icon} {user?.level ?? "Semente"}</span>
            <span style={{ fontSize: 12, color: "#888" }}>{pts} {levelCfg.next ? `/ ${levelCfg.next}` : ""} pts</span>
          </div>
          <div style={{ background: "#eee", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${levelCfg.bar}, #1b9a3d)`, borderRadius: 99, transition: "width 0.8s ease" }} />
          </div>
        </div>

        <button onClick={() => setPage("home")} style={{ padding: "10px 18px", background: "white", color: "#1b5e3f", border: "2px solid #1b9a3d", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
          ← Voltar
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button style={tabBtn("register")} onClick={() => setTab("register")}>✍️ Registrar</button>
        <button style={tabBtn("history")} onClick={() => setTab("history")}>📋 Histórico</button>
        <button style={tabBtn("dashboard")} onClick={() => setTab("dashboard")}>📊 Dashboard</button>
        <button style={tabBtn("schedule")} onClick={() => setTab("schedule")}>📅 Agendar Coleta</button>
      </div>

      {tab === "register" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start", maxWidth: 1100 }}>
          <div style={card}>
            <h2 style={{ margin: "0 0 20px", color: "#1b5e3f", fontSize: 17 }}>Novo Registro de Reciclagem</h2>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 10 }}>Material *</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
                {materials.map(m => (
                  <button key={m.id} onClick={() => { setSelectedMaterial(m); setUnit("kg"); }} style={{
                    padding: "12px 8px",
                    background: selectedMaterial?.id === m.id ? "linear-gradient(135deg, #1b9a3d, #0f6e56)" : "#f0f6f0",
                    color: selectedMaterial?.id === m.id ? "white" : "#333",
                    border: selectedMaterial?.id === m.id ? "2px solid #1b9a3d" : "2px solid transparent",
                    borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 12,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s",
                  }}>
                    <span style={{ fontSize: 22 }}>{m.icon}</span>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <EducationWidget material={selectedMaterial} />

            {selectedMaterial && (
              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Quantidade *</label>
                  <input type="number" min="0.001" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Ex: 2.5"
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 15, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Unidade *</label>
                  <select value={unit} onChange={e => setUnit(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, background: "white", cursor: "pointer", boxSizing: "border-box" }}>
                    {getUnits(selectedMaterial).map(u => (
                      <option key={u} value={u}>{UNIT_LABELS[u] ?? u}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedMaterial && (
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Observações (opcional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Alguma observação sobre o material..." rows={2}
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
            )}

            {selectedMaterial && (
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>📷 Foto do Material (opcional)</label>
                <input type="file" accept="image/*" onChange={e => {
                  const f = e.target.files[0];
                  if (!f) return;
                  setPhotoFile(f);
                  setPhotoPreview(URL.createObjectURL(f));
                }} style={{ fontSize: 13, color: "#555" }} />
                {photoPreview && <img src={photoPreview} alt="preview" style={{ marginTop: 10, width: 120, height: 90, objectFit: "cover", borderRadius: 8, border: "2px solid #e8f0e8" }} />}
              </div>
            )}

            {error && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: 10, color: "#c62828", fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitting || !selectedMaterial || !quantity} style={{
              marginTop: 20, width: "100%", padding: "14px",
              background: submitting || !selectedMaterial || !quantity ? "#ccc" : "linear-gradient(135deg, #1b9a3d, #0f6e56)",
              color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
              cursor: submitting || !selectedMaterial || !quantity ? "not-allowed" : "pointer", transition: "all 0.2s",
            }}>
              {submitting ? "⏳ Salvando..." : "✅ Registrar Reciclagem"}
            </button>
          </div>

          <div>
            <div style={{ ...card, background: "linear-gradient(135deg, #1b9a3d, #0f6e56)", color: "white", position: "sticky", top: 24 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, opacity: 0.9 }}>⚡ Impacto em Tempo Real</h3>
              {calculating && <p style={{ opacity: 0.7, fontSize: 13 }}>Calculando...</p>}
              {!preview && !calculating && <p style={{ opacity: 0.6, fontSize: 13 }}>Selecione um material e informe a quantidade para ver o impacto.</p>}
              {preview && !calculating && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{fmtNum(preview.co2_avoided, 2)} kg</div>
                    <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>CO₂ evitado para a atmosfera</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{fmtNum(preview.water_saved, 0)} L</div>
                    <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Água economizada</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "14px 16px", animation: "pulse 1.5s infinite" }}>
                    <div style={{ fontSize: 32, fontWeight: 800 }}>+{preview.points_earned}</div>
                    <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Eco-pontos que você vai ganhar</div>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.75, textAlign: "center" }}>
                    Equivalente a {fmtNum(preview.quantity_kg, 2)} kg de {preview.material_name}
                  </div>
                </div>
              )}
            </div>

            <div style={{ ...card, textAlign: "center", padding: "16px 20px" }}>
                <p style={{ margin: 0, fontSize: 13, color: "#888" }}>
                  Seus registros ficam na aba{" "}
                  <button onClick={() => setTab("history")} style={{ background: "none", border: "none", color: "#1b9a3d", fontWeight: 700, cursor: "pointer", fontSize: 13, padding: 0 }}>
                    📋 Histórico
                  </button>
                </p>
              </div>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div style={{ maxWidth: 900 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ margin: 0, color: "#1b5e3f", fontSize: 18 }}>
              Meus Registros de Reciclagem{history.length > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: "#888", marginLeft: 8 }}>({history.length})</span>}
            </h2>
            <button onClick={() => setTab("register")} style={{
              padding: "8px 18px", background: "#1b9a3d", color: "white",
              border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>
              + Novo Registro
            </button>
          </div>

          {history.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>♻️</div>
              <p style={{ color: "#888", fontSize: 15, margin: "0 0 16px" }}>Nenhum registro ainda.</p>
              <button onClick={() => setTab("register")} style={{
                padding: "10px 24px", background: "#1b9a3d", color: "white",
                border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>
                Fazer primeiro registro
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {history.map(h => {
                const dateStr = h.logged_at
                  ? new Date(h.logged_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
                  : "—";

                return (
                  <div key={h.id} style={{
                    ...card, marginBottom: 0,
                    display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                    borderLeft: "4px solid #1b9a3d",
                  }}>
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{h.material_icon}</span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#1b5e3f" }}>{h.material_name}</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>📅 {dateStr}</div>
                      {h.notes && <div style={{ fontSize: 12, color: "#777", fontStyle: "italic", marginTop: 2 }}>📝 {h.notes}</div>}
                    </div>

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", flexShrink: 0 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1b5e3f" }}>{Number(h.quantity_kg).toFixed(2)} kg</div>
                        <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase" }}>Reciclado</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f6e56" }}>{Number(h.co2_avoided).toFixed(2)}</div>
                        <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase" }}>kg CO₂</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1565c0" }}>{Number(h.water_saved).toFixed(0)} L</div>
                        <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase" }}>Água</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#e65100" }}>+{h.points_earned}</div>
                        <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase" }}>Pontos</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleEditLog(h)} style={{
                        padding: "8px 14px", background: "#e3f2fd", color: "#1565c0",
                        border: "1px solid #1565c0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}>✏️ Editar</button>
                      <button onClick={() => handleDeleteLog(h)} style={{
                        padding: "8px 14px", background: "#ffebee", color: "#c62828",
                        border: "1px solid #c62828", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}>🗑️ Excluir</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
            <StatCard icon="⚖️" label="Total reciclado" value={fmtNum(stats?.total_kg, 1)} unit="kg" color="#1b9a3d" />
            <StatCard icon="☁️" label="CO₂ evitado" value={fmtNum(stats?.total_co2, 2)} unit="kg" color="#0f6e56" />
            <StatCard icon="💧" label="Água economizada" value={fmtNum(stats?.total_water, 0)} unit="L" color="#1565c0" />
            <StatCard icon="⭐" label="Eco-pontos" value={fmtNum(stats?.total_points, 0)} unit="pts" color="#e65100" />
            <StatCard icon="📋" label="Registros" value={stats?.total_logs ?? 0} unit="logs" color="#6a1b9a" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={card}>
              <h3 style={{ margin: "0 0 16px", color: "#1b5e3f", fontSize: 15 }}>📈 kg Reciclados (últimos 6 meses)</h3>
              <BarChart data={chartData} valueKey="kg" labelKey="label" color="#1b9a3d" />
            </div>
            <div style={card}>
              <h3 style={{ margin: "0 0 16px", color: "#1b5e3f", fontSize: 15 }}>⭐ Eco-pontos por mês</h3>
              <BarChart data={chartData} valueKey="points" labelKey="label" color="#e65100" />
            </div>
            <div style={card}>
              <h3 style={{ margin: "0 0 16px", color: "#1b5e3f", fontSize: 15 }}>🗂️ Por Material</h3>
              <BarChart data={byMat} valueKey="kg" labelKey="label" color="#0f6e56" />
            </div>
            <div style={card}>
              <h3 style={{ margin: "0 0 16px", color: "#1b5e3f", fontSize: 15 }}>🏆 Conquistas</h3>
              {badges.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: 13 }}>Complete registros para desbloquear conquistas!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {badges.map(b => <BadgeCard key={b.id} badge={b} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "schedule" && (
        <div style={{ maxWidth: 720 }}>

          {/* Modal de edição */}
          {editingSchedule && (
            <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            }}>
              <div style={{ background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
                <h2 style={{ margin: "0 0 20px", color: "#1b5e3f", fontSize: 18 }}>✏️ Editar Agendamento</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Material (opcional)</label>
                    <select
                      value={editingSchedule.material_id ?? ""}
                      onChange={e => setEditingSchedule(prev => ({ ...prev, material_id: e.target.value ? Number(e.target.value) : null }))}
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, background: "white", boxSizing: "border-box" }}>
                      <option value="">-- Qualquer material --</option>
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Data da Coleta *</label>
                    <input type="date" value={editingSchedule.scheduled_date?.slice(0, 10) ?? ""}
                      onChange={e => setEditingSchedule(prev => ({ ...prev, scheduled_date: e.target.value }))}
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }} />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Horário (opcional)</label>
                    <input type="time" value={editingSchedule.scheduled_time?.slice(0, 5) ?? ""}
                      onChange={e => setEditingSchedule(prev => ({ ...prev, scheduled_time: e.target.value }))}
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }} />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Status</label>
                    <select
                      value={editingSchedule.status ?? "pendente"}
                      onChange={e => setEditingSchedule(prev => ({ ...prev, status: e.target.value }))}
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, background: "white", boxSizing: "border-box" }}>
                      <option value="pendente">⏳ Agendado</option>
                      <option value="confirmado">✔️ Confirmado</option>
                      <option value="concluido">✅ Concluído</option>
                      <option value="cancelado">❌ Cancelado</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Observações</label>
                    <textarea value={editingSchedule.notes ?? ""}
                      onChange={e => setEditingSchedule(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3} placeholder="Endereço de coleta, quantidade estimada..."
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button onClick={() => setEditingSchedule(null)} style={{
                      flex: 1, padding: "13px", background: "white", color: "#555",
                      border: "1.5px solid #ddd", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}>
                      Cancelar
                    </button>
                    <button onClick={handleSaveEdit} style={{
                      flex: 2, padding: "13px", background: "linear-gradient(135deg, #1b9a3d, #0f6e56)",
                      color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}>
                      💾 Salvar alterações
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setSchedView("list")}
                style={{
                  padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
                  background: schedView === "list" ? "#1b9a3d" : "white",
                  color: schedView === "list" ? "white" : "#1b9a3d",
                  border: "2px solid #1b9a3d",
                }}
              >
                📋 Meus Agendamentos
              </button>
              <button
                onClick={() => setSchedView("new")}
                style={{
                  padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
                  background: schedView === "new" ? "#1b9a3d" : "white",
                  color: schedView === "new" ? "white" : "#1b9a3d",
                  border: "2px solid #1b9a3d",
                }}
              >
                + Novo Agendamento
              </button>
            </div>
          </div>

          {schedView === "list" && (
            <div>
              {schedulesLoading ? (
                <div style={{ ...card, textAlign: "center", color: "#888", padding: 40 }}>
                  ⏳ Carregando agendamentos...
                </div>
              ) : schedules.length === 0 ? (
                <div style={{ ...card, textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                  <p style={{ color: "#888", fontSize: 15, margin: 0 }}>Nenhum agendamento encontrado.</p>
                  <button
                    onClick={() => setSchedView("new")}
                    style={{ marginTop: 16, padding: "10px 24px", background: "#1b9a3d", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                  >
                    + Criar primeiro agendamento
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {schedules.map(s => {
                    const isCancelado  = s.status === "cancelado";
                    const isConcluido  = s.status === "concluido" || s.status === "concluído";
                    const isConfirmado = s.status === "confirmado";

                    const statusColor = isConcluido ? "#1b9a3d" : isCancelado ? "#E24B4A" : isConfirmado ? "#1565c0" : "#e65100";
                    const statusLabel = isConcluido ? "✅ Concluído" : isCancelado ? "❌ Cancelado" : isConfirmado ? "✔️ Confirmado" : "📅 Agendado";

                    const rawDate = s.scheduled_date;
                    const dateStr = rawDate
                      ? new Date(rawDate.slice(0, 10) + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
                      : "—";

                    return (
                      <div key={s.id} style={{
                        ...card, marginBottom: 0,
                        borderLeft: `4px solid ${statusColor}`,
                        opacity: isCancelado ? 0.7 : 1,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 22 }}>{s.icon ?? "📦"}</span>
                              <span style={{ fontWeight: 700, fontSize: 15, color: "#1b5e3f" }}>
                                {s.material_name ?? "Qualquer material"}
                              </span>
                              <span style={{
                                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                                background: statusColor + "18", color: statusColor,
                              }}>
                                {statusLabel}
                              </span>
                            </div>

                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 13, color: "#555" }}>📅 {dateStr}</span>
                              {s.scheduled_time && (
                                <span style={{ fontSize: 13, color: "#555" }}>🕐 {s.scheduled_time.slice(0, 5)}</span>
                              )}
                            </div>

                            {s.notes && (
                              <span style={{ fontSize: 13, color: "#777", fontStyle: "italic" }}>📝 {s.notes}</span>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                            {!isCancelado && !isConcluido && (
                              <button
                                onClick={() => setEditingSchedule(s)}
                                style={{
                                  padding: "6px 14px", background: "transparent",
                                  border: "1.5px solid #1565c0", color: "#1565c0",
                                  borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                                }}
                              >
                                ✏️ Editar
                              </button>
                            )}
                            {!isCancelado && !isConcluido && (
                              <button
                                onClick={() => handleCancelSchedule(s.id)}
                                style={{
                                  padding: "6px 14px", background: "transparent",
                                  border: "1.5px solid #e65100", color: "#e65100",
                                  borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                                }}
                              >
                                Cancelar
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteSchedule(s.id)}
                              style={{
                                padding: "6px 14px", background: "transparent",
                                border: "1.5px solid #E24B4A", color: "#E24B4A",
                                borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                              }}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {schedView === "new" && (
            <div style={card}>
              <h2 style={{ margin: "0 0 20px", color: "#1b5e3f", fontSize: 17 }}>📅 Agendar Coleta de Materiais</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Material (opcional)</label>
                  <select
                    value={selectedMaterial?.id ?? ""}
                    onChange={e => {
                      const m = materials.find(x => x.id === Number(e.target.value));
                      setSelectedMaterial(m ?? null);
                    }}
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, background: "white", boxSizing: "border-box" }}>
                    <option value="">-- Qualquer material --</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Data da Coleta *</label>
                  <input type="date" value={schedDate} min={new Date().toISOString().split("T")[0]} onChange={e => setSchedDate(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Horário (opcional)</label>
                  <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Observações</label>
                  <textarea value={schedNotes} onChange={e => setSchedNotes(e.target.value)} placeholder="Endereço de coleta, quantidade estimada..." rows={3}
                    style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
                {error && (
                  <div style={{ padding: "12px 16px", background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: 10, color: "#c62828", fontSize: 13 }}>
                    ⚠️ {error}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setSchedView("list")} style={{
                    flex: 1, padding: "14px", background: "white", color: "#1b5e3f",
                    border: "2px solid #1b9a3d", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer",
                  }}>
                    ← Voltar
                  </button>
                  <button onClick={handleSchedule} disabled={schedLoading} style={{
                    flex: 2, padding: "14px", background: schedLoading ? "#ccc" : "linear-gradient(135deg, #1b9a3d, #0f6e56)",
                    color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                    cursor: schedLoading ? "not-allowed" : "pointer",
                  }}>
                    {schedLoading ? "⏳ Agendando..." : "📅 Confirmar Agendamento"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}