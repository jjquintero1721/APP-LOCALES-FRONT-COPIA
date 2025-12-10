import './SupplierModals.css';

const SupplierDetailsModal = ({ isOpen, onClose, supplier }) => {
  if (!isOpen || !supplier) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-details" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Proveedor</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="details-grid">
            <div className="detail-item full-width">
              <div className="detail-label">Nombre del Proveedor</div>
              <div className="detail-value">{supplier.name}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Tipo de Proveedor</div>
              <div className={`detail-value ${!supplier.supplier_type ? 'empty' : ''}`}>
                {supplier.supplier_type || 'No especificado'}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">NIT / ID Tributaria</div>
              <div className={`detail-value ${!supplier.tax_id ? 'empty' : ''}`}>
                {supplier.tax_id || 'No especificado'}
              </div>
            </div>

            <div className="detail-item full-width">
              <div className="detail-label">Representante Legal</div>
              <div className={`detail-value ${!supplier.legal_representative ? 'empty' : ''}`}>
                {supplier.legal_representative || 'No especificado'}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Teléfono</div>
              <div className={`detail-value ${!supplier.phone ? 'empty' : ''}`}>
                {supplier.phone || 'No especificado'}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Correo Electrónico</div>
              <div className={`detail-value ${!supplier.email ? 'empty' : ''}`}>
                {supplier.email || 'No especificado'}
              </div>
            </div>

            <div className="detail-item full-width">
              <div className="detail-label">Dirección</div>
              <div className={`detail-value ${!supplier.address ? 'empty' : ''}`}>
                {supplier.address || 'No especificada'}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Estado</div>
              <div className="detail-value">
                <span className={`status-badge ${supplier.is_active ? 'active' : 'inactive'}`}>
                  <span className="status-dot"></span>
                  {supplier.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Fecha de Creación</div>
              <div className="detail-value">{formatDate(supplier.created_at)}</div>
            </div>

            <div className="detail-item full-width">
              <div className="detail-label">Última Actualización</div>
              <div className="detail-value">{formatDate(supplier.updated_at)}</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailsModal;
