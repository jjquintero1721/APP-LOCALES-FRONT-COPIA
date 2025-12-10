/**
 * Modal para crear un nuevo Producto/Receta
 * Incluye el selector innovador de ingredientes
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useProducts } from '../../hooks/products/useProducts';
import IngredientsSelector from './IngredientsSelector';
import { useInventory } from '../../hooks/inventory/useInventory';
import './ProductModals.css';

const CreateProductModal = ({ isOpen, onClose }) => {
  const { createProduct, isCreating } = useProducts();
  const { inventoryItems } = useInventory(0, 100, true);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientsError, setIngredientsError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      sale_price: '',
      profit_margin_percentage: '',
      image_url: ''
    }
  });

  const salePrice = watch('sale_price');
  const profitMargin = watch('profit_margin_percentage');

  // Calcular costo total de ingredientes
  const totalCost = useMemo(() => {
    if (!inventoryItems) return 0;
    return selectedIngredients.reduce((sum, ing) => {
      const item = inventoryItems.find(i => i.id === ing.inventory_item_id);
      if (!item) return sum;
      const cost = parseFloat(item.unit_price || 0) * parseFloat(ing.quantity || 0);
      return sum + cost;
    }, 0);
  }, [selectedIngredients, inventoryItems]);

  // Calcular precio sugerido según margen
  const suggestedPrice = useMemo(() => {
    if (!profitMargin || profitMargin <= 0) return null;
    const margin = parseFloat(profitMargin);
    return totalCost * (1 + margin / 100);
  }, [totalCost, profitMargin]);

  // Calcular ganancia en dinero
  const profitAmount = useMemo(() => {
    if (!salePrice) return 0;
    return parseFloat(salePrice) - totalCost;
  }, [salePrice, totalCost]);

  // Resetear form cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedIngredients([]);
      setIngredientsError('');
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    // Validar que haya ingredientes seleccionados
    if (selectedIngredients.length === 0) {
      setIngredientsError('Debe seleccionar al menos un ingrediente');
      return;
    }

    // Validar que todos los ingredientes tengan cantidad
    const invalidIngredients = selectedIngredients.filter(
      ing => !ing.quantity || parseFloat(ing.quantity) <= 0
    );

    if (invalidIngredients.length > 0) {
      setIngredientsError('Todos los ingredientes deben tener una cantidad válida (mayor a 0)');
      return;
    }

    // Validar que el precio de venta sea >= costo total
    if (parseFloat(data.sale_price) < totalCost) {
      setIngredientsError(
        `El precio de venta ($${parseFloat(data.sale_price).toFixed(2)}) debe ser mayor o igual al costo total ($${totalCost.toFixed(2)})`
      );
      return;
    }

    setIngredientsError('');

    const productData = {
      name: data.name,
      description: data.description || null,
      category: data.category || null,
      sale_price: parseFloat(data.sale_price),
      profit_margin_percentage: data.profit_margin_percentage
        ? parseFloat(data.profit_margin_percentage)
        : null,
      image_url: data.image_url || null,
      ingredients: selectedIngredients.map(ing => ({
        inventory_item_id: ing.inventory_item_id,
        quantity: parseFloat(ing.quantity)
      }))
    };

    createProduct(productData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Nuevo Producto/Receta</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="modal-body">
            {/* Información básica */}
            <div className="form-section">
              <h3 className="section-title">Información Básica</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Nombre del producto <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', {
                      required: 'El nombre es requerido',
                      minLength: {
                        value: 1,
                        message: 'El nombre debe tener al menos 1 caracter'
                      }
                    })}
                    placeholder="Ej: Hamburguesa clásica"
                  />
                  {errors.name && <span className="error-message">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category">Categoría</label>
                  <input
                    id="category"
                    type="text"
                    {...register('category')}
                    placeholder="Ej: Comida rápida, Bebidas, Postres..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows="3"
                  placeholder="Descripción del producto..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_url">URL de la imagen</label>
                <input
                  id="image_url"
                  type="url"
                  {...register('image_url')}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            {/* Selector de ingredientes */}
            <div className="form-section">
              <h3 className="section-title">
                Ingredientes <span className="required">*</span>
              </h3>
              <IngredientsSelector
                selectedIngredients={selectedIngredients}
                onChange={setSelectedIngredients}
                errors={ingredientsError}
              />
            </div>

            {/* Precios y ganancias */}
            <div className="form-section">
              <h3 className="section-title">Precios y Ganancias</h3>

              {/* Resumen de costos */}
              <div className="cost-summary">
                <div className="cost-item">
                  <span className="cost-label">Costo total de ingredientes:</span>
                  <span className="cost-value">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="profit_margin_percentage">
                    Margen de ganancia (%)
                  </label>
                  <input
                    id="profit_margin_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('profit_margin_percentage', {
                      min: { value: 0, message: 'El margen debe ser mayor o igual a 0' },
                      max: { value: 100, message: 'El margen debe ser menor o igual a 100' }
                    })}
                    placeholder="Ej: 50"
                  />
                  {errors.profit_margin_percentage && (
                    <span className="error-message">{errors.profit_margin_percentage.message}</span>
                  )}
                  {suggestedPrice && (
                    <span className="help-text">
                      Precio sugerido: ${suggestedPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="sale_price">
                    Precio de venta <span className="required">*</span>
                  </label>
                  <input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('sale_price', {
                      required: 'El precio de venta es requerido',
                      min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
                    })}
                    placeholder="0.00"
                  />
                  {errors.sale_price && (
                    <span className="error-message">{errors.sale_price.message}</span>
                  )}
                  {salePrice && totalCost > 0 && (
                    <span className={`help-text ${profitAmount >= 0 ? 'success' : 'error'}`}>
                      Ganancia: ${profitAmount.toFixed(2)}
                      {profitAmount < 0 && ' (¡PÉRDIDA!)'}
                    </span>
                  )}
                </div>
              </div>

              {salePrice && totalCost > 0 && parseFloat(salePrice) < totalCost && (
                <div className="warning-message">
                  ⚠️ El precio de venta es menor al costo total. Esto generará pérdidas.
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isCreating}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
