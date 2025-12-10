import { useState, useEffect } from 'react';
import { useSuppliers } from '../../hooks/suppliers/useSuppliers';
import './InventoryFilters.css';

const InventoryFilters = ({ onFilterChange, showInactive, onShowInactiveChange }) => {
  const { suppliers } = useSuppliers(0, 1000, true); // Solo activos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    onFilterChange({
      searchTerm,
      category: selectedCategory,
      supplier_id: selectedSupplier,
    });
  }, [searchTerm, selectedCategory, selectedSupplier, onFilterChange]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSupplier('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedSupplier;

  return (
    <div className="inventory-filters">
      <div className="filters-row">
        <div className="filter-group search-group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="search-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              title="Limpiar búsqueda"
            >
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
          )}
        </div>

        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Carnes">Carnes</option>
            <option value="Verduras">Verduras</option>
            <option value="Lácteos">Lácteos</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Insumos">Insumos</option>
            <option value="Tecnología">Tecnología</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los proveedores</option>
            {suppliers?.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            className="btn btn-secondary clear-filters-btn"
            onClick={handleClearFilters}
            title="Limpiar filtros"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Limpiar
          </button>
        )}
      </div>

      <div className="filters-row">
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => onShowInactiveChange(e.target.checked)}
            className="filter-checkbox"
          />
          <span>Mostrar ítems inactivos</span>
        </label>
      </div>
    </div>
  );
};

export default InventoryFilters;
