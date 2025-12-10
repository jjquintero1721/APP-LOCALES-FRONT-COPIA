/**
 * Hook personalizado para gestión de Productos/Recetas
 * Utiliza React Query para manejar el estado del servidor
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productsService from '../../services/products/productsService';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';

/**
 * Hook principal para productos con queries y mutations
 * @param {number} skip - Registros a omitir
 * @param {number} limit - Límite de registros
 * @param {boolean} activeOnly - Solo productos activos
 * @param {string|null} category - Filtrar por categoría
 * @returns {Object} Estado y funciones para productos
 */
export const useProducts = (skip = 0, limit = 100, activeOnly = false, category = null) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Query para obtener lista de productos
  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products', skip, limit, activeOnly, category],
    queryFn: () => productsService.getProducts(skip, limit, activeOnly, category),
    staleTime: 30000, // 30 segundos
  });

  // Query para obtener categorías
  const {
    data: categories,
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => productsService.getCategories(),
    staleTime: 300000, // 5 minutos
  });

  // Mutation para crear producto
  const createProductMutation = useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      toast.success('Producto creado exitosamente');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al crear el producto';
      toast.error(message);
    }
  });

  // Mutation para actualizar producto
  const updateProductMutation = useMutation({
    mutationFn: ({ productId, data }) => productsService.updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al actualizar el producto';
      toast.error(message);
    }
  });

  // Mutation para actualizar ingredientes
  const updateIngredientsMutation = useMutation({
    mutationFn: ({ productId, ingredients }) =>
      productsService.updateIngredients(productId, ingredients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ingredientes actualizados exitosamente');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al actualizar ingredientes';
      toast.error(message);
    }
  });

  // Mutation para desactivar producto
  const deactivateProductMutation = useMutation({
    mutationFn: productsService.deactivateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto desactivado exitosamente');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al desactivar el producto';
      toast.error(message);
    }
  });

  // Mutation para reactivar producto
  const activateProductMutation = useMutation({
    mutationFn: productsService.activateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto reactivado exitosamente');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Error al reactivar el producto';
      toast.error(message);
    }
  });

  // Verificar si el usuario puede gestionar productos
  const canManage = user?.role === 'owner' || user?.role === 'admin' || user?.role === 'cook';

  return {
    products,
    categories,
    isLoading,
    isLoadingCategories,
    error,
    refetch,
    canManage,
    // Mutation objects (for components using mutateAsync)
    createProductMutation,
    updateProductMutation,
    updateIngredientsMutation,
    deactivateProductMutation,
    activateProductMutation,
    // Shorthand functions (for components using direct call)
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    updateIngredients: updateIngredientsMutation.mutate,
    deactivateProduct: deactivateProductMutation.mutate,
    activateProduct: activateProductMutation.mutate,
    // Loading states
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isUpdatingIngredients: updateIngredientsMutation.isPending,
    isDeactivating: deactivateProductMutation.isPending,
    isActivating: activateProductMutation.isPending,
  };
};

/**
 * Hook para obtener un producto específico por ID
 * @param {number} productId - ID del producto
 * @param {boolean} enabled - Si la query está habilitada
 * @returns {Object} Estado del producto
 */
export const useProduct = (productId, enabled = true) => {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsService.getProductById(productId),
    enabled: enabled && !!productId,
    staleTime: 30000,
  });

  return { product, isLoading, error };
};
