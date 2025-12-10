import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRelationships } from '../../hooks/business/useRelationships';
import { useInventory } from '../../hooks/inventory/useInventory';
import { useTransfers } from '../../hooks/inventory/useTransfers';
import useAuthStore from '../../store/authStore';
import './TransferModals.css';

const CreateTransferModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, control, watch } =
    useForm({
      defaultValues: {
        to_business_id: '',
        notes: '',
        items: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { user } = useAuthStore();
  const { activeRelationships, isLoadingActive } = useRelationships();
  const { inventoryItems, isLoading: isLoadingInventory } = useInventory();
  const { createTransfer, isCreatingTransfer } = useTransfers();

  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItemsIds, setSelectedItemsIds] = useState(new Set());

  const watchedItems = watch('items');

  // Filter only active inventory items
  useEffect(() => {
    if (inventoryItems) {
      const active = inventoryItems.filter((item) => item.is_active);
      setAvailableItems(active);
    }
  }, [inventoryItems]);

  // Track selected items
  useEffect(() => {
    const ids = new Set(
      watchedItems
        .map((item) => item.inventory_item_id)
        .filter((id) => id)
    );
    setSelectedItemsIds(ids);
  }, [watchedItems]);

  const onSubmit = (data) => {
    // Validate at least one item
    if (!data.items || data.items.length === 0) {
      alert('Debe agregar al menos un ítem al traslado');
      return;
    }

    // Transform data for API
    const transferData = {
      to_business_id: parseInt(data.to_business_id),
      notes: data.notes || undefined,
      items: data.items.map((item) => ({
        inventory_item_id: parseInt(item.inventory_item_id),
        quantity: parseFloat(item.quantity),
        notes: item.notes || undefined,
      })),
    };

    createTransfer(transferData, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    setSelectedItemsIds(new Set());
    onClose();
  };

  const handleAddItem = () => {
    append({
      inventory_item_id: '',
      quantity: '',
      notes: '',
    });
  };

  const handleRemoveItem = (index, itemId) => {
    remove(index);
    if (itemId) {
      setSelectedItemsIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const getItemStock = (itemId) => {
    const item = availableItems.find((i) => i.id === parseInt(itemId));
    return item ? parseFloat(item.quantity_in_stock) : 0;
  };

  const getItemName = (itemId) => {
    const item = availableItems.find((i) => i.id === parseInt(itemId));
    return item ? `${item.name} (${item.unit_of_measure})` : '';
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Crear Traslado de Inventario</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          {/* Target Business Selection */}
          <div className="form-group">
            <label htmlFor="to_business_id">
              Negocio Destino <span className="required">*</span>
            </label>
            <select
              id="to_business_id"
              {...register('to_business_id', {
                required: 'Debe seleccionar un negocio destino',
              })}
              className={errors.to_business_id ? 'error' : ''}
              disabled={isCreatingTransfer || isLoadingActive}
            >
              <option value="">-- Seleccione un negocio --</option>
              {activeRelationships.map((rel) => {
                // Obtener el business_id del usuario autenticado
                const currentBusinessId = user?.business_id;

                if (!currentBusinessId) {
                  return null; // Si no hay business_id, no mostrar nada
                }

                // Determinar si el negocio actual es el requester o el target
                const isCurrentBusinessRequester = rel.requester_business_id === currentBusinessId;

                // El negocio a mostrar es el "otro" (no el actual)
                const otherBusinessId = isCurrentBusinessRequester
                  ? rel.target_business_id
                  : rel.requester_business_id;

                const otherBusinessName = isCurrentBusinessRequester
                  ? rel.target_business_name
                  : rel.requester_business_name;

                return (
                  <option key={rel.id} value={otherBusinessId}>
                    {otherBusinessName}
                  </option>
                );
              })}
            </select>
            {errors.to_business_id && (
              <span className="error-message">
                {errors.to_business_id.message}
              </span>
            )}
            {activeRelationships.length === 0 && (
              <span className="info-text">
                No hay negocios disponibles. Primero debes establecer relaciones
                activas.
              </span>
            )}
          </div>

          {/* General Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notas del Traslado (Opcional)</label>
            <textarea
              id="notes"
              {...register('notes')}
              placeholder="Motivo o descripción general del traslado..."
              disabled={isCreatingTransfer}
            />
          </div>

          {/* Items Section */}
          <div className="items-section">
            <div className="section-header">
              <h3>Ítems a Trasladar</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddItem}
                disabled={
                  isCreatingTransfer ||
                  availableItems.length === selectedItemsIds.size
                }
              >
                + Agregar Ítem
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="empty-items">
                <p>No hay ítems agregados. Haz clic en "Agregar Ítem" para empezar.</p>
              </div>
            ) : (
              <div className="items-list">
                {fields.map((field, index) => {
                  const watchedItemId = watch(`items.${index}.inventory_item_id`);
                  const watchedQuantity = watch(`items.${index}.quantity`);
                  const maxStock = getItemStock(watchedItemId);

                  return (
                    <div key={field.id} className="item-row">
                      <div className="item-row-header">
                        <span className="item-number">#{index + 1}</span>
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() =>
                            handleRemoveItem(index, watchedItemId)
                          }
                          disabled={isCreatingTransfer}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="item-row-content">
                        {/* Item Selection */}
                        <div className="form-group">
                          <label htmlFor={`items.${index}.inventory_item_id`}>
                            Ítem <span className="required">*</span>
                          </label>
                          <select
                            id={`items.${index}.inventory_item_id`}
                            {...register(`items.${index}.inventory_item_id`, {
                              required: 'Debe seleccionar un ítem',
                            })}
                            className={
                              errors.items?.[index]?.inventory_item_id
                                ? 'error'
                                : ''
                            }
                            disabled={isCreatingTransfer || isLoadingInventory}
                          >
                            <option value="">-- Seleccione un ítem --</option>
                            {availableItems.map((item) => {
                              const isSelected =
                                selectedItemsIds.has(item.id.toString()) &&
                                item.id.toString() !== watchedItemId;
                              return (
                                <option
                                  key={item.id}
                                  value={item.id}
                                  disabled={isSelected}
                                >
                                  {item.name} - {item.quantity_in_stock}{' '}
                                  {item.unit_of_measure}
                                  {isSelected ? ' (Ya seleccionado)' : ''}
                                </option>
                              );
                            })}
                          </select>
                          {errors.items?.[index]?.inventory_item_id && (
                            <span className="error-message">
                              {errors.items[index].inventory_item_id.message}
                            </span>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="form-group">
                          <label htmlFor={`items.${index}.quantity`}>
                            Cantidad <span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.001"
                            id={`items.${index}.quantity`}
                            {...register(`items.${index}.quantity`, {
                              required: 'Debe ingresar una cantidad',
                              min: {
                                value: 0.001,
                                message: 'La cantidad debe ser mayor a 0',
                              },
                              max: {
                                value: maxStock,
                                message: `Stock insuficiente. Máx: ${maxStock}`,
                              },
                            })}
                            className={
                              errors.items?.[index]?.quantity ? 'error' : ''
                            }
                            placeholder="0.00"
                            disabled={isCreatingTransfer || !watchedItemId}
                          />
                          {errors.items?.[index]?.quantity && (
                            <span className="error-message">
                              {errors.items[index].quantity.message}
                            </span>
                          )}
                          {watchedItemId && (
                            <span className="info-text">
                              Stock disponible: {maxStock}
                            </span>
                          )}
                        </div>

                        {/* Item Notes */}
                        <div className="form-group">
                          <label htmlFor={`items.${index}.notes`}>
                            Notas (Opcional)
                          </label>
                          <input
                            type="text"
                            id={`items.${index}.notes`}
                            {...register(`items.${index}.notes`)}
                            placeholder="Notas adicionales sobre este ítem..."
                            disabled={isCreatingTransfer}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="info-banner warning">
            <i className="icon">⚠️</i>
            <div>
              <strong>Importante:</strong>
              <p>
                Al crear el traslado, el negocio destino recibirá una solicitud
                que deberá aceptar para que el inventario se actualice en ambos
                negocios.
              </p>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isCreatingTransfer}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreatingTransfer || fields.length === 0}
            >
              {isCreatingTransfer ? 'Creando...' : 'Crear Traslado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransferModal;
