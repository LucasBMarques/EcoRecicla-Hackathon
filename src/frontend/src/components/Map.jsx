import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ points }) {

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
    <MapContainer center={[-19.85, -43.96]} zoom={12} style={{ height: "500px", borderRadius: "10px" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.map(point => (
        <Marker key={point.id} position={[point.latitude, point.longitude]}>
          <Popup>
            <strong>{point.name}</strong>
            <br />
            Material: {point.material}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}