import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import SuppliersTable from '../../components/suppliers/SuppliersTable';
import CreateSupplierModal from '../../components/suppliers/CreateSupplierModal';
import SupplierDetailsModal from '../../components/suppliers/SupplierDetailsModal';
import EditSupplierModal from '../../components/suppliers/EditSupplierModal';
import { useSuppliers } from '../../hooks/suppliers/useSuppliers';
import './SuppliersPage.css';

const SuppliersPage = () => {
  const { user } = useAuthStore();
  const {
    createSupplier,
    isCreating,
    updateSupplier,
    deactivateSupplier,
    deleteSupplierPermanently,
    isUpdating,
    isDeactivating,
    isDeleting,
  } = useSuppliers();

  // Estado de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deactivatingSupplier, setDeactivatingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [deleteCountdown, setDeleteCountdown] = useState(0);

  const canCreateSupplier = user?.role === 'owner' || user?.role === 'admin';

  const handleCreateSupplier = (supplierData) => {
    createSupplier(supplierData, {
      onSuccess: () => setShowCreateModal(false),
    });
  };

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailsModal(true);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  const handleDeactivateClick = (supplier) => {
    setDeactivatingSupplier(supplier);
  };

  const confirmDeactivate = () => {
    if (deactivatingSupplier) {
      deactivateSupplier(deactivatingSupplier.id);
      setDeactivatingSupplier(null);
    }
  };

  const cancelDeactivate = () => {
    setDeactivatingSupplier(null);
  };

  const handleActivate = (supplier) => {
    updateSupplier({
      supplierId: supplier.id,
      supplierData: { is_active: true },
    });
  };

  const handleDeletePermanently = (supplier) => {
    setDeletingSupplier(supplier);
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
    if (deletingSupplier) {
      deleteSupplierPermanently(deletingSupplier.id);
      setDeletingSupplier(null);
      setDeleteCountdown(0);
    }
  };

  const cancelDelete = () => {
    setDeletingSupplier(null);
    setDeleteCountdown(0);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Proveedores</h1>
          <p className="page-subtitle">Gestiona los proveedores de tu negocio</p>
        </div>

        {canCreateSupplier && (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar Proveedor
          </button>
        )}
      </div>

      <div className="page-filters">
        <label className="filter-label">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="filter-checkbox"
          />
          <span>Mostrar proveedores desactivados</span>
        </label>
      </div>

      <div className="page-content">
        <SuppliersTable
          showInactive={showInactive}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDeactivate={handleDeactivateClick}
          onActivate={handleActivate}
          onDeletePermanently={handleDeletePermanently}
          isUpdating={isUpdating}
          isDeactivating={isDeactivating}
          isDeleting={isDeleting}
        />
      </div>

      {/* Modal de Creación */}
      <CreateSupplierModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSupplier={handleCreateSupplier}
        isCreating={isCreating}
      />

      {/* Modal de Detalles */}
      <SupplierDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        supplier={selectedSupplier}
      />

      {/* Modal de Edición */}
      <EditSupplierModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdateSupplier={updateSupplier}
        isUpdating={isUpdating}
        supplier={selectedSupplier}
      />

      {/* Modal de Confirmación de Desactivación */}
      {deactivatingSupplier && (
        <div className="confirm-modal-overlay" onClick={cancelDeactivate}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ width: '24px', height: '24px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Confirmar Desactivación
              </h3>
            </div>
            <div className="confirm-modal-body">
              <p>
                ¿Estás seguro de que deseas desactivar el proveedor{' '}
                <strong>{deactivatingSupplier.name}</strong>?
              </p>
              <p>El proveedor podrá ser activado nuevamente más tarde.</p>
            </div>
            <div className="confirm-modal-footer">
              <button className="btn btn-secondary" onClick={cancelDeactivate}>
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDeactivate}
                disabled={isDeactivating}
              >
                {isDeactivating ? 'Desactivando...' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación Permanente */}
      {deletingSupplier && (
        <div className="confirm-modal-overlay" onClick={cancelDelete}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ width: '24px', height: '24px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Eliminar Permanentemente
              </h3>
            </div>
            <div className="confirm-modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar permanentemente el proveedor{' '}
                <strong>{deletingSupplier.name}</strong>?
              </p>
              <p>
                <strong>Esta acción no se puede deshacer.</strong>
              </p>
              {deleteCountdown > 0 && (
                <p>
                  Espera <span className="countdown">{deleteCountdown}</span> segundos
                  para confirmar.
                </p>
              )}
            </div>
            <div className="confirm-modal-footer">
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDeletePermanently}
                disabled={isDeleting || deleteCountdown > 0}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar Permanentemente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;
