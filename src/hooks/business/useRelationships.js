import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import relationshipsService from '../../services/business/relationshipsService';
import  useAuthStore  from '../../store/authStore';

/**
 * Custom hook for managing business relationships
 * @returns {Object} Relationships data and mutation functions
 */
export const useRelationships = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Only OWNER can access relationships
  const canManage = user?.role === 'owner';

  // Query: Get active relationships
  const {
    data: activeRelationships,
    isLoading: isLoadingActive,
    error: activeError,
    refetch: refetchActive,
  } = useQuery({
    queryKey: ['relationships', 'active'],
    queryFn: relationshipsService.getActiveRelationships,
    enabled: canManage, // Only fetch if user is OWNER
  });

  // Query: Get pending requests
  const {
    data: pendingRequests,
    isLoading: isLoadingPending,
    error: pendingError,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ['relationships', 'pending'],
    queryFn: relationshipsService.getPendingRequests,
    enabled: canManage, // Only fetch if user is OWNER
  });

  // Query: Get available businesses
  const {
    data: availableBusinesses,
    isLoading: isLoadingBusinesses,
  } = useQuery({
    queryKey: ['businesses', 'available'],
    queryFn: relationshipsService.getAvailableBusinesses,
    enabled: canManage,
  });

  // Mutation: Create relationship request
  const createRelationshipMutation = useMutation({
    mutationFn: relationshipsService.createRelationshipRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      toast.success('Solicitud de relación enviada exitosamente');
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 'Error al enviar solicitud de relación';
      toast.error(message);
    },
  });

  // Mutation: Accept relationship
  const acceptRelationshipMutation = useMutation({
    mutationFn: relationshipsService.acceptRelationship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      toast.success('Relación aceptada exitosamente');
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 'Error al aceptar la relación';
      toast.error(message);
    },
  });

  // Mutation: Reject relationship
  const rejectRelationshipMutation = useMutation({
    mutationFn: relationshipsService.rejectRelationship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      toast.success('Relación rechazada');
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail || 'Error al rechazar la relación';
      toast.error(message);
    },
  });

  return {
    // Data
    activeRelationships: activeRelationships || [],
    pendingRequests: pendingRequests || [],
    availableBusinesses: availableBusinesses || [],

    // Loading states
    isLoadingActive,
    isLoadingPending,
    isLoadingBusinesses,

    // Errors
    activeError,
    pendingError,

    // Mutations
    createRelationship: createRelationshipMutation.mutate,
    isCreatingRelationship: createRelationshipMutation.isPending,

    acceptRelationship: acceptRelationshipMutation.mutate,
    isAcceptingRelationship: acceptRelationshipMutation.isPending,

    rejectRelationship: rejectRelationshipMutation.mutate,
    isRejectingRelationship: rejectRelationshipMutation.isPending,

    // Refetch functions
    refetchActive,
    refetchPending,

    // Permissions
    canManage,
  };
};
