/**
 * Custom hooks para gestión de Modificadores usando React Query
 * Proporciona funcionalidades CRUD y asignación a productos con caché automático
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import modifiersService from '../../services/modifiers/modifiersService';

/**
 * Hook para obtener todos los modificadores de un grupo
 * @param {number} groupId - ID del grupo
 * @param {boolean} activeOnly - Si true, solo devuelve modificadores activos
 * @returns {Object} Modificadores, estado de carga, errores y funciones de mutación
 */
export const useModifiers = (groupId, activeOnly = false) => {
  const queryClient = useQueryClient();

  // Query para obtener modificadores de un grupo
  const {
    data: modifiers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['modifiers', groupId, activeOnly],
    queryFn: () => modifiersService.getModifiersByGroup(groupId, activeOnly),
    enabled: !!groupId, // Solo ejecutar si hay groupId
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para crear modificador
  const createModifierMutation = useMutation({
    mutationFn: modifiersService.createModifier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['modifiers'] });
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] }); // Para actualizar el conteo
      toast.success(`Modificador "${data.name}" creado exitosamente`);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al crear el modificador';
      toast.error(message);
    },
  });

  // Mutation para actualizar modificador
  const updateModifierMutation = useMutation({
    mutationFn: ({ modifierId, modifierData }) =>
      modifiersService.updateModifier(modifierId, modifierData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['modifiers'] });
      queryClient.invalidateQueries({ queryKey: ['modifier', data.id] });
      toast.success(`Modificador "${data.name}" actualizado exitosamente`);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al actualizar el modificador';
      toast.error(message);
    },
  });

  return {
    modifiers,
    isLoading,
    error,
    refetch,
    createModifier: createModifierMutation.mutate,
    isCreatingModifier: createModifierMutation.isPending,
    updateModifier: updateModifierMutation.mutate,
    isUpdatingModifier: updateModifierMutation.isPending,
  };
};

/**
 * Hook para obtener un modificador específico por ID con todos sus ítems
 * @param {number} modifierId - ID del modificador
 * @returns {Object} Modificador, estado de carga y errores
 */
export const useModifier = (modifierId) => {
  const { data: modifier, isLoading, error } = useQuery({
    queryKey: ['modifier', modifierId],
    queryFn: () => modifiersService.getModifierById(modifierId),
    enabled: !!modifierId, // Solo ejecutar si hay modifierId
    staleTime: 5 * 60 * 1000,
  });

  return {
    modifier,
    isLoading,
    error,
  };
};

/**
 * Hook para gestionar modificadores asignados a un producto
 * @param {number} productId - ID del producto
 * @returns {Object} Modificadores del producto, estado y funciones de mutación
 */
export const useProductModifiers = (productId) => {
  const queryClient = useQueryClient();

  // Query para obtener modificadores asignados a un producto
  const {
    data: productModifiers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product-modifiers', productId],
    queryFn: () => modifiersService.getProductModifiers(productId),
    enabled: !!productId, // Solo ejecutar si hay productId
    staleTime: 5 * 60 * 1000,
  });

  // Mutation para asignar modificador a producto
  const assignModifierMutation = useMutation({
    mutationFn: ({ productId, modifierId }) =>
      modifiersService.assignModifierToProduct(productId, modifierId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-modifiers', data.product_id] });
      toast.success('Modificador asignado exitosamente al producto');
    },
    onError: (error) => {
      const message =
        error.response?.data?.detail ||
        'Error al asignar el modificador. Verifica que todos los ítems del modificador existan en los ingredientes del producto.';
      toast.error(message);
    },
  });

  // Mutation para desasignar modificador de producto
  const removeModifierMutation = useMutation({
    mutationFn: ({ productId, modifierId }) =>
      modifiersService.removeModifierFromProduct(productId, modifierId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-modifiers', variables.productId] });
      toast.success('Modificador desasignado exitosamente del producto');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al desasignar el modificador';
      toast.error(message);
    },
  });

  return {
    productModifiers,
    isLoading,
    error,
    refetch,
    assignModifier: assignModifierMutation.mutate,
    isAssigningModifier: assignModifierMutation.isPending,
    removeModifier: removeModifierMutation.mutate,
    isRemovingModifier: removeModifierMutation.isPending,
  };
};
