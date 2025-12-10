import axiosClient from '../../utils/axiosClient';

const movementsService = {
  // Obtener todos los movimientos con filtros
  getMovements: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
    if (filters.movement_type) params.append('movement_type', filters.movement_type);

    const response = await axiosClient.get(`/inventory/movements?${params.toString()}`);
    return response.data;
  },

  // Obtener historial de movimientos de un ítem específico
  getMovementsByItem: async (itemId, skip = 0, limit = 50) => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await axiosClient.get(`/inventory/movements/item/${itemId}?${params.toString()}`);
    return response.data;
  },

  // Obtener movimiento por ID
  getMovementById: async (movementId) => {
    const response = await axiosClient.get(`/inventory/movements/${movementId}`);
    return response.data;
  },

  // Revertir movimiento (solo OWNER)
  revertMovement: async (movementId, reason) => {
    const response = await axiosClient.post(`/inventory/movements/${movementId}/revert`, {
      reason,
    });
    return response.data;
  },
};

export default movementsService;
