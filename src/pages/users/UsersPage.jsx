import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import UsersTable from '../../components/users/UsersTable';
import CreateEmployeeModal from '../../components/employees/CreateEmployeeModal';
import EditEmployeeModal from '../../components/employees/EditEmployeeModal';
import EmployeeDetailsModal from '../../components/employees/EmployeeDetailsModal';
import { useEmployees } from '../../hooks/employees/useEmployees';
import './UsersPage.css';

const UsersPage = () => {
  const { user } = useAuthStore();
  const {
    createEmployee,
    updateEmployee,
    deactivateEmployee,
    deleteEmployeePermanently,
    isCreating,
    isUpdating,
    isDeactivating,
    isDeleting
  } = useEmployees();

  // Estado de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmDeactivateModal, setConfirmDeactivateModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteCountdown, setDeleteCountdown] = useState(0);
  const [showInactive, setShowInactive] = useState(false);

  const canCreateEmployee = user?.role === 'owner' || user?.role === 'admin';

  const handleCreateEmployee = (employeeData) => {
    createEmployee(employeeData, {
      onSuccess: () => setShowCreateModal(false),
    });
  };

  // Cuando UsersTable pide abrir un modal:
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeactivateRequest = (employee) => {
    setSelectedEmployee(employee);
    setConfirmDeactivateModal(true);
  };

  const handleDeleteRequest = (employee) => {
    setSelectedEmployee(employee);
    setConfirmDeleteModal(true);
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

  const confirmDeactivate = () => {
    deactivateEmployee(selectedEmployee.id, {
      onSuccess: () => {
        setConfirmDeactivateModal(false);
        setSelectedEmployee(null);
      },
    });
  };

  const confirmDelete = () => {
    deleteEmployeePermanently(selectedEmployee.id, {
      onSuccess: () => {
        setConfirmDeleteModal(false);
        setSelectedEmployee(null);
        setDeleteCountdown(0);
      },
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Empleados</h1>
          <p className="page-subtitle">Gestiona los empleados de tu negocio</p>
        </div>

        {canCreateEmployee && (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar Empleado
          </button>
        )}
      </div>

      <div className="page-filters">
        <label className="filter-label">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          <span>Mostrar empleados desactivados</span>
        </label>
      </div>

      <UsersTable
        showInactive={showInactive}
        onViewDetails={handleViewDetails}
        onEdit={handleEditEmployee}
        onDeactivate={handleDeactivateRequest}
        onDelete={handleDeleteRequest}
      />

      {/* Modales globales */}

      <CreateEmployeeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEmployee={handleCreateEmployee}
        isCreating={isCreating}
      />

      <EditEmployeeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        employee={selectedEmployee}
        onUpdateEmployee={updateEmployee}
        isUpdating={isUpdating}
      />

      <EmployeeDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        employee={selectedEmployee}
      />

      {/* Confirmar desactivación */}
      {confirmDeactivateModal && (
        <div className="modal-overlay" onClick={() => setConfirmDeactivateModal(false)}>
          <div className="modal-container modal-deactivate" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Desactivar Empleado</h2>
              <button className="modal-close" onClick={() => setConfirmDeactivateModal(false)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="warning-text">
                ¿Seguro deseas desactivar a <strong>{selectedEmployee.full_name}</strong>?
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDeactivateModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-warning" onClick={confirmDeactivate} disabled={isDeactivating}>
                {isDeactivating ? 'Desactivando...' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar eliminación */}
      {confirmDeleteModal && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteModal(false)}>
          <div className="modal-container modal-delete" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Eliminar Permanentemente</h2>
              <button className="modal-close" onClick={() => setConfirmDeleteModal(false)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="warning-text">
                ¿Seguro deseas eliminar a <strong>{selectedEmployee.full_name}</strong>?
              </p>
              {deleteCountdown > 0 && (
                <p className="countdown-text">
                  Podrás eliminar en <strong>{deleteCountdown}</strong> segundos...
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteModal(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                disabled={deleteCountdown > 0 || isDeleting}
                onClick={confirmDelete}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersPage;
