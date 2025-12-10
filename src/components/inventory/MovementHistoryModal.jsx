import { useState } from 'react';
import { useMovementsByItem, useMovements } from '../../hooks/inventory/useMovements';
import  useAuthStore  from '../../store/authStore';
import ConfirmModal from '../shared/ConfirmModal';
import './InventoryModals.css';

const MovementHistoryModal = ({ isOpen, onClose, item }) => {
  const { user } = useAuthStore();
  const { movements, isLoading } = useMovementsByItem(item?.id);
  const { revertMovementMutation, isReverting } = useMovements();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [revertReason, setRevertReason] = useState('');

  if (!isOpen || !item) return null;

  const canRevert = user?.role === 'owner';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMovementTypeLabel = (type) => {
    const types = {
      manual_in: 'Entrada Manual',
      manual_out: 'Salida Manual',
      sale: 'Venta',
      transfer_in: 'Traslado Entrada',
      transfer_out: 'Traslado Salida',
      recipe_consumption: 'Consumo en Receta',
      revert: 'Reversión',
    };
    return types[type] || type;
  };

  const getMovementTypeColor = (type) => {
    if (type === 'manual_in' || type === 'transfer_in') return 'text-success';
    if (type === 'manual_out' || type === 'transfer_out' || type === 'sale' || type === 'recipe_consumption') return 'text-error';
    return 'text-primary';
  };

  const handleRevertClick = (movement) => {
    setSelectedMovement(movement);
    setRevertReason('');
    setShowConfirm(true);
  };

  const handleConfirmRevert = async () => {
    if (selectedMovement && revertReason.trim().length >= 10) {
      try {
        await revertMovementMutation.mutateAsync({
          movementId: selectedMovement.id,
          reason: revertReason.trim(),
        });
        setShowConfirm(false);
        setSelectedMovement(null);
        setRevertReason('');
      } catch (error) {
        console.error('Error reverting movement:', error);
      }
    }
  };

  const handleCancelRevert = () => {
    setShowConfirm(false);
    setSelectedMovement(null);
    setRevertReason('');
  };

  const filteredMovements = movements?.filter((mov) => {
    if (filterType === 'all') return true;
    if (filterType === 'in') return mov.movement_type === 'manual_in' || mov.movement_type === 'transfer_in';
    if (filterType === 'out')
      return mov.movement_type === 'manual_out' || mov.movement_type === 'transfer_out' ||
             mov.movement_type === 'sale' || mov.movement_type === 'recipe_consumption';
    if (filterType === 'manual')
      return mov.movement_type === 'manual_in' || mov.movement_type === 'manual_out';
    return true;
  });

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content modal-large"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <h2>Historial de Movimientos</h2>
              <p className="modal-subtitle">{item.name}</p>
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
            <div className="history-filters">
              <label htmlFor="filterType">Filtrar por tipo:</label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select-compact"
              >
                <option value="all">Todos los movimientos</option>
                <option value="in">Entradas</option>
                <option value="out">Salidas</option>
                <option value="manual">Manuales</option>
              </select>
            </div>

            {isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando historial...</p>
              </div>
            ) : !filteredMovements || filteredMovements.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3>Sin movimientos</h3>
                <p>No hay movimientos registrados para este ítem</p>
              </div>
            ) : (
              <div className="movements-table-wrapper">
                <table className="movements-table">
                  <thead>
                    <tr>
                      <th>Fecha y Hora</th>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                      <th>Motivo</th>
                      <th>Usuario</th>
                      {canRevert && <th>Acción</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovements.map((movement) => (
                      <tr
                        key={movement.id}
                        className={movement.reverted ? 'movement-reverted' : ''}
                      >
                        <td>
                          <span className="movement-date">
                            {formatDate(movement.created_at)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`movement-type ${getMovementTypeColor(
                              movement.movement_type
                            )}`}
                          >
                            {getMovementTypeLabel(movement.movement_type)}
                          </span>
                        </td>
                        <td>
                          <strong
                            className={
                              movement.quantity > 0
                                ? 'text-success'
                                : 'text-error'
                            }
                          >
                            {movement.quantity > 0 ? '+' : ''}
                            {movement.quantity} {item.unit_of_measure}
                          </strong>
                        </td>
                        <td>
                          <span className="movement-reason">
                            {movement.reason || '-'}
                          </span>
                        </td>
                        <td>
                          {movement.created_by_user_name ? (
                            <div className="user-info-compact">
                              <span className="user-name">
                                {movement.created_by_user_name}
                              </span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        {canRevert && (
                          <td>
                            {movement.reverted ? (
                              <span className="badge badge-reverted">Revertido</span>
                            ) : (
                              <button
                                className="btn-icon btn-revert"
                                onClick={() => handleRevertClick(movement)}
                                title="Revertir movimiento"
                                disabled={isReverting}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  width="18"
                                  height="18"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredMovements && filteredMovements.length > 0 && (
              <div className="movements-summary">
                <p>
                  Mostrando {filteredMovements.length} movimiento
                  {filteredMovements.length !== 1 ? 's' : ''}
                </p>
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

      {selectedMovement && (
        <ConfirmModal
          isOpen={showConfirm}
          title="Revertir Movimiento"
          confirmText="Sí, Revertir"
          cancelText="Cancelar"
          confirmType="warning"
          onConfirm={handleConfirmRevert}
          onCancel={handleCancelRevert}
          isLoading={isReverting}
        >
          <div className="confirm-details">
            <p>
              ¿Estás seguro de que deseas revertir este movimiento? Esta acción
              creará un movimiento inverso para restaurar el stock.
            </p>
            <div className="movement-details-box">
              <div className="detail-row">
                <span className="detail-label">Tipo:</span>
                <span className="detail-value">
                  {getMovementTypeLabel(selectedMovement.movement_type)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cantidad:</span>
                <span className="detail-value">
                  <strong>
                    {selectedMovement.quantity > 0 ? '+' : ''}
                    {selectedMovement.quantity} {item.unit_of_measure}
                  </strong>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha:</span>
                <span className="detail-value">
                  {formatDate(selectedMovement.created_at)}
                </span>
              </div>
              {selectedMovement.reason && (
                <div className="detail-row">
                  <span className="detail-label">Motivo original:</span>
                  <span className="detail-value">{selectedMovement.reason}</span>
                </div>
              )}
            </div>
            <p className="confirm-note">
              <strong>Nota:</strong> Esta acción creará un movimiento inverso con cantidad {selectedMovement.quantity > 0 ? '-' : '+'}{Math.abs(selectedMovement.quantity)} {item.unit_of_measure}.
            </p>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="revert-reason" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Motivo de la reversión *
              </label>
              <textarea
                id="revert-reason"
                value={revertReason}
                onChange={(e) => setRevertReason(e.target.value)}
                placeholder="Explica por qué estás revirtiendo este movimiento (mínimo 10 caracteres)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: revertReason.trim().length > 0 && revertReason.trim().length < 10
                    ? '1px solid #ef4444'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: '#fff',
                  resize: 'vertical',
                }}
                disabled={isReverting}
              />
              {revertReason.trim().length > 0 && revertReason.trim().length < 10 && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  El motivo debe tener al menos 10 caracteres ({revertReason.trim().length}/10)
                </p>
              )}
            </div>
          </div>
        </ConfirmModal>
      )}
    </>
  );
};

export default MovementHistoryModal;
