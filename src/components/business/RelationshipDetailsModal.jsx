import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './RelationshipModals.css';

const RelationshipDetailsModal = ({ isOpen, onClose, relationship }) => {
  if (!isOpen || !relationship) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy - HH:mm", {
        locale: es,
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', className: 'badge-warning' },
      active: { text: 'Activa', className: 'badge-success' },
      rejected: { text: 'Rechazada', className: 'badge-danger' },
    };

    const badge = badges[status] || { text: status, className: 'badge-secondary' };

    return <span className={`badge ${badge.className}`}>{badge.text}</span>;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles de la Relación</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="details-grid">
            {/* Status */}
            <div className="detail-row">
              <span className="detail-label">Estado:</span>
              <span className="detail-value">{getStatusBadge(relationship.status)}</span>
            </div>

            {/* Requester Business */}
            <div className="detail-row">
              <span className="detail-label">Negocio Solicitante:</span>
              <span className="detail-value">
                {relationship.requester_business_name}
              </span>
            </div>

            {/* Target Business */}
            <div className="detail-row">
              <span className="detail-label">Negocio Receptor:</span>
              <span className="detail-value">
                {relationship.target_business_name}
              </span>
            </div>

            {/* Created At */}
            <div className="detail-row">
              <span className="detail-label">Fecha de Solicitud:</span>
              <span className="detail-value">
                {formatDate(relationship.created_at)}
              </span>
            </div>

            {/* Updated At */}
            {relationship.updated_at && (
              <div className="detail-row">
                <span className="detail-label">Última Actualización:</span>
                <span className="detail-value">
                  {formatDate(relationship.updated_at)}
                </span>
              </div>
            )}
          </div>

          {/* Info Banner based on status */}
          {relationship.status === 'active' && (
            <div className="info-banner success">
              <i className="icon">✅</i>
              <div>
                <strong>Relación Activa</strong>
                <p>
                  Ahora puedes realizar traslados de inventario con este negocio.
                  Dirígete a la sección de Traslados para enviar o recibir productos.
                </p>
              </div>
            </div>
          )}

          {relationship.status === 'pending' && (
            <div className="info-banner warning">
              <i className="icon">⏳</i>
              <div>
                <strong>Solicitud Pendiente</strong>
                <p>
                  Esta solicitud está esperando ser aceptada o rechazada por el
                  negocio receptor.
                </p>
              </div>
            </div>
          )}

          {relationship.status === 'rejected' && (
            <div className="info-banner danger">
              <i className="icon">❌</i>
              <div>
                <strong>Solicitud Rechazada</strong>
                <p>
                  Esta solicitud fue rechazada. No es posible realizar traslados
                  con este negocio.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipDetailsModal;
