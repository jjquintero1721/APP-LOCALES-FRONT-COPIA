import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './SupplierModals.css';

const EditSupplierModal = ({ isOpen, onClose, onUpdateSupplier, isUpdating, supplier }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name || '',
        supplier_type: supplier.supplier_type || '',
        tax_id: supplier.tax_id || '',
        legal_representative: supplier.legal_representative || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        is_active: supplier.is_active ? 'true' : 'false',
      });
    }
  }, [supplier, reset]);

  const onSubmit = (data) => {
    const supplierData = {
      name: data.name,
      supplier_type: data.supplier_type || null,
      tax_id: data.tax_id || null,
      legal_representative: data.legal_representative || null,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      is_active: data.is_active === 'true',
    };

    onUpdateSupplier({ supplierId: supplier.id, supplierData });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !supplier) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Proveedor</h2>
          <button className="modal-close" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">
                Nombre del Proveedor / Empresa <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: 'El nombre del proveedor es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres',
                  },
                })}
                className={errors.name ? 'input-error' : ''}
                placeholder="Ej: Distribuidora ABC"
              />
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="supplier_type">
                Tipo de Proveedor
              </label>
              <input
                id="supplier_type"
                type="text"
                {...register('supplier_type')}
                placeholder="Ej: Alimentos, Bebidas, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="tax_id">
                NIT / Identificación Tributaria
              </label>
              <input
                id="tax_id"
                type="text"
                {...register('tax_id')}
                placeholder="Ej: 123456789-0"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="legal_representative">
                Representante Legal o Contacto Principal
              </label>
              <input
                id="legal_representative"
                type="text"
                {...register('legal_representative')}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: 'Formato de teléfono inválido',
                  },
                })}
                className={errors.phone ? 'input-error' : ''}
                placeholder="Ej: +57 300 123 4567"
              />
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido',
                  },
                })}
                className={errors.email ? 'input-error' : ''}
                placeholder="Ej: contacto@proveedor.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">
                Dirección
              </label>
              <textarea
                id="address"
                {...register('address')}
                placeholder="Ej: Calle 123 #45-67, Bogotá"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="is_active">
                Estado <span className="required">*</span>
              </label>
              <select
                id="is_active"
                {...register('is_active', {
                  required: 'El estado es requerido',
                })}
                className={errors.is_active ? 'input-error' : ''}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
              {errors.is_active && (
                <span className="error-message">{errors.is_active.message}</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
