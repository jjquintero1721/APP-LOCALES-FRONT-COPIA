/**
 * Modal de solo lectura para ver detalles completos de un Producto/Receta
 * Muestra información básica, ingredientes, costos y auditoría
 */
import React, { useMemo } from 'react';
import { useInventory } from '../../hooks/inventory/useInventory';
import { useProduct } from '../../hooks/products/useProducts';
import './ProductModals.css';

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const { inventoryItems } = useInventory(0, 100, false); // Incluir inactivos para referencia

  // Cargar el producto completo con ingredientes
  const { product: fullProduct, isLoading } = useProduct(product?.id, isOpen && !!product?.id);

  // Usar el producto completo si está disponible, sino usar el producto de la lista
  const productData = fullProduct || product;

  // Calcular costo total de ingredientes
  const totalCost = useMemo(() => {
    if (!productData?.ingredients || !inventoryItems) return 0;
    return productData.ingredients.reduce((sum, ing) => {
      const item = inventoryItems.find(i => i.id === ing.inventory_item_id);
      if (!item) return sum;
      const cost = parseFloat(item.unit_price || 0) * parseFloat(ing.quantity || 0);
      return sum + cost;
    }, 0);
  }, [productData, inventoryItems]);

  // Calcular ganancia
  const profitAmount = useMemo(() => {
    if (!productData?.sale_price) return 0;
    return parseFloat(productData.sale_price) - totalCost;
  }, [productData, totalCost]);

  // Formatear ingredientes con detalles
  const ingredientsWithDetails = useMemo(() => {
    if (!productData?.ingredients || !inventoryItems) return [];
    return productData.ingredients.map(ing => {
      const item = inventoryItems.find(i => i.id === ing.inventory_item_id);
      const unitCost = parseFloat(item?.unit_price || 0);
      const totalCost = unitCost * parseFloat(ing.quantity || 0);
      return {
        ...ing,
        itemName: item?.name || 'Ítem no encontrado',
        itemSku: item?.sku || '-',
        unitOfMeasure: item?.unit_of_measure || '-',
        unitPrice: unitCost,
        totalCost: totalCost,
        isActive: item?.is_active || false
      };
    });
  }, [productData, inventoryItems]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Detalles del Producto</h2>
            <div className="product-status-badges">
              <span className={`status-badge ${productData.is_active ? 'active' : 'inactive'}`}>
                {productData.is_active ? '✓ Activo' : '✗ Inactivo'}
              </span>
              {productData.category && (
                <span className="category-badge">{productData.category}</span>
              )}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Loading state */}
          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando detalles del producto...</p>
            </div>
          )}

          {/* Contenido del modal */}
          {!isLoading && (
            <>
              {/* Imagen del producto */}
              {productData.image_url && (
                <div className="product-image-preview">
                  <img src={productData.image_url} alt={productData.name} />
                </div>
              )}

              {/* Información básica */}
              <div className="details-section">
                <h3 className="section-title">Información Básica</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nombre:</span>
                    <span className="detail-value">{productData.name}</span>
                  </div>
                  {productData.category && (
                    <div className="detail-item">
                      <span className="detail-label">Categoría:</span>
                      <span className="detail-value">{productData.category}</span>
                    </div>
                  )}
                  {productData.description && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Descripción:</span>
                      <span className="detail-value">{productData.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredientes */}
              <div className="details-section">
                <h3 className="section-title">
                  Ingredientes ({ingredientsWithDetails.length})
                </h3>
                {ingredientsWithDetails.length > 0 ? (
                  <div className="ingredients-details-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Ítem</th>
                          <th>SKU</th>
                          <th className="text-right">Cantidad</th>
                          <th className="text-right">Precio Unit.</th>
                          <th className="text-right">Costo Total</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ingredientsWithDetails.map((ing, index) => (
                          <tr key={index} className={!ing.isActive ? 'inactive-ingredient' : ''}>
                            <td>{ing.itemName}</td>
                            <td className="text-muted">{ing.itemSku}</td>
                            <td className="text-right">
                              {parseFloat(ing.quantity).toFixed(2)} {ing.unitOfMeasure}
                            </td>
                            <td className="text-right">${ing.unitPrice.toFixed(2)}</td>
                            <td className="text-right font-weight-bold">
                              ${ing.totalCost.toFixed(2)}
                            </td>
                            <td>
                              {ing.isActive ? (
                                <span className="status-dot active"></span>
                              ) : (
                                <span className="status-dot inactive" title="Ítem inactivo"></span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="empty-state">No hay ingredientes asociados</p>
                )}
              </div>

              {/* Precios y ganancias */}
              <div className="details-section">
                <h3 className="section-title">Precios y Ganancias</h3>
                <div className="pricing-summary">
                  <div className="pricing-row">
                    <span className="pricing-label">Costo total de ingredientes:</span>
                    <span className="pricing-value cost">${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="pricing-row">
                    <span className="pricing-label">Precio de venta:</span>
                    <span className="pricing-value sale-price">${parseFloat(productData.sale_price).toFixed(2)}</span>
                  </div>
                  <div className="pricing-row highlight">
                    <span className="pricing-label">Ganancia por unidad:</span>
                    <span className={`pricing-value profit ${profitAmount < 0 ? 'negative' : 'positive'}`}>
                      ${profitAmount.toFixed(2)}
                      {profitAmount < 0 && ' (PÉRDIDA)'}
                    </span>
                  </div>
                  {productData.profit_margin_percentage && (
                    <div className="pricing-row">
                      <span className="pricing-label">Margen de ganancia:</span>
                      <span className="pricing-value">{parseFloat(productData.profit_margin_percentage).toFixed(2)}%</span>
                    </div>
                  )}
                </div>

                {profitAmount < 0 && (
                  <div className="warning-message">
                    ⚠️ Este producto está generando pérdidas. El precio de venta es menor al costo total de ingredientes.
                  </div>
                )}
              </div>

              {/* Auditoría */}
              <div className="details-section">
                <h3 className="section-title">Información de Auditoría</h3>
                <div className="audit-grid">
                  {productData.created_by_name && (
                    <div className="audit-item">
                      <span className="audit-label">Creado por:</span>
                      <span className="audit-value">{productData.created_by_name}</span>
                    </div>
                  )}
                  {productData.created_at && (
                    <div className="audit-item">
                      <span className="audit-label">Fecha de creación:</span>
                      <span className="audit-value">{formatDate(productData.created_at)}</span>
                    </div>
                  )}
                  {productData.updated_by_name && (
                    <div className="audit-item">
                      <span className="audit-label">Última modificación por:</span>
                      <span className="audit-value">{productData.updated_by_name}</span>
                    </div>
                  )}
                  {productData.updated_at && (
                    <div className="audit-item">
                      <span className="audit-label">Última actualización:</span>
                      <span className="audit-value">{formatDate(productData.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
