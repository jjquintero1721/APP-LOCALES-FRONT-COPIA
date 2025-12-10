/**
 * Modal para crear un grupo de modificadores
 */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useModifierGroups } from '../../hooks/modifiers/useModifierGroups';
import './ModifierModals.css';

const CreateModifierGroupModal = ({ isOpen, onClose }) => {
  const { createGroup, isCreatingGroup } = useModifierGroups();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      allow_multiple: false,
      is_required: false,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    createGroup(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Grupo de Modificadores</h2>
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
              <p className="help-text">
                Si está activado, el cliente podrá seleccionar varios modificadores de este grupo
              </p>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" {...register('is_required')} />
                <span>Es obligatorio seleccionar</span>
              </label>
              <p className="help-text">
                Si está activado, el cliente deberá seleccionar al menos un modificador de este grupo
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isCreatingGroup}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isCreatingGroup}>
              {isCreatingGroup ? 'Creando...' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModifierGroupModal;
