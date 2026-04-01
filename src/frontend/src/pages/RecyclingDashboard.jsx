import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:3001/api";

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
      background: "white", borderRadius: 16, padding: "20px 24px",
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
        {material.preparation_tip || "Mantenha o material limpo e seco antes de descartar."}
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

  const loadStats = useCallback((uid) =>
    fetch(`${API}/recycling/stats/${uid}`).then(r => r.json()).then(setStats).catch(() => {}), []);

  const loadBadges = useCallback((uid) =>
    fetch(`${API}/recycling/badges/${uid}`).then(r => r.json()).then(setBadges).catch(() => {}), []);

  const loadHistory = useCallback((uid) =>
    fetch(`${API}/recycling/history/${uid}?limit=10`).then(r => r.json()).then(setHistory).catch(() => {}), []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    fetch(`${API}/materials`).then(r => r.json()).then(setMaterials).catch(() => {});
    if (u?.id) {
      loadStats(u.id);
      loadBadges(u.id);
      loadHistory(u.id);
    }
  }, [loadStats, loadBadges, loadHistory]);

  const handleCalculate = useCallback(async () => {
    if (!selectedMaterial || !quantity) return;
    setCalculating(true);
    setError("");
    try {
      const r = await fetch(`${API}/recycling/calculate`, {
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
        const r = await fetch(`${API}/upload/photo`, { method: "POST", body: fd });
        const d = await r.json();
        photo_url = d.url;
      } catch {}
    }

    try {
      const r = await fetch(`${API}/recycling/log`, {
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

  const handleSchedule = async () => {
    if (!schedDate) { setError("Selecione uma data."); return; }
    setSchedLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}/schedules`, {
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
    } catch (e) {
      setError(e.message);
    } finally {
      setSchedLoading(false);
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

      {celebration && <CelebrationToast result={celebration} onClose={() => setCelebration(null)} />}

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
        <button style={tabBtn("dashboard")} onClick={() => setTab("dashboard")}>📊 Dashboard</button>
        <button style={tabBtn("schedule")} onClick={() => setTab("schedule")}>📅 Agendar Coleta</button>
      </div>

      {tab === "register" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
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
                    {(() => {
                      let accepted = ["kg", "g", "unidade"];
                      try {
                        const raw = selectedMaterial?.units_accepted;
                        if (raw) accepted = typeof raw === "string" ? JSON.parse(raw) : raw;
                      } catch {}
                      return accepted.map(u => <option key={u} value={u}>{UNIT_LABELS[u] ?? u}</option>);
                    })()}
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

            {history.length > 0 && (
              <div style={card}>
                <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "#1b5e3f" }}>🕐 Últimos Registros</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {history.slice(0, 5).map(h => (
                    <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#f8faf8", borderRadius: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{h.material_icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{h.material_name}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{Number(h.quantity_kg).toFixed(2)} kg</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: "#1b9a3d", fontWeight: 700 }}>+{h.points_earned} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
        <div style={{ maxWidth: 600 }}>
          <div style={card}>
            <h2 style={{ margin: "0 0 20px", color: "#1b5e3f", fontSize: 17 }}>📅 Agendar Coleta de Materiais</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Material (opcional)</label>
                <select value={selectedMaterial?.id ?? ""} onChange={e => { const m = materials.find(x => x.id === Number(e.target.value)); setSelectedMaterial(m ?? null); }}
                  style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #ddd", borderRadius: 10, fontSize: 14, background: "white", boxSizing: "border-box" }}>
                  <option value="">-- Qualquer material --</option>
                  {materials.map(m => <option key={m.id} value={m.id}>{m.icon} {m.name}</option>)}
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
              <button onClick={handleSchedule} disabled={schedLoading} style={{
                padding: "14px", background: schedLoading ? "#ccc" : "linear-gradient(135deg, #1b9a3d, #0f6e56)",
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
  );
}
