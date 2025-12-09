import { useState } from 'react';
import { useEmployees } from '../../hooks/employees/useEmployees';
import useAuthStore from '../../store/authStore';
import EmployeeDetailsModal from '../employees/EmployeeDetailsModal';
import EditEmployeeModal from '../employees/EditEmployeeModal';
import './UsersTable.css';

const UsersTable = ({ showInactive }) => {
  const { user: currentUser } = useAuthStore();
  const {
    employees,
    isLoading,
    error,
    updateEmployee,
    deactivateEmployee,
    deleteEmployeePermanently,
    isUpdating,
    isDeactivating,
    isDeleting,
  } = useEmployees();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deactivatingEmployee, setDeactivatingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleteCountdown, setDeleteCountdown] = useState(0);

  // Filtrar empleados según el estado activo/inactivo
  const filteredEmployees = employees?.filter(
    (emp) => showInactive || emp.is_active
  );

  const roleLabels = {
    owner: 'Propietario',
    admin: 'Administrador',
    cashier: 'Cajero',
    waiter: 'Mesero',
    cook: 'Cocinero',
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeactivateClick = (employee) => {
    setDeactivatingEmployee(employee);
  };

  const confirmDeactivate = () => {
    if (deactivatingEmployee) {
      deactivateEmployee(deactivatingEmployee.id);
      setDeactivatingEmployee(null);
    }
  };

  const cancelDeactivate = () => {
    setDeactivatingEmployee(null);
  };

  const handleActivate = (employee) => {
    updateEmployee({
      employeeId: employee.id,
      employeeData: { is_active: true },
    });
  };

  const handleDeletePermanently = (employee) => {
    setDeletingEmployee(employee);
    setDeleteCountdown(5);

    const interval = setInterval(() => {
      setDeleteCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const confirmDeletePermanently = () => {
    if (deletingEmployee) {
      deleteEmployeePermanently(deletingEmployee.id);
      setDeletingEmployee(null);
      setDeleteCountdown(0);
    }
  };

  const cancelDelete = () => {
    setDeletingEmployee(null);
    setDeleteCountdown(0);
  };

  // Verificar si el usuario puede realizar ciertas acciones
  const canEdit = currentUser?.role === 'owner' || currentUser?.role === 'admin';
  const canDeletePermanently = currentUser?.role === 'owner';

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando empleados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error al cargar empleados</p>
        <p className="error-detail">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="users-table-container">
        {filteredEmployees && filteredEmployees.length > 0 ? (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="table-row">
                    <td data-label="Nombre">{employee.full_name}</td>
                    <td data-label="Email">{employee.email}</td>
                    <td data-label="Teléfono">{employee.phone || 'N/A'}</td>
                    <td data-label="Rol">
                      <span className={`badge badge-${employee.role}`}>
                        {roleLabels[employee.role] || employee.role}
                      </span>
                    </td>
                    <td data-label="Estado">
                      <span
                        className={`status ${
                          employee.is_active ? 'active' : 'inactive'
                        }`}
                      >
                        {employee.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <div className="actions">
                        <button
                          className="btn-action btn-view"
                          onClick={() => handleViewDetails(employee)}
                          title="Ver detalles"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>

                        {canEdit && employee.role !== 'owner' && (
                          <button
                            className="btn-action btn-edit"
                            onClick={() => handleEdit(employee)}
                            title="Editar"
                            disabled={isUpdating}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        )}

                        {canEdit &&
                          employee.role !== 'owner' &&
                          currentUser?.id !== employee.id && (
                            <>
                              {employee.is_active ? (
                                <button
                                  className="btn-action btn-deactivate"
                                  onClick={() => handleDeactivateClick(employee)}
                                  title="Desactivar"
                                  disabled={isDeactivating}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  className="btn-action btn-activate"
                                  onClick={() => handleActivate(employee)}
                                  title="Activar"
                                  disabled={isUpdating}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </button>
                              )}
                            </>
                          )}

                        {canDeletePermanently &&
                          !employee.is_active &&
                          employee.role !== 'owner' &&
                          currentUser?.id !== employee.id && (
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleDeletePermanently(employee)}
                              title="Eliminar permanentemente"
                              disabled={isDeleting}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="no-data-message">
              {showInactive
                ? 'No hay empleados desactivados'
                : 'No hay empleados activos'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Ver Detalles */}
      <EmployeeDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />

      {/* Modal de Editar */}
      <EditEmployeeModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onUpdateEmployee={updateEmployee}
        isUpdating={isUpdating}
      />

      {/* Modal de confirmación de desactivación */}
      {deactivatingEmployee && (
        <div className="modal-overlay" onClick={cancelDeactivate}>
          <div
            className="modal-container modal-deactivate"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Desactivar Empleado</h2>
              <button className="modal-close" onClick={cancelDeactivate}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="warning-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="6" x2="12" y2="12" />
                  <line x1="12" y1="14" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="warning-text">
                ¿Estás seguro de desactivar a{' '}
                <strong>{deactivatingEmployee.full_name}</strong>?
              </p>
              <p className="warning-subtext">
                El empleado no podrá iniciar sesión mientras esté desactivado.
                Podrás reactivarlo más tarde si lo necesitas.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelDeactivate}
                disabled={isDeactivating}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={confirmDeactivate}
                disabled={isDeactivating}
              >
                {isDeactivating ? 'Desactivando...' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación permanente */}
      {deletingEmployee && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div
            className="modal-container modal-delete"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Eliminar Permanentemente</h2>
              <button className="modal-close" onClick={cancelDelete}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="warning-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="8" x2="12" y2="13" />
                  <line x1="12" y1="14.90" x2="12.01" y2="17" />
                </svg>
              </div>
              <p className="warning-text">
                ¿Estás seguro de eliminar permanentemente a{' '}
                <strong>{deletingEmployee.full_name}</strong>?
              </p>
              <p className="warning-subtext">
                Esta acción no se puede deshacer y el empleado será eliminado
                completamente de la base de datos.
              </p>
              {deleteCountdown > 0 && (
                <p className="countdown-text">
                  Podrás eliminar en <strong>{deleteCountdown}</strong>{' '}
                  {deleteCountdown === 1 ? 'segundo' : 'segundos'}...
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDeletePermanently}
                disabled={deleteCountdown > 0 || isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar Permanentemente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersTable;
