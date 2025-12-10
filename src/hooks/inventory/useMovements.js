import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import movementsService from '../../services/inventory/movementsService';
import { toast } from 'react-toastify';

export const useMovements = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get all movements with filters
  const {
    data: movements,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['movements', filters],
    queryFn: () => movementsService.getMovements(filters),
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar movimientos';
      toast.error(errorMessage);
    },
  });

  // Revert movement mutation (only OWNER)
  const revertMovementMutation = useMutation({
    mutationFn: ({ movementId, reason }) =>
      movementsService.revertMovement(movementId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['movements-by-item'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
      toast.success('Movimiento revertido exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al revertir movimiento';
      toast.error(errorMessage);
    },
  });

  return {
    movements,
    isLoading,
    error,
    refetch,
    // Mutation object (for components using mutateAsync)
    revertMovementMutation,
    // Shorthand function (for components using direct call)
    revertMovement: revertMovementMutation.mutate,
    isReverting: revertMovementMutation.isPending,
  };
};

export const useMovementsByItem = (itemId, skip = 0, limit = 50) => {
  const {
    data: movements,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['movements-by-item', itemId, skip, limit],
    queryFn: () => movementsService.getMovementsByItem(itemId, skip, limit),
    enabled: !!itemId,
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar historial de movimientos';
      toast.error(errorMessage);
    },
  });

  return { movements, isLoading, error, refetch };
};

export const useMovement = (movementId) => {
  const {
    data: movement,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['movement', movementId],
    queryFn: () => movementsService.getMovementById(movementId),
    enabled: !!movementId,
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar movimiento';
      toast.error(errorMessage);
    },
  });

  return { movement, isLoading, error };
};
