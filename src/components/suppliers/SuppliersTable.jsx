import { useSuppliers } from '../../hooks/suppliers/useSuppliers';
import useAuthStore from '../../store/authStore';
import './SuppliersTable.css';

const SuppliersTable = ({
  showInactive,
  onViewDetails,
  onEdit,
  onDeactivate,
  onActivate,
  onDeletePermanently,
  isUpdating,
  isDeactivating,
  isDeleting,
}) => {
  const { user: currentUser } = useAuthStore();
  const {
    suppliers,
    isLoading,
    error,
  } = useSuppliers();

  // Filtrar proveedores según el estado activo/inactivo
  const filteredSuppliers = suppliers?.filter(
    (supplier) => showInactive || supplier.is_active
  );

  // Verificar si el usuario puede realizar ciertas acciones
  const canEdit = currentUser?.role === 'owner' || currentUser?.role === 'admin';
  const canDeletePermanently = currentUser?.role === 'owner';

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando proveedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error al cargar proveedores</p>
        <p className="error-detail">{error.message}</p>
      </div>
    );
  }

  if (!filteredSuppliers || filteredSuppliers.length === 0) {
    return (
      <div className="empty-state">
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
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3>No hay proveedores</h3>
        <p>
          {showInactive
            ? 'No se encontraron proveedores.'
            : 'No hay proveedores activos. Intenta mostrar los inactivos.'}
        </p>
      </div>
    );
  }

  return (
    <div className="suppliers-table-container">
      <div className="table-wrapper">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Tipo</th>
              <th>NIT</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className={`table-row ${!supplier.is_active ? 'inactive' : ''}`}
              >
                <td>
                  <strong>{supplier.name}</strong>
                </td>
                <td>{supplier.supplier_type || '-'}</td>
                <td>{supplier.tax_id || '-'}</td>
                <td>{supplier.legal_representative || '-'}</td>
                <td>{supplier.phone || '-'}</td>
                <td>{supplier.email || '-'}</td>
                <td>
                  <span className={`status ${supplier.is_active ? 'active' : 'inactive'}`}>
                    <span className="status-dot"></span>
                    {supplier.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="action-btn view"
                      onClick={() => onViewDetails(supplier)}
                      title="Ver detalles"
                    >
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    {canEdit && (
                      <button
                        className="action-btn edit"
                        onClick={() => onEdit(supplier)}
                        disabled={isUpdating}
                        title="Editar"
                      >
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    )}
                    {canEdit && supplier.is_active && (
                      <button
                        className="action-btn deactivate"
                        onClick={() => onDeactivate(supplier)}
                        disabled={isDeactivating}
                        title="Desactivar"
                      >
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
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                      </button>
                    )}
                    {canEdit && !supplier.is_active && (
                      <button
                        className="action-btn activate"
                        onClick={() => onActivate(supplier)}
                        disabled={isUpdating}
                        title="Activar"
                      >
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    )}
                    {canDeletePermanently && !supplier.is_active && (
                      <button
                        className="action-btn delete"
                        onClick={() => onDeletePermanently(supplier)}
                        disabled={isDeleting}
                        title="Eliminar permanentemente"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
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
    </div>
  );
};

export default SuppliersTable;
