/**
 * Selector Innovador de Ingredientes
 * Permite seleccionar ítems del inventario de forma visual e intuitiva
 * con cálculos en tiempo real del costo
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useInventory } from '../../hooks/inventory/useInventory';
import './IngredientsSelector.css';

const IngredientsSelector = ({ selectedIngredients, onChange, errors }) => {
  const { inventoryItems, isLoading } = useInventory(0, 100, true); // Solo items activos
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    if (!inventoryItems) return [];
    const cats = [...new Set(inventoryItems.map(item => item.category).filter(Boolean))];
    return cats.sort();
  }, [inventoryItems]);

  // Filtrar items según búsqueda y filtros
  const filteredItems = useMemo(() => {
    if (!inventoryItems) return [];

    let filtered = inventoryItems.filter(item => item.is_active);

    // Filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        (item.sku && item.sku.toLowerCase().includes(term))
      );
    }

    // Filtro de categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Mostrar solo seleccionados
    if (showOnlySelected) {
      const selectedIds = selectedIngredients.map(ing => ing.inventory_item_id);
      filtered = filtered.filter(item => selectedIds.includes(item.id));
    }

    return filtered;
  }, [inventoryItems, searchTerm, categoryFilter, showOnlySelected, selectedIngredients]);

  // Calcular costo total
  const totalCost = useMemo(() => {
    return selectedIngredients.reduce((sum, ing) => {
      const item = inventoryItems?.find(i => i.id === ing.inventory_item_id);
      if (!item) return sum;
      const cost = parseFloat(item.unit_price || 0) * parseFloat(ing.quantity || 0);
      return sum + cost;
    }, 0);
  }, [selectedIngredients, inventoryItems]);

  // Verificar si un item está seleccionado
  const isSelected = (itemId) => {
    return selectedIngredients.some(ing => ing.inventory_item_id === itemId);
  };

  // Obtener cantidad de un ingrediente
  const getQuantity = (itemId) => {
    const ing = selectedIngredients.find(i => i.inventory_item_id === itemId);
    return ing?.quantity || '';
  };

  // Manejar selección/deselección de item
  const handleToggleItem = (item) => {
    if (isSelected(item.id)) {
      // Deseleccionar
      const newIngredients = selectedIngredients.filter(
        ing => ing.inventory_item_id !== item.id
      );
      onChange(newIngredients);
    } else {
      // Seleccionar con cantidad por defecto
      const newIngredients = [
        ...selectedIngredients,
        { inventory_item_id: item.id, quantity: 1 }
      ];
      onChange(newIngredients);
    }
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (itemId, quantity) => {
    const numQuantity = parseFloat(quantity);

    if (quantity === '' || isNaN(numQuantity) || numQuantity <= 0) {
      // Si la cantidad es inválida, remover el ingrediente
      const newIngredients = selectedIngredients.filter(
        ing => ing.inventory_item_id !== itemId
      );
      onChange(newIngredients);
      return;
    }

    const newIngredients = selectedIngredients.map(ing =>
      ing.inventory_item_id === itemId
        ? { ...ing, quantity: numQuantity }
        : ing
    );
    onChange(newIngredients);
  };

  if (isLoading) {
    return (
      <div className="ingredients-selector-loading">
        <div className="spinner"></div>
        <p>Cargando ingredientes...</p>
      </div>
    );
  }

  return (
    <div className="ingredients-selector">
      {/* Header con búsqueda y filtros */}
      <div className="ingredients-selector-header">
        <div className="ingredients-search">
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ingredients-search-input"
          />
        </div>

        <div className="ingredients-filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="ingredients-category-filter"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            type="button"
            className={`filter-selected-btn ${showOnlySelected ? 'active' : ''}`}
            onClick={() => setShowOnlySelected(!showOnlySelected)}
          >
            {showOnlySelected ? '✓ Seleccionados' : 'Seleccionados'}
          </button>
        </div>
      </div>

      {/* Resumen de selección */}
      {selectedIngredients.length > 0 && (
        <div className="ingredients-summary">
          <div className="summary-item">
            <span className="summary-label">Ingredientes:</span>
            <span className="summary-value">{selectedIngredients.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Costo total:</span>
            <span className="summary-value total-cost">${totalCost.toFixed(2)}</span>
          </div>
        </div>
      )}

      {errors && <div className="ingredients-error">{errors}</div>}

      {/* Grid de items */}
      <div className="ingredients-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items-message">
            <p>No se encontraron ítems del inventario</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const selected = isSelected(item.id);
            const quantity = getQuantity(item.id);
            const itemCost = parseFloat(item.unit_price || 0) * parseFloat(quantity || 0);

            return (
              <div
                key={item.id}
                className={`ingredient-card ${selected ? 'selected' : ''}`}
                onClick={() => !selected && handleToggleItem(item)}
              >
                <div className="ingredient-card-header">
                  <h4 className="ingredient-name">{item.name}</h4>
                  {selected && (
                    <button
                      type="button"
                      className="remove-ingredient-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleItem(item);
                      }}
                      title="Remover ingrediente"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="ingredient-info">
                  <span className="ingredient-category">{item.category}</span>
                  <span className="ingredient-unit">{item.unit_of_measure}</span>
                </div>

                <div className="ingredient-price">
                  <span className="price-label">Precio unitario:</span>
                  <span className="price-value">${parseFloat(item.unit_price || 0).toFixed(2)}</span>
                </div>

                {selected && (
                  <div className="ingredient-quantity-input">
                    <label>Cantidad a usar:</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={quantity}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="0.00"
                      className="quantity-input"
                    />
                    <span className="quantity-unit">{item.unit_of_measure}</span>
                  </div>
                )}

                {selected && quantity && (
                  <div className="ingredient-cost">
                    <span className="cost-label">Costo:</span>
                    <span className="cost-value">${itemCost.toFixed(2)}</span>
                  </div>
                )}

                {!selected && (
                  <div className="ingredient-stock">
                    <span>Stock: {parseFloat(item.quantity_in_stock || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {selectedIngredients.length === 0 && (
        <div className="no-selection-message">
          <p>👆 Selecciona los ingredientes haciendo clic en las tarjetas</p>
        </div>
      )}
    </div>
  );
};

export default IngredientsSelector;
