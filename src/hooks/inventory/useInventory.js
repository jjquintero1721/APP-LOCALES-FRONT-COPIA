import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import inventoryService from '../../services/inventory/inventoryService';
import { toast } from 'react-toastify';

export const useInventory = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get all inventory items with filters
  const {
    data: inventoryItems,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['inventory-items', filters],
    queryFn: () => inventoryService.getInventoryItems(filters),
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar ítems de inventario';
      toast.error(errorMessage);
    },
  });

  // Get low stock alerts
  const {
    data: lowStockAlerts,
    isLoading: isLoadingAlerts,
  } = useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: inventoryService.getLowStockAlerts,
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar alertas de stock';
      toast.error(errorMessage);
    },
  });

  // Create inventory item mutation
  const createInventoryItemMutation = useMutation({
    mutationFn: inventoryService.createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
      toast.success('Ítem de inventario creado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al crear ítem de inventario';
      toast.error(errorMessage);
    },
  });

  // Update inventory item mutation
  const updateInventoryItemMutation = useMutation({
    mutationFn: ({ itemId, itemData }) =>
      inventoryService.updateInventoryItem(itemId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
      toast.success('Ítem de inventario actualizado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al actualizar ítem de inventario';
      toast.error(errorMessage);
    },
  });

  // Adjust stock mutation
  const adjustStockMutation = useMutation({
    mutationFn: ({ itemId, adjustmentData }) =>
      inventoryService.adjustStock(itemId, adjustmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      toast.success('Stock ajustado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al ajustar stock';
      toast.error(errorMessage);
    },
  });

  // Deactivate inventory item mutation
  const deactivateInventoryItemMutation = useMutation({
    mutationFn: inventoryService.deactivateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast.success('Ítem de inventario desactivado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al desactivar ítem de inventario';
      toast.error(errorMessage);
    },
  });

  return {
    inventoryItems,
    isLoading,
    error,
    refetch,
    lowStockAlerts,
    isLoadingAlerts,
    // Mutations objects (for components using mutateAsync)
    createInventoryItemMutation,
    updateInventoryItemMutation,
    adjustStockMutation,
    deactivateInventoryItemMutation,
    // Shorthand functions (for components using direct call)
    createInventoryItem: createInventoryItemMutation.mutate,
    updateInventoryItem: updateInventoryItemMutation.mutate,
    adjustStock: adjustStockMutation.mutate,
    deactivateInventoryItem: deactivateInventoryItemMutation.mutate,
    // Loading states
    isCreating: createInventoryItemMutation.isPending,
    isUpdating: updateInventoryItemMutation.isPending,
    isAdjusting: adjustStockMutation.isPending,
    isDeactivating: deactivateInventoryItemMutation.isPending,
  };
};

export const useInventoryItem = (itemId) => {
  const {
    data: inventoryItem,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['inventory-item', itemId],
    queryFn: () => inventoryService.getInventoryItemById(itemId),
    enabled: !!itemId,
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar ítem de inventario';
      toast.error(errorMessage);
    },
  });

  return { inventoryItem, isLoading, error };
};
