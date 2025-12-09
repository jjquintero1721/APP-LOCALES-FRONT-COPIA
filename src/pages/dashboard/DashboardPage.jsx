import { useAuth } from '../../hooks/auth/useAuth';
import { useAttendance } from '../../hooks/attendance/useAttendance';
import { useEmployees } from '../../hooks/employees/useEmployees';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const { checkIn, checkOut, isCheckingIn, isCheckingOut } = useAttendance();
  const { employees } = useEmployees();

  // Encontrar el empleado actual en la lista para obtener su asistencia
  const currentEmployee = employees?.find((emp) => emp.id === user?.id);
  const canRegisterAttendance = ['admin', 'cashier', 'waiter', 'cook'].includes(user?.role);
  const hasCheckedIn = currentEmployee?.today_attendance?.check_in;
  const hasCheckedOut = currentEmployee?.today_attendance?.check_out;

  const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <div className="welcome-card-content">
            <h2>Bienvenido, {user?.full_name}!</h2>
            <p>Negocio: {user?.business_name || 'Negocio'}</p>
            <p>Rol: {user?.role}</p>

            {/* Botón de asistencia - solo para roles que no sean owner */}
            {canRegisterAttendance && (
              <div className="attendance-quick-action">
                {hasCheckedIn && hasCheckedOut ? (
                  <div className="attendance-status-complete">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="attendance-status-text">
                      <span className="status-title">Asistencia completa</span>
                      <span className="status-time">
                        Entrada: {formatTime(currentEmployee?.today_attendance?.check_in)} • Salida: {formatTime(currentEmployee?.today_attendance?.check_out)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {hasCheckedIn ? (
                      <div className="attendance-status-info">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Entrada registrada a las {formatTime(currentEmployee?.today_attendance?.check_in)}</span>
                      </div>
                    ) : null}
                    <button
                      className={`btn-dashboard-attendance ${hasCheckedIn ? 'btn-checkout' : 'btn-checkin'}`}
                      onClick={hasCheckedIn ? checkOut : checkIn}
                      disabled={isCheckingIn || isCheckingOut}
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {hasCheckedIn ? (
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        ) : (
                          <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        )}
                      </svg>
                      {isCheckingIn || isCheckingOut
                        ? 'Registrando...'
                        : hasCheckedIn
                        ? 'Registrar Salida'
                        : 'Registrar Entrada'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Usuarios</p>
              <p className="stat-value">-</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Productos</p>
              <p className="stat-value">-</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Ventas Hoy</p>
              <p className="stat-value">$0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Ingresos</p>
              <p className="stat-value">$0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
