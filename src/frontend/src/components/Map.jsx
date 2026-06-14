import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ points, center = [-19.85, -43.96], userLocation = null }) {
  const materialIcons = {
    Papel: "📄",
    Plastico: "♻️",
    "Plástico": "♻️",
    Vidro: "🥃",
    Metal: "🔩",
    Eletronicos: "📱",
    "Eletrônicos": "📱",
    "Oleo Vegetal": "🫙",
    "Óleo Vegetal": "🫙",
    Lampadas: "💡",
    "Lâmpadas": "💡",
    Madeira: "🪵",
    Textil: "👕",
    "Têxtil": "👕",
    "Pilhas/Baterias": "🔋",
    Entulho: "🏗️",
    Aluminio: "🥫",
    "Alumínio": "🥫",
  };

  const parseMaterials = (materialsValue) => {
    if (Array.isArray(materialsValue)) return materialsValue;
    if (typeof materialsValue !== "string") return [];
    return materialsValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  if (!Array.isArray(points) || points.length === 0) {
    return (
      <div 
        style={{
          width: "100%",
          height: "500px",
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          color: "#666"
        }}
      >
        Nenhum ponto de reciclagem encontrado
      </div>
    );
  }

  return (
    <MapContainer
      key={`${center[0]}-${center[1]}`}
      center={center}
      zoom={12}
      style={{ height: "500px", borderRadius: "10px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <CircleMarker
          center={userLocation}
          radius={8}
          pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.85 }}
        >
          <Popup>Você está aqui</Popup>
        </CircleMarker>
      )}

      {points.map((point) => {
        const materials = parseMaterials(point.materials);

        return (
        <Marker key={point.id} position={[point.latitude, point.longitude]}>
          <Popup>
            <strong>{point.name}</strong>
            <br />
            <span style={{ fontSize: "12px", color: "#4b5563" }}>Materiais aceitos:</span>
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                maxWidth: "220px",
              }}
            >
              {materials.length > 0 ? (
                materials.map((material) => (
                  <span
                    key={`${point.id}-${material}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#eef8f1",
                      color: "#1f6a3d",
                      border: "1px solid #cfe9d6",
                      borderRadius: "999px",
                      padding: "3px 8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    <span aria-hidden="true">{materialIcons[material] || "♻️"}</span>
                    <span>{material}</span>
                  </span>
                ))
              ) : (
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Não informado</span>
              )}
            </div>
          </Popup>
        </Marker>
        );
      })}
    </MapContainer>
  );
}