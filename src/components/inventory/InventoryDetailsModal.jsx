import './InventoryModals.css';

const InventoryDetailsModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isLowStock = item.min_stock && parseFloat(item.quantity_in_stock) < parseFloat(item.min_stock);

  const totalValue = parseFloat(item.quantity_in_stock) * parseFloat(item.unit_price);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-details" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-with-badge">
            <h2>Detalles del Ítem</h2>
            <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
              <span className="status-dot"></span>
              {item.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {isLowStock && (
            <div className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                <strong>Stock Bajo:</strong> El stock actual está por debajo del mínimo establecido
              </span>
            </div>
          )}

          <div className="details-section">
            <h3 className="section-title">Información General</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{item.name}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Categoría:</span>
                <span className="detail-value">{item.category}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Unidad de Medida:</span>
                <span className="detail-value">{item.unit_of_measure}</span>
              </div>

              {item.sku && (
                <div className="detail-item">
                  <span className="detail-label">SKU:</span>
                  <span className="detail-value">{item.sku}</span>
                </div>
              )}
            </div>
          </div>

          <div className="details-section">
            <h3 className="section-title">Stock e Inventario</h3>
            <div className="details-grid">
              <div className="detail-item highlight">
                <span className="detail-label">Stock Actual:</span>
                <span className={`detail-value ${isLowStock ? 'text-warning' : 'text-success'}`}>
                  <strong>
                    {item.quantity_in_stock} {item.unit_of_measure}
                  </strong>
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Stock Mínimo:</span>
                <span className="detail-value">
                  {item.min_stock ? `${item.min_stock} ${item.unit_of_measure}` : 'No definido'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Stock Máximo:</span>
                <span className="detail-value">
                  {item.max_stock ? `${item.max_stock} ${item.unit_of_measure}` : 'No definido'}
                </span>
              </div>

              <div className="detail-item highlight">
                <span className="detail-label">Valor Total en Stock:</span>
                <span className="detail-value text-success">
                  <strong>{formatCurrency(totalValue)}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3 className="section-title">Precios e Impuestos</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Precio Unitario:</span>
                <span className="detail-value">{formatCurrency(item.unit_price)}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Porcentaje de Impuesto:</span>
                <span className="detail-value">{item.tax_percentage}%</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Precio Incluye Impuesto:</span>
                <span className="detail-value">{item.include_tax ? 'Sí' : 'No'}</span>
              </div>

              {item.tax_percentage > 0 && (
                <div className="detail-item">
                  <span className="detail-label">
                    {item.include_tax ? 'Precio sin impuesto:' : 'Precio con impuesto:'}
                  </span>
                  <span className="detail-value">
                    {item.include_tax
                      ? formatCurrency(item.unit_price / (1 + item.tax_percentage / 100))
                      : formatCurrency(item.unit_price * (1 + item.tax_percentage / 100))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {item.supplier && (
            <div className="details-section">
              <h3 className="section-title">Proveedor</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Nombre:</span>
                  <span className="detail-value">{item.supplier.name}</span>
                </div>

                {item.supplier.phone && (
                  <div className="detail-item">
                    <span className="detail-label">Teléfono:</span>
                    <span className="detail-value">{item.supplier.phone}</span>
                  </div>
                )}

                {item.supplier.email && (
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{item.supplier.email}</span>
                  </div>
                )}

                {item.supplier.supplier_type && (
                  <div className="detail-item">
                    <span className="detail-label">Tipo:</span>
                    <span className="detail-value">{item.supplier.supplier_type}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="details-section">
            <h3 className="section-title">Información del Sistema</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Fecha de Creación:</span>
                <span className="detail-value">{formatDate(item.created_at)}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Última Actualización:</span>
                <span className="detail-value">{formatDate(item.updated_at)}</span>
              </div>

              {item.last_restock_date && (
                <div className="detail-item">
                  <span className="detail-label">Último Restock:</span>
                  <span className="detail-value">{formatDate(item.last_restock_date)}</span>
                </div>
              )}
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

export default InventoryDetailsModal;
