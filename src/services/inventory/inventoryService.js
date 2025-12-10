import axiosClient from '../../utils/axiosClient';

const inventoryService = {
  // Obtener todos los ítems de inventario con filtros
  getInventoryItems: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.supplier_id) params.append('supplier_id', filters.supplier_id.toString());
    if (filters.active_only !== undefined) params.append('active_only', filters.active_only.toString());

    const response = await axiosClient.get(`/inventory/items?${params.toString()}`);
    return response.data;
  },

  // Obtener alertas de stock bajo
  getLowStockAlerts: async () => {
    const response = await axiosClient.get('/inventory/items/alerts/low-stock');
    return response.data;
  },

  // Obtener ítem de inventario por ID
  getInventoryItemById: async (itemId) => {
    const response = await axiosClient.get(`/inventory/items/${itemId}`);
    return response.data;
  },

  // Crear nuevo ítem de inventario
  createInventoryItem: async (itemData) => {
    const response = await axiosClient.post('/inventory/items', itemData);
    return response.data;
  },

  // Actualizar ítem de inventario (metadatos, NO stock)
  updateInventoryItem: async (itemId, itemData) => {
    const response = await axiosClient.put(`/inventory/items/${itemId}`, itemData);
    return response.data;
  },

  // Ajustar stock manualmente
  adjustStock: async (itemId, adjustmentData) => {
    const response = await axiosClient.post(`/inventory/items/${itemId}/adjust`, adjustmentData);
    return response.data;
  },

  // Desactivar ítem de inventario (soft delete)
  deactivateInventoryItem: async (itemId) => {
    const response = await axiosClient.delete(`/inventory/items/${itemId}`);
    return response.data;
  },
};

export default inventoryService;
