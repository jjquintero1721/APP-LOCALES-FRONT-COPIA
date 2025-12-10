import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import suppliersService from '../../services/suppliers/suppliersService';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';

export const useSuppliers = (skip = 0, limit = 100, activeOnly = false) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Get all suppliers
  const {
    data: suppliers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['suppliers', skip, limit, activeOnly],
    queryFn: () => suppliersService.getSuppliers(skip, limit, activeOnly),
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar proveedores';
      toast.error(errorMessage);
    },
  });

  // Create supplier mutation
  const createSupplierMutation = useMutation({
    mutationFn: suppliersService.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Proveedor creado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al crear proveedor';
      toast.error(errorMessage);
    },
  });

  // Update supplier mutation
  const updateSupplierMutation = useMutation({
    mutationFn: ({ supplierId, supplierData }) =>
      suppliersService.updateSupplier(supplierId, supplierData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Proveedor actualizado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al actualizar proveedor';
      toast.error(errorMessage);
    },
  });

  // Deactivate supplier mutation
  const deactivateSupplierMutation = useMutation({
    mutationFn: suppliersService.deactivateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Proveedor desactivado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al desactivar proveedor';
      toast.error(errorMessage);
    },
  });

  // Delete supplier permanently mutation (only OWNER)
  const deleteSupplierPermanentlyMutation = useMutation({
    mutationFn: suppliersService.deleteSupplierPermanently,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Proveedor eliminado permanentemente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al eliminar proveedor';
      toast.error(errorMessage);
    },
  });

  return {
    suppliers,
    isLoading,
    error,
    refetch,
    createSupplier: createSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    deactivateSupplier: deactivateSupplierMutation.mutate,
    deleteSupplierPermanently: deleteSupplierPermanentlyMutation.mutate,
    isCreating: createSupplierMutation.isPending,
    isUpdating: updateSupplierMutation.isPending,
    isDeactivating: deactivateSupplierMutation.isPending,
    isDeleting: deleteSupplierPermanentlyMutation.isPending,
  };
};

export const useSupplier = (supplierId) => {
  const {
    data: supplier,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: () => suppliersService.getSupplierById(supplierId),
    enabled: !!supplierId,
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar proveedor';
      toast.error(errorMessage);
    },
  });

  return { supplier, isLoading, error };
};
