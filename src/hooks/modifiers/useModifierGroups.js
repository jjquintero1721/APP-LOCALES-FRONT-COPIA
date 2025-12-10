/**
 * Custom hooks para gestión de Grupos de Modificadores usando React Query
 * Proporciona funcionalidades CRUD con caché automático e invalidación
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import modifiersService from '../../services/modifiers/modifiersService';

/**
 * Hook para obtener todos los grupos de modificadores con paginación
 * @param {number} skip - Número de registros a omitir
 * @param {number} limit - Límite de registros
 * @param {boolean} activeOnly - Si true, solo devuelve grupos activos
 * @returns {Object} Grupos, estado de carga, errores y funciones de mutación
 */
export const useModifierGroups = (skip = 0, limit = 100, activeOnly = false) => {
  const queryClient = useQueryClient();

  // Query para obtener grupos
  const {
    data: modifierGroups,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['modifier-groups', skip, limit, activeOnly],
    queryFn: () => modifiersService.getModifierGroups(skip, limit, activeOnly),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para crear grupo
  const createGroupMutation = useMutation({
    mutationFn: modifiersService.createModifierGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] });
      toast.success(`Grupo "${data.name}" creado exitosamente`);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al crear el grupo';
      toast.error(message);
    },
  });

  // Mutation para actualizar grupo
  const updateGroupMutation = useMutation({
    mutationFn: ({ groupId, groupData }) =>
      modifiersService.updateModifierGroup(groupId, groupData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['modifier-groups'] });
      queryClient.invalidateQueries({ queryKey: ['modifier-group', data.id] });
      toast.success(`Grupo "${data.name}" actualizado exitosamente`);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al actualizar el grupo';
      toast.error(message);
    },
  });

  return {
    modifierGroups,
    isLoading,
    error,
    refetch,
    createGroup: createGroupMutation.mutate,
    isCreatingGroup: createGroupMutation.isPending,
    updateGroup: updateGroupMutation.mutate,
    isUpdatingGroup: updateGroupMutation.isPending,
  };
};

/**
 * Hook para obtener un grupo de modificadores específico por ID
 * @param {number} groupId - ID del grupo
 * @returns {Object} Grupo, estado de carga y errores
 */
export const useModifierGroup = (groupId) => {
  const { data: modifierGroup, isLoading, error } = useQuery({
    queryKey: ['modifier-group', groupId],
    queryFn: () => modifiersService.getModifierGroupById(groupId),
    enabled: !!groupId, // Solo ejecutar si hay groupId
    staleTime: 5 * 60 * 1000,
  });

  return {
    modifierGroup,
    isLoading,
    error,
  };
};
