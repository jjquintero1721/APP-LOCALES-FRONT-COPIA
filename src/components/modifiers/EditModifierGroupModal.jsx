/**
 * Modal para editar un grupo de modificadores
 */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useModifierGroups } from '../../hooks/modifiers/useModifierGroups';
import './ModifierModals.css';

const EditModifierGroupModal = ({ isOpen, onClose, group }) => {
  const { updateGroup, isUpdatingGroup } = useModifierGroups();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (group && isOpen) {
      reset({
        name: group.name || '',
        description: group.description || '',
        allow_multiple: group.allow_multiple || false,
        is_required: group.is_required || false,
        is_active: group.is_active !== undefined ? group.is_active : true,
      });
    }
  }, [group, isOpen, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    updateGroup(
      { groupId: group.id, groupData: data },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen || !group) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Grupo de Modificadores</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name">
                Nombre del grupo <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: { value: 1, message: 'El nombre debe tener al menos 1 caracter' },
                })}
                placeholder="Ej: Tamaño, Extras, Sin ingrediente..."
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                {...register('description')}
                rows="3"
                placeholder="Descripción opcional del grupo..."
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" {...register('allow_multiple')} />
                <span>Permitir selección múltiple</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" {...register('is_required')} />
                <span>Es obligatorio seleccionar</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="is_active">Estado</label>
              <select id="is_active" {...register('is_active')}>
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isUpdatingGroup}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isUpdatingGroup}>
              {isUpdatingGroup ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModifierGroupModal;
