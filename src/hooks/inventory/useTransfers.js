import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import transfersService from '../../services/inventory/transfersService';
import  useAuthStore  from '../../store/authStore';

/**
 * Custom hook for managing inventory transfers
 * @param {Object} filters - Optional filters
 * @param {string} filters.status - Filter by status
 * @param {string} filters.direction - Filter by direction
 * @returns {Object} Transfers data and mutation functions
 */
export const useTransfers = (filters = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // OWNER and ADMIN can manage transfers
  const canManage = user?.role === 'owner' || user?.role === 'admin';

  // Query: Get all transfers
  const {
    data: transfers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transfers', filters],
    queryFn: () => transfersService.getTransfers(filters),
  });

  // Mutation: Create transfer
  const createTransferMutation = useMutation({
    mutationFn: transfersService.createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] }); // Refresh inventory
      toast.success('Traslado creado exitosamente');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al crear el traslado';
      toast.error(message);
    },
  });

  // Mutation: Accept transfer
  const acceptTransferMutation = useMutation({
    mutationFn: transfersService.acceptTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] }); // Refresh inventory
      toast.success('Traslado aceptado exitosamente. Inventario actualizado.');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al aceptar el traslado';
      toast.error(message);
    },
  });

  // Mutation: Reject transfer
  const rejectTransferMutation = useMutation({
    mutationFn: transfersService.rejectTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Traslado rechazado');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al rechazar el traslado';
      toast.error(message);
    },
  });

  // Mutation: Cancel transfer
  const cancelTransferMutation = useMutation({
    mutationFn: transfersService.cancelTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Traslado cancelado');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al cancelar el traslado';
      toast.error(message);
    },
  });

  return {
    // Data
    transfers: transfers || [],

    // Loading states
    isLoading,

    // Errors
    error,

    // Mutations
    createTransfer: createTransferMutation.mutate,
    isCreatingTransfer: createTransferMutation.isPending,

    acceptTransfer: acceptTransferMutation.mutate,
    isAcceptingTransfer: acceptTransferMutation.isPending,

    rejectTransfer: rejectTransferMutation.mutate,
    isRejectingTransfer: rejectTransferMutation.isPending,

    cancelTransfer: cancelTransferMutation.mutate,
    isCancellingTransfer: cancelTransferMutation.isPending,

    // Refetch
    refetch,

    // Permissions
    canManage,
  };
};

/**
 * Custom hook for getting a single transfer by ID
 * @param {number} transferId - Transfer ID
 * @param {boolean} enabled - Whether to fetch the transfer
 * @returns {Object} Transfer data
 */
export const useTransfer = (transferId, enabled = true) => {
  const {
    data: transfer,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transfer', transferId],
    queryFn: () => transfersService.getTransferById(transferId),
    enabled: enabled && !!transferId,
  });

  return {
    transfer,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Custom hook for getting outgoing transfers
 * @param {string} status - Optional status filter
 * @returns {Object} Outgoing transfers data
 */
export const useOutgoingTransfers = (status = null) => {
  const {
    data: outgoingTransfers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transfers', 'outgoing', status],
    queryFn: () => transfersService.getOutgoingTransfers(status),
  });

  return {
    outgoingTransfers: outgoingTransfers || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Custom hook for getting incoming transfers
 * @param {string} status - Optional status filter
 * @returns {Object} Incoming transfers data
 */
export const useIncomingTransfers = (status = null) => {
  const {
    data: incomingTransfers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transfers', 'incoming', status],
    queryFn: () => transfersService.getIncomingTransfers(status),
  });

  return {
    incomingTransfers: incomingTransfers || [],
    isLoading,
    error,
    refetch,
  };
};
