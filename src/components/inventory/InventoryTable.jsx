import { useState, useMemo } from 'react';
import useAuthStore from '../../store/authStore';
import './InventoryTable.css';

const InventoryTable = ({
  items = [],
  isLoading,
  error,
  searchTerm,
  onViewDetails,
  onEdit,
  onAdjustStock,
  onViewHistory,
  onDeactivate,
  onActivate,
}) => {
  const { user } = useAuthStore();
  const canManage = user?.role === 'owner' || user?.role === 'admin';

  // Filtrar ítems por término de búsqueda
  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchTerm) return items;

    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.sku?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error al cargar inventario</p>
        <p className="error-detail">{error.message}</p>
      </div>
    );
  }

  if (!filteredItems || filteredItems.length === 0) {
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3>No hay ítems de inventario</h3>
        <p>
          {searchTerm
            ? 'No se encontraron ítems que coincidan con tu búsqueda.'
            : 'Comienza agregando ítems a tu inventario.'}
        </p>
      </div>
    );
  }

  const isLowStock = (item) => {
    if (!item.min_stock) return false;
    return parseFloat(item.quantity_in_stock) < parseFloat(item.min_stock);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="inventory-table-container">
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Min/Max</th>
              <th>Precio</th>
              <th>Proveedor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`table-row ${!item.is_active ? 'inactive' : ''} ${
                  isLowStock(item) ? 'low-stock' : ''
                }`}
              >
                <td>
                  <div className="item-name-cell">
                    <strong>{item.name}</strong>
                    {isLowStock(item) && (
                      <span className="low-stock-badge" title="Stock bajo">
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </td>
                <td>{item.sku || '-'}</td>
                <td>{item.category || '-'}</td>
                <td>
                  <div className="stock-cell">
                    <strong>{item.quantity_in_stock}</strong> {item.unit_of_measure}
                  </div>
                </td>
                <td>
                  <div className="min-max-cell">
                    {item.min_stock ? `${item.min_stock}` : '-'} /{' '}
                    {item.max_stock ? `${item.max_stock}` : '-'}
                  </div>
                </td>
                <td>{formatCurrency(item.unit_price)}</td>
                <td>{item.supplier_name || 'Sin proveedor'}</td>
                <td>
                  <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                    <span className="status-dot"></span>
                    {item.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="action-btn view"
                      onClick={() => onViewDetails(item)}
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

                    {canManage && item.is_active && (
                      <button
                        className="action-btn edit"
                        onClick={() => onEdit(item)}
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

                    {canManage && item.is_active && (
                      <button
                        className="action-btn adjust"
                        onClick={() => onAdjustStock(item)}
                        title="Ajustar stock"
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
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      className="action-btn history"
                      onClick={() => onViewHistory(item)}
                      title="Ver historial"
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>

                    {canManage && item.is_active && (
                      <button
                        className="action-btn deactivate"
                        onClick={() => onDeactivate(item)}
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

                    {canManage && !item.is_active && (
                      <button
                        className="action-btn activate"
                        onClick={() => onActivate(item)}
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

export default InventoryTable;
