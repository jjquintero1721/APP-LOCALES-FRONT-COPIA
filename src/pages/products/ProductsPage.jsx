/**
 * Página principal de Productos/Recetas
 * Integra tabla, modales y filtros
 */
import React, { useState } from 'react';
import { useProducts } from '../../hooks/products/useProducts';
import  useAuthStore  from '../../store/authStore';
import ProductsTable from '../../components/products/ProductsTable';
import CreateProductModal from '../../components/products/CreateProductModal';
import EditProductModal from '../../components/products/EditProductModal';
import ProductDetailsModal from '../../components/products/ProductDetailsModal';
import ConfirmModal from '../../components/shared/ConfirmModal';
import './ProductsPage.css';

const ProductsPage = () => {
  const { user } = useAuthStore();
  const {
    products,
    isLoading,
    activateProductMutation,
    deactivateProductMutation,
    isActivating,
    isDeactivating
  } = useProducts();

  // Estados de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Permisos
  const canManage = user?.role === 'owner' || user?.role === 'admin' || user?.role === 'cook';

  // Handlers
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleToggleActive = (product) => {
    setSelectedProduct(product);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmToggleActive = async () => {
    if (selectedProduct) {
      try {
        if (selectedProduct.is_active) {
          // Deactivate active product
          await deactivateProductMutation.mutateAsync(selectedProduct.id);
        } else {
          // Activate inactive product
          await activateProductMutation.mutateAsync(selectedProduct.id);
        }
        setIsConfirmModalOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error toggling product status:', error);
      }
    }
  };

  const handleCancelToggleActive = () => {
    setIsConfirmModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="header-content">
          <h1 className="page-title">Productos y Recetas</h1>
          <p className="page-subtitle">
            Gestiona los productos y recetas de tu negocio con sus ingredientes
          </p>
        </div>
        {canManage && (
          <button onClick={handleCreateClick} className="btn-create-product">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Crear Producto
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="products-filters">
        <div className="filter-group">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            <span>Mostrar productos inactivos</span>
          </label>
        </div>
      </div>

      {/* Tabla de productos */}
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <ProductsTable
          products={products}
          onView={handleView}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
          searchTerm={searchTerm}
          showInactive={showInactive}
        />
      )}

      {/* Modales */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      {/* Confirmación para activar/desactivar */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={selectedProduct?.is_active ? 'Desactivar Producto' : 'Activar Producto'}
        message={
          selectedProduct?.is_active
            ? `¿Estás seguro de que deseas desactivar el producto "${selectedProduct?.name}"? No estará disponible para la venta.`
            : `¿Estás seguro de que deseas activar el producto "${selectedProduct?.name}"?`
        }
        confirmText={selectedProduct?.is_active ? 'Desactivar' : 'Activar'}
        confirmType={selectedProduct?.is_active ? 'warning' : 'primary'}
        onConfirm={handleConfirmToggleActive}
        onCancel={handleCancelToggleActive}
        isLoading={isActivating || isDeactivating}
      />
    </div>
  );
};

export default ProductsPage;
