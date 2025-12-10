import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRelationships } from '../../hooks/business/useRelationships';
import  useAuthStore  from '../../store/authStore';
import './RelationshipModals.css';

const CreateRelationshipModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const {
    availableBusinesses,
    activeRelationships,
    pendingRequests,
    createRelationship,
    isCreatingRelationship,
  } = useRelationships();

  const { user } = useAuthStore();
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  // Filter out current business and already related businesses
  useEffect(() => {
    if (!availableBusinesses || !user?.business_id) return;

    const relatedBusinessIds = new Set();

    // Add current business
    relatedBusinessIds.add(user.business_id);

    // Add already active relationships
    activeRelationships?.forEach((rel) => {
      relatedBusinessIds.add(rel.requester_business_id);
      relatedBusinessIds.add(rel.target_business_id);
    });

    // Add pending requests (both sent and received)
    pendingRequests?.forEach((rel) => {
      relatedBusinessIds.add(rel.requester_business_id);
      relatedBusinessIds.add(rel.target_business_id);
    });

    // Filter available businesses
    const available = availableBusinesses.filter(
      (business) => !relatedBusinessIds.has(business.id)
    );

    setFilteredBusinesses(available);
  }, [availableBusinesses, activeRelationships, pendingRequests, user]);

  const onSubmit = (data) => {
    createRelationship(parseInt(data.target_business_id), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Enviar Solicitud de Relación</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-group">
            <label htmlFor="target_business_id">
              Seleccionar Negocio <span className="required">*</span>
            </label>
            <select
              id="target_business_id"
              {...register('target_business_id', {
                required: 'Debe seleccionar un negocio',
              })}
              className={errors.target_business_id ? 'error' : ''}
              disabled={isCreatingRelationship}
            >
              <option value="">-- Seleccione un negocio --</option>
              {filteredBusinesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
            {errors.target_business_id && (
              <span className="error-message">
                {errors.target_business_id.message}
              </span>
            )}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="info-banner">
              <i className="icon">ℹ️</i>
              <p>
                No hay negocios disponibles para establecer relaciones. Ya tienes
                relaciones activas o pendientes con todos los negocios registrados.
              </p>
            </div>
          )}

          <div className="info-banner info">
            <i className="icon">💡</i>
            <div>
              <strong>Importante:</strong>
              <p>
                Al enviar esta solicitud, el negocio seleccionado deberá aceptarla
                para poder realizar traslados de inventario entre ambos negocios.
              </p>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isCreatingRelationship}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreatingRelationship || filteredBusinesses.length === 0}
            >
              {isCreatingRelationship ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRelationshipModal;
