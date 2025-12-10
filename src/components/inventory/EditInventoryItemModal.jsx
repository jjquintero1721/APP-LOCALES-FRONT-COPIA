import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useInventory } from '../../hooks/inventory/useInventory';
import { useSuppliers } from '../../hooks/suppliers/useSuppliers';
import './InventoryModals.css';

const EditInventoryItemModal = ({ isOpen, onClose, item }) => {
  const { updateInventoryItemMutation } = useInventory();
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers(0, 100, true); // Solo activos (máximo 100 por límite del backend)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const minStock = watch('min_stock');

  useEffect(() => {
    if (item) {
      reset({
        name: item.name || '',
        category: item.category || '',
        unit_of_measure: item.unit_of_measure || '',
        sku: item.sku || '',
        min_stock: item.min_stock || '',
        max_stock: item.max_stock || '',
        unit_price: item.unit_price || '',
        supplier_id: item.supplier_id || '',
        tax_percentage: item.tax_percentage || 0,
        include_tax: item.include_tax || false,
        is_active: item.is_active !== undefined ? item.is_active : true,
      });
    }
  }, [item, reset]);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        min_stock: data.min_stock ? parseFloat(data.min_stock) : null,
        max_stock: data.max_stock ? parseFloat(data.max_stock) : null,
        unit_price: parseFloat(data.unit_price),
        supplier_id: data.supplier_id || null,
        tax_percentage: parseFloat(data.tax_percentage) || 0,
        sku: data.sku || null,
      };

      await updateInventoryItemMutation.mutateAsync({
        itemId: item.id,
        itemData: formattedData,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Ítem de Inventario</h2>
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
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Nombre del Ítem <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    minLength: {
                      value: 3,
                      message: 'Mínimo 3 caracteres',
                    },
                  })}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && (
                  <span className="error-message">{errors.name.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Categoría <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="category"
                  placeholder="Ej: Bebidas, Carnes, Verduras, etc."
                  {...register('category', {
                    required: 'La categoría es obligatoria',
                    minLength: {
                      value: 2,
                      message: 'Mínimo 2 caracteres',
                    },
                  })}
                  className={errors.category ? 'input-error' : ''}
                />
                {errors.category && (
                  <span className="error-message">{errors.category.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unit_of_measure">
                  Unidad de Medida <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="unit_of_measure"
                  placeholder="kg, L, unidad, caja, etc."
                  {...register('unit_of_measure', {
                    required: 'La unidad de medida es obligatoria',
                  })}
                  className={errors.unit_of_measure ? 'input-error' : ''}
                />
                {errors.unit_of_measure && (
                  <span className="error-message">
                    {errors.unit_of_measure.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU</label>
                <input
                  type="text"
                  id="sku"
                  placeholder="Código único (opcional)"
                  {...register('sku')}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unit_price">
                  Precio Unitario <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="unit_price"
                  step="0.01"
                  placeholder="0.00"
                  {...register('unit_price', {
                    required: 'El precio es obligatorio',
                    min: {
                      value: 0,
                      message: 'El precio no puede ser negativo',
                    },
                  })}
                  className={errors.unit_price ? 'input-error' : ''}
                />
                {errors.unit_price && (
                  <span className="error-message">
                    {errors.unit_price.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="is_active">
                  Estado <span className="required">*</span>
                </label>
                <select
                  id="is_active"
                  {...register('is_active', {
                    required: 'El estado es obligatorio',
                  })}
                  className={errors.is_active ? 'input-error' : ''}
                >
                  <option value={true}>Activo</option>
                  <option value={false}>Inactivo</option>
                </select>
                {errors.is_active && (
                  <span className="error-message">
                    {errors.is_active.message}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="min_stock">Stock Mínimo</label>
                <input
                  type="number"
                  id="min_stock"
                  step="0.01"
                  placeholder="Alerta de stock bajo"
                  {...register('min_stock', {
                    min: {
                      value: 0,
                      message: 'No puede ser negativo',
                    },
                  })}
                  className={errors.min_stock ? 'input-error' : ''}
                />
                {errors.min_stock && (
                  <span className="error-message">
                    {errors.min_stock.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="max_stock">Stock Máximo</label>
                <input
                  type="number"
                  id="max_stock"
                  step="0.01"
                  placeholder="Capacidad máxima"
                  {...register('max_stock', {
                    min: {
                      value: 0,
                      message: 'No puede ser negativo',
                    },
                    validate: (value) => {
                      if (!value || !minStock) return true;
                      return (
                        parseFloat(value) >= parseFloat(minStock) ||
                        'Debe ser mayor o igual al mínimo'
                      );
                    },
                  })}
                  className={errors.max_stock ? 'input-error' : ''}
                />
                {errors.max_stock && (
                  <span className="error-message">
                    {errors.max_stock.message}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="supplier_id">Proveedor</label>
                <select id="supplier_id" {...register('supplier_id')} disabled={isLoadingSuppliers}>
                  <option value="">
                    {isLoadingSuppliers
                      ? 'Cargando proveedores...'
                      : suppliers && suppliers.length > 0
                      ? 'Sin proveedor asignado'
                      : 'No hay proveedores registrados'}
                  </option>
                  {suppliers?.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {!isLoadingSuppliers && (!suppliers || suppliers.length === 0) && (
                  <small className="form-hint">
                    Puedes crear proveedores en la sección de Proveedores
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tax_percentage">Porcentaje de Impuesto (%)</label>
                <input
                  type="number"
                  id="tax_percentage"
                  step="0.01"
                  placeholder="0"
                  {...register('tax_percentage', {
                    min: {
                      value: 0,
                      message: 'No puede ser negativo',
                    },
                    max: {
                      value: 100,
                      message: 'No puede ser mayor a 100%',
                    },
                  })}
                  className={errors.tax_percentage ? 'input-error' : ''}
                />
                {errors.tax_percentage && (
                  <span className="error-message">
                    {errors.tax_percentage.message}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" {...register('include_tax')} />
                  <span>Incluir impuesto en el precio unitario</span>
                </label>
                <small className="form-hint">
                  Si está marcado, el precio unitario ya incluye el impuesto
                </small>
              </div>
            </div>

            <div className="info-box">
              <div className="info-row">
                <span className="info-label">Stock Actual:</span>
                <span className="info-value">
                  <strong>
                    {item.quantity_in_stock} {item.unit_of_measure}
                  </strong>
                </span>
              </div>
              <small className="form-hint">
                Para modificar el stock, usa el botón "Ajustar Stock"
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={updateInventoryItemMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateInventoryItemMutation.isPending}
            >
              {updateInventoryItemMutation.isPending ? (
                <>
                  <span className="spinner-small"></span>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInventoryItemModal;
