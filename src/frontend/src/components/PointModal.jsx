import "../styles/pointModal.css";

export default function PointModal({ point, onClose, onDelete, isOwner }) {
  if (!point) return null;

  const materials = Array.isArray(point.materials)
    ? point.materials
    : point.materials
        ?.split(",")
        .map((m) => m.trim())
        .filter(Boolean) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <h2>{point.name}</h2>
          <p className="modal-address">📍 {point.address}</p>
        </div>

        <div className="modal-body">
          <div className="info-group">
            <h3>Materiais Aceitos</h3>
            <div className="materials-list">
              {materials.map((material, idx) => (
                <span key={idx} className="material-tag">
                  {material}
                </span>
              ))}
            </div>
          </div>

          {point.phone && (
            <div className="info-group">
              <h3>Telefone</h3>
              <p>📱 {point.phone}</p>
            </div>
          )}

          {point.opening_hours && (
            <div className="info-group">
              <h3>Horário de Funcionamento</h3>
              <p>🕐 {point.opening_hours}</p>
            </div>
          )}

          {point.rating > 0 && (
            <div className="info-group">
              <h3>Avaliação</h3>
              <p>⭐ {point.rating.toFixed(1)} / 5.0</p>
            </div>
          )}
        </div>

        {isOwner && (
          <div className="modal-footer">
            <button className="btn-delete" onClick={() => onDelete(point.id)}>
              🗑️ Deletar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
