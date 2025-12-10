/**
 * Modal para crear un modificador con sus ítems de inventario
 */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useModifiers } from '../../hooks/modifiers/useModifiers';
import { useInventory } from '../../hooks/inventory/useInventory';
import './ModifierModals.css';

const CreateModifierModal = ({ isOpen, onClose, groupId }) => {
  const { createModifier, isCreatingModifier } = useModifiers(groupId);
  const { inventoryItems } = useInventory(0, 1000, true);
  const [inventoryItemsList, setInventoryItemsList] = useState([]);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price_extra: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setInventoryItemsList([]);
      setError('');
    }
  }, [isOpen, reset]);

  const handleAddItem = () => {
    setInventoryItemsList([...inventoryItemsList, { inventory_item_id: '', quantity: '' }]);
  };

  const handleRemoveItem = (index) => {
    setInventoryItemsList(inventoryItemsList.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newList = [...inventoryItemsList];
    newList[index][field] = value;
    setInventoryItemsList(newList);
  };

  const onSubmit = async (data) => {
    if (inventoryItemsList.length === 0) {
      setError('Debe agregar al menos un ítem de inventario');
      return;
    }

    const invalidItems = inventoryItemsList.filter(
      (item) => !item.inventory_item_id || !item.quantity || parseFloat(item.quantity) === 0
    );

    if (invalidItems.length > 0) {
      setError('Todos los ítems deben tener un ítem de inventario y una cantidad diferente de cero');
      return;
    }

    setError('');

    const modifierData = {
      modifier_group_id: groupId,
      name: data.name,
      description: data.description || null,
      price_extra: parseFloat(data.price_extra),
      inventory_items: inventoryItemsList.map((item) => ({
        inventory_item_id: parseInt(item.inventory_item_id),
        quantity: parseFloat(item.quantity),
      })),
    };

    createModifier(modifierData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Modificador</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="modal-body">
            <div className="form-section">
              <h3 className="section-title">Información Básica</h3>

              <div className="form-group">
                <label htmlFor="name">
                  Nombre del modificador <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'El nombre es requerido',
                    minLength: { value: 1, message: 'El nombre debe tener al menos 1 caracter' },
                  })}
                  placeholder="Ej: Doble carne, Sin cebolla, Grande..."
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows="2"
                  placeholder="Descripción opcional..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="price_extra">Precio adicional</label>
                <input
                  id="price_extra"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price_extra', {
                    min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
                  })}
                  placeholder="0.00"
                />
                {errors.price_extra && <span className="error-message">{errors.price_extra.message}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                Ítems de Inventario <span className="required">*</span>
              </h3>
              <p className="help-text" style={{ marginBottom: '16px' }}>
                Cantidad positiva para agregar, negativa para quitar
              </p>

              {inventoryItemsList.map((item, index) => (
                <div key={index} className="inventory-item-row">
                  <select
                    value={item.inventory_item_id}
                    onChange={(e) => handleItemChange(index, 'inventory_item_id', e.target.value)}
                    className="item-select"
                  >
                    <option value="">Seleccionar ítem...</option>
                    {inventoryItems?.map((invItem) => (
                      <option key={invItem.id} value={invItem.id}>
                        {invItem.name} ({invItem.sku}) - {invItem.unit_of_measure}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.001"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    placeholder="Cantidad"
                    className="quantity-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="btn-remove-item"
                    title="Eliminar ítem"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button type="button" onClick={handleAddItem} className="btn-add-item">
                + Agregar Ítem
              </button>

              {error && <div className="error-message" style={{ marginTop: '12px' }}>{error}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isCreatingModifier}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isCreatingModifier}>
              {isCreatingModifier ? 'Creando...' : 'Crear Modificador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModifierModal;
