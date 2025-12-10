/**
 * Modal para editar un modificador (sin modificar ítems de inventario)
 */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useModifiers } from '../../hooks/modifiers/useModifiers';
import './ModifierModals.css';

const EditModifierModal = ({ isOpen, onClose, modifier }) => {
  const { updateModifier, isUpdatingModifier } = useModifiers(modifier?.modifier_group_id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (modifier && isOpen) {
      reset({
        name: modifier.name || '',
        description: modifier.description || '',
        price_extra: modifier.price_extra || 0,
        is_active: modifier.is_active !== undefined ? modifier.is_active : true,
      });
    }
  }, [modifier, isOpen, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    updateModifier(
      {
        modifierId: modifier.id,
        modifierData: {
          name: data.name,
          description: data.description || null,
          price_extra: parseFloat(data.price_extra),
          is_active: data.is_active,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen || !modifier) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Modificador</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="modal-body">
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

            <div className="form-group">
              <label htmlFor="is_active">Estado</label>
              <select id="is_active" {...register('is_active')}>
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>
            </div>

            <div className="warning-message" style={{ marginTop: '16px' }}>
              ℹ️ Nota: Los ítems de inventario no pueden modificarse. Para cambiarlos, crea un nuevo modificador.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isUpdatingModifier}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isUpdatingModifier}>
              {isUpdatingModifier ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModifierModal;
