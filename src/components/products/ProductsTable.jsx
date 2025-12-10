/**
 * Tabla de Productos/Recetas
 * Muestra todos los productos con sus detalles y acciones
 */
import React, { useMemo } from 'react';
import  useAuthStore  from '../../store/authStore';
import './ProductsTable.css';

const ProductsTable = ({
  products,
  onView,
  onEdit,
  onToggleActive,
  searchTerm = '',
  showInactive = false
}) => {
  const { user } = useAuthStore();

  // Permisos basados en rol
  const canManage = user?.role === 'owner' || user?.role === 'admin' || user?.role === 'cook';

  // Calcular ganancia para cada producto usando los datos del backend
  const productsWithCosts = useMemo(() => {
    if (!products) return [];

    return products.map(product => {
      // El backend ya envía total_cost calculado
      const totalCost = parseFloat(product.total_cost || 0);
      const salePrice = parseFloat(product.sale_price || 0);
      const profit = salePrice - totalCost;

      return {
        ...product,
        totalCost,
        profit
      };
    });
  }, [products]);

  // Filtrar productos según criterios
  const filteredProducts = useMemo(() => {
    let filtered = productsWithCosts;

    // Filtrar por estado activo/inactivo
    if (!showInactive) {
      filtered = filtered.filter(p => p.is_active);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.category && p.category.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [productsWithCosts, searchTerm, showInactive]);

  if (!products) {
    return (
      <div className="products-table-loading">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="products-table-empty">
        <p>
          {searchTerm
            ? `No se encontraron productos que coincidan con "${searchTerm}"`
            : 'No hay productos registrados'}
        </p>
      </div>
    );
  }

  return (
    <div className="products-table-container">
      <div className="products-table-scroll">
        <table className="products-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th className="text-right">Costo</th>
              <th className="text-right">Precio Venta</th>
              <th className="text-right">Ganancia</th>
              <th>Ingredientes</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={!product.is_active ? 'inactive-row' : ''}
              >
                <td>
                  <div className="product-name-cell">
                    <span className="product-name">{product.name}</span>
                    {product.profit < 0 && (
                      <span className="loss-badge" title="Este producto genera pérdidas">
                        ⚠️ PÉRDIDA
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  {product.category ? (
                    <span className="category-tag">{product.category}</span>
                  ) : (
                    <span className="no-data">-</span>
                  )}
                </td>
                <td className="text-right">
                  <span className="cost-value">${product.totalCost.toFixed(2)}</span>
                </td>
                <td className="text-right">
                  <span className="price-value">${parseFloat(product.sale_price).toFixed(2)}</span>
                </td>
                <td className="text-right">
                  <span className={`profit-value ${product.profit >= 0 ? 'positive' : 'negative'}`}>
                    ${product.profit.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span className="ingredients-count">
                    {product.ingredients_count || 0} {product.ingredients_count === 1 ? 'ítem' : 'ítems'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                    {product.is_active ? '✓ Activo' : '✗ Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      onClick={() => onView(product)}
                      className="action-btn view-btn"
                      title="Ver detalles"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>

                    {canManage && (
                      <>
                        <button
                          onClick={() => onEdit(product)}
                          className="action-btn edit-btn"
                          title="Editar producto"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>

                        <button
                          onClick={() => onToggleActive(product)}
                          className={`action-btn ${product.is_active ? 'deactivate-btn' : 'activate-btn'}`}
                          title={product.is_active ? 'Desactivar producto' : 'Activar producto'}
                        >
                          {product.is_active ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p className="table-info">
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>
      </div>
    </div>
  );
};

export default ProductsTable;
