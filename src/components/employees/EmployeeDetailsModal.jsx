import './EmployeeModal.css';
import { useAttendance } from '../../hooks/attendance/useAttendance';
import useAuthStore from '../../store/authStore';

const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  const { user } = useAuthStore();
  const { checkIn, checkOut, isCheckingIn, isCheckingOut } = useAttendance();

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

  const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Verificar si el usuario actual puede registrar asistencia para este empleado
  const canRegisterAttendance =
    user?.id === employee.id &&
    ['admin', 'cashier', 'waiter', 'cook'].includes(employee.role);

  const hasCheckedIn = employee.today_attendance?.check_in;
  const hasCheckedOut = employee.today_attendance?.check_out;

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

          {/* Sección de asistencia - solo para roles que pueden registrar */}
          {['admin', 'cashier', 'waiter', 'cook'].includes(employee.role) && (
            <div className="attendance-section">
              <h3 className="attendance-title">Asistencia de Hoy</h3>
              <div className="attendance-grid">
                <div className="attendance-item">
                  <span className="attendance-label">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Entrada
                  </span>
                  <span className={`attendance-value ${hasCheckedIn ? 'registered' : 'not-registered'}`}>
                    {hasCheckedIn ? formatTime(employee.today_attendance.check_in) : 'No registrada'}
                  </span>
                </div>
                <div className="attendance-item">
                  <span className="attendance-label">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Salida
                  </span>
                  <span className={`attendance-value ${hasCheckedOut ? 'registered' : 'not-registered'}`}>
                    {hasCheckedOut ? formatTime(employee.today_attendance.check_out) : 'No registrada'}
                  </span>
                </div>
              </div>

              {/* Botones de registro - solo si está viendo sus propios detalles */}
              {canRegisterAttendance && (
                <div className="attendance-actions">
                  {!hasCheckedIn && (
                    <button
                      className="btn-attendance btn-check-in"
                      onClick={checkIn}
                      disabled={isCheckingIn}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      {isCheckingIn ? 'Registrando...' : 'Registrar Entrada'}
                    </button>
                  )}
                  {hasCheckedIn && !hasCheckedOut && (
                    <button
                      className="btn-attendance btn-check-out"
                      onClick={checkOut}
                      disabled={isCheckingOut}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {isCheckingOut ? 'Registrando...' : 'Registrar Salida'}
                    </button>
                  )}
                  {hasCheckedIn && hasCheckedOut && (
                    <div className="attendance-complete">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Asistencia completa para hoy</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
