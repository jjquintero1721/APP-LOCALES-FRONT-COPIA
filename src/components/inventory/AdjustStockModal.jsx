import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useInventory } from '../../hooks/inventory/useInventory';
import ConfirmModal from '../shared/ConfirmModal';
import './InventoryModals.css';

const AdjustStockModal = ({ isOpen, onClose, item }) => {
  const { adjustStockMutation } = useInventory();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      movement_type: 'IN',
      quantity: '',
      reason: '',
    },
  });

  const movementType = watch('movement_type');
  const quantity = watch('quantity');

  useEffect(() => {
    if (isOpen && item) {
      reset({
        movement_type: 'IN',
        quantity: '',
        reason: '',
      });
    }
  }, [isOpen, item, reset]);

  if (!isOpen || !item) return null;

  const currentStock = parseFloat(item.quantity_in_stock) || 0;
  const adjustmentQuantity = parseFloat(quantity) || 0;

  const newStock =
    movementType === 'IN'
      ? currentStock + adjustmentQuantity
      : currentStock - adjustmentQuantity;

  const isLargeWithdrawal =
    movementType === 'OUT' && adjustmentQuantity > currentStock * 0.5;

  const onSubmit = async (data) => {
    // Validar que el stock resultante no sea negativo
    if (newStock < 0) {
      return;
    }

    // Si es una salida grande, mostrar confirmación
    if (isLargeWithdrawal && !showConfirm) {
      setPendingData(data);
      setShowConfirm(true);
      return;
    }

    await executeAdjustment(data);
  };

  const executeAdjustment = async (data) => {
    try {
      const quantityValue = parseFloat(data.quantity);
      const quantity_change = data.movement_type === 'IN' ? quantityValue : -quantityValue;

      await adjustStockMutation.mutateAsync({
        itemId: item.id,
        adjustmentData: {
          quantity_change,
          reason: data.reason,
        },
      });
      reset();
      setShowConfirm(false);
      setPendingData(null);
      onClose();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      setShowConfirm(false);
      setPendingData(null);
    }
  };

  const handleClose = () => {
    reset();
    setShowConfirm(false);
    setPendingData(null);
    onClose();
  };

  const handleConfirmAdjustment = () => {
    if (pendingData) {
      executeAdjustment(pendingData);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Ajustar Stock</h2>
            <button className="modal-close" onClick={handleClose}>
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="info-box">
                <div className="info-row">
                  <span className="info-label">Ítem:</span>
                  <span className="info-value">
                    <strong>{item.name}</strong>
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Stock Actual:</span>
                  <span className="info-value text-primary">
                    <strong>
                      {currentStock} {item.unit_of_measure}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Tipo de Movimiento <span className="required">*</span>
                </label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="IN"
                      {...register('movement_type', {
                        required: 'Selecciona un tipo de movimiento',
                      })}
                    />
                    <div className="radio-content">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="20"
                        height="20"
                        className="text-success"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                      <span>
                        <strong>Entrada Manual</strong>
                        <small>Agregar stock al inventario</small>
                      </span>
                    </div>
                  </label>

                  <label className="radio-label">
                    <input
                      type="radio"
                      value="OUT"
                      {...register('movement_type', {
                        required: 'Selecciona un tipo de movimiento',
                      })}
                    />
                    <div className="radio-content">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="20"
                        height="20"
                        className="text-error"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 13l-5 5m0 0l-5-5m5 5V6"
                        />
                      </svg>
                      <span>
                        <strong>Salida Manual</strong>
                        <small>Retirar stock del inventario</small>
                      </span>
                    </div>
                  </label>
                </div>
                {errors.movement_type && (
                  <span className="error-message">
                    {errors.movement_type.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="quantity">
                  Cantidad <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  step="0.01"
                  placeholder={`Cantidad en ${item.unit_of_measure}`}
                  {...register('quantity', {
                    required: 'La cantidad es obligatoria',
                    min: {
                      value: 0.01,
                      message: 'La cantidad debe ser mayor a 0',
                    },
                    validate: (value) => {
                      const qty = parseFloat(value);
                      if (movementType === 'OUT' && qty > currentStock) {
                        return `No puedes retirar más de ${currentStock} ${item.unit_of_measure}`;
                      }
                      return true;
                    },
                  })}
                  className={errors.quantity ? 'input-error' : ''}
                />
                {errors.quantity && (
                  <span className="error-message">{errors.quantity.message}</span>
                )}
              </div>

              {adjustmentQuantity > 0 && (
                <div
                  className={`stock-preview ${
                    newStock < 0
                      ? 'preview-error'
                      : isLargeWithdrawal
                      ? 'preview-warning'
                      : 'preview-success'
                  }`}
                >
                  <div className="preview-row">
                    <span>Stock Actual:</span>
                    <strong>
                      {currentStock} {item.unit_of_measure}
                    </strong>
                  </div>
                  <div className="preview-arrow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="24"
                      height="24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                  <div className="preview-row">
                    <span>Nuevo Stock:</span>
                    <strong className={newStock < 0 ? 'text-error' : ''}>
                      {newStock.toFixed(2)} {item.unit_of_measure}
                    </strong>
                  </div>
                </div>
              )}

              {newStock < 0 && (
                <div className="alert alert-error">
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>
                    El stock resultante no puede ser negativo. Reduce la cantidad de
                    salida.
                  </span>
                </div>
              )}

              {isLargeWithdrawal && newStock >= 0 && (
                <div className="alert alert-warning">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    <strong>Alerta:</strong> Estás retirando más del 50% del stock
                    actual. Se solicitará confirmación adicional.
                  </span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="reason">
                  Motivo del Ajuste <span className="required">*</span>
                </label>
                <textarea
                  id="reason"
                  rows="4"
                  placeholder="Explica el motivo del ajuste manual (ej: merma por vencimiento, daño en producto, corrección de inventario, etc.)"
                  {...register('reason', {
                    required: 'El motivo es obligatorio para ajustes manuales',
                    minLength: {
                      value: 10,
                      message: 'El motivo debe tener al menos 10 caracteres',
                    },
                  })}
                  className={errors.reason ? 'input-error' : ''}
                />
                {errors.reason && (
                  <span className="error-message">{errors.reason.message}</span>
                )}
                <small className="form-hint">
                  Es importante documentar por qué se realiza este ajuste manual para
                  mantener un registro de auditoría.
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={adjustStockMutation.isPending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`btn ${
                  movementType === 'IN' ? 'btn-success' : 'btn-danger'
                }`}
                disabled={adjustStockMutation.isPending || newStock < 0}
              >
                {adjustStockMutation.isPending ? (
                  <>
                    <span className="spinner-small"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    {movementType === 'IN' ? (
                      <>
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
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                        Registrar Entrada
                      </>
                    ) : (
                      <>
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
                            d="M17 13l-5 5m0 0l-5-5m5 5V6"
                          />
                        </svg>
                        Registrar Salida
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirmar Salida Grande"
        message={`Estás a punto de retirar ${adjustmentQuantity} ${item.unit_of_measure}, que representa más del 50% del stock actual. ¿Estás seguro de continuar?`}
        confirmText="Sí, Continuar"
        cancelText="Cancelar"
        confirmType="danger"
        countdown={3}
        onConfirm={handleConfirmAdjustment}
        onCancel={() => {
          setShowConfirm(false);
          setPendingData(null);
        }}
        isLoading={adjustStockMutation.isPending}
      />
    </>
  );
};

export default AdjustStockModal;
