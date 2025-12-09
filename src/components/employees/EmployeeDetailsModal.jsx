import './EmployeeModal.css';

const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  const roleLabels = {
    owner: 'Propietario',
    admin: 'Administrador',
    cashier: 'Cajero',
    waiter: 'Mesero',
    cook: 'Cocinero',
  };

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
          <h2>Detalles del Empleado</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Nombre Completo</span>
              <span className="detail-value">{employee.full_name}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{employee.email}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Teléfono</span>
              <span className="detail-value">{employee.phone || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Documento</span>
              <span className="detail-value">{employee.document || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Rol</span>
              <span className={`badge badge-${employee.role}`}>
                {roleLabels[employee.role] || employee.role}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Estado</span>
              <span className={`status ${employee.is_active ? 'active' : 'inactive'}`}>
                {employee.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {employee.business_name && (
              <div className="detail-item">
                <span className="detail-label">Negocio</span>
                <span className="detail-value">{employee.business_name}</span>
              </div>
            )}

            <div className="detail-item">
              <span className="detail-label">Fecha de Registro</span>
              <span className="detail-value">{formatDate(employee.created_at)}</span>
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

export default EmployeeDetailsModal;
