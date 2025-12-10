/**
 * Modal para ver detalles completos de un modificador
 */
import React from 'react';
import { useModifier } from '../../hooks/modifiers/useModifiers';
import './ModifierModals.css';

const ModifierDetailsModal = ({ isOpen, onClose, modifier }) => {
  const { modifier: fullModifier, isLoading } = useModifier(modifier?.id);

  if (!isOpen) return null;

  const modifierData = fullModifier || modifier;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Detalles del Modificador</h2>
            {modifierData && (
              <div className="product-status-badges" style={{ marginTop: '8px' }}>
                <span className={`status-badge ${modifierData.is_active ? 'active' : 'inactive'}`}>
                  {modifierData.is_active ? '✓ Activo' : '✗ Inactivo'}
                </span>
              </div>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="loading-text">Cargando detalles...</div>
          ) : modifierData ? (
            <>
              {/* Información básica */}
              <div className="details-section">
                <h3 className="section-title">Información Básica</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nombre:</span>
                    <span className="detail-value">{modifierData.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Grupo:</span>
                    <span className="detail-value">{modifierData.modifier_group_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Precio Extra:</span>
                    <span className="detail-value price">${parseFloat(modifierData.price_extra).toFixed(2)}</span>
                  </div>
                  {modifierData.description && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Descripción:</span>
                      <span className="detail-value">{modifierData.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ítems de inventario */}
              <div className="details-section">
                <h3 className="section-title">
                  Ítems de Inventario ({modifierData.inventory_items?.length || 0})
                </h3>
                {modifierData.inventory_items && modifierData.inventory_items.length > 0 ? (
                  <div className="ingredients-details-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Ítem</th>
                          <th className="text-right">Cantidad</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modifierData.inventory_items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.inventory_item_name}</td>
                            <td className="text-right font-weight-bold">
                              {parseFloat(item.quantity) > 0 ? '+' : ''}
                              {parseFloat(item.quantity).toFixed(3)}
                            </td>
                            <td>
                              <span
                                className={`action-badge ${parseFloat(item.quantity) > 0 ? 'add' : 'remove'}`}
                              >
                                {parseFloat(item.quantity) > 0 ? 'Agregar' : 'Quitar'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="empty-state">No hay ítems asociados</p>
                )}
              </div>
            </>
          ) : (
            <p className="empty-state">No se encontraron detalles</p>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifierDetailsModal;
