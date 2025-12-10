import { useState } from 'react';
import  useAuthStore  from '../../store/authStore';
import { useInventory } from '../../hooks/inventory/useInventory';
import InventorySummary from '../../components/inventory/InventorySummary';
import InventoryFilters from '../../components/inventory/InventoryFilters';
import LowStockAlert from '../../components/inventory/LowStockAlert';
import InventoryTable from '../../components/inventory/InventoryTable';
import CreateInventoryItemModal from '../../components/inventory/CreateInventoryItemModal';
import EditInventoryItemModal from '../../components/inventory/EditInventoryItemModal';
import InventoryDetailsModal from '../../components/inventory/InventoryDetailsModal';
import AdjustStockModal from '../../components/inventory/AdjustStockModal';
import MovementHistoryModal from '../../components/inventory/MovementHistoryModal';
import ConfirmModal from '../../components/shared/ConfirmModal';
import './InventoryPage.css';

const InventoryPage = () => {
  const { user } = useAuthStore();
  const {
    inventoryItems,
    lowStockAlerts,
    isLoading,
    error,
    deactivateInventoryItemMutation,
    updateInventoryItemMutation,
    isDeactivating,
    isUpdating,
  } = useInventory();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDeactivateConfirmOpen, setIsDeactivateConfirmOpen] = useState(false);

  // Selected item state
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    supplier_id: '',
  });
  const [showInactive, setShowInactive] = useState(false);

  // Permissions
  const canManage = ['owner', 'admin'].includes(user?.role);

  // Handlers
  const handleViewItem = (item) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleAdjustStock = (item) => {
    setSelectedItem(item);
    setIsAdjustModalOpen(true);
  };

  const handleViewHistory = (item) => {
    setSelectedItem(item);
    setIsHistoryModalOpen(true);
  };

  const handleToggleStatus = (item) => {
    setSelectedItem(item);
    setIsDeactivateConfirmOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (selectedItem) {
      try {
        if (selectedItem.is_active) {
          // Deactivate active item
          await deactivateInventoryItemMutation.mutateAsync(selectedItem.id);
        } else {
          // Activate inactive item using update
          await updateInventoryItemMutation.mutateAsync({
            itemId: selectedItem.id,
            itemData: { is_active: true },
          });
        }
        setIsDeactivateConfirmOpen(false);
        setSelectedItem(null);
      } catch (error) {
        console.error('Error toggling item status:', error);
      }
    }
  };

  const handleCancelToggleStatus = () => {
    setIsDeactivateConfirmOpen(false);
    setSelectedItem(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Inventario</h1>
          <p className="page-description">
            Administra tus ítems de inventario, controla stock y monitorea alertas
          </p>
        </div>
        {canManage && (
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Ítem
          </button>
        )}
      </div>

      <InventorySummary
        inventoryItems={inventoryItems}
        lowStockAlerts={lowStockAlerts}
        isLoading={isLoading}
      />

      <InventoryFilters
        onFilterChange={handleFilterChange}
        showInactive={showInactive}
        onShowInactiveChange={setShowInactive}
      />

      {lowStockAlerts && lowStockAlerts.length > 0 && (
        <LowStockAlert alerts={lowStockAlerts} onViewItem={handleViewItem} />
      )}

      <InventoryTable
        items={inventoryItems}
        isLoading={isLoading}
        error={error}
        searchTerm={filters.searchTerm}
        onViewDetails={handleViewItem}
        onEdit={handleEditItem}
        onAdjustStock={handleAdjustStock}
        onViewHistory={handleViewHistory}
        onDeactivate={handleToggleStatus}
        onActivate={handleToggleStatus}
      />

      {/* Modals */}
      <CreateInventoryItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditInventoryItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      <InventoryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => {
          setIsAdjustModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      <MovementHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      <ConfirmModal
        isOpen={isDeactivateConfirmOpen}
        title={
          selectedItem?.is_active ? 'Desactivar Ítem' : 'Activar Ítem'
        }
        message={
          selectedItem?.is_active
            ? `¿Estás seguro de que deseas desactivar "${selectedItem?.name}"? El ítem no estará disponible para nuevos movimientos.`
            : `¿Estás seguro de que deseas activar "${selectedItem?.name}"? El ítem estará disponible nuevamente.`
        }
        confirmText={selectedItem?.is_active ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        confirmType={selectedItem?.is_active ? 'danger' : 'primary'}
        onConfirm={handleConfirmToggleStatus}
        onCancel={handleCancelToggleStatus}
        isLoading={isDeactivating || isUpdating}
      />
    </div>
  );
};

export default InventoryPage;
