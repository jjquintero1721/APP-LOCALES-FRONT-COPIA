import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTransfer } from '../../hooks/inventory/useTransfers';
import  useAuthStore  from '../../store/authStore';
import ConfirmModal from '../shared/ConfirmModal';
import './TransferModals.css';

const TransferDetailsModal = ({
  isOpen,
  onClose,
  transferId,
  onAccept,
  onReject,
  onCancel,
}) => {
  const { transfer, isLoading } = useTransfer(transferId, isOpen);
  const { user } = useAuthStore();
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'accept'|'reject'|'cancel' }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy - HH:mm", {
        locale: es,
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', className: 'badge-warning' },
      completed: { text: 'Completado', className: 'badge-success' },
      cancelled: { text: 'Cancelado', className: 'badge-secondary' },
      rejected: { text: 'Rechazado', className: 'badge-danger' },
    };

    const badge = badges[status] || {
      text: status,
      className: 'badge-secondary',
    };

    return <span className={`badge ${badge.className}`}>{badge.text}</span>;
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    switch (confirmAction.type) {
      case 'accept':
        onAccept?.();
        break;
      case 'reject':
        onReject?.();
        break;
      case 'cancel':
        onCancel?.();
        break;
    }

    setConfirmAction(null);
    onClose();
  };

  if (!isOpen) return null;

  // Determine if user can take actions
  const canManage = user?.role === 'owner' || user?.role === 'admin';
  const isFromCurrentBusiness =
    transfer?.from_business_id === user?.business_id;
  const isToCurrentBusiness = transfer?.to_business_id === user?.business_id;
  const isPending = transfer?.status === 'pending';

  // Action availability
  const canAccept = canManage && isToCurrentBusiness && isPending;
  const canReject = canManage && isToCurrentBusiness && isPending;
  const canCancel = canManage && isFromCurrentBusiness && isPending;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content modal-large"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Detalles del Traslado</h2>
            <button className="modal-close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando detalles del traslado...</p>
              </div>
            ) : !transfer ? (
              <div className="error-state">
                <p>No se pudo cargar el traslado.</p>
              </div>
            ) : (
              <>
                {/* Transfer Info */}
                <div className="details-grid">
                  <div className="detail-row">
                    <span className="detail-label">Estado:</span>
                    <span className="detail-value">
                      {getStatusBadge(transfer.status)}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Negocio Origen:</span>
                    <span className="detail-value">
                      {transfer.from_business_name}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Negocio Destino:</span>
                    <span className="detail-value">
                      {transfer.to_business_name}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Creado por:</span>
                    <span className="detail-value">
                      {transfer.created_by_user_name}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Fecha de Creación:</span>
                    <span className="detail-value">
                      {formatDate(transfer.created_at)}
                    </span>
                  </div>

                  {transfer.completed_at && (
                    <div className="detail-row">
                      <span className="detail-label">Fecha de Completado:</span>
                      <span className="detail-value">
                        {formatDate(transfer.completed_at)}
                      </span>
                    </div>
                  )}

                  {transfer.notes && (
                    <div className="detail-row full-width">
                      <span className="detail-label">Notas:</span>
                      <span className="detail-value">{transfer.notes}</span>
                    </div>
                  )}
                </div>

                {/* Items Table */}
                <div className="items-section">
                  <h3>Ítems del Traslado</h3>
                  <div className="items-table">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Ítem</th>
                          <th>Cantidad</th>
                          <th>Notas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfer.items?.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.inventory_item_name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status Banners */}
                {transfer.status === 'pending' && isToCurrentBusiness && (
                  <div className="info-banner warning">
                    <i className="icon">📨</i>
                    <div>
                      <strong>Solicitud Pendiente</strong>
                      <p>
                        Has recibido una solicitud de traslado. Revisa los ítems
                        y acepta o rechaza la solicitud.
                      </p>
                    </div>
                  </div>
                )}

                {transfer.status === 'pending' && isFromCurrentBusiness && (
                  <div className="info-banner info">
                    <i className="icon">⏳</i>
                    <div>
                      <strong>Solicitud Enviada</strong>
                      <p>
                        Este traslado está esperando ser aceptado por el negocio
                        destino. Puedes cancelarlo si es necesario.
                      </p>
                    </div>
                  </div>
                )}

                {transfer.status === 'completed' && (
                  <div className="info-banner success">
                    <i className="icon">✅</i>
                    <div>
                      <strong>Traslado Completado</strong>
                      <p>
                        El inventario ha sido actualizado exitosamente en ambos
                        negocios.
                      </p>
                    </div>
                  </div>
                )}

                {transfer.status === 'cancelled' && (
                  <div className="info-banner secondary">
                    <i className="icon">🚫</i>
                    <div>
                      <strong>Traslado Cancelado</strong>
                      <p>
                        Este traslado fue cancelado por el negocio de origen.
                      </p>
                    </div>
                  </div>
                )}

                {transfer.status === 'rejected' && (
                  <div className="info-banner danger">
                    <i className="icon">❌</i>
                    <div>
                      <strong>Traslado Rechazado</strong>
                      <p>
                        Este traslado fue rechazado por el negocio de destino.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="modal-actions">
            {canAccept && (
              <button
                className="btn btn-success"
                onClick={() => setConfirmAction({ type: 'accept' })}
              >
                ✓ Aceptar Traslado
              </button>
            )}

            {canReject && (
              <button
                className="btn btn-danger"
                onClick={() => setConfirmAction({ type: 'reject' })}
              >
                ✕ Rechazar
              </button>
            )}

            {canCancel && (
              <button
                className="btn btn-warning"
                onClick={() => setConfirmAction({ type: 'cancel' })}
              >
                🚫 Cancelar
              </button>
            )}

            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmAction}
        title={
          confirmAction?.type === 'accept'
            ? 'Confirmar Aceptación'
            : confirmAction?.type === 'reject'
            ? 'Confirmar Rechazo'
            : 'Confirmar Cancelación'
        }
        message={
          confirmAction?.type === 'accept'
            ? '¿Estás seguro de que deseas aceptar este traslado? El inventario se actualizará en ambos negocios.'
            : confirmAction?.type === 'reject'
            ? '¿Estás seguro de que deseas rechazar este traslado?'
            : '¿Estás seguro de que deseas cancelar este traslado?'
        }
        confirmText={
          confirmAction?.type === 'accept'
            ? 'Aceptar'
            : confirmAction?.type === 'reject'
            ? 'Rechazar'
            : 'Cancelar Traslado'
        }
        confirmType={
          confirmAction?.type === 'accept'
            ? 'primary'
            : confirmAction?.type === 'reject'
            ? 'danger'
            : 'warning'
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
};

export default TransferDetailsModal;
